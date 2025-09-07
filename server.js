const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const logger = require('./server/utils/logger');
const { asyncHandler, sendResponse, sendError } = require('./server/utils');
const persistentMemoryService = require('./server/services/PersistentMemoryService');
const personalityService = require('./server/services/PersonalityService');

const app = express();
const PORT = process.env.PORT || 3001;

// 安全中间件
app.use(helmet({
    contentSecurityPolicy: false, // 暂时禁用CSP以支持内联样式
    crossOriginEmbedderPolicy: false
}));

// 压缩中间件
app.use(compression());

// CORS配置
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-domain.com'] 
        : ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true
}));

// 请求大小限制
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 静态文件服务
app.use(express.static('frontend/dist'));

// 请求日志中间件
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
    });
    next();
});

// API请求限制
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 100, // 限制每个IP每15分钟最多100个请求
    message: {
        error: '请求过于频繁，请稍后再试',
        retryAfter: '15分钟'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// 聊天API特殊限制
const chatLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1分钟
    max: 10, // 限制每个IP每分钟最多10个聊天请求
    message: {
        error: '聊天请求过于频繁，请稍后再试',
        retryAfter: '1分钟'
    }
});

app.use('/api', apiLimiter);

// 腾讯混元API配置
const HUNYUAN_CONFIG = {
    apiKey: "sk-uNlmqO6AkR9GhlAa8tjozNzF4bJcz4j22zlfBORjlRrozazP",
    baseURL: "https://api.hunyuan.cloud.tencent.com/v1",
    model: "hunyuan-lite"
};

// 错误报告API
app.post('/api/error-report', asyncHandler(async (req, res) => {
    const { errorId, message, stack, componentStack, timestamp, userAgent, url } = req.body;
    
    logger.error('Frontend Error Report', {
        errorId,
        message,
        stack,
        componentStack,
        timestamp,
        userAgent,
        url,
        ip: req.ip
    });
    
    sendResponse(res, 200, true, null, '错误报告已收到');
}));

