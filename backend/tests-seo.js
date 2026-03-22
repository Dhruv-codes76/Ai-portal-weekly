require('dotenv').config({ path: '/home/vonny/Desktop/AI Tools/ai-mvp-project/backend/.env' });
const { GoogleGenerativeAI } = require("@google/generative-ai");
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const prompt = `
You are a Senior SEO Specialist. Analyze the following article content and provide the perfect SEO package.

Content: "This is a test blog post to check if SEO works. It talks about Apple Watch Ultra and its battery life."
Existing Title: "Apple Watch Ultra Review"

Return ONLY a JSON object with the following fields:
1. focusKeyphrase: The single most important SEO keyphrase (2-4 words).
2. seoMetaTitle: A compelling search title (approx 55 chars, including brand "| AI Portal").
3. slug: A clean, hyphenated URL slug (max 60 chars).
4. seoMetaDescription: A high-CTR meta description (approx 155 chars).
5. summary: A brief 1-2 sentence summary of the article for readers (max 200 chars).

Ensure the focusKeyphrase is actually present in the content multiple times.
Format the response as a valid JSON object. No extra text.
`;

async function run() {
    try {
        const result = await model.generateContent(prompt);
        let text = result.response.text();
        console.log("Raw output:");
        console.log(text);
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();
        console.log("Cleaned string:", text);
        const parsed = JSON.parse(text);
        console.log("Parsed JSON:", parsed);
    } catch(err) {
        console.error("Test Error:", err);
    }
}
run();
