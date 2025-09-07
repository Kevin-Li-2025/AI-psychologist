import React from 'react';
import './ChatMessage.css';

const ChatMessage = ({ message, isTyping = false }) => {
    const { role, content, timestamp } = message;
    const isUser = role === 'user';

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={`message-wrapper ${isUser ? 'user-message' : 'ai-message'}`}>
            <div className="message-container">
                <div className="message-avatar">
                    {isUser ? (
                        <div className="user-avatar">👤</div>
                    ) : (
                        <div className="ai-avatar">
                            {isTyping ? (
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            ) : (
                                '🤖'
                            )}
                        </div>
                    )}
                </div>

                <div className="message-content">
                    <div className="message-header">
                        <span className="message-sender">
                            {isUser ? '你' : '混元助手'}
                        </span>
                        <span className="message-time">
                            {formatTime(timestamp)}
                        </span>
                    </div>

                    <div className={`message-bubble ${isUser ? 'user-bubble' : 'ai-bubble'}`}>
                        {isTyping ? (
                            <div className="typing-placeholder">
                                正在思考中...
                            </div>
                        ) : (
                            <div className="message-text">
                                {content.split('\n').map((line, index) => (
                                    <React.Fragment key={index}>
                                        {line}
                                        {index < content.split('\n').length - 1 && <br />}
                                    </React.Fragment>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;
