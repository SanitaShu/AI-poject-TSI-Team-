import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { medicines } from '../data/medicines';
import { vendingMachineLocations } from '../data/vendingMachines';
import { useFaceRecognitionStore } from './faceRecognitionStore';

export interface InventoryItem {
  medicineId: string;
  stock: number;
  lastRestocked: Date;
}

export interface Transaction {
  id: string;
  date: Date;
  vendingMachineId: string;
  medicines: { id: string; name: string; quantity: number; price: number }[];
  total: number;
  paymentMethod: 'paypal';
  status: 'completed' | 'pending' | 'failed';
}

export interface VendingMachineInventory {
  vendingMachineId: string;
  inventory: InventoryItem[];
}

interface AppState {
  isAgeVerified: boolean;
  isAdmin: boolean;
  selectedMedicines: string[];
  recommendedMedicines: string[];
  inventory: InventoryItem[];
  allMachinesInventory: VendingMachineInventory[];
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
  initializeAllMachinesInventory: () => void;
  updateStock: (medicineId: string, quantity: number) => void;
  updateMachineStock: (vendingMachineId: string, medicineId: string, quantity: number) => void;
  restockProduct: (medicineId: string, quantity: number) => void;
  restockMachineProduct: (vendingMachineId: string, medicineId: string, quantity: number) => void;
  addTransaction: (transaction: Transaction) => void;
  getStock: (medicineId: string) => number;
  getMachineStock: (vendingMachineId: string, medicineId: string) => number;
  processPurchase: (medicineIds: string[]) => boolean;
  getMachineInventory: (vendingMachineId: string) => InventoryItem[];
  getAllMachinesTransactions: () => Transaction[];
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isAgeVerified: false,
      isAdmin: false,
      selectedMedicines: [],
      recommendedMedicines: [],
      inventory: [],
      allMachinesInventory: [],
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
        set((state) => {
          const newSelectedMedicines = [...state.selectedMedicines];

          // Process each recommended medicine
          ids.forEach((id) => {
            const medicine = medicines.find((m) => m.id === id);
            if (!medicine) return;

            // Check if already selected
            if (newSelectedMedicines.includes(id)) return;

            // Check stock
            const stock = state.inventory.find((item) => item.medicineId === id)?.stock || 0;
            if (stock <= 0) return;

            // Check if another medicine from the same category is already selected
            const alreadySelectedFromCategory = newSelectedMedicines.find((medId) => {
              const selectedMed = medicines.find((m) => m.id === medId);
              return selectedMed?.group === medicine.group;
            });

            if (alreadySelectedFromCategory) {
              // Replace the old selection with the new one (one per category rule)
              const index = newSelectedMedicines.indexOf(alreadySelectedFromCategory);
              newSelectedMedicines[index] = id;
            } else {
              // Add new selection if under limit
              if (newSelectedMedicines.length < 5) {
                newSelectedMedicines.push(id);
              }
            }
          });

          return {
            recommendedMedicines: ids,
            selectedMedicines: newSelectedMedicines,
          };
        }),

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

      addTransaction: (transaction) => {
        set((state) => ({
          transactions: [transaction, ...state.transactions],
        }));

        // Record purchases by category for face recognition tracking
        const { currentUserId, addPurchaseRecord } = useFaceRecognitionStore.getState();

        if (currentUserId) {
          // Group medicines by category
          const categoriesMap = new Map<number, string[]>();

          transaction.medicines.forEach((medicine) => {
            const medicineData = medicines.find((m) => m.id === medicine.id);
            if (medicineData) {
              const categoryId = medicineData.group;
              const existingMedicines = categoriesMap.get(categoryId) || [];
              existingMedicines.push(medicine.id);
              categoriesMap.set(categoryId, existingMedicines);
            }
          });

          // Record purchase for each category
          categoriesMap.forEach((medicineIds, categoryId) => {
            addPurchaseRecord(currentUserId, categoryId, medicineIds);
          });
        }
      },

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

      initializeAllMachinesInventory: () => {
        const state = get();
        if (state.allMachinesInventory.length === 0) {
          const allInventories: VendingMachineInventory[] = vendingMachineLocations.map((machine) => ({
            vendingMachineId: machine.id,
            inventory: medicines.map((med) => ({
              medicineId: med.id,
              stock: Math.floor(Math.random() * 40), // Random stock between 0-40 for demo
              lastRestocked: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000), // Random date within last 10 days
            })),
          }));
          set({ allMachinesInventory: allInventories });
        }
      },

      updateMachineStock: (vendingMachineId, medicineId, quantity) =>
        set((state) => ({
          allMachinesInventory: state.allMachinesInventory.map((machine) =>
            machine.vendingMachineId === vendingMachineId
              ? {
                  ...machine,
                  inventory: machine.inventory.map((item) =>
                    item.medicineId === medicineId
                      ? { ...item, stock: Math.max(0, item.stock + quantity) }
                      : item
                  ),
                }
              : machine
          ),
        })),

      restockMachineProduct: (vendingMachineId, medicineId, quantity) =>
        set((state) => ({
          allMachinesInventory: state.allMachinesInventory.map((machine) =>
            machine.vendingMachineId === vendingMachineId
              ? {
                  ...machine,
                  inventory: machine.inventory.map((item) =>
                    item.medicineId === medicineId
                      ? { ...item, stock: quantity, lastRestocked: new Date() }
                      : item
                  ),
                }
              : machine
          ),
        })),

      getMachineStock: (vendingMachineId, medicineId) => {
        const machine = get().allMachinesInventory.find((m) => m.vendingMachineId === vendingMachineId);
        const item = machine?.inventory.find((item) => item.medicineId === medicineId);
        return item?.stock || 0;
      },

      getMachineInventory: (vendingMachineId) => {
        const machine = get().allMachinesInventory.find((m) => m.vendingMachineId === vendingMachineId);
        return machine?.inventory || [];
      },

      getAllMachinesTransactions: () => {
        return get().transactions;
      },
    }),
    {
      name: 'vending-machine-storage',
      partialize: (state) => ({
        inventory: state.inventory,
        allMachinesInventory: state.allMachinesInventory,
        transactions: state.transactions,
        vendingMachineId: state.vendingMachineId,
      }),
    }
  )
);
