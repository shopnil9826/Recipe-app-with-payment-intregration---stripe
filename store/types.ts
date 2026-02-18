export type Category = {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
};

export type Meal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
};

export interface MealDetail {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strYoutube?: string;
  [key: string]: unknown;
}

const API_BASE = 'https://www.themealdb.com/api/json/v1/1';

export const api = {
  categories: () => `${API_BASE}/categories.php`,
  mealsByCategory: (category: string) => `${API_BASE}/filter.php?c=${encodeURIComponent(category)}`,
  mealById: (id: string) => `${API_BASE}/lookup.php?i=${id}`,
  search: (query: string) => `${API_BASE}/search.php?s=${encodeURIComponent(query)}`,
};
