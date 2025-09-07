# LocalCursor - 快速安装指南

本指南将帮助你快速设置并运行 LocalCursor 自主编程 IDE。

## 📋 系统要求

- **Node.js**: 18.0+ (推荐 18.17+)
- **npm**: 9.0+ 或 **yarn**: 1.22+
- **操作系统**: macOS, Linux, Windows 10/11
- **内存**: 最少 4GB RAM (推荐 8GB+)
- **存储**: 最少 1GB 可用空间

## 🚀 快速开始

### 1. 获取腾讯混元 API Key

1. 访问 [腾讯云混元控制台](https://console.cloud.tencent.com/hunyuan)
2. 注册/登录账户
3. 创建 API Key
4. 复制你的 API Key

### 2. 安装和配置

```bash
# 克隆项目
git clone <your-repo-url>
cd hunyuan

# 一键安装所有依赖
npm run install-all

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，设置你的 HUNYUAN_API_KEY
```

### 3. 启动应用

#### 开发模式 (推荐)
```bash
# 同时启动前后端开发服务器
npm run dev
```

#### 或分别启动服务
```bash
# 终端 1 - 启动后端服务器
npm run dev-server

# 终端 2 - 启动前端服务器  
npm run dev-client
```

### 4. 访问应用

打开浏览器访问: http://localhost:3000

## ⚙️ 环境变量配置

编辑 `.env` 文件：

```bash
# 服务器配置
PORT=3001
NODE_ENV=development

# 腾讯混元AI配置 (必需)
HUNYUAN_API_KEY=your_api_key_here
HUNYUAN_BASE_URL=https://api.hunyuan.cloud.tencent.com/v1

# 客户端配置
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_WS_URL=http://localhost:3001

# 工作空间目录
WORKSPACE_DIR=./workspace
```

## 🧪 测试

```bash
# 运行所有测试
npm test

# 运行服务器测试
npm run test-server

# 运行客户端测试
npm run test-client
```

## 🐳 Docker 部署

```bash
# 构建镜像
docker build -t localcursor .

# 使用 Docker Compose 运行
docker-compose up -d

# 查看日志
docker-compose logs -f
```

## 📁 项目结构

```
LocalCursor/
├── server/                 # 后端服务
│   ├── index.js           # 主服务器
│   ├── routes/            # API路由
│   ├── services/          # 业务服务  
│   └── utils/             # 工具函数
├── client/                # 前端应用
│   ├── src/
│   │   ├── components/    # React组件
│   │   └── services/      # API服务
├── workspace/             # 项目工作目录
├── logs/                  # 日志目录
└── docker-compose.yml     # Docker配置
```

## 🔧 常见问题

### 问题 1: API Key 错误
- 检查 `.env` 文件中的 `HUNYUAN_API_KEY` 是否正确
- 确保 API Key 有效且有足够余额

### 问题 2: 端口被占用
```bash
# 查看端口占用
lsof -i :3001
lsof -i :3000

# 修改端口 (在 .env 中)
PORT=3002
```

### 问题 3: 依赖安装失败
```bash
# 清理缓存重新安装
npm run clean
npm run install-all

# 或使用 yarn
yarn install
```

### 问题 4: 权限问题 (Linux/Mac)
```bash
# 修复权限
sudo chown -R $USER:$USER .
chmod +x start.sh
```

## 📝 开发说明

### 添加新功能
1. 后端路由: `server/routes/`
2. 前端组件: `client/src/components/`
3. API服务: `client/src/services/`

### 代码规范
- 使用 ESLint 进行代码检查
- 遵循 Airbnb 代码规范
- 提交前运行测试

### 环境说明
- **开发**: `npm run dev` - 热重载
- **生产**: `npm run build-production` - 优化构建
- **测试**: `npm test` - 运行测试套件

## 🆘 获取帮助

1. 查看控制台错误信息
2. 检查 `logs/` 目录下的日志文件
3. 访问项目 Issues 页面
4. 联系技术支持

## 🎉 开始使用

安装完成后，你就可以：

1. 🏗️ 创建新项目
2. 🤖 使用AI助手进行对话
3. 📝 编辑代码文件  
4. ⚡ 执行自主编程任务
5. 💻 使用内置终端

祝你编程愉快！ 🚀
