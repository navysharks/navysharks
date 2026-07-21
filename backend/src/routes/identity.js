const express = require('express');
const stripe = require('../stripe');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

router.post('/create-verification-session', verifyToken, async (req, res) => {
  try {
    // Use the authenticated user's UID from the verified token
    const userId = req.user.uid;

    // Create a VerificationSession
    const verificationSession = await stripe.identity.verificationSessions.create({
      type: 'document',
      metadata: {
        userId: userId,
      },
      options: {
        document: {
          require_id_number: true,
          require_matching_selfie: true,
        },
      },
      return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/membership?verification_session_id={VERIFICATION_SESSION_ID}`,
    });

    res.json({ 
      id: verificationSession.id,
      url: verificationSession.url
    });
  } catch (error) {
    console.error('Error creating identity verification session:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
