const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dimensionalScoresSchema = new Schema(
    {
        punctuality: { type: Number, min: 1, max: 5, required: true },
        cleanliness: { type: Number, min: 1, max: 5, required: true },
        amenities:   { type: Number, min: 1, max: 5, required: true },
    },
    { _id: false }
);

const reviewSchema = new Schema(
    {
        routeId: {
            type: String,
            required: true,
        },
        busOperator: {
            type: String,
            required: false,
        },
        customerId: {
            type: String,
            required: false,
        },
        bookingId: {
            type: String,
            required: false,
        },
        scores: {
            type: dimensionalScoresSchema,
            required: true,
        },
        comment: {
            type: String,
            required: true,
            trim: true,
        },
        /**
         * Time-decay weight: 1.0 = very recent, decreases over time.
         * Used by the Weighted Average Algorithm.
         * Computed at submission time; recalculated periodically if needed.
         */
        timeDecayWeight: {
            type: Number,
            min: 0,
            max: 1,
            default: 1.0,
        },
        /**
         * Weighted average score = (punctuality + cleanliness + amenities) / 3
         * Pre-computed and stored for fast sorting / aggregation.
         */
        weightedAverage: {
            type: Number,
            min: 1,
            max: 5,
        },
    },
    { timestamps: { createdAt: 'date', updatedAt: 'updatedAt' } }
);

/**
 * Pre-save hook: compute and store the weighted average before persisting.
 */
reviewSchema.pre('save', function (next) {
    const { punctuality, cleanliness, amenities } = this.scores;
    this.weightedAverage =
        parseFloat(((punctuality + cleanliness + amenities) / 3).toFixed(2));
    next();
});

module.exports = mongoose.model('Review', reviewSchema);
