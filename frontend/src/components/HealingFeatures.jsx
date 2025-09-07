import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import './HealingFeatures.css';

const HealingFeatures = ({ onFeatureSelect, userName }) => {
    const { t } = useTranslation();
    const [selectedMood, setSelectedMood] = useState(null);
    const [breathingActive, setBreathingActive] = useState(false);
    const [breathingCount, setBreathingCount] = useState(0);
    const [breathingPhase, setBreathingPhase] = useState('inhale'); // inhale, hold, exhale

    // 情绪选项
    const moodOptions = [
        { emoji: '😊', key: 'happy', color: '#4caf50' },
        { emoji: '😔', key: 'sad', color: '#2196f3' },
        { emoji: '😰', key: 'anxious', color: '#ff9800' },
        { emoji: '😡', key: 'angry', color: '#f44336' },
        { emoji: '😴', key: 'tired', color: '#9c27b0' },
        { emoji: '🤔', key: 'confused', color: '#607d8b' }
    ];

    // 治疗活动选项
    const healingActivities = [
        {
            id: 'breathing',
            icon: '🫁',
            title: t('healing.activities.breathing.title'),
            description: t('healing.activities.breathing.description'),
            action: () => startBreathingExercise()
        },
        {
            id: 'gratitude',
            icon: '🙏',
            title: t('healing.activities.gratitude.title'),
            description: t('healing.activities.gratitude.description'),
            action: () => onFeatureSelect('gratitude', t('healing.activities.gratitude.message'))
        },
        {
            id: 'mindfulness',
            icon: '🧘',
            title: t('healing.activities.mindfulness.title'),
            description: t('healing.activities.mindfulness.description'),
            action: () => onFeatureSelect('mindfulness', t('healing.activities.mindfulness.message'))
        },
        {
            id: 'journaling',
            icon: '📝',
            title: t('healing.activities.journaling.title'),
            description: t('healing.activities.journaling.description'),
            action: () => onFeatureSelect('journaling', t('healing.activities.journaling.message'))
        },
        {
            id: 'affirmations',
            icon: '💪',
            title: t('healing.activities.affirmations.title'),
            description: t('healing.activities.affirmations.description'),
            action: () => onFeatureSelect('affirmations', t('healing.activities.affirmations.message'))
        },
        {
            id: 'progressive',
            icon: '🌊',
            title: t('healing.activities.progressive.title'),
            description: t('healing.activities.progressive.description'),
            action: () => onFeatureSelect('progressive', t('healing.activities.progressive.message'))
        }
    ];

    // 开始呼吸练习
    const startBreathingExercise = () => {
        setBreathingActive(true);
        setBreathingCount(0);
        setBreathingPhase('inhale');
        
        onFeatureSelect('breathing', t('healing.activities.breathing.message'));
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
                    onFeatureSelect('breathing-complete', t('healing.activities.breathing.completeMessage'));
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
        const moodLabel = t(`healing.moods.${mood.key}.label`);
        const moodMessage = t(`healing.moods.${mood.key}.message`);
        onFeatureSelect('mood', `${userName}，我看到你选择了"${moodLabel}"这个情绪。${moodMessage}`);
    };

    // 获取呼吸指导文本
    const getBreathingText = () => {
        switch (breathingPhase) {
            case 'inhale':
                return `${t('healing.activities.breathing.phases.inhale')} (${4 - Math.floor((Date.now() % 4000) / 1000)})`;
            case 'hold':
                return `${t('healing.activities.breathing.phases.hold')} (${7 - Math.floor((Date.now() % 7000) / 1000)})`;
            case 'exhale':
                return `${t('healing.activities.breathing.phases.exhale')} (${8 - Math.floor((Date.now() % 8000) / 1000)})`;
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
                                    <div className="breathing-count">{t('healing.activities.breathing.round', { current: breathingCount + 1, total: 4 })}</div>
                                </div>
                            </div>
                            <button
                                className="stop-breathing"
                                onClick={() => setBreathingActive(false)}
                            >
                                {t('healing.activities.breathing.stop')}
                            </button>
                        </div>
                    </div>
                )}

                {/* 治疗活动 */}
                <div className="feature-section">
                    <div className="section-header">
                        <h3 className="section-title">
                            <span className="section-icon">🌟</span>
                            {t('healing.title')}
                        </h3>
                        <p className="section-subtitle">{t('healing.subtitle')}</p>
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
                            {t('healing.dailyTip.title')}
                        </h3>
                    </div>
                    
                    <div className="daily-tip">
                        <div className="tip-content">
                            <p className="tip-text">
                                {t('healing.dailyTip.content')}
                            </p>
                            <div className="tip-author">{t('healing.dailyTip.author')}</div>
                        </div>
                    </div>
                </div>

                {/* 紧急支持 */}
                <div className="feature-section emergency-section">
                    <div className="section-header">
                        <h3 className="section-title">
                            <span className="section-icon">🆘</span>
                            {t('healing.emergency.title')}
                        </h3>
                    </div>
                    
                    <div className="emergency-content">
                        <p className="emergency-text">
                            {t('healing.emergency.description')}
                        </p>
                        <div className="emergency-contacts">
                            <div className="contact-item">
                                <strong>{t('healing.emergency.hotline')}</strong>
                            </div>
                            <div className="contact-item">
                                <strong>{t('healing.emergency.support')}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealingFeatures;
