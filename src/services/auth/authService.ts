// Import User type correctly
import type { User } from 'firebase/auth';
import { 
  signInWithGoogle, 
  signUpWithGoogle, 
  logOut, 
  getCurrentUser, 
  onAuthStateChange 
} from '../firebase/auth';
import { 
  createOrUpdateAccount,
  getAccount,
  type AccountData
} from '../firebase/firestore';

// State for current user
let currentUser: User | null = null;
let currentAccount: AccountData | null = null;

/**
 * Initialize the auth service and listen for auth state changes
 * This should be called when the app starts
 * @param onAuthChange Optional callback for auth state changes
 */
export const initAuthService = (
  onAuthChange?: (user: User | null, account: AccountData | null) => void
) => {
  // Listen for auth state changes
  const unsubscribe = onAuthStateChange(async (user) => {
    currentUser = user;
    
    if (user) {
      // User is signed in, get or create account
      try {
        currentAccount = await createOrUpdateAccount(user);
      } catch (error) {
        console.error('Error handling user account:', error);
        currentAccount = null;
      }
    } else {
      // User is signed out
      currentAccount = null;
    }
    
    // Call callback if provided
    if (onAuthChange) {
      onAuthChange(currentUser, currentAccount);
    }
  });
  
  return unsubscribe;
};

/**
 * Get the current authenticated user and account
 */
export const getAuthState = () => {
  return {
    user: currentUser,
    account: currentAccount,
    isAuthenticated: !!currentUser
  };
};

/**
 * Sign in with Google (with persistence)
 * This will trigger the auth state change listener
 */
export const signIn = async () => {
  try {
    const result = await signInWithGoogle();
    return result;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

/**
 * Sign up with Google (without persistence - won't remember between sessions)
 * This will trigger the auth state change listener
 */
export const signUp = async () => {
  try {
    const result = await signUpWithGoogle();
    return result;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

/**
 * Sign out the current user
 * This will trigger the auth state change listener
 */
export const signOut = async () => {
  try {
    await logOut();
    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};
