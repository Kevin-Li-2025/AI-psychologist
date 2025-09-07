import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = "正在加载心灵治愈师..." }) => {
    return (
        <div className="loading-spinner-container">
            {/* 背景装饰 */}
            <div className="loading-background">
                <div className="floating-orb orb-1"></div>
                <div className="floating-orb orb-2"></div>
                <div className="floating-orb orb-3"></div>
                <div className="gradient-overlay"></div>
            </div>

            {/* 主要内容 */}
            <div className="loading-content">
                <div className="loading-glass">
                    {/* Logo区域 */}
                    <div className="loading-logo">
                        <div className="logo-container">
                            <div className="logo-glow">
                                <span className="logo-icon">🌱</span>
                            </div>
                        </div>
                    </div>

                    {/* 加载动画 */}
                    <div className="spinner-container">
                        <div className="healing-spinner">
                            <div className="spinner-ring"></div>
                            <div className="spinner-ring"></div>
                            <div className="spinner-ring"></div>
                        </div>
                    </div>

                    {/* 加载文本 */}
                    <div className="loading-text">
                        <h2 className="loading-title">心灵治愈师</h2>
                        <p className="loading-message">{message}</p>
                        
                        <div className="loading-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>

                    {/* 温馨提示 */}
                    <div className="loading-tips">
                        <div className="tip-item">
                            <span className="tip-icon">💚</span>
                            <span className="tip-text">为你准备温暖的治愈空间</span>
                        </div>
                        <div className="tip-item">
                            <span className="tip-icon">🔒</span>
                            <span className="tip-text">确保你的隐私完全受保护</span>
                        </div>
                        <div className="tip-item">
                            <span className="tip-icon">🌟</span>
                            <span className="tip-text">加载专业的心理支持工具</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingSpinner;
