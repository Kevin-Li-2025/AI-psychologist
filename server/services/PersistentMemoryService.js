// 永久记忆系统 - 让AI拥有长期记忆
const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const logger = require('../utils/logger');

class PersistentMemoryService {
    constructor() {
        this.memoryPath = path.join(process.cwd(), 'data', 'memories');
        this.userProfilesPath = path.join(process.cwd(), 'data', 'profiles');
        this.relationshipsPath = path.join(process.cwd(), 'data', 'relationships');
        
        // 内存缓存
        this.memoryCache = new Map();
        this.profileCache = new Map();
        this.relationshipCache = new Map();
        
        this.initializeStorage();
        this.startPeriodicSave();
    }

    async initializeStorage() {
        try {
            await fs.ensureDir(this.memoryPath);
            await fs.ensureDir(this.userProfilesPath);
            await fs.ensureDir(this.relationshipsPath);
            
            // 加载现有数据到缓存
            await this.loadExistingData();
            
            logger.info('永久记忆系统初始化成功');
        } catch (error) {
            logger.error('永久记忆系统初始化失败', { error: error.message });
        }
    }

    async loadExistingData() {
        try {
            // 加载用户档案
            const profileFiles = await fs.readdir(this.userProfilesPath);
            for (const file of profileFiles) {
                if (file.endsWith('.json')) {
                    const userId = file.replace('.json', '');
                    const profileData = await fs.readJson(path.join(this.userProfilesPath, file));
                    this.profileCache.set(userId, profileData);
                }
            }

            // 加载记忆数据
            const memoryFiles = await fs.readdir(this.memoryPath);
            for (const file of memoryFiles) {
                if (file.endsWith('.json')) {
                    const userId = file.replace('.json', '');
                    const memoryData = await fs.readJson(path.join(this.memoryPath, file));
                    this.memoryCache.set(userId, memoryData);
                }
            }

            logger.info('加载现有数据完成', {
                profiles: this.profileCache.size,
                memories: this.memoryCache.size
            });
        } catch (error) {
            logger.error('加载现有数据失败', { error: error.message });
        }
    }

    // 生成用户唯一ID（基于名字和时间戳的哈希）
    generateUserId(userName, sessionStart) {
        const data = `${userName.toLowerCase()}_${sessionStart}`;
        return crypto.createHash('sha256').update(data).digest('hex').substring(0, 16);
    }

    // 创建或更新用户档案
    async createOrUpdateUserProfile(userName, sessionData = {}) {
        const userId = this.generateUserId(userName, Date.now());
        
        let profile = this.profileCache.get(userId) || {
            userId,
            userName,
            createdAt: new Date().toISOString(),
            lastSeen: new Date().toISOString(),
            sessions: [],
            preferences: {
                communicationStyle: 'gentle',
                preferredTopics: [],
                avoidTopics: [],
                responseLength: 'medium',
                emotionalSensitivity: 'high'
            },
            demographics: {
                ageRange: null,
                interests: [],
                location: null,
                timezone: null
            },
            therapeuticProfile: {
                primaryConcerns: [],
                copingStrategies: [],
                triggers: [],
                strengths: [],
                goals: [],
                progressMarkers: []
            },
            relationshipHistory: {
                therapeuticAlliance: 0, // 0-100 治疗联盟强度
                trustLevel: 0, // 0-100 信任度
                comfortLevel: 0, // 0-100 舒适度
                engagementLevel: 0, // 0-100 参与度
                milestones: []
            }
        };

        // 更新最后见面时间
        profile.lastSeen = new Date().toISOString();
        
        // 添加会话记录
        if (sessionData.sessionId) {
            profile.sessions.push({
                sessionId: sessionData.sessionId,
                date: new Date().toISOString(),
                duration: sessionData.duration || 0,
                messageCount: sessionData.messageCount || 0,
                emotionalState: sessionData.emotionalState,
                keyTopics: sessionData.keyTopics || [],
                breakthroughs: sessionData.breakthroughs || []
            });
        }

        this.profileCache.set(userId, profile);
        await this.saveProfileToDisk(userId, profile);
        
        return userId;
    }

    // 保存长期记忆
    async saveMemory(userId, memoryData) {
        let userMemories = this.memoryCache.get(userId) || {
            userId,
            episodicMemories: [], // 情节记忆（具体事件）
            semanticMemories: [], // 语义记忆（知识和概念）
            emotionalMemories: [], // 情感记忆
            proceduralMemories: [], // 程序记忆（习惯和模式）
            autobiographicalMemories: [], // 自传式记忆
            relationships: {
                sharedExperiences: [],
                importantMoments: [],
                insideJokes: [],
                personalDetails: {},
                emotionalBonds: []
            }
        };

        // 根据记忆类型分类存储
        if (memoryData.type === 'episodic') {
            userMemories.episodicMemories.push({
                id: crypto.randomUUID(),
                timestamp: new Date().toISOString(),
                content: memoryData.content,
                context: memoryData.context,
                emotionalTone: memoryData.emotionalTone,
                importance: memoryData.importance || 'medium',
                tags: memoryData.tags || []
            });
        } else if (memoryData.type === 'semantic') {
            userMemories.semanticMemories.push({
                id: crypto.randomUUID(),
                timestamp: new Date().toISOString(),
                concept: memoryData.concept,
                details: memoryData.details,
                associations: memoryData.associations || [],
                confidence: memoryData.confidence || 0.8
            });
        } else if (memoryData.type === 'emotional') {
            userMemories.emotionalMemories.push({
                id: crypto.randomUUID(),
                timestamp: new Date().toISOString(),
                emotion: memoryData.emotion,
                intensity: memoryData.intensity,
                trigger: memoryData.trigger,
                context: memoryData.context,
                resolution: memoryData.resolution
            });
        }

        // 限制记忆数量，保留最重要的
        userMemories = this.consolidateMemories(userMemories);
        
        this.memoryCache.set(userId, userMemories);
        await this.saveMemoryToDisk(userId, userMemories);
    }

