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
import { z } from 'zod';
import { auth, db } from '../../../lib/firebase/config';
import apiClient from '../../../api/client';
import { endpoints } from '../../../api/endpoints';
import {
  UserSchema,
  User,
  LoginRequestSchema,
  SignupRequestSchema,
  AuthResponseSchema,
  type AuthResponse,
} from '../../shared/schemas';

// Re-export for backward compatibility
export type LoginResponse = AuthResponse;
export type SignupResponse = AuthResponse;

/**
 * Firebase Error Schema
 * Type-safe error handling for Firebase Auth errors
 */
const FirebaseErrorSchema = z.object({
  code: z.string(),
  message: z.string().optional(),
});

/**
 * Convert Firebase User to App User
 * Validates output with UserSchema to ensure type safety
 */
const firebaseUserToAppUser = async (firebaseUser: FirebaseUser): Promise<User> => {
  // Get user data from Firestore
  const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
  const userData = userDoc.data();
  
  const user = {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    name: userData?.name || firebaseUser.displayName || 'User',
    role: (userData?.role || 'user') as 'admin' | 'user',
    avatar: userData?.avatar || firebaseUser.photoURL,
  };
  
  // ✅ VALIDATE OUTPUT WITH ZOD
  return UserSchema.parse(user);
};

// Allowed email domain
const ALLOWED_DOMAIN = '@cavgalabs.com';

