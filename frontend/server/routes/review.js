const express = require('express');
const router  = express.Router();
const rateLimit = require('express-rate-limit');
const reviewController = require('../controller/review');

// Allow up to 100 review reads per 15 minutes per IP
const readLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});

// Stricter limit for review submissions (10 per 15 min)
const submitLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
});

router.get('/reviews',                          readLimiter,   reviewController.getReviews);
router.get('/reviews/route/:routeId/summary',   readLimiter,   reviewController.getRouteSummary);
router.post('/reviews',                         submitLimiter, reviewController.submitReview);
router.patch('/booking/:id/complete',           submitLimiter, reviewController.completeJourney);

module.exports = router;
