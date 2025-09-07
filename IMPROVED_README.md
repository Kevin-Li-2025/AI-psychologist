# 🌱 心灵治愈师 - AI驱动的心理健康支持平台

一个基于腾讯混元大模型的智能心理治疗助手，提供24/7的专业心理支持服务。

## ✨ 主要特性

### 🧠 智能对话系统
- **腾讯混元大模型**：采用先进的AI技术，提供自然、温暖的对话体验
- **情绪识别**：智能分析用户情绪状态，提供个性化回应
- **上下文记忆**：RAG技术增强的对话记忆，确保连贯的治疗体验
- **危机检测**：自动识别心理危机信号，及时提供专业建议

### 💚 治疗功能
- **情绪追踪**：实时监测和分析用户情绪变化
- **呼吸练习**：4-7-8呼吸法指导，帮助缓解焦虑
- **正念冥想**：引导式冥想练习
- **感恩日记**：培养积极心态的感恩练习
- **渐进放松**：肌肉放松技巧指导

### 🎨 用户体验
- **温暖界面**：治愈系设计风格，营造安全舒适的环境
- **响应式设计**：完美适配桌面、平板和手机设备
- **无障碍支持**：符合WCAG标准，支持屏幕阅读器
- **深色模式**：自动适应系统主题偏好

### 🔒 隐私安全
- **完全保密**：所有对话数据本地处理，不存储敏感信息
- **安全传输**：HTTPS加密通信
- **匿名化**：用户身份完全匿名化处理

## 🚀 快速开始

### 环境要求

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0 或 **yarn** >= 1.22.0
- **现代浏览器**（Chrome 90+, Firefox 88+, Safari 14+, Edge 90+）

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd hunyuan
```

2. **安装依赖**
```bash
# 安装后端依赖
npm install

# 安装前端依赖
cd frontend
npm install
cd ..
```

3. **配置环境**
```bash
# 复制环境配置文件
cp .env.example .env

# 编辑配置文件，添加你的腾讯混元API密钥
nano .env
```

4. **构建前端**
```bash
cd frontend
npm run build
cd ..
```

5. **启动服务**
```bash
npm start
```

6. **访问应用**
打开浏览器访问 `http://localhost:3001`

### 开发模式

如果你想进行开发，可以同时启动前后端开发服务器：

```bash
# 终端1：启动后端
npm run dev

# 终端2：启动前端开发服务器
cd frontend
npm run dev
```

## 📁 项目结构

```
hunyuan/
├── frontend/                 # 前端React应用
│   ├── src/
│   │   ├── components/       # React组件
│   │   │   ├── ErrorBoundary.jsx    # 错误边界
│   │   │   ├── LoadingSpinner.jsx   # 加载动画
│   │   │   ├── TherapyInterface.jsx # 主治疗界面
│   │   │   ├── WelcomeScreen.jsx    # 欢迎页面
│   │   │   ├── HealingFeatures.jsx  # 治疗功能
│   │   │   ├── TherapyMessage.jsx   # 消息组件
│   │   │   └── TherapyInput.jsx     # 输入组件
│   │   ├── services/         # 服务层
│   │   │   ├── hunyuanApi.js        # API调用
│   │   │   ├── ragService.js        # RAG服务
│   │   │   └── systemPrompts.js     # 系统提示词
│   │   └── App.jsx          # 主应用组件
│   ├── public/              # 静态资源
│   └── package.json         # 前端依赖
├── server/                  # 后端服务
│   ├── utils/               # 工具函数
│   │   ├── index.js         # 通用工具
│   │   └── logger.js        # 日志系统
│   └── routes/              # API路由
├── server.js                # 主服务器文件
├── package.json             # 后端依赖
└── README.md               # 项目文档
```

## 🔧 配置说明

### 环境变量

创建 `.env` 文件并配置以下变量：

```env
# 服务器配置
PORT=3001
NODE_ENV=development

# 腾讯混元API配置
HUNYUAN_API_KEY=your_api_key_here
HUNYUAN_BASE_URL=https://api.hunyuan.cloud.tencent.com/v1
HUNYUAN_MODEL=hunyuan-lite

# 日志配置
LOG_LEVEL=info
LOG_DIR=logs

# 安全配置
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CHAT_RATE_LIMIT_WINDOW_MS=60000
CHAT_RATE_LIMIT_MAX_REQUESTS=10
```

### API配置

在 `server.js` 中配置腾讯混元API：

```javascript
const HUNYUAN_CONFIG = {
    apiKey: process.env.HUNYUAN_API_KEY,
    baseURL: process.env.HUNYUAN_BASE_URL,
    model: process.env.HUNYUAN_MODEL
};
```

