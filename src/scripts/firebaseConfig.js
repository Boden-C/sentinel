// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCY92G_WgKjkNOHJCvNIegmVxJGGLiyyuk",
  authDomain: "sentinel-1d8b0.firebaseapp.com",
  projectId: "sentinel-1d8b0",
  storageBucket: "sentinel-1d8b0.firebasestorage.app",
  messagingSenderId: "928862095545",
  appId: "1:928862095545:web:12fa313939a1442e6f3368",
  measurementId: "G-5HKZTEMVZ8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);