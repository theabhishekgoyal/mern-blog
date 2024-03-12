// Import dotenv
// import dotenv from "dotenv";

// Load environment variables from .env file
// dotenv.config();

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-bce07.firebaseapp.com",
  projectId: "mern-blog-bce07",
  storageBucket: "mern-blog-bce07.appspot.com",
  messagingSenderId: "183676609409",
  appId: "1:183676609409:web:3e6ae949f8377b0f97be80",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
