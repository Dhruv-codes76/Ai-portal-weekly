const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIWriterService {
    constructor() {
        const keys = [];
        
        // 1. Check for individual numbered keys (most reliable for Render)
        if (process.env.GEMINI_API_KEY_1) keys.push(process.env.GEMINI_API_KEY_1.trim());
        if (process.env.GEMINI_API_KEY_2) keys.push(process.env.GEMINI_API_KEY_2.trim());
        if (process.env.GEMINI_API_KEY_3) keys.push(process.env.GEMINI_API_KEY_3.trim());

        // 2. Fallback to comma-separated list if no numbered keys found
        if (keys.length === 0) {
            const rawKeys = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY;
            if (rawKeys) {
                const splitKeys = rawKeys.split(',').map(k => k.trim()).filter(k => k !== '');
                keys.push(...splitKeys);
            }
        }

        // Remove any potential duplicates and save
        this.apiKeys = [
            process.env.GEMINI_API_KEY_1,
            process.env.GEMINI_API_KEY_2,
            process.env.GEMINI_API_KEY_3
        ].filter(Boolean).map(key => key.trim());

        this.currentIndex = 0;
        this.currentModel = 'gemini-2.5-flash'; // High-End Default for Scraping
        
        if (this.apiKeys.length === 0) {
            console.warn("WARNING: No Gemini API keys found (tried GEMINI_API_KEY_1-3). AI Writer will fail.");
        } else {
            console.log(`AI Writer initialized with ${this.apiKeys.length} API keys. Scraper Default: ${this.currentModel}`);
        }
    }

    /**
     * Helper to get a configured GenAI instance with the current key.
     */
    getGenAI() {
        if (this.apiKeys.length === 0) {
            throw new Error("No Gemini API keys found in environment variables.");
        }
        return new GoogleGenerativeAI(this.apiKeys[this.currentIndex]);
    }

    /**
     * Rotates to the next API key.
     */
    rotateKey() {
        if (this.apiKeys.length > 1) {
            this.currentIndex = (this.currentIndex + 1) % this.apiKeys.length;
            console.log(`Rotating Gemini API Key. New index: ${this.currentIndex}`);
            return this.currentIndex === 0;
        }
        return false;
    }

    /**
     * Executes a Gemini operation with retry and automatic key rotation/fallback.
     */
    async executeWithRetry(operation, modelOverride = null, retryCount = 0) {
        let activeModel = modelOverride || this.currentModel;
        
        // Safety: Map unavailable specific names to their supported aliases in this API version
        if (activeModel.includes('1.5-flash')) {
            activeModel = 'gemini-flash-latest';
        } else if (activeModel === 'gemini-2.5-flash') {
            activeModel = 'gemini-2.5-flash-lite'; // Available variant
        }

        const maxRetries = this.apiKeys.length * 2; 

        try {
            return await operation(this.getGenAI(), activeModel);
        } catch (error) {
            const isDailyQuotaExhausted = error.message?.includes('GenerateRequestsPerDayPerProjectPerModel-FreeTier');
            const isRateLimit = error.status === 429 || error.message?.includes('Minute');

            if (isDailyQuotaExhausted) {
                console.error(`🔴 Key Index ${this.currentIndex} has EXHAUSTED its DAILY limit for ${activeModel}.`);
            } else if (isRateLimit) {
                console.warn(`🕒 Key Index ${this.currentIndex} hit a per-minute limit. Waiting 2 seconds then rotating...`);
            } else {
                console.error(`Gemini Error (${activeModel}):`, error.message);
            }
            
            const isRetriable = error.status === 400 || error.status === 404 || error.status === 429 || error.message?.includes('quota') || error.message?.includes('not found') || error.message?.includes('API_KEY_INVALID') || error instanceof SyntaxError || error.message?.includes('JSON');
            
            if (isRetriable && retryCount < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                const hasCycledAllKeys = this.rotateKey();

                // FALLBACK: If 2.5 is failing on all keys, downgrade to 1.5 for the scraper
                if (!modelOverride && hasCycledAllKeys && this.currentModel === 'gemini-2.5-flash') {
                    console.log("⚠️ ALL KEYS FAILED for gemini-2.5-flash. Falling back to gemini-1.5-flash...");
                    this.currentModel = 'gemini-1.5-flash';
                }

                return await this.executeWithRetry(operation, modelOverride, retryCount + 1);
            }
            throw error;
        }
    }

    /**
     * Uses Gemini to rewrite raw news text into a structured JSON format with strict SEO optimization.
     */
    async rewriteNews(rawTitle, rawText) {
        return await this.executeWithRetry(async (genAI, activeModel) => {
            const model = genAI.getGenerativeModel({
                model: activeModel,
                generationConfig: { responseMimeType: "application/json" }
            });

            const prompt = `
            You are the Chief Editor for "AI Portal Weekly". 
            Your audience: Final-year CSE graduates from Tier-3 colleges in India (e.g., Kanpur, Indore) who are building careers through side-hustles and self-learning.
            
            CONTENT RULES (STRICT):
            1. **No AI Fluff**: NEVER use words like "Furthermore," "Moreover," "Additionally," "In conclusion," or "In today's rapidly evolving landscape."
            2. **Direct Tone**: Write with a blunt, "down-to-reality" point of view. Tell the truth, even if it's negative.
            3. **Clarity & Depth**: Every article MUST be at least 250 words long. Avoid being vague.
            4. **Educational Analogies**: Explain complex tech concepts using analogies relevant to a student (e.g., tokens like canteen coins, GPUs like a hostel study group).
            5. **Indian Utility**: Every brief must answer: "How does this help an Indian student with zero placement?" or "Is this tool free in India without a credit card?"
            6. **Meta lengths**: 
               - "seoMetaTitle": 45-60 chars (Include "India" if possible). 
               - "seoMetaDescription": 140-155 chars.

            Raw Title: ${rawTitle}
            Raw Text: ${rawText}

            Respond ONLY with this JSON structure:
            {
                "title": "Blunt, Catchy Title",
                "summary": "150-char punchy summary",
                "focusKeyphrase": "2-3 word keyword",
                "content": "HTML structure with <h2> and <p>. Minimum 250 words. Focus on depth and clarity. Use analogies. Mention INR/Rupee pricing if relevant.",
                "seoMetaTitle": "SEO title",
                "seoMetaDescription": "SEO meta description",
                "featuredImageAlt": "Alt text",
                "realityClaim": "What the marketing hype says",
                "realityTruth": "The blunt, honest reality we found (1-2 sentences)",
                "quickTake": "The 5-second winner take-away",
                "hypeLevel": <1-5>
            }
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            let text = response.text();
            
            text = text.replace(/```json/gi, '').replace(/```/g, '').trim();

            const firstBrace = text.indexOf('{');
            const lastBrace = text.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1) {
                text = text.substring(firstBrace, lastBrace + 1);
            }

            return JSON.parse(text);
        });
    }

    /**
     * Uses Gemini Search Grounding to find breaking news today.
     */
    async searchLatestNews() {
        return await this.executeWithRetry(async (genAI, activeModel) => {
            const model = genAI.getGenerativeModel({ 
                model: activeModel,
                tools: [{ googleSearch: {} }] 
            });

            const prompt = `
            Search Google for the 1 most impactful artificial intelligence news announcement from the last 24 hours.
            Return ONLY a JSON array containing the news item.
            Format:
            [
                {
                    "url": "original source URL",
                    "rawTitle": "The headline",
                    "rawText": "A 3 paragraph detailed factual summary of what was announced"
                }
            ]
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            let text = response.text();
            
            text = text.replace(/```json/gi, '').replace(/```/g, '').trim();

            const firstBracket = text.indexOf('[');
            const lastBracket = text.lastIndexOf(']');
            if (firstBracket !== -1 && lastBracket !== -1) {
                text = text.substring(firstBracket, lastBracket + 1);
            }

            return JSON.parse(text);
        });
    }
    /**
     * Uses Gemini to rewrite raw tool text/URL info into a structured JSON format with complete SEO fields.
     */
    async rewriteTool(rawTitle, rawText) {
        return await this.executeWithRetry(async (genAI, activeModel) => {
            const model = genAI.getGenerativeModel({ 
                model: activeModel,
                generationConfig: { responseMimeType: "application/json" }
            });

            const prompt = `
            You are a senior analyst for "AI Portal Weekly". 
            Your goal is to parse raw information about an AI Tool and return a structured JSON response.
            
            SEO CONTENT RULES (CRITICAL):
            1. **Keyphrase**: Identify a 2-3 word "focusKeyphrase" (e.g., "AI Video Generator").
            2. **Description**: Write a concise, 2-3 paragraph objective description of what the tool does. Do NOT hype it. Use straightforward words.
            3. **Meta lengths**: 
               - "seoMetaTitle" MUST be between 45 and 60 characters. 
               - "seoMetaDescription" MUST be between 140 and 155 characters. (NEVER exceed 155)
            4. **Usage Tip**: Provide one sentence detailing the fastest way to get value ("5-minute win").

            Raw Title: ${rawTitle}
            Raw Information: ${rawText}

            Respond ONLY with this JSON structure. Any missing fields should be left empty or given a reasonable guess based on the text.
            {
                "name": "Exact Name of the Tool",
                "parentCompany": "Name of the parent company if mentioned/known, else empty string",
                "focusKeyphrase": "the 2-3 word keyword",
                "description": "HTML structure with <h2> and <p>. Ensure Keyphrase is present. Objective and factual.",
                "seoMetaTitle": "Strictly 45-60 chars including Keyphrase",
                "seoMetaDescription": "Strictly 140-155 chars including Keyphrase",
                "featuredImageAlt": "Alt text including Focus Keyphrase",
                "features": ["3 to 5 core features in active voice"],
                "tutorials": ["Any youtube URLs found in the text for tutorials/demos. Else empty array"],
                "limitations": "Who this tool is NOT for (1 sentence)",
                "usageTip": "The 5-minute win (1 sentence)"
            }
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            let text = response.text();
            
            text = text.replace(/```json/gi, '').replace(/```/g, '').trim();

            const firstBrace = text.indexOf('{');
            const lastBrace = text.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1) {
                text = text.substring(firstBrace, lastBrace + 1);
            }

            return JSON.parse(text);
        }, 'gemini-1.5-flash'); // Hard-code fallback to 1.5 flash for tool processing as requested
    }
}

module.exports = new AIWriterService();
