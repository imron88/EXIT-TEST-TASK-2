const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const config = require('./config/config');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// ==========================================
// 5. Basic Security Configuration
// ==========================================

// Helmet secures HTTP headers against common web vulnerabilities
app.use(helmet());

// Cross-Origin Resource Sharing
app.use(cors());

// Rate Limiter: 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs, // 15 minutes (900000 ms)
  max: config.rateLimit.max, // 100 requests per window
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Too many requests from this IP address. Please try again after 15 minutes.'
  }
});
app.use(limiter);

// ==========================================
// Body Parsing Middleware
// ==========================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// API Root & Health Check
// ==========================================
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'College Student Portal API is running',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /register',
        login: 'POST /login'
      },
      protected: {
        profile: 'GET /profile (Logged-in users)',
        students: 'GET /students (Admins only)'
      }
    }
  });
});

// ==========================================
// Mount Application Routes
// ==========================================
app.use('/', authRoutes);
app.use('/', userRoutes);

// ==========================================
// 404 Route Handler
// ==========================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// ==========================================
// Global Error Handler Middleware
// ==========================================
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;
