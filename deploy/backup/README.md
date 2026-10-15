# 备份与恢复手册

真出了事的时候,打开这份文件,找到对应场景,照着复制粘贴。
**所有恢复命令都在服务器的 root 会话执行**(ssh root@<IP>),除了标注"本地"的。

## 备份资产总览

每天 3:15(服务器时间)自动执行,保留 30 天。存在 Cloudflare R2 的 `blog-backup` 桶里:

| 内容 | R2 路径 | 恢复场景 |
|---|---|---|
| TiDB 全库 dump(gzip) | `r2:blog-backup/mysql/mysql-YYYY-MM-DD.sql.gz` | 文章/书/友链/项目/浏览量丢失 |
| 服务器配置包(tar) | `r2:blog-backup/config/config-YYYY-MM-DD.tar.gz` | prod.yaml、GitHub token、备份凭据丢失 |
| Remark42 全部评论 | `r2:blog-backup/remark42/userbackup-*.gz` | 评论丢失 |

服务器本地留一份同样的(`/var/backups/tunan/` + `/opt/deploy/remark42/var/backup/`)。

### 日常巡检 / 手动备份

```bash
bash /opt/deploy/backup.sh                 # 手动立即备份一次
rclone ls r2:blog-backup/mysql/            # 列出所有数据库备份(看大小和日期)
tail -20 /var/log/tunan-backup.log         # 看最近的自动备份日志
bash /opt/deploy/restore-drill.sh          # 恢复演练(建议每月跑一次)
```

## ⚠️ 恢复前的第一件事

**先对当前状态做一次手动备份**(`bash /opt/deploy/backup.sh`),哪怕当前状态是"坏的"。
恢复操作会覆盖现有数据,这一步给自己留退路。

## 场景 1:文章/数据误删,要恢复整库

适用:文章被误删、数据库被改坏、TiDB 出问题。整库覆盖,当前数据会被备份时点的数据替换。

```bash
# 1. 拉一份备份(改成你要的日期;不加日期参数就是最新)
rclone copy r2:blog-backup/mysql/ /tmp/restore/
ls -lh /tmp/restore/                       # 确认文件在,大小正常(几十 KB)

# 2. 导入临时库先验证(强烈建议,别跳过)
source /opt/tunan-blog/db-backup.env
mariadb -h "$TIDB_HOST" -P "$TIDB_PORT" -u "$TIDB_USER" -p"$TIDB_PASS" --ssl \
  -e "CREATE DATABASE tunan_verify"
gunzip < /tmp/restore/mysql-YYYY-MM-DD.sql.gz | \
  mariadb -h "$TIDB_HOST" -P "$TIDB_PORT" -u "$TIDB_USER" -p"$TIDB_PASS" --ssl tunan_verify
mariadb -h "$TIDB_HOST" -P "$TIDB_PORT" -u "$TIDB_USER" -p"$TIDB_PASS" --ssl \
  -e "SELECT COUNT(*) FROM tunan_verify.article_translation"   # 62 = 正常

# 3. 确认无误,正式覆盖生产库
mariadb ... -e "DROP DATABASE tunan_verify"      # 补全连接参数
gunzip < /tmp/restore/mysql-YYYY-MM-DD.sql.gz | \
  mariadb -h "$TIDB_HOST" -P "$TIDB_PORT" -u "$TIDB_USER" -p"$TIDB_PASS" --ssl tunan

# 4. 清理 + 前台确认
rm -rf /tmp/restore
```

只想找回**一篇**旧文章?同上导入 `tunan_verify`,然后从后台管理界面把那篇文章
从 `tunan_verify.article_translation` 复制粘贴回正式库,不整库覆盖。

## 场景 2:评论丢失/损坏

```bash
# 1. 从 R2 拉备份到 remark42 的备份目录
rclone copy r2:blog-backup/remark42/ /opt/deploy/remark42/var/backup/
ls -lh /opt/deploy/remark42/var/backup/

# 2. 重命名为 restore 认的名字再恢复(它按自己的日历找"今天"的文件,
#    而且镜像时区是 America/Chicago,与服务器差一天,所以三个候选名都备上)
for TZ_NAME in Asia/Shanghai America/Chicago UTC; do
  cp /opt/deploy/remark42/var/backup/userbackup-tunan-remark-YYYYMMDD.gz \
     "/opt/deploy/remark42/var/backup/userbackup-tunan-remark-$(TZ=$TZ_NAME date +%Y%m%d).gz"
done

# 3. 恢复(会覆盖当前评论!)
docker exec remark42 restore

# 4. 打开任意文章页确认评论回来了
```