// Check if email domain is allowed
const isEmailDomainAllowed = (email: string): boolean => {
  return email.toLowerCase().endsWith(ALLOWED_DOMAIN);
};

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      // ✅ VALIDATE INPUT WITH ZOD
      const validatedInput = LoginRequestSchema.parse({ email, password });

      // Try Firebase Auth first
      const userCredential = await signInWithEmailAndPassword(
        auth,
        validatedInput.email,
        validatedInput.password
      );
      const firebaseUser = userCredential.user;
      const appUser = await firebaseUserToAppUser(firebaseUser);
      const token = await firebaseUser.getIdToken();
      
      // ✅ VALIDATE OUTPUT WITH ZOD
      const response = AuthResponseSchema.parse({
        user: appUser,
        token,
      });
      
      return response;
    } catch (error) {
      console.error('Firebase login failed:', error);
      
      // ✅ TYPE-SAFE ERROR HANDLING
      if (error instanceof z.ZodError) {
        // Input validation error
        throw new Error(`Geçersiz giriş bilgileri: ${error.errors.map(e => e.message).join(', ')}`);
      }
      
      // Handle Firebase errors with type-safe parsing
      const parseResult = FirebaseErrorSchema.safeParse(error);
      if (parseResult.success) {
        const firebaseError = parseResult.data;
        
        if (firebaseError.code === 'auth/invalid-email') {
          throw new Error('Geçersiz e-posta adresi. Lütfen doğru bir e-posta adresi giriniz.');
        }
        
        if (firebaseError.code === 'auth/user-disabled') {
          throw new Error('Bu kullanıcı hesabı devre dışı bırakılmış. Lütfen yönetici ile iletişime geçin.');
        }
        
        if (firebaseError.code === 'auth/user-not-found') {
          throw new Error('Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı. Lütfen önce kayıt olun.');
        }
        
        if (firebaseError.code === 'auth/wrong-password') {
          throw new Error('Şifre yanlış. Lütfen tekrar deneyin.');
        }
        
        if (firebaseError.code === 'auth/invalid-credential' || firebaseError.code === 'auth/invalid-login-credentials') {
          throw new Error('E-posta veya şifre yanlış. Lütfen bilgilerinizi kontrol edin.');
        }
        
        if (firebaseError.code === 'auth/too-many-requests') {
          throw new Error('Çok fazla başarısız deneme. Lütfen bir süre sonra tekrar deneyin.');
        }
        
        if (firebaseError.message) {
          throw new Error(firebaseError.message);
        }
      }
      
      // Fallback to API
      try {
        const response = await apiClient.post(endpoints.auth.login, {
          email,
          password,
        });
        
        // ✅ VALIDATE API RESPONSE
        return AuthResponseSchema.parse(response.data);
      } catch (apiError) {
        console.error('API login also failed:', apiError);
        throw error instanceof Error ? error : new Error('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
      }
    }
  },

  signup: async (
    email: string,
    password: string,
    name: string
  ): Promise<AuthResponse> => {
    try {
      // ✅ VALIDATE INPUT WITH ZOD
      const validatedInput = SignupRequestSchema.parse({ email, password, name });

      // Try Firebase Auth first
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        validatedInput.email,
        validatedInput.password
      );
      const firebaseUser = userCredential.user;
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        name: validatedInput.name,
        email: validatedInput.email,
        role: 'user',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      const appUser = await firebaseUserToAppUser(firebaseUser);
      const token = await firebaseUser.getIdToken();
      
      // ✅ VALIDATE OUTPUT WITH ZOD
      const response = AuthResponseSchema.parse({
        user: appUser,
        token,
      });
      
      return response;
    } catch (error) {
      console.error('Firebase signup failed:', error);
      
      // ✅ TYPE-SAFE ERROR HANDLING
      if (error instanceof z.ZodError) {
        // Input validation error
        throw new Error(`Geçersiz kayıt bilgileri: ${error.errors.map(e => e.message).join(', ')}`);
      }
      
      // Handle Firebase errors with type-safe parsing
      const parseResult = FirebaseErrorSchema.safeParse(error);
      if (parseResult.success) {
        const firebaseError = parseResult.data;
        
        if (firebaseError.code === 'auth/email-already-in-use') {
          throw new Error('Bu e-posta adresi zaten kullanılıyor. Lütfen giriş yapın veya farklı bir e-posta adresi kullanın.');
        }
        
        if (firebaseError.code === 'auth/invalid-email') {
          throw new Error('Geçersiz e-posta adresi. Lütfen doğru bir e-posta adresi giriniz.');
        }
        
        if (firebaseError.code === 'auth/weak-password') {
          throw new Error('Şifre çok zayıf. Lütfen en az 6 karakter içeren daha güçlü bir şifre kullanın.');
        }
        
        if (firebaseError.code === 'auth/operation-not-allowed') {
          throw new Error('E-posta/şifre ile kayıt olma özelliği devre dışı bırakılmış. Lütfen yönetici ile iletişime geçin.');
        }
        
        if (firebaseError.message) {
          throw new Error(firebaseError.message);
        }
      }
      
      // Fallback to API
      try {
        const response = await apiClient.post(endpoints.auth.signup, {
          email,
          password,
          name,
        });
        
        // ✅ VALIDATE API RESPONSE
        return AuthResponseSchema.parse(response.data);
      } catch (apiError) {
        console.error('API signup also failed:', apiError);
        throw error instanceof Error ? error : new Error('Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.');
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
      // ✅ Already validated in firebaseUserToAppUser
      return await firebaseUserToAppUser(firebaseUser);
    } catch (error) {
      console.error('Firebase getCurrentUser failed, trying API fallback:', error);
      // Fallback to API
      try {
        const response = await apiClient.get(endpoints.auth.me);
        // ✅ VALIDATE API RESPONSE
        return UserSchema.parse(response.data);
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
  loginWithGoogle: async (): Promise<AuthResponse> => {
    try {
      const provider = new GoogleAuthProvider();
      // Add scopes if needed
      provider.addScope('profile');
      provider.addScope('email');
      
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      
      // Check email domain
      if (!firebaseUser.email || !isEmailDomainAllowed(firebaseUser.email)) {
        // Sign out the user if domain is not allowed
        await signOut(auth);
        throw new Error(`Sadece ${ALLOWED_DOMAIN} domainine sahip e-posta adresleri ile giriş yapabilirsiniz.`);
      }
      
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
      
      // ✅ VALIDATE OUTPUT WITH ZOD
      const response = AuthResponseSchema.parse({
        user: appUser,
        token,
      });
      
      return response;
    } catch (error) {
      console.error('Google login failed:', error);
      
      // ✅ TYPE-SAFE ERROR HANDLING
      const parseResult = FirebaseErrorSchema.safeParse(error);
      if (parseResult.success) {
        const firebaseError = parseResult.data;
        
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

