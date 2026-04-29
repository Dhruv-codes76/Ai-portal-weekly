const aiWriterService = require('../services/aiWriterService');
const { generateObject } = require('ai');
const { z } = require('zod');

const optimizeSEO = async (req, res) => {
    try {
        const { content, title, type, focusKeyphrase } = req.body;

        if (!content) {
            return res.status(400).json({ error: "Content is required" });
        }

        const seoSchema = z.object({
            focusKeyphrase: z.string().describe("the target keyword"),
            seoMetaTitle: z.string().min(45).max(60),
            slug: z.string().max(60),
            seoMetaDescription: z.string().min(140).max(155),
            summary: z.string().max(180),
            featuredImageAlt: z.string(),
            improvementTips: z.array(z.string()),
            healthMetrics: z.object({
                hasShortParagraphs: z.boolean(),
                variedSentenceStarts: z.boolean(),
                passiveVoicePercentage: z.number(),
                transitionsPercentage: z.number()
            })
        });

        const seoData = await aiWriterService.executeWithRetry(async (model) => {
            const { object } = await generateObject({
                model,
                schema: seoSchema,
                prompt: `
                You are a Senior SEO Specialist for "AI Portal Weekly". 
                Analyze the following ${type || 'article'} content and provide a perfect SEO metadata set.
                
                SEO AUDIT RULES:
                1. **Keyphrase**: Use "${focusKeyphrase || 'Identify a 2-4 word primary keyphrase'}" as the focusKeyphrase.
                2. **Title**: 45-60 chars including the keyphrase.
                3. **Slug**: Clean URL slug starting with the keyphrase.
                4. **Meta Description**: 140-155 characters.
                5. **Alt Text**: Include the keyphrase.
                6. **Readability Metrics**: Evaluate Passive Voice (<10%) and Transitions (>25%).

                Content Overview: "${content.substring(0, 3000)}"
                Published Title: "${title || ''}"
                `
            });
            return object;
        }, 'gemini-flash-lite-latest');

        res.json(seoData);
    } catch (error) {
        console.error("SEO Optimization Error:", error.message);
        res.status(500).json({ error: "Failed to reach the Magic engine. Try again in a moment." });
    }
};

module.exports = {
    optimizeSEO
};

