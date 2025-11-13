import { create } from 'zustand';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface UIState {
  // Toast management
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  
  // Modal management
  modals: {
    login: boolean;
    signup: boolean;
    [key: string]: boolean;
  };
  openModal: (modalName: string) => void;
  closeModal: (modalName: string) => void;
  closeAllModals: () => void;
  
  // Loading states
  loading: {
    [key: string]: boolean;
  };
  setLoading: (key: string, value: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Toast state
  toasts: [],
  
  addToast: (toast) => {
    const id = Date.now().toString();
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration || 5000,
    };
    
    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));
    
    // Auto remove after duration
    const duration = newToast.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },
  
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
  
  // Modal state
  modals: {
    login: false,
    signup: false,
  },
  
  openModal: (modalName) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [modalName]: true,
      },
    }));
  },
  
  closeModal: (modalName) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [modalName]: false,
      },
    }));
  },
  
  closeAllModals: () => {
    set((state) => ({
      modals: {
        login: false,
        signup: false,
        ...Object.keys(state.modals).reduce((acc, key) => {
          if (key !== 'login' && key !== 'signup') {
            acc[key] = false;
          }
          return acc;
        }, {} as Record<string, boolean>),
      },
    }));
  },
  
  // Loading state
  loading: {},
  
  setLoading: (key, value) => {
    set((state) => ({
      loading: {
        ...state.loading,
        [key]: value,
      },
    }));
  },
}));

