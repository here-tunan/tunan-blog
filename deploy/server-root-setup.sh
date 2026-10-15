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

echo "==> 更新 sudo 白名单(与 server-init.sh 保持一致,支持单服务重启)"
cat > /etc/sudoers.d/deploy <<'SUDO'
deploy ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart tunan-blog tunan-ui tunan-admin, /usr/bin/systemctl restart tunan-blog, /usr/bin/systemctl restart tunan-ui, /usr/bin/systemctl restart tunan-admin, /usr/bin/systemctl status tunan-blog tunan-ui tunan-admin, /usr/bin/systemctl status tunan-blog, /usr/bin/systemctl status tunan-ui, /usr/bin/systemctl status tunan-admin, /usr/bin/systemctl start tunan-blog, /usr/bin/systemctl stop tunan-blog, /usr/bin/journalctl -u tunan-blog -n 100 --no-pager, /usr/bin/journalctl -u tunan-ui -n 100 --no-pager, /usr/bin/journalctl -u tunan-admin -n 100 --no-pager
SUDO
chmod 440 /etc/sudoers.d/deploy
visudo -c >/dev/null && echo "   sudoers 校验通过"

echo "==> 注入 RSS apikey 到 caddy 环境(供 /rss.xml 转译 /api/rss 用)"
APIKEY=$(awk '/^apikey:/ {print $2; exit}' /opt/tunan-blog/env/prod.yaml 2>/dev/null | tr -d '"')
if [ -n "$APIKEY" ]; then
  # 不用 heredoc:外层脚本本身经 <<'EOF' 传入,内层再嵌 heredoc 会提前截断外层
  mkdir -p /etc/systemd/system/caddy.service.d
  printf '[Service]\nEnvironment=RSS_APIKEY=%s\n' "$APIKEY" > /etc/systemd/system/caddy.service.d/rss-apikey.conf
  chmod 600 /etc/systemd/system/caddy.service.d/rss-apikey.conf
  echo "   已写入 caddy 环境变量"
else
  echo "   (跳过:/opt/tunan-blog/env/prod.yaml 尚未创建,首次部署完成后再跑一次本脚本)"
fi

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
  # 环境变量(RSS apikey)变了,必须 restart 才生效,reload 不读新环境
  if caddy validate --config /etc/caddy/Caddyfile >/dev/null 2>&1 && systemctl restart caddy; then
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
