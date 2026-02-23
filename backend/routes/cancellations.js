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
router.post('/', authMiddleware, async (req, res) => {
    const {
        booking_id, cancel_reason, cancel_date,
        cancel_fromdate, cancel_todate, cancel_fromtime, cancel_totime,
        cancelled_by_uid
    } = req.body;

    if (!booking_id || !cancel_date || !cancelled_by_uid) {
        return res.status(400).json({ error: 'booking_id, cancel_date, and cancelled_by_uid are required.' });
    }

    // Only allow cancellation by the booking owner or admin
    if (req.user.userrole_id !== 'admin' && req.user.uid !== cancelled_by_uid) {
        return res.status(403).json({ error: 'Access denied.' });
    }

    try {
        // Verify booking exists and belongs to user (unless admin)
        const [bookings] = await db.query('SELECT uid FROM booking WHERE booking_id = ?', [booking_id]);
        if (bookings.length === 0) return res.status(404).json({ error: 'Booking not found.' });
        if (req.user.userrole_id !== 'admin' && bookings[0].uid !== req.user.uid) {
            return res.status(403).json({ error: 'Access denied.' });
        }

        const cancel_id = await getNextCancelId();

        await db.query(
            'INSERT INTO cancellation (cancel_id, booking_id, cancel_reason, cancel_date, cancel_fromdate, cancel_todate, cancel_fromtime, cancel_totime, cancelled_by_uid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [cancel_id, booking_id, cancel_reason || '', cancel_date, cancel_fromdate || null, cancel_todate || null, cancel_fromtime || null, cancel_totime || null, cancelled_by_uid]
        );

        // Also update booking status to cancelled
        await db.query('UPDATE booking SET status = ? WHERE booking_id = ?', ['cancelled', booking_id]);

        res.status(201).json({ message: 'Cancellation recorded.', cancel_id });
    } catch (error) {
        console.error('Error creating cancellation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
