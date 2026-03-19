const express = require('express');
const router = express.Router();
const searchService = require('../services/searchService');

router.get('/suggestions', async (req, res, next) => {
    try {
        const suggestions = await searchService.getSuggestions(req.query.q);
        res.json(suggestions);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
