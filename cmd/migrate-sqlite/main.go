// migrate-sqlite 一次性迁移工具: 把本地开发 SQLite 库的数据全量搬进 MySQL/TiDB。
//
// 刻意不使用 xorm: xorm v1.3.9 的 Insert 会把 created/updated 标签列无条件覆盖为
// now()(零值检查在 session_insert.go 中被注释),用 ORM 写入会毁掉全部文章时间。
// 这里两端都走原生 database/sql,列名动态读取,值逐行拷贝,NULL 安全。
//
// 用法:
//
//	go run ./cmd/migrate-sqlite \
//	  -sqlite /Users/yaodao/devTools/sqlite/sqlite.db \
//	  -dsn 'user:pass@tcp(gateway01.xxx.prod.aws.tidbcloud.com:4000)/tunan?charset=utf8mb4&tls=true' \
//	  -dry-run
package main

import (
	"database/sql"
	"flag"
	"fmt"
	"log"
	"os"
	"strings"

	_ "github.com/go-sql-driver/mysql"
	_ "github.com/mattn/go-sqlite3"
	"gopkg.in/yaml.v3"
)

// config 只取 yaml 里的 mysql 段,格式与 env/prod.yaml 完全一致。
// 不直接 import tunan-blog/env:那个包的 init() 会强制读取 dev.yaml。
type config struct {
	Mysql struct {
		Host     string `yaml:"host"`
		Port     int    `yaml:"port"`
		Username string `yaml:"username"`
		Password string `yaml:"password"`
		Database string `yaml:"database"`
		TLS      bool   `yaml:"tls"`
	} `yaml:"mysql"`
}

// dsnFromConfig 把 yaml 配置拼成 go-sql-driver DSN,与 db.go 的拼法保持一致
func dsnFromConfig(path string) (string, error) {
	raw, err := os.ReadFile(path)
	if err != nil {
		return "", err
	}
	var c config
	if err := yaml.Unmarshal(raw, &c); err != nil {
		return "", err
	}
	m := c.Mysql
	if m.Host == "" || m.Database == "" {
		return "", fmt.Errorf("配置缺少 mysql.host 或 mysql.database")
	}
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8mb4",
		m.Username, m.Password, m.Host, m.Port, m.Database)
	if m.TLS {
		dsn += "&tls=true"
	}
	return dsn, nil
}

// 按外键依赖顺序排列,与 schema_tidb.sql 建表顺序一致
var tableOrder = []string{
	"article",
	"article_translation",
	"article_tag",
	"article_tag_relationship",
	"book",
	"page_views",
	"project",
	"device_app",
	"friend_link",
}

const batchSize = 100

func main() {
	sqlitePath := flag.String("sqlite", "", "本地 SQLite 库路径")
	dsn := flag.String("dsn", "", "目标 MySQL DSN(TiDB 必须带 &tls=true);与 -config 二选一")
	yamlConfig := flag.String("config", "", "直接读 env/prod.yaml 格式的配置文件(推荐,密码不进命令行)")
	dryRun := flag.Bool("dry-run", false, "只对比行数,不写入")
	only := flag.String("only", "", "只迁移指定表(逗号分隔),用于失败后重试")
	flag.Parse()

	if *yamlConfig != "" {
		resolved, err := dsnFromConfig(*yamlConfig)
		if err != nil {
			log.Fatalf("读取配置 %s: %v", *yamlConfig, err)
		}
		*dsn = resolved
	}
	if *sqlitePath == "" || *dsn == "" {
		flag.Usage()
		log.Fatal("-sqlite 和 (-dsn 或 -config) 必填")
	}

	tables := tableOrder
	if *only != "" {
		tables = strings.Split(*only, ",")
	}

	src, err := sql.Open("sqlite3", *sqlitePath)
	if err != nil {
		log.Fatalf("打不开 SQLite: %v", err)
	}
	src.SetMaxOpenConns(1) // SQLite 单写者
	defer src.Close()

	dst, err := sql.Open("mysql", *dsn)
	if err != nil {
		log.Fatalf("打不开 MySQL/TiDB: %v", err)
	}
	dst.SetMaxOpenConns(5)
	defer dst.Close()

	if err := src.Ping(); err != nil {
		log.Fatalf("SQLite 连不上: %v", err)
	}
	if err := dst.Ping(); err != nil {
		log.Fatalf("MySQL/TiDB 连不上(检查 DSN 与 tls=true): %v", err)
	}

	for _, t := range tables {
		if err := migrateTable(src, dst, t, *dryRun); err != nil {
			log.Fatalf("表 %s 迁移失败: %v", t, err)
		}
	}

	if !*dryRun {
		fmt.Println("\n全部完成。显式 id 插入后 AUTO_INCREMENT 会自动越过 max(id),无需处理。")
	}
}

