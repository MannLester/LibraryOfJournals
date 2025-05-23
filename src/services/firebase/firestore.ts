import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { db } from './config';

// Collection references
const accountsCollection = collection(db, 'accounts');

// Type for account data
export interface AccountData {
  uid: string;
  email: string;
  username: string;
  imageLink: string;
  dateJoined: any; // Using 'any' for server timestamp type
}

/**
 * Get a user account by uid
 * @param uid User ID
 * @returns Promise with account data
 */
export const getAccount = async (uid: string): Promise<AccountData | null> => {
  try {
    const accountRef = doc(accountsCollection, uid);
    const accountSnap = await getDoc(accountRef);
    
    if (accountSnap.exists()) {
      return accountSnap.data() as AccountData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting account:", error);
    throw error;
  }
};

// Using UI Avatars to generate profile images based on username

/**
 * Create or update a user account
 * @param user Firebase Auth user
 * @returns Promise with account data
 */
export const createOrUpdateAccount = async (user: User): Promise<AccountData> => {
  try {
    const { uid, email, displayName, photoURL } = user;
    
    console.log('Creating/updating account for user:', { uid, email, displayName });
    console.log('Profile URL from Google:', photoURL);
    
    if (!email) {
      throw new Error("User email is required");
    }
    
    // Check if account already exists
    const existingAccount = await getAccount(uid);
    console.log('Existing account:', existingAccount);
    
    // Get username from display name or email
    const username = displayName || email.split('@')[0];
    
    // USE THE GOOGLE PROFILE PICTURE URL directly
    const imageLink = photoURL || '';
    console.log('Using Google profile image link:', imageLink);
    
    // Account data to save
    const accountData: AccountData = {
      uid,
      email,
      username,
      imageLink,
      // Only set dateJoined for new accounts
      dateJoined: existingAccount ? existingAccount.dateJoined : serverTimestamp()
    };
    
    // Save to Firestore
    const accountRef = doc(accountsCollection, uid);
    await setDoc(accountRef, accountData, { merge: true });
    
    return accountData;
  } catch (error) {
    console.error("Error creating/updating account:", error);
    throw error;
  }
};
