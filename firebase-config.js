 // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
  const analytics = getAnalytics(app);