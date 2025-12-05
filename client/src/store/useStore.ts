import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import defaultPhones from '@/data/phones.json';

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
  os?: string;
  sim?: string;
  inspectionVideo?: string;
}

interface StoreState {
  // Data
  phones: Phone[];
  compareList: Phone[];
  
  // Auth (Mock)
  isAuthenticated: boolean;
  adminUser: AdminUser | null;
  login: (username: string, email: string) => boolean;
  logout: () => void;
  updateAdminProfile: (updates: Partial<AdminUser>) => void;

  // Actions
  addToCompare: (phone: Phone) => void;
  removeFromCompare: (phoneId: string) => void;
  clearCompare: () => void;
  
  setPhones: (phones: Phone[]) => void;
  addPhones: (newPhones: Phone[]) => void;
  updatePhone: (updatedPhone: Phone) => void;
  deletePhone: (phoneId: string) => void;
  resetPhones: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      phones: defaultPhones,
      compareList: [],
      isAuthenticated: false,
      adminUser: null,

      login: (username, email) => {
        // Mock credential check
        if (username === 'admin' && email === 'admin@ougadgets.com') {
          const adminUser: AdminUser = {
            id: 'admin-001',
            name: 'Admin User',
            email: 'admin@ougadgets.com',
            role: 'admin',
            avatar: 'https://github.com/shadcn.png',
            phone: '+234 800 000 0000',
            joinedDate: '2024-01-15',
            lastActive: new Date().toISOString(),
          };
          set({ isAuthenticated: true, adminUser });
          return true;
        }
        return false;
      },
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
      
      setPhones: (phones) => set({ phones }),
      addPhones: (newPhones) => set((state) => ({ phones: [...newPhones, ...state.phones] })), // Add to top
      
      updatePhone: (updatedPhone) => set((state) => ({
        phones: state.phones.map((p) => p.id === updatedPhone.id ? updatedPhone : p)
      })),

      deletePhone: (phoneId) => set((state) => ({
        phones: state.phones.filter((p) => p.id !== phoneId)
      })),

      resetPhones: () => set({ phones: defaultPhones }),
    }),
    {
      name: 'ou-gadgets-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
