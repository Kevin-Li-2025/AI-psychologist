// RAG (Retrieval-Augmented Generation) 服务
// 用于增强上下文理解和记忆功能

class RAGService {
    constructor() {
        this.conversationMemory = new Map(); // 存储对话记忆
        this.userProfiles = new Map(); // 存储用户画像
        this.emotionalContext = new Map(); // 存储情绪上下文
        this.therapyHistory = new Map(); // 存储治疗历史
        this.sessionMetrics = new Map(); // 存储会话指标
        this.contextCache = new Map(); // 上下文缓存
        this.emotionalPatterns = new Map(); // 情绪模式分析
        
        // 初始化情绪分析词典
        this.initializeEmotionDictionary();
        
        // 启动定期清理任务
        this.startCleanupTask();
    }

    // 初始化情绪分析词典
    initializeEmotionDictionary() {
        this.emotionDictionary = {
            positive: {
                keywords: ['开心', '快乐', '高兴', '愉快', '兴奋', '满足', '幸福', '喜悦', '舒服', '放松', '平静', '安心', '感激', '感谢', '希望', '乐观', '自信', '骄傲', '成功', '进步'],
                intensity: ['非常', '特别', '超级', '极其', '十分', '相当', '很', '挺', '蛮', '真的']
            },
            negative: {
                keywords: ['难过', '伤心', '痛苦', '沮丧', '失落', '绝望', '焦虑', '担心', '紧张', '害怕', '恐惧', '不安', '压力', '烦躁', '愤怒', '生气', '恼火', '愤恨', '讨厌', '恨', '疲惫', '累', '疲劳', '困倦', '无力', '倦怠', '困惑', '迷茫', '孤独', '空虚', '无助'],
                intensity: ['非常', '特别', '超级', '极其', '十分', '相当', '很', '挺', '蛮', '真的', '完全', '彻底', '深深地']
            },
            coping: {
                keywords: ['应对', '处理', '解决', '面对', '克服', '战胜', '坚持', '努力', '尝试', '改变', '调整', '适应', '学习', '成长', '进步', '提升', '改善'],
                strategies: ['深呼吸', '冥想', '运动', '倾诉', '写日记', '听音乐', '散步', '休息', '睡觉', '寻求帮助']
            }
        };
    }

    // 启动定期清理任务
    startCleanupTask() {
        // 每小时清理一次过期的缓存
        setInterval(() => {
            this.cleanupExpiredCache();
        }, 60 * 60 * 1000);
    }

    // 清理过期缓存
    cleanupExpiredCache() {
        const now = Date.now();
        const maxAge = 24 * 60 * 60 * 1000; // 24小时

        for (const [sessionId, session] of this.conversationMemory.entries()) {
            if (now - session.startTime.getTime() > maxAge) {
                this.conversationMemory.delete(sessionId);
                this.contextCache.delete(sessionId);
                this.sessionMetrics.delete(sessionId);
            }
        }
    }

    // 初始化用户会话
    initializeSession(userName) {
        const sessionId = `session_${userName}_${Date.now()}`;
        
        this.conversationMemory.set(sessionId, {
            messages: [],
            startTime: new Date(),
            userName: userName,
            sessionSummary: '',
            keyTopics: [],
            emotionalJourney: []
        });

        this.userProfiles.set(userName, {
            name: userName,
            preferredName: userName,
            communicationStyle: 'gentle',
            emotionalPatterns: [],
            progressNotes: [],
            coreIssues: [],
            strengths: [],
            goals: []
        });

        return sessionId;
    }

    // 添加消息到记忆中
    addMessage(sessionId, message) {
        const session = this.conversationMemory.get(sessionId);
        if (session) {
            session.messages.push({
                ...message,
                timestamp: new Date(),
                emotionalTone: this.analyzeEmotionalTone(message.content),
                keyWords: this.extractKeyWords(message.content)
            });

            // 更新情绪轨迹
            if (message.role === 'user') {
                this.updateEmotionalJourney(sessionId, message.content);
            }

            // 保持最近50条消息
            if (session.messages.length > 50) {
                session.messages = session.messages.slice(-50);
            }
        }
    }

