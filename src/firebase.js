// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVtIxv1kt114VL8dZzxepwLHvRU9TQwrA",
  authDomain: "chemet-smes.firebaseapp.com",
  projectId: "chemet-smes",
  storageBucket: "chemet-smes.firebasestorage.app",
  messagingSenderId: "922591837992",
  appId: "1:922591837992:web:129b185a920e573d331a1d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };

