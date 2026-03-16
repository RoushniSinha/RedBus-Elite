const express = require('express');
const router  = express.Router();
const rateLimit = require('express-rate-limit');
const routePlanningController = require('../controller/routePlanning');

// Allow up to 60 route searches per 15 minutes per IP
const searchLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
});

// Stricter limit for booking operations (20 per 15 min)
const bookLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/route-plan/search', searchLimiter, routePlanningController.searchRoutes);
router.post('/route-plan/book',   bookLimiter,   routePlanningController.bookAndNotify);

module.exports = router;
