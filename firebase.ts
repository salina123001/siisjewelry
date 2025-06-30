// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBVwk6N0mRimPMZ_hnDYZZaQ5cqcPXf61M",
  authDomain: "siis-jewelry-5c370.firebaseapp.com",
  projectId: "siis-jewelry-5c370",
  storageBucket: "siis-jewelry-5c370.firebasestorage.app",
  messagingSenderId: "88460482323",
  appId: "1:88460482323:web:b6a59a4e537a6a4cf86ce6",
  measurementId: "G-NPDXXFYHBX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);