import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For now, these are placeholders until you provide the Test API Keys
const firebaseConfig = {
  apiKey: "AIzaSyBrWVGKV3fQc8O8nOj7uW5EJ21fh9LhwaE",
  authDomain: "navysharks.firebaseapp.com",
  projectId: "navysharks",
  storageBucket: "navysharks.firebasestorage.app",
  messagingSenderId: "401023956030",
  appId: "1:401023956030:web:9a5814d60ef33b42ca8d6f",
  measurementId: "G-0N7XWCZ6WD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app, "default");