## 📊 功能详解

### RAG增强对话系统

我们的RAG（Retrieval-Augmented Generation）服务提供：

- **对话记忆**：保存最近50条对话，维持上下文连贯性
- **情绪分析**：实时分析用户情绪状态和强度
- **模式识别**：识别用户的情绪变化模式
- **个性化建议**：根据用户状态提供定制化治疗建议
- **危机预警**：检测自杀倾向等危机信号

### 智能情绪识别

系统能够识别以下情绪类型：
- 😊 积极情绪：开心、满足、感恩等
- 😔 消极情绪：难过、焦虑、愤怒等
- 🤔 中性情绪：困惑、疲惫等
- 🆘 危机信号：自杀倾向、自残等

### 治疗活动模块

1. **呼吸练习**
   - 4-7-8呼吸法
   - 实时指导动画
   - 进度追踪

2. **正念冥想**
   - 引导式冥想
   - 专注力训练
   - 身心放松

3. **情绪日记**
   - 情绪记录
   - 模式分析
   - 成长追踪

4. **感恩练习**
   - 积极心理学
   - 感恩日记
   - 心态调整

## 🛡️ 安全特性

### 数据保护
- 所有敏感数据仅在内存中处理
- 24小时后自动清理会话数据
- 不存储用户个人身份信息

### 网络安全
- Helmet.js安全头部
- CORS跨域保护
- 请求频率限制
- 输入验证和清理

### 错误处理
- 全局错误边界
- 优雅降级
- 详细错误日志
- 用户友好的错误提示

## 📱 响应式设计

### 断点设置
- **桌面**：1200px+
- **平板**：768px - 1199px
- **手机**：< 768px

### 适配特性
- 流式布局
- 触摸友好的交互
- 可访问性优化
- 性能优化

## 🔍 监控和日志

### 日志系统
- 结构化JSON日志
- 分级日志记录
- 自动日志轮转
- 错误追踪

### 性能监控
- API响应时间
- 错误率统计
- 用户行为分析
- 系统资源监控

## 🚀 部署指南

### Docker部署

1. **构建镜像**
```bash
docker build -t therapy-ai .
```

2. **运行容器**
```bash
docker run -d \
  --name therapy-ai \
  -p 3001:3001 \
  -e HUNYUAN_API_KEY=your_key \
  therapy-ai
```

### 传统部署

1. **准备服务器**
```bash
# 安装Node.js和PM2
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g pm2
```

2. **部署应用**
```bash
# 克隆代码
git clone <repository-url>
cd hunyuan

# 安装依赖
npm install
cd frontend && npm install && npm run build && cd ..

# 启动服务
pm2 start ecosystem.config.js
```

### 环境配置

生产环境建议配置：
- **反向代理**：Nginx
- **HTTPS**：Let's Encrypt
- **监控**：PM2 + Monit
- **日志**：ELK Stack

## 🤝 贡献指南

### 开发流程

1. **Fork项目**
2. **创建特性分支**
```bash
git checkout -b feature/amazing-feature
```

3. **提交更改**
```bash
git commit -m 'Add some amazing feature'
```

4. **推送分支**
```bash
git push origin feature/amazing-feature
```

5. **创建Pull Request**

### 代码规范

- **ESLint**：遵循Airbnb规范
- **Prettier**：代码格式化
- **Commit**：使用Conventional Commits
- **测试**：Jest + React Testing Library

### 问题报告

请使用GitHub Issues报告问题，包含：
- 问题描述
- 复现步骤
- 期望行为
- 环境信息
- 截图（如适用）

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🆘 支持和帮助

### 技术支持
- **GitHub Issues**：技术问题和bug报告
- **讨论区**：功能建议和使用交流

### 心理健康资源
- **心理危机热线**：400-161-9995
- **24小时心理援助**：400-161-9995
- **专业心理咨询**：建议寻求线下专业帮助

### 免责声明

⚠️ **重要提醒**：此AI助手仅提供支持性对话，不能替代专业心理治疗。如遇紧急情况或严重心理健康问题，请立即联系专业心理健康服务或紧急救助热线。

---

## 🙏 致谢

感谢以下开源项目和服务：
- [React](https://reactjs.org/) - 用户界面框架
- [Express.js](https://expressjs.com/) - 后端框架
- [腾讯混元](https://cloud.tencent.com/product/hunyuan) - AI大模型服务
- 所有贡献者和用户的支持

---

**用心构建，用爱治愈** 💚
