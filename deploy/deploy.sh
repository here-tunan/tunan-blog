#!/bin/bash
# 部署脚本 - 本地构建 + rsync,服务器上不再跑任何 npm/go build(1G 内存扛不住)
#
# 前置:
#   1. 在 deploy/ 目录创建 .env.deploy(已被 .gitignore 忽略,严禁提交),内容:
#        SSH_HOST=deploy@<你的VPS_IP>
#        SSH_KEY=$HOME/.ssh/tunan_vps
#   2. 服务器上已放好 /opt/tunan-blog/env/prod.yaml(参考 env/prod.yaml.example)
#   3. 本机 ssh 免密可达
#
# 用法: 在项目根目录执行
#   bash deploy/deploy.sh          # 全量:后端 + 前端 + 管理后台(默认)
#   bash deploy/deploy.sh blog     # 只构建并部署 Go 后端
#   bash deploy/deploy.sh ui       # 只构建并部署主站前端
#   bash deploy/deploy.sh admin    # 只构建并部署管理后台
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$ROOT_DIR"

if [ -f "$SCRIPT_DIR/.env.deploy" ]; then
  source "$SCRIPT_DIR/.env.deploy"
fi
SSH_HOST="${SSH_HOST:-}"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/tunan_vps}"
if [ -z "$SSH_HOST" ]; then
  echo "❌ 未配置 SSH_HOST:请创建 deploy/.env.deploy(参考本脚本头部注释),不要把 IP 写进本脚本"
  exit 1
fi

TARGET="${1:-all}"

SSH() { ssh -i "$SSH_KEY" -o ConnectTimeout=10 "$SSH_HOST" "$@"; }
R()   { rsync -az -e "ssh -i $SSH_KEY" "$@"; }
RD()  { rsync -az --delete -e "ssh -i $SSH_KEY" "$@"; }

deploy_blog() {
  echo "==> 构建后端(CGO_ENABLED=0 静态编译,prod 只用 MySQL)"
  CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /tmp/tunan-blog-linux ./cmd/tunan-blog
  echo "==> 上传后端二进制"
  R /tmp/tunan-blog-linux "$SSH_HOST:/opt/tunan-blog/tunan-blog"
}

deploy_ui() {
  echo "==> 构建 UI(standalone)"
  (cd ui && npm ci --no-audit --no-fund && npm run build)
  echo "==> 上传 UI(standalone 产物,不带 --delete 以保留服务器上的 .env.local)"
  R ui/.next/standalone/ "$SSH_HOST:/opt/tunan-ui/"
  RD ui/.next/static/ "$SSH_HOST:/opt/tunan-ui/.next/static/"
  RD ui/public/ "$SSH_HOST:/opt/tunan-ui/public/"
}

deploy_admin() {
  echo "==> 构建 Admin(standalone)"
  (cd ui-admin && npm ci --no-audit --no-fund && npm run build)
  echo "==> 上传 Admin"
  R ui-admin/.next/standalone/ "$SSH_HOST:/opt/tunan-admin/"
  RD ui-admin/.next/static/ "$SSH_HOST:/opt/tunan-admin/.next/static/"
  RD ui-admin/public/ "$SSH_HOST:/opt/tunan-admin/public/"
}

case "$TARGET" in
  blog)  deploy_blog;  RESTART="tunan-blog" ;;
  ui)    deploy_ui;    RESTART="tunan-ui" ;;
  admin) deploy_admin; RESTART="tunan-admin" ;;
  all)   deploy_blog; deploy_ui; deploy_admin; RESTART="tunan-blog tunan-ui tunan-admin" ;;
  *) echo "❌ 目标只能是 all | blog | ui | admin"; exit 1 ;;
esac

echo "==> 重启服务($RESTART)"
SSH "sudo systemctl restart $RESTART"

sleep 3
echo "==> 服务状态"
SSH "systemctl is-active $RESTART && free -m | head -2"

echo "==> 静态资源一致性校验(HTML 引用的 chunk 必须全部可访问)"
# sed 剥掉 RSC 转义引号前的反斜杠,避免 URL 尾部带 \ 造成误报
BROKEN=$(SSH 'curl -s http://127.0.0.1:3000/zh-CN | grep -o "/_next/static/[^\"]*" | sed "s/\\\\*$//" | sort -u | while read -r u; do
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
echo "✨ 部署完成($TARGET)。查看日志: bash deploy/restart.sh logs <blog|ui|admin>"
