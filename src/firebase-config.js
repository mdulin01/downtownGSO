import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC5mOkljbkSMCMhRf-jrJ7TIpkESMTcxHY",
  authDomain: "mikedulinmd-cf65b.firebaseapp.com",
  projectId: "mikedulinmd-cf65b",
  storageBucket: "mikedulinmd-cf65b.firebasestorage.app",
  messagingSenderId: "714928483011",
  appId: "1:714928483011:web:dd1b266d77c6042c6f5076",
  measurementId: "G-TCW130CK2R"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
