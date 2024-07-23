'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CustomDatePicker from '../components/DatePicker';
import FoodSearch from '../components/FoodSearch';
import FoodCard from '../components/FoodCard';
import { useDateStore } from '../store/dateStore';
import { Food } from '../types/food';
import { useFoodStore } from '../store/foodStore';

const FoodLog: React.FC = () => {
  const { selectedDate } = useDateStore();
  const { foodLogs, addFood, removeFood } = useFoodStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mealType, setMealType] = useState<string>('breakfast');
  const [foods, setFoods] = useState<Food[]>([]);

  useEffect(() => {
    const meal = searchParams.get('meal');
    if (meal) {
      setMealType(meal.toLowerCase());
    }
  }, [searchParams]);

  useEffect(() => {
    setFoods(foodLogs[selectedDate]?.[mealType] || []);
  }, [selectedDate, mealType, foodLogs]);

  const handleAddFood = (food: Food) => {
    addFood(selectedDate, mealType, food);
  };

  const handleRemoveFood = (index: number) => {
    removeFood(selectedDate, mealType, index);
  };

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner'];

  const handleDone = () => {
    router.push('/');
  };

  const handleBack = () => {
    console.log('Back button clicked');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-4 overflow-y-auto">
        <CustomDatePicker initialView="date" />
        <div className="flex justify-around my-4">
          {mealTypes.map((type) => (
            <button
              key={type}
              className={`px-4 py-2 rounded ${mealType === type.toLowerCase() ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setMealType(type.toLowerCase())}
            >
              {type}
            </button>
          ))}
        </div>
        <FoodSearch onAdd={handleAddFood} onBack={handleBack} />
        <div className="mt-4">
          {foods.length > 0 ? (
            foods.map((food, index) => (
              <FoodCard key={index} food={food} onRemove={() => handleRemoveFood(index)} />
            ))
          ) : (
            <p className="text-center text-gray-500">No food items logged for {mealType} on this date.</p>
          )}
        </div>
      </main>
      <div className="p-4">
        <button className="bg-blue-500 text-white py-2 px-4 rounded w-full" onClick={handleDone}>Done</button>
      </div>
      <Footer />
    </div>
  );
};

export default FoodLog;
