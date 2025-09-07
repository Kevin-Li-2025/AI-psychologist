# 🌱 AI心灵治愈师 - 专业心理支持平台

一个基于腾讯混元大模型的智能心理治疗师应用，采用高级玻璃质感设计，为用户提供专业、温暖的心理健康支持。

## ✨ 主要特性

### 🧠 智能AI咨询师
- **专业心理学背景**：基于认知行为疗法(CBT)理论
- **个性化治疗风格**：温柔细腻、专业严谨、积极鼓励、智慧长者四种风格
- **情感智能**：实时情绪检测和分析
- **永久记忆系统**：记住每次对话，建立长期治疗关系

### 🎨 高级玻璃质感设计
- **透明绿色主题**：舒缓的渐变背景
- **玻璃拟态效果**：backdrop-filter + 多层透明度
- **动态光效**：shimmer动画和glow效果
- **响应式设计**：完美适配所有设备

### 👤 个性化体验
- **24种头像选择**：表情、人物、动物、符号等
- **自定义用户资料**：个人化的治疗体验
- **治疗师风格调节**：根据偏好选择AI回应风格
- **情绪可视化**：实时情绪状态追踪

### 🛡️ 安全与隐私
- **完全保密**：所有对话数据本地存储
- **安全加固**：helmet安全中间件保护
- **数据加密**：敏感信息加密存储
- **隐私保护**：无第三方数据泄露

## 🚀 技术栈

### 前端
- **React 18**：现代化用户界面
- **Vite**：快速构建工具
- **CSS3**：高级玻璃质感效果
- **响应式设计**：移动端友好

### 后端
- **Node.js + Express**：高性能服务器
- **腾讯混元大模型**：专业AI对话能力
- **永久记忆系统**：本地文件存储
- **RAG增强**：检索增强生成

### 核心功能
- **情绪分析引擎**：智能情感识别
- **人格化系统**：AI拟人化体验
- **治愈活动**：呼吸练习、正念冥想等
- **危机检测**：自动识别风险信号

## 📦 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装步骤

1. **克隆仓库**
```bash
git clone https://github.com/Kevin-Li-2025/AI-psychologist.git
cd AI-psychologist
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

3. **环境配置**
```bash
# 复制环境变量模板
cp env.example .env

# 编辑.env文件，添加腾讯混元API密钥
nano .env
```

4. **启动应用**
```bash
# 构建前端
cd frontend && npm run build && cd ..

# 启动服务器
npm start
```

5. **访问应用**
打开浏览器访问：`http://localhost:3001`

## 🔧 配置说明

### 环境变量
```env
# 腾讯混元API配置
HUNYUAN_API_KEY=your_api_key_here
HUNYUAN_SECRET_ID=your_secret_id_here
HUNYUAN_SECRET_KEY=your_secret_key_here

# 服务器配置
PORT=3001
NODE_ENV=production

# 日志级别
LOG_LEVEL=info
```

### API密钥获取
1. 访问[腾讯云控制台](https://console.cloud.tencent.com/)
2. 开通混元大模型服务
3. 获取API密钥和访问凭证
4. 配置到.env文件中

## 🏗️ 项目结构

```
AI-psychologist/
├── frontend/                 # 前端应用
│   ├── src/
│   │   ├── components/       # React组件
│   │   │   ├── AdvancedUI/  # 高级UI组件
│   │   │   ├── TherapyInterface.jsx
│   │   │   ├── TherapyMessage.jsx
│   │   │   ├── TherapyInput.jsx
│   │   │   ├── WelcomeScreen.jsx
│   │   │   └── HealingFeatures.jsx
│   │   ├── services/         # 前端服务
│   │   │   ├── hunyuanApi.js
│   │   │   ├── ragService.js
│   │   │   └── systemPrompts.js
│   │   └── App.jsx
│   ├── public/
│   └── package.json
├── server/                   # 后端服务
│   ├── services/
│   │   ├── PersistentMemoryService.js
│   │   └── PersonalityService.js
│   └── utils/
│       ├── logger.js
│       └── index.js
├── data/                     # 数据存储目录
├── server.js                 # 主服务器文件
├── package.json
└── README.md
```

## 🎯 核心功能详解

### 永久记忆系统
- **情节记忆**：记录具体对话事件
- **语义记忆**：存储概念和知识
- **情感记忆**：保存情绪体验
- **关系记忆**：追踪治疗关系发展

### AI人格系统
- **真实姓名**：苏心怡博士
- **专业背景**：心理学博士，丰富临床经验
- **性格特质**：五大人格维度动态调整
- **情感状态**：会被用户情绪影响

### 治愈功能
- **呼吸练习**：4-7-8呼吸法
- **正念冥想**：5分钟引导练习
- **感恩练习**：积极心理学技巧
- **情绪日记**：自我探索工具

## 🔒 安全特性

- **请求限流**：防止API滥用
- **错误处理**：全局异常捕获
- **数据验证**：输入安全检查
- **日志监控**：详细操作记录

## 📱 移动端优化

- **响应式布局**：完美适配手机和平板
- **触摸友好**：优化的交互体验
- **性能优化**：懒加载和代码分割
- **离线支持**：基础功能离线可用

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [腾讯混元大模型](https://cloud.tencent.com/product/hunyuan) - 提供强大的AI对话能力
- [React](https://reactjs.org/) - 优秀的前端框架
- [Express](https://expressjs.com/) - 可靠的后端框架

## 📞 联系方式

- 项目维护者：Kevin Li
- GitHub：[@Kevin-Li-2025](https://github.com/Kevin-Li-2025)
- 项目链接：[https://github.com/Kevin-Li-2025/AI-psychologist](https://github.com/Kevin-Li-2025/AI-psychologist)

---

**⚠️ 免责声明**：此AI助手提供支持性对话，不能替代专业心理治疗。如遇紧急情况，请立即联系专业心理健康服务。

💚 **让技术温暖人心，用AI传递关爱** 💚