    // 分析情绪基调（增强版）
    analyzeEmotionalTone(content) {
        const emotionKeywords = {
            sad: ['难过', '伤心', '痛苦', '沮丧', '失落', '绝望', '哭', '眼泪', '悲伤', '忧郁', '消沉'],
            anxious: ['焦虑', '担心', '紧张', '害怕', '恐惧', '不安', '压力', '烦躁', '忧虑', '惊慌', '恐慌'],
            angry: ['愤怒', '生气', '恼火', '愤恨', '讨厌', '恨', '气愤', '暴躁', '恼怒', '愤慨'],
            happy: ['开心', '快乐', '高兴', '愉快', '兴奋', '满足', '幸福', '喜悦', '欣喜', '愉悦', '舒心'],
            tired: ['疲惫', '累', '疲劳', '困倦', '无力', '精疲力尽', '倦怠', '疲乏', '乏力'],
            confused: ['困惑', '迷茫', '不知道', '不明白', '搞不清', '纠结', '矛盾', '茫然', '迷惘'],
            hopeful: ['希望', '期待', '乐观', '积极', '正面', '向上', '美好', '光明', '未来'],
            lonely: ['孤独', '寂寞', '独自', '一个人', '没人', '空虚', '孤单', '孤立'],
            grateful: ['感谢', '感激', '感恩', '谢谢', '感动', '珍惜', '庆幸', '幸运']
        };

        const scores = {};
        let totalMatches = 0;

        // 计算每种情绪的得分
        for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
            scores[emotion] = 0;
            keywords.forEach(keyword => {
                const matches = (content.match(new RegExp(keyword, 'g')) || []).length;
                scores[emotion] += matches;
                totalMatches += matches;
            });
        }

        // 如果没有匹配到任何情绪词汇，返回中性
        if (totalMatches === 0) {
            return 'neutral';
        }

        // 找到得分最高的情绪
        const dominantEmotion = Object.entries(scores).reduce((a, b) => 
            scores[a[0]] > scores[b[0]] ? a : b
        )[0];

        // 计算情绪强度
        const intensity = this.calculateEmotionalIntensity(content);
        
