// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCwyZrnU_RST9VKKH8V7gWLO_sV7V8TrI",
  authDomain: "screenscout-2198f.firebaseapp.com",
  projectId: "screenscout-2198f",
  storageBucket: "screenscout-2198f.firebasestorage.app",
  messagingSenderId: "691682915921",
  appId: "1:691682915921:web:48b08ec0108629d5126a70",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
