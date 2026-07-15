import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For now, these are placeholders until you provide the Test API Keys
const firebaseConfig = {
  apiKey: "AIzaSyBBnmgb9seyWL_De80kI_ovCoa5mpPqX1A",
  authDomain: "navyshark-8bba4.firebaseapp.com",
  projectId: "navyshark-8bba4",
  storageBucket: "navyshark-8bba4.firebasestorage.app",
  messagingSenderId: "1055783784975",
  appId: "1:1055783784975:web:e64955dc331d6f9efb097a",
  measurementId: "G-28CGY2S0F1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
