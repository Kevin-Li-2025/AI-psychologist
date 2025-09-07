import React, { useState, useEffect } from 'react';
import './HealingFeatures.css';

const HealingFeatures = ({ onFeatureSelect, userName }) => {
    const [selectedMood, setSelectedMood] = useState(null);
    const [breathingActive, setBreathingActive] = useState(false);
    const [breathingCount, setBreathingCount] = useState(0);
    const [breathingPhase, setBreathingPhase] = useState('inhale'); // inhale, hold, exhale

    // 情绪选项
    const moodOptions = [
        { emoji: '😊', label: '开心', color: '#4caf50', message: '很高兴看到你心情不错！让我们聊聊是什么让你感到开心的。' },
        { emoji: '😔', label: '难过', color: '#2196f3', message: '我理解你现在可能感到难过。这种感受是完全正常的，让我们一起探讨一下。' },
        { emoji: '😰', label: '焦虑', color: '#ff9800', message: '焦虑的感觉确实不好受。让我帮你找到一些缓解焦虑的方法。' },
        { emoji: '😡', label: '愤怒', color: '#f44336', message: '愤怒是一种强烈的情绪。让我们谈谈是什么触发了这种感受。' },
        { emoji: '😴', label: '疲惫', color: '#9c27b0', message: '感到疲惫是身心需要休息的信号。让我们聊聊如何更好地照顾自己。' },
        { emoji: '🤔', label: '困惑', color: '#607d8b', message: '面对困惑是成长的一部分。让我帮你理清思路。' }
    ];

    // 治疗活动选项
    const healingActivities = [
        {
            id: 'breathing',
            icon: '🫁',
            title: '呼吸练习',
            description: '4-7-8呼吸法帮助放松',
            action: () => startBreathingExercise()
        },
        {
            id: 'gratitude',
            icon: '🙏',
            title: '感恩练习',
            description: '分享三件感恩的事',
            action: () => onFeatureSelect('gratitude', '让我们做一个感恩练习。请分享三件你今天感恩的事情，无论大小。这个练习可以帮助我们关注生活中的积极面。')
        },
        {
            id: 'mindfulness',
            icon: '🧘',
            title: '正念冥想',
            description: '5分钟正念引导',
            action: () => onFeatureSelect('mindfulness', '让我们开始一个简短的正念练习。请找一个舒适的姿势坐好，闭上眼睛，专注于你的呼吸。感受空气进入和离开你的身体...')
        },
        {
            id: 'journaling',
            icon: '📝',
            title: '情绪日记',
            description: '记录和探索感受',
            action: () => onFeatureSelect('journaling', '写情绪日记是一个很好的自我探索方式。请描述一下你现在的感受，以及可能导致这种感受的原因。')
        },
        {
            id: 'affirmations',
            icon: '💪',
            title: '积极肯定',
            description: '建立正面自我对话',
            action: () => onFeatureSelect('affirmations', '积极的自我肯定可以重塑我们的思维模式。让我们一起创造一些适合你的积极肯定语句。')
        },
        {
            id: 'progressive',
            icon: '🌊',
            title: '渐进放松',
            description: '肌肉放松练习',
            action: () => onFeatureSelect('progressive', '渐进式肌肉放松可以帮助释放身体紧张。让我们从头部开始，逐步放松全身的肌肉群...')
        }
    ];

    // 开始呼吸练习
    const startBreathingExercise = () => {
        setBreathingActive(true);
        setBreathingCount(0);
        setBreathingPhase('inhale');
        
        onFeatureSelect('breathing', '让我们开始4-7-8呼吸练习。这是一个非常有效的放松技巧。请跟随我的指导：');
    };

    // 呼吸练习逻辑
    useEffect(() => {
        if (!breathingActive) return;

        const phases = [
            { name: 'inhale', duration: 4000, next: 'hold' },
            { name: 'hold', duration: 7000, next: 'exhale' },
            { name: 'exhale', duration: 8000, next: 'inhale' }
        ];

        const currentPhase = phases.find(p => p.name === breathingPhase);
        
        const timer = setTimeout(() => {
            if (breathingPhase === 'exhale') {
                setBreathingCount(prev => prev + 1);
                if (breathingCount >= 3) {
                    setBreathingActive(false);
                    onFeatureSelect('breathing-complete', '很好！你完成了4轮呼吸练习。感觉如何？这种深度呼吸可以激活副交感神经系统，帮助身体进入放松状态。');
                    return;
                }
            }
            setBreathingPhase(currentPhase.next);
        }, currentPhase.duration);

        return () => clearTimeout(timer);
    }, [breathingActive, breathingPhase, breathingCount, onFeatureSelect]);

    // 选择情绪
    const handleMoodSelect = (mood) => {
        setSelectedMood(mood);
        onFeatureSelect('mood', `${userName}，我看到你选择了"${mood.label}"这个情绪。${mood.message}`);
    };

    // 获取呼吸指导文本
    const getBreathingText = () => {
        switch (breathingPhase) {
            case 'inhale':
                return `吸气... (${4 - Math.floor((Date.now() % 4000) / 1000)})`;
            case 'hold':
                return `屏住呼吸... (${7 - Math.floor((Date.now() % 7000) / 1000)})`;
            case 'exhale':
                return `呼气... (${8 - Math.floor((Date.now() % 8000) / 1000)})`;
            default:
                return '';
        }
    };

    return (
        <div className="healing-features">
            <div className="features-glass">

                {/* 呼吸练习指示器 */}
                {breathingActive && (
                    <div className="breathing-exercise">
                        <div className="breathing-container">
                            <div className={`breathing-circle ${breathingPhase}`}>
                                <div className="breathing-inner">
                                    <span className="breathing-text">{getBreathingText()}</span>
                                    <div className="breathing-count">第 {breathingCount + 1}/4 轮</div>
                                </div>
                            </div>
                            <button
                                className="stop-breathing"
                                onClick={() => setBreathingActive(false)}
                            >
                                停止练习
                            </button>
                        </div>
                    </div>
                )}

                {/* 治疗活动 */}
                <div className="feature-section">
                    <div className="section-header">
                        <h3 className="section-title">
                            <span className="section-icon">🌟</span>
                            治愈活动
                        </h3>
                        <p className="section-subtitle">选择一个活动来改善你的心理状态</p>
                    </div>
                    
                    <div className="activities-grid">
                        {healingActivities.map((activity) => (
                            <button
                                key={activity.id}
                                className="activity-button"
                                onClick={activity.action}
                                disabled={breathingActive && activity.id !== 'breathing'}
                            >
                                <div className="activity-icon">{activity.icon}</div>
                                <div className="activity-content">
                                    <h4 className="activity-title">{activity.title}</h4>
                                    <p className="activity-description">{activity.description}</p>
                                </div>
                                <div className="activity-arrow">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="9,18 15,12 9,6"></polyline>
                                    </svg>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 每日提醒 */}
                <div className="feature-section">
                    <div className="section-header">
                        <h3 className="section-title">
                            <span className="section-icon">💡</span>
                            今日心理健康提醒
                        </h3>
                    </div>
                    
                    <div className="daily-tip">
                        <div className="tip-content">
                            <p className="tip-text">
                                "每一个小小的进步都值得庆祝。你不需要完美，只需要真实地做自己。"
                            </p>
                            <div className="tip-author">— 心理健康小贴士</div>
                        </div>
                    </div>
                </div>

                {/* 紧急支持 */}
                <div className="feature-section emergency-section">
                    <div className="section-header">
                        <h3 className="section-title">
                            <span className="section-icon">🆘</span>
                            需要紧急支持？
                        </h3>
                    </div>
                    
                    <div className="emergency-content">
                        <p className="emergency-text">
                            如果你正在经历严重的心理健康危机，请立即寻求专业帮助。
                        </p>
                        <div className="emergency-contacts">
                            <div className="contact-item">
                                <strong>心理危机热线：</strong> 400-161-9995
                            </div>
                            <div className="contact-item">
                                <strong>24小时心理援助：</strong> 400-161-9995
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealingFeatures;
