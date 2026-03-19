const prisma = require('../config/prisma');
const AppError = require('../utils/AppError');

/**
 * Enterprise Service for Categories
 */
class CategoryService {
    async getAllCategories() {
        return await prisma.category.findMany({ where: { isDeleted: false } });
    }

    async createCategory(data) {
        try {
            return await prisma.category.create({ data });
        } catch (error) {
            if (error.code === 'P2002') throw new AppError('Category with this slug already exists', 400);
            throw error;
        }
    }

    async updateCategory(id, data) {
        try {
            return await prisma.category.update({
                where: { id: parseInt(id, 10) },
                data
            });
        } catch (error) {
            if (error.code === 'P2025') throw new AppError('Category not found', 404);
            if (error.code === 'P2002') throw new AppError('Category slug must be unique', 400);
            throw error;
        }
    }
}

module.exports = new CategoryService();
