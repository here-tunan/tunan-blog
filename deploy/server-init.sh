#!/bin/bash
# 服务器初始化 - 在新的 RackNerd VPS (Ubuntu 24.04 / Debian 12 均可) 上以 root 执行
#
# 用法(本地执行,把公钥传进去 需要自己提前创建好公私钥 deploy.sh中会用到):
#   SSH_PUBKEY="$(cat ~/.ssh/tunan_vps.pub)" bash deploy/server-init.sh root@<VPS_IP>
set -euo pipefail

REMOTE="${1:?用法: bash deploy/server-init.sh root@<VPS_IP>}"
# 公钥优先读默认路径,也可以用环境变量 SSH_PUBKEY 覆盖
PUBKEY="${SSH_PUBKEY:-$(cat "$HOME/.ssh/tunan_vps.pub" 2>/dev/null || true)}"
if [ -z "$PUBKEY" ]; then
  echo "❌ 找不到 ~/.ssh/tunan_vps.pub,请先生成密钥对或 export SSH_PUBKEY"
  exit 1
fi

echo "==> 上传初始化脚本并在服务器执行"
ssh -o StrictHostKeyChecking=accept-new "$REMOTE" "PUBKEY='${PUBKEY}' bash -s" <<'EOF'
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive

echo "==> 系统更新"
apt-get update -y
# 新镜像升级偶发 console-setup 等非致命报错(VPS 没有实体控制台),不让它中断初始化
if ! apt-get upgrade -y; then
  echo "⚠️  apt upgrade 报错,尝试修复后继续(console-setup 类报错对无头 VPS 无实际影响)"
  dpkg --configure -a || true
fi

echo "==> 基础软件包"
apt-get install -y curl git ufw fail2ban unattended-upgrades ca-certificates \
  mariadb-client chrony sudo gpg

echo "==> 时区"
timedatectl set-timezone Asia/Shanghai || true

echo "==> 创建 deploy 用户 + 公钥"
id -u deploy >/dev/null 2>&1 || useradd -m -s /bin/bash deploy
install -d -m 700 /home/deploy/.ssh
echo "${PUBKEY}" > /home/deploy/.ssh/authorized_keys
chown -R deploy:deploy /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys

# deploy 只能重启/查看 tunan-* 服务和看日志,不能任意 root
cat > /etc/sudoers.d/deploy <<'SUDO'
deploy ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart tunan-blog tunan-ui tunan-admin, /usr/bin/systemctl restart tunan-blog, /usr/bin/systemctl restart tunan-ui, /usr/bin/systemctl restart tunan-admin, /usr/bin/systemctl status tunan-blog tunan-ui tunan-admin, /usr/bin/systemctl status tunan-blog, /usr/bin/systemctl status tunan-ui, /usr/bin/systemctl status tunan-admin, /usr/bin/systemctl start tunan-blog, /usr/bin/systemctl stop tunan-blog, /usr/bin/journalctl -u tunan-blog -n 100 --no-pager, /usr/bin/journalctl -u tunan-ui -n 100 --no-pager, /usr/bin/journalctl -u tunan-admin -n 100 --no-pager
SUDO
chmod 440 /etc/sudoers.d/deploy
visudo -c

echo "==> 部署目录"
mkdir -p /opt/tunan-blog /opt/tunan-ui /opt/tunan-admin /opt/deploy/remark42 /var/backups/tunan
chown -R deploy:deploy /opt/tunan-blog /opt/tunan-ui /opt/tunan-admin /opt/deploy/remark42

echo "==> 防火墙 (22/80/443)"
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo "==> fail2ban (sshd jail 默认启用)"
systemctl enable --now fail2ban

echo "==> 自动安全更新"
dpkg-reconfigure -f noninteractive unattended-upgrades

echo "==> 1G swap + 降低 swappiness"
if ! swapon --show | grep -q /swapfile; then
  fallocate -l 1G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  grep -q '^/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi
echo "vm.swappiness=10" > /etc/sysctl.d/99-swap.conf
sysctl --system >/dev/null

echo "==> Docker (含 compose 插件)"
if ! command -v docker >/dev/null; then
  curl -fsSL https://get.docker.com | sh
fi
systemctl enable --now docker

echo "==> Caddy"
if ! command -v caddy >/dev/null; then
  apt-get install -y debian-keyring debian-archive-keyring apt-transport-https
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
  apt-get update -y && apt-get install -y caddy
fi
systemctl enable caddy 2>/dev/null || true

echo "==> Node.js 22 LTS(Next.js standalone 的运行时,只跑不编译)"
if ! command -v node >/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi

echo "==> rclone"
command -v rclone >/dev/null || curl -fsSL https://rclone.org/install.sh | bash

echo ""
echo "✅ 服务器初始化完成。剩余手动步骤:"
echo "   1. ssh -i ~/.ssh/tunan_vps deploy@<IP> 验证密钥登录成功后,"
echo "      再去 /etc/ssh/sshd_config 把 PasswordAuthentication 改为 no 并 systemctl restart ssh"
echo "   2. 以 root 运行 rclone config 配置 R2 远端(名字必须叫 r2)"
echo "   3. 内存概况: free -m"
EOF
