# 🌱 Heart Healing Therapist - AI-Powered Mental Health Support Platform

An intelligent psychological therapy assistant powered by Tencent's Hunyuan Large Language Model, featuring advanced glassmorphism design to provide professional, warm mental health support.

## 🖼️ Screenshots

### Bilingual Support
<div align="center">
  <img src="images/ChineseInterface.jpg" alt="Chinese Interface" width="600"/>
  <img src="images/EnglishInterface.jpg" alt="English Interface" width="600"/>
</div>
<div align="center">
  <p><strong>🌏 中文界面 (Chinese Interface)</strong></p>
  <p>支持完整的中文交互体验，包括文化适应性心理咨询、专业心理学术语翻译、情感表达本地化</p>
  <p><strong>🌍 英文界面 (English Interface)</strong></p>
  <p>提供原生英文支持，保持专业心理咨询标准，同时支持中英无缝切换</p>
  <p><em>🎯 双语智能切换：系统自动检测用户语言偏好，提供无缝的多语言体验</em></p>
</div>

### Welcome Experience
<div align="center">
  <img src="images/WelcomePage.jpg" alt="Welcome Screen" width="700"/>
</div>
<div align="center">
  <p><strong>🎨 个性化入驻体验 (Personalized Onboarding)</strong></p>
  <p>🌟 <strong>24个精美头像选择</strong>：涵盖表情符号、卡通人物、动物形象，满足不同用户的个性化需求</p>
  <p>👤 <strong>治疗师风格定制</strong>：四种专业治疗风格可选 - 温柔关怀、专业严谨、积极鼓励、智慧经验</p>
  <p>🎯 <strong>智能用户画像</strong>：基于用户偏好自动推荐最适合的治疗师风格和头像</p>
  <p><em>💚 温暖的开始：从第一刻起就营造温馨、专业的心理咨询氛围</em></p>
</div>

## ✨ Key Features

### 🧠 Intelligent AI Therapist
- **Professional Psychology Background**: Based on Cognitive Behavioral Therapy (CBT) principles
- **Personalized Therapy Styles**: Four distinct approaches - Gentle & Caring, Professional & Rigorous, Positive & Encouraging, Wise & Experienced
- **Emotional Intelligence**: Real-time emotion detection and analysis
- **Persistent Memory System**: Remembers every conversation to build long-term therapeutic relationships
- **RAG (Retrieval-Augmented Generation)**: Enhances AI responses with contextual memory and emotion analysis

### 🎨 Advanced Glassmorphism Design
- **Transparent Green Theme**: Soothing gradient backgrounds for relaxation
- **Glass Morphism Effects**: Backdrop-filter with multi-layer transparency
- **Dynamic Light Effects**: Shimmer animations and glow effects
- **Responsive Design**: Perfect adaptation across all devices

### 👤 Personalized Experience
- **24 Avatar Options**: Expressions, characters, animals, and symbols
- **Custom User Profiles**: Personalized therapeutic experience
- **Therapist Style Adjustment**: Choose AI response style based on preferences
- **Emotion Visualization**: Real-time emotional state tracking

### 🛡️ Security & Privacy
- **Complete Confidentiality**: All conversation data stored locally
- **Security Hardening**: Helmet security middleware protection
- **Data Encryption**: Sensitive information encrypted storage
- **Privacy Protection**: No third-party data leakage

### 🌐 Bilingual Support
- **Full Chinese/English Support**: Complete localization
- **Language Switching**: Seamless language transitions
- **Cultural Adaptation**: Culturally appropriate responses
- **Professional Translation**: High-quality therapeutic terminology

## 🚀 Technology Stack

### Frontend
- **React 18**: Modern user interface
- **Vite**: Fast build tool
- **CSS3**: Advanced glassmorphism effects
- **Responsive Design**: Mobile-first approach
- **i18n**: Internationalization support

### Backend
- **Node.js + Express**: High-performance server with RESTful API architecture
- **Tencent Hunyuan LLM**: Advanced large language model for natural, empathetic conversations
- **Persistent Memory System**: Multi-layered memory storage with episodic, semantic, and emotional memory types
- **RAG Enhancement**: Intelligent context retrieval and response augmentation for personalized therapy

