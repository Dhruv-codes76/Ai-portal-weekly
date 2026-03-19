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
            categoryId: req.query.category
        });
        res.json(tools);
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

module.exports = { getTools, getToolBySlug, createTool, updateTool, deactivateTool, restoreTool };
