'use strict';

/**
 * NotificationService
 *
 * Multi-channel alert system that unifies:
 *   - Email (HTML receipts)  via Resend
 *   - SMS alerts             via Twilio
 *   - Push notifications     via Firebase Admin
 *
 * Environment variables required (set in Vercel / .env):
 *   RESEND_API_KEY
 *   TWILIO_ACCOUNT_SID
 *   TWILIO_AUTH_TOKEN
 *   TWILIO_PHONE_NUMBER
 *   FIREBASE_SERVICE_ACCOUNT_KEY  (JSON string)
 *   APP_BASE_URL                  (e.g. https://your-app.vercel.app)
 */

const { Resend } = require('resend');
const twilio = require('twilio');
const admin = require('firebase-admin');

// ── Lazy singletons ─────────────────────────────────────────────────────────

let _resend = null;
let _twilioClient = null;
let _firebaseApp = null;

function getResend() {
    if (!_resend) {
        if (!process.env.RESEND_API_KEY) {
            throw new Error('RESEND_API_KEY environment variable is not set');
        }
        _resend = new Resend(process.env.RESEND_API_KEY);
    }
    return _resend;
}

function getTwilioClient() {
    if (!_twilioClient) {
        const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
        if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
            throw new Error(
                'TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN environment variables are required'
            );
        }
        _twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    }
    return _twilioClient;
}

function getFirebaseApp() {
    if (!_firebaseApp) {
        const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        if (!key) {
            throw new Error(
                'FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set'
            );
        }
        let serviceAccount;
        try {
            serviceAccount = JSON.parse(key);
        } catch {
            throw new Error(
                'FIREBASE_SERVICE_ACCOUNT_KEY must be a valid JSON string'
            );
        }
        // Initialise only once across hot-reloads
        _firebaseApp =
            admin.apps.length > 0
                ? admin.apps[0]
                : admin.initializeApp({
                      credential: admin.credential.cert(serviceAccount),
                  });
    }
    return _firebaseApp;
}

// ── Language-aware message templates ────────────────────────────────────────

