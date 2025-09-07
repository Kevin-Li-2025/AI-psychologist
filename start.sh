#!/bin/bash

echo "🚀 启动腾讯混元聊天网站..."
echo ""

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误：未找到 Node.js，请先安装 Node.js"
    exit 1
fi

# 检查npm
if ! command -v npm &> /dev/null; then
    echo "❌ 错误：未找到 npm，请先安装 npm"
    exit 1
fi

# 安装后端依赖（如果还没有安装）
if [ ! -d "node_modules" ]; then
    echo "📦 安装后端依赖..."
    npm install
fi

# 构建前端（如果还没有构建）
if [ ! -d "frontend/dist" ]; then
    echo "🔨 构建前端..."
    cd frontend
    npm install
    npm run build
    cd ..
fi

echo ""
echo "✅ 启动服务器..."
echo "📍 访问地址: http://localhost:3001"
echo "🤖 混元模型: hunyuan-lite (完全免费)"
echo ""

# 启动服务器
node server.js
