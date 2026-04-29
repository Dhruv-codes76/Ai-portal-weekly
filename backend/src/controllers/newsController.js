const newsService = require('../services/newsService');
const { logActivity } = require('../utils/logger');
const { softDelete, restore } = require('../utils/softDelete');
const prisma = require('../config/prisma');

/**
 * Enterprise News Controller
 * Responsibilities:
 * - Parse HTTP inputs
 * - Call Service layer
 * - Manage HTTP responses
 * - Trigger side effects (Logging)
 */

const ApiResponse = require('../utils/ApiResponse');

const getNews = async (req, res, next) => {
    try {
        const isAuthorized = !!req.header('Authorization');
        const { news, pagination } = await newsService.getAllNews({
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 12,
            region: req.query.region,
            contentType: req.query.contentType,
            isAuthorized
        });

        // Keep original shape — frontend depends on { data: [], total, page, totalPages }
        res.json({ data: news, ...pagination });
    } catch (error) {
        next(error);
    }
};

const getNewsBySlug = async (req, res, next) => {
    try {
        const isAuthorized = !!req.header('Authorization');
        const article = await newsService.getNewsBySlug(req.params.slug, isAuthorized);
        res.json(article);
    } catch (error) {
        next(error);
    }
};

const createNews = async (req, res, next) => {
    try {
        const article = await newsService.createNews(req.body, req.files);
        await logActivity(req, 'CREATE', 'News', article.id.toString(), { title: article.title });
        ApiResponse.created(res, article);
    } catch (error) {
        next(error);
    }
};

const updateNews = async (req, res, next) => {
    try {
        const article = await newsService.updateNews(req.params.id, req.body, req.files);
        await logActivity(req, 'UPDATE', 'News', article.id.toString(), req.body);
        ApiResponse.success(res, article, 'Article updated successfully');
    } catch (error) {
        next(error);
    }
};

const deactivateNews = async (req, res, next) => {
    try {
        const doc = await softDelete(req, prisma.news, 'News', req.params.id);
        res.json({ message: 'News deactivated successfully', data: doc });
    } catch (error) {
        next(error);
    }
};

const restoreNews = async (req, res, next) => {
    try {
        const doc = await restore(req, prisma.news, 'News', req.params.id);
        res.json({ message: 'News restored successfully', data: doc });
    } catch (error) {
        next(error);
    }
};

const autoGenerateNews = async (req, res, next) => {
    try {
        const newsScraperService = require('../services/newsScraperService');
        // Run asynchronously without blocking the request entirely if we just want to trigger it
        // Or await it to return success when done. We will await it for synchronous feedback.
        await newsScraperService.runDailyAutomation();
        res.json({ message: 'News generation completed successfully! Check the dashboard for new DRAFTs.' });
    } catch (error) {
        next(error);
    }
};

const scrapeAndStreamNews = async (req, res, next) => {
    try {
        const { url } = req.body;
        if (!url) return res.status(400).json({ error: "Source URL is required" });

        const { scrapeUrlContent } = require('../utils/scraperUtils');
        const aiWriterService = require('../services/aiWriterService');

        const scrapedData = await scrapeUrlContent(url);
        
        const result = await aiWriterService.streamRewriteNews(scrapedData.title, scrapedData.text);

        // Uses Vercel AI SDK to stream JSON tokens to Express response
        result.pipeTextStreamToResponse(res);
    } catch (error) {
        console.error("Streaming error:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: "Failed to process the URL" });
        }
    }
};

module.exports = { getNews, getNewsBySlug, createNews, updateNews, deactivateNews, restoreNews, autoGenerateNews, scrapeAndStreamNews };
