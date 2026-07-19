const express = require('express');
const stripe = require('../stripe');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

router.post('/create-checkout-session', verifyToken, async (req, res) => {
  try {
    // Use the authenticated user's UID instead of trusting the request body
    const userId = req.user.uid;
    const userEmail = req.user.email || req.body.userEmail;
    const { verificationSessionId } = req.body;

    // --- Server-side Identity Verification Check ---
    // A verificationSessionId is REQUIRED. Without it, we cannot confirm the user
    // completed a real Stripe Identity check.
    if (!verificationSessionId) {
      return res.status(403).json({ 
        error: 'Identity verification is required before purchasing Elite Membership.' 
      });
    }

    // Retrieve the session from Stripe to confirm its real status.
    // This prevents URL spoofing (e.g. ?verification_session_id=fake).
    const verificationSession = await stripe.identity.verificationSessions.retrieve(verificationSessionId);

    if (verificationSession.status !== 'verified') {
      return res.status(403).json({ 
        error: `Identity verification was not completed successfully. Status: ${verificationSession.status}. Please complete the verification process.` 
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      allow_promotion_codes: true,
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
    res.status(500).json({ error: 'An error occurred creating your checkout session. Please try again.' });
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

    // Server-side price validation — NEVER trust client-supplied prices
    const bundlePriceMap = {
      "VIP Weekend Access": 98000,
      "Luxe Escape Experience": 129000,
      "Yacht & River Elite": 165000,
      "Explorer's Paradise": 78000,
      "Ultimate Island Experience": 115000,
      "Private Yacht Expedition": 155000,
      "Urban Discovery": 92000,
      "Total Immersion": 125000,
      "VIP Cultural Journey": 175000,
    };

    const priceAmount = bundlePriceMap[bundleName];
    if (!priceAmount) {
      return res.status(400).json({ error: `Unknown bundle: ${bundleName}` });
    }

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
      aviation_standard: { name: "Aviation Standard Credit", price: 34900 },
      aviation_first_class: { name: "Aviation First Class Flyer", price: 99900 },
      marine: { name: "Marine Credit (Yacht + Jetski)", price: 49900 },
      accommodation: { name: "Accommodation Credit (Premium Stays)", price: 24900 },
      club: { name: "Club Credit (Dining & Nightlife)", price: 19900 },
    };

    if (Array.isArray(addons)) {
      addons.forEach(item => {
        const isString = typeof item === 'string';
        const addonId = isString ? item : item.id;
        const quantity = isString ? 1 : Math.min(Math.max(1, item.quantity || 1), 10);

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
            quantity: quantity,
          });
        }
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      allow_promotion_codes: true,
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
    res.status(500).json({ error: 'An error occurred creating your checkout session. Please try again.' });
  }
});



module.exports = router;
