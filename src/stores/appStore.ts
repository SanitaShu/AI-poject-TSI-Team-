import { create } from 'zustand';

interface AppState {
  isAgeVerified: boolean;
  isAdmin: boolean;
  selectedMedicines: string[];
  recommendedMedicines: string[];
  setAgeVerified: (verified: boolean) => void;
  setAdmin: (admin: boolean) => void;
  toggleMedicine: (id: string) => void;
  addRecommendedMedicines: (ids: string[]) => void;
  clearCart: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isAgeVerified: false,
  isAdmin: false,
  selectedMedicines: [],
  recommendedMedicines: [],
  setAgeVerified: (verified) => set({ isAgeVerified: verified }),
  setAdmin: (admin) => set({ isAdmin: admin }),
  toggleMedicine: (id) =>
    set((state) => {
      const isSelected = state.selectedMedicines.includes(id);
      if (isSelected) {
        return {
          selectedMedicines: state.selectedMedicines.filter((medId) => medId !== id),
        };
      } else {
        return {
          selectedMedicines: [...state.selectedMedicines, id],
        };
      }
    }),
  addRecommendedMedicines: (ids) =>
    set((state) => ({
      recommendedMedicines: ids,
      selectedMedicines: [...new Set([...state.selectedMedicines, ...ids])],
    })),
  clearCart: () => set({ selectedMedicines: [], recommendedMedicines: [] }),
}));
