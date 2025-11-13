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
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
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
          // TODO: Implement actual login API call
          // const response = await authService.login(email, password);
          // set({ user: response.user, token: response.token, isAuthenticated: true });
          
          // Mock for now
          const mockUser: User = {
            id: '1',
            email,
            name: 'Test User',
            role: 'admin',
          };
          set({ 
            user: mockUser, 
            token: 'mock-token', 
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
          // TODO: Implement actual signup API call
          const mockUser: User = {
            id: '1',
            email,
            name,
            role: 'user',
          };
          set({ 
            user: mockUser, 
            token: 'mock-token', 
            isAuthenticated: true,
            isLoading: false 
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      logout: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        });
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

