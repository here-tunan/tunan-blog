#!/bin/bash
# 恢复演练(全量): 从 R2 拉取三类备份并逐一验证,全部只碰临时资源,不影响生产
#   1/3 数据库  → 灌入临时库,行数与源库逐表比对
#   2/3 配置包  → 解包确认关键文件齐全
#   3/3 Remark42 → 起一次性演练容器做真实 restore(不碰生产容器)
# 用法: 在服务器 root 会话执行  bash restore-drill.sh
set -euo pipefail

source /opt/tunan-blog/db-backup.env
R2_REMOTE="r2:blog-backup"
TEST_DB="tunan_restore_test"
DRILL=/tmp/remark42-drill
FAILED=0

mariadb_sql() {
  mariadb -h "$TIDB_HOST" -P "$TIDB_PORT" -u "$TIDB_USER" -p"$TIDB_PASS" --ssl "$@"
}

rm -rf /tmp/restore-test "$DRILL" && mkdir -p /tmp/restore-test

echo "════════ 1/3 数据库备份 ════════"
rclone copy "$R2_REMOTE/mysql/" /tmp/restore-test/
LATEST=$(ls -t /tmp/restore-test/mysql-*.sql.gz | head -1)
echo "    使用备份: $(basename "$LATEST")"
mariadb_sql -e "DROP DATABASE IF EXISTS $TEST_DB; CREATE DATABASE $TEST_DB"
gunzip < "$LATEST" | mariadb_sql "$TEST_DB"
for T in article article_translation book page_views friend_link; do
  LIVE=$(mariadb_sql -N -e "SELECT COUNT(*) FROM tunan.$T")
  RESTORED=$(mariadb_sql -N -e "SELECT COUNT(*) FROM $TEST_DB.$T")
  if [ "$LIVE" = "$RESTORED" ]; then
    echo "    ✓ $T: $RESTORED 行,与源库一致"
  else
    echo "    ❌ $T: 源库 $LIVE 行,恢复 $RESTORED 行,不一致!"
    FAILED=1
  fi
done
mariadb_sql -e "DROP DATABASE $TEST_DB"

echo "════════ 2/3 配置包 ════════"
rclone copy "$R2_REMOTE/config/" /tmp/restore-test/
mkdir -p /tmp/restore-test/unpacked
# 打包时用了绝对路径,解包时 GNU tar 默认剥掉前导 /,只会落在临时目录里
tar -xzf /tmp/restore-test/config-*.tar.gz -C /tmp/restore-test/unpacked
for F in opt/tunan-blog/env/prod.yaml opt/tunan-blog/db-backup.env \
         opt/tunan-ui/.env.local opt/tunan-admin/.env.local \
         opt/deploy/remark42/docker-compose.yml; do
  if [ -s "/tmp/restore-test/unpacked/$F" ]; then
    echo "    ✓ $F"
  else
    echo "    ❌ 缺少 $F"
    FAILED=1
  fi
done

echo "════════ 3/3 Remark42(一次性容器,不碰生产)════════"
rclone copy "$R2_REMOTE/remark42/" "$DRILL/var/backup/"
BK=$(ls -t "$DRILL/var/backup/userbackup-"*.gz 2>/dev/null | head -1)
if [ -z "${BK:-}" ]; then
  echo "    ❌ R2 里没有 remark42 备份文件"
  FAILED=1
else
  echo "    拉取到备份: $(basename "$BK")"
  # remark42 的 restore 按模板 userbackup-<SITE>-<YYYYMMDD>.gz 找"它自己时区"的今天的文件
  # (镜像硬编码 America/Chicago,和宿主机差一天)。容器起来后直接问它今天是几号。
  docker run --rm -d --name remark42-drill -p 127.0.0.1:18080:8080 \
    -v "$DRILL/var:/srv/var" \
    -e REMARK_URL=http://127.0.0.1:18080 -e SITE=tunan-remark \
    -e SECRET=drill-secret -e STORE_TYPE=bolt -e AUTH_ANON=true \
    -e ADMIN_PASSWD=drill-admin \
    -e BACKUP_PATH=/srv/var/backup -e STORE_BOLT_PATH=/srv/var/db \
    umputun/remark42:v1.18.0 >/dev/null
  sleep 6
  CDATE=$(docker exec remark42-drill date +%Y%m%d)
  cp "$BK" "$DRILL/var/backup/userbackup-tunan-remark-$CDATE.gz"
  cp "$BK" "$DRILL/var/backup/userbackup-tunan-remark-$(date -u +%Y%m%d).gz" 2>/dev/null || true
  echo "    [调试] 容器内 /srv/var/backup/:"
  docker exec remark42-drill ls -la /srv/var/backup/ || true
  if docker exec remark42-drill restore; then
    echo "    ✓ restore 成功(容器退出码 0)"
  else
    echo "    ❌ restore 失败(现场已保留在 $DRILL,不清理)"
    docker rm -f remark42-drill >/dev/null
    FAILED=1
    exit 1
  fi
  docker rm -f remark42-drill >/dev/null
fi

rm -rf /tmp/restore-test "$DRILL"
echo ""
if [ "$FAILED" = "0" ]; then
  echo "✅ 三类备份全部可恢复,演练通过"
else
  echo "❌ 演练有失败项,向上翻找 ❌ 标记"
  exit 1
fi