func migrateTable(src, dst *sql.DB, table string, dryRun bool) error {
	srcCount, err := count(src, table)
	if err != nil {
		return fmt.Errorf("源库计数: %w", err)
	}
	dstCount, err := count(dst, table)
	if err != nil {
		return fmt.Errorf("目标库计数: %w", err)
	}

	if dryRun {
		fmt.Printf("%-26s 源 %5d 行 | 目标 %5d 行\n", table, srcCount, dstCount)
		return nil
	}

	switch {
	case srcCount == 0:
		fmt.Printf("%-26s 源表为空,跳过\n", table)
		return nil
	case dstCount == srcCount:
		fmt.Printf("%-26s 目标已有 %d 行,视为已完成,跳过\n", table, dstCount)
		return nil
	case dstCount > 0:
		return fmt.Errorf("目标表已有 %d 行(源 %d 行),半途状态请先手动 TRUNCATE 后用 -only %s 重试",
			dstCount, srcCount, table)
	}

	// 读源数据:显式 CAST AS TEXT。
	// 不能裸 SELECT *:go-sqlite3 驱动会在 Scan 时按列声明类型做转换
	// (datetime → RFC3339 带 T/Z,boolean → "false"/"true"),MySQL 都不认,
	// 会报 Error 1366 "Incorrect ? value: '?'"。CAST 后拿到的是存储原文。
	srcCols, err := sqliteColumns(src, table)
	if err != nil {
		return fmt.Errorf("读源表结构: %w", err)
	}
	sel := make([]string, len(srcCols))
	for i, c := range srcCols {
		sel[i] = fmt.Sprintf("CAST(%s AS TEXT) AS %s", c, c)
	}
	rows, err := src.Query(fmt.Sprintf("SELECT %s FROM %s", strings.Join(sel, ","), table))
	if err != nil {
		return fmt.Errorf("读源表: %w", err)
	}
	defer rows.Close()

	cols, err := rows.Columns()
	if err != nil {
		return err
	}
	scanArgs := make([]any, len(cols))
	for i := range scanArgs {
		scanArgs[i] = new(sql.RawBytes)
	}

	// 目标库关外键检查(本工具顺序已按依赖排,双保险)
	if _, err := dst.Exec("SET FOREIGN_KEY_CHECKS=0"); err != nil {
		return fmt.Errorf("SET FOREIGN_KEY_CHECKS: %w", err)
	}

	inserted := 0
	batch := make([][]any, 0, batchSize)

	flush := func() error {
		if len(batch) == 0 {
			return nil
		}
		if err := insertBatch(dst, table, cols, batch); err != nil {
			return err
		}
		inserted += len(batch)
		batch = batch[:0]
		return nil
	}

	for rows.Next() {
		if err := rows.Scan(scanArgs...); err != nil {
			return err
		}
		row := make([]any, len(cols))
		for i, a := range scanArgs {
			rb := a.(*sql.RawBytes)
			if rb == nil || *rb == nil {
				row[i] = nil
			} else {
				// 必须转 string:空 []byte 参数走 prepared 协议时会让 TiDB
				// 参数解析错位,报 Error 1366 "Incorrect ? value: '?'"(实测踩坑)
				row[i] = string(*rb)
			}
		}
		batch = append(batch, row)
		if len(batch) == batchSize {
			if err := flush(); err != nil {
				return err
			}
		}
	}
	if err := rows.Err(); err != nil {
		return err
	}
	if err := flush(); err != nil {
		return err
	}

	// 终验: 行数必须一致
	gotCount, err := count(dst, table)
	if err != nil {
		return err
	}
	if gotCount != srcCount {
		return fmt.Errorf("行数不一致: 源 %d,目标 %d", srcCount, gotCount)
	}
	fmt.Printf("%-26s ✓ %d 行迁移完成(%d 列)\n", table, gotCount, len(cols))
	return nil
}

// insertBatch 把一批行拼成一条多值 INSERT,放在单事务里
func insertBatch(dst *sql.DB, table string, cols []string, batch [][]any) error {
	ph := "(" + strings.TrimSuffix(strings.Repeat("?,", len(cols)), ",") + ")"
	placeholders := strings.TrimSuffix(strings.Repeat(ph+",", len(batch)), ",")

	query := fmt.Sprintf("INSERT INTO %s (%s) VALUES %s",
		table, strings.Join(cols, ","), placeholders)

	args := make([]any, 0, len(batch)*len(cols))
	for _, row := range batch {
		args = append(args, row...)
	}

	tx, err := dst.Begin()
	if err != nil {
		return err
	}
	if _, err := tx.Exec(query, args...); err != nil {
		tx.Rollback()
		return err
	}
	return tx.Commit()
}

func count(db *sql.DB, table string) (int, error) {
	var n int
	if err := db.QueryRow("SELECT COUNT(*) FROM " + table).Scan(&n); err != nil {
		return 0, err
	}
	return n, nil
}

// sqliteColumns 用 PRAGMA table_info 拿列名(顺序与表定义一致)
func sqliteColumns(src *sql.DB, table string) ([]string, error) {
	rows, err := src.Query("PRAGMA table_info(" + table + ")")
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var cols []string
	for rows.Next() {
		var cid int
		var name, ctype string
		var notnull int
		var dflt, pk any
		if err := rows.Scan(&cid, &name, &ctype, &notnull, &dflt, &pk); err != nil {
			return nil, err
		}
		cols = append(cols, name)
	}
	return cols, rows.Err()
}
