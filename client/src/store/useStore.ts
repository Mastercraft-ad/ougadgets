import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import defaultPhones from '@/data/phones.json';

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
}

interface StoreState {
  // Data
  phones: Phone[];
  compareList: Phone[];
  
  // Auth (Mock)
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;

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

      login: (password) => {
        // Mock password check
        if (password === 'admin123') {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false }),

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
