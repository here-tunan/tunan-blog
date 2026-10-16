---
name: deploy
description: tunan-blog 的部署、重启、备份与灾难恢复。当用户要求部署/重启/看日志/备份/恢复数据/换服务器时使用。
---

# tunan-blog 部署与恢复操作卡

本项目是**无状态 VPS + 托管数据**架构:代码在本地构建后 rsync 到服务器,数据在 TiDB Cloud 与 Cloudflare R2。**所有命令默认在本地 Mac 执行**,除非明确标注"服务器"。

## 铁律(先读)

1. **代码入库,密钥永不入库。** IP、密码、token 只出现在 gitignored 文件(`env/prod.yaml`、`deploy/.env.deploy`、各 `.env.local`、`~/tunan-blog-configs/`)。提交前必查 `git diff --cached`。绝不在 skill/README/commit 里写具体 IP、密码、secret。
2. **服务器上不构建。** 一切 `go build` / `npm ci` / `npm run build` 在本地跑,只 rsync 产物。1C2G 的机器跑 npm build 会 OOM。
3. **恢复前先手动备份一次**(`bash /opt/deploy/backup.sh`),哪怕当前状态是坏的。给自己留退路。
4. 用户说"只管改代码,不需要验证"时,不要替他跑构建/部署验证;但 type-check 这类本地静态检查仍可做。

## 命令速查

| 目的 | 命令(本地) |
|---|---|
| 部署全部 | `bash deploy/deploy.sh` |
| 只部署前端/后端/后台 | `bash deploy/deploy.sh ui` \| `blog` \| `admin` |
| 不重新构建,只重启服务 | `bash deploy/restart.sh restart ui` |
| 看三服务状态 | `bash deploy/restart.sh status` |
| 看某服务日志(最近 100 行) | `bash deploy/restart.sh logs blog` |
| 手动立即备份(服务器) | `bash /opt/deploy/backup.sh` |
| 每月恢复演练(服务器) | `bash /opt/deploy/restore-drill.sh` |

目标服务器与 SSH 私钥读自 `deploy/.env.deploy`(gitignored):`SSH_HOST`、`SSH_KEY`。

## 灾难恢复(照抄手册,别现编)

**先打开 `deploy/backup/README.md` 对应场景,逐字照抄命令。** 不要凭记忆敲恢复命令——里面的参数(SSL、时区候选名、临时库验证)都是踩过坑才定的。

- 文章/数据误删 → 场景 1(先灌临时库 `tunan_verify` 对行数,再覆盖正式库)
- 评论丢失 → 场景 2(remark42 restore,备三个时区的文件名)
- 配置丢了 → 场景 3(从 R2 配置包解开,`chmod 600` 后重启)
- 整台服务器没了 → 场景 4(约 30 分钟重建)

## 动手前检查的已知坑(改代码/配置前先过一遍)

- **Next standalone 不看请求 Host 头**,重定向用 `HOSTNAME/PORT` 环境变量拼。语言跳转中间件读 `x-forwarded-host`,别破坏它。
- **Next 14.1.4 服务不了路径带 `[locale]` 的静态 chunk**(404)。`/_next/static/*` 由 Caddy 直接读盘解决,删了 Caddyfile 那个 handle 块会全挂。
- **服务端渲染的 API 地址**走 `API_URL_INTERNAL`(指向 127.0.0.1:3002),浏览器端走公网域名。`lib/config.ts` 保持这个双轨。
- **端口只听 127.0.0.1**,公网一律经 Caddy。Docker 发布端口会绕过 ufw,别把 remark42 绑到 0.0.0.0。
- **mariadb-dump 不能加 `--single-transaction`**:TiDB 不兼容,报 SAVEPOINT 1305。
- **SQLite→MySQL 迁移**:xorm Insert 会覆盖 `created/updated` 时间列;go-sqlite3 Scan 把 datetime 转 RFC3339、boolean 转 "false",查询必须 `CAST(col AS TEXT)`。(迁移工具 `cmd/migrate-sqlite/` 已处理。)
- **remark42 restore** 按容器自己的日历找"今天"的备份文件,容器 TZ 是 America/Chicago(比上海晚一天),所以要备三个时区的候选文件名。
- **systemd sudoers 是精确匹配白名单**:`deploy` 账号只能 restart/status 指定的几个服务,别加新命令形式。
- **rclone 远端只配在 root 下**(故意的),deploy 账号碰不到备份——这是设计,不是漏配。
- **Cloudflare Web Analytics 用手动埋点模式**(`ui/app/layout.tsx` 里的 beacon 脚本),不要切回自动注入——自动注入会劫持 webpack publicPath,导致图标 404。

## 架构速记

访客 → Cloudflare(橙云) → Caddy(127.0.0.1)
- `/` → tunan-ui :3000(Next.js 前台)
- `/api/*` → tunan-blog :3002(Go Fiber)
- `/admin*` → tunan-admin :3001(Next.js 后台)
- `remark42.tunan.fun` → Docker remark42 :8080
数据: TiDB Cloud Serverless(强制 TLS :4000)。备份: 每日 3:15 dump + remark42 导出 + 配置包 → rclone → R2。
