import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, onAuthStateChanged, type User, type Auth } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, limit, type Firestore } from 'firebase/firestore';

const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || '',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: env.VITE_FIREBASE_APP_ID || '',
};

function hasFirebaseConfig(config: typeof firebaseConfig) {
  return Boolean(config.apiKey && config.authDomain && config.projectId && config.appId);
}

let app: ReturnType<typeof initializeApp> | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (hasFirebaseConfig(firebaseConfig)) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });
} else {
  console.warn('Firebase is not configured. Add VITE_FIREBASE_* values to your environment to enable authentication.');
}

export const isFirebaseConfigured = Boolean(app && auth && db && googleProvider);

export function getFirebaseAuth() {
  if (!auth) {
    throw new Error('Firebase authentication is not configured. Add your Firebase credentials to the environment.');
  }
  return auth;
}

export function getFirebaseDb() {
  if (!db) {
    throw new Error('Firebase Firestore is not configured. Add your Firebase credentials to the environment.');
  }
  return db;
}

export function getGoogleProvider() {
  if (!googleProvider) {
    throw new Error('Firebase authentication is not configured. Add your Firebase credentials to the environment.');
  }
  return googleProvider;
}

export async function signUpWithEmail(email: string, password: string, name: string) {
  const authInstance = getFirebaseAuth();
  const dbInstance = getFirebaseDb();
  const credential = await createUserWithEmailAndPassword(authInstance, email, password);
  await addDoc(collection(dbInstance, 'users'), {
    uid: credential.user.uid,
    name,
    email: credential.user.email,
    createdAt: new Date().toISOString(),
  });
  return credential.user;
}

export async function signInWithEmailPassword(email: string, password: string) {
  const authInstance = getFirebaseAuth();
  const credential = await signInWithEmailAndPassword(authInstance, email, password);
  return credential.user;
}

export async function signInWithGoogle() {
  const authInstance = getFirebaseAuth();
  const dbInstance = getFirebaseDb();
  const provider = getGoogleProvider();
  const credential = await signInWithPopup(authInstance, provider);
  const user = credential.user;
  const usersRef = collection(dbInstance, 'users');
  const existing = await getDocs(query(usersRef, where('uid', '==', user.uid), limit(1)));
  if (existing.empty) {
    await addDoc(usersRef, {
      uid: user.uid,
      name: user.displayName || 'Weather User',
      email: user.email,
      createdAt: new Date().toISOString(),
    });
  }
  return user;
}

export async function logOut() {
  const authInstance = getFirebaseAuth();
  await signOut(authInstance);
}

export function observeAuth(callback: (user: User | null) => void) {
  const authInstance = getFirebaseAuth();
  return onAuthStateChanged(authInstance, callback);
}

export async function saveUserHistory(uid: string, location: string) {
  const dbInstance = getFirebaseDb();
  await addDoc(collection(dbInstance, 'history'), {
    uid,
    location,
    createdAt: new Date().toISOString(),
  });
}

export async function fetchUserHistory(uid: string) {
  const dbInstance = getFirebaseDb();
  const q = query(collection(dbInstance, 'history'), where('uid', '==', uid), orderBy('createdAt', 'desc'), limit(8));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as { location: string }) }));
}
