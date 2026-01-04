#!/bin/bash
# CHU TEA 服务器一键修复脚本
# 此脚本会修复 Nginx 配置并确保网站正常运行

set -e

echo "=========================================="
echo "🔧 CHU TEA 服务器修复脚本"
echo "=========================================="

# 1. 备份现有 Nginx 配置
echo "📦 备份现有 Nginx 配置..."
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup.$(date +%Y%m%d_%H%M%S)

# 2. 写入新的 Nginx 配置
echo "📝 写入新的 Nginx 配置..."
sudo tee /etc/nginx/sites-available/default > /dev/null << 'NGINX_CONFIG'
server {
    listen 80;
    server_name www.chutea.cc chutea.cc;

    # 指向 current 软链接
    root /home/ubuntu/chu-tea-mini-app-main/current/dist/public;
    index index.html;

    # HTML 文件：禁用缓存，确保每次获取最新版本
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }

    # 静态资源：利用 Vite Hash 强缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # 后端 API 代理
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # tRPC 代理
    location /trpc/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX_CONFIG

# 3. 测试 Nginx 配置
echo "🔍 测试 Nginx 配置..."
sudo nginx -t

# 4. 重载 Nginx
echo "🔄 重载 Nginx..."
sudo nginx -s reload

# 5. 检查 current 软链接是否存在
echo "🔗 检查 current 软链接..."
if [ -L /home/ubuntu/chu-tea-mini-app-main/current ]; then
    echo "✅ current 软链接存在: $(readlink -f /home/ubuntu/chu-tea-mini-app-main/current)"
else
    echo "⚠️ current 软链接不存在，尝试创建..."
    # 如果 releases 目录存在，链接到最新版本
    if [ -d /home/ubuntu/chu-tea-mini-app-main/releases ]; then
        LATEST=$(ls -t /home/ubuntu/chu-tea-mini-app-main/releases | head -1)
        if [ -n "$LATEST" ]; then
            ln -sfn /home/ubuntu/chu-tea-mini-app-main/releases/$LATEST /home/ubuntu/chu-tea-mini-app-main/current
            echo "✅ 已创建软链接指向: $LATEST"
        fi
    else
        # 如果没有 releases 目录，直接链接到 dist
        if [ -d /home/ubuntu/chu-tea-mini-app-main/dist ]; then
            mkdir -p /home/ubuntu/chu-tea-mini-app-main/releases/legacy
            cp -r /home/ubuntu/chu-tea-mini-app-main/dist /home/ubuntu/chu-tea-mini-app-main/releases/legacy/
            ln -sfn /home/ubuntu/chu-tea-mini-app-main/releases/legacy /home/ubuntu/chu-tea-mini-app-main/current
            echo "✅ 已创建软链接指向 legacy 版本"
        fi
    fi
fi

# 6. 检查文件是否存在
echo "📂 检查文件结构..."
if [ -f /home/ubuntu/chu-tea-mini-app-main/current/dist/public/index.html ]; then
    echo "✅ index.html 存在"
else
    echo "❌ index.html 不存在，请检查部署"
fi

# 7. 重启 PM2
echo "🔄 重启 PM2 应用..."
cd /home/ubuntu/chu-tea-mini-app-main
pm2 restart chu-tea || pm2 start current/dist/index.js --name chu-tea

echo "=========================================="
echo "✅ 修复完成！"
echo "=========================================="
echo "请刷新浏览器（Ctrl+Shift+R 或 Cmd+Shift+R）查看效果"
