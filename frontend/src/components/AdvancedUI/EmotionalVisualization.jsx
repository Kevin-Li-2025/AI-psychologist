import React, { useState, useEffect, useRef } from 'react';
import './EmotionalVisualization.css';

const EmotionalVisualization = ({ 
    emotions = [], 
    currentEmotion = 'neutral',
    intensity = 50,
    showHistory = true,
    interactive = true 
}) => {
    const [animationPhase, setAnimationPhase] = useState(0);
    const [particleSystem, setParticleSystem] = useState([]);
    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    // 情绪颜色映射
    const emotionColors = {
        happy: { primary: '#4caf50', secondary: '#81c784', particles: '#c8e6c9' },
        sad: { primary: '#2196f3', secondary: '#64b5f6', particles: '#bbdefb' },
        anxious: { primary: '#ff9800', secondary: '#ffb74d', particles: '#ffe0b2' },
        angry: { primary: '#f44336', secondary: '#e57373', particles: '#ffcdd2' },
        calm: { primary: '#9c27b0', secondary: '#ba68c8', particles: '#e1bee7' },
        excited: { primary: '#ff5722', secondary: '#ff8a65', particles: '#ffccbc' },
        confused: { primary: '#607d8b', secondary: '#90a4ae', particles: '#cfd8dc' },
        neutral: { primary: '#9e9e9e', secondary: '#bdbdbd', particles: '#f5f5f5' }
    };

    // 初始化粒子系统
    useEffect(() => {
        const particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push({
                id: i,
                x: Math.random() * 300,
                y: Math.random() * 300,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 3 + 1,
                life: Math.random() * 100,
                emotion: currentEmotion
            });
        }
        setParticleSystem(particles);
    }, [currentEmotion]);

    // 动画循环
    useEffect(() => {
        const animate = () => {
            setAnimationPhase(prev => (prev + 1) % 360);
            
            // 更新粒子
            setParticleSystem(prev => prev.map(particle => ({
                ...particle,
                x: particle.x + particle.vx,
                y: particle.y + particle.vy,
                life: particle.life - 0.5,
                vx: particle.vx * 0.99,
                vy: particle.vy * 0.99
            })).filter(p => p.life > 0));

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    // 获取当前情绪的颜色
    const getCurrentColors = () => {
        return emotionColors[currentEmotion] || emotionColors.neutral;
    };

    // 生成情绪波形
    const generateEmotionWave = () => {
        const colors = getCurrentColors();
        const wavePoints = [];
        const amplitude = intensity / 100 * 50;
        
        for (let i = 0; i <= 100; i++) {
            const x = (i / 100) * 300;
            const y = 150 + Math.sin((i / 10) + (animationPhase / 10)) * amplitude;
            wavePoints.push(`${x},${y}`);
        }
        
        return wavePoints.join(' ');
    };

    // 生成情绪光环
    const generateAura = () => {
        const colors = getCurrentColors();
        const radius = 80 + (intensity / 100) * 40;
        const opacity = 0.3 + (intensity / 100) * 0.4;
        
        return {
            r: radius,
            opacity: opacity,
            color: colors.primary
        };
    };

    // 处理交互
    const handleEmotionClick = (emotion) => {
        if (interactive) {
            // 可以添加回调来通知父组件
            console.log('Emotion selected:', emotion);
        }
    };

    const aura = generateAura();

    return (
        <div className="emotional-visualization">
            <div className="emotion-canvas-container">
                {/* SVG 情绪可视化 */}
                <svg 
                    className="emotion-canvas" 
                    width="300" 
                    height="300"
                    viewBox="0 0 300 300"
                >
                    {/* 背景渐变 */}
                    <defs>
                        <radialGradient id="emotionGradient" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" style={{ stopColor: getCurrentColors().primary, stopOpacity: 0.3 }} />
                            <stop offset="100%" style={{ stopColor: getCurrentColors().secondary, stopOpacity: 0.1 }} />
                        </radialGradient>
                        
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                            <feMerge> 
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>

                    {/* 背景圆 */}
                    <circle 
                        cx="150" 
                        cy="150" 
                        r="140" 
                        fill="url(#emotionGradient)"
                        opacity="0.5"
                    />

                    {/* 情绪光环 */}
                    <circle 
                        cx="150" 
                        cy="150" 
                        r={aura.r}
                        fill="none"
                        stroke={aura.color}
                        strokeWidth="2"
                        opacity={aura.opacity}
                        filter="url(#glow)"
                        className="emotion-aura"
                    />

                    {/* 情绪波形 */}
                    <polyline
                        points={generateEmotionWave()}
                        fill="none"
                        stroke={getCurrentColors().primary}
                        strokeWidth="3"
                        opacity="0.8"
                        filter="url(#glow)"
                        className="emotion-wave"
                    />

                    {/* 中心情绪指示器 */}
                    <circle 
                        cx="150" 
                        cy="150" 
                        r={10 + (intensity / 100) * 15}
                        fill={getCurrentColors().primary}
                        opacity="0.9"
                        filter="url(#glow)"
                        className="emotion-center"
                    />

                    {/* 强度指示器 */}
                    <circle 
                        cx="150" 
                        cy="150" 
                        r="120"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.3)"
                        strokeWidth="1"
                        strokeDasharray="5,5"
                    />
                    
                    <circle 
                        cx="150" 
                        cy="150" 
                        r="120"
                        fill="none"
                        stroke={getCurrentColors().primary}
                        strokeWidth="3"
                        strokeDasharray="5,5"
                        strokeDashoffset={377 - (377 * intensity / 100)}
                        className="intensity-ring"
                    />

                    {/* 粒子系统 */}
                    {particleSystem.map(particle => (
                        <circle
                            key={particle.id}
                            cx={particle.x}
                            cy={particle.y}
                            r={particle.size}
                            fill={getCurrentColors().particles}
                            opacity={particle.life / 100}
                        />
                    ))}
                </svg>

                {/* 情绪标签 */}
                <div className="emotion-label">
                    <div className="emotion-name">{currentEmotion}</div>
                    <div className="emotion-intensity">{intensity}%</div>
                </div>
            </div>

            {/* 情绪历史 */}
            {showHistory && emotions.length > 0 && (
                <div className="emotion-history">
                    <h4 className="history-title">情绪轨迹</h4>
                    <div className="emotion-timeline">
                        {emotions.slice(-10).map((emotion, index) => (
                            <div 
                                key={index}
                                className={`emotion-point ${emotion.type} ${emotion.type === currentEmotion ? 'active' : ''}`}
                                style={{
                                    '--emotion-color': emotionColors[emotion.type]?.primary || '#9e9e9e',
                                    '--emotion-size': `${emotion.intensity / 100 * 20 + 5}px`
                                }}
                                title={`${emotion.type} - ${emotion.intensity}%`}
                                onClick={() => handleEmotionClick(emotion.type)}
                            >
                                <div className="point-glow"></div>
                                <div className="point-core"></div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 情绪选择器 */}
            {interactive && (
                <div className="emotion-selector">
                    <h4 className="selector-title">当前感受</h4>
                    <div className="emotion-grid">
                        {Object.keys(emotionColors).map(emotion => (
                            <button
                                key={emotion}
                                className={`emotion-button ${emotion} ${emotion === currentEmotion ? 'active' : ''}`}
                                style={{
                                    '--emotion-color': emotionColors[emotion].primary,
                                    '--emotion-secondary': emotionColors[emotion].secondary
                                }}
                                onClick={() => handleEmotionClick(emotion)}
                            >
                                <div className="button-glow"></div>
                                <span className="emotion-icon">{getEmotionIcon(emotion)}</span>
                                <span className="emotion-text">{getEmotionText(emotion)}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* 情绪洞察 */}
            <div className="emotion-insights">
                <div className="insight-card">
                    <div className="insight-icon">💡</div>
                    <div className="insight-text">
                        {generateEmotionInsight(currentEmotion, intensity)}
                    </div>
                </div>
            </div>
        </div>
    );
};

// 获取情绪图标
const getEmotionIcon = (emotion) => {
    const icons = {
        happy: '😊',
        sad: '😔',
        anxious: '😰',
        angry: '😠',
        calm: '😌',
        excited: '🤩',
        confused: '🤔',
        neutral: '😐'
    };
    return icons[emotion] || '😐';
};

// 获取情绪文字
const getEmotionText = (emotion) => {
    const texts = {
        happy: '开心',
        sad: '难过',
        anxious: '焦虑',
        angry: '愤怒',
        calm: '平静',
        excited: '兴奋',
        confused: '困惑',
        neutral: '平静'
    };
    return texts[emotion] || '平静';
};

// 生成情绪洞察
const generateEmotionInsight = (emotion, intensity) => {
    const insights = {
        happy: intensity > 70 ? '你现在状态很好，这种积极的能量很珍贵' : '感受到你内心的温暖，继续保持这份美好',
        sad: intensity > 70 ? '悲伤很强烈，但这也说明你很勇敢地面对内心' : '允许自己感受悲伤，这是治愈的开始',
        anxious: intensity > 70 ? '焦虑感很强，我们一起用呼吸来缓解' : '轻微的担忧是正常的，你处理得很好',
        angry: intensity > 70 ? '愤怒背后往往隐藏着需要被理解的需求' : '能感受到你的不满，让我们探索一下原因',
        calm: '这种平静状态很宝贵，享受这份内心的安宁',
        excited: '你的兴奋感染了我，分享快乐让它加倍',
        confused: '困惑是成长的信号，说明你在思考和探索',
        neutral: '平静的状态也很好，有时我们需要这样的中性时刻'
    };
    return insights[emotion] || '每种情绪都有它的价值和意义';
};

export default EmotionalVisualization;
