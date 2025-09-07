# 双语功能说明 / Bilingual Features Guide

## 概述 / Overview

心灵治愈师现已支持中英双语，为用户提供更好的国际化体验。

The Mind Healer now supports both Chinese and English, providing a better internationalized experience for users.

## 功能特性 / Features

### 🌐 语言切换 / Language Switching
- **欢迎界面**：右上角语言切换按钮
- **治疗界面**：头部工具栏中的语言切换按钮
- **实时切换**：无需刷新页面即可切换语言
- **持久化**：语言选择会保存在本地存储中

- **Welcome Screen**: Language toggle buttons in the top-right corner
- **Therapy Interface**: Language toggle buttons in the header toolbar
- **Real-time Switching**: Switch languages without page refresh
- **Persistence**: Language choice is saved in local storage

### 🎯 支持的语言 / Supported Languages
- **中文 (zh)**: 简体中文界面和AI回复
- **English (en)**: English interface and AI responses

### 📱 界面翻译 / Interface Translation
- ✅ 欢迎界面完全翻译
- ✅ 治疗师界面完全翻译
- ✅ 治愈功能面板完全翻译
- ✅ 所有按钮和提示文本
- ✅ 错误消息和状态提示

- ✅ Welcome screen fully translated
- ✅ Therapist interface fully translated
- ✅ Healing features panel fully translated
- ✅ All buttons and hint texts
- ✅ Error messages and status indicators

### 🤖 AI双语支持 / AI Bilingual Support
- **智能语言检测**：AI会根据当前语言设置回复
- **个性化提示**：系统提示词支持双语
- **情绪识别**：情绪状态显示支持双语
- **治疗建议**：所有治疗活动和建议支持双语

- **Smart Language Detection**: AI responds according to current language setting
- **Personalized Prompts**: System prompts support bilingual
- **Emotion Recognition**: Emotion state display supports bilingual
- **Therapy Suggestions**: All therapeutic activities and suggestions support bilingual

## 技术实现 / Technical Implementation

### 🏗️ 架构 / Architecture
```
src/
├── i18n/
│   ├── index.js          # 国际化核心系统 / I18n core system
│   └── locales/
│       ├── zh.json       # 中文翻译 / Chinese translations
│       └── en.json       # 英文翻译 / English translations
├── hooks/
│   └── useTranslation.js # 翻译Hook / Translation hook
└── services/
    └── systemPrompts.js  # 双语AI提示 / Bilingual AI prompts
```

### 🔧 使用方法 / Usage

#### 在组件中使用翻译 / Using Translation in Components
```javascript
import { useTranslation } from '../hooks/useTranslation';

const MyComponent = () => {
    const { t, language, changeLanguage } = useTranslation();
    
    return (
        <div>
            <h1>{t('welcome.title')}</h1>
            <button onClick={() => changeLanguage('en')}>
                English
            </button>
        </div>
    );
};
```

#### 添加新的翻译 / Adding New Translations
1. 在 `zh.json` 中添加中文翻译
2. 在 `en.json` 中添加对应的英文翻译
3. 使用 `t('key.path')` 在组件中调用

1. Add Chinese translation in `zh.json`
2. Add corresponding English translation in `en.json`
3. Use `t('key.path')` in components

### 🎨 样式适配 / Style Adaptation
- 语言切换按钮使用玻璃质感设计
- 支持响应式布局
- 保持原有的治愈系UI风格

- Language toggle buttons use glassmorphism design
- Supports responsive layout
- Maintains original healing UI style

## 测试 / Testing

### 🧪 功能测试 / Functional Testing
1. **语言切换测试**：
   - 在欢迎界面切换语言
   - 在治疗界面切换语言
   - 验证所有文本是否正确翻译

2. **AI回复测试**：
   - 用中文与AI对话，验证回复语言
   - 用英文与AI对话，验证回复语言
   - 测试情绪识别和治疗建议

3. **持久化测试**：
   - 刷新页面后语言设置是否保持
   - 重新打开应用后语言设置是否保持

### 🔍 浏览器兼容性 / Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 未来改进 / Future Improvements

### 🚀 计划功能 / Planned Features
- [ ] 更多语言支持（日语、韩语等）
- [ ] 语音识别多语言支持
- [ ] 文化适配的治疗建议
- [ ] 本地化的紧急联系信息

- [ ] More language support (Japanese, Korean, etc.)
- [ ] Multilingual voice recognition support
- [ ] Culturally adapted therapy suggestions
- [ ] Localized emergency contact information

### 🛠️ 技术优化 / Technical Optimization
- [ ] 懒加载翻译文件
- [ ] 翻译缓存优化
- [ ] 自动语言检测
- [ ] 翻译质量检查工具

- [ ] Lazy loading of translation files
- [ ] Translation cache optimization
- [ ] Automatic language detection
- [ ] Translation quality check tools

## 贡献 / Contributing

欢迎为双语功能贡献代码和翻译！

Welcome to contribute code and translations for bilingual features!

### 📝 翻译贡献 / Translation Contribution
1. Fork 项目 / Fork the project
2. 添加或修改翻译文件 / Add or modify translation files
3. 测试翻译质量 / Test translation quality
4. 提交 Pull Request / Submit Pull Request

---

**注意 / Note**: 此功能仍在持续改进中，如有问题请及时反馈。

This feature is still being continuously improved. Please provide feedback if you encounter any issues.