// 聊天API路由
app.post('/api/chat', chatLimiter, asyncHandler(async (req, res) => {
    try {
        const { messages, temperature = 0.7, maxTokens = 1000, userId, sessionId, userEmotion } = req.body;

        // 验证请求数据
        if (!messages || !Array.isArray(messages)) {
            return sendError(res, 400, '消息格式错误');
        }

        if (messages.length === 0) {
            return sendError(res, 400, '消息不能为空');
        }

        if (messages.length > 20) {
            return sendError(res, 400, '消息历史过长，请重新开始对话');
        }

        logger.info('收到聊天请求', { 
            messageCount: messages.length,
            userId: userId || 'anonymous',
            userEmotion: userEmotion || 'unknown',
            ip: req.ip,
            userAgent: req.get('User-Agent')
        });

        // 获取用户记忆和人格化上下文
        let enhancedMessages = [...messages];
        let personalityContext = null;
        let relevantMemories = [];

        if (userId) {
            // 检索相关记忆
            const lastUserMessage = messages[messages.length - 1];
            if (lastUserMessage && lastUserMessage.role === 'user') {
                relevantMemories = await persistentMemoryService.retrieveRelevantMemories(
                    userId, 
                    lastUserMessage.content, 
                    5
                );
            }

            // 生成人格化上下文
            personalityContext = personalityService.generatePersonalizedResponse({
                userId,
                message: lastUserMessage?.content,
                userEmotion,
                relationship: { trustLevel: 70, sessionCount: 5 }, // 这里应该从记忆中获取
                sessionHistory: messages
            });

            // 创建人格化的系统提示
            const personalityPrompt = personalityService.generatePersonalityPrompt({
                userId,
                relationship: { trustLevel: 70, sessionCount: 5 },
                userHistory: relevantMemories
            });

            // 构建增强的上下文
            let contextEnhancement = '';
            
            if (relevantMemories.length > 0) {
                contextEnhancement += '\n\n## 相关记忆片段：\n';
                relevantMemories.forEach((memory, index) => {
                    contextEnhancement += `${index + 1}. ${memory.content || memory.concept || memory.emotion}\n`;
                });
            }

            if (personalityContext?.personalTouch) {
                contextEnhancement += `\n\n## 个人化回应指导：\n${personalityContext.personalTouch}\n`;
            }

            // 将人格和记忆信息添加到系统消息
            enhancedMessages = [
                {
                    role: 'system',
                    content: personalityPrompt + contextEnhancement
                },
                ...messages.slice(1) // 跳过原始系统消息
            ];

            // 记录交互用于人格状态更新
            if (userEmotion) {
                personalityService.recordInteraction(userId, {
                    emotionalIntensity: getEmotionIntensity(userEmotion),
                    topicSensitivity: 'medium',
                    duration: 5 // 估算的交互时长
                });
            }
        }

        // 调用腾讯混元API
        const response = await fetch(`${HUNYUAN_CONFIG.baseURL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${HUNYUAN_CONFIG.apiKey}`
            },
            body: JSON.stringify({
                model: HUNYUAN_CONFIG.model,
                messages: enhancedMessages,
                max_tokens: Math.min(maxTokens, 800), // 限制最大token数提高速度
                temperature: temperature,
                stream: false,
                top_p: 0.9, // 添加top_p参数提高响应质量
                frequency_penalty: 0.1 // 减少重复内容
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            logger.error('混元API调用失败', {
                status: response.status,
                statusText: response.statusText,
                errorText: errorText,
                ip: req.ip
            });
            
            if (response.status === 429) {
                return sendError(res, 429, 'API请求频率过高，请稍后再试');
            } else if (response.status >= 500) {
                return sendError(res, 503, '混元服务暂时不可用，请稍后再试');
            } else {
                return sendError(res, 400, 'API请求失败，请检查输入内容');
            }
        }

        const data = await response.json();

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            logger.error('混元API返回数据格式错误', { data });
            return sendError(res, 502, 'AI服务返回数据异常');
        }

        logger.info('API调用成功', {
            responseLength: data.choices[0].message.content.length,
            usage: data.usage,
            ip: req.ip
        });

        // 保存记忆（如果有用户ID）
        if (userId && sessionId) {
            const aiResponse = data.choices[0].message.content;
            
            // 保存用户消息到记忆
            const lastUserMessage = messages[messages.length - 1];
            if (lastUserMessage && lastUserMessage.role === 'user') {
                await persistentMemoryService.saveMemory(userId, {
                    type: 'episodic',
                    content: lastUserMessage.content,
                    context: `对话情境: ${userEmotion || '情绪未知'}`,
                    emotionalTone: userEmotion,
                    importance: getMessageImportance(lastUserMessage.content),
                    tags: extractTags(lastUserMessage.content)
                });
            }

            // 保存AI回应到记忆
            await persistentMemoryService.saveMemory(userId, {
                type: 'episodic', 
                content: aiResponse,
                context: '治疗师回应',
                emotionalTone: 'supportive',
                importance: 'medium',
                tags: ['therapy_response', 'ai_support']
            });

            // 更新用户档案
            await persistentMemoryService.createOrUpdateUserProfile(userId.split('_')[0], {
                sessionId,
                messageCount: messages.length,
                emotionalState: userEmotion,
                keyTopics: extractTags(lastUserMessage?.content || ''),
                duration: 5
            });
        }

        sendResponse(res, 200, true, {
            content: data.choices[0].message.content,
            role: data.choices[0].message.role,
            usage: data.usage,
            timestamp: new Date().toISOString(),
            personalityContext: personalityContext ? {
                currentMood: personalityContext.personality?.currentMood,
                energy: personalityContext.personality?.energy,
                recentThoughts: personalityContext.personality?.recentThoughts
            } : null,
            memoryContext: relevantMemories.length > 0 ? {
                relevantMemoriesCount: relevantMemories.length,
                hasPersonalHistory: true
            } : null
        });

    } catch (error) {
        logger.error('聊天API服务器错误', {
            error: error.message,
            stack: error.stack,
            ip: req.ip
        });
        sendError(res, 500, '服务器内部错误，请稍后再试');
    }
}));

