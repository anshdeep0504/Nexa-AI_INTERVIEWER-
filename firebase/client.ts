// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-MJ_YpV5cHPslvqYxDVsD9zh9t7PyT2c",
  authDomain: "fir-3567d.firebaseapp.com",
  projectId: "fir-3567d",
  storageBucket: "fir-3567d.firebasestorage.app",
  messagingSenderId: "38636565861",
  appId: "1:38636565861:web:c892bd27595f4a1412dd8c",
  measurementId: "G-BRWP9VJ4FF"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
