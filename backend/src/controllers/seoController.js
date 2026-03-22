const { GoogleGenerativeAI } = require("@google/generative-ai");

const optimizeSEO = async (req, res) => {
    try {
        const { content, title, type, focusKeyphrase } = req.body;

        if (!content) {
            return res.status(400).json({ error: "Content is required" });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("Missing GEMINI_API_KEY in backend/.env");
            return res.status(500).json({ error: "API Key Configuration Error" });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
            You are a Senior SEO Specialist. Analyze the following ${type || 'article'} content and provide the perfect SEO metadata.
            
            Content: "${content.substring(0, 5000)}"
            Existing Title: "${title || ''}"
            ${focusKeyphrase ? `Target Focus Keyphrase: "${focusKeyphrase}"` : ''}

            Return ONLY a JSON object with the following fields:
            1. focusKeyphrase: ${focusKeyphrase ? 'Must be EXACTLY "' + focusKeyphrase + '", do not change it.' : 'Generate the best 2-4 word SEO keyphrase.'}
            2. seoMetaTitle: A compelling search title (approx 55 chars, max 60). Incorporate the focus keyphrase.
            3. slug: A clean, hyphenated URL slug (max 60 chars) ideally matching the focus keyphrase.
            4. seoMetaDescription: A high-CTR meta description. CRITICAL: MUST be between 130 and 150 characters. NEVER exceed 155 characters.
            5. summary: A brief 1-2 sentence summary of the article for readers (max 200 chars).
            6. improvementTips: An array of 1-3 short, highly specific actionable tips (max 12 words each) to improve the blog's SEO and readability. Focus on things the user can fix themselves (e.g., "Use more transition words", "Break up large paragraphs", "Use active voice"). If it's perfect, return an empty array.
            7. featuredImageAlt: A short, descriptive alt text for a potential featured image (5-10 words) that includes the focus keyphrase naturally for accessibility and SEO.
            8. healthMetrics: An object containing precise evaluations of the text:
               - "hasShortParagraphs": boolean (true if all paragraphs are under 150 words)
               - "variedSentenceStarts": boolean (true if the author rarely starts more than 2 consecutive sentences with the same word)
               - "passiveVoicePercentage": number (the exact percentage of sentences written in passive voice, e.g. 5, 12, 0)
               - "transitionsPercentage": number (the exact percentage of sentences containing a transition word like 'however', 'moreover', 'therefore', e.g. 25, 30, 10).

            Format the response as a valid JSON object. No extra text or markdown.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        
        // Clean up markdown code blocks if present
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();
        
        const seoData = JSON.parse(text);

        // Programmatic fallback to guarantee description is never over 160 chars
        if (seoData.seoMetaDescription && seoData.seoMetaDescription.length > 160) {
            seoData.seoMetaDescription = seoData.seoMetaDescription.substring(0, 157).trim() + "...";
        }

        res.json(seoData);
    } catch (error) {
        console.error("SEO Optimization Error:", error);
        res.status(500).json({ error: "Failed to optimize SEO" });
    }
};

module.exports = {
    optimizeSEO
};
