const { createGoogleGenerativeAI, google } = require('@ai-sdk/google');
const { generateObject, generateText, streamObject } = require('ai');
const { z } = require('zod');
const Chunker = require('../utils/chunker');



class AIWriterService {
    constructor() {
        const keys = [];
        
        if (process.env.GEMINI_API_KEY_1) keys.push(process.env.GEMINI_API_KEY_1.trim());
        if (process.env.GEMINI_API_KEY_2) keys.push(process.env.GEMINI_API_KEY_2.trim());
        if (process.env.GEMINI_API_KEY_3) keys.push(process.env.GEMINI_API_KEY_3.trim());

        this.apiKeys = [...new Set(keys)];
        this.currentIndex = 0;
        this.currentModel = 'gemini-1.5-flash-latest'; // Using -latest for better SDK compatibility
        
        if (this.apiKeys.length === 0) {
            console.warn("WARNING: No Gemini API keys found (tried GEMINI_API_KEY_1-3). AI Writer will fail.");
        } else {
            console.log(`AI Writer initialized with ${this.apiKeys.length} PRO API keys. Default: ${this.currentModel}`);
        }






        // Define Schemas for Structured Output
        this.newsSchema = z.object({
            title: z.string().describe("Blunt, Catchy Title"),
            summary: z.string().max(180).describe("Punchy summary"),
            focusKeyphrase: z.string().describe("2-3 word keyword"),
            content: z.string().describe("HTML structure with <h2> and <p>. Minimum 250 words."),
            seoMetaTitle: z.string().min(45).max(70).describe("SEO Title (max 70 chars)"),
            seoMetaDescription: z.string().min(140).max(160).describe("SEO Description (max 160 chars)"),
            featuredImageAlt: z.string(),
            realityClaim: z.string().describe("What marketing hype says"),
            realityTruth: z.string().describe("The blunt, honest reality (1-2 sentences)"),
            quickTake: z.string().describe("The 5-second winner take-away"),
            hypeLevel: z.number().int().min(1).max(10).describe("Hype Level on a scale of 1-10")
        });

        this.toolSchema = z.object({
            name: z.string(),
            parentCompany: z.string().optional(),
            focusKeyphrase: z.string(),
            description: z.string().describe("HTML structure with <h2> and <p>"),
            seoMetaTitle: z.string().min(45).max(70).describe("SEO Title (max 70 chars)"),
            seoMetaDescription: z.string().min(140).max(160).describe("SEO Description (max 160 chars)"),
            featuredImageAlt: z.string(),
            bestUsedFor: z.string().describe("e.g. Content Creators, Developers"),
            startingPrice: z.string().describe("e.g. $9.99/mo or Free"),
            pricing: z.enum(['free', 'freemium', 'paid']),
            platforms: z.string().describe("Web, iOS, Android (comma separated)")
        });
    }


    /**
     * Helper to safely extract and parse JSON from a string that might contain other text.
     */
    safeJSONParse(text, type = 'object') {
        try {
            // 1. Clean Markdown code blocks
            text = text.replace(/```json/gi, '').replace(/```/g, '').trim();

            // 2. Identify likely JSON boundaries
            const startChar = type === 'array' ? '[' : '{';
            const endChar = type === 'array' ? ']' : '}';

            const firstIndex = text.indexOf(startChar);
            const lastIndex = text.lastIndexOf(endChar);

            if (firstIndex !== -1 && lastIndex !== -1 && lastIndex > firstIndex) {
                text = text.substring(firstIndex, lastIndex + 1);
            }

            return JSON.parse(text);
        } catch (error) {
            console.error(`AI Writer Parsing Error: Failed to parse ${type}. Text preview: "${text.substring(0, 100)}..."`);
            throw error;
        }
    }

