import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PurchaseRecord {
  categoryId: number;
  purchaseDate: number; // timestamp
  medicines: string[];
}

export interface UserFaceRecord {
  id: string;
  faceDescriptor: number[]; // face-api.js descriptor
  purchaseHistory: PurchaseRecord[];
  lastPurchaseDate: number;
}

interface FaceRecognitionState {
  userRecords: UserFaceRecord[];
  currentUserFaceDescriptor: number[] | null;
  currentUserId: string | null;
  blockedCategories: number[];

  // Actions
  addUserRecord: (faceDescriptor: number[]) => string;
  findMatchingUser: (faceDescriptor: number[]) => UserFaceRecord | null;
  setCurrentUser: (userId: string, faceDescriptor: number[]) => void;
  addPurchaseRecord: (userId: string, categoryId: number, medicines: string[]) => void;
  getBlockedCategories: (userId: string) => number[];
  checkCategoryAvailable: (userId: string, categoryId: number) => boolean;
  clearCurrentUser: () => void;
}

// Calculate Euclidean distance between two face descriptors
const calculateDistance = (desc1: number[], desc2: number[]): number => {
  if (desc1.length !== desc2.length) return Infinity;

  let sum = 0;
  for (let i = 0; i < desc1.length; i++) {
    sum += Math.pow(desc1[i] - desc2[i], 2);
  }
  return Math.sqrt(sum);
};

// Lower threshold = more lenient matching (easier to match faces)
// For poor quality cameras, we use 0.65 instead of 0.6
const FACE_MATCH_THRESHOLD = 0.65; // Adjust this threshold for face matching sensitivity
const HOURS_24_IN_MS = 24 * 60 * 60 * 1000;

export const useFaceRecognitionStore = create<FaceRecognitionState>()(
  persist(
    (set, get) => ({
      userRecords: [],
      currentUserFaceDescriptor: null,
      currentUserId: null,
      blockedCategories: [],

      addUserRecord: (faceDescriptor: number[]) => {
        const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newRecord: UserFaceRecord = {
          id,
          faceDescriptor,
          purchaseHistory: [],
          lastPurchaseDate: Date.now(),
        };

        set((state) => ({
          userRecords: [...state.userRecords, newRecord],
        }));

        return id;
      },

      findMatchingUser: (faceDescriptor: number[]) => {
        const { userRecords } = get();

        let bestMatch: UserFaceRecord | null = null;
        let bestDistance = Infinity;

        for (const record of userRecords) {
          const distance = calculateDistance(faceDescriptor, record.faceDescriptor);
          if (distance < FACE_MATCH_THRESHOLD && distance < bestDistance) {
            bestMatch = record;
            bestDistance = distance;
          }
        }

        return bestMatch;
      },

      setCurrentUser: (userId: string, faceDescriptor: number[]) => {
        const blockedCategories = get().getBlockedCategories(userId);
        set({
          currentUserId: userId,
          currentUserFaceDescriptor: faceDescriptor,
          blockedCategories,
        });
      },

      addPurchaseRecord: (userId: string, categoryId: number, medicines: string[]) => {
        set((state) => ({
          userRecords: state.userRecords.map((record) =>
            record.id === userId
              ? {
                  ...record,
                  purchaseHistory: [
                    ...record.purchaseHistory,
                    {
                      categoryId,
                      purchaseDate: Date.now(),
                      medicines,
                    },
                  ],
                  lastPurchaseDate: Date.now(),
                }
              : record
          ),
        }));

        // Update blocked categories for current user
        const blockedCategories = get().getBlockedCategories(userId);
        set({ blockedCategories });
      },

      getBlockedCategories: (userId: string) => {
        const { userRecords } = get();
        const user = userRecords.find((r) => r.id === userId);

        if (!user) return [];

        const now = Date.now();
        const blockedCategories: number[] = [];

        // Check each purchase in history
        for (const purchase of user.purchaseHistory) {
          const timeSincePurchase = now - purchase.purchaseDate;

          // If less than 24 hours have passed, block this category
          if (timeSincePurchase < HOURS_24_IN_MS) {
            if (!blockedCategories.includes(purchase.categoryId)) {
              blockedCategories.push(purchase.categoryId);
            }
          }
        }

        return blockedCategories;
      },

      checkCategoryAvailable: (userId: string, categoryId: number) => {
        const blockedCategories = get().getBlockedCategories(userId);
        return !blockedCategories.includes(categoryId);
      },

      clearCurrentUser: () => {
        set({
          currentUserId: null,
          currentUserFaceDescriptor: null,
          blockedCategories: [],
        });
      },
    }),
    {
      name: 'face-recognition-storage',
    }
  )
);
