const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
    getNews,
    getNewsBySlug,
    createNews,
    updateNews,
    deactivateNews,
    restoreNews
} = require('../controllers/newsController');

router.get('/', getNews);
router.get('/:slug', getNewsBySlug);
router.post('/', authMiddleware, createNews);
router.put('/:id', authMiddleware, updateNews);
router.delete('/:id', authMiddleware, deactivateNews);
router.put('/:id/restore', authMiddleware, restoreNews);

module.exports = router;
