#!/bin/bash

# 部署脚本 - Tunan Blog
# 使用方法: ./deploy.sh

set -e  # 遇到错误立即退出

echo "================================="
echo "🚀 开始部署 Tunan Blog"
echo "================================="

# 获取当前目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "📂 当前目录: $(pwd)"

# 1. 拉取最新代码
echo "📥 拉取最新代码..."
git pull

# 2. 设置生产环境变量
echo "🔧 设置生产环境..."
export GO_TUNAN_BLOG_ENV=prod

# 3. 停止并重启后端服务
echo "🔄 重启后端服务..."
echo "   查找现有后端进程..."
BACKEND_PID=$(ps -ef | grep tunan-blog | grep -v grep | awk '{print $2}' || true)
if [ ! -z "$BACKEND_PID" ]; then
    echo "   杀死现有后端进程: $BACKEND_PID"
    kill $BACKEND_PID
    sleep 2
else
    echo "   未找到现有后端进程"
fi

echo "   启动新的后端进程..."
nohup ./tunan-blog > backend.log 2>&1 &
BACKEND_NEW_PID=$!
echo "   后端进程已启动，PID: $BACKEND_NEW_PID"

# 4. 构建和部署前端 UI
echo "🎨 构建前端 UI..."
cd ui

echo "   安装依赖..."
npm install

echo "   构建项目..."
npm run build

echo "   停止现有UI服务..."
UI_PID=$(lsof -ti:3000 || true)
if [ ! -z "$UI_PID" ]; then
    echo "   杀死现有UI进程: $UI_PID"
    kill $UI_PID
    sleep 2
else
    echo "   未找到现有UI进程"
fi

echo "   启动新的UI服务..."
nohup npm run start > ../ui.log 2>&1 &
UI_NEW_PID=$!
echo "   UI服务已启动，PID: $UI_NEW_PID"

# 5. 构建和部署管理后台
echo "⚙️  构建管理后台..."
cd ../ui-admin

echo "   安装依赖..."
npm install

echo "   构建项目..."
npm run build

echo "   停止现有管理后台服务..."
ADMIN_PID=$(ss -tulpn | grep :3001 | grep -oP 'pid=\K\d+' || true)
if [ ! -z "$ADMIN_PID" ]; then
    echo "   杀死现有管理后台进程: $ADMIN_PID"
    kill $ADMIN_PID
    sleep 2
else
    echo "   未找到现有管理后台进程"
fi

echo "   启动新的管理后台服务..."
nohup npm run start > ../admin.log 2>&1 &
ADMIN_NEW_PID=$!
echo "   管理后台已启动，PID: $ADMIN_NEW_PID"

# 回到项目根目录
cd "$SCRIPT_DIR"

# 6. 等待服务启动并检查状态
echo "⏳ 等待服务启动..."
sleep 5

echo "🔍 检查服务状态..."

# 检查后端服务
if ps -p $BACKEND_NEW_PID > /dev/null; then
    echo "   ✅ 后端服务运行正常 (PID: $BACKEND_NEW_PID)"
else
    echo "   ❌ 后端服务启动失败"
fi

# 检查UI服务
if ps -p $UI_NEW_PID > /dev/null; then
    echo "   ✅ UI服务运行正常 (PID: $UI_NEW_PID)"
else
    echo "   ❌ UI服务启动失败"
fi

# 检查管理后台服务
if ps -p $ADMIN_NEW_PID > /dev/null; then
    echo "   ✅ 管理后台运行正常 (PID: $ADMIN_NEW_PID)"
else
    echo "   ❌ 管理后台启动失败"
fi

# 7. 显示端口占用情况
echo "🌐 端口占用情况:"
echo "   后端 API (应该是3002端口):"
ss -tulpn | grep :3002 || echo "   未找到3002端口监听"
echo "   前端 UI (端口3000):"
ss -tulpn | grep :3000 || echo "   未找到3000端口监听"
echo "   管理后台 (端口3001):"
ss -tulpn | grep :3001 || echo "   未找到3001端口监听"

echo ""
echo "================================="
echo "✨ 部署完成！"
echo "================================="
echo "📋 服务信息:"
echo "   前端页面: http://your-domain:3000"
echo "   管理后台: http://your-domain:3001"
echo "   后端API:  http://your-domain:3002"
echo ""
echo "📝 日志文件:"
echo "   后端日志: $(pwd)/backend.log"
echo "   UI日志:   $(pwd)/ui.log"  
echo "   管理后台: $(pwd)/admin.log"
echo ""
echo "🔧 常用命令:"
echo "   查看后端日志: tail -f backend.log"
echo "   查看UI日志:   tail -f ui.log"
echo "   查看管理日志: tail -f admin.log"
echo "   查看所有进程: ps -ef | grep -E '(tunan-blog|node.*3000|node.*3001)'"
echo "================================="