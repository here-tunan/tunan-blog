#!/bin/bash
# 快速重启/查看部分服务,不做任何构建
# 用法: bash deploy/restart.sh [命令] [目标]
#   命令: restart(默认) | status | logs
#   目标: all(默认) | blog | ui | admin
#
# 示例:
#   bash deploy/restart.sh              # 重启全部
#   bash deploy/restart.sh restart ui   # 只重启前端
#   bash deploy/restart.sh logs blog    # 看后端最近 100 行日志
#
# 注意:deploy 账号的 sudo 白名单按"精确参数"匹配(server-init.sh / server-root-setup.sh),
# 本脚本生成的命令形式与其一一对应,不要随意改动 systemctl 参数顺序
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -f "$SCRIPT_DIR/.env.deploy" ]; then
  source "$SCRIPT_DIR/.env.deploy"
fi
SSH_HOST="${SSH_HOST:-}"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/tunan_vps}"
if [ -z "$SSH_HOST" ]; then
  echo "❌ 缺少 deploy/.env.deploy(SSH_HOST / SSH_KEY)"
  exit 1
fi

CMD="${1:-restart}"
TARGET="${2:-all}"

case "$TARGET" in
  all)   UNITS="tunan-blog tunan-ui tunan-admin" ;;
  blog)  UNITS="tunan-blog" ;;
  ui)    UNITS="tunan-ui" ;;
  admin) UNITS="tunan-admin" ;;
  *) echo "❌ 目标只能是 all | blog | ui | admin"; exit 1 ;;
esac

ssh_cmd() {
  ssh -i "$SSH_KEY" -o ConnectTimeout=10 "$SSH_HOST" "$1"
}

case "$CMD" in
  restart)
    ssh_cmd "sudo systemctl restart $UNITS"
    sleep 2
    ssh_cmd "systemctl is-active $UNITS"
    ;;
  status)
    ssh_cmd "systemctl is-active $UNITS"
    echo "----"
    ssh_cmd "sudo systemctl status $UNITS" | head -30
    ;;
  logs)
    if [ "$TARGET" = "all" ]; then
      echo "❌ logs 需要指定单个目标: bash deploy/restart.sh logs <blog|ui|admin>"
      exit 1
    fi
    ssh_cmd "sudo journalctl -u $UNITS -n 100 --no-pager"
    ;;
  *)
    echo "❌ 命令只能是 restart | status | logs"
    exit 1
    ;;
esac
