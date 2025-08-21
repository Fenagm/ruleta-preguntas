// firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, deleteDoc, doc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Generate a session ID for anonymous users
export const getSessionId = () => {
  let sessionId = localStorage.getItem('conversation_game_session');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('conversation_game_session', sessionId);
  }
  return sessionId;
};

export type CustomQuestion = {
  id: string;
  question: string;
  category: string;
  created_at: Date;
  user_id?: string;
  session_id?: string;
};

// Initialize anonymous authentication
export const initAuth = async () => {
  try {
    await signInAnonymously(auth);
  } catch (error) {
    console.error('Error with anonymous auth:', error);
  }
};