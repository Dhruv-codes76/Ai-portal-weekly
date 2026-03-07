const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { loginLimiter, adminLimiter } = require('../middleware/rateLimiter');
const {
    loginAdmin,
    logoutAdmin,
    createAdmin,
    getAdmins,
    deactivateAdmin,
    restoreAdmin
} = require('../controllers/adminController');

router.post('/login', loginLimiter, loginAdmin);
router.post('/logout', authMiddleware, logoutAdmin);
router.post('/', authMiddleware, adminLimiter, createAdmin);
router.get('/', authMiddleware, adminLimiter, getAdmins);
router.delete('/:id', authMiddleware, adminLimiter, deactivateAdmin);
router.put('/:id/restore', authMiddleware, adminLimiter, restoreAdmin);

module.exports = router;
