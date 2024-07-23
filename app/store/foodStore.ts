import { create, StateCreator } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import { Food } from '../types/food';

const mealTypes = ['breakfast', 'lunch', 'dinner'] as const;
type MealType = typeof mealTypes[number];

interface FoodState {
  foodLogs: {
    [date: string]: {
      breakfast: Food[];
      lunch: Food[];
      dinner: Food[];
    };
  };
  addFood: (date: string, mealType: MealType, food: Food) => void;
  removeFood: (date: string, mealType: MealType, index: number) => void;
}

type FoodStateCreator = StateCreator<
  FoodState,
  [['zustand/persist', unknown]],
  []
>;

const createFoodStore: FoodStateCreator = (set) => ({
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
});

export const useFoodStore = create<FoodState>()(
  persist(createFoodStore, {
    name: 'food-store',
  })
);
