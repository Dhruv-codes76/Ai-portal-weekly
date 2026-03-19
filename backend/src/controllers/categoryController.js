const categoryService = require('../services/categoryService');
const { logActivity } = require('../utils/logger');
const { softDelete, restore } = require('../utils/softDelete');
const prisma = require('../config/prisma');

/**
 * Enterprise Category Controller
 */

const getCategories = async (req, res, next) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.json(categories);
    } catch (error) {
        next(error);
    }
};

const createCategory = async (req, res, next) => {
    try {
        const category = await categoryService.createCategory(req.body);
        await logActivity(req, 'CREATE', 'Category', category.id, { name: category.name });
        res.status(201).json(category);
    } catch (error) {
        next(error);
    }
};

const updateCategory = async (req, res, next) => {
    try {
        const category = await categoryService.updateCategory(req.params.id, req.body);
        await logActivity(req, 'UPDATE', 'Category', category.id, req.body);
        res.json(category);
    } catch (error) {
        next(error);
    }
};

const deactivateCategory = async (req, res, next) => {
    try {
        const doc = await softDelete(req, prisma.category, 'Category', req.params.id);
        res.json({ message: 'Category deactivated successfully', data: doc });
    } catch (error) {
        next(error);
    }
};

const restoreCategory = async (req, res, next) => {
    try {
        const doc = await restore(req, prisma.category, 'Category', req.params.id);
        res.json({ message: 'Category restored successfully', data: doc });
    } catch (error) {
        next(error);
    }
};

module.exports = { getCategories, createCategory, updateCategory, deactivateCategory, restoreCategory };
