export interface Nutrients {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Food {
  id: number;
  title: string;
  restaurantChain: string;
  image: string;
  nutrients: Nutrients;
}
