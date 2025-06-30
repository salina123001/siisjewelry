// services/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBVwk6N0mRimPMZ_hnDYZZaQ5cqcPXf61M",
  authDomain: "siis-jewelry-5c370.firebaseapp.com",
  projectId: "siis-jewelry-5c370",
  storageBucket: "siis-jewelry-5c370.firebasestorage.app",
  messagingSenderId: "88460482323",
  appId: "1:88460482323:web:b6a59a4e537a6a4cf86ce6",
  measurementId: "G-NPDXXFYHBX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);