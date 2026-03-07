const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
    getTools,
    getToolBySlug,
    createTool,
    updateTool,
    deactivateTool,
    restoreTool
} = require('../controllers/toolController');

router.get('/', getTools);
router.get('/:slug', getToolBySlug);
router.post('/', authMiddleware, createTool);
router.put('/:id', authMiddleware, updateTool);
router.delete('/:id', authMiddleware, deactivateTool);
router.put('/:id/restore', authMiddleware, restoreTool);

module.exports = router;
