const express = require('express');
const stripe = require('../stripe');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

router.post('/create-checkout-session', verifyToken, async (req, res) => {
  try {
    // Use the authenticated user's UID instead of trusting the request body
    const userId = req.user.uid;
    const userEmail = req.user.email || req.body.userEmail;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Navy Sharks Elite Membership',
              description: 'Exclusive access to premium concierge services, vetted safe zones, and curated lifestyle experiences.',
            },
            unit_amount: 490000, // $4,900.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // Use the verified UID from the token, not from the body
      client_reference_id: userId,
      customer_email: userEmail,
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/membership?canceled=true`,
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/create-bundle-checkout-session', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const userEmail = req.user.email || req.body.userEmail;
    const { bundleName, price, date, addons } = req.body;

    if (!bundleName || !price || !date) {
      return res.status(400).json({ error: 'Missing required fields: bundleName, price, date' });
    }

    // Convert price string (e.g. "$980") to cents integer
    const priceAmount = parseInt(price.replace(/[^0-9]/g, ''), 10) * 100;

    const line_items = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: bundleName,
            description: `Experience Booking for ${new Date(date).toLocaleDateString()}`,
          },
          unit_amount: priceAmount,
        },
        quantity: 1,
      },
    ];

    const addonsMap = {
      helicopter: { name: "Helicopter Airport Transfer", price: 38000 },
      yacht_ext: { name: "Extend Yacht Charter (+4 hrs)", price: 60000 },
      vip_night: { name: "Extra VIP Nightlife Experience", price: 25000 },
    };

    if (Array.isArray(addons)) {
      addons.forEach(addonId => {
        const addon = addonsMap[addonId];
        if (addon) {
          line_items.push({
            price_data: {
              currency: 'usd',
              product_data: {
                name: addon.name,
              },
              unit_amount: addon.price,
            },
            quantity: 1,
          });
        }
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: line_items,
      mode: 'payment',
      client_reference_id: userId,
      customer_email: userEmail,
      metadata: {
        type: 'bundle',
        bundleName: bundleName,
        date: date,
        addons: addons ? JSON.stringify(addons) : "[]",
      },
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/success?session_id={CHECKOUT_SESSION_ID}&type=bundle`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/membership?canceled=true`,
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating bundle checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/create-prive-checkout-session', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const userEmail = req.user.email || req.body.userEmail;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Navy Sharks Privé Membership',
              description: 'Annual recurring membership for VIP access and concierge services.',
            },
            unit_amount: 49000, // $490.00
            recurring: { interval: 'year' },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      client_reference_id: userId,
      customer_email: userEmail,
      metadata: {
        type: 'prive_membership',
      },
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/?canceled=true`,
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating Privé checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
