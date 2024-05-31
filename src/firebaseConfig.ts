import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const apiKey = import.meta.env.FIREBASE_API_KEY;
const authDomain = import.meta.env.FIREBASE_AUTH_DOMAIN;
const databaseURL = import.meta.env.FIREBASE_DATABASE_URL;
const projectId = import.meta.env.FIREBASE_PROJECT_ID;
const storageBucket = import.meta.env.FIREBASE_STORAGE_BUCKET;
const messagingSenderId = import.meta.env.FIREBASE_MESSAGING_SENDER_ID;
const appId = import.meta.env.FIREBASE_APP_ID;
const measurementId = import.meta.env.FIREBASE_MEASUREMENT_ID;

const firebaseConfig = {
  apiKey,
  authDomain,
  databaseURL,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

