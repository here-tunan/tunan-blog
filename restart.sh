#!/bin/bash

# 快速重启脚本 - 不重新构建，只重启服务
echo "🔄 快速重启所有服务..."

# 获取当前目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 设置生产环境变量
export GO_TUNAN_BLOG_ENV=prod

# 1. 重启后端服务
echo "🔧 重启后端服务..."
BACKEND_PID=$(ps -ef | grep tunan-blog | grep -v grep | awk '{print $2}' || true)
if [ ! -z "$BACKEND_PID" ]; then
    kill $BACKEND_PID
    echo "   已停止旧进程: $BACKEND_PID"
    sleep 2
fi
nohup ./tunan-blog > backend.log 2>&1 &
echo "   新进程已启动: $!"

# 2. 重启UI服务
echo "🎨 重启UI服务..."
cd ui
UI_PID=$(lsof -ti:3000 || true)
if [ ! -z "$UI_PID" ]; then
    kill $UI_PID
    echo "   已停止UI进程: $UI_PID"
    sleep 2
fi
nohup npm run start > ../ui.log 2>&1 &
echo "   UI服务已启动: $!"

# 3. 重启管理后台
echo "⚙️  重启管理后台..."
cd ../ui-admin
ADMIN_PID=$(ss -tulpn | grep :3001 | grep -oP 'pid=\K\d+' || true)
if [ ! -z "$ADMIN_PID" ]; then
    kill $ADMIN_PID
    echo "   已停止管理后台: $ADMIN_PID"
    sleep 2
fi
nohup npm run start > ../admin.log 2>&1 &
echo "   管理后台已启动: $!"

cd "$SCRIPT_DIR"

echo "✅ 所有服务重启完成！"
echo "💡 使用 ./status.sh 检查服务状态"