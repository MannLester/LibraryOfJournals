import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  query, 
  where, 
  serverTimestamp,
  updateDoc,
  arrayUnion
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
  journalId?: string;  // Reference to user's default journal
  
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
  chapterPages: string[];  // Array of chapter document IDs
  
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
  id?: string;        // Document ID
  journalId: string;  // Parent journal ID
  chapterTitle: string; // Chapter title
  chapterOrder: number; // Order in the journal
  pdfPath: string;    // Path to PDF in storage
  wordCount: number;  // Word count
  
  // Metadata
  updatedAt: any;     // Timestamp
  version: number;    // Version number
  
  // Status
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
      chapterPages: [],  // Initialize with empty array of chapter IDs
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
    
    // Update account with journal ID
    const accountRef = doc(accountsCollection, userId);
    await setDoc(accountRef, { journalId }, { merge: true });
    
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

/**
 * Create a new chapter document in Firestore
 * @param journalId Journal ID that the chapter belongs to
 * @param chapterId Chapter ID (can be generated or provided)
 * @param chapterData Chapter data to save
 * @returns Promise with the created chapter data
 */
export const createChapter = async (
  journalId: string,
  chapterId: string,
  chapterData: Partial<ChapterData>
): Promise<ChapterData> => {
  try {
    console.log('Creating chapter document:', { journalId, chapterId });
    
    // Get the chapters collection for this journal
    const chaptersCollection = getChaptersCollection(journalId);
    
    // Create a new document reference with the provided ID
    const chapterRef = doc(chaptersCollection, chapterId);
    
    // Prepare the complete chapter data
    const completeChapterData: ChapterData = {
      id: chapterId,
      journalId: journalId,
      chapterTitle: chapterData.chapterTitle || 'New Chapter',
      chapterOrder: chapterData.chapterOrder || 1,
      pdfPath: chapterData.pdfPath || '',
      wordCount: chapterData.wordCount || 0,
      updatedAt: serverTimestamp(),
      version: 1,
      isDeleted: false
    };
    
    // Save to Firestore
    await setDoc(chapterRef, completeChapterData);
    console.log('Chapter created with ID:', chapterId);
    
    return completeChapterData;
  } catch (error) {
    console.error('Error creating chapter:', error);
    throw error;
  }
};

/**
 * Update a journal's chapterPages array to include a chapter ID
 * @param journalId Journal ID to update
 * @param chapterId Chapter ID to add to the journal
 * @returns Promise that resolves when the update is complete
 */
export const updateJournalChapters = async (
  journalId: string,
  chapterId: string
): Promise<void> => {
  try {
    console.log('Updating journal chapters array:', { journalId, chapterId });
    
    // Get reference to the journal document
    const journalRef = doc(journalsCollection, journalId);
    
    // Update the journal document to add the chapter ID to the chapterPages array
    await updateDoc(journalRef, {
      chapterPages: arrayUnion(chapterId),
      updatedAt: serverTimestamp()
    });
    
    console.log('Journal updated with new chapter ID');
  } catch (error) {
    console.error('Error updating journal chapters:', error);
    throw error;
  }
};

/**
 * Get all chapters for a journal
 * @param journalId Journal ID to get chapters for
 * @returns Promise with array of chapter data
 */
export const getJournalChapters = async (journalId: string): Promise<ChapterData[]> => {
  try {
    console.log('Getting chapters for journal:', journalId);
    
    // Get the chapters collection for this journal
    const chaptersCollection = getChaptersCollection(journalId);
    
    // Query for non-deleted chapters
    const chaptersQuery = query(chaptersCollection, where('isDeleted', '==', false));
    const chaptersSnapshot = await getDocs(chaptersQuery);
    
    const chapters: ChapterData[] = [];
    chaptersSnapshot.forEach((doc) => {
      chapters.push({ ...doc.data(), id: doc.id } as ChapterData);
    });
    
    // Sort chapters by chapterOrder
    chapters.sort((a, b) => (a.chapterOrder || 0) - (b.chapterOrder || 0));
    
    console.log(`Found ${chapters.length} chapters for journal ${journalId}`);
    return chapters;
  } catch (error) {
    console.error('Error getting journal chapters:', error);
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
      const defaultJournal = await createDefaultJournal(uid);
      
      // Update the account with the journal ID
      if (defaultJournal && defaultJournal.id) {
        await setDoc(accountRef, { journalId: defaultJournal.id }, { merge: true });
        accountData.journalId = defaultJournal.id;
        console.log('Updated account with default journal ID:', defaultJournal.id);
      }
    }
    
    return accountData;
  } catch (error) {
    console.error("Error creating/updating account:", error);
    throw error;
  }
};
