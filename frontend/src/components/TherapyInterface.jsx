import React, { useState, useEffect, useRef } from 'react';
import TherapyMessage from './TherapyMessage';
import TherapyInput from './TherapyInput';
import WelcomeScreen from './WelcomeScreen';
import HealingFeatures from './HealingFeatures';
import { callHunyuanAPI, formatMessage } from '../services/hunyuanApi';
import { ragService } from '../services/ragService';
import { generateGentleSystemPrompt } from '../services/systemPrompts';
import './TherapyInterface.css';

const TherapyInterface = () => {
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
            content: `亲爱的${actualName}，我是苏心怡，很高兴能够与你相遇在这个特殊的时刻 🌸\n\n你知道吗？每一次新的相遇对我来说都是珍贵的。我能感受到你来到这里需要很大的勇气，这本身就说明了你内心的力量。\n\n我想和你分享一个小秘密 —— 作为一名心理咨询师，我也曾经历过迷茫和不安的时光。正是那些经历让我更深刻地理解，每个人的内心都有着自我愈合的神奇力量。\n\n这里是属于我们的温暖空间，你可以完全做自己，分享任何感受。我会用我全部的专业知识和真诚的心陪伴你。\n\n现在，告诉我，是什么带你来到这里的呢？或者，我们可以先从你此刻的感受开始 💚`,
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
        const emotionMap = {
            sad: '😔 难过',
            happy: '😊 开心', 
            anxious: '😰 焦虑',
            angry: '😠 愤怒',
            confused: '🤔 困惑',
            calm: '😌 平静',
            neutral: '😐 平静'
        };
        return emotionMap[emotion] || '😐 平静';
    };

    const handleSendMessage = async (content) => {
        if (!content.trim() || !sessionId) return;

        // 简单的情绪检测
        const emotionData = detectEmotion(content);
        setCurrentEmotion(emotionData.emotion);

        // 添加用户消息
        const userMessage = formatMessage(content, 'user');
        setMessages(prev => [...prev, userMessage]);
        
        // 将用户消息添加到RAG记忆中
        ragService.addMessage(sessionId, userMessage);
        
        setIsLoading(true);

        try {
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

            // 准备消息历史（只取最近6条对话，保持上下文简洁）
            const recentMessages = [
                systemPrompt,
                ...messages.slice(-6).map(msg => ({
                    role: msg.role,
                    content: msg.content
                })),
                { role: 'user', content: content }
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
                `亲爱的${userName}，我现在遇到了一些小问题，就像有时候我们的心情也会有起伏一样。请给我一点时间，或者我们可以先深呼吸一下，聊聊你现在的感受 🌸`,
                'assistant'
            );
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
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
            content: `亲爱的${userName}，谢谢你今天愿意打开心扉与我分享 🌸\n\n你的每一份真诚都深深触动着我。请记住，你是如此勇敢，愿意面对内心的感受，这本身就是一种美丽的力量。\n\n无论何时，当你需要一个温柔的倾听者，我都会在这里等你。就像夜空中的星星，虽然有时被云朵遮挡，但它们始终在那里闪烁着温暖的光芒。\n\n愿你的心中永远有光，愿温柔与你同在 💚✨`,
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
                            <h1 className="therapist-name">苏心怡</h1>
                            <span className="status-text">
                                {isTyping ? '正在回复...' : '在线'}
                            </span>
                        </div>
                    </div>
                    
                    <div className="header-actions">
                        <button onClick={() => setShowFeatures(!showFeatures)} className="action-btn">
                            {showFeatures ? '隐藏工具' : '治愈工具'}
                        </button>
                        <button onClick={resetSession} className="action-btn secondary">
                            重新开始
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
                            <span className="typing-text">苏心怡正在思考...</span>
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
