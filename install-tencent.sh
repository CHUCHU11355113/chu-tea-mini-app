#!/bin/bash

# CHU TEA Mini App - 腾讯云一键安装脚本
# 适用于全新的腾讯云服务器
# 使用方法: sudo bash install-tencent.sh

set -e

echo "=========================================="
echo "CHU TEA - 腾讯云一键安装脚本"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}请使用root权限运行此脚本${NC}"
    echo "使用: sudo bash install-tencent.sh"
    exit 1
fi

# 1. 更新系统
echo -e "${YELLOW}[1/9] 更新系统...${NC}"
apt-get update
apt-get upgrade -y

# 2. 安装基础软件
echo -e "${YELLOW}[2/9] 安装基础软件...${NC}"
apt-get install -y curl git wget vim ufw

# 3. 安装Node.js 22
echo -e "${YELLOW}[3/9] 安装Node.js 22...${NC}"
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs
echo "Node.js版本: $(node -v)"

# 4. 安装pnpm和PM2
echo -e "${YELLOW}[4/9] 安装pnpm和PM2...${NC}"
npm install -g pnpm pm2

# 5. 安装MySQL
echo -e "${YELLOW}[5/9] 安装MySQL...${NC}"
apt-get install -y mysql-server
systemctl start mysql
systemctl enable mysql

# 设置MySQL root密码
MYSQL_ROOT_PASSWORD="ChuTea2024!@#"
mysql <<EOF
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${MYSQL_ROOT_PASSWORD}';
FLUSH PRIVILEGES;
EOF

# 创建数据库和用户
mysql -uroot -p${MYSQL_ROOT_PASSWORD} <<EOF
CREATE DATABASE IF NOT EXISTS chu_tea_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'chu_tea_user'@'localhost' IDENTIFIED BY 'chu_tea_pass_2024';
GRANT ALL PRIVILEGES ON chu_tea_db.* TO 'chu_tea_user'@'localhost';
FLUSH PRIVILEGES;
EOF

echo -e "${GREEN}✓ MySQL安装完成${NC}"
echo "MySQL root密码: ${MYSQL_ROOT_PASSWORD}"

# 6. 安装Nginx
echo -e "${YELLOW}[6/9] 安装Nginx...${NC}"
apt-get install -y nginx
systemctl start nginx
systemctl enable nginx

# 7. 配置防火墙
echo -e "${YELLOW}[7/9] 配置防火墙...${NC}"
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# 8. 克隆项目
echo -e "${YELLOW}[8/9] 克隆项目...${NC}"
mkdir -p /var/www
cd /var/www

echo "请输入GitHub仓库地址（例如: https://github.com/username/chu-tea.git）:"
read GIT_REPO

if [ -d "/var/www/chu-tea" ]; then
    rm -rf /var/www/chu-tea
fi

git clone $GIT_REPO chu-tea
cd /var/www/chu-tea

# 9. 安装依赖并构建
echo -e "${YELLOW}[9/9] 安装依赖并构建...${NC}"

# 后端
cd /var/www/chu-tea/server
pnpm install
pnpm run build

# 前端  
cd /var/www/chu-tea/client
pnpm install
pnpm run build

# 10. 配置Nginx
echo -e "${YELLOW}配置Nginx...${NC}"
cat > /etc/nginx/sites-available/chu-tea <<'NGINX_EOF'
server {
    listen 80;
    server_name _;
    
    client_max_body_size 50M;

    # 前端
    location / {
        root /var/www/chu-tea/client/dist;
        try_files $uri $uri/ /index.html;
        
        # 缓存静态资源
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # 后端API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
NGINX_EOF

ln -sf /etc/nginx/sites-available/chu-tea /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

# 11. 创建环境变量文件
cat > /var/www/chu-tea/server/.env <<ENV_EOF
NODE_ENV=production
PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=chu_tea_user
DATABASE_PASSWORD=chu_tea_pass_2024
DATABASE_NAME=chu_tea_db
JWT_SECRET=$(openssl rand -base64 32)
ENV_EOF

# 12. 启动应用
echo -e "${YELLOW}启动应用...${NC}"
cd /var/www/chu-tea/server
pm2 delete chu-tea-api 2>/dev/null || true
pm2 start dist/index.js --name chu-tea-api
pm2 save
pm2 startup systemd -u root --hp /root
env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root

# 13. 创建更新脚本
cat > /var/www/chu-tea/update.sh <<'UPDATE_EOF'
#!/bin/bash
set -e
echo "更新CHU TEA应用..."
cd /var/www/chu-tea
git pull
cd server && pnpm install && pnpm run build
cd ../client && pnpm install && pnpm run build
pm2 restart chu-tea-api
echo "✅ 更新完成！"
UPDATE_EOF

chmod +x /var/www/chu-tea/update.sh

echo ""
echo -e "${GREEN}=========================================="
echo "✅ 安装完成！"
echo "==========================================${NC}"
echo ""
echo "访问信息:"
echo "  - 公网IP: $(curl -s ifconfig.me)"
echo "  - 访问地址: http://$(curl -s ifconfig.me)"
echo ""
echo "数据库信息:"
echo "  - MySQL root密码: ${MYSQL_ROOT_PASSWORD}"
echo "  - 数据库名: chu_tea_db"
echo "  - 用户名: chu_tea_user"
echo "  - 密码: chu_tea_pass_2024"
echo ""
echo "常用命令:"
echo "  - 查看日志: pm2 logs chu-tea-api"
echo "  - 重启应用: pm2 restart chu-tea-api"
echo "  - 查看状态: pm2 status"
echo "  - 更新应用: bash /var/www/chu-tea/update.sh"
echo ""
echo "下一步:"
echo "  1. 配置域名解析到: $(curl -s ifconfig.me)"
echo "  2. 配置Telegram Bot的Web App URL"
echo "  3. 安装SSL证书: certbot --nginx -d your-domain.com"
echo ""
