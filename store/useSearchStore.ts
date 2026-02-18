import { create } from 'zustand';
import type { Meal } from './types';
import { api } from './types';

type SearchState = {
  searchQuery: string;
  meals: Meal[];
  loading: boolean;
  searched: boolean;
  searchCache: Record<string, Meal[]>;
  setSearchQuery: (query: string) => void;
  searchMeals: (query: string) => Promise<void>;
  clearSearch: () => void;
};

export const useSearchStore = create<SearchState>((set, get) => ({
  searchQuery: '',
  meals: [],
  loading: false,
  searched: false,
  searchCache: {},

  setSearchQuery: (searchQuery: string) => set({ searchQuery }),

  searchMeals: async (query: string) => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      set({ meals: [], searched: false });
      return;
    }
    const cached = get().searchCache[normalized];
    if (cached) {
      set({ meals: cached, searched: true });
      return;
    }
    set({ loading: true, searched: true });
    try {
      const res = await fetch(api.search(normalized));
      const json = await res.json();
      const fetchedMeals: Meal[] = json.meals || [];
      set((state) => ({
        meals: fetchedMeals,
        loading: false,
        searchCache: { ...state.searchCache, [normalized]: fetchedMeals },
      }));
    } catch (error) {
      set({ loading: false });
      console.error('Error searching meals:', error);
    }
  },

  clearSearch: () =>
    set({ searchQuery: '', meals: [], searched: false }),
}));
