const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { adminLimiter } = require('../middleware/rateLimiter');
const { getLogs } = require('../controllers/activityLogController');

router.get('/', authMiddleware, adminLimiter, getLogs);

module.exports = router;
