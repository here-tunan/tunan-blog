#!/bin/bash

# 检查服务状态脚本
echo "📊 Tunan Blog 服务状态检查"
echo "================================="

# 检查后端服务
echo "🔧 后端服务:"
BACKEND_PID=$(ps -ef | grep tunan-blog | grep -v grep | awk '{print $2}' || true)
if [ ! -z "$BACKEND_PID" ]; then
    echo "   ✅ 运行中 (PID: $BACKEND_PID)"
    echo "   📊 内存使用: $(ps -o pid,ppid,cmd,%mem,%cpu --sort=-%mem -p $BACKEND_PID | tail -n +2)"
else
    echo "   ❌ 未运行"
fi

# 检查UI服务
echo ""
echo "🎨 前端UI服务:"
UI_PID=$(lsof -ti:3000 || true)
if [ ! -z "$UI_PID" ]; then
    echo "   ✅ 运行中 (PID: $UI_PID)"
    echo "   📊 内存使用: $(ps -o pid,ppid,cmd,%mem,%cpu --sort=-%mem -p $UI_PID | tail -n +2)"
else
    echo "   ❌ 未运行"
fi

# 检查管理后台服务
echo ""
echo "⚙️  管理后台服务:"
ADMIN_PID=$(ss -tulpn | grep :3001 | grep -oP 'pid=\K\d+' || true)
if [ ! -z "$ADMIN_PID" ]; then
    echo "   ✅ 运行中 (PID: $ADMIN_PID)"
    echo "   📊 内存使用: $(ps -o pid,ppid,cmd,%mem,%cpu --sort=-%mem -p $ADMIN_PID | tail -n +2)"
else
    echo "   ❌ 未运行"
fi

# 检查端口占用
echo ""
echo "🌐 端口占用情况:"
echo "   3000端口 (前端UI):"
ss -tulpn | grep :3000 | head -1 || echo "      未占用"
echo "   3001端口 (管理后台):"
ss -tulpn | grep :3001 | head -1 || echo "      未占用"
echo "   3002端口 (后端API):"
ss -tulpn | grep :3002 | head -1 || echo "      未占用"

# 显示最近的日志
echo ""
echo "📝 最近日志 (最后5行):"
if [ -f "backend.log" ]; then
    echo "   后端日志:"
    tail -5 backend.log | sed 's/^/      /'
fi

if [ -f "ui.log" ]; then
    echo "   UI日志:"
    tail -5 ui.log | sed 's/^/      /'
fi

if [ -f "admin.log" ]; then
    echo "   管理后台日志:"
    tail -5 admin.log | sed 's/^/      /'
fi

echo "================================="