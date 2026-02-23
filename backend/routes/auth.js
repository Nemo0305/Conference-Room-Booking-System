const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { uid, name, email, password, dept, phone_no, userrole_id } = req.body;

    if (!uid || !name || !email || !password || !dept || !phone_no) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        // Check if email already exists
        const [existing] = await db.query('SELECT uid FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(409).json({ error: 'Email already registered.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const role = userrole_id || 'user';

        await db.query(
            'INSERT INTO users (uid, userrole_id, name, email, password, dept, phone_no) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [uid, role, name, email, hashedPassword, dept, phone_no]
        );

        res.status(201).json({ message: 'User registered successfully.', uid });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const token = jwt.sign(
            { uid: user.uid, userrole_id: user.userrole_id, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful.',
            token,
            user: {
                uid: user.uid,
                name: user.name,
                email: user.email,
                dept: user.dept,
                phone_no: user.phone_no,
                userrole_id: user.userrole_id
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/auth/me  (protected)
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT uid, userrole_id, name, email, dept, phone_no FROM users WHERE uid = ?',
            [req.user.uid]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Me error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
