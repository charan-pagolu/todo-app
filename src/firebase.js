
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';;

const firebaseConfig = {
  apiKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "todo-app-1512b.firebaseapp.com",
  projectId: "todo-app-1512b",
  storageBucket: "todo-app-1512b.firebasestorage.app",
  messagingSenderId: "270741818410",
  appId: "1:270741818410:web:37478cde26b98f571ac753",
  measurementId: "G-NCMJEKV50F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }; // Export the Firestore database 