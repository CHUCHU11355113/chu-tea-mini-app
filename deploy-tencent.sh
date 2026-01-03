#!/bin/bash

# ============================================
# CHU TEA Mini App - 腾讯云一键部署脚本
# 适用于：Ubuntu 22.04 LTS (腾讯云轻量应用服务器)
# 版本：2.0 - 完整测试版
# ============================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}   CHU TEA Mini App - 腾讯云部署${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# 检查root权限
if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}请使用 root 用户运行此脚本${NC}"
  echo "命令: sudo bash deploy-tencent.sh"
  exit 1
fi

# 获取服务器IP
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')
echo -e "${BLUE}服务器IP: ${SERVER_IP}${NC}"
echo ""

# ============================================
# 第1步：系统更新
# ============================================
echo -e "${YELLOW}[1/8] 更新系统...${NC}"
apt update -y && apt upgrade -y
apt install -y curl wget git unzip
echo -e "${GREEN}✓ 系统更新完成${NC}"
echo ""

# ============================================
# 第2步：安装 Node.js 22
# ============================================
echo -e "${YELLOW}[2/8] 安装 Node.js 22...${NC}"
if ! command -v node &> /dev/null || [[ $(node -v | cut -d'.' -f1 | tr -d 'v') -lt 22 ]]; then
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    apt-get install -y nodejs
fi
echo "Node.js 版本: $(node -v)"
echo "npm 版本: $(npm -v)"
echo -e "${GREEN}✓ Node.js 安装完成${NC}"
echo ""

# ============================================
# 第3步：安装 pnpm 和 PM2
# ============================================
echo -e "${YELLOW}[3/8] 安装 pnpm 和 PM2...${NC}"
npm install -g pnpm pm2
echo "pnpm 版本: $(pnpm -v)"
echo "PM2 版本: $(pm2 -v)"
echo -e "${GREEN}✓ pnpm 和 PM2 安装完成${NC}"
echo ""

# ============================================
# 第4步：安装和配置 MySQL
# ============================================
echo -e "${YELLOW}[4/8] 安装和配置 MySQL...${NC}"
if ! command -v mysql &> /dev/null; then
    apt install -y mysql-server
    systemctl start mysql
    systemctl enable mysql
fi

# 创建数据库和用户（使用简单密码避免URL解析问题）
mysql -e "CREATE DATABASE IF NOT EXISTS chu_tea_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null || true
mysql -e "DROP USER IF EXISTS 'chu_tea_user'@'localhost';" 2>/dev/null || true
mysql -e "CREATE USER 'chu_tea_user'@'localhost' IDENTIFIED BY 'chutea2025';"
mysql -e "GRANT ALL PRIVILEGES ON chu_tea_db.* TO 'chu_tea_user'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"
echo -e "${GREEN}✓ MySQL 配置完成${NC}"
echo ""

# ============================================
# 第5步：设置项目目录
# ============================================
echo -e "${YELLOW}[5/8] 设置项目...${NC}"
PROJECT_DIR="/var/www/chu-tea"
mkdir -p /var/www
cd /var/www

# 如果目录存在，先删除
if [ -d "$PROJECT_DIR" ]; then
    rm -rf "$PROJECT_DIR"
fi

# 克隆项目
git clone https://github.com/CHUCHU11355113/chu-tea-mini-app.git chu-tea
cd chu-tea
echo -e "${GREEN}✓ 项目克隆完成${NC}"
echo ""

# ============================================
# 第6步：配置环境变量
# ============================================
echo -e "${YELLOW}[6/8] 配置环境变量...${NC}"

# 生成JWT密钥
JWT_SECRET=$(openssl rand -hex 32)

# 创建.env文件
cat > .env << EOF
# 数据库配置
DATABASE_URL=mysql://chu_tea_user:chutea2025@localhost:3306/chu_tea_db

# 应用配置
NODE_ENV=production
PORT=3000

# JWT密钥
JWT_SECRET=${JWT_SECRET}

# Telegram配置（部署后配置）
TELEGRAM_BOT_TOKEN=
TELEGRAM_WEBHOOK_URL=http://${SERVER_IP}:3000/api/telegram/webhook

# 支付配置（部署后配置）
YOOKASSA_SHOP_ID=
YOOKASSA_SECRET_KEY=
EOF

echo -e "${GREEN}✓ 环境变量配置完成${NC}"
echo ""

# ============================================
# 第7步：安装依赖并构建
# ============================================
echo -e "${YELLOW}[7/8] 安装依赖并构建项目（约3-5分钟）...${NC}"

# 安装依赖
pnpm install

# 数据库迁移
pnpm db:push

# 构建项目
pnpm build

# 创建日志目录
mkdir -p logs

echo -e "${GREEN}✓ 项目构建完成${NC}"
echo ""

# ============================================
# 第8步：启动应用
# ============================================
echo -e "${YELLOW}[8/8] 启动应用...${NC}"

# 停止旧的PM2进程
pm2 delete chu-tea 2>/dev/null || true

# 使用PM2直接启动构建后的文件
pm2 start dist/index.js --name chu-tea --env production

# 保存PM2配置
pm2 save

# 设置开机自启
pm2 startup systemd -u root --hp /root 2>/dev/null || true

echo -e "${GREEN}✓ 应用启动完成${NC}"
echo ""

# ============================================
# 配置防火墙
# ============================================
echo -e "${YELLOW}配置防火墙...${NC}"
ufw allow 22/tcp 2>/dev/null || true
ufw allow 80/tcp 2>/dev/null || true
ufw allow 443/tcp 2>/dev/null || true
ufw allow 3000/tcp 2>/dev/null || true
echo "y" | ufw enable 2>/dev/null || true
echo -e "${GREEN}✓ 防火墙配置完成${NC}"
echo ""

# ============================================
# 完成
# ============================================
echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}   🎉 部署完成！${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo -e "${BLUE}访问地址: http://${SERVER_IP}:3000${NC}"
echo ""
echo -e "${YELLOW}数据库信息：${NC}"
echo "  数据库: chu_tea_db"
echo "  用户名: chu_tea_user"
echo "  密码: chutea2025"
echo ""
echo -e "${YELLOW}常用命令：${NC}"
echo "  查看状态: pm2 status"
echo "  查看日志: pm2 logs chu-tea"
echo "  重启应用: pm2 restart chu-tea"
echo ""
echo -e "${YELLOW}下一步配置：${NC}"
echo "  1. 编辑 /var/www/chu-tea/.env 配置Telegram Bot Token"
echo "  2. 配置域名和SSL证书"
echo ""
echo -e "${GREEN}部署成功！${NC}"