const TEMPLATES = {
    BOOKING_CONFIRMED: {
        en: {
            subject: 'Your RedBus Elite booking is confirmed!',
            body: (data) =>
                `<h2>Booking Confirmed</h2>
                 <p>Hi ${data.userName},</p>
                 <p>Your booking from <strong>${data.origin}</strong> to <strong>${data.destination}</strong>
                    on <strong>${data.travelDate}</strong> is confirmed.</p>
                 <p>Booking ID: <code>${data.bookingId}</code></p>
                 <p>Total Fare: ₹${data.fare}</p>`,
            sms: (data) =>
                `RedBus Elite: Booking ${data.bookingId} confirmed. ${data.origin}→${data.destination} on ${data.travelDate}. Fare ₹${data.fare}.`,
            push: (data) => ({
                title: 'Booking Confirmed ✅',
                body: `${data.origin} → ${data.destination} | ${data.travelDate}`,
            }),
        },
        hi: {
            subject: 'आपकी RedBus Elite बुकिंग की पुष्टि हो गई है!',
            body: (data) =>
                `<h2>बुकिंग की पुष्टि</h2>
                 <p>नमस्ते ${data.userName},</p>
                 <p><strong>${data.origin}</strong> से <strong>${data.destination}</strong> की
                    <strong>${data.travelDate}</strong> को आपकी बुकिंग पक्की हो गई है।</p>
                 <p>बुकिंग ID: <code>${data.bookingId}</code> | किराया: ₹${data.fare}</p>`,
            sms: (data) =>
                `RedBus Elite: बुकिंग ${data.bookingId} पक्की। ${data.origin}→${data.destination}, ${data.travelDate}। किराया ₹${data.fare}.`,
            push: (data) => ({
                title: 'बुकिंग पक्की ✅',
                body: `${data.origin} → ${data.destination} | ${data.travelDate}`,
            }),
        },
        ta: {
            subject: 'உங்கள் RedBus Elite முன்பதிவு உறுதிப்படுத்தப்பட்டது!',
            body: (data) =>
                `<h2>முன்பதிவு உறுதிப்பாடு</h2>
                 <p>வணக்கம் ${data.userName},</p>
                 <p><strong>${data.origin}</strong> இலிருந்து <strong>${data.destination}</strong> க்கு
                    <strong>${data.travelDate}</strong> அன்று உங்கள் முன்பதிவு உறுதியானது.</p>
                 <p>முன்பதிவு ID: <code>${data.bookingId}</code> | கட்டணம்: ₹${data.fare}</p>`,
            sms: (data) =>
                `RedBus Elite: முன்பதிவு ${data.bookingId} உறுதி. ${data.origin}→${data.destination}, ${data.travelDate}. கட்டணம் ₹${data.fare}.`,
            push: (data) => ({
                title: 'முன்பதிவு உறுதி ✅',
                body: `${data.origin} → ${data.destination} | ${data.travelDate}`,
            }),
        },
    },

    JOURNEY_ENDED: {
        en: {
            subject: 'How was your journey? Leave a review!',
            body: (data) =>
                `<h2>Journey Completed</h2>
                 <p>Hi ${data.userName},</p>
                 <p>Your journey from <strong>${data.origin}</strong> to <strong>${data.destination}</strong> has ended.</p>
                 <p>We'd love to hear your feedback. Rate your experience:</p>
                 <a href="${data.reviewUrl}" style="background:#e00;color:#fff;padding:10px 20px;text-decoration:none;border-radius:6px;">
                   Rate &amp; Review
                 </a>`,
            sms: (data) =>
                `RedBus Elite: How was your ${data.origin}→${data.destination} journey? Rate it here: ${data.reviewUrl}`,
            push: (data) => ({
                title: 'How was your journey? ⭐',
                body: `Rate your ${data.origin} → ${data.destination} experience`,
            }),
        },
        hi: {
            subject: 'आपकी यात्रा कैसी रही? समीक्षा दें!',
            body: (data) =>
                `<h2>यात्रा समाप्त</h2>
                 <p>नमस्ते ${data.userName},</p>
                 <p><strong>${data.origin}</strong> से <strong>${data.destination}</strong> की यात्रा समाप्त हुई।</p>
                 <a href="${data.reviewUrl}" style="background:#e00;color:#fff;padding:10px 20px;text-decoration:none;border-radius:6px;">
                   समीक्षा दें
                 </a>`,
            sms: (data) =>
                `RedBus Elite: ${data.origin}→${data.destination} यात्रा कैसी रही? यहाँ रेटिंग दें: ${data.reviewUrl}`,
            push: (data) => ({
                title: 'यात्रा कैसी रही? ⭐',
                body: `${data.origin} → ${data.destination} की समीक्षा दें`,
            }),
        },
        ta: {
            subject: 'உங்கள் பயணம் எப்படி இருந்தது? மதிப்பீடு செய்யுங்கள்!',
            body: (data) =>
                `<h2>பயணம் முடிந்தது</h2>
                 <p>வணக்கம் ${data.userName},</p>
                 <p><strong>${data.origin}</strong> இலிருந்து <strong>${data.destination}</strong> பயணம் முடிந்தது.</p>
                 <a href="${data.reviewUrl}" style="background:#e00;color:#fff;padding:10px 20px;text-decoration:none;border-radius:6px;">
                   மதிப்பீடு செய்யுங்கள்
                 </a>`,
            sms: (data) =>
                `RedBus Elite: ${data.origin}→${data.destination} பயணம் எப்படி? இங்கே மதிப்பீடு செய்யுங்கள்: ${data.reviewUrl}`,
            push: (data) => ({
                title: 'பயணம் எப்படி? ⭐',
                body: `${data.origin} → ${data.destination} மதிப்பீடு`,
            }),
        },
    },

    STORY_APPROVED: {
        en: {
            subject: 'Your travel story has been approved!',
            body: (data) =>
                `<h2>Story Approved 🎉</h2>
                 <p>Hi ${data.userName},</p>
                 <p>Your story "<strong>${data.storyTitle}</strong>" has been approved and is now
                    live on the RedBus Elite community feed.</p>`,
            sms: (data) =>
                `RedBus Elite: Your story "${data.storyTitle}" is now live on the community feed! 🎉`,
            push: (data) => ({
                title: 'Story Approved! 🎉',
                body: `"${data.storyTitle}" is now live`,
            }),
        },
        hi: {
            subject: 'आपकी यात्रा कहानी स्वीकृत हो गई!',
            body: (data) =>
                `<h2>कहानी स्वीकृत 🎉</h2>
                 <p>नमस्ते ${data.userName},</p>
                 <p>आपकी कहानी "<strong>${data.storyTitle}</strong>" को मंजूरी मिल गई है।</p>`,
            sms: (data) =>
                `RedBus Elite: आपकी कहानी "${data.storyTitle}" अब Community Feed पर लाइव है! 🎉`,
            push: (data) => ({
                title: 'कहानी स्वीकृत! 🎉',
                body: `"${data.storyTitle}" अब लाइव है`,
            }),
        },
        ta: {
            subject: 'உங்கள் பயண கதை அங்கீகரிக்கப்பட்டது!',
            body: (data) =>
                `<h2>கதை அங்கீகரிக்கப்பட்டது 🎉</h2>
                 <p>வணக்கம் ${data.userName},</p>
                 <p>உங்கள் கதை "<strong>${data.storyTitle}</strong>" இப்போது Community Feed இல் உள்ளது.</p>`,
            sms: (data) =>
                `RedBus Elite: உங்கள் கதை "${data.storyTitle}" இப்போது Community Feed இல் உள்ளது! 🎉`,
            push: (data) => ({
                title: 'கதை அங்கீகரிக்கப்பட்டது! 🎉',
                body: `"${data.storyTitle}" இப்போது உள்ளது`,
            }),
        },
    },
};

