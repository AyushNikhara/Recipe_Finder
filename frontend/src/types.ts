import { z } from 'zod';

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  dietaryRestrictions: string[];
  cuisine: string;
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  imageUrl: string;
  rating: number;
  reviews: Review[];
}

export interface Review {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface DietaryPreference {
  id: string;
  label: string;
  value: string;
}

export interface UserPreferences {
  dietaryRestrictions: string[];
  allergies: string[];
  servingSize: number;
  favoriteCuisines: string[];
}

export const timeFilterSchema = z.enum(['all', 'under15', 'under30', 'under60']);
export const difficultyFilterSchema = z.enum(['all', 'easy', 'medium', 'hard']);
export const cuisineFilterSchema = z.enum(['all', 'italian', 'asian', 'mediterranean', 'mexican', 'american']);

export type TimeFilter = z.infer<typeof timeFilterSchema>;
export type DifficultyFilter = z.infer<typeof difficultyFilterSchema>;
export type CuisineFilter = z.infer<typeof cuisineFilterSchema>;