const functions = require('firebase-functions/v1');
const app = require('./server');

// Expose the Express app as a Firebase Cloud Function called "api"
exports.api = functions.https.onRequest(app);
