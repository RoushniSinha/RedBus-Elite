const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const travelStorySchema = new Schema(
    {
        author: {
            type: String,
            required: true,
        },
        authorId: {
            type: String,
            required: false,
        },
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        mediaUrls: {
            type: [String],
            default: [],
        },
        routeId: {
            type: String,
            required: false,
        },
        moderationStatus: {
            type: String,
            enum: ['PENDING', 'APPROVED', 'REJECTED'],
            default: 'PENDING',
        },
    },
    { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

module.exports = mongoose.model('TravelStory', travelStorySchema);