    /**
     * Helper to get a configured AI SDK Google model instance with current key rotation.
     */
    getModel(modelName) {
        if (this.apiKeys.length === 0) {
            throw new Error("No Gemini API keys found in environment variables.");
        }
        
        const googleProvider = createGoogleGenerativeAI({
            apiKey: this.apiKeys[this.currentIndex]
        });

        return googleProvider(modelName || this.currentModel);
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
            return await operation(this.getModel(activeModel));
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
            
            const isRetriable = error.status === 400 || error.status === 404 || error.status === 429 || error.status === 503 || error.message?.includes('quota') || error.message?.includes('not found') || error.message?.includes('API_KEY_INVALID') || error instanceof SyntaxError || error.message?.includes('JSON');
            
            if (isRetriable && retryCount < maxRetries) {
                // Wait longer for experimental models (5 requests/min is very tight)
                const waitTime = isRateLimit ? 12000 : 2000; 
                await new Promise(resolve => setTimeout(resolve, waitTime));
                
                const hasCycledAllKeys = this.rotateKey();

                // FALLBACK: If 2.5/3 is failing on all keys, downgrade to 1.5 for stability
                if (!modelOverride && hasCycledAllKeys && (this.currentModel.includes('2.5') || this.currentModel.includes('3'))) {
                    console.log(`⚠️ Experimental models failing on all keys. Falling back to gemini-1.5-flash...`);
                    this.currentModel = 'gemini-1.5-flash';
                }

                return await this.executeWithRetry(operation, modelOverride, retryCount + 1);
            }

            throw error;
        }
    }

    async rewriteNews(rawTitle, rawText) {
        const initialDraft = await this.executeWithRetry(async (model) => {
            const { object } = await generateObject({
                model,
                schema: this.newsSchema,
                mode: 'json',
                system: "You are a specialized JSON extraction engine. Output ONLY a valid JSON object matching the requested schema. Do not include or share your internal reasoning, thoughts, or any other text.",
                prompt: `
                Extract facts and structure them into JSON. 
                
                CONTENT RULES:
                1. seoMetaTitle: EXACTLY 45-70 characters.
                2. seoMetaDescription: EXACTLY 140-160 characters.
                3. hypeLevel: Integer between 1 and 10.

                Raw Title: ${rawTitle}
                Raw Text: ${rawText}
                `
            });
            return object;
        });


        console.log("Extraction Pass Complete. Starting Humanizer Pass...");
        return await this.humanizeNewsContent(initialDraft);

    }

    /**
     * The Humanizer Skill: A second pass to polish tone and remove AI-speak.
     */
    async humanizeNewsContent(newsData) {
        return await this.executeWithRetry(async (model) => {
            const { object } = await generateObject({
                model,
                schema: this.newsSchema,
                mode: 'json',
                system: "You are a tone-polishing engine. Only output valid JSON. No thoughts or reasoning.",
                prompt: `
                You are the "Tone Polish" editor for AI Portal Weekly. 
                Audience: Indian CSE students. 
                Tone: Blunt, Reality-first, No Hype. 
                
                Task: Rewrite the 'content' and 'summary' fields of the provided JSON to sound like a human senior engineer. 
                Remove corporate fluff (moreover, furthermore, dive in).
                
                STRICT CONSTRAINTS:
                - Keep seoMetaTitle between 45-70 characters.
                - Keep seoMetaDescription between 140-160 characters.
                - Keep hypeLevel as an integer 1-10.

                DRAFT:
                ${JSON.stringify(newsData)}
                `
            });
            return object;
        });
    }

    /**
     * Extracts a concise list of facts from potentially huge text.
     * Parallelizes processing across chunks if necessary.
     */
    async extractFactSheet(rawTitle, rawText) {
        const chunks = Chunker.splitText(rawText, 6000);
        if (chunks.length === 1) return rawText; // Small enough, use directly

        console.log(`Processing ${chunks.length} chunks for Fact Extraction...`);

        const factsPerChunk = await Promise.all(chunks.map(async (chunk, index) => {
            return await this.executeWithRetry(async (model) => {
                const { text } = await generateText({
                    model,
                    system: "You are a senior analyst for AI Portal Weekly. Extra ONLY raw facts from the text. Be extremely brief. No fluff.",
                    prompt: `EXTRACT FACTS FROM CHUNK ${index+1}:\n${chunk}`
                });
                return text;
            });
        }));

        const consolidatedFacts = await this.executeWithRetry(async (model) => {
            const { text } = await generateText({
                model,
                system: "You are a master analyst. Consolidate these facts into a single, comprehensive Master Fact Sheet for a news article. Remove duplicates. No summary, just bullet points.",
                prompt: `FACTS FROM ALL CHUNKS:\n${factsPerChunk.join('\n\n')}`
            });
            return text;
        });

        return consolidatedFacts;
    }

    /**
     * STREAMING: Generates and streams a fully processed news article.
     */
    async streamRewriteNews(rawTitle, rawText) {
        // PRE-PROCESS: Extract facts if text is very long
        let processedText = rawText;
        if (rawText.length > 8000) {
            processedText = await this.extractFactSheet(rawTitle, rawText);
        }

        return await this.executeWithRetry(async (model) => {
            const result = await streamObject({
                model,
                schema: this.newsSchema,
                mode: 'json',
                system: "You are a JSON stream response engine. Output ONLY valid JSON matching the schema.",
                prompt: `
                You are the Chief Editor and "Tone Polish" expert for "AI Portal Weekly". 
                Your audience: Indian CSE students (Beginners).
                Tone: Blunt, Reality-first, No Hype, Senior Engineer mentor vibe.

                TASK:
                Write a full news article as a JSON object based on the Intelligence Fact Sheet.
                1. REMOVE: "In today's world", "unprecedented", "seamlessly", "furthermore", "moreover".
                2. ADD: Blunt truths about cost and usability in India. 
                3. SEO: seoMetaTitle must be 45-70 chars, seoMetaDescription must be 140-160 chars.
                4. HYPE: hypeLevel must be an integer 1-10.
                
                Intelligence Fact Sheet:
                ${processedText}
                `
            });
            return result; 
        });
    }

    /**
     * STREAMING: Generates and streams a fully processed Tool review/catalog entry.
     */
    async streamRewriteTool(rawTitle, rawText) {
        // PRE-PROCESS: Extract facts if text is very long
        let processedText = rawText;
        if (rawText.length > 8000) {
            processedText = await this.extractFactSheet(rawTitle, rawText);
        }

        return await this.executeWithRetry(async (model) => {
            const result = await streamObject({
                model,
                schema: this.toolSchema,
                mode: 'json',
                system: "You are a JSON stream response engine. Output ONLY valid JSON matching the schema.",
                prompt: `
                You are the Chief Editor and "Tone Polish" expert for "AI Portal Weekly". 
                Your audience: Indian CSE students (Beginners).
                Tone: Blunt, Reality-first, No Hype, Senior Engineer mentor vibe.

                TASK:
                Take the following Intelligence Fact Sheet about a software/AI tool and write a full tool catalogue entry as a JSON object.
                1. REMOVE corporate fluff. Write a blunt review.
                2. Explicitly map Pricing to 'free', 'freemium', or 'paid'.
                3. Ensure description includes <h2> and <p> HTML structures.
                4. SEO: seoMetaTitle must be 45-70 chars, seoMetaDescription must be 140-160 chars.

                Intelligence Fact Sheet:
                ${processedText}
                `
            });
            return result; 
        });
    }






    async searchLatestNews() {
        return await this.executeWithRetry(async (model) => {
            const { text } = await generateText({
                model,
                prompt: `
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
                `
            });
            return this.safeJSONParse(text, 'array');
        });
    }

    async rewriteTool(rawTitle, rawText) {
        return await this.executeWithRetry(async (model) => {
            const { object } = await generateObject({
                model,
                schema: this.toolSchema,
                prompt: `
                You are a senior analyst for "AI Portal Weekly". 
                Parse raw information about an AI Tool into structured JSON.
                
                SEO CONTENT RULES:
                1. Identify a 2-3 word "focusKeyphrase".
                2. Write a concise, 2-3 paragraph objective description (Factual, No Hype).
                3. Usage Tip: One sentence detailing the "5-minute win".

                Raw Title: ${rawTitle}
                Raw Information: ${rawText}
                `
            });
            return object;
        }, 'gemini-1.5-flash');
    }

}

module.exports = new AIWriterService();
