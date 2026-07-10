require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const v1Router = require('./routes/v1');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: '*', // For development, allow all. Update in production.
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Request parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP Request Logger
app.use(morgan('dev'));

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date(),
    service: 'Mobile Adda Bhilai Backend API',
  });
});

// Version 1 API routes
app.use('/api/v1', v1Router);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack || err.message || err);
  res.status(500).json({
    success: false,
    message: 'An unexpected internal server error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start listening
app.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(` Mobile Adda Backend running on port ${PORT} `);
  console.log(` API available at: http://localhost:${PORT}/api/v1 `);
  console.log(`=============================================`);
});
