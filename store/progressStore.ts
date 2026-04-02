import { create } from 'zustand';

interface DistrictProgress {
  completedLevels: string[];
  stars: Record<string, 1 | 2 | 3>;
}

interface ProgressStoreState {
  /** Niveaux complétés par district : clé = districtId */
  byDistrict: Record<string, DistrictProgress>;
}

interface ProgressStoreActions {
  completeLevel: (
    districtId: string,
    levelId: string,
    stars: 1 | 2 | 3
  ) => void;
  getCompletedCount: (districtId: string) => number;
}

type ProgressStore = ProgressStoreState & {
  actions: ProgressStoreActions;
};

export const useProgressStore = create<ProgressStore>((set, get) => ({
  byDistrict: {},
  actions: {
    completeLevel: (districtId, levelId, stars) =>
      set((state) => {
        const prev = state.byDistrict[districtId] ?? {
          completedLevels: [],
          stars: {},
        };
        const alreadyDone = prev.completedLevels.includes(levelId);
        return {
          byDistrict: {
            ...state.byDistrict,
            [districtId]: {
              completedLevels: alreadyDone
                ? prev.completedLevels
                : [...prev.completedLevels, levelId],
              stars: {
                ...prev.stars,
                [levelId]: Math.max(
                  prev.stars[levelId] ?? 0,
                  stars
                ) as 1 | 2 | 3,
              },
            },
          },
        };
      }),
    getCompletedCount: (districtId) => {
      const dp = get().byDistrict[districtId];
      return dp ? dp.completedLevels.length : 0;
    },
  },
}));
