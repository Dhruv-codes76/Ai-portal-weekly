const Tool = require('../models/Tool');
const { softDelete, restore } = require('../utils/softDelete');
const { logActivity } = require('../utils/logger');

const getTools = async (req, res) => {
    try {
        const query = req.header('Authorization') ? { isDeleted: false } : { status: 'published', isDeleted: false };
        if (req.query.category) query.category = req.query.category;

        const tools = await Tool.find(query).populate('category', 'name slug');
        res.json(tools);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const getToolBySlug = async (req, res) => {
    try {
        const tool = await Tool.findOne({ slug: req.params.slug, isDeleted: false }).populate('category', 'name slug');
        if (!tool) return res.status(404).json({ error: 'Tool not found' });
        if (tool.status === 'draft' && !req.header('Authorization')) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        res.json(tool);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const createTool = async (req, res) => {
    try {
        const tool = new Tool(req.body);
        await tool.save();
        await logActivity(req, 'CREATE', 'Tool', tool._id, { name: tool.name });
        res.status(201).json(tool);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateTool = async (req, res) => {
    try {
        const tool = await Tool.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (tool) {
            await logActivity(req, 'UPDATE', 'Tool', tool._id, req.body);
        }
        res.json(tool);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deactivateTool = async (req, res) => {
    return softDelete(req, Tool, req.params.id, res);
};

const restoreTool = async (req, res) => {
    return restore(req, Tool, req.params.id, res);
};

module.exports = { getTools, getToolBySlug, createTool, updateTool, deactivateTool, restoreTool };
