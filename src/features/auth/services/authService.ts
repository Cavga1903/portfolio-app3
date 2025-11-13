import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../../lib/firebase/config';
import { User } from '../../../app/store/authStore';
import apiClient from '../../../api/client';
import { endpoints } from '../../../api/endpoints';

export interface LoginResponse {
  user: User;
  token: string;
}

export interface SignupResponse {
  user: User;
  token: string;
}

// Convert Firebase User to App User
const firebaseUserToAppUser = async (firebaseUser: FirebaseUser): Promise<User> => {
  // Get user data from Firestore
  const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
  const userData = userDoc.data();
  
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    name: userData?.name || firebaseUser.displayName || 'User',
    role: userData?.role || 'user',
    avatar: userData?.avatar || firebaseUser.photoURL,
  };
};

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      // Try Firebase Auth first
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const appUser = await firebaseUserToAppUser(firebaseUser);
      const token = await firebaseUser.getIdToken();
      
      return {
        user: appUser,
        token,
      };
    } catch (error) {
      console.error('Firebase login failed, trying API fallback:', error);
      // Fallback to API
      try {
        const response = await apiClient.post<LoginResponse>(endpoints.auth.login, {
          email,
          password,
        });
        return response.data;
      } catch (apiError) {
        console.error('API login also failed:', apiError);
        throw error;
      }
    }
  },

  signup: async (
    email: string,
    password: string,
    name: string
  ): Promise<SignupResponse> => {
    try {
      // Try Firebase Auth first
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        name,
        email,
        role: 'user',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      const appUser = await firebaseUserToAppUser(firebaseUser);
      const token = await firebaseUser.getIdToken();
      
      return {
        user: appUser,
        token,
      };
    } catch (error) {
      console.error('Firebase signup failed, trying API fallback:', error);
      // Fallback to API
      try {
        const response = await apiClient.post<SignupResponse>(endpoints.auth.signup, {
          email,
          password,
          name,
        });
        return response.data;
      } catch (apiError) {
        console.error('API signup also failed:', apiError);
        throw error;
      }
    }
  },

  logout: async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Firebase logout failed, trying API fallback:', error);
      // Fallback to API
      try {
        await apiClient.post(endpoints.auth.logout);
      } catch (apiError) {
        console.error('API logout also failed:', apiError);
        throw error;
      }
    }
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      // Get current Firebase user
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        throw new Error('No user logged in');
      }
      return await firebaseUserToAppUser(firebaseUser);
    } catch (error) {
      console.error('Firebase getCurrentUser failed, trying API fallback:', error);
      // Fallback to API
      try {
        const response = await apiClient.get<User>(endpoints.auth.me);
        return response.data;
      } catch (apiError) {
        console.error('API getCurrentUser also failed:', apiError);
        throw error;
      }
    }
  },

  refreshToken: async (): Promise<{ token: string }> => {
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        throw new Error('No user logged in');
      }
      const token = await firebaseUser.getIdToken(true); // Force refresh
      return { token };
    } catch (error) {
      console.error('Firebase refreshToken failed, trying API fallback:', error);
      // Fallback to API
      try {
        const response = await apiClient.post<{ token: string }>(endpoints.auth.refresh);
        return response.data;
      } catch (apiError) {
        console.error('API refreshToken also failed:', apiError);
        throw error;
      }
    }
  },

  // Google Sign-In
  loginWithGoogle: async (): Promise<LoginResponse> => {
    try {
      const provider = new GoogleAuthProvider();
      // Add scopes if needed
      provider.addScope('profile');
      provider.addScope('email');
      
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      
      // Check if user document exists, if not create it
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          role: 'user',
          avatar: firebaseUser.photoURL,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      
      const appUser = await firebaseUserToAppUser(firebaseUser);
      const token = await firebaseUser.getIdToken();
      
      return {
        user: appUser,
        token,
      };
    } catch (error) {
      console.error('Google login failed:', error);
      // Handle specific Firebase errors
      if (error && typeof error === 'object' && 'code' in error) {
        const firebaseError = error as { code: string; message?: string };
        
        if (firebaseError.code === 'auth/configuration-not-found') {
          throw new Error(
            'Firebase Auth yapılandırması bulunamadı. ' +
            'Lütfen Firebase Console\'da Google Authentication provider\'ını aktifleştirin. ' +
            'Detaylar için FIREBASE_AUTH_CONFIGURATION_FIX.md dosyasına bakın.'
          );
        }
        
        if (firebaseError.code === 'auth/popup-closed-by-user') {
          throw new Error('Popup kapatıldı. Lütfen tekrar deneyin.');
        }
        
        if (firebaseError.code === 'auth/cancelled-popup-request') {
          throw new Error('Aynı anda sadece bir popup açılabilir. Lütfen bekleyin.');
        }
        
        if (firebaseError.code === 'auth/popup-blocked') {
          throw new Error('Popup engellendi. Lütfen tarayıcı ayarlarından popup\'ları izin verin.');
        }
        
        if (firebaseError.code === 'auth/unauthorized-domain') {
          throw new Error(
            'Bu domain yetkilendirilmemiş. ' +
            'Firebase Console > Authentication > Settings > Authorized domains\'e domain\'i ekleyin.'
          );
        }
        
        if (firebaseError.message) {
          throw new Error(firebaseError.message);
        }
      }
      throw error instanceof Error ? error : new Error('Google ile giriş başarısız');
    }
  },

  // Listen to auth state changes
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const appUser = await firebaseUserToAppUser(firebaseUser);
          callback(appUser);
        } catch (error) {
          console.error('Error converting Firebase user:', error);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  },
};

