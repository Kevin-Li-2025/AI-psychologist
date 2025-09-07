import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import './TherapyMessage.css';

const TherapyMessage = ({ message, isTyping, userName, userAvatar }) => {
    const { t } = useTranslation();
    const [displayedContent, setDisplayedContent] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (message.role === 'assistant' && !isTyping) {
            setIsAnimating(true);
            setDisplayedContent('');
            
            // 打字机效果
            let index = 0;
            const content = message.content;
            const timer = setInterval(() => {
                if (index < content.length) {
                    setDisplayedContent(content.slice(0, index + 1));
                    index++;
                } else {
                    clearInterval(timer);
                    setIsAnimating(false);
                }
            }, 30);

            return () => clearInterval(timer);
        } else {
            setDisplayedContent(message.content);
        }
    }, [message.content, message.role, isTyping]);

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getMessageIcon = () => {
        if (message.role === 'user') {
            return userAvatar || '👤';
        }
        
        switch (message.therapyType) {
            case 'welcome':
                return '🌱';
            case 'farewell':
                return '💚';
            default:
                return '🧠';
        }
    };

    const getMessageClass = () => {
        let baseClass = 'therapy-message';
        if (message.role === 'user') {
            baseClass += ' user-message';
        } else {
            baseClass += ' assistant-message';
            if (message.therapyType === 'welcome') {
                baseClass += ' welcome-message';
            } else if (message.therapyType === 'farewell') {
                baseClass += ' farewell-message';
            }
        }
        return baseClass;
    };

    return (
        <div className={getMessageClass()}>
            <div className="message-container">
                {message.role === 'assistant' && (
                    <div className="message-avatar">
                        <div className="avatar-glass">
                            <span className="avatar-icon">{getMessageIcon()}</span>
                        </div>
                    </div>
                )}
                
                <div className="message-content">
                    <div className="message-bubble">
                        <div className="message-glass">
                            {message.role === 'assistant' && (
                                <div className="message-header">
                                    <span className="therapist-name">{t('therapy.message.therapistLabel')}</span>
                                    <span className="message-time">{formatTime(message.timestamp)}</span>
                                </div>
                            )}
                            
                            <div className="message-text">
                                {displayedContent.split('\n').map((line, index) => (
                                    <p key={index} className={line.trim() === '' ? 'empty-line' : ''}>
                                        {line}
                                    </p>
                                ))}
                                {isAnimating && <span className="typing-cursor">|</span>}
                            </div>

                            {message.role === 'user' && (
                                <div className="message-footer">
                                    <span className="message-time">{formatTime(message.timestamp)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {message.role === 'user' && (
                    <div className="message-avatar user-avatar">
                        <div className="avatar-glass">
                            <span className="avatar-icon">{getMessageIcon()}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* 消息装饰效果 */}
            {message.role === 'assistant' && (
                <div className="message-effects">
                    <div className="healing-particles">
                        <div className="particle particle-1"></div>
                        <div className="particle particle-2"></div>
                        <div className="particle particle-3"></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TherapyMessage;
