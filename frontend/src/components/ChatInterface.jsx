import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { callHunyuanAPI, formatMessage } from '../services/hunyuanApi';
import './ChatInterface.css';

const ChatInterface = () => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: '你好！我是腾讯混元大模型助手。我可以帮你回答问题、生成代码、进行对话等。有什么我可以帮助你的吗？',
            timestamp: new Date().toISOString(),
            id: 'welcome'
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // 自动滚动到底部
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (content) => {
        if (!content.trim()) return;

        // 添加用户消息
        const userMessage = formatMessage(content, 'user');
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            // 添加AI正在打字的状态
            setIsTyping(true);

            // 准备消息历史（最近10条）
            const recentMessages = [...messages.slice(-9), userMessage].map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            // 调用API
            const response = await callHunyuanAPI(recentMessages, {
                temperature: 0.7,
                maxTokens: 1000
            });

            // 移除打字状态
            setIsTyping(false);

            // 添加AI回复
            const aiMessage = {
                ...formatMessage(response.content, 'assistant'),
                usage: response.usage
            };

            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error('发送消息失败:', error);
            setIsTyping(false);

            // 添加错误消息
            const errorMessage = formatMessage(
                '抱歉，我遇到了一些问题。请稍后再试。',
                'assistant'
            );
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        setMessages([
            {
                role: 'assistant',
                content: '对话已清空。有什么我可以帮助你的吗？',
                timestamp: new Date().toISOString(),
                id: 'cleared'
            }
        ]);
    };

    return (
        <div className="chat-interface">
            {/* 头部 */}
            <div className="chat-header">
                <div className="header-content">
                    <div className="header-avatar">
                        🤖
                    </div>
                    <div className="header-info">
                        <h1 className="header-title">混元助手</h1>
                        <p className="header-subtitle">
                            腾讯混元大模型 • 免费使用
                        </p>
                    </div>
                </div>
                <button
                    onClick={clearChat}
                    className="clear-button"
                    title="清空对话"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="3,6 5,6 21,6"></polyline>
                        <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </button>
            </div>

            {/* 消息列表 */}
            <div className="messages-container">
                <div className="messages-list">
                    {messages.map((message, index) => (
                        <ChatMessage
                            key={message.id || index}
                            message={message}
                            isTyping={isTyping && index === messages.length - 1 && message.role === 'assistant'}
                        />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* 输入框 */}
            <ChatInput
                onSendMessage={handleSendMessage}
                disabled={isLoading}
            />

            {/* 底部信息 */}
            <div className="chat-footer">
                <div className="footer-content">
                    <span className="footer-text">
                        由腾讯混元大模型驱动 • 完全免费使用
                    </span>
                    <span className="footer-badge">
                        hunyuan-lite
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
