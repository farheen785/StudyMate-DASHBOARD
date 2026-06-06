import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCu91LtnaowP5jQuLySFFxPjYPpJa_f2xs",
  authDomain: "studymateauth-ef33d.firebaseapp.com",
  projectId: "studymateauth-ef33d",
  storageBucket: "studymateauth-ef33d.firebasestorage.app",
  messagingSenderId: "437449737949",
  appId: "1:437449737949:web:1cc471f5b5f62e3f43fd34",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);