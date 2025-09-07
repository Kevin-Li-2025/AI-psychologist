import React, { useState, useEffect } from 'react';
import './TherapistAvatar.css';

const TherapistAvatar = ({ 
    isTyping = false, 
    emotion = 'calm', 
    isListening = false,
    connectionStrength = 100 
}) => {
    const [currentEmotion, setCurrentEmotion] = useState(emotion);
    const [blinkState, setBlinkState] = useState(false);
    const [breathingPhase, setBreathingPhase] = useState(0);

    // 自然眨眼效果
    useEffect(() => {
        const blinkInterval = setInterval(() => {
            setBlinkState(true);
            setTimeout(() => setBlinkState(false), 150);
        }, 2000 + Math.random() * 3000);

        return () => clearInterval(blinkInterval);
    }, []);

    // 呼吸动画
    useEffect(() => {
        const breathingInterval = setInterval(() => {
            setBreathingPhase(prev => (prev + 1) % 60);
        }, 100);

        return () => clearInterval(breathingInterval);
    }, []);

    // 情绪变化
    useEffect(() => {
        setCurrentEmotion(emotion);
    }, [emotion]);

    const getAvatarStyle = () => {
        const breathingScale = 1 + Math.sin(breathingPhase * 0.1) * 0.02;
        return {
            transform: `scale(${breathingScale})`,
            transition: 'transform 0.1s ease-in-out'
        };
    };

    const getEyeStyle = () => {
        if (blinkState) {
            return { height: '2px', transition: 'height 0.1s ease' };
        }
        return { height: '12px', transition: 'height 0.1s ease' };
    };

    const getConnectionIndicator = () => {
        if (connectionStrength > 80) return 'strong';
        if (connectionStrength > 50) return 'medium';
        return 'weak';
    };

    return (
        <div className="therapist-avatar-container">
            {/* 连接强度指示器 */}
            <div className={`connection-indicator ${getConnectionIndicator()}`}>
                <div className="signal-bar bar-1"></div>
                <div className="signal-bar bar-2"></div>
                <div className="signal-bar bar-3"></div>
                <div className="signal-bar bar-4"></div>
            </div>

            {/* 主头像 */}
            <div 
                className={`therapist-avatar ${currentEmotion} ${isTyping ? 'typing' : ''} ${isListening ? 'listening' : ''}`}
                style={getAvatarStyle()}
            >
                {/* 外圈光环 */}
                <div className="avatar-aura">
                    <div className="aura-ring ring-1"></div>
                    <div className="aura-ring ring-2"></div>
                    <div className="aura-ring ring-3"></div>
                </div>

                {/* 头像主体 */}
                <div className="avatar-body">
                    {/* 背景 */}
                    <div className="avatar-background"></div>
                    
                    {/* 面部特征 */}
                    <div className="face">
                        {/* 眼睛 */}
                        <div className="eyes">
                            <div className="eye eye-left" style={getEyeStyle()}>
                                <div className="pupil"></div>
                                <div className="iris"></div>
                                <div className="eye-shine"></div>
                            </div>
                            <div className="eye eye-right" style={getEyeStyle()}>
                                <div className="pupil"></div>
                                <div className="iris"></div>
                                <div className="eye-shine"></div>
                            </div>
                        </div>

                        {/* 眉毛 */}
                        <div className="eyebrows">
                            <div className="eyebrow eyebrow-left"></div>
                            <div className="eyebrow eyebrow-right"></div>
                        </div>

                        {/* 嘴巴 */}
                        <div className="mouth">
                            <div className="mouth-curve"></div>
                            {isTyping && <div className="typing-indicator"></div>}
                        </div>

                        {/* 脸颊 */}
                        <div className="cheeks">
                            <div className="cheek cheek-left"></div>
                            <div className="cheek cheek-right"></div>
                        </div>
                    </div>

                    {/* 头发 */}
                    <div className="hair">
                        <div className="hair-strand strand-1"></div>
                        <div className="hair-strand strand-2"></div>
                        <div className="hair-strand strand-3"></div>
                    </div>
                </div>

                {/* 情绪粒子效果 */}
                {currentEmotion === 'happy' && (
                    <div className="emotion-particles happy-particles">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className={`particle sparkle-${i}`}>✨</div>
                        ))}
                    </div>
                )}

                {currentEmotion === 'concerned' && (
                    <div className="emotion-particles concerned-particles">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className={`particle gentle-${i}`}>💙</div>
                        ))}
                    </div>
                )}

                {isListening && (
                    <div className="listening-waves">
                        <div className="wave wave-1"></div>
                        <div className="wave wave-2"></div>
                        <div className="wave wave-3"></div>
                    </div>
                )}
            </div>

            {/* 名字标签 */}
            <div className="therapist-name">
                <span className="name-text">苏心怡</span>
                <span className="title-text">心理咨询师</span>
            </div>

            {/* 状态指示器 */}
            <div className="status-indicators">
                {isTyping && (
                    <div className="status-badge typing-badge">
                        <span className="badge-icon">💭</span>
                        <span className="badge-text">正在思考...</span>
                    </div>
                )}
                
                {isListening && (
                    <div className="status-badge listening-badge">
                        <span className="badge-icon">👂</span>
                        <span className="badge-text">专心倾听</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TherapistAvatar;
