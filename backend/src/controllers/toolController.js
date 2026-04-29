const toolService = require('../services/toolService');
const { logActivity } = require('../utils/logger');
const { softDelete, restore } = require('../utils/softDelete');
const prisma = require('../config/prisma');

/**
 * Enterprise Tool Controller
 */

const getTools = async (req, res, next) => {
    try {
        const isAuthorized = !!req.header('Authorization');
        const tools = await toolService.getAllTools({
            isAuthorized,
            categoryId: req.query.category,
            sort: req.query.sort,
            page: req.query.page || 1,
            limit: req.query.limit || 100,
            search: req.query.search,
            status: req.query.status,
            includeDeleted: req.query.includeDeleted
        });
        res.json(tools);
    } catch (error) {
        next(error);
    }
};

const visitTool = async (req, res, next) => {
    try {
        await toolService.visitTool(req.params.slug);
        res.json({ message: 'Visit tracked' });
    } catch (error) {
        next(error);
    }
};

const getToolBySlug = async (req, res, next) => {
    try {
        const isAuthorized = !!req.header('Authorization');
        const tool = await toolService.getToolBySlug(req.params.slug, isAuthorized);
        res.json(tool);
    } catch (error) {
        next(error);
    }
};

const createTool = async (req, res, next) => {
    try {
        const tool = await toolService.createTool(req.body, req.files);
        await logActivity(req, 'CREATE', 'Tool', tool.id.toString(), { name: tool.name });
        res.status(201).json(tool);
    } catch (error) {
        next(error);
    }
};

const updateTool = async (req, res, next) => {
    try {
        const tool = await toolService.updateTool(req.params.id, req.body, req.files);
        await logActivity(req, 'UPDATE', 'Tool', tool.id.toString(), req.body);
        res.json(tool);
    } catch (error) {
        next(error);
    }
};

const deactivateTool = async (req, res, next) => {
    try {
        const doc = await softDelete(req, prisma.tool, 'Tool', req.params.id);
        res.json({ message: 'Tool deactivated successfully', data: doc });
    } catch (error) {
        next(error);
    }
};

const restoreTool = async (req, res, next) => {
    try {
        const doc = await restore(req, prisma.tool, 'Tool', req.params.id);
        res.json({ message: 'Tool restored successfully', data: doc });
    } catch (error) {
        next(error);
    }
};

const autoFillTool = async (req, res, next) => {
    try {
        const { url, contextText } = req.body;
        const toolScraperService = require('../services/toolScraperService');
        const toolData = await toolScraperService.autoFillTool(url, contextText);
        res.json({ message: 'Auto-fill completed successfully', data: toolData });
    } catch (error) {
        next(error);
    }
};
const scrapeAndStreamTool = async (req, res, next) => {
    try {
        const { url } = req.body;
        if (!url) return res.status(400).json({ error: "Source URL is required" });

        const { scrapeUrlContent } = require('../utils/scraperUtils');
        const AIWriterService = require('../services/aiWriterService');
        const aiWriterService = new AIWriterService();

        const scrapedData = await scrapeUrlContent(url);
        
        const result = await aiWriterService.streamRewriteTool(scrapedData.title, scrapedData.text);

        // Uses Vercel AI SDK to stream JSON tokens to Express response
        result.pipeTextStreamToResponse(res);
    } catch (error) {
        console.error("Streaming error:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: "Failed to process the URL" });
        }
    }
};

module.exports = { getTools, getToolBySlug, visitTool, createTool, updateTool, deactivateTool, restoreTool, autoFillTool, scrapeAndStreamTool };
