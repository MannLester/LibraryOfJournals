import { ref, onMounted, onUnmounted } from 'vue';
import type { User } from 'firebase/auth';
import { 
  initAuthService, 
  getAuthState, 
  signIn, 
  signOut 
} from '../services/auth/authService';
import type { AccountData } from '../services/firebase/firestore';

export default function useAuth() {
  const user = ref<User | null>(null);
  const account = ref<AccountData | null>(null);
  const isAuthenticated = ref(false);
  const isLoading = ref(true);
  
  let unsubscribe: (() => void) | null = null;
  
  // Initialize auth service
  onMounted(() => {
    isLoading.value = true;
    
    unsubscribe = initAuthService((newUser, newAccount) => {
      user.value = newUser;
      account.value = newAccount;
      isAuthenticated.value = !!newUser;
      isLoading.value = false;
    });
    
    // Get initial state
    const initialState = getAuthState();
    user.value = initialState.user;
    account.value = initialState.account;
    isAuthenticated.value = initialState.isAuthenticated;
  });
  
  // Clean up on component unmount
  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe();
    }
  });
  
  // Auth methods
  const login = async () => {
    try {
      isLoading.value = true;
      await signIn();
      return true;
    } catch (error) {
      console.error('Login error:', error);
      isLoading.value = false;
      throw error;
    }
  };
  
  const logout = async () => {
    try {
      isLoading.value = true;
      await signOut();
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      isLoading.value = false;
      throw error;
    }
  };
  
  return {
    user,
    account,
    isAuthenticated,
    isLoading,
    login,
    logout
  };
}
