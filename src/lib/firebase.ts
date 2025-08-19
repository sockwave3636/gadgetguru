import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDUKFv5Pej6lG_jP77xRXdpnxmV7iCOUgc",
  authDomain: "suggest-bbade.firebaseapp.com",
  projectId: "suggest-bbade",
  storageBucket: "suggest-bbade.firebasestorage.app",
  messagingSenderId: "728849677843",
  appId: "1:728849677843:web:80b31e81698aecd08409e6",
  measurementId: "G-SWHPZHX5MB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics only on client side
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };

