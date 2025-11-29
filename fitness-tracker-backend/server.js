const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/tracking', require('./routes/tracking'));

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Fitness Tracker API is running',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// Handle 404
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// ✅ Graceful shutdown for Nodemon restarts
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down server...');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down server...');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});
