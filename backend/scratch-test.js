require('dotenv').config();
const aiWriterService = require('./src/services/aiWriterService');

async function testRewrite() {
    console.log("--- Testing News Rewrite ---");
    try {
        const result = await aiWriterService.rewriteNews(
            "OpenAI SORA is finally here",
            "OpenAI has released SORA to the public after months of testing. It can generate 60-second videos."
        );
        console.log("News Rewrite Success:", JSON.stringify(result, null, 2));
    } catch (error) {
        console.error("News Rewrite Failed:", error);
    }

    console.log("\n--- Testing Tool Rewrite ---");
    try {
        const result = await aiWriterService.rewriteTool(
            "Claude 3.7",
            "Anthropic's latest model with improved reasoning and coding capabilities."
        );
        console.log("Tool Rewrite Success:", JSON.stringify(result, null, 2));
    } catch (error) {
        console.error("Tool Rewrite Failed:", error);
    }
}

testRewrite();
