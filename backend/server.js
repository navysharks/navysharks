const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Restrict CORS to the configured frontend URL only
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173',
];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. server-to-server, Stripe webhooks)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
// We will use express.json() for most routes, but Stripe Webhooks need raw bodies
app.use((req, res, next) => {
  if (req.originalUrl.includes('/webhook')) {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// Basic Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Navy Sharks Backend is running' });
});

// Import Routes
const paymentRoutes = require('./src/routes/payment');
const webhookRoutes = require('./src/routes/webhook');
const identityRoutes = require('./src/routes/identity');
const contactRoutes = require('./src/routes/contact');

// In Firebase, the function name "api" is stripped from the URL.
// So /api/payment becomes /payment inside Express.
app.use('/payment', paymentRoutes);
app.use('/webhook', webhookRoutes);
app.use('/identity', identityRoutes);
app.use('/contact', contactRoutes);

// Also keep the /api prefix for local development without Firebase emulators
app.use('/api/payment', paymentRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/identity', identityRoutes);
app.use('/api/contact', contactRoutes);

// Export for Firebase Functions
module.exports = app;