## 场景 3:配置文件丢了(prod.yaml / token / 备份凭据)

```bash
rclone copy r2:blog-backup/config/ /tmp/cfg-restore/
# 解包会落到 /tmp/cfg-restore/opt/... (剥掉了前导斜杠,不会覆盖现有文件)
mkdir -p /tmp/cfg-restore/unpacked
tar -xzf /tmp/cfg-restore/config-*.tar.gz -C /tmp/cfg-restore/unpacked
# 需要哪个拷哪个,比如:
cp /tmp/cfg-restore/unpacked/opt/tunan-blog/env/prod.yaml /opt/tunan-blog/env/prod.yaml
chmod 600 /opt/tunan-blog/env/prod.yaml
sudo systemctl restart tunan-blog tunan-ui tunan-admin
```

## 场景 4:服务器整个没了(忘续费/被删)

这是最坏情况,但从零重建约 30 分钟。前提:你手上有 R2 的 Access Key / Secret / Account ID
(在 CF 面板随时可查)和本仓库。

```bash
# ===== 1. 新服务器初始化(本地,输新机器 root 密码) =====
SSH_PUBKEY="$(cat ~/.ssh/tunan_vps.pub)" bash deploy/server-init.sh root@<新IP>
ssh -i ~/.ssh/tunan_vps root@<新IP>     # 之后所有命令在新机器 root 会话

# ===== 2. 基础配置(装单元/Caddy/备份 cron) =====
#   本地: scp deploy/Caddyfile deploy/systemd/*.service deploy/backup/backup.sh <新IP>:/tmp/
#   本地: bash deploy/server-root-setup.sh root@<新IP>

# ===== 3. 恢复 rclone 配置和备份凭据(新机器 root 会话) =====
rclone config          # 同首次部署:S3 / Cloudflare / 你的 key / endpoint
mkdir -p /opt/tunan-blog/env
rclone copy r2:blog-backup/config/ /tmp/cfg/
tar -xzf /tmp/cfg/config-*.tar.gz -C /            # 恢复 prod.yaml / db-backup.env / .env.local
chmod 600 /opt/tunan-blog/env/prod.yaml /opt/tunan-blog/db-backup.env \
          /opt/tunan-ui/.env.local /opt/tunan-admin/.env.local

# ===== 4. 恢复数据库和评论 =====
source /opt/tunan-blog/db-backup.env
rclone copy r2:blog-backup/mysql/ /tmp/restore/
gunzip < /tmp/restore/mysql-*.sql.gz | \
  mariadb -h "$TIDB_HOST" -P "$TIDB_PORT" -u "$TIDB_USER" -p"$TIDB_PASS" --ssl tunan
cd /opt/deploy/remark42 && docker compose up -d && sleep 5
rclone copy r2:blog-backup/remark42/ var/backup/
# 重命名后再 restore,同场景 2

# ===== 5. 部署代码 =====
#   本地: 改 deploy/.env.deploy 里的 IP 为新 IP
#   本地: bash deploy/deploy.sh

# ===== 6. Cloudflare DNS:三条记录的 A 记录改成新 IP =====
```

## 恢复演练

不用真出事也能验证备份可用(强烈建议每月跑一次):

```bash
bash /opt/deploy/restore-drill.sh
```

它做三件事,全部只碰临时资源:数据库备份灌进临时库逐表比对行数;
配置包解包核对文件;起一个一次性容器真实执行 remark42 restore。

## 已知坑(恢复命令就是这么设计的,别"修复"它们)

- mariadb-dump 不能加 `--single-transaction`:TiDB 不兼容,报 SAVEPOINT 1305
- remark42 的 restore/backup CLI 需要 compose 里配 `ADMIN_PASSWD`(已配)
- remark42 restore 按它自己的日历找"今天"的备份文件,镜像时区是
  America/Chicago,所以场景 2 里要备三个时区的候选名
- rclone 远端只配在 root 下(故意的),deploy 账号碰不到备份
