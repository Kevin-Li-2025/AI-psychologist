import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import './WelcomeScreen.css';

const WelcomeScreen = ({ onStartSession }) => {
    const { t, language, changeLanguage, availableLanguages } = useTranslation();
    const [name, setName] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState('👤');
    const [selectedTherapistStyle, setSelectedTherapistStyle] = useState('gentle');
    const [currentStep, setCurrentStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(true);

    // 用户头像选项
    const avatarOptions = [
        '👤', '😊', '🙂', '😌', '🤗', '🧠', '💫', '🌟',
        '👨', '👩', '🧑', '👦', '👧', '🦸‍♀️', '🦸‍♂️', '🧝‍♀️',
        '🐱', '🐶', '🦊', '🐼', '🦋', '🌸', '🌺', '💎'
    ];

    // AI咨询师风格选项
    const therapistStyles = [
        {
            id: 'gentle',
            name: t('welcome.therapistStyles.gentle.name'),
            description: t('welcome.therapistStyles.gentle.description'),
            emoji: '🌸'
        },
        {
            id: 'professional',
            name: t('welcome.therapistStyles.professional.name'),
            description: t('welcome.therapistStyles.professional.description'),
            emoji: '🧠'
        },
        {
            id: 'encouraging',
            name: t('welcome.therapistStyles.encouraging.name'),
            description: t('welcome.therapistStyles.encouraging.description'),
            emoji: '🌟'
        },
        {
            id: 'wise',
            name: t('welcome.therapistStyles.wise.name'),
            description: t('welcome.therapistStyles.wise.description'),
            emoji: '🦉'
        }
    ];

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsAnimating(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onStartSession({
                name: name.trim(),
                avatar: selectedAvatar,
                therapistStyle: selectedTherapistStyle
            });
        }
    };

    const welcomeSteps = [
        {
            icon: '🌱',
            title: '欢迎来到心灵治愈空间',
            subtitle: '这里是你的安全港湾',
            description: '在这个温暖的空间里，你可以自由地表达内心的感受，无需担心被评判。'
        },
        {
            icon: '💚',
            title: '专业的AI心理支持',
            subtitle: '24小时陪伴你的成长',
            description: '我运用专业的心理学知识，为你提供个性化的支持和指导。'
        },
        {
            icon: '🌟',
            title: '开始你的治愈之旅',
            subtitle: '每一步都值得被珍视',
            description: '让我们一起探索内心，发现属于你的力量和智慧。'
        }
    ];

    const nextStep = () => {
        if (currentStep < welcomeSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className="welcome-screen">
            <div className="welcome-container">
                <div className="welcome-content">
                    {/* 语言切换 */}
                    <div className="language-selector">
                        {availableLanguages.map((lang) => (
                            <button
                                key={lang.code}
                                className={`language-btn ${language === lang.code ? 'active' : ''}`}
                                onClick={() => changeLanguage(lang.code)}
                            >
                                {lang.nativeName}
                            </button>
                        ))}
                    </div>

                    {/* Logo */}
                    <div className="logo-section">
                        <div className="logo-icon">👩‍⚕️</div>
                        <h1 className="app-title">{t('welcome.title')}</h1>
                        <p className="app-subtitle">{t('welcome.subtitle')}</p>
                    </div>

                    {/* 简介 */}
                    <div className="intro-section">
                        <p className="intro-text">
                            {t('welcome.description')}
                        </p>
                    </div>

                    {/* 设置表单 */}
                    <form onSubmit={handleSubmit} className="setup-form">
                        {/* 姓名输入 */}
                        <div className="input-group">
                            <label htmlFor="name" className="input-label">
                                {t('welcome.nameLabel')}
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t('welcome.namePlaceholder')}
                                className="name-input"
                                maxLength={20}
                                required
                            />
                        </div>

                        {/* 头像选择 */}
                        <div className="input-group">
                            <label className="input-label">
                                {t('welcome.avatarLabel')}
                            </label>
                            <div className="avatar-grid">
                                {avatarOptions.map((avatar, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className={`avatar-option ${selectedAvatar === avatar ? 'selected' : ''}`}
                                        onClick={() => setSelectedAvatar(avatar)}
                                    >
                                        {avatar}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* AI风格选择 */}
                        <div className="input-group">
                            <label className="input-label">
                                {t('welcome.styleLabel')}
                            </label>
                            <div className="style-grid">
                                {therapistStyles.map((style) => (
                                    <button
                                        key={style.id}
                                        type="button"
                                        className={`style-option ${selectedTherapistStyle === style.id ? 'selected' : ''}`}
                                        onClick={() => setSelectedTherapistStyle(style.id)}
                                    >
                                        <div className="style-emoji">{style.emoji}</div>
                                        <div className="style-content">
                                            <div className="style-name">{style.name}</div>
                                            <div className="style-description">{style.description}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!name.trim()}
                            className="start-button"
                        >
                            {t('welcome.startButton')}
                        </button>
                    </form>

                    {/* 简单特性 */}
                    <div className="features-simple">
                        <span className="feature">🔒 {t('welcome.features.privacy')}</span>
                        <span className="feature">💚 {t('welcome.features.professional')}</span>
                        <span className="feature">🌟 {t('welcome.features.available')}</span>
                    </div>

                    {/* 免责声明 */}
                    <div className="disclaimer-simple">
                        <small>
                            {t('welcome.disclaimer')}
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeScreen;
