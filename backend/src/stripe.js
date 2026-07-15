const Stripe = require('stripe');

// Initialize Stripe with the secret key from .env
// We use a placeholder for test mode if it's not set
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16', // Use a recent stable API version
});

module.exports = stripe;
