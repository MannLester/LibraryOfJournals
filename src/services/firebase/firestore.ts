import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { db } from './config';

// Collection references
const accountsCollection = collection(db, 'accounts');
const journalsCollection = collection(db, 'journals');

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

// Helper collection references
const getChaptersCollection = (journalId: string) => 
  collection(db, `journals/${journalId}/chapters`);


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
/**
 * Create a default journal for a user
 * @param userId User ID to create the journal for
 * @returns Promise with the created journal data
 */
export const createDefaultJournal = async (userId: string): Promise<JournalData> => {
  try {
    console.log('Creating default journal for user:', userId);
    
    // Check if user already has a journal
    const userJournalsQuery = query(journalsCollection, where('userId', '==', userId));
    const existingJournals = await getDocs(userJournalsQuery);
    
    if (!existingJournals.empty) {
      console.log('User already has journals, skipping default journal creation');
      return existingJournals.docs[0].data() as JournalData;
    }
    
    // Create a new journal document with a generated ID
    const journalRef = doc(journalsCollection);
    const journalId = journalRef.id;
    
    const journalData: JournalData = {
      id: journalId,
      userId: userId,
      title: 'My Journal',
      description: 'My first journal',
      backImage: '',
      coverImage: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isArchived: false,
      isDeleted: false,
      publicLink: '',
      sharedLink: '',
      invitedUsers: [],
      version: 1,
      wordCount: 0
    };
    
    // Save to Firestore
    await setDoc(journalRef, journalData);
    console.log('Default journal created with ID:', journalId);
    
    return journalData;
  } catch (error) {
    console.error('Error creating default journal:', error);
    throw error;
  }
};

/**
 * Get journals for a user
 * @param userId User ID
 * @returns Promise with array of journal data
 */
export const getUserJournals = async (userId: string): Promise<JournalData[]> => {
  try {
    const userJournalsQuery = query(
      journalsCollection, 
      where('userId', '==', userId),
      where('isDeleted', '==', false)
    );
    
    const journalsSnapshot = await getDocs(userJournalsQuery);
    const journals: JournalData[] = [];
    
    journalsSnapshot.forEach((doc) => {
      journals.push({ ...doc.data(), id: doc.id } as JournalData);
    });
    
    return journals;
  } catch (error) {
    console.error('Error getting user journals:', error);
    throw error;
  }
};

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
    
    // If this is a new account, create a default journal
    if (!existingAccount) {
      console.log('New account detected, creating default journal');
      await createDefaultJournal(uid);
    }
    
    return accountData;
  } catch (error) {
    console.error("Error creating/updating account:", error);
    throw error;
  }
};
