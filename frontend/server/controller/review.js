'use strict';

/**
 * Review Controller
 *
 * Handles submission and retrieval of bus journey reviews.
 * Scores are stored with a Weighted Average Algorithm (Punctuality + Cleanliness + Amenities).
 *
 * Post-journey hook: when a journey ends (PATCH /booking/:id/complete),
 * Twilio sends an SMS to the passenger with a direct link to the Rate & Review page.
 */

const Review = require('../models/review');
const Booking = require('../models/booking');
const { triggerEliteAlert, sendSMS } = require('../services/NotificationService');

const APP_BASE_URL = process.env.APP_BASE_URL || 'http://localhost:4200';

// ── Helpers ──────────────────────────────────────────────────────────────────

function handleError(res, err, status = 500) {
    console.error('[ReviewController]', err.message);
    return res.status(status).json({ error: err.message });
}

/**
 * Compute the time-decay weight for a review.
 * Reviews decay from 1.0 toward 0.5 over ~180 days.
 *
 * @param {Date|string} reviewDate
 * @returns {number} weight in range [0.5, 1.0]
 */
function computeTimeDecayWeight(reviewDate) {
    const DECAY_HALF_LIFE_DAYS = 180;
    const ageMs = Date.now() - new Date(reviewDate).getTime();
    const ageDays = ageMs / (1000 * 60 * 60 * 24);
    const weight = 0.5 + 0.5 * Math.exp(-ageDays / DECAY_HALF_LIFE_DAYS);
    return parseFloat(weight.toFixed(4));
}

// ── Controllers ──────────────────────────────────────────────────────────────

/**
 * GET /reviews
 * Returns all reviews, optionally filtered by ?routeId=<id>
 */
exports.getReviews = async (req, res) => {
    try {
        const filter = {};
        if (req.query.routeId) {
            filter.routeId = req.query.routeId;
        }
        const reviews = await Review.find(filter)
            .sort({ date: -1 })
            .lean()
            .exec();
        res.json(reviews);
    } catch (err) {
        handleError(res, err);
    }
};

/**
 * GET /reviews/route/:routeId/summary
 * Returns the aggregated weighted average scores for a given route.
 *
 * Weighted Average = Σ(score_i × weight_i) / Σ(weight_i)
 */
exports.getRouteSummary = async (req, res) => {
    try {
        const reviews = await Review.find({ routeId: req.params.routeId })
            .lean()
            .exec();

        if (reviews.length === 0) {
            return res.json({
                routeId: req.params.routeId,
                count: 0,
                weightedAverage: null,
                dimensions: null,
            });
        }

        let totalWeight = 0;
        let sumPunctuality = 0;
        let sumCleanliness = 0;
        let sumAmenities = 0;

        reviews.forEach((r) => {
            const w = r.timeDecayWeight || 1;
            totalWeight      += w;
            sumPunctuality   += r.scores.punctuality * w;
            sumCleanliness   += r.scores.cleanliness * w;
            sumAmenities     += r.scores.amenities   * w;
        });

        const avg = (s) => parseFloat((s / totalWeight).toFixed(2));
        const dimensions = {
            punctuality: avg(sumPunctuality),
            cleanliness: avg(sumCleanliness),
            amenities:   avg(sumAmenities),
        };
        const weightedAverage = parseFloat(
            ((dimensions.punctuality + dimensions.cleanliness + dimensions.amenities) / 3).toFixed(2)
        );

        res.json({
            routeId: req.params.routeId,
            count: reviews.length,
            weightedAverage,
            dimensions,
        });
    } catch (err) {
        handleError(res, err);
    }
};

/**
 * POST /reviews
 * Submit a new review.
 */
exports.submitReview = async (req, res) => {
    try {
        const { routeId, busOperator, customerId, bookingId, scores, comment } = req.body;

        if (!routeId || !scores || !comment) {
            return res.status(400).json({
                error: 'routeId, scores (punctuality, cleanliness, amenities), and comment are required',
            });
        }

        const review = new Review({
            routeId,
            busOperator,
            customerId,
            bookingId,
            scores,
            comment,
            timeDecayWeight: 1.0, // brand-new review gets full weight
        });

        await review.save(); // pre-save hook computes weightedAverage
        res.status(201).json(review);
    } catch (err) {
        handleError(res, err);
    }
};

/**
 * PATCH /booking/:id/complete
 *
 * Marks a booking as completed and triggers the post-journey SMS via Twilio
 * with a direct link to the Rate & Review component.
 *
 * Expects booking document to have:
 *   phoneNumber, email, departureDetails.city, arrivalDetails.city
 */
exports.completeJourney = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status: 'COMPLETED' },
            { new: true }
        ).lean().exec();

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        const reviewUrl = `${APP_BASE_URL}/reviews?bookingId=${booking._id}&routeId=${booking.busId}`;
        const origin      = booking.departureDetails?.city || 'Origin';
        const destination = booking.arrivalDetails?.city   || 'Destination';

        // Fire-and-forget: send SMS with review link via Twilio
        if (booking.phoneNumber) {
            sendSMS(
                booking.phoneNumber,
                `RedBus Elite: How was your ${origin}→${destination} journey? Rate it here: ${reviewUrl}`
            ).catch((err) =>
                console.error('[ReviewController] Post-journey SMS error:', err.message)
            );
        }

        res.json({ message: 'Journey marked complete', booking, reviewUrl });
    } catch (err) {
        handleError(res, err);
    }
};
