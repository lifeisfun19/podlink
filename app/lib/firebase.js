import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, confirmPasswordReset } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAU4QHy3O9K7idz0-wdfPaJiN1GuGNwjZs",
    authDomain: "podlink-aab94.firebaseapp.com",
    projectId: "podlink-aab94",
    storageBucket: "podlink-aab94.appspot.com",  // ✅ Fixed
    messagingSenderId: "613356233316",
    appId: "1:613356233316:web:2afbbdbe599bf98207f571",
    measurementId: "G-8NPZ1W59HL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Export methods
export { auth, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, confirmPasswordReset };
