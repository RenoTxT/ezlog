// Import fungsi yang kita butuhkan dari SDK
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics'
// 1. Impor Firestore
import { getFirestore } from 'firebase/firestore'

// Konfigurasi Firebase Anda...
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig)

// Ekspor auth yang sudah ada
export const auth = getAuth(app)

// 2. Inisialisasi dan ekspor Firestore Database
export const db = getFirestore(app)

const analytics = getAnalytics(app)
