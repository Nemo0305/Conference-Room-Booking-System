const express = require('express');
const db = require('../db');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Helper: generate next cancellation ID
async function getNextCancelId() {
    const [rows] = await db.query('SELECT cancel_id FROM cancellation ORDER BY cancel_id DESC LIMIT 1');
    if (rows.length === 0) return 'C-01';
    const lastNum = parseInt(rows[0].cancel_id.split('-')[1]);
    return `C-${String(isNaN(lastNum) ? 1 : lastNum + 1).padStart(2, '0')}`;
}

// Helper: generate next booking ID (for splitting bookings)
async function getNextBookingId() {
    const [rows] = await db.query('SELECT booking_id FROM booking ORDER BY booking_id DESC LIMIT 1');
    if (rows.length === 0) return 'B-01';
    const lastNum = parseInt(rows[0].booking_id.split('-')[1]);
    return `B-${String(isNaN(lastNum) ? 1 : lastNum + 1).padStart(2, '0')}`;
}

// Helper: parse time string or MySQL TIME to hours integer
// Handles "14:00:00", "14:00", or MySQL TIME objects
function timeToHours(t) {
    if (!t) return 0;
    const s = String(t);
    const parts = s.split(':');
    return parseInt(parts[0]);
}

// Helper: hours integer to "HH:00:00" string
function hoursToTime(h) {
    return `${String(h).padStart(2, '0')}:00:00`;
}

// GET /api/cancellations — all cancellations (admin only)
router.get('/', authMiddleware, adminOnly, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT cn.*, b.uid, b.catalog_id, b.room_id, b.purpose, b.start_date, b.start_time,
                   u.name AS cancelled_by_name, c.room_name
            FROM cancellation cn
            JOIN booking b ON cn.booking_id = b.booking_id
            JOIN users u ON cn.cancelled_by_uid = u.uid
            JOIN conference_catalog c ON b.catalog_id = c.catalog_id AND b.room_id = c.room_id
            ORDER BY cn.cancel_date DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching cancellations:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /api/cancellations — create cancellation (protected)
// Supports PARTIAL cancellation via "slots" array
// Each slot is { from: "10:00:00", to: "11:00:00" }
router.post('/', authMiddleware, async (req, res) => {
    const {
        booking_id, cancel_reason, cancel_date,
        cancel_fromdate, cancel_todate, cancel_fromtime, cancel_totime,
        cancelled_by_uid, partial, slots
    } = req.body;

    if (!booking_id || !cancel_date || !cancelled_by_uid) {
        return res.status(400).json({ error: 'booking_id, cancel_date, and cancelled_by_uid are required.' });
    }

    if (!cancel_reason || cancel_reason.trim() === '') {
        return res.status(400).json({ error: 'Cancellation reason is required.' });
    }

    // Only allow cancellation by the booking owner or admin
    if (req.user.userrole_id !== 'admin' && req.user.uid !== cancelled_by_uid) {
        return res.status(403).json({ error: 'Access denied.' });
    }

    try {
        // Fetch full booking details
        const [bookings] = await db.query('SELECT * FROM booking WHERE booking_id = ?', [booking_id]);
        if (bookings.length === 0) return res.status(404).json({ error: 'Booking not found.' });
        const booking = bookings[0];

        if (req.user.userrole_id !== 'admin' && booking.uid !== req.user.uid) {
            return res.status(403).json({ error: 'Access denied.' });
        }

        const cancel_id = await getNextCancelId();

        // Insert cancellation record
        await db.query(
            'INSERT INTO cancellation (cancel_id, booking_id, cancel_reason, cancel_date, cancel_fromdate, cancel_todate, cancel_fromtime, cancel_totime, cancelled_by_uid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [cancel_id, booking_id, cancel_reason, cancel_date, cancel_fromdate || null, cancel_todate || null, cancel_fromtime || null, cancel_totime || null, cancelled_by_uid]
        );

        // Check if this is a partial cancellation with specific slots
        if (partial && slots && Array.isArray(slots) && slots.length > 0) {
            console.log('[CANCEL] Partial cancellation for booking', booking_id, 'slots:', slots);

            const bookStartH = timeToHours(booking.start_time);
            const bookEndH = timeToHours(booking.end_time);

            // Build a set of hours that should be CANCELLED
            const cancelledHours = new Set();
            for (const slot of slots) {
                const h = timeToHours(slot.from);
                cancelledHours.add(h);
            }

            // Build list of REMAINING hour ranges (contiguous groups)
            const remainingRanges = [];
            let rangeStart = null;

            for (let h = bookStartH; h < bookEndH; h++) {
                if (!cancelledHours.has(h)) {
                    // This hour is kept
                    if (rangeStart === null) rangeStart = h;
                } else {
                    // This hour is cancelled — close any open range
                    if (rangeStart !== null) {
                        remainingRanges.push({ start: rangeStart, end: h });
                        rangeStart = null;
                    }
                }
            }
            // Close final range
            if (rangeStart !== null) {
                remainingRanges.push({ start: rangeStart, end: bookEndH });
            }

            console.log('[CANCEL] Remaining ranges:', remainingRanges);

            if (remainingRanges.length === 0) {
                // All slots cancelled → full cancel
                await db.query('UPDATE booking SET status = ? WHERE booking_id = ?', ['cancelled', booking_id]);
            } else {
                // Update the ORIGINAL booking to the FIRST remaining range
                await db.query(
                    'UPDATE booking SET start_time = ?, end_time = ? WHERE booking_id = ?',
                    [hoursToTime(remainingRanges[0].start), hoursToTime(remainingRanges[0].end), booking_id]
                );

                // Create NEW bookings for additional remaining ranges (if split occurred)
                for (let i = 1; i < remainingRanges.length; i++) {
                    const range = remainingRanges[i];
                    const newBookingId = await getNextBookingId();
                    await db.query(
                        'INSERT INTO booking (booking_id, uid, catalog_id, room_id, start_date, end_date, start_time, end_time, purpose, attendees, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                        [newBookingId, booking.uid, booking.catalog_id, booking.room_id, booking.start_date, booking.end_date, hoursToTime(range.start), hoursToTime(range.end), booking.purpose, booking.attendees, booking.status]
                    );
                    // Create ticket for the new split booking
                    const ticket_id = `T-${newBookingId.split('-')[1]}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
                    await db.query(
                        'INSERT INTO ticket_details (ticket_id, booking_id, uid) VALUES (?, ?, ?)',
                        [ticket_id, newBookingId, booking.uid]
                    );
                    console.log('[CANCEL] Created split booking:', newBookingId, hoursToTime(range.start), '-', hoursToTime(range.end));
                }
            }
        } else {
            // Full cancellation (original behavior)
            await db.query('UPDATE booking SET status = ? WHERE booking_id = ?', ['cancelled', booking_id]);
        }

        res.status(201).json({ message: 'Cancellation recorded.', cancel_id });
    } catch (error) {
        console.error('Error creating cancellation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
