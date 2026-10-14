#!/bin/bash
# 服务器 root 侧配置(幂等,可重复跑):
#   - 安装 systemd 服务单元并设置开机自启
#   - 安装 Caddyfile + CF Origin 证书(若 /tmp 下已上传,缺证书则跳过并提示)
#   - 安装每日备份 cron(若 backup.sh 已上传)
#
# 用法(本地终端执行,需要输一次 root 密码):
#   bash deploy/server-root-setup.sh root@<VPS_IP>
set -euo pipefail
REMOTE="${1:?用法: bash deploy/server-root-setup.sh root@<VPS_IP>}"

echo "==> 连接 $REMOTE 执行 root 配置(需要输入 root 密码)"
ssh -t "$REMOTE" 'bash -s' <<'EOF'
set -euo pipefail

echo "==> deploy 用户加入 docker 组(管理 remark42 容器)"
usermod -aG docker deploy 2>/dev/null || true
id deploy | tr ',' '\n' | grep docker || echo "   (已是组成员)"

echo "==> 安装 systemd 服务单元"
install -m 644 /tmp/tunan-blog.service /tmp/tunan-ui.service /tmp/tunan-admin.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable tunan-blog.service tunan-ui.service tunan-admin.service >/dev/null
systemctl is-enabled tunan-blog tunan-ui tunan-admin

echo "==> Caddy 配置与证书"
if [ -f /tmp/Caddyfile ]; then
  mkdir -p /etc/caddy/ssl
  if [ -f /tmp/origin.pem ] && [ -f /tmp/origin.key ]; then
    install -m 600 /tmp/origin.pem /etc/caddy/ssl/origin.pem
    install -m 600 /tmp/origin.key /etc/caddy/ssl/origin.key
    # caddy 服务以 caddy 用户运行,证书必须可读(否则 reload 报 permission denied)
    chown caddy:caddy /etc/caddy/ssl/origin.pem /etc/caddy/ssl/origin.key
    echo "   证书已安装"
  else
    echo "   ⚠️ 缺 /tmp/origin.pem 或 /tmp/origin.key,证书跳过"
  fi
  install -m 644 /tmp/Caddyfile /etc/caddy/Caddyfile
  if caddy validate --config /etc/caddy/Caddyfile >/dev/null 2>&1 && systemctl reload caddy; then
    echo "   Caddyfile 已生效"
  else
    echo "   ⚠️ Caddy 配置未生效(通常因缺证书),证书就位后重跑本脚本即可"
  fi
else
  echo "   (跳过:/tmp/Caddyfile 尚未上传)"
fi

echo "==> 每日备份 cron"
if [ -f /tmp/backup.sh ]; then
  install -m 700 /tmp/backup.sh /opt/deploy/backup.sh
  chown deploy:deploy /opt/deploy/backup.sh
  ( crontab -l 2>/dev/null | grep -v 'tunan-backup' ; echo '15 3 * * * /opt/deploy/backup.sh >> /var/log/tunan-backup.log 2>&1 # tunan-backup' ) | crontab -
  echo "   cron 已安装:"
  crontab -l | grep tunan-backup
else
  echo "   (跳过:/tmp/backup.sh 尚未上传)"
fi

echo ""
echo "✅ root 侧配置完成"
EOF
