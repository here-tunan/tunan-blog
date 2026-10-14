# tunan-blog 迁移方案:RackNerd VPS + TiDB Cloud + Cloudflare

## Context

旧香港 VPS 过期导致 SQLite 文章库与 Remark42 评论数据全部丢失。新方案的核心原则:**服务器无状态化**——计算放最便宜的 VPS(RackNerd LA DC03, 1c/1g, ¥155/年),数据放托管服务,备份出服务器。本地开发库 `/Users/yaodao/devTools/sqlite/sqlite.db` 中存有 61 篇文章(62 条翻译)、36 本书、7 个友链、4 个项目,可全量恢复。

**目标架构**:

```
访客 → Cloudflare(免费,橙云代理+CDN,Full strict)
     → Caddy(Origin CA 证书, 自动 HTTPS)
       ├─ tunan.fun/          → Next.js standalone :3000
       ├─ tunan.fun/api/*     → Go Fiber :3002
       ├─ tunan.fun/admin*    → Next.js admin standalone :3001
       └─ remark42.tunan.fun  → Docker Remark42 v1.18 :8080
数据: TiDB Cloud Serverless 免费版(us-west-2, 离 LA ~20ms, MySQL 协议+TLS)
备份: cron 每日 mysqldump + remark42 backup → rclone → Cloudflare R2(免费 10GB)
```

## 关键决策(已定)

| 问题 | 决策 | 理由 |
|---|---|---|
| 生产 API_URL | `https://tunan.fun/api`(两个前端同) | `ViewTracker.tsx` 等是 `'use client'`,URL 进浏览器包,127.0.0.1 不可行;同源还免去 CORS 改动(现有列表已含 tunan.fun) |
| Caddy×CF TLS | CF Origin CA 证书(15年)+ Full (strict) | 免 ACME 与橙云代理的续期冲突,无需 DNS 插件;代价:主机名灰云时浏览器不认证书(可接受) |
| 迁移工具 | 新 CLI `cmd/migrate-sqlite/main.go`,两端都用原生 `database/sql` | **xorm v1.3.9 Insert 会把 `created/updated` 标签列强改为 now()**(session_insert.go:502,零值检查被注释),用 ORM 会毁掉全部文章时间 |
| TiDB collation | 新 `schema_tidb.sql` 用 `utf8mb4_general_ci` | `0900_ai_ci` 在 TiDB 可能被别名到二进制排序,静默改变中文排序语义 |
| 构建策略 | 本地 Mac 构建 + rsync 产物;Go 用 `CGO_ENABLED=0` 静态编译 | 1G 内存永不跑 npm/go build;sqlite3 驱动是空导入,CGO=0 可编译(prod 只用 mysql,不会触发 sqlite stub) |
| DSN TLS | yaml 加 `mysql.tls: true` → 追加 `&tls=true` | 显式配置优于 host 启发式 |

## Phase 0 — 用户侧准备(动手前完成)

1. **TiDB Cloud**:注册 tidbcloud.com → Serverless 集群,区域 `AWS us-west-2`,root 密码;Connect 对话框拿 host(`gateway01.<...>.prod.aws.tidbcloud.com`)、端口 4000、用户 `<prefix>.root`;建库 `tunan`。Mac 上 `mysql -h <host> -P 4000 -u <user> -p --ssl-mode=REQUIRED -e "SELECT 1"` 验证可达
2. **Cloudflare**:添加站点 tunan.fun(免费版)→ 注册商改 NS → SSL/TLS 设 **Full (strict)** → Origin Server 创建证书(`tunan.fun, *.tunan.fun`, 15年)存 `origin.pem/origin.key`。**先不建 DNS 记录**(Phase 5 才建)
3. **R2**:开通(需绑卡,10GB 内免费)→ 建 bucket `blog-backup` → API token(Object Read & Write,限定该桶)
4. **SSH keypair**:`ssh-keygen -t ed25519 -f ~/.ssh/tunan_vps`(若无)
5. **本地库备份**:`cp /Users/yaodao/devTools/sqlite/sqlite.db ~/sqlite-recovery-$(date +%F).db`(这是 5 年内容的唯一副本)
6. RackNerd 邮件里的 VPS IP + root 密码

## Phase 1 — 仓库代码改动(按序)

