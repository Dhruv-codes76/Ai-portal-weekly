const axios = require('axios');
const prisma = require('../config/prisma');
const aiWriterService = require('./aiWriterService');
const imageService = require('./imageService');
const { generateSlug } = require('../utils/seoUtils');

class ToolScraperService {
    constructor() {
        this.trustedFeeds = [
            // Example RSS feed or API endpoint for AI tools (placeholder)
            // 'https://www.producthunt.com/feed?category=artificial-intelligence'
        ];
    }

    normalizeName(name) {
        return name.toLowerCase().replace(/[^\w\s]/gi, '').trim();
    }

    async toolExists(websiteOrName, rawName = null) {
        // Check by website
        if (websiteOrName && websiteOrName.includes('http')) {
            const exactMatch = await prisma.tool.findFirst({ where: { website: websiteOrName } });
            if (exactMatch) return true;
        }

        // Check by name
        if (rawName || !websiteOrName.includes('http')) {
            const searchName = rawName || websiteOrName;
            const normalized = this.normalizeName(searchName);
            if (normalized.length < 3) return false;

            const similar = await prisma.tool.findFirst({
                where: {
                    name: {
                        equals: searchName,
                        mode: 'insensitive'
                    }
                }
            });
            if (similar) return true;
        }

        return false;
    }

    /**
     * Extracts text from URL (basic fallback) or uses the provided text
     */
    async processDraftTool(url, rawTitle, rawText, source = "MANUAL") {
        try {
            if (await this.toolExists(url, rawTitle)) {
                console.log(`Skipping duplicate tool: ${rawTitle || url}`);
                return null;
            }

            console.log(`Processing Tool with Gemini: ${rawTitle || url}`);
            const rewritten = await aiWriterService.rewriteTool(rawTitle || "Unknown Tool", rawText || `Analyze this URL: ${url}`);

            let cloudinaryUrl = null;
            if (url) {
                console.log(`Sourcing image for: ${rewritten.name}`);
                cloudinaryUrl = await imageService.getFeaturedImageFromUrl(url, rewritten.name);
            }

            const slugBase = rewritten.focusKeyphrase || rewritten.name;
            const slug = generateSlug(slugBase) + '-' + Math.floor(Math.random() * 1000);

            const toolData = {
                name: rewritten.name || rawTitle || 'Unknown',
                slug,
                description: rewritten.description || '',
                website: url || '',
                pricing: 'FREEMIUM', // default
                features: rewritten.features || [],
                tutorials: rewritten.tutorials || [],
                parentCompany: rewritten.parentCompany || '',
                limitations: rewritten.limitations || '',
                usageTip: rewritten.usageTip || '',
                focusKeyphrase: rewritten.focusKeyphrase || '',
                featuredImage: cloudinaryUrl || '',
                featuredImageAlt: rewritten.featuredImageAlt || rewritten.name,
                status: 'DRAFT',
                seoMetaTitle: rewritten.seoMetaTitle || rewritten.name,
                seoMetaDescription: rewritten.seoMetaDescription || rewritten.description?.substring(0, 150),
                canonicalUrl: `/tools/${slug}`,
                isDeleted: false
            };

            const newTool = await prisma.tool.create({ data: toolData });
            console.log(`✅ Saved AI-Generated Tool DRAFT: ${toolData.name}`);
            return newTool;
        } catch (error) {
            console.error(`Failed to save tool draft for ${url}:`, error);
            throw error;
        }
    }

    /**
     * Manual endpoint for Admins to auto-fill a tool from a URL and some context
     */
    async autoFillTool(url, contextText = "") {
        // Fetch HTML content to feed to Gemini
        let pageContent = contextText;
        try {
            if (url) {
                const response = await axios.get(url, { timeout: 5000 });
                // Strip heavily to avoid massive token usage
                const rawHtml = response.data;
                const textOnly = rawHtml.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '')
                                        .replace(/<style[^>]*>([\S\s]*?)<\/style>/gmi, '')
                                        .replace(/<[^>]+>/gmi, ' ')
                                        .replace(/\s+/g, ' ')
                                        .trim();
                pageContent += " \n" + textOnly.substring(0, 5000); // 5000 chars is plenty context
            }
        } catch (err) {
            console.warn(`Could not fetch url ${url} directly, relying purely on AI/context.`);
        }

        return await this.processDraftTool(url, "Tool AutoFill Request", pageContent, "ADMIN_AUTOFILL");
    }

    async runDailyAutomation() {
        console.log('Automated Tool Discovery Triggered (Placeholder)');
        // Extend with actual RSS tool directories if needed
    }
}

module.exports = new ToolScraperService();
