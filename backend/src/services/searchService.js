const prisma = require('../config/prisma');

/**
 * Enterprise Service for Search/Suggestions
 */
class SearchService {
    async getSuggestions(query) {
        if (!query || query.length < 2) return [];

        const [news, tools] = await Promise.all([
            prisma.news.findMany({
                where: {
                    title: { contains: query, mode: 'insensitive' },
                    isDeleted: false,
                    status: 'PUBLISHED'
                },
                select: { id: true, title: true, slug: true },
                take: 5
            }),
            prisma.tool.findMany({
                where: {
                    name: { contains: query, mode: 'insensitive' },
                    isDeleted: false,
                    status: 'PUBLISHED'
                },
                select: { id: true, name: true, slug: true },
                take: 5
            })
        ]);

        return [
            ...news.map(item => ({ id: item.id.toString(), title: item.title, url: `/news/${item.slug}`, type: 'news' })),
            ...tools.map(item => ({ id: item.id.toString(), title: item.name, url: `/tools/${item.slug}`, type: 'tool' }))
        ];
    }
}

module.exports = new SearchService();
