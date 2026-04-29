// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase configuration from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDP6SjHQze_m9wc6pTa9LOa8EfH8ZDQqKg",
  authDomain: "medibook-8ecc2.firebaseapp.com",
  projectId: "medibook-8ecc2",
  storageBucket: "medibook-8ecc2.firebasestorage.app",
  messagingSenderId: "928520579316",
  appId: "1:928520579316:web:c9ad422aba3af4ac4d56a1",
  measurementId: "G-NM8T3LWRXV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;