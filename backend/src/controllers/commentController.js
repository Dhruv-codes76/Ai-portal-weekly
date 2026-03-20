const commentService = require('../services/commentService');

/**
 * Enterprise Comment Controller
 */

const createComment = async (req, res, next) => {
    try {
        if (req.body.website) {
            return res.status(400).json({ error: 'Invalid request' });
        }

        const comment = await commentService.createComment(req.body, req);

        res.status(201).json({
            id: comment.id,
            article_id: comment.articleId,
            anonymous_id: comment.anonymousId,
            user_id: comment.userId,
            user_name: comment.userName,
            user_avatar: comment.userAvatar,
            comment_text: comment.commentText,
            parent_id: comment.parentId,
            likes: comment.likes,
            is_hidden: comment.isHidden,
            created_at: comment.createdAt
        });
    } catch (error) {
        next(error);
    }
};

const getComments = async (req, res, next) => {
    try {
        const { article_id } = req.query;
        if (!article_id) {
            return res.status(400).json({ error: 'article_id is required' });
        }

        const rootComments = await commentService.getThreadedComments(article_id);
        res.json(rootComments);
    } catch (error) {
        next(error);
    }
};

const likeComment = async (req, res, next) => {
    try {
        const updatedComment = await commentService.likeComment(req.params.id);
        
        res.json({
            id: updatedComment.id.toString(),
            article_id: updatedComment.articleId,
            anonymous_id: updatedComment.anonymousId,
            user_id: updatedComment.userId,
            user_name: updatedComment.userName,
            user_avatar: updatedComment.userAvatar,
            comment_text: updatedComment.commentText,
            parent_id: updatedComment.parentId,
            likes: updatedComment.likes,
            is_hidden: updatedComment.isHidden,
            created_at: updatedComment.createdAt
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { createComment, getComments, likeComment };
