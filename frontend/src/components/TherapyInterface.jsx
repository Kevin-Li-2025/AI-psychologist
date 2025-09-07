import React, { useState, useEffect, useRef } from 'react';
import TherapyMessage from './TherapyMessage';
import TherapyInput from './TherapyInput';
import WelcomeScreen from './WelcomeScreen';
import HealingFeatures from './HealingFeatures';
import { callHunyuanAPI, formatMessage } from '../services/hunyuanApi';
import { ragService } from '../services/ragService';
import { generateGentleSystemPrompt } from '../services/systemPrompts';
import { useTranslation } from '../hooks/useTranslation';
import './TherapyInterface.css';

const TherapyInterface = () => {
    const { t, language, changeLanguage, availableLanguages } = useTranslation();
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [showWelcome, setShowWelcome] = useState(true);
    const [userName, setUserName] = useState('');
    const [userAvatar, setUserAvatar] = useState('👤');
    const [therapistStyle, setTherapistStyle] = useState('gentle');
    const [sessionStarted, setSessionStarted] = useState(false);
    const [showFeatures, setShowFeatures] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [currentEmotion, setCurrentEmotion] = useState('neutral');
    const [userId, setUserId] = useState(null);
    const messagesEndRef = useRef(null);
    const isProcessingRef = useRef(false);

    // 自动滚动到底部
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // 生成用户ID
    const generateUserId = (name) => {
        const timestamp = Date.now();
        return `user_${name.toLowerCase().replace(/\s+/g, '_')}_${timestamp}`;
    };

    // 开始治疗会话
    const startTherapySession = (userConfig) => {
        // 支持旧版本调用（只传name）和新版本（传config对象）
        if (typeof userConfig === 'string') {
            setUserName(userConfig);
            setUserAvatar('👤');
            setTherapistStyle('gentle');
        } else {
            setUserName(userConfig.name);
            setUserAvatar(userConfig.avatar || '👤');
            setTherapistStyle(userConfig.therapistStyle || 'gentle');
        }
        
        setShowWelcome(false);
        setSessionStarted(true);
        
        // 生成用户ID
        const actualName = typeof userConfig === 'string' ? userConfig : userConfig.name;
        const newUserId = generateUserId(actualName);
        setUserId(newUserId);
        
        // 初始化RAG会话
        const newSessionId = ragService.initializeSession(actualName);
        setSessionId(newSessionId);
        
        // 初始化情绪状态
        setCurrentEmotion('neutral');
        
        const welcomeMessage = {
            role: 'assistant',
            content: t('therapy.welcomeMessage', { userName: actualName }),
            timestamp: new Date().toISOString(),
            id: 'therapy-welcome',
            therapyType: 'welcome'
        };
        
        setMessages([welcomeMessage]);
        
        // 将欢迎消息添加到RAG记忆中
        ragService.addMessage(newSessionId, welcomeMessage);
        
        // 显示治愈功能
        setTimeout(() => {
            setShowFeatures(true);
        }, 3000);
    };

    // 简单的情绪检测函数
    const detectEmotion = (text) => {
        const emotionPatterns = {
            sad: ['难过', '伤心', '痛苦', '沮丧', '失落', '绝望', '哭'],
            happy: ['开心', '快乐', '高兴', '愉快', '兴奋', '满足', '幸福'],
            anxious: ['焦虑', '担心', '紧张', '害怕', '不安', '压力', '烦躁'],
            angry: ['愤怒', '生气', '恼火', '讨厌', '恨', '气愤'],
            confused: ['困惑', '迷茫', '不知道', '不明白', '纠结'],
            calm: ['平静', '放松', '安心', '宁静', '舒服']
        };

        let detectedEmotion = 'neutral';
        let maxScore = 0;

        Object.entries(emotionPatterns).forEach(([emotion, keywords]) => {
            const score = keywords.reduce((count, keyword) => {
                return count + (text.includes(keyword) ? 1 : 0);
            }, 0);
            
            if (score > maxScore) {
                maxScore = score;
                detectedEmotion = emotion;
            }
        });

        return { emotion: detectedEmotion, intensity: Math.min(maxScore * 30 + 30, 100) };
    };

    // 获取情绪显示文本
    const getEmotionDisplay = (emotion) => {
        return t(`emotions.${emotion}`) || t('emotions.neutral');
    };

    const handleSendMessage = async (content) => {
        if (!content.trim() || !sessionId || isLoading || isProcessingRef.current) return;
        
        isProcessingRef.current = true;

        // 简单的情绪检测
        const emotionData = detectEmotion(content);
        setCurrentEmotion(emotionData.emotion);

        // 添加用户消息
        const userMessage = formatMessage(content, 'user');
        
        // 将用户消息添加到RAG记忆中
        ragService.addMessage(sessionId, userMessage);
        
        setIsLoading(true);

        try {
            // 先添加用户消息到界面
            setMessages(prev => [...prev, userMessage]);
            setIsTyping(true);

            // 获取增强的上下文信息
            const enhancedContext = ragService.getEnhancedContext(sessionId);
            
            // 生成温柔的系统提示
            const systemPrompt = {
                role: 'system',
                content: generateGentleSystemPrompt(
                    userName, 
                    enhancedContext?.summary, 
                    enhancedContext?.emotionalState, 
                    enhancedContext?.recommendations
                )
            };

            // 使用当前messages状态加上新的用户消息来构建请求
            const currentMessages = [...messages, userMessage];
            const recentMessages = [
                systemPrompt,
                ...currentMessages.slice(-6).map(msg => ({
                    role: msg.role,
                    content: msg.content
                }))
            ];

            // 调用API，使用更高的温度值让回应更温柔自然
            const response = await callHunyuanAPI(recentMessages, {
                temperature: 0.9, // 提高温度让回应更温柔自然
                maxTokens: 800,   // 减少token数量提高响应速度
                userId: userId,
                sessionId: sessionId,
                userEmotion: currentEmotion
            });

            setIsTyping(false);

            // 添加AI回复
            const aiMessage = {
                ...formatMessage(response.content, 'assistant'),
                usage: response.usage,
                therapyType: 'response'
            };

            setMessages(prev => [...prev, aiMessage]);
            
            // 将AI回复添加到RAG记忆中
            ragService.addMessage(sessionId, aiMessage);

        } catch (error) {
            console.error('发送消息失败:', error);
            setIsTyping(false);

            const errorMessage = formatMessage(
                t('therapy.errorMessage', { userName }),
                'assistant'
            );
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            isProcessingRef.current = false;
        }
    };

    // 处理治愈功能选择
    const handleFeatureSelect = async (featureType, message) => {
        if (!sessionId) return;
        
        setShowFeatures(false);
        
        // 添加功能触发消息
        const featureMessage = {
            role: 'assistant',
            content: message,
            timestamp: new Date().toISOString(),
            id: `feature-${featureType}-${Date.now()}`,
            therapyType: 'feature'
        };
        
        setMessages(prev => [...prev, featureMessage]);
        ragService.addMessage(sessionId, featureMessage);
        
        // 根据功能类型提供后续指导
        setTimeout(async () => {
            let followUpMessage = '';
            
            switch (featureType) {
                case 'mood':
                    followUpMessage = `亲爱的${userName}，谢谢你愿意和我分享你的感受 💚 每一种情绪都是珍贵的，它们都在告诉我们内心的声音。无论是开心还是难过，都是你真实的一部分。你想和我聊聊是什么触动了你的心吗？我会温柔地倾听。`;
                    break;
                case 'gratitude':
                    followUpMessage = `感恩练习真的很美好呢 🌸 当我们用温柔的目光看待生活时，心中的花朵就会慢慢绽放。${userName}，你愿意和我分享一件让你心中感到温暖的事情吗？哪怕是很小很小的事情也没关系。`;
                    break;
                case 'mindfulness':
                    followUpMessage = `正念就像给心灵一个温柔的拥抱 🫂 在刚才的练习中，你的内心是否感受到了一丝宁静呢？${userName}，你注意到了什么特别的感受或想法吗？不用担心对错，只需要分享你真实的体验就好。`;
                    break;
                case 'breathing-complete':
                    followUpMessage = `做得真好！${userName} 🌱 深呼吸就像给心灵注入新鲜的能量。这个温柔的技巧可以在任何时候陪伴你，就像我一样。现在你的身体和心情感觉如何呢？有没有感受到一些放松？`;
                    break;
                default:
                    followUpMessage = `这真是一个美好的自我关怀时刻 ✨ ${userName}，你愿意和我分享一下刚才的体验吗？你的感受对我来说都很重要，我想更好地理解和陪伴你。`;
            }
            
            const followUp = {
                role: 'assistant',
                content: followUpMessage,
                timestamp: new Date().toISOString(),
                id: `followup-${featureType}-${Date.now()}`,
                therapyType: 'guidance'
            };
            
            setMessages(prev => [...prev, followUp]);
            ragService.addMessage(sessionId, followUp);
        }, 2000);
    };

    const endSession = () => {
        const farewellMessage = {
            role: 'assistant',
            content: t('therapy.farewellMessage', { userName }),
            timestamp: new Date().toISOString(),
            id: 'session-end',
            therapyType: 'farewell'
        };
        
        setMessages(prev => [...prev, farewellMessage]);
        
        if (sessionId) {
            ragService.addMessage(sessionId, farewellMessage);
        }
    };

    const resetSession = () => {
        // 清理RAG会话
        if (sessionId) {
            ragService.clearSession(sessionId);
        }
        
        setMessages([]);
        setShowWelcome(true);
        setSessionStarted(false);
        setUserName('');
        setSessionId(null);
        setUserId(null);
        setShowFeatures(false);
        setCurrentEmotion('neutral');
    };

    if (showWelcome) {
        return <WelcomeScreen onStartSession={startTherapySession} />;
    }

    return (
        <div className="therapy-interface">
            {/* 简洁头部 */}
            <div className="therapy-header">
                <div className="header-content">
                    <div className="therapist-info">
                        <div className="avatar-simple">
                            <span className="avatar-emoji">👩‍⚕️</span>
                        </div>
                        <div className="info-text">
                            <h1 className="therapist-name">{t('therapy.header.therapistName')}</h1>
                            <span className="status-text">
                                {isTyping ? t('therapy.header.status.typing') : t('therapy.header.status.online')}
                            </span>
                        </div>
                    </div>
                    
                    <div className="header-actions">
                        {/* 语言切换 */}
                        <div className="language-selector-header">
                            {availableLanguages.map((lang) => (
                                <button
                                    key={lang.code}
                                    className={`language-btn-header ${language === lang.code ? 'active' : ''}`}
                                    onClick={() => changeLanguage(lang.code)}
                                    title={lang.name}
                                >
                                    {lang.code.toUpperCase()}
                                </button>
                            ))}
                        </div>
                        
                        <button onClick={() => setShowFeatures(!showFeatures)} className="action-btn">
                            {showFeatures ? t('therapy.header.actions.hideTools') : t('therapy.header.actions.showTools')}
                        </button>
                        <button onClick={resetSession} className="action-btn secondary">
                            {t('therapy.header.actions.restart')}
                        </button>
                    </div>
                </div>
            </div>

            {/* 主聊天区域 */}
            <div className="chat-container">
                <div className="messages-area">
                    {messages.map((message, index) => (
                        <TherapyMessage
                            key={message.id || index}
                            message={message}
                            isTyping={isTyping && index === messages.length - 1 && message.role === 'assistant'}
                            userName={userName}
                            userAvatar={userAvatar}
                        />
                    ))}
                    {isTyping && (
                        <div className="typing-indicator">
                            <div className="typing-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <span className="typing-text">{t('therapy.message.typingIndicator')}</span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* 治愈功能（可折叠） */}
            {showFeatures && (
                <div className="features-panel">
                    <HealingFeatures
                        onFeatureSelect={handleFeatureSelect}
                        userName={userName}
                    />
                </div>
            )}

            {/* 输入区域 */}
            <div className="input-area">
                <TherapyInput
                    onSendMessage={handleSendMessage}
                    disabled={isLoading}
                    userName={userName}
                />
            </div>
        </div>
    );
};

export default TherapyInterface;
