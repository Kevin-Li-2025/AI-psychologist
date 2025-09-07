const OpenAI = require('openai');

// 初始化 OpenAI 客户端，使用腾讯混元API
const client = new OpenAI({
    apiKey: "sk-uNlmqO6AkR9GhlAa8tjozNzF4bJcz4j22zlfBORjlRrozazP",
    baseURL: "https://api.hunyuan.cloud.tencent.com/v1"
});

// 示例1：基础对话
async function basicChat() {
    console.log("=== 基础对话示例 ===\n");

    try {
        const completion = await client.chat.completions.create({
            model: "hunyuan-lite",
            messages: [
                { role: "user", content: "请用一句话介绍一下腾讯混元大模型" }
            ]
        });

        console.log("用户:", "请用一句话介绍一下腾讯混元大模型");
        console.log("混元:", completion.choices[0].message.content.trim());
        console.log();

    } catch (error) {
        console.error("基础对话出错:", error.message);
    }
}

// 示例2：多轮对话
async function multiTurnChat() {
    console.log("=== 多轮对话示例 ===\n");

    const messages = [
        { role: "system", content: "你是一个友好的AI助手，请简洁地回答问题。" },
        { role: "user", content: "今天天气怎么样？" }
    ];

    try {
        console.log("用户:", "今天天气怎么样？");

        const completion1 = await client.chat.completions.create({
            model: "hunyuan-lite",
            messages: messages
        });

        const response1 = completion1.choices[0].message.content.trim();
        console.log("混元:", response1);
        console.log();

        // 继续对话
        messages.push({ role: "assistant", content: response1 });
        messages.push({ role: "user", content: "那明天呢？" });

        console.log("用户:", "那明天呢？");

        const completion2 = await client.chat.completions.create({
            model: "hunyuan-lite",
            messages: messages
        });

        console.log("混元:", completion2.choices[0].message.content.trim());
        console.log();

    } catch (error) {
        console.error("多轮对话出错:", error.message);
    }
}

// 示例3：代码生成
async function codeGeneration() {
    console.log("=== 代码生成示例 ===\n");

    try {
        const completion = await client.chat.completions.create({
            model: "hunyuan-lite",
            messages: [
                {
                    role: "user",
                    content: "请用JavaScript写一个计算斐波那契数列的函数，要求包含注释说明"
                }
            ]
        });

        console.log("用户:", "请用JavaScript写一个计算斐波那契数列的函数，要求包含注释说明");
        console.log("混元:");
        console.log(completion.choices[0].message.content);
        console.log();

    } catch (error) {
        console.error("代码生成出错:", error.message);
    }
}

// 示例4：参数控制
async function parameterControl() {
    console.log("=== 参数控制示例 ===\n");

    try {
        const completion = await client.chat.completions.create({
            model: "hunyuan-lite",
            messages: [
                { role: "user", content: "写一首关于编程的诗" }
            ],
            max_tokens: 200,           // 限制输出长度
            temperature: 0.8          // 控制创造性 (0.0-2.0)
        });

        console.log("用户:", "写一首关于编程的诗");
        console.log("混元:");
        console.log(completion.choices[0].message.content);
        console.log();

    } catch (error) {
        console.error("参数控制出错:", error.message);
    }
}

// 主函数，运行所有示例
async function runAllExamples() {
    await basicChat();
    await multiTurnChat();
    await codeGeneration();
    await parameterControl();

    console.log("🎉 所有示例运行完成！hunyuan-lite 模型免费使用，无需担心费用。");
}

// 运行所有示例
runAllExamples().catch(console.error);
