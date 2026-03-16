'use strict';

/**
 * RoutePlanningController
 *
 * Sample controller that demonstrates how the NotificationService integrates
 * into the booking / route-planning workflow.
 *
 * Flow:
 *   1. POST /route-plan  → find matching routes and confirm availability
 *   2. POST /route-plan/book → confirm a seat reservation and fire a
 *      multi-channel Elite Alert (Email + SMS + Push) via NotificationService
 */

const Route   = require('../models/route');
const Bus     = require('../models/bus');
const Booking = require('../models/booking');
const { triggerEliteAlert } = require('../services/NotificationService');

const APP_BASE_URL = process.env.APP_BASE_URL || 'http://localhost:4200';

// ── Helpers ──────────────────────────────────────────────────────────────────

function handleError(res, err, status = 500) {
    console.error('[RoutePlanningController]', err.message);
    return res.status(status).json({ error: err.message });
}

// ── Controllers ──────────────────────────────────────────────────────────────

/**
 * POST /route-plan/search
 *
 * Find matching routes and available buses for a given origin / destination / date.
 * Re-uses the existing route-matching logic from the route controller.
 *
 * Body: { departure, arrival, date }
 */
exports.searchRoutes = async (req, res) => {
    try {
        const { departure, arrival, date } = req.body;

        if (!departure || !arrival || !date) {
            return res.status(400).json({
                error: 'departure, arrival, and date are required',
            });
        }

        const routes = await Route.find().lean().exec();
        const route  = routes.find(
            (r) =>
                r.departureLocation.name.toLowerCase() === departure.toLowerCase() &&
                r.arrivalLocation.name.toLowerCase()   === arrival.toLowerCase()
        );

        if (!route) {
            return res
                .status(404)
                .json({ error: `No route found for ${departure} → ${arrival}` });
        }

        const buses = await Bus.find({ routes: route._id }).lean().exec();
        const bookings = await Booking.find().lean().exec();

        // Build a seat-availability map per bus
        const seatMap = {};
        buses.forEach((bus) => {
            const bookedSeats = bookings
                .filter(
                    (b) =>
                        b.departureDetails.date === date &&
                        b.busId.toString() === bus._id.toString()
                )
                .flatMap((b) => b.seats);
            seatMap[bus._id.toString()] = bookedSeats;
        });

        res.json({ route, buses, bookedSeats: seatMap });
    } catch (err) {
        handleError(res, err);
    }
};

/**
 * POST /route-plan/book
 *
 * Confirm a seat reservation and notify the user via all channels
 * (Email + SMS + Push) using the NotificationService.
 *
 * Body:
 * {
 *   user: { email, phone, fcmToken, languagePref, name },
 *   booking: { busId, routeId, seats, departureDetails, arrivalDetails, fare, ... }
 * }
 */
exports.bookAndNotify = async (req, res) => {
    try {
        const { user, booking: bookingData } = req.body;

        if (!user || !bookingData) {
            return res.status(400).json({ error: 'user and booking payload are required' });
        }

        // Persist the booking
        const booking = await Booking.create({
            ...bookingData,
            status: 'CONFIRMED',
            bookingDate: new Date().toISOString().slice(0, 10),
        });

        // Trigger multi-channel notification
        const alertData = {
            userName:    user.name    || 'Traveller',
            bookingId:   booking._id.toString(),
            origin:      booking.departureDetails?.city || bookingData.departureDetails?.city,
            destination: booking.arrivalDetails?.city   || bookingData.arrivalDetails?.city,
            travelDate:  booking.departureDetails?.date || bookingData.departureDetails?.date,
            fare:        booking.fare,
        };

        let notificationResults = null;
        try {
            notificationResults = await triggerEliteAlert(
                user,
                'BOOKING_CONFIRMED',
                alertData
            );
        } catch (notifyErr) {
            // Notification failure must not fail the booking response
            console.error(
                '[RoutePlanningController] Notification error:',
                notifyErr.message
            );
            notificationResults = { error: notifyErr.message };
        }

        res.status(201).json({ booking, notification: notificationResults });
    } catch (err) {
        handleError(res, err);
    }
};
