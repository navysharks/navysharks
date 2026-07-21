const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');
const fs = require('fs');
const path = require('path');

let app;
const serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH || './serviceAccountKey.json';

try {
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(path.resolve(serviceAccountPath));
    app = initializeApp({
      credential: cert(serviceAccount),
    });
    // Firebase Admin SDK initialized
  } else {
    console.warn(`[WARNING] Firebase Service Account Key not found at ${serviceAccountPath}. Database features will not work until this is provided.`);
    app = initializeApp();
  }
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
  throw new Error('Failed to initialize Firebase Admin SDK. Please check your service account key or environment.');
}

const db = getFirestore(app, "default");
const auth = getAuth(app);

module.exports = { db, auth };
