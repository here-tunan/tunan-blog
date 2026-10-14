#!/bin/bash
# 每日备份: TiDB dump + Remark42 内置备份 + 服务器配置 → rclone → Cloudflare R2
#
# 运行身份: root(root 的 crontab;~root/.config/rclone/rclone.conf 里必须有名为 r2 的远端)
# crontab:  15 3 * * * /opt/deploy/backup.sh >> /var/log/tunan-backup.log 2>&1
#
# 前置:
#   1. /opt/tunan-blog/db-backup.env (chmod 600),内容:
#        TIDB_HOST=gateway01.xxx.prod.aws.tidbcloud.com
#        TIDB_PORT=4000
#        TIDB_USER=<prefix>.root
#        TIDB_PASS=xxx
#        TIDB_DB=tunan
#   2. rclone 已配置远端 r2(S3 协议,指向 R2 的 <accountid>.r2.cloudflarestorage.com)
set -euo pipefail

ENV_FILE=/opt/tunan-blog/db-backup.env
if [ ! -f "$ENV_FILE" ]; then
  echo "❌ 缺少 $ENV_FILE —— 参考本文件头部注释创建并 chmod 600,今日备份中止"
  exit 1
fi
source "$ENV_FILE"

R2_REMOTE="r2:blog-backup"
KEEP_DAYS=30
WORK=/var/backups/tunan
TS=$(date +%F)
mkdir -p "$WORK"

echo "[$(date '+%F %T')] mysqldump ${TIDB_DB} ..."
# pipefail + set -e:dump 失败会直接中止,绝不会上传空/半截压缩包
mariadb-dump -h "$TIDB_HOST" -P "$TIDB_PORT" -u "$TIDB_USER" -p"$TIDB_PASS" \
  --ssl --ssl-verify-server-cert --single-transaction --quick \
  "$TIDB_DB" | gzip > "$WORK/mysql-$TS.sql.gz"
ls -lh "$WORK/mysql-$TS.sql.gz"

echo "[$(date '+%F %T')] remark42 内置备份 ..."
# 次要资产:评论容器挂了不应阻断数据库备份的上传
if ! docker exec remark42 backup; then
  echo "⚠️  remark42 容器备份失败(容器没在跑?),跳过,数据库备份不受影响"
fi

echo "[$(date '+%F %T')] 打包服务器配置(prod.yaml / remark42 compose / env.local)..."
# 这些只存在于服务器上,丢了就要重新生成密钥;R2 桶是私有的,密钥入桶可接受
tar -czf "$WORK/config-$TS.tar.gz" \
  --absolute-names \
  /opt/tunan-blog/env/prod.yaml \
  /opt/tunan-blog/db-backup.env \
  /opt/tunan-ui/.env.local \
  /opt/tunan-admin/.env.local \
  /opt/deploy/remark42/docker-compose.yml 2>/dev/null || \
  echo "⚠️  部分配置文件缺失,已打包存在的部分"

echo "[$(date '+%F %T')] 上传 R2 ..."
rclone copy "$WORK/mysql-$TS.sql.gz" "$R2_REMOTE/mysql/"
rclone copy "$WORK/config-$TS.tar.gz" "$R2_REMOTE/config/"
rclone copy /opt/deploy/remark42/var/backup "$R2_REMOTE/remark42/"

echo "[$(date '+%F %T')] 清理 ${KEEP_DAYS} 天前的旧备份 ..."
find "$WORK" -name "mysql-*.sql.gz" -mtime +"$KEEP_DAYS" -delete
find "$WORK" -name "config-*.tar.gz" -mtime +"$KEEP_DAYS" -delete
rclone delete --min-age "${KEEP_DAYS}d" "$R2_REMOTE/mysql/"
rclone delete --min-age "${KEEP_DAYS}d" "$R2_REMOTE/config/"
rclone delete --min-age "${KEEP_DAYS}d" "$R2_REMOTE/remark42/"

echo "[$(date '+%F %T')] ✅ 备份完成"
