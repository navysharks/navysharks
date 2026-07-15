const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');
const fs = require('fs');
const path = require('path');

let app;
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json';

try {
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(path.resolve(serviceAccountPath));
    app = initializeApp({
      credential: cert(serviceAccount),
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } else {
    console.warn(`[WARNING] Firebase Service Account Key not found at ${serviceAccountPath}. Database features will not work until this is provided.`);
    app = initializeApp();
  }
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
}

const db = getFirestore(app);
const auth = getAuth(app);

module.exports = { db, auth };