1. **`env/properties.go`**:Mysql 结构体加 `TLS bool \`json:"tls"\``
2. **`internal/infrastructure/db.go`**(mysql 分支):DSN 条件追加 `&tls=true`;加连接池 `SetMaxOpenConns(10)` / `SetMaxIdleConns(5)` / `SetConnMaxLifetime(5*time.Minute)`(TiDB Serverless 按 RU 计费,池要小)。**不加 parseTime**(旧 DSN 连 MySQL 8 正常,xorm 用 TZLocation 转换;若 Phase 4 出现 1970 日期再按预案加)
3. **`env/prod.yaml.example`**(新,入库)+ `.gitignore` 追加 `env/prod.yaml`(现已验证未被忽略)
4. **`schema_tidb.sql`**(新):复制 schema.sql,collation 全改 `utf8mb4_general_ci`(9 处),表顺序、FK、json 列不变
5. **`ui/next.config.mjs`** + **`ui-admin/next.config.mjs`**:加 `output: 'standalone'`
6. **`ui/lib/config.ts`** + **`ui-admin/lib/config.ts`**:生产分支 → `'https://tunan.fun/api'`
7. **`ui-admin/package.json`**:`"start": "next start -p 3001"`(修端口 bug)
8. **`cmd/migrate-sqlite/main.go`**(新):flag `-sqlite` `-dsn` `-dry-run`;按 FK 顺序硬编码 9 张表(article, article_translation, article_tag, article_tag_relationship, book, page_views, project, device_app, friend_link);显式列名 SELECT → 扫描进 `[]sql.RawBytes`(NULL 安全)→ 每表单事务分批参数化 INSERT(200/批),**显式保留 id**;打印每表源/目标行数,不一致即中止;结束后 `SELECT MAX(id)` 对比预警
9. **`deploy/deploy.sh`** 重写:本地构建(binary CGO=0 + 两个 `npm ci && npm run build`)→ rsync(standalone 树 + .next/static + public + binary + env)→ ssh `systemctl restart`。旧的服务器上构建流程废弃
10. **`deploy/` 新文件**:`server-init.sh`、`Caddyfile`、`systemd/tunan-{blog,ui,admin}.service`、`backup.sh`(内容见 Phase 2/3)

**Phase 1 验证门(Mac 本地)**:
- `CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /tmp/t ./cmd/tunan-blog` 成功(证明 CGO 假设)
- `cd ui && npm run build` 成功
- 本地用临时 yaml(`mysql.tls: true` 指 TiDB 空库)起后端,`curl 'http://127.0.0.1:3002/api/article/list?pageIndex=1&pageSize=1&languageCode=zh-CN'` 返回 200 空列表(证明 TLS DSN 全链路)

## Phase 2 — VPS 初始化(`deploy/server-init.sh`,root 执行,幂等)

1. `apt update && apt -y upgrade`
2. 装 curl git ufw fail2ban unattended-upgrades ca-certificates mariadb-client chrony
3. 建 deploy 用户 + 公钥(手动贴 pubkey),chmod 700/600
4. ufw:deny incoming,allow 22/80/443
5. **1G swap**:fallocate + mkswap + swapon + fstab;`vm.swappiness=10`
6. 时区 Asia/Shanghai(应用自己设 TZLocation,这只影响日志)
7. Docker:`curl -fsSL https://get.docker.com | sh`
8. Caddy 官方 apt 源安装;rclone 官方脚本安装
9. (手动)密钥登录验证后再 `PasswordAuthentication no`
10. (手动)`rclone config` 建 `r2:` 远端(S3 类型,endpoint `<accountid>.r2.cloudflarestorage.com`)

## Phase 3 — 服务部署

目录:`/opt/tunan-blog/`(binary+env/prod.yaml 0600)、`/opt/tunan-ui/`(standalone+.env.local 0600,含 GITHUB_TOKEN)、`/opt/tunan-admin/`、`/opt/deploy/remark42/`

**systemd**(User=deploy,Restart=always):
- `tunan-blog.service`:WorkingDirectory=/opt/tunan-blog,`GO_TUNAN_BLOG_ENV=prod`,MemoryMax=200M
- `tunan-ui.service`:PORT=3000,HOSTNAME=127.0.0.1,`EnvironmentFile=.env.local`(standalone 不打包 .env*),`node server.js`,MemoryMax=300M
- `tunan-admin.service`:同上,PORT=3001

