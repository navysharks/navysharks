const express = require('express');
const nodemailer = require('nodemailer');
const { db, auth } = require('../firebase');
const { FieldValue } = require('firebase-admin/firestore');
const router = express.Router();

function generatePIN() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post('/send-pin', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const emailLower = email.toLowerCase();

  try {
    // 1. Check if email already exists in Auth
    try {
      await auth.getUserByEmail(emailLower);
      // If we reach here, user already exists
      return res.status(400).json({ error: 'An account with this email already exists.' });
    } catch (authError) {
      if (authError.code !== 'auth/user-not-found') {
        throw authError; // Some other error occurred
      }
      // Expected case: user not found, we can proceed
    }

    const pin = generatePIN();
    
    // Set expiration to 15 minutes from now
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    // 2. Save to Firestore
    await db.collection('email_verifications').doc(emailLower).set({
      email: emailLower,
      pin,
      expiresAt: expiresAt.toISOString()
    });

    // 3. Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER || 'adminnavysharks@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    const mailOptions = {
      from: `"Navy Sharks Registration" <${process.env.GMAIL_USER || 'adminnavysharks@gmail.com'}>`,
      to: emailLower,
      subject: 'Navy Sharks - Your Verification Code',
      text: `Your verification code is: ${pin}\n\nThis code will expire in 15 minutes.`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; text-align: center; padding: 40px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #06b6d4;">Welcome to Navy Sharks</h2>
          <p>Please use the following 6-digit code to complete your registration:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 30px 0; color: #1e293b; background: #f8fafc; padding: 15px; border-radius: 8px;">
            ${pin}
          </div>
          <p style="color: #64748b; font-size: 14px;">This code will expire in 15 minutes.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Verification PIN sent.' });
  } catch (error) {
    console.error('Error sending PIN:', error);
    res.status(500).json({ error: 'Failed to send verification PIN.' });
  }
});

router.post('/verify-and-register', async (req, res) => {
  const { email, pin, password, name, phone } = req.body;
  if (!email || !pin || !password || !name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const emailLower = email.toLowerCase();

  try {
    const docRef = db.collection('email_verifications').doc(emailLower);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(400).json({ error: 'No active verification found. Please request a new PIN.' });
    }

    const data = doc.data();

    // Check expiration
    if (new Date() > new Date(data.expiresAt)) {
      return res.status(400).json({ error: 'Verification PIN has expired. Please request a new one.' });
    }

    // Check PIN match
    if (data.pin !== pin.toString().trim()) {
      return res.status(400).json({ error: 'Invalid verification PIN.' });
    }

    // --- BULLETPROOF REGISTRATION LOGIC ---
    
    // 1. Create the user in Firebase Auth using Admin SDK
    const userRecord = await auth.createUser({
      email: emailLower,
      password: password,
      displayName: name,
      phoneNumber: phone.startsWith('+') ? phone : undefined // Firebase requires E.164 format for phone if provided
    }).catch(async (error) => {
       if (error.code === 'auth/invalid-phone-number') {
           // Fallback if phone is not E.164
           return await auth.createUser({
              email: emailLower,
              password: password,
              displayName: name,
           });
       }
       throw error;
    });

    // 2. Create the Firestore profile
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      name: name,
      phone: phone || "",
      email: emailLower,
      role: "user", // Default role
      membershipStatus: "None",
      createdAt: FieldValue.serverTimestamp()
    });

    // 3. Delete the verification pin doc so it can't be reused
    await docRef.delete();

    // 4. Generate a Custom Token to automatically log them in on the frontend
    const customToken = await auth.createCustomToken(userRecord.uid);

    res.status(200).json({ 
      success: true, 
      message: 'Email verified and account created successfully.',
      customToken
    });

  } catch (error) {
    console.error('Error in verify-and-register:', error);
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }
    if (error.code === 'auth/invalid-password') {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }
    res.status(500).json({ error: 'Failed to complete registration. Please try again.' });
  }
});

module.exports = router;
