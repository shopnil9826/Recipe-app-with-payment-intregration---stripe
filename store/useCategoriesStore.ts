import { create } from 'zustand';
import type { Category } from './types';
import { api } from './types';

type CategoriesState = {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
};

export const useCategoriesStore = create<CategoriesState>((set) => ({
  categories: [],
  loading: true,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(api.categories());
      const json = await res.json();
      set({ categories: json.categories || [], loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load categories',
        loading: false,
      });
    }
  },
}));