**Caddyfile**(证书 `/etc/caddy/ssl/origin.{pem,key}` 0600):
```
tunan.fun {
    tls /etc/caddy/ssl/origin.pem /etc/caddy/ssl/origin.key
    handle /api/* { reverse_proxy 127.0.0.1:3002 }
    handle /admin* { reverse_proxy 127.0.0.1:3001 }
    handle { reverse_proxy 127.0.0.1:3000 }
}
www.tunan.fun {
    tls /etc/caddy/ssl/origin.pem /etc/caddy/ssl/origin.key
    redir https://tunan.fun{uri} permanent
}
remark42.tunan.fun {
    tls /etc/caddy/ssl/origin.pem /etc/caddy/ssl/origin.key
    reverse_proxy 127.0.0.1:8080
}
```

**Remark42**:`SECRET=$(openssl rand -hex 32)` 填入 compose → `docker compose up -d`;`ADMIN_SHARED_ID` 两步填:先留占位,首条匿名评论后从 UI 拿到 `anonymous_...` id 再更新重启

**顺序注意**:tunan-blog 必须在 Phase 4 建完表后才 start(init 时 Ping 失败会 log.Fatal)

**prod.yaml 密钥**:`openssl rand -hex 32` 生成 apikey/jwt_secret;admin_password 明文首启 → 日志打印 bcrypt → 回填重启

## Phase 4 — 建表 + 数据迁移(Mac 上执行,SQLite 在本地)

```bash
mysql -h <tidb> -P 4000 -u <user> -p --ssl-mode=REQUIRED tunan < schema_tidb.sql
go run ./cmd/migrate-sqlite -sqlite ~/devTools/sqlite/sqlite.db \
  -dsn '<user>:<pass>@tcp(<tidb>:4000)/tunan?charset=utf8mb4&tls=true' -dry-run   # 先看计数
# 去 -dry-run 正式跑:预期 61 article / 62 translation / 36 book / 7 friend_link / 4 project
mysql ... -e "SELECT id,title,published_at FROM tunan.article_translation ORDER BY id DESC LIMIT 5"  # 抽查日期
```
然后在 VPS 上 `systemctl start tunan-blog`,用 `curl --resolve tunan.fun:443:<vps-ip> -k https://tunan.fun/api/article/list?...`(CF 未切前 origin 证书需 -k)验证数据返回。

## Phase 5 — Cloudflare 切换 + 端到端验证

1. Zone Active 后建 DNS(全橙云):`A tunan.fun <ip>`、`CNAME www tunan.fun`、`A remark42.tunan.fun <ip>`;Always Use HTTPS ON
2. Cache Rules 两条 bypass:`tunan.fun + /api/*`(保护 RSS apikey/JWT 响应)、整个 `remark42.tunan.fun`
3. 验证清单(按序):
   - `curl -I https://tunan.fun/` → 200 + `cf-cache-status`;二次访问 HIT(CDN 生效)
   - www → 301 裸域;文章页日期/标签正确(卡 parseTime 风险点)
   - ISR:后台改文章 → 60s 内前台刷新生效(证明 revalidate 走公网 API 可用)
   - `https://remark42.tunan.fun/api/v1/ping` → `{"site":"tunan-remark"}`;文章页评论组件可见
   - `/admin` 加载(静态资源 `/admin/_next/*` 200)、登录、文章列表显示迁移数据、编辑保存回路
   - `/api/rss?apikey=...` 出 feed
4. **备份演练(当周必须)**:`deploy/backup.sh` cron `15 3 * * *`(root):mysqldump --ssl → gzip → rclone → R2,remark42 backup 同步,R2 保留 30 天(`rclone delete --min-age 720h`);**再做一次恢复演练**:dump 导入临时库 + remark42 restore 试还原——没恢复过的备份不算备份

## 风险与预案

1. **xorm 覆盖时间列**(已验证)→ 迁移工具全原生 SQL
2. **parseTime 缺失**:若文章日期显示 1970/0000,唯一预案是 DSN 追加 `&parseTime=true&loc=Asia%2FShanghai`,不提前加
3. **CGO_ENABLED=0 构建若意外失败** → 回退旧 musl 交叉编译路径
4. **内存**:全部服务 ~600-700M + 1G swap;永不在线上构建
5. **Origin CA 证书只被 CF 信任**:主机名保持橙云;若需灰云直连,该主机改回 ACME
6. **AUTO_INCREMENT**:显式 id 插入后 TiDB 自动越过 max(id),后台发一篇新文章验证

## 仓库清理(顺带,最后做)

- `git rm --cached tunan-blog`(17MB 旧二进制入库了)+ ignore
- `ui/docs/` 两篇未跟踪长文(CDN-GUIDE/RENDERING-GUIDE,用户的文章素材)→ 提交入库
- 旧 `restart.sh`/`stop.sh`/`status.sh` 标记废弃或删除
