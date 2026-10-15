#!/bin/bash
# 恢复演练(一次性/可重复跑): 从 R2 拉最新数据库备份,灌进临时库核对行数,再清理
# 用法: 在服务器 root 会话执行  bash restore-drill.sh
# 预期: article=61, article_translation=62, book=36, page_views=14225
set -euo pipefail

source /opt/tunan-blog/db-backup.env
R2_REMOTE="r2:blog-backup"
TEST_DB="tunan_restore_test"

mariadb_sql() {
  mariadb -h "$TIDB_HOST" -P "$TIDB_PORT" -u "$TIDB_USER" -p"$TIDB_PASS" --ssl "$@"
}

rm -rf /tmp/restore-test && mkdir -p /tmp/restore-test

echo "==> 从 R2 拉取数据库备份 ..."
rclone copy "$R2_REMOTE/mysql/" /tmp/restore-test/
LATEST=$(ls -t /tmp/restore-test/mysql-*.sql.gz | head -1)
echo "    使用备份: $LATEST"

echo "==> 建临时库 $TEST_DB ..."
mariadb_sql -e "DROP DATABASE IF EXISTS $TEST_DB; CREATE DATABASE $TEST_DB"

echo "==> 导入(几十秒内)..."
gunzip < "$LATEST" | mariadb_sql "$TEST_DB"

echo "==> 行数核对:"
mariadb_sql -e "
  SELECT
    (SELECT COUNT(*) FROM $TEST_DB.article)              AS article,
    (SELECT COUNT(*) FROM $TEST_DB.article_translation)  AS article_translation,
    (SELECT COUNT(*) FROM $TEST_DB.book)                 AS book,
    (SELECT COUNT(*) FROM $TEST_DB.page_views)           AS page_views;
  DROP DATABASE $TEST_DB"

rm -rf /tmp/restore-test
echo "✅ 恢复演练完成:行数应与源库一致(61 / 62 / 36 / 14225)"
