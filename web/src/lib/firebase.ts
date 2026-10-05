import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA_rKe6FSLAyAQwVpUTx3ErMNyWwZXLPVA",
  authDomain: "regmi-kirana.firebaseapp.com",
  projectId: "regmi-kirana",
  storageBucket: "regmi-kirana.firebasestorage.app",
  messagingSenderId: "208799882462",
  appId: "1:208799882462:web:6833b93373a3d287f4f64f",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
