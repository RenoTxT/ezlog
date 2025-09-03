// Import fungsi yang kita butuhkan dari SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// 1. Impor App Check dan reCAPTCHA
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// Konfigurasi Firebase Anda...
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// 2. Inisialisasi App Check
// Pastikan variabel VITE_RECAPTCHA_SITE_KEY sudah ada di .env.local dan Vercel
initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_SITE_KEY),
  
  // Opsional: token akan otomatis di-refresh
  isTokenAutoRefreshEnabled: true
});


// Ekspor auth dan db seperti sebelumnya
export const auth = getAuth(app);
export const db = getFirestore(app);

