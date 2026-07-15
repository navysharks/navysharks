const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
// We will use express.json() for most routes, but Stripe Webhooks need raw bodies
app.use((req, res, next) => {
  if (req.originalUrl === '/api/webhook') {
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

app.use('/api/payment', paymentRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/identity', identityRoutes);

app.listen(port, () => {
  console.log(`Navy Sharks backend listening on port ${port}`);
});
