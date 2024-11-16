// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyD1lEUmm9oYqTa6MT9_zb2kzmjDyRaLIvA',
    authDomain: 'parking-reservations-app.firebaseapp.com',
    projectId: 'parking-reservations-app',
    storageBucket: 'parking-reservations-app.firebasestorage.app',
    messagingSenderId: '379636202710',
    appId: '1:379636202710:web:f506cebddffa0b58eadd77',
    measurementId: 'G-SS58NX6G6E',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
