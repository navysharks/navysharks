const Stripe = require('stripe');

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is missing from environment variables.");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16', // Use a recent stable API version
});

module.exports = stripe;
