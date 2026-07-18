import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@workspace/api-client-react';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'nc_user',
    }
  )
);
