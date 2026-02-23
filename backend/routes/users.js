const express = require('express');
const db = require('../db');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/users — all users (admin only)
router.get('/', authMiddleware, adminOnly, async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT uid, userrole_id, name, email, dept, phone_no FROM users ORDER BY name'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/users/:uid — single user (protected; own profile or admin)
router.get('/:uid', authMiddleware, async (req, res) => {
    const { uid } = req.params;
    if (req.user.userrole_id !== 'admin' && req.user.uid !== uid) {
        return res.status(403).json({ error: 'Access denied.' });
    }
    try {
        const [rows] = await db.query(
            'SELECT uid, userrole_id, name, email, dept, phone_no FROM users WHERE uid = ?',
            [uid]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'User not found.' });
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PUT /api/users/:uid — update own profile (or admin can update anyone)
router.put('/:uid', authMiddleware, async (req, res) => {
    const { uid } = req.params;
    if (req.user.userrole_id !== 'admin' && req.user.uid !== uid) {
        return res.status(403).json({ error: 'Access denied.' });
    }
    const { name, dept, phone_no } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE users SET name=?, dept=?, phone_no=? WHERE uid=?',
            [name, dept, phone_no, uid]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found.' });
        res.json({ message: 'Profile updated successfully.' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE /api/users/:uid — admin only
router.delete('/:uid', authMiddleware, adminOnly, async (req, res) => {
    const { uid } = req.params;
    try {
        const [result] = await db.query('DELETE FROM users WHERE uid = ?', [uid]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found.' });
        res.json({ message: 'User deleted successfully.' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
