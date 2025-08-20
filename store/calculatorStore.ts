import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { LightingSystem } from '../types/calculator';

interface AppState {
  savedSystems: LightingSystem[];
  addSystem: (system: LightingSystem) => void;
  removeSystem: (id: string) => void;
  clearSystems: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      savedSystems: [],
      addSystem: (system) => 
        set((state) => ({ 
          savedSystems: [system, ...state.savedSystems] 
        })),
      removeSystem: (id) => 
        set((state) => ({ 
          savedSystems: state.savedSystems.filter((system) => system.id !== id) 
        })),
      clearSystems: () => set({ savedSystems: [] }),
    }),
    {
      name: 'calculator-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);