// 测试RAG功能
import { ragService } from './frontend/src/services/ragService.js';
import { generateGentleSystemPrompt } from './frontend/src/services/systemPrompts.js';

// 测试RAG服务
console.log('🧪 测试RAG功能...\n');

// 1. 初始化会话
const sessionId = ragService.initializeSession('测试用户');
console.log('✅ 会话初始化成功:', sessionId);

// 2. 添加一些测试消息
const testMessages = [
    { role: 'user', content: '我今天感到很焦虑，工作压力很大' },
    { role: 'assistant', content: '我理解你的感受，工作压力确实会让人焦虑' },
    { role: 'user', content: '我晚上总是睡不好，一直在想工作的事情' },
    { role: 'assistant', content: '睡眠问题会加重焦虑，我们来想想解决办法' }
];

testMessages.forEach(msg => {
    ragService.addMessage(sessionId, msg);
});

console.log('✅ 测试消息添加完成');

// 3. 获取增强上下文
const context = ragService.getEnhancedContext(sessionId);
console.log('📊 增强上下文信息:');
console.log('- 摘要:', context.summary);
console.log('- 情绪状态:', context.emotionalState);
console.log('- 关键话题:', context.keyTopics);
console.log('- 治疗建议:', context.recommendations);

// 4. 生成温柔系统提示
const systemPrompt = generateGentleSystemPrompt(
    '测试用户',
    context.summary,
    context.emotionalState,
    context.recommendations
);

console.log('\n💚 生成的温柔系统提示:');
console.log(systemPrompt.substring(0, 200) + '...');

// 5. 清理会话
ragService.clearSession(sessionId);
console.log('\n✅ 测试完成，会话已清理');

export default {};
