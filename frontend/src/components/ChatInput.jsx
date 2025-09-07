import React, { useState, useRef, useEffect } from 'react';
import './ChatInput.css';

const ChatInput = ({ onSendMessage, disabled = false }) => {
    const [message, setMessage] = useState('');
    const textareaRef = useRef(null);

    // 自动调整文本框高度
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [message]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() && !disabled) {
            onSendMessage(message.trim());
            setMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleChange = (e) => {
        setMessage(e.target.value);
    };

    return (
        <div className="chat-input-wrapper">
            <form onSubmit={handleSubmit} className="chat-input-form">
                <div className="input-container">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                        placeholder="输入你的问题，与混元助手对话..."
                        disabled={disabled}
                        rows={1}
                        className="chat-textarea"
                    />

                    <button
                        type="submit"
                        disabled={!message.trim() || disabled}
                        className="send-button"
                    >
                        {disabled ? (
                            <div className="loading-spinner"></div>
                        ) : (
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="send-icon"
                            >
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22,2 15,22 11,13 2,9"></polygon>
                            </svg>
                        )}
                    </button>
                </div>

                <div className="input-footer">
                    <span className="input-hint">
                        按 Enter 发送，Shift + Enter 换行
                    </span>
                    <span className="input-status">
                        {disabled ? '正在思考...' : '准备就绪'}
                    </span>
                </div>
            </form>
        </div>
    );
};

export default ChatInput;
