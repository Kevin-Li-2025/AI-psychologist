const OpenAI = require('openai');

// 初始化 OpenAI 客户端，使用腾讯混元API
const client = new OpenAI({
    apiKey: "sk-uNlmqO6AkR9GhlAa8tjozNzF4bJcz4j22zlfBORjlRrozazP",
    baseURL: "https://api.hunyuan.cloud.tencent.com/v1"
});

async function main() {
    try {
        console.log("正在调用腾讯混元大模型 hunyuan-lite...\n");

        const completion = await client.chat.completions.create({
            model: "hunyuan-lite",
            messages: [
                { role: "user", content: "介绍一下你自己" }
            ]
        });

        console.log("回复内容:");
        console.log(completion.choices[0].message.content);
        console.log("\n调用成功！hunyuan-lite 模型免费使用，输入+输出 tokens 都不计费。");

    } catch (error) {
        console.error("调用出错:", error.message);
        if (error.response) {
            console.error("响应状态:", error.response.status);
            console.error("响应数据:", error.response.data);
        }
    }
}

// 运行示例
main();
