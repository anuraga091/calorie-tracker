import React from 'react';
import { Food } from '../types/food';

interface FoodCardProps {
  food: Food;
  onRemove: () => void;
}

const FoodCard: React.FC<FoodCardProps> = ({ food, onRemove }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4 relative">
      <button onClick={onRemove} className="absolute top-2 right-2 text-red-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="flex items-center">
        <img src={food.image} alt={food.title} className="w-12 h-12 rounded-full mr-4" />
        <div>
          <h3 className="font-semibold">{food.title}</h3>
          <p className="text-sm text-gray-500">{food.nutrients.calories} cal</p>
        </div>
      </div>
      <div className="flex justify-around mt-2">
        <div className="text-center">
          <p className="text-sm text-gray-500">Protein</p>
          <p className="font-semibold">{food.nutrients.protein}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Carbs</p>
          <p className="font-semibold">{food.nutrients.carbs}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Fat</p>
          <p className="font-semibold">{food.nutrients.fat}</p>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
