import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from './config';

// Create a Google auth provider
const googleProvider = new GoogleAuthProvider();

/**
 * Sign in with Google popup
 * @returns Promise with user credentials
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

/**
 * Sign out the current user
 */
export const logOut = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Subscribe to auth state changes
 * @param callback Function to call when auth state changes
 * @returns Unsubscribe function
 */
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
