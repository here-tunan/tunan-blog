#!/bin/bash
# 部署脚本 - 本地构建 + rsync,服务器上不再跑任何 npm/go build(1G 内存扛不住)
#
# 前置:
#   1. 在项目根目录创建 .env.deploy(已被 .gitignore 忽略,严禁提交),内容:
#        SSH_HOST=deploy@<你的VPS_IP>
#        SSH_KEY=$HOME/.ssh/tunan_vps
#   2. 服务器上已放好 /opt/tunan-blog/env/prod.yaml(参考 env/prod.yaml.example)
#   3. 本机 ssh 免密可达
# 用法: ./deploy.sh
set -euo pipefail

if [ -f .env.deploy ]; then
  source .env.deploy
fi
SSH_HOST="${SSH_HOST:-}"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/tunan_vps}"
if [ -z "$SSH_HOST" ]; then
  echo "❌ 未配置 SSH_HOST:请创建 .env.deploy(参考 deploy.sh 头部注释),不要把 IP 写进本脚本"
  exit 1
fi

echo "================================="
echo "🚀 Tunan Blog 部署(本地构建 → rsync)"
echo "================================="

cd "$(dirname "$0")"

echo "==> 构建后端(CGO_ENABLED=0 静态编译,prod 只用 MySQL)"
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /tmp/tunan-blog-linux ./cmd/tunan-blog

echo "==> 构建 UI(standalone)"
(cd ui && npm ci --no-audit --no-fund && npm run build)

echo "==> 构建 Admin(standalone)"
(cd ui-admin && npm ci --no-audit --no-fund && npm run build)

echo "==> 上传后端二进制"
rsync -az -e "ssh -i $SSH_KEY" /tmp/tunan-blog-linux "$SSH_HOST:/opt/tunan-blog/tunan-blog"

echo "==> 上传 UI(standalone 产物,不带 --delete 以保留服务器上的 .env.local)"
rsync -az -e "ssh -i $SSH_KEY" ui/.next/standalone/ "$SSH_HOST:/opt/tunan-ui/"
rsync -az --delete -e "ssh -i $SSH_KEY" ui/.next/static/ "$SSH_HOST:/opt/tunan-ui/.next/static/"
rsync -az --delete -e "ssh -i $SSH_KEY" ui/public/ "$SSH_HOST:/opt/tunan-ui/public/"

echo "==> 上传 Admin"
rsync -az -e "ssh -i $SSH_KEY" ui-admin/.next/standalone/ "$SSH_HOST:/opt/tunan-admin/"
rsync -az --delete -e "ssh -i $SSH_KEY" ui-admin/.next/static/ "$SSH_HOST:/opt/tunan-admin/.next/static/"
rsync -az --delete -e "ssh -i $SSH_KEY" ui-admin/public/ "$SSH_HOST:/opt/tunan-admin/public/"

echo "==> 重启服务"
ssh -i "$SSH_KEY" "$SSH_HOST" "sudo systemctl restart tunan-blog tunan-ui tunan-admin"

sleep 3
echo "==> 服务状态"
ssh -i "$SSH_KEY" "$SSH_HOST" "systemctl is-active tunan-blog tunan-ui tunan-admin && free -m | head -2"

echo "==> 静态资源一致性校验(HTML 引用的 chunk 必须全部可访问)"
BROKEN=$(ssh -i "$SSH_KEY" "$SSH_HOST" 'curl -s http://127.0.0.1:3000/zh-CN | grep -o "/_next/static/[^\"]*" | sort -u | while read -r u; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:3000$u")
  [ "$code" = "200" ] || echo "404 $u"
done')
if [ -n "$BROKEN" ]; then
  echo "❌ 以下静态资源 404,构建产物与静态目录不一致,部署失败:"
  echo "$BROKEN"
  exit 1
fi
echo "✅ 全部可访问"

echo ""
echo "✨ 部署完成。查看日志: ssh $SSH_HOST -- sudo journalctl -u tunan-ui -n 50 --no-pager"
