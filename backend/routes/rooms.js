const express = require('express');
const db = require('../db');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/rooms — get all rooms (public)
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM conference_catalog');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/rooms/:catalog_id/:room_id — get single room
router.get('/:catalog_id/:room_id', async (req, res) => {
    const { catalog_id, room_id } = req.params;
    try {
        const [rows] = await db.query(
            'SELECT * FROM conference_catalog WHERE catalog_id = ? AND room_id = ?',
            [catalog_id, room_id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Room not found.' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching room:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /api/rooms — add a new room (admin only)
router.post('/', authMiddleware, adminOnly, async (req, res) => {
    const { catalog_id, room_id, room_name, capacity, location, amenities, status, floor_no, room_number, availability } = req.body;

    if (!catalog_id || !room_id || !room_name) {
        return res.status(400).json({ error: 'catalog_id, room_id, and room_name are required.' });
    }

    try {
        await db.query(
            'INSERT INTO conference_catalog (catalog_id, room_id, room_name, capacity, location, amenities, status, floor_no, room_number, availability) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [catalog_id, room_id, room_name, capacity, location, amenities, status || 'active', floor_no, room_number, availability || 'available']
        );
        res.status(201).json({ message: 'Room added successfully.', catalog_id, room_id });
    } catch (error) {
        console.error('Error adding room:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PUT /api/rooms/:catalog_id/:room_id — update room (admin only)
router.put('/:catalog_id/:room_id', authMiddleware, adminOnly, async (req, res) => {
    const { catalog_id, room_id } = req.params;
    const { room_name, capacity, location, amenities, status, floor_no, room_number, availability } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE conference_catalog SET room_name=?, capacity=?, location=?, amenities=?, status=?, floor_no=?, room_number=?, availability=? WHERE catalog_id=? AND room_id=?',
            [room_name, capacity, location, amenities, status, floor_no, room_number, availability, catalog_id, room_id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Room not found.' });
        }
        res.json({ message: 'Room updated successfully.' });
    } catch (error) {
        console.error('Error updating room:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE /api/rooms/:catalog_id/:room_id — delete room (admin only)
router.delete('/:catalog_id/:room_id', authMiddleware, adminOnly, async (req, res) => {
    const { catalog_id, room_id } = req.params;
    try {
        const [result] = await db.query(
            'DELETE FROM conference_catalog WHERE catalog_id = ? AND room_id = ?',
            [catalog_id, room_id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Room not found.' });
        }
        res.json({ message: 'Room deleted successfully.' });
    } catch (error) {
        console.error('Error deleting room:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
