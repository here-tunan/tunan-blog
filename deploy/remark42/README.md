# Remark42 部署说明

当前固定版本:v1.18.0(含 delete-me token、邮件退订 token 两个安全修复,旧版本存在被冒用会话的风险)。

## 首次部署

1. 把 `deploy/remark42/` 拷到服务器任意目录,编辑 `docker-compose.yml`,填好 `SECRET` 和 `ADMIN_SHARED_ID`
2. `docker compose up -d`
3. 宿主机反代:`remark42.tunan.fun` → `127.0.0.1:8080`(记得 HTTPS)
4. 前端不用改:`ui/app/components/blog/comment.tsx` 里的 `host` / `site_id` 与本配置一致

## 备份(防止再次丢数据的关键,务必配置)

Remark42 自带每日自动备份,产出在 `./var/backup/`(默认保留最近几份)。
但服务器本身会过期,所以必须再同步一份到服务器之外(如 Cloudflare R2,免费 10GB):

```bash
# 每天凌晨 3 点,把内置备份 + 数据库 dump 都推到 R2
0 3 * * * docker exec remark42 backup && \
  rclone sync /path/to/deploy/remark42/var/backup r2:blog-backup/remark42 && \
  rclone sync /path/to/mysql-backup r2:blog-backup/mysql
```

服务器 `crontab -e` 添加上面一行(rclone 需先 `rclone config` 配置 R2 远端)。

灾难恢复:`rclone copy r2:blog-backup/remark42 ./var/backup` 后用
`docker exec remark42 restore <备份文件名>` 恢复。
