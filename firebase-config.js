// firebase-config.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAEb06mg8LoVsUcM0xVPB8IWKcnonPIsS4",
  authDomain: "cars-website-a6263.firebaseapp.com",
  projectId: "cars-website-a6263",
  storageBucket: "cars-website-a6263.firebasestorage.app",
  messagingSenderId: "987567464586",
  appId: "1:987567464586:web:5fe5a732b171160bdf4d73",
  measurementId: "G-R712WLNSEM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);