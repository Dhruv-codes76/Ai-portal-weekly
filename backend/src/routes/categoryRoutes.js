const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
    getCategories,
    createCategory,
    updateCategory,
    deactivateCategory,
    restoreCategory
} = require('../controllers/categoryController');

router.get('/', getCategories);
router.post('/', authMiddleware, createCategory);
router.put('/:id', authMiddleware, updateCategory);
router.delete('/:id', authMiddleware, deactivateCategory);
router.put('/:id/restore', authMiddleware, restoreCategory);

module.exports = router;
