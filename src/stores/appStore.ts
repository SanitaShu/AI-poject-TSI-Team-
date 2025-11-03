import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { medicines } from '../data/medicines';

export interface InventoryItem {
  medicineId: string;
  stock: number;
  lastRestocked: Date;
}

export interface Transaction {
  id: string;
  date: Date;
  medicines: { id: string; name: string; quantity: number; price: number }[];
  total: number;
  paymentMethod: 'paypal';
  status: 'completed' | 'pending' | 'failed';
}

interface AppState {
  isAgeVerified: boolean;
  isAdmin: boolean;
  selectedMedicines: string[];
  recommendedMedicines: string[];
  inventory: InventoryItem[];
  transactions: Transaction[];
  verificationMethod: 'passport' | 'residence_permit' | 'id_card' | null;
  vendingMachineId: string;
  setAgeVerified: (verified: boolean) => void;
  setAdmin: (admin: boolean) => void;
  toggleMedicine: (id: string) => void;
  addRecommendedMedicines: (ids: string[]) => void;
  clearCart: () => void;
  setVerificationMethod: (method: 'passport' | 'residence_permit' | 'id_card' | null) => void;
  initializeInventory: () => void;
  updateStock: (medicineId: string, quantity: number) => void;
  restockProduct: (medicineId: string, quantity: number) => void;
  addTransaction: (transaction: Transaction) => void;
  getStock: (medicineId: string) => number;
  processPurchase: (medicineIds: string[]) => boolean;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isAgeVerified: false,
      isAdmin: false,
      selectedMedicines: [],
      recommendedMedicines: [],
      inventory: [],
      transactions: [],
      verificationMethod: null,
      vendingMachineId: 'VM-001',

      setAgeVerified: (verified) => set({ isAgeVerified: verified }),
      setAdmin: (admin) => set({ isAdmin: admin }),

      toggleMedicine: (id) =>
        set((state) => {
          const medicine = medicines.find((m) => m.id === id);
          if (!medicine) return state;

          const isSelected = state.selectedMedicines.includes(id);

          if (isSelected) {
            // Deselect the medicine
            return {
              selectedMedicines: state.selectedMedicines.filter((medId) => medId !== id),
            };
          } else {
            // Check if product is in stock
            const stock = state.inventory.find((item) => item.medicineId === id)?.stock || 0;
            if (stock <= 0) {
              return state; // Out of stock
            }

            // Check if another medicine from the same category is already selected
            const alreadySelectedFromCategory = state.selectedMedicines.find((medId) => {
              const selectedMed = medicines.find((m) => m.id === medId);
              return selectedMed?.group === medicine.group;
            });

            if (alreadySelectedFromCategory) {
              // Replace the old selection with the new one (one per category rule)
              return {
                selectedMedicines: state.selectedMedicines
                  .filter((medId) => {
                    const med = medicines.find((m) => m.id === medId);
                    return med?.group !== medicine.group;
                  })
                  .concat(id),
              };
            } else {
              // Add new selection (max 5 categories = max 5 medicines)
              if (state.selectedMedicines.length >= 5) {
                return state; // Already have 5 items (one from each category)
              }
              return {
                selectedMedicines: [...state.selectedMedicines, id],
              };
            }
          }
        }),

      addRecommendedMedicines: (ids) =>
        set((state) => ({
          recommendedMedicines: ids,
          selectedMedicines: [...new Set([...state.selectedMedicines, ...ids])],
        })),

      clearCart: () => set({ selectedMedicines: [], recommendedMedicines: [] }),

      setVerificationMethod: (method) => set({ verificationMethod: method }),

      initializeInventory: () => {
        const state = get();
        if (state.inventory.length === 0) {
          const initialInventory: InventoryItem[] = medicines.map((med) => ({
            medicineId: med.id,
            stock: 30, // Each vending machine starts with 30 units
            lastRestocked: new Date(),
          }));
          set({ inventory: initialInventory });
        }
      },

      updateStock: (medicineId, quantity) =>
        set((state) => ({
          inventory: state.inventory.map((item) =>
            item.medicineId === medicineId
              ? { ...item, stock: Math.max(0, item.stock + quantity) }
              : item
          ),
        })),

      restockProduct: (medicineId, quantity) =>
        set((state) => ({
          inventory: state.inventory.map((item) =>
            item.medicineId === medicineId
              ? { ...item, stock: quantity, lastRestocked: new Date() }
              : item
          ),
        })),

      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [transaction, ...state.transactions],
        })),

      getStock: (medicineId) => {
        const item = get().inventory.find((item) => item.medicineId === medicineId);
        return item?.stock || 0;
      },

      processPurchase: (medicineIds) => {
        const state = get();
        // Count quantities for each medicine
        const quantities = medicineIds.reduce((acc, id) => {
          acc[id] = (acc[id] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        // Check if all items are in stock
        for (const [id, qty] of Object.entries(quantities)) {
          const stock = state.inventory.find((item) => item.medicineId === id)?.stock || 0;
          if (stock < qty) {
            return false; // Not enough stock
          }
        }

        // Deduct from inventory
        for (const [id, qty] of Object.entries(quantities)) {
          get().updateStock(id, -qty);
        }

        return true;
      },
    }),
    {
      name: 'vending-machine-storage',
      partialize: (state) => ({
        inventory: state.inventory,
        transactions: state.transactions,
        vendingMachineId: state.vendingMachineId,
      }),
    }
  )
);
