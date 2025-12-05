// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-dfi8N4nrCouRlutrUuRO_PadfDMmwbY",
  authDomain: "siemens-4424b.firebaseapp.com",
  projectId: "siemens-4424b",
  storageBucket: "siemens-4424b.firebasestorage.app",
  messagingSenderId: "335953542894",
  appId: "1:335953542894:web:71f7bf2d62029089cb3dff",
  measurementId: "G-M5ZVHJVHHM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);