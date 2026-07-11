import { auth, db, logOut, saveUserHistory, signInWithEmailPassword, signInWithGoogle, signUpWithEmail, fetchUserHistory } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export async function registerUser(name: string, email: string, password: string): Promise<{ user: AuthUser }> {
  const firebaseUser = await signUpWithEmail(email, password, name);
  return { user: { id: firebaseUser.uid, name: firebaseUser.displayName || name, email: firebaseUser.email || email } };
}

export async function loginUser(email: string, password: string): Promise<{ user: AuthUser }> {
  const firebaseUser = await signInWithEmailPassword(email, password);
  return { user: { id: firebaseUser.uid, name: firebaseUser.displayName || 'Weather User', email: firebaseUser.email || email } };
}

export async function loginWithGoogle(): Promise<{ user: AuthUser }> {
  const firebaseUser = await signInWithGoogle();
  return { user: { id: firebaseUser.uid, name: firebaseUser.displayName || 'Weather User', email: firebaseUser.email || '' } };
}

export async function fetchMe(): Promise<{ user: AuthUser }> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('No authenticated user');
  }
  return { user: { id: currentUser.uid, name: currentUser.displayName || 'Weather User', email: currentUser.email || '' } };
}

export async function saveHistory(location: string): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('User not authenticated');
  }
  await saveUserHistory(currentUser.uid, location);
}

export async function fetchHistory(uid: string): Promise<{ history: string[] }> {
  const history = await fetchUserHistory(uid);
  return { history: history.map((item) => item.location) };
}

export async function logoutUser(): Promise<void> {
  await logOut();
}

export async function fetchUserProfile(uid: string): Promise<AuthUser | null> {
  const q = query(collection(db, 'users'), where('uid', '==', uid));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const profile = snapshot.docs[0].data();
  return { id: profile.uid as string, name: (profile.name as string) || 'Weather User', email: (profile.email as string) || '' };
}
