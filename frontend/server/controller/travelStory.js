'use strict';

/**
 * TravelStory Controller
 *
 * Handles CRUD operations for UGC community travel stories and
 * Cloudinary image uploads.  On story approval the NotificationService
 * broadcasts a Firebase push notification to all subscribed users.
 */

const TravelStory = require('../models/travelStory');
const { sendPushToAllUsers } = require('../services/NotificationService');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary from environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

// ── Helpers ──────────────────────────────────────────────────────────────────

function handleError(res, err, status = 500) {
    console.error('[TravelStoryController]', err.message);
    return res.status(status).json({ error: err.message });
}

// ── Controllers ──────────────────────────────────────────────────────────────

/**
 * GET /stories
 * Returns all stories, optionally filtered by moderationStatus query param.
 */
exports.getAllStories = async (req, res) => {
    try {
        const filter = {};
        if (req.query.status) {
            filter.moderationStatus = req.query.status.toUpperCase();
        }
        const stories = await TravelStory.find(filter)
            .sort({ createdAt: -1 })
            .lean()
            .exec();
        res.json(stories);
    } catch (err) {
        handleError(res, err);
    }
};

/**
 * GET /stories/:id
 */
exports.getStoryById = async (req, res) => {
    try {
        const story = await TravelStory.findById(req.params.id).lean().exec();
        if (!story) {
            return res.status(404).json({ error: 'Story not found' });
        }
        res.json(story);
    } catch (err) {
        handleError(res, err);
    }
};

/**
 * POST /stories
 * Create a new travel story.  Uploaded images (via multer) are pushed to
 * Cloudinary and the resulting secure URLs are stored in mediaUrls.
 */
exports.createStory = async (req, res) => {
    try {
        const { author, authorId, title, content, routeId } = req.body;
        const mediaUrls = [];

        // Upload each file to Cloudinary
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const uploadResult = await new Promise((resolve, reject) => {
                    cloudinary.uploader
                        .upload_stream(
                            { folder: 'redbus-elite/stories', resource_type: 'image' },
                            (error, result) => {
                                if (error) return reject(error);
                                resolve(result);
                            }
                        )
                        .end(file.buffer);
                });
                mediaUrls.push(uploadResult.secure_url);
            }
        }

        const story = await TravelStory.create({
            author,
            authorId,
            title,
            content,
            routeId,
            mediaUrls,
            moderationStatus: 'PENDING',
        });

        res.status(201).json(story);
    } catch (err) {
        handleError(res, err);
    }
};

/**
 * PATCH /stories/:id/moderate
 * Update the moderation status of a story.
 * When a story is APPROVED, a Firebase push is broadcast to all users.
 *
 * Body: { status: 'APPROVED' | 'REJECTED' }
 */
exports.moderateStory = async (req, res) => {
    try {
        const { status } = req.body;
        const allowed = ['APPROVED', 'REJECTED', 'PENDING'];
        if (!allowed.includes(status)) {
            return res
                .status(400)
                .json({ error: `status must be one of: ${allowed.join(', ')}` });
        }

        const story = await TravelStory.findByIdAndUpdate(
            req.params.id,
            { moderationStatus: status },
            { new: true }
        ).lean().exec();

        if (!story) {
            return res.status(404).json({ error: 'Story not found' });
        }

        // Broadcast push notification to all users when a story is approved
        if (status === 'APPROVED') {
            sendPushToAllUsers(
                'New Travel Story! 🗺️',
                `"${story.title}" by ${story.author} is now live`,
                { storyId: story._id.toString(), type: 'STORY_APPROVED' }
            ).catch((err) =>
                console.error('[TravelStoryController] Push broadcast error:', err.message)
            );
        }

        res.json(story);
    } catch (err) {
        handleError(res, err);
    }
};

/**
 * DELETE /stories/:id
 */
exports.deleteStory = async (req, res) => {
    try {
        const story = await TravelStory.findByIdAndDelete(req.params.id).lean().exec();
        if (!story) {
            return res.status(404).json({ error: 'Story not found' });
        }
        res.json({ message: 'Story deleted', id: req.params.id });
    } catch (err) {
        handleError(res, err);
    }
};
