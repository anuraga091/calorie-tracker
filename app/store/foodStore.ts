import {create} from 'zustand';
import { persist } from 'zustand/middleware';
import { Food } from '../types/food';

interface FoodState {
  foodLogs: {
    [date: string]: {
      breakfast: Food[];
      lunch: Food[];
      dinner: Food[];
    };
  };
  addFood: (date: string, mealType: string, food: Food) => void;
  removeFood: (date: string, mealType: string, index: number) => void;
}

export const useFoodStore = create<FoodState>(
  persist(
    (set) => ({
      foodLogs: {},
      addFood: (date, mealType, food) =>
        set((state) => ({
          foodLogs: {
            ...state.foodLogs,
            [date]: {
              ...state.foodLogs[date],
              [mealType]: [...(state.foodLogs[date]?.[mealType] || []), food],
            },
          },
        })),
      removeFood: (date, mealType, index) =>
        set((state) => ({
          foodLogs: {
            ...state.foodLogs,
            [date]: {
              ...state.foodLogs[date],
              [mealType]: state.foodLogs[date]?.[mealType]?.filter((_, i) => i !== index) || [],
            },
          },
        })),
    }),
    {
      name: 'food-store',
    }
  )
);
