#!/bin/bash

# 停止所有服务脚本
echo "🛑 停止所有 Tunan Blog 服务..."

# 停止后端服务
echo "停止后端服务..."
BACKEND_PID=$(ps -ef | grep tunan-blog | grep -v grep | awk '{print $2}' || true)
if [ ! -z "$BACKEND_PID" ]; then
    kill $BACKEND_PID
    echo "✅ 后端服务已停止 (PID: $BACKEND_PID)"
else
    echo "⚠️  未找到后端进程"
fi

# 停止UI服务
echo "停止UI服务..."
UI_PID=$(lsof -ti:3000 || true)
if [ ! -z "$UI_PID" ]; then
    kill $UI_PID
    echo "✅ UI服务已停止 (PID: $UI_PID)"
else
    echo "⚠️  未找到UI进程"
fi

# 停止管理后台服务
echo "停止管理后台服务..."
ADMIN_PID=$(ss -tulpn | grep :3001 | grep -oP 'pid=\K\d+' || true)
if [ ! -z "$ADMIN_PID" ]; then
    kill $ADMIN_PID
    echo "✅ 管理后台已停止 (PID: $ADMIN_PID)"
else
    echo "⚠️  未找到管理后台进程"
fi

echo "🏁 所有服务已停止"