### Core Features
- **Emotion Analysis Engine**: Advanced sentiment analysis with 9 emotion types, intensity scoring, and pattern recognition
- **Personality System**: Dynamic AI personality with Big Five traits and therapeutic style adaptation
- **Healing Activities**: Interactive breathing exercises (4-7-8 technique), 5-minute mindfulness meditation, and gratitude journaling
- **Crisis Detection**: Real-time crisis signal monitoring with risk level assessment and emergency response protocols
- **Memory Consolidation**: Intelligent memory management with importance scoring and automatic cleanup
- **Context Preservation**: Multi-language conversation context maintenance across sessions

## 📦 Quick Start

### Prerequisites
- Node.js >= 16.0.0
- npm >= 8.0.0

### Installation

1. **Clone Repository**
```bash
git clone https://github.com/Kevin-Li-2025/AI-psychologist.git
cd AI-psychologist
```

2. **Install Dependencies**
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

3. **Environment Configuration**
```bash
# Copy environment template
cp env.example .env

# Edit .env file and add your Tencent Hunyuan API keys
nano .env
```

4. **Start Application**
```bash
# Build frontend
cd frontend && npm run build && cd ..

# Start server
npm start
```

5. **Access Application**
Open your browser and visit: `http://localhost:3001`

## 🔧 Configuration

### Environment Variables
```env
# Tencent Hunyuan API Configuration
HUNYUAN_API_KEY=your_api_key_here
HUNYUAN_SECRET_ID=your_secret_id_here
HUNYUAN_SECRET_KEY=your_secret_key_here

# Server Configuration
PORT=3001
NODE_ENV=production

# Logging Level
LOG_LEVEL=info
```

