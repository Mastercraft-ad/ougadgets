import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  avatar?: string;
  phone?: string;
  joinedDate: string;
  lastActive: string;
}

export interface Phone {
  id: string;
  name: string;
  brand: string;
  ram: number;
  rom: number;
  color: string;
  battery: number;
  camera: number;
  frontCamera: number;
  marketPrice: number;
  jumiaPrice: number;
  ouPrice: number;
  description: string;
  images: string[];
  addedDate: string;
  condition: string;
  os?: string | null;
  sim?: string | null;
  inspectionVideo?: string | null;
}

interface StoreState {
  compareList: Phone[];
  
  isAuthenticated: boolean;
  adminUser: AdminUser | null;
  setAuth: (isAuthenticated: boolean, adminUser: AdminUser | null) => void;
  logout: () => void;
  updateAdminProfile: (updates: Partial<AdminUser>) => void;

  addToCompare: (phone: Phone) => void;
  removeFromCompare: (phoneId: string) => void;
  clearCompare: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      compareList: [],
      isAuthenticated: false,
      adminUser: null,

      setAuth: (isAuthenticated, adminUser) => set({ isAuthenticated, adminUser }),
      logout: () => set({ isAuthenticated: false, adminUser: null }),
      
      updateAdminProfile: (updates) => set((state) => ({
        adminUser: state.adminUser ? { ...state.adminUser, ...updates } : null
      })),

      addToCompare: (phone) =>
        set((state) => {
          if (state.compareList.find((p) => p.id === phone.id)) return state;
          if (state.compareList.length >= 4) return state;
          return { compareList: [...state.compareList, phone] };
        }),
      removeFromCompare: (phoneId) =>
        set((state) => ({
          compareList: state.compareList.filter((p) => p.id !== phoneId),
        })),
      clearCompare: () => set({ compareList: [] }),
    }),
    {
      name: 'ou-gadgets-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