    // 记忆整合（模拟遗忘和重要记忆保留）
    consolidateMemories(memories) {
        const maxMemories = {
            episodic: 1000,
            semantic: 500,
            emotional: 200,
            procedural: 100
        };

        // 按重要性和时间排序，保留最重要的记忆
        Object.keys(maxMemories).forEach(type => {
            const memoryArray = memories[`${type}Memories`];
            if (memoryArray && memoryArray.length > maxMemories[type]) {
                // 按重要性和新鲜度排序
                memoryArray.sort((a, b) => {
                    const aScore = this.calculateMemoryScore(a);
                    const bScore = this.calculateMemoryScore(b);
                    return bScore - aScore;
                });
                
                memories[`${type}Memories`] = memoryArray.slice(0, maxMemories[type]);
            }
        });

        return memories;
    }

    // 计算记忆重要性分数
    calculateMemoryScore(memory) {
        const now = Date.now();
        const memoryTime = new Date(memory.timestamp).getTime();
        const ageInDays = (now - memoryTime) / (1000 * 60 * 60 * 24);
        
        let importanceScore = 0;
        switch (memory.importance) {
            case 'critical': importanceScore = 10; break;
            case 'high': importanceScore = 7; break;
            case 'medium': importanceScore = 5; break;
            case 'low': importanceScore = 3; break;
            default: importanceScore = 5;
        }

        // 情感强度加分
        const emotionalBonus = (memory.intensity || 0) * 2;
        
        // 时间衰减（但重要记忆衰减更慢）
        const timeDecay = Math.exp(-ageInDays / (30 * importanceScore));
        
        return (importanceScore + emotionalBonus) * timeDecay;
    }

    // 检索相关记忆
    async retrieveRelevantMemories(userId, context, limit = 10) {
        const userMemories = this.memoryCache.get(userId);
        if (!userMemories) return [];

        const allMemories = [
            ...userMemories.episodicMemories.map(m => ({ ...m, type: 'episodic' })),
            ...userMemories.semanticMemories.map(m => ({ ...m, type: 'semantic' })),
            ...userMemories.emotionalMemories.map(m => ({ ...m, type: 'emotional' }))
        ];

        // 基于上下文的相关性评分
        const scoredMemories = allMemories.map(memory => {
            const relevanceScore = this.calculateRelevanceScore(memory, context);
            return { ...memory, relevanceScore };
        });

        // 按相关性排序并返回前N个
        return scoredMemories
            .sort((a, b) => b.relevanceScore - a.relevanceScore)
            .slice(0, limit);
    }

    // 计算记忆相关性
    calculateRelevanceScore(memory, context) {
        let score = 0;
        
        // 关键词匹配
        const contextWords = context.toLowerCase().split(/\s+/);
        const memoryText = (memory.content || memory.concept || memory.emotion || '').toLowerCase();
        
        contextWords.forEach(word => {
            if (memoryText.includes(word)) {
                score += 2;
            }
        });

        // 情感匹配
        if (memory.emotionalTone && context.includes(memory.emotionalTone)) {
            score += 3;
        }

        // 标签匹配
        if (memory.tags) {
            memory.tags.forEach(tag => {
                if (context.toLowerCase().includes(tag.toLowerCase())) {
                    score += 1;
                }
            });
        }

        // 时间权重（最近的记忆更相关）
        const ageInDays = (Date.now() - new Date(memory.timestamp).getTime()) / (1000 * 60 * 60 * 24);
        const recencyBonus = Math.exp(-ageInDays / 30);
        
        return score * (1 + recencyBonus);
    }

    // 分析用户成长轨迹
    async analyzeUserGrowth(userId) {
        const profile = this.profileCache.get(userId);
        const memories = this.memoryCache.get(userId);
        
        if (!profile || !memories) return null;

        const growth = {
            emotionalJourney: this.analyzeEmotionalProgress(memories),
            copingSkillsDevelopment: this.analyzeCopingSkills(memories),
            relationshipEvolution: this.analyzeRelationshipGrowth(profile),
            insights: this.generateGrowthInsights(profile, memories)
        };

        return growth;
    }

