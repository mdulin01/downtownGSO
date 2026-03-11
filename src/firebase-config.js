import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDErv6ROFNJzzaPRttN2hsQeS50ClNCgYw",
  authDomain: "downtowngso-20d9c.firebaseapp.com",
  projectId: "downtowngso-20d9c",
  storageBucket: "downtowngso-20d9c.firebasestorage.app",
  messagingSenderId: "545495310166",
  appId: "1:545495310166:web:805aaaa1aef9a010b300f7",
  measurementId: "G-XX7SQH831R"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
