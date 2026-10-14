# deploy/ — 部署目录

博客的完整部署体系。架构与迁移决策见根目录 `MIGRATION.md`。

## 目录内容

| 文件 | 用途 | 去向 |
|---|---|---|
| `deploy.sh` | 日常部署:本地构建(Go 交叉编译 + 2×Next standalone)→ rsync 产物 → 重启服务,结尾自动做静态资源一致性校验 | 只在本地跑 |
| `.env.deploy` | 部署目标(gitignored,严禁提交):`SSH_HOST=deploy@<IP>`、`SSH_KEY=<私钥路径>` | 只在本地 |
| `server-init.sh` | 新服务器初始化(幂等):系统更新、deploy 用户、防火墙、swap、Docker/Caddy/Node/rclone | 本地发起,SSH 到 root 执行 |
| `server-root-setup.sh` | root 侧配置(幂等):systemd 单元、Caddyfile+证书、备份 cron、docker 组 | 本地发起,SSH 到 root 执行 |
| `Caddyfile` | 反向代理配置:静态 chunk 直读磁盘、/api→3002、/admin→3001、remark42 子域 | `/etc/caddy/Caddyfile` |
| `systemd/*.service` | 三个服务的单元定义(自动重启、内存上限、环境变量) | `/etc/systemd/system/` |
| `backup.sh` | 每日备份:TiDB dump + Remark42 内置备份 → rclone → Cloudflare R2 | `/opt/deploy/backup.sh` |
| `remark42/` | 评论系统 Docker Compose(v1.18.0,数据落 `./var`) | `/opt/deploy/remark42/` |

## 日常部署

```bash
bash deploy/deploy.sh
```

本地构建 → 上传 → 重启 → 校验,一条命令。**部署的是本地工作区当前状态**,所以先 commit 再部署,保证线上 = 仓库。部署脚本结尾会校验 HTML 引用的静态资源全部可访问,任何 404 都会让部署失败。

## 首次部署(新服务器从零到可用)

1. `bash deploy/server-init.sh root@<IP>` —— 初始化系统
2. 本地构建 `deploy/.env.deploy`(参照本目录 deploy.sh 头部注释)
3. `bash deploy/server-root-setup.sh root@<IP>` —— 装 systemd 单元(可重复跑,有 Caddyfile/证书/backup.sh 时一并安装)
4. 服务器上创建 `/opt/tunan-blog/env/prod.yaml`(模板:`env/prod.yaml.example`)+ `/opt/tunan-ui/.env.local`
5. 服务器上 `cd /opt/deploy/remark42 && docker compose up -d`
6. `bash deploy/deploy.sh` —— 推代码
7. Cloudflare:DNS 三条记录全橙云,SSL 模式 Full (strict),/api 与 remark42 域名走 Cache Rule bypass

## 配置与密钥分布(原则:代码入库,密钥永不入库)

| 内容 | 位置 | 说明 |
|---|---|---|
| TiDB 密码、JWT secret、RSS apikey | 服务器 `/opt/tunan-blog/env/prod.yaml`(600) | 模板见 `env/prod.yaml.example` |
| GitHub Token | 服务器 `/opt/tunan-ui/.env.local`(600) | 本地开发副本 `ui/.env.local` 同样已 gitignore |
| SSH 目标 IP | 本地 `deploy/.env.deploy`(600) | |
| Remark42 SECRET | 服务器 `/opt/deploy/remark42/docker-compose.yml` | `openssl rand -hex 32` |
| R2 备份密钥 | 服务器 `/opt/tunan-blog/db-backup.env`(600) | rclone 远端名叫 `r2` |

## 服务器常用命令

```bash
ssh -i ~/.ssh/tunan_vps deploy@<IP>
systemctl is-active tunan-blog tunan-ui tunan-admin   # 状态
sudo systemctl restart tunan-blog tunan-ui tunan-admin # 重启(deploy 账号唯一免密 sudo)
sudo journalctl -u tunan-ui -n 100 --no-pager          # 看日志
docker compose -f /opt/deploy/remark42/docker-compose.yml ps  # 评论系统状态
```

## 已踩过的坑(改代码前先看)

- **Next standalone 不看请求 Host 头**,重定向 URL 用 `HOSTNAME/PORT` 环境变量拼——所以 Caddy 传 `X-Forwarded-Host`,中间件优先读它;改语言跳转逻辑时别破坏这点
- **Next standalone 14.1.4 服务不了路径带 `[动态段]` 的静态 chunk**(404),`/_next/static/*` 由 Caddy 直接读盘解决,别删 Caddyfile 里那个 handle 块
- **服务端渲染的 API 地址**来自 `API_URL_INTERNAL`(systemd EnvironmentFile 注入,指向 127.0.0.1:3002),浏览器端走公网域名——改 `lib/config.ts` 时保持这个双轨
- **端口只听 127.0.0.1**,公网访问一律经 Caddy;Docker 发布端口会绕过 ufw,别把 Remark42 绑到 0.0.0.0
