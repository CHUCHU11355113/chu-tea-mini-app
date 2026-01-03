#!/bin/bash

echo "🚀 启动 CHU TEA Mini App 开发服务器..."
echo ""

# 检查MySQL是否运行
if ! systemctl is-active --quiet mysql; then
    echo "📦 启动MySQL服务..."
    sudo systemctl start mysql
fi

# 进入项目目录
cd /home/ubuntu/chu-tea-mini-app-main

# 启动开发服务器
echo "🔥 启动开发服务器..."
echo ""
echo "访问地址:"
echo "  本地: http://localhost:3001"
echo "  公网: https://3001-i265sdaxwtvroc8we8fjv-78088df5.sg1.manus.computer"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

pnpm dev
