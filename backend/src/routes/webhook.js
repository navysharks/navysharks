const express = require('express');
const stripe = require('../stripe');
const { db } = require('../firebase');
const nodemailer = require('nodemailer');

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Note: Stripe requires the raw body to construct the event, which is why we bypass express.json() in server.js
router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    const payload = req.rawBody || req.body;
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const userId = session.client_reference_id;

      if (userId) {
        try {
          if (session.metadata && session.metadata.type === 'bundle') {
            // Save bundle booking to subcollection
            let parsedAddons = [];
            try {
              if (session.metadata.addons) {
                parsedAddons = JSON.parse(session.metadata.addons);
              }
            } catch (e) {
              console.error("Error parsing addons from metadata", e);
            }

            const bookingRef = db.collection('users').doc(userId).collection('bookings').doc(session.id);
            await bookingRef.set({
              bundleName: session.metadata.bundleName,
              date: session.metadata.date,
              addons: parsedAddons,
              createdAt: new Date(),
              status: 'confirmed',
              amountPaid: session.amount_total,
              stripeSessionId: session.id
            });
            // Bundle booking recorded successfully

            // Send confirmation email
            const customerEmail = session.customer_details ? session.customer_details.email : null;
            if (customerEmail && process.env.SMTP_USER) {
              try {
                await transporter.sendMail({
                  from: `"Navy Sharks Concierge" <${process.env.SMTP_USER}>`,
                  to: customerEmail,
                  subject: `Booking Confirmed: ${session.metadata.bundleName}`,
                  html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #020617; color: #f8fafc; padding: 20px; border-radius: 10px;">
                      <h2 style="color: #22d3ee;">Navy Sharks Concierge</h2>
                      <h3>Your Booking is Confirmed!</h3>
                      <p>Thank you for booking the <strong>${session.metadata.bundleName}</strong> experience.</p>
                      <p><strong>Date:</strong> ${new Date(session.metadata.date).toLocaleDateString()}</p>
                      ${parsedAddons.length > 0 ? `<p><strong>Enhancements:</strong> ${parsedAddons.map(a => {
                        if (typeof a === 'string') return a;
                        const addonNames = {
                          helicopter: "Helicopter Airport Transfer",
                          yacht_ext: "Extend Yacht Charter (+4 hrs)",
                          vip_night: "Extra VIP Nightlife Experience",
                          aviation_standard: "Aviation Standard Credit",
                          aviation_first_class: "Aviation First Class Flyer",
                          marine: "Marine Credit (Yacht + Jetski)",
                          accommodation: "Accommodation Credit (Premium Stays)",
                          club: "Club Credit (Dining & Nightlife)",
                        };
                        const name = addonNames[a.id] || a.id;
                        return a.quantity > 1 ? `${name} x${a.quantity}` : name;
                      }).join(', ')}</p>` : ''}
                      <p>Total Paid: ${(session.amount_total / 100).toFixed(2)} ${session.currency.toUpperCase()}</p>
                      <br/>
                      <p>Our concierge team will reach out to you shortly via WhatsApp to finalize the details.</p>
                      <p>Welcome to the Elite.</p>
                    </div>
                  `
                });
                // Confirmation email sent
              } catch (emailError) {
                console.error("Error sending confirmation email:", emailError);
              }
            }
          } else {
            // Default: Update the user's document in Firestore to reflect Elite Membership
            await db.collection('users').doc(userId).set({
              membershipStatus: 'Elite',
              membershipPurchaseDate: new Date(),
              stripeSessionId: session.id,
              stripeCustomerId: session.customer,
            }, { merge: true });
            // User upgraded to Elite Member
          }
        } catch (dbError) {
          console.error('Error updating Firestore:', dbError);
        }
      } else {
        console.warn('No client_reference_id found in session. Could not update user in Firebase.');
      }
      break;
      
    // Handle other event types if necessary
    default:
      // Unhandled event type — ignored
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
});

module.exports = router;