// 健康检查
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        model: HUNYUAN_CONFIG.model
    });
});

// 前端路由（SPA支持）
app.get('*', (req, res) => {
    // 排除API路由
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(__dirname + '/frontend/dist/index.html');
});

// 全局错误处理中间件
app.use((error, req, res, next) => {
    logger.error('未捕获的错误', {
        error: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        ip: req.ip
    });
    
    sendError(res, 500, '服务器内部错误');
});

// 404处理
app.use((req, res) => {
    if (req.path.startsWith('/api')) {
        return sendError(res, 404, 'API端点不存在');
    }
    // 对于非API路由，返回前端应用
    res.sendFile(__dirname + '/frontend/dist/index.html');
});

// 优雅关闭
process.on('SIGTERM', () => {
    logger.info('收到SIGTERM信号，开始优雅关闭服务器');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('收到SIGINT信号，开始优雅关闭服务器');
    process.exit(0);
});

// 未捕获异常处理
process.on('uncaughtException', (error) => {
    logger.error('未捕获的异常', { error: error.message, stack: error.stack });
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('未处理的Promise拒绝', { reason, promise });
    process.exit(1);
});

// 启动服务器
const server = app.listen(PORT, () => {
    logger.info('服务器启动成功', {
        port: PORT,
        env: process.env.NODE_ENV || 'development',
        model: HUNYUAN_CONFIG.model
    });
    
    console.log(`🚀 服务器启动成功！`);
    console.log(`📍 后端API: http://localhost:${PORT}/api`);
    console.log(`🌐 前端界面: http://localhost:${PORT}`);
    console.log(`🤖 混元模型: ${HUNYUAN_CONFIG.model} (免费使用)`);
    console.log(`📊 日志级别: ${process.env.LOG_LEVEL || 'info'}`);
});

// 工具函数
function getEmotionIntensity(emotion) {
    const intensityMap = {
        'happy': 6,
        'sad': 8,
        'anxious': 9,
        'angry': 9,
        'calm': 3,
        'excited': 7,
        'confused': 5,
        'neutral': 2
    };
    return intensityMap[emotion] || 5;
}

function getMessageImportance(content) {
    // 基于内容长度和关键词判断重要性
    const keyWords = ['死', '自杀', '伤害', '绝望', '痛苦', '害怕', '爱', '感谢', '突破', '成长'];
    const hasKeyWords = keyWords.some(word => content.includes(word));
    
    if (hasKeyWords) return 'high';
    if (content.length > 100) return 'medium';
    return 'low';
}

function extractTags(content) {
    const tags = [];
    const tagKeywords = {
        'family': ['家人', '父母', '爸爸', '妈妈', '孩子', '家庭'],
        'work': ['工作', '公司', '老板', '同事', '职业', '事业'],
        'relationship': ['恋爱', '男朋友', '女朋友', '伴侣', '爱情', '分手'],
        'study': ['学习', '学校', '考试', '成绩', '老师', '同学'],
        'health': ['身体', '健康', '生病', '医院', '药', '治疗'],
        'emotion': ['开心', '难过', '焦虑', '愤怒', '害怕', '担心']
    };
    
    Object.entries(tagKeywords).forEach(([tag, keywords]) => {
        if (keywords.some(keyword => content.includes(keyword))) {
            tags.push(tag);
        }
    });
    
    return tags;
}

// 设置服务器超时
server.timeout = 30000; // 30秒超时

module.exports = app;
