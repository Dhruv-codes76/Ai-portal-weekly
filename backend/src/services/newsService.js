const prisma = require('../config/prisma');
const { generateSEO } = require('../utils/seoUtils');
const { handleImageUploads } = require('./imageService');
const AppError = require('../utils/AppError');

/**
 * Enterprise Service for News/Articles
 * Handles all business logic and database interactions.
 */
class NewsService {
    async getAllNews(options = {}) {
        const { page = 1, limit = 12, isAuthorized = false } = options;
        const skip = (page - 1) * limit;

        const where = {
            isDeleted: false,
            ...(isAuthorized ? {} : { status: 'PUBLISHED' })
        };

        const [news, total] = await Promise.all([
            prisma.news.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.news.count({ where })
        ]);

        return {
            news,
            pagination: {
                total,
                page,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async getNewsBySlug(slug, isAuthorized = false) {
        const article = await prisma.news.findFirst({
            where: { slug, isDeleted: false }
        });

        if (!article) throw new AppError('Article not found', 404);

        if (article.status === 'DRAFT' && !isAuthorized) {
            throw new AppError('Forbidden', 403);
        }

        return article;
    }

    async createNews(rawData, files) {
        let articleData = generateSEO(rawData, 'news');
        articleData = await handleImageUploads(files, articleData, 'news');

        if (articleData.status) articleData.status = articleData.status.toUpperCase();

        return await prisma.news.create({
            data: articleData
        });
    }

    async updateNews(id, rawData, files) {
        let articleData = generateSEO(rawData, 'news');
        articleData = await handleImageUploads(files, articleData, 'news');

        if (articleData.status) articleData.status = articleData.status.toUpperCase();

        try {
            return await prisma.news.update({
                where: { id: parseInt(id, 10) },
                data: articleData
            });
        } catch (error) {
            if (error.code === 'P2025') throw new AppError('Article not found', 404);
            throw error;
        }
    }
}

module.exports = new NewsService();