        return {
            emotion: dominantEmotion,
            intensity: intensity,
            confidence: scores[dominantEmotion] / totalMatches,
            allScores: scores
        };
    }

    // 增强的情绪强度计算
    calculateEmotionalIntensity(content) {
        const intensityWords = {
            high: ['非常', '特别', '极其', '超级', '十分', '相当', '完全', '彻底', '深深地', '强烈地'],
            medium: ['很', '挺', '蛮', '真的', '确实', '明显', '显然'],
            low: ['有点', '稍微', '略微', '一点', '些许', '轻微']
        };

        let intensity = 1; // 基础强度
        
        // 检查高强度词汇
        intensityWords.high.forEach(word => {
            if (content.includes(word)) intensity += 0.8;
        });
        
        // 检查中等强度词汇
        intensityWords.medium.forEach(word => {
            if (content.includes(word)) intensity += 0.4;
        });
        
        // 检查低强度词汇
        intensityWords.low.forEach(word => {
            if (content.includes(word)) intensity += 0.2;
        });

        // 检查重复表达（如"很很很"）
        const repetitionPattern = /(.)\1{2,}/g;
        if (repetitionPattern.test(content)) {
            intensity += 0.5;
        }

        // 检查感叹号和问号
        const exclamationCount = (content.match(/[!！]/g) || []).length;
        const questionCount = (content.match(/[?？]/g) || []).length;
        intensity += (exclamationCount + questionCount) * 0.2;

        return Math.min(intensity, 3); // 最大强度为3
    }

    // 新增：分析应对策略
    analyzeCopingStrategies(content) {
        const strategies = [];
        
        this.emotionDictionary.coping.keywords.forEach(keyword => {
            if (content.includes(keyword)) {
                strategies.push(keyword);
            }
        });

        this.emotionDictionary.coping.strategies.forEach(strategy => {
            if (content.includes(strategy)) {
                strategies.push(strategy);
            }
        });

        return [...new Set(strategies)]; // 去重
    }

    // 新增：检测危机信号
    detectCrisisSignals(content) {
        const crisisKeywords = [
            '自杀', '结束生命', '不想活', '死了算了', '活着没意思', 
            '伤害自己', '自残', '割腕', '跳楼', '服药', 
            '没有希望', '绝望', '走投无路', '无法承受'
        ];

        const signals = [];
        crisisKeywords.forEach(keyword => {
            if (content.includes(keyword)) {
                signals.push(keyword);
            }
        });

        return {
            hasCrisisSignals: signals.length > 0,
            signals: signals,
            riskLevel: this.assessRiskLevel(signals.length, content)
        };
    }

    // 评估风险等级
    assessRiskLevel(signalCount, content) {
        if (signalCount === 0) return 'low';
        if (signalCount >= 3) return 'high';
        
        // 检查具体的高风险词汇
        const highRiskWords = ['自杀', '结束生命', '死了算了', '伤害自己'];
        const hasHighRiskWords = highRiskWords.some(word => content.includes(word));
        
        if (hasHighRiskWords) return 'high';
        return signalCount >= 2 ? 'medium' : 'low';
    }

    // 提取关键词
    extractKeyWords(content) {
        const importantTopics = [
            '工作', '学习', '家庭', '朋友', '恋爱', '健康', '睡眠', '压力',
            '目标', '梦想', '困难', '挑战', '成长', '改变', '希望', '未来',
            '过去', '童年', '父母', '孩子', '伴侣', '同事', '老师', '医生'
        ];

        return importantTopics.filter(topic => content.includes(topic));
    }

    // 更新情绪轨迹
    updateEmotionalJourney(sessionId, content) {
        const session = this.conversationMemory.get(sessionId);
        if (session) {
            const emotion = this.analyzeEmotionalTone(content);
            session.emotionalJourney.push({
                timestamp: new Date(),
                emotion: emotion,
                intensity: this.calculateEmotionalIntensity(content)
            });

            // 保持最近20个情绪记录
            if (session.emotionalJourney.length > 20) {
                session.emotionalJourney = session.emotionalJourney.slice(-20);
            }
        }
    }

    // 计算情绪强度
    calculateEmotionalIntensity(content) {
        const intensityWords = ['非常', '特别', '极其', '超级', '很', '太', '完全', '绝对'];
        let intensity = 1;
        
        intensityWords.forEach(word => {
            if (content.includes(word)) intensity += 0.5;
        });

        return Math.min(intensity, 3); // 最大强度为3
    }

    // 生成上下文摘要
    generateContextSummary(sessionId) {
        const session = this.conversationMemory.get(sessionId);
        if (!session) return '';

        const recentMessages = session.messages.slice(-10);
        const userName = session.userName;
        const currentEmotion = session.emotionalJourney.slice(-1)[0]?.emotion || 'neutral';
        const keyTopics = [...new Set(recentMessages.flatMap(msg => msg.keyWords || []))];
        
        let summary = `用户${userName}当前的情绪状态偏向${this.getEmotionDescription(currentEmotion)}。`;
        
        if (keyTopics.length > 0) {
            summary += `最近讨论的主要话题包括：${keyTopics.slice(0, 3).join('、')}。`;
        }

        const emotionalPattern = this.analyzeEmotionalPattern(session.emotionalJourney);
        if (emotionalPattern) {
            summary += `情绪变化趋势：${emotionalPattern}。`;
        }

        return summary;
    }

    // 获取情绪描述
    getEmotionDescription(emotion) {
        const descriptions = {
            sad: '悲伤和低落',
            anxious: '焦虑和不安',
            angry: '愤怒和烦躁',
            happy: '开心和积极',
            tired: '疲惫和无力',
            confused: '困惑和迷茫',
            neutral: '平静和稳定'
        };
        return descriptions[emotion] || '平静';
    }

    // 分析情绪模式
    analyzeEmotionalPattern(emotionalJourney) {
        if (emotionalJourney.length < 3) return null;

        const recent = emotionalJourney.slice(-3);
        const emotions = recent.map(e => e.emotion);
        
        if (emotions.every(e => ['sad', 'anxious'].includes(e))) {
            return '持续的负面情绪，需要特别关注';
        } else if (emotions.some(e => e === 'happy') && emotions.some(e => ['sad', 'anxious'].includes(e))) {
            return '情绪波动较大，正在经历起伏';
        } else if (emotions.slice(-2).every(e => e === 'happy')) {
            return '情绪正在好转';
        }
        
        return '情绪相对稳定';
    }

    // 生成个性化的治疗建议
    generateTherapyRecommendations(sessionId) {
        const session = this.conversationMemory.get(sessionId);
        if (!session) return [];

        const currentEmotion = session.emotionalJourney.slice(-1)[0]?.emotion;
        const recommendations = [];

        switch (currentEmotion) {
            case 'anxious':
                recommendations.push('深呼吸练习', '正念冥想', '渐进式肌肉放松');
                break;
            case 'sad':
                recommendations.push('感恩练习', '积极肯定', '情绪日记');
                break;
            case 'angry':
                recommendations.push('情绪释放练习', '冷静技巧', '沟通策略');
                break;
            case 'tired':
                recommendations.push('休息规划', '能量管理', '自我关怀');
                break;
            default:
                recommendations.push('正念练习', '自我反思', '目标设定');
        }

        return recommendations;
    }

    // 获取增强的上下文
    getEnhancedContext(sessionId) {
        const session = this.conversationMemory.get(sessionId);
        if (!session) return null;

        return {
            summary: this.generateContextSummary(sessionId),
            recommendations: this.generateTherapyRecommendations(sessionId),
            emotionalState: session.emotionalJourney.slice(-1)[0],
            keyTopics: [...new Set(session.messages.slice(-5).flatMap(msg => msg.keyWords || []))],
            sessionDuration: Date.now() - session.startTime.getTime(),
            messageCount: session.messages.length
        };
    }

    // 清理会话
    clearSession(sessionId) {
        this.conversationMemory.delete(sessionId);
    }
}

// 创建全局实例
export const ragService = new RAGService();

// 导出服务类
export default RAGService;
