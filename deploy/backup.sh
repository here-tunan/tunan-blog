#!/bin/bash
# 每日备份: TiDB dump + Remark42 内置备份 → rclone → Cloudflare R2
# 服务器 crontab (root):  15 3 * * * /opt/deploy/backup.sh >> /var/log/tunan-backup.log 2>&1
#
# 前置: /opt/tunan-blog/db-backup.env (chmod 600, 内容如下)
#   TIDB_HOST=gateway01.xxx.prod.aws.tidbcloud.com
#   TIDB_PORT=4000
#   TIDB_USER=<prefix>.root
#   TIDB_PASS=xxx
#   TIDB_DB=tunan
set -euo pipefail

source /opt/tunan-blog/db-backup.env

R2_REMOTE="r2:blog-backup"
KEEP_DAYS=30
WORK=/var/backups/tunan
TS=$(date +%F)
mkdir -p "$WORK"

echo "[$(date '+%F %T')] mysqldump ${TIDB_DB} ..."
mariadb-dump -h "$TIDB_HOST" -P "$TIDB_PORT" -u "$TIDB_USER" -p"$TIDB_PASS" \
  --ssl --ssl-verify-server-cert --single-transaction --quick \
  "$TIDB_DB" | gzip > "$WORK/mysql-$TS.sql.gz"

echo "[$(date '+%F %T')] remark42 内置备份 ..."
docker exec remark42 backup

echo "[$(date '+%F %T')] 上传 R2 ..."
rclone copy "$WORK/mysql-$TS.sql.gz" "$R2_REMOTE/mysql/"
rclone copy /opt/deploy/remark42/var/backup "$R2_REMOTE/remark42/"

echo "[$(date '+%F %T')] 清理 ${KEEP_DAYS} 天前的旧备份 ..."
find "$WORK" -name "mysql-*.sql.gz" -mtime +"$KEEP_DAYS" -delete
rclone delete --min-age "${KEEP_DAYS}d" "$R2_REMOTE/mysql/"
rclone delete --min-age "${KEEP_DAYS}d" "$R2_REMOTE/remark42/"

echo "[$(date '+%F %T')] ✅ 备份完成"