    // 分析情感进展
    analyzeEmotionalProgress(memories) {
        const emotionalMemories = memories.emotionalMemories.sort((a, b) => 
            new Date(a.timestamp) - new Date(b.timestamp)
        );

        if (emotionalMemories.length < 2) return null;

        const early = emotionalMemories.slice(0, Math.ceil(emotionalMemories.length / 3));
        const recent = emotionalMemories.slice(-Math.ceil(emotionalMemories.length / 3));

        const earlyAvgIntensity = early.reduce((sum, m) => sum + (m.intensity || 0), 0) / early.length;
        const recentAvgIntensity = recent.reduce((sum, m) => sum + (m.intensity || 0), 0) / recent.length;

        return {
            emotionalStabilityTrend: earlyAvgIntensity - recentAvgIntensity,
            predominantEmotions: this.findPredominantEmotions(emotionalMemories),
            emotionalRange: this.calculateEmotionalRange(emotionalMemories)
        };
    }

    // 保存到磁盘
    async saveProfileToDisk(userId, profile) {
        try {
            const filePath = path.join(this.userProfilesPath, `${userId}.json`);
            await fs.writeJson(filePath, profile, { spaces: 2 });
        } catch (error) {
            logger.error('保存用户档案失败', { userId, error: error.message });
        }
    }

    async saveMemoryToDisk(userId, memories) {
        try {
            const filePath = path.join(this.memoryPath, `${userId}.json`);
            await fs.writeJson(filePath, memories, { spaces: 2 });
        } catch (error) {
            logger.error('保存记忆失败', { userId, error: error.message });
        }
    }

    // 定期保存（防止数据丢失）
    startPeriodicSave() {
        setInterval(async () => {
            try {
                const savePromises = [];
                
                // 保存所有缓存的档案
                for (const [userId, profile] of this.profileCache.entries()) {
                    savePromises.push(this.saveProfileToDisk(userId, profile));
                }
                
                // 保存所有缓存的记忆
                for (const [userId, memories] of this.memoryCache.entries()) {
                    savePromises.push(this.saveMemoryToDisk(userId, memories));
                }
                
                await Promise.all(savePromises);
                logger.debug('定期保存完成', { 
                    profiles: this.profileCache.size, 
                    memories: this.memoryCache.size 
                });
            } catch (error) {
                logger.error('定期保存失败', { error: error.message });
            }
        }, 5 * 60 * 1000); // 每5分钟保存一次
    }

    // 清理旧数据
    async cleanupOldData(maxAge = 365) { // 默认保留一年
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - maxAge);

        for (const [userId, profile] of this.profileCache.entries()) {
            if (new Date(profile.lastSeen) < cutoffDate) {
                this.profileCache.delete(userId);
                this.memoryCache.delete(userId);
                
                // 删除磁盘文件
                await fs.remove(path.join(this.userProfilesPath, `${userId}.json`));
                await fs.remove(path.join(this.memoryPath, `${userId}.json`));
                
                logger.info('清理过期用户数据', { userId, lastSeen: profile.lastSeen });
            }
        }
    }

    // 工具方法
    findPredominantEmotions(emotionalMemories) {
        const emotionCounts = {};
        emotionalMemories.forEach(memory => {
            emotionCounts[memory.emotion] = (emotionCounts[memory.emotion] || 0) + 1;
        });
        
        return Object.entries(emotionCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([emotion, count]) => ({ emotion, count }));
    }

    calculateEmotionalRange(emotionalMemories) {
        const intensities = emotionalMemories.map(m => m.intensity || 0);
        return {
            min: Math.min(...intensities),
            max: Math.max(...intensities),
            avg: intensities.reduce((sum, i) => sum + i, 0) / intensities.length
        };
    }

    analyzeCopingSkills(memories) {
        // 分析用户应对技能的发展
        const copingEvents = memories.episodicMemories.filter(m => 
            m.tags && m.tags.some(tag => tag.includes('coping') || tag.includes('strategy'))
        );
        
        return {
            skillsLearned: copingEvents.map(e => e.content),
            effectivenessGrowth: this.calculateSkillEffectiveness(copingEvents)
        };
    }

    calculateSkillEffectiveness(copingEvents) {
        // 简化的效果评估
        return copingEvents.length > 0 ? Math.min(copingEvents.length * 10, 100) : 0;
    }

    analyzeRelationshipGrowth(profile) {
        const history = profile.relationshipHistory;
        return {
            trustGrowth: history.trustLevel,
            comfortGrowth: history.comfortLevel,
            engagementGrowth: history.engagementLevel,
            milestones: history.milestones
        };
    }

    generateGrowthInsights(profile, memories) {
        const insights = [];
        
        // 基于数据生成见解
        if (memories.emotionalMemories.length > 10) {
            insights.push("你已经在情感表达方面展现出了很大的开放性和勇气");
        }
        
        if (profile.sessions.length > 5) {
            insights.push("我们的治疗关系正在稳步发展，你的坚持让我很感动");
        }
        
        return insights;
    }
}

// 创建全局实例
const persistentMemoryService = new PersistentMemoryService();

module.exports = persistentMemoryService;
