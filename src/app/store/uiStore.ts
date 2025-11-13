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
    if (newToast.duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, newToast.duration);
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
    set((state) => {
      const closedModals: Record<string, boolean> = {};
      Object.keys(state.modals).forEach((key) => {
        closedModals[key] = false;
      });
      return { modals: closedModals };
    });
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