// ── Channel senders ──────────────────────────────────────────────────────────

/**
 * Send an HTML email receipt via Resend.
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject line
 * @param {string} html - HTML body
 */
async function sendEmail(to, subject, html) {
    const resend = getResend();
    const { data, error } = await resend.emails.send({
        from: 'RedBus Elite <noreply@redbusElite.com>',
        to,
        subject,
        html,
    });
    if (error) {
        throw new Error(`Resend email failed: ${error.message}`);
    }
    return data;
}

/**
 * Send an SMS alert via Twilio.
 * @param {string} to - E.164 recipient phone number (e.g. +919876543210)
 * @param {string} body - SMS message body
 */
async function sendSMS(to, body) {
    const client = getTwilioClient();
    const from = process.env.TWILIO_PHONE_NUMBER;
    if (!from) {
        throw new Error('TWILIO_PHONE_NUMBER environment variable is not set');
    }
    return client.messages.create({ from, to, body });
}

/**
 * Send a Firebase push notification to a single device or topic.
 * @param {string} target - FCM registration token or topic (prefixed with "/topics/")
 * @param {string} title  - Notification title
 * @param {string} body   - Notification body
 * @param {Object} [data] - Optional key-value data payload
 */
async function sendPush(target, title, body, data = {}) {
    getFirebaseApp(); // ensure initialised
    const messaging = admin.messaging();
    const isToken = !target.startsWith('/topics/');

    const message = {
        notification: { title, body },
        data: Object.fromEntries(
            Object.entries(data).map(([k, v]) => [k, String(v)])
        ),
        ...(isToken ? { token: target } : { topic: target.replace('/topics/', '') }),
    };

    return messaging.send(message);
}

/**
 * Send a Firebase push notification to all users subscribed to the
 * "all-users" topic. Used for community-wide broadcasts (e.g. story approved).
 */
async function sendPushToAllUsers(title, body, data = {}) {
    return sendPush('/topics/all-users', title, body, data);
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * triggerEliteAlert
 *
 * Sends a multi-channel alert (Email + SMS + Push) to a user based on their
 * language preference.
 *
 * @param {Object} user       - User object from the database
 * @param {string} user.email - User's email address
 * @param {string} user.phone - User's phone number in E.164 format
 * @param {string} [user.fcmToken] - Firebase Cloud Messaging device token
 * @param {string} [user.languagePref] - ISO language code ('en' | 'hi' | 'ta' | ...)
 * @param {string} type       - Alert type key (must exist in TEMPLATES)
 * @param {Object} data       - Template data payload
 * @returns {Promise<Object>} - Results from each channel
 */
async function triggerEliteAlert(user, type, data) {
    const lang = user.languagePref || 'en';
    const templateSet = TEMPLATES[type];
    if (!templateSet) {
        throw new Error(`Unknown notification type: "${type}". Valid types: ${Object.keys(TEMPLATES).join(', ')}`);
    }

    // Fall back to English if the user's language template is not defined
    const tpl = templateSet[lang] || templateSet['en'];

    const results = { email: null, sms: null, push: null, errors: [] };

    // ── Email ──
    if (user.email) {
        try {
            results.email = await sendEmail(
                user.email,
                tpl.subject,
                tpl.body(data)
            );
        } catch (err) {
            results.errors.push({ channel: 'email', message: err.message });
            console.error('[NotificationService] Email error:', err.message);
        }
    }

    // ── SMS ──
    if (user.phone) {
        try {
            results.sms = await sendSMS(user.phone, tpl.sms(data));
        } catch (err) {
            results.errors.push({ channel: 'sms', message: err.message });
            console.error('[NotificationService] SMS error:', err.message);
        }
    }

    // ── Push ──
    if (user.fcmToken) {
        try {
            const pushPayload = tpl.push(data);
            results.push = await sendPush(
                user.fcmToken,
                pushPayload.title,
                pushPayload.body,
                { type, ...data }
            );
        } catch (err) {
            results.errors.push({ channel: 'push', message: err.message });
            console.error('[NotificationService] Push error:', err.message);
        }
    }

    return results;
}

module.exports = {
    triggerEliteAlert,
    sendEmail,
    sendSMS,
    sendPush,
    sendPushToAllUsers,
    TEMPLATES,
};
