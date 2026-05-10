import { create } from 'zustand';
import { LightingSystem } from '../types/calculator';

interface AppState {
  savedSystems: LightingSystem[];
  addSystem: (system: LightingSystem) => void;
  removeSystem: (id: string) => void;
  clearSystems: () => void;
}

export const useAppStore = create<AppState>()((set) => ({
  savedSystems: [],
  addSystem: (system) =>
    set((state) => ({
      savedSystems: [system, ...state.savedSystems],
    })),
  removeSystem: (id) =>
    set((state) => ({
      savedSystems: state.savedSystems.filter((system) => system.id !== id),
    })),
  clearSystems: () => set({ savedSystems: [] }),
}));