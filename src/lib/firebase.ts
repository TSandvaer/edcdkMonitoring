import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAexaCtdSrmeKY7NoLXW0tvGcE3_nsKz0M",
  authDomain: "edcdk-dashboard.firebaseapp.com",
  projectId: "edcdk-dashboard",
  storageBucket: "edcdk-dashboard.firebasestorage.app",
  messagingSenderId: "24945936797",
  appId: "1:24945936797:web:0208366644fa28b1360774"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
