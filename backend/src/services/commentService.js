const prisma = require('../config/prisma');
const xss = require('xss');
const { generateAnonymousId } = require('../utils/hashIp');
const AppError = require('../utils/AppError');

const BLACKLIST = ['casino', 'loan', 'crypto', 'adult', 'bet'];

/**
 * Enterprise Service for User Comments
 */
class CommentService {
    validateCommentText(text) {
        if (!text || text.length < 25) throw new AppError('Comment must be at least 25 characters long.', 400);
        if (text.length > 500) throw new AppError('Comment must be no more than 500 characters long.', 400);

        const lowerText = text.toLowerCase();
        for (const word of BLACKLIST) {
            if (lowerText.includes(word)) throw new AppError('Comment contains prohibited words.', 400);
        }

        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urls = text.match(urlRegex) || [];
        if (urls.length > 2) throw new AppError('Comment contains too many links (max 2 allowed).', 400);

        return xss(text);
    }

    async createComment(data, req) {
        const { article_id, comment_text, parent_id } = data;
        const anonymous_id = generateAnonymousId(req);
        const safeText = this.validateCommentText(comment_text);

        return await prisma.comment.create({
            data: {
                articleId: article_id,
                anonymousId: anonymous_id,
                commentText: safeText,
                parentId: parent_id || null,
            }
        });
    }

    async getThreadedComments(articleId) {
        const prismaComments = await prisma.comment.findMany({
            where: { articleId, isHidden: false },
            orderBy: [{ likes: 'desc' }, { createdAt: 'desc' }]
        });

        const comments = prismaComments.map(c => ({
            id: c.id.toString(),
            article_id: c.articleId,
            anonymous_id: c.anonymousId,
            comment_text: c.commentText,
            parent_id: c.parentId,
            likes: c.likes,
            is_hidden: c.isHidden,
            created_at: c.createdAt
        }));

        // Threading Logic
        const commentMap = {};
        const rootComments = [];

        comments.forEach(c => {
            commentMap[c.id] = { ...c, replies: [] };
        });

        comments.forEach(c => {
            if (c.parent_id && commentMap[c.parent_id]) {
                commentMap[c.parent_id].replies.push(commentMap[c.id]);
            } else {
                rootComments.push(commentMap[c.id]);
            }
        });

        return rootComments;
    }

    async likeComment(id) {
        try {
            return await prisma.comment.update({
                where: { id: parseInt(id, 10) },
                data: { likes: { increment: 1 } }
            });
        } catch (error) {
            if (error.code === 'P2025') throw new AppError('Comment not found', 404);
            throw error;
        }
    }
}

module.exports = new CommentService();
