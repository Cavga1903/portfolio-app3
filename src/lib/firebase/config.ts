import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase configuration
// Priority: Environment variables > Hardcoded config (fallback for development)
// Note: In production, use environment variables for better security
const firebaseConfig: {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
} = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA6UCz0o9V4OLH2vGw8n1GU-CdRTb8hPxg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "myportfolio-1e13b.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "myportfolio-1e13b",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "myportfolio-1e13b.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "419940030464",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:419940030464:web:4370506fa0b2e9b934a0e5",
  // measurementId - Firebase Analytics için
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-TTT8JF69GR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Storage
export const storage = getStorage(app);

// Initialize Analytics (only in browser environment)
let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}
export { analytics };

export default app;

