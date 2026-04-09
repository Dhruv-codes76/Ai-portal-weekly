const prisma = require('../config/prisma');
const { generateSEO } = require('../utils/seoUtils');
const { handleImageUploads } = require('./imageService');
const AppError = require('../utils/AppError');

/**
 * Enterprise Service for AI Tools
 */
class ToolService {
    async getAllTools(options = {}) {
        const { isAuthorized = false, categoryId, sort, page = 1, limit = 100, search, status, includeDeleted = "false" } = options;
        
        const where = {
            ...(includeDeleted === "true" ? {} : { isDeleted: false }),
            ...(isAuthorized ? {} : { status: 'PUBLISHED' }),
            ...(categoryId ? { categoryId: parseInt(categoryId, 10) } : {}),
            ...(status && isAuthorized ? { status: status.toUpperCase() } : {}),
            ...(search ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { focusKeyphrase: { contains: search, mode: 'insensitive' } },
                    { slug: { contains: search, mode: 'insensitive' } }
                ]
            } : {})
        };

        const orderBy = sort === 'trending' 
            ? { popularityScore: 'desc' } 
            : { createdAt: 'desc' };

        return await prisma.tool.findMany({
            where,
            orderBy,
            skip: (parseInt(page, 10) - 1) * parseInt(limit, 10),
            take: parseInt(limit, 10),
            include: { category: { select: { name: true, slug: true } } }
        });
    }

    async visitTool(slug) {
        try {
            return await prisma.tool.update({
                where: { slug },
                data: {
                    viewsCount: { increment: 1 },
                    popularityScore: { increment: 1.0 }
                }
            });
        } catch (e) {
            // Ignore if tool not found
            return null;
        }
    }

    async getToolBySlug(slug, isAuthorized = false) {
        const tool = await prisma.tool.findFirst({
            where: { slug, isDeleted: false },
            include: { category: { select: { name: true, slug: true } } }
        });

        if (!tool) throw new AppError('Tool not found', 404);
        
        if (tool.status === 'DRAFT' && !isAuthorized) {
            throw new AppError('Forbidden', 403);
        }

        return tool;
    }

    async createTool(rawData, files) {
        let toolData = generateSEO(rawData, 'tool');
        toolData = await handleImageUploads(files, toolData, 'tools');

        // Map relation ID
        if (toolData.category) {
            toolData.categoryId = parseInt(toolData.category, 10);
            delete toolData.category;
        }

        // Normalize Enums
        if (toolData.status) toolData.status = toolData.status.toUpperCase();
        if (toolData.pricing) toolData.pricing = toolData.pricing.toUpperCase();

        return await prisma.tool.create({
            data: toolData
        });
    }

    async updateTool(id, rawData, files) {
        let toolData = generateSEO(rawData, 'tool');
        toolData = await handleImageUploads(files, toolData, 'tools');

        if (toolData.category) {
            toolData.categoryId = parseInt(toolData.category, 10);
            delete toolData.category;
        }

        if (toolData.status) toolData.status = toolData.status.toUpperCase();
        if (toolData.pricing) toolData.pricing = toolData.pricing.toUpperCase();

        try {
            return await prisma.tool.update({
                where: { id: parseInt(id, 10) },
                data: toolData
            });
        } catch (error) {
            if (error.code === 'P2025') throw new AppError('Tool not found', 404);
            throw error;
        }
    }
}

module.exports = new ToolService();
