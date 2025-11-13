import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          // Dynamic import to avoid circular dependency
          const { authService } = await import('../../features/auth/services/authService');
          const response = await authService.login(email, password);
          set({ 
            user: response.user, 
            token: response.token, 
            isAuthenticated: true,
            isLoading: false 
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      loginWithGoogle: async () => {
        set({ isLoading: true });
        try {
          // Dynamic import to avoid circular dependency
          const { authService } = await import('../../features/auth/services/authService');
          const response = await authService.loginWithGoogle();
          set({ 
            user: response.user, 
            token: response.token, 
            isAuthenticated: true,
            isLoading: false 
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      signup: async (email: string, password: string, name: string) => {
        set({ isLoading: true });
        try {
          // Dynamic import to avoid circular dependency
          const { authService } = await import('../../features/auth/services/authService');
          const response = await authService.signup(email, password, name);
          set({ 
            user: response.user, 
            token: response.token, 
            isAuthenticated: true,
            isLoading: false 
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      logout: async () => {
        try {
          // Dynamic import to avoid circular dependency
          const { authService } = await import('../../features/auth/services/authService');
          await authService.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false 
          });
        }
      },
      
      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },
      
      setToken: (token: string) => {
        set({ token });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

