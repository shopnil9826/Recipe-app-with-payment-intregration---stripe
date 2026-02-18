import { create } from 'zustand';
import type { MealDetail } from './types';
import { api } from './types';

type MealDetailState = {
  /** Cache meal details by id */
  mealById: Record<string, MealDetail | null>;
  loading: boolean;
  error: string | null;
  fetchMealDetail: (mealId: string) => Promise<void>;
  getMeal: (mealId: string) => MealDetail | null | undefined;
};

export const useMealDetailStore = create<MealDetailState>((set, get) => ({
  mealById: {},
  loading: false,
  error: null,

  fetchMealDetail: async (mealId: string) => {
    if (!mealId) return;
    const cached = get().mealById[mealId];
    if (cached !== undefined) {
      set({ loading: false });
      return;
    }
    set({ loading: true, error: null });
    try {
      const res = await fetch(api.mealById(mealId));
      const json = await res.json();
      const meal = json.meals?.[0] ?? null;
      set((state) => ({
        mealById: { ...state.mealById, [mealId]: meal },
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load recipe',
        loading: false,
      });
    }
  },

  getMeal: (mealId: string) => get().mealById[mealId],
}));
