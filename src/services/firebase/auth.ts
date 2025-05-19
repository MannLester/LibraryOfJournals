import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  browserSessionPersistence,
  browserLocalPersistence,
  setPersistence
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from './config';

// Create a Google auth provider
const googleProvider = new GoogleAuthProvider();

/**
 * Sign in with Google popup (with local persistence - remembers user)
 * @returns Promise with user credentials
 */
export const signInWithGoogle = async () => {
  try {
    // Use local persistence which remembers the user even when browser is closed
    await setPersistence(auth, browserLocalPersistence);
    
    // Use the regular provider WITHOUT the force account selection
    // This allows Google to remember the previously selected account
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

/**
 * Force a complete logout and clear all Firebase auth data
 */
const forceCompleteLogout = async () => {
  try {
    console.log('Force complete logout: starting');
    
    // First sign out from Firebase
    if (auth.currentUser) {
      console.log('Signing out current user');
      await signOut(auth);
    }
    
    // Clear ALL Firebase auth data from storage
    for (const key of Object.keys(localStorage)) {
      if (key.includes('firebase')) {
        console.log('Clearing localStorage:', key);
        localStorage.removeItem(key);
      }
    }
    
    for (const key of Object.keys(sessionStorage)) {
      if (key.includes('firebase')) {
        console.log('Clearing sessionStorage:', key);
        sessionStorage.removeItem(key);
      }
    }
    
    // Clear any Firebase cookies
    document.cookie.split(';').forEach(cookie => {
      const trimmed = cookie.trim();
      if (trimmed.includes('firebase')) {
        const name = trimmed.split('=')[0];
        console.log('Clearing cookie:', name);
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    });
    
    // Set new auth instance (this is key to forcing a complete reset)
    console.log('Logout complete');
  } catch (error) {
    console.error('Error during force logout:', error);
  }
};

/**
 * Sign up with Google - truly forcing a fresh signup regardless of current session
 * @returns Promise with user credentials
 */
export const signUpWithGoogle = async () => {
  try {
    console.log('Signup: Starting true fresh signup flow');
    
    // Force a complete logout
    await forceCompleteLogout();
    
    // Create a completely new provider with prompt='select_account' 
    // to force Google to show the account picker every time
    const freshProvider = new GoogleAuthProvider();
    freshProvider.setCustomParameters({ prompt: 'select_account' });
    
    console.log('Signup: Opening fresh Google auth popup');
    const result = await signInWithPopup(auth, freshProvider);
    console.log('Signup: Success with account', result.user?.email);
    
    return result;
  } catch (error) {
    console.error("Error during fresh signup:", error);
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
