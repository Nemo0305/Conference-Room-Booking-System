const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ── Root Route ──────────────────────────────────
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Conference Room Booking System API',
        frontends: {
            user: 'http://localhost:5173',
            admin: 'http://localhost:3001'
        },
        health: 'http://127.0.0.1:5000/api/health'
    });
});

// ── Routes ──────────────────────────────────────
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const bookingRoutes = require('./routes/bookings');
const userRoutes = require('./routes/users');
const cancellationRoutes = require('./routes/cancellations');

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cancellations', cancellationRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend is running', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.method} ${req.path} not found.` });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on http://127.0.0.1:${PORT}`);
    console.log('   Routes: /api/auth | /api/rooms | /api/bookings | /api/users | /api/cancellations');
});
