import { create } from 'zustand';
import type { Meal } from './types';
import { api } from './types';

type MealsState = {
  /** Meals keyed by category name for cache */
  mealsByCategory: Record<string, Meal[]>;
  loading: boolean;
  error: string | null;
  fetchMeals: (category: string) => Promise<void>;
  getMeals: (category: string) => Meal[];
};

export const useMealsStore = create<MealsState>((set, get) => ({
  mealsByCategory: {},
  loading: false,
  error: null,

  fetchMeals: async (category: string) => {
    if (!category) return;
    set({ loading: true, error: null });
    try {
      const res = await fetch(api.mealsByCategory(category));
      const json = await res.json();
      const meals = json.meals || [];
      set((state) => ({
        mealsByCategory: { ...state.mealsByCategory, [category]: meals },
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load meals',
        loading: false,
      });
    }
  },

  getMeals: (category: string) => {
    return get().mealsByCategory[category] ?? [];
  },
}));
