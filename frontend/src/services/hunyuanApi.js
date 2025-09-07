// 腾讯混元大模型 API 服务
const API_CONFIG = {
    baseURL: "/api"  // 使用相对路径，开发环境通过Vite代理转发到后端
};

// 调用混元API（通过后端服务器）
export const callHunyuanAPI = async (messages, options = {}) => {
    try {
        const response = await fetch(`${API_CONFIG.baseURL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: messages,
                temperature: options.temperature || 0.7,
                maxTokens: options.maxTokens || 1000,
                userId: options.userId,
                sessionId: options.sessionId,
                userEmotion: options.userEmotion
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error || errorData.message || `API 请求失败: ${response.status} ${response.statusText}`;
            throw new Error(errorMessage);
        }

        const data = await response.json();

        // 处理后端返回的数据结构 {success: true, data: {...}}
        const responseData = data.success ? data.data : data;

        return {
            content: responseData.content,
            role: responseData.role,
            usage: responseData.usage,
            timestamp: responseData.timestamp
        };
    } catch (error) {
        console.error('API 调用错误:', error);
        throw new Error(`调用混元API失败: ${error.message}`);
    }
};

// 格式化消息
export const formatMessage = (content, role = 'user') => ({
    role,
    content,
    timestamp: new Date().toISOString(),
    id: Date.now() + Math.random()
});

// 模拟打字效果
export const simulateTyping = (text, callback, speed = 50) => {
    let index = 0;
    const timer = setInterval(() => {
        if (index < text.length) {
            callback(text.slice(0, index + 1));
            index++;
        } else {
            clearInterval(timer);
        }
    }, speed);

    return timer;
};
