// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCS_CiuGvdUkFYd-T695BTEjC5Rnnn19fc",
  authDomain: "jobquest-b2333.firebaseapp.com",
  projectId: "jobquest-b2333",
  storageBucket: "jobquest-b2333.appspot.com",
  messagingSenderId: "562647354562",
  appId: "1:562647354562:web:123f5fac228668d81cff5b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
