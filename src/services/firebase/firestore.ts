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

// ======================
// Type Definitions
// ======================

export interface AccountData {
  // Core user data
  uid: string;
  email: string;
  username: string;
  imageLink: string;
  dateJoined: any;
  
  // Sync status
  lastSynced?: any;
  syncStatus?: 'online' | 'offline' | 'syncing' | 'error';
  
  // Storage management
  storageQuota: {
    used: number;  // in bytes
    max: number;   // in bytes (e.g., 1GB = 1_073_741_824)
  };
}

export interface JournalData {
  // Core journal data
  id?: string;  // Added by Firestore
  userId: string;
  title: string;
  description: string;
  coverImage?: string;  // URL to cover image
  backImage?: string;   // URL to back cover image
  
  // Timestamps
  createdAt: any;
  updatedAt: any;
  
  // Status
  isArchived: boolean;
  wordCount: number;  // Aggregated from chapters
  
  // Sharing
  publicLink?: string;    // For public access
  sharedLink?: string;    // For private sharing
  invitedUsers: string[]; // Array of user IDs
  
  // Versioning
  version: number;
  isDeleted: boolean;  // Soft delete flag
}

export interface ChapterData {
  // Core chapter data
  id?: string;  // Added by Firestore
  journalId: string;
  chapterTitle: string;
  chapterOrder: number;
  
  // Content
  pdfPath: string;  // Path in storage (e.g., 'users/{uid}/chapters/{chapterId}.pdf')
  
  // Metadata
  wordCount: number;
  updatedAt: any;
  
  // Versioning
  version: number;
  isDeleted: boolean;  // Soft delete flag
}

// Collection references (for future use)
const _journalsCollection = collection(db, 'journals');
const _getChaptersCollection = (journalId: string) => 
  collection(db, `journals/${journalId}/channels`);

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
      dateJoined: existingAccount ? existingAccount.dateJoined : serverTimestamp(),
      // Initialize storage quota (1GB default)
      storageQuota: {
        used: 0,
        max: 1_073_741_824 // 1GB in bytes
      }
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