### API Key Setup
1. Visit [Tencent Cloud Console](https://console.cloud.tencent.com/)
2. Enable Hunyuan Large Model service
3. Obtain API keys and access credentials
4. Configure in .env file

## 🏗️ Project Structure

```
AI-psychologist/
├── frontend/                 # Frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── AdvancedUI/  # Advanced UI components
│   │   │   ├── TherapyInterface.jsx
│   │   │   ├── TherapyMessage.jsx
│   │   │   ├── TherapyInput.jsx
│   │   │   ├── WelcomeScreen.jsx
│   │   │   └── HealingFeatures.jsx
│   │   ├── hooks/           # Custom hooks
│   │   │   └── useTranslation.js
│   │   ├── i18n/            # Internationalization
│   │   │   ├── index.js
│   │   │   └── locales/
│   │   │       ├── en.json
│   │   │       └── zh.json
│   │   ├── services/         # Frontend services
│   │   │   ├── hunyuanApi.js
│   │   │   ├── ragService.js
│   │   │   └── systemPrompts.js
│   │   └── App.jsx
│   ├── public/
│   └── package.json
├── server/                   # Backend services
│   ├── services/
│   │   ├── PersistentMemoryService.js
│   │   └── PersonalityService.js
│   └── utils/
│       ├── logger.js
│       └── index.js
├── data/                     # Data storage directory
├── images/                   # Screenshots and assets
├── server.js                 # Main server file
├── package.json
└── README.md
```

## 🎯 Core Features Deep Dive

### Persistent Memory System
- **Episodic Memory**: Records specific conversation events with timestamps, emotional context, and therapeutic insights
- **Semantic Memory**: Stores learned concepts, coping strategies, and therapeutic knowledge with confidence scores
- **Emotional Memory**: Preserves emotional experiences, triggers, and resolution patterns for personalized therapy
- **Relationship Memory**: Tracks therapeutic alliance development, trust levels, and milestone achievements
- **Procedural Memory**: Stores learned coping mechanisms and behavioral patterns
- **Autobiographical Memory**: Maintains user's personal history and significant life events

### RAG (Retrieval-Augmented Generation) System
- **Contextual Memory Retrieval**: Dynamically retrieves relevant conversation history and emotional patterns
- **Emotion Analysis Engine**: Advanced sentiment analysis with intensity scoring and pattern recognition
- **Therapeutic Context Enhancement**: Augments AI responses with personalized therapeutic insights
- **Real-time Crisis Detection**: Automatic identification of crisis signals and risk assessment
- **Multi-language Context Preservation**: Maintains conversational context across language switches
- **Adaptive Response Generation**: Tailors therapeutic responses based on user's emotional state and history

### AI Personality System
- **Real Name**: Dr. Sophie (苏心怡)
- **Professional Background**: PhD in Psychology with rich clinical experience
- **Personality Traits**: Big Five personality dimensions with dynamic adjustment
- **Emotional State**: Influenced by user emotions

### Healing Features
- **Breathing Exercises**: 4-7-8 breathing technique
- **Mindfulness Meditation**: 5-minute guided practice
- **Gratitude Practice**: Positive psychology techniques
- **Emotion Journaling**: Self-exploration tools

### Bilingual Capabilities
- **Language Detection**: Automatic language identification
- **Context Preservation**: Maintains context across language switches
- **Cultural Sensitivity**: Culturally appropriate therapeutic approaches
- **Professional Terminology**: Accurate psychological terms in both languages

### Technical Implementation Details

#### RAG (Retrieval-Augmented Generation) Architecture
The RAG system enhances therapeutic conversations through intelligent context retrieval:

**Emotion Analysis Pipeline:**
- Multi-language emotion keyword dictionaries (Chinese & English)
- Intensity scoring algorithms with contextual modifiers
- Pattern recognition for emotional trajectories
- Crisis signal detection with risk assessment

**Context Retrieval Engine:**
- Semantic similarity matching for relevant memory retrieval
- Time-weighted relevance scoring (recent memories prioritized)
- Emotional context preservation across sessions
- Multi-modal memory integration (text, emotion, therapy context)

**Response Augmentation:**
- Dynamic prompt engineering based on user emotional state
- Therapeutic technique selection based on historical effectiveness
- Cultural context adaptation for Chinese/English responses
- Crisis intervention protocol activation

#### Persistent Memory System Architecture
Multi-layered memory storage with intelligent consolidation:

**Memory Types:**
- **Episodic Memory**: Conversation events with timestamps, emotional context, and therapeutic insights
- **Semantic Memory**: Learned concepts with confidence scores and associations
- **Emotional Memory**: Emotion patterns, triggers, and resolution strategies
- **Procedural Memory**: Coping mechanisms and behavioral adaptations
- **Relationship Memory**: Therapeutic alliance metrics and milestone tracking

**Memory Management:**
- Automatic consolidation based on importance scoring
- Time-decay algorithms for memory relevance
- Periodic cleanup of outdated or low-importance memories
- Cross-referencing between memory types for comprehensive context

**Data Persistence:**
- JSON-based storage with atomic write operations
- Memory caching for performance optimization
- Backup and recovery mechanisms
- Privacy-compliant data handling with local storage

## 🔒 Security Features

- **Rate Limiting**: Prevents API abuse
- **Error Handling**: Global exception catching
- **Data Validation**: Input security checks
- **Logging Monitoring**: Detailed operation records
- **HTTPS Encryption**: Secure data transmission
- **CORS Protection**: Cross-origin request security

## 📱 Mobile Optimization

- **Responsive Layout**: Perfect fit for phones and tablets
- **Touch-Friendly**: Optimized interaction experience
- **Performance Optimization**: Lazy loading and code splitting
- **Offline Support**: Basic functionality available offline

## 🚨 Important Notice

**This AI assistant provides supportive conversation and cannot replace professional psychological therapy. In case of emergency, please contact immediately:**

- **Crisis Hotline**: 988 (US), 400-161-9995 (China)
- **24-Hour Mental Health Support**: Local emergency services
- **Emergency Medical Services**: 911 (US), 120 (China)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow ESLint and Prettier configurations
- Write comprehensive tests
- Update documentation for new features
- Ensure bilingual support for UI changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Tencent Hunyuan LLM](https://cloud.tencent.com/product/hunyuan) - Powerful AI conversation capabilities
- [React](https://reactjs.org/) - Excellent frontend framework
- [Express](https://expressjs.com/) - Reliable backend framework
- All contributors and users for their support

## 📞 Contact

- Project Maintainer: Kevin Li
- GitHub: [@Kevin-Li-2025](https://github.com/Kevin-Li-2025)
- Project Link: [https://github.com/Kevin-Li-2025/AI-psychologist](https://github.com/Kevin-Li-2025/AI-psychologist)

---

**💚 Let technology warm hearts, use AI to convey care 💚**

*Building with heart, healing with love*