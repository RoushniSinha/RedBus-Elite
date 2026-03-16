const express  = require('express');
const router   = express.Router();
const multer   = require('multer');
const rateLimit = require('express-rate-limit');
const travelStoryController = require('../controller/travelStory');

// Store uploaded images in memory so they can be piped to Cloudinary
const upload = multer({ storage: multer.memoryStorage() });

// Allow up to 100 story reads per 15 minutes per IP
const readLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});

// Stricter limit for write / moderation operations (20 per 15 min)
const writeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
});

router.get('/stories',            readLimiter,  travelStoryController.getAllStories);
router.get('/stories/:id',        readLimiter,  travelStoryController.getStoryById);
router.post('/stories',           writeLimiter, upload.array('images', 10), travelStoryController.createStory);
router.patch('/stories/:id/moderate', writeLimiter, travelStoryController.moderateStory);
router.delete('/stories/:id',     writeLimiter, travelStoryController.deleteStory);

module.exports = router;
