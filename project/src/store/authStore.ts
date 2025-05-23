import { create } from 'zustand';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'student';
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string, role: 'admin' | 'student') => Promise<void>;
  logout: () => void;
  clearError: () => void;
  restoreSession: () => void;
}

const API_URL = 'http://localhost:5000/api/auth';

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      set({
        error: err.message || 'Login failed',
        isLoading: false,
        isAuthenticated: false,
        user: null,
      });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  signup: async (username, password, role) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      set({
        error: err.message || 'Signup failed',
        isLoading: false,
        isAuthenticated: false,
        user: null,
      });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({
      user: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,
    });
  },

  clearError: () => set({ error: null }),

  restoreSession: () => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      try {
        const user: User = JSON.parse(storedUser);
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      }
    }
  }
}));

// ✅ Auto-restore on app load
useAuthStore.getState().restoreSession();

export default useAuthStore;
