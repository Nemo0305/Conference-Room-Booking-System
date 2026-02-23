const express = require('express');
const db = require('../db');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Helper: generate next booking_id
async function getNextBookingId() {
    const [rows] = await db.query('SELECT booking_id FROM booking ORDER BY booking_id DESC LIMIT 1');
    if (rows.length === 0) return 'B-01';
    const lastNum = parseInt(rows[0].booking_id.split('-')[1]);
    return `B-${String(isNaN(lastNum) ? 1 : lastNum + 1).padStart(2, '0')}`;
}

// GET /api/bookings — all bookings (admin only)
router.get('/', authMiddleware, adminOnly, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT b.*, u.name AS user_name, u.email, c.room_name
            FROM booking b
            JOIN users u ON b.uid = u.uid
            JOIN conference_catalog c ON b.catalog_id = c.catalog_id AND b.room_id = c.room_id
            ORDER BY b.start_date DESC, b.start_time DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/bookings/user/:uid — bookings for a specific user (protected)
router.get('/user/:uid', authMiddleware, async (req, res) => {
    const { uid } = req.params;
    // Users can only fetch their own bookings; admins can fetch any
    if (req.user.userrole_id !== 'admin' && req.user.uid !== uid) {
        return res.status(403).json({ error: 'Access denied.' });
    }
    try {
        const [rows] = await db.query(`
            SELECT b.*, c.room_name, c.location, c.floor_no
            FROM booking b
            JOIN conference_catalog c ON b.catalog_id = c.catalog_id AND b.room_id = c.room_id
            WHERE b.uid = ?
            ORDER BY b.start_date DESC, b.start_time DESC
        `, [uid]);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /api/bookings — create booking (protected)
router.post('/', authMiddleware, async (req, res) => {
    const { uid, catalog_id, room_id, start_date, end_date, start_time, end_time, purpose } = req.body;

    if (!uid || !catalog_id || !room_id || !start_date || !end_date || !start_time || !end_time) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Users can only book for themselves
    if (req.user.userrole_id !== 'admin' && req.user.uid !== uid) {
        return res.status(403).json({ error: 'Access denied.' });
    }

    try {
        // Check for conflicting bookings
        const [conflicts] = await db.query(`
            SELECT booking_id FROM booking
            WHERE catalog_id = ? AND room_id = ?
            AND status != 'cancelled'
            AND start_date <= ? AND end_date >= ?
            AND start_time < ? AND end_time > ?
        `, [catalog_id, room_id, end_date, start_date, end_time, start_time]);

        if (conflicts.length > 0) {
            return res.status(409).json({ error: 'Room is already booked for this time slot.' });
        }

        const booking_id = await getNextBookingId();
        await db.query(
            'INSERT INTO booking (booking_id, uid, catalog_id, room_id, start_date, end_date, start_time, end_time, purpose, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [booking_id, uid, catalog_id, room_id, start_date, end_date, start_time, end_time, purpose || '', 'pending']
        );
        res.status(201).json({ message: 'Booking created successfully.', booking_id });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PUT /api/bookings/:id/status — approve/reject booking (admin only)
router.put('/:id/status', authMiddleware, adminOnly, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'confirmed' | 'rejected' | 'cancelled'

    const allowed = ['confirmed', 'rejected', 'cancelled', 'pending'];
    if (!allowed.includes(status)) {
        return res.status(400).json({ error: `Status must be one of: ${allowed.join(', ')}` });
    }

    try {
        const [result] = await db.query(
            'UPDATE booking SET status = ? WHERE booking_id = ?',
            [status, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Booking not found.' });
        }
        res.json({ message: `Booking ${id} updated to "${status}".` });
    } catch (error) {
        console.error('Error updating booking status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE /api/bookings/:id — cancel/delete a booking
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        // Check ownership
        const [rows] = await db.query('SELECT uid FROM booking WHERE booking_id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Booking not found.' });
        }
        if (req.user.userrole_id !== 'admin' && req.user.uid !== rows[0].uid) {
            return res.status(403).json({ error: 'Access denied.' });
        }

        await db.query('UPDATE booking SET status = ? WHERE booking_id = ?', ['cancelled', id]);
        res.json({ message: 'Booking cancelled successfully.' });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
