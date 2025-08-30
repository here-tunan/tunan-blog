package infrastructure

import (
	"fmt"
	"log"
	"time"
	"tunan-blog/env"

	_ "github.com/go-sql-driver/mysql"
	_ "github.com/mattn/go-sqlite3"
	"xorm.io/xorm"
	"xorm.io/xorm/names"
)

var DB *xorm.Engine

func init() {
	initDatabase()
}

// initDatabase 根据配置初始化数据库连接
func initDatabase() {
	if env.Prop == nil {
		log.Fatal("Configuration not loaded")
		return
	}

	dbType := env.Prop.DatabaseType
	if dbType == "" {
		dbType = "sqlite3" // 默认使用sqlite3
	}

	var err error

	switch dbType {
	case "sqlite3":
		log.Println("Initializing SQLite database...")
		DB, err = xorm.NewEngine("sqlite3", env.Prop.Sqlite3.File)
		if err != nil {
			log.Fatalf("Failed to connect to SQLite: %v", err)
		}

		// 设置驼峰转换
		DB.SetMapper(names.GonicMapper{})

		// 时区
		DB.TZLocation, _ = time.LoadLocation("Asia/Shanghai")

		err = DB.Ping()
		if err != nil {
			log.Fatalf("Failed to ping SQLite: %v", err)
		}

		log.Printf("SQLite database connected successfully: %s", env.Prop.Sqlite3.File)

	case "mysql":
		log.Println("Initializing MySQL database...")
		dataSourName := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8mb4",
			env.Prop.Mysql.Username, env.Prop.Mysql.Password, env.Prop.Mysql.Host, env.Prop.Mysql.Port, env.Prop.Mysql.Database)

		DB, err = xorm.NewEngine("mysql", dataSourName)
		if err != nil {
			log.Fatalf("Failed to connect to MySQL: %v", err)
		}

		// 设置驼峰转换
		DB.SetMapper(names.GonicMapper{})

		// 时区
		DB.TZLocation, _ = time.LoadLocation("Asia/Shanghai")

		err = DB.Ping()
		if err != nil {
			log.Fatalf("Failed to ping MySQL: %v", err)
		}

		log.Printf("MySQL database connected successfully: %s:%d/%s", env.Prop.Mysql.Host, env.Prop.Mysql.Port, env.Prop.Mysql.Database)

	default:
		log.Fatalf("Unsupported database type: %s", dbType)
	}

	if DB == nil {
		log.Fatal("No database connection established")
	}
}

// GetDB 获取当前配置的数据库连接
func GetDB() *xorm.Engine {
	if DB == nil {
		log.Fatal("Database not initialized")
	}
	return DB
}

// NewSession 创建新的数据库会话
func NewSession() *xorm.Session {
	return GetDB().NewSession()
}
