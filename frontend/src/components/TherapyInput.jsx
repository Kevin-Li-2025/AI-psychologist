import React, { useState, useRef, useEffect } from 'react';
import './TherapyInput.css';

const TherapyInput = ({ onSendMessage, disabled, userName }) => {
    const [message, setMessage] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const textareaRef = useRef(null);

    // 自动调整文本框高度
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
        }
    }, [message]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() && !disabled) {
            onSendMessage(message);
            setMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const quickResponses = [
        "我感到焦虑",
        "我需要倾诉",
        "我感到孤独",
        "我想要放松",
        "我需要建议"
    ];

    const handleQuickResponse = (response) => {
        if (!disabled) {
            onSendMessage(response);
        }
    };

    return (
        <div className="therapy-input">
            <form onSubmit={handleSubmit} className="input-form">
                <div className="input-container">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder={`${userName}，分享你的感受...`}
                        disabled={disabled}
                        className="message-input"
                        rows="1"
                        maxLength={2000}
                    />
                    
                    <button
                        type="submit"
                        disabled={!message.trim() || disabled}
                        className="send-button"
                        title="发送消息"
                    >
                        {disabled ? (
                            <div className="loading-spinner"></div>
                        ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 2L11 13"/>
                                <path d="M22 2L15 22L11 13L2 9L22 2Z"/>
                            </svg>
                        )}
                    </button>
                </div>
                
                <div className="input-hint">
                    按 Enter 发送，Shift + Enter 换行
                </div>
            </form>
        </div>
    );
};

export default TherapyInput;
