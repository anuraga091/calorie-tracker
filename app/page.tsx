'use client';

import { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CustomDatePicker from './components/DatePicker';
import { useRouter } from 'next/navigation';
import { useDateStore } from './store/dateStore';
import { useFoodStore } from './store/foodStore';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import NutrientProgress from './components/NutrientProgress';

const DAILY_TARGET = 2500;

const Home: React.FC = () => {
  const { selectedDate } = useDateStore();
  const router = useRouter();
  const { foodLogs } = useFoodStore();
  const { breakfast = [], lunch = [], dinner = [] } = foodLogs[selectedDate] || {};

  const parseNutrientValue = (value: string | number) => {
    if (typeof value === 'string') {
      return parseFloat(value.replace('g', ''));
    }
    return value;
  };

  // Calculate total calories and nutrients for the day
  const totalCalories = [...breakfast, ...lunch, ...dinner].reduce(
    (sum, food) => sum + food.nutrients.calories,
    0
  );

  const totalProtein = [...breakfast, ...lunch, ...dinner].reduce(
    (sum, food) => sum + parseNutrientValue(food.nutrients.protein),
    0
  );

  const totalCarbs = [...breakfast, ...lunch, ...dinner].reduce(
    (sum, food) => sum + parseNutrientValue(food.nutrients.carbs),
    0
  );

  const totalFat = [...breakfast, ...lunch, ...dinner].reduce(
    (sum, food) => {
      return sum + parseNutrientValue(food.nutrients.fat)
    },0);

  // Calculate the percentage of the daily target achieved
  const percentageAchieved = parseFloat(
    Math.min((totalCalories / DAILY_TARGET) * 100, 100).toFixed(2)
  );
  
  const handleNavigateToFoodLog = (mealType: string) => {
    router.push(`/food-log?meal=${mealType}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-4">
        <div className="text-gray-700">
          <div className="mb-4">
            <h2 className="text-xl">Hello, Eunha!</h2>
            <CustomDatePicker initialView="date" />
          </div>
          <div className="mb-4 bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div style={{ width: 80, height: 80 }}>
                <CircularProgressbar
                  value={percentageAchieved}
                  text={`${percentageAchieved}%`}
                  styles={buildStyles({
                    textColor: '#000',
                    pathColor: '#4caf50',
                    trailColor: '#d6d6d6',
                  })}
                />
              </div>
              <div className="ml-4 flex-grow">
                <h3 className="text-lg font-semibold">Daily Target Achieved</h3>
                <p className="text-xl">{totalCalories}/{DAILY_TARGET} cal</p>
                <p className="text-sm text-gray-500">Eaten / Target</p>
                <div className="mt-2">
                  <NutrientProgress label="Protein" value={totalProtein} maxValue={129} color="#4caf50" />
                  <NutrientProgress label="Fat" value={totalFat} maxValue={70} color="#f44336" />
                  <NutrientProgress label="Carbs" value={totalCarbs} maxValue={300} color="#2196f3" />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <h2>Breakfast</h2>
            {breakfast.length > 0 ? (
              breakfast.map((food, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow mb-4 cursor-pointer"
                  onClick={() => handleNavigateToFoodLog('Breakfast')}
                >
                  <h3 className="font-semibold">{food.title}</h3>
                  <p>{food.nutrients.calories} cal - {food.nutrients.protein} Protein, {food.nutrients.carbs} Carbs, {food.nutrients.fat} Fat</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No food items logged for breakfast on this date.</p>
            )}

            <h2>Lunch</h2>
            {lunch.length > 0 ? (
              lunch.map((food, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow mb-4 cursor-pointer"
                  onClick={() => handleNavigateToFoodLog('Lunch')}
                >
                  <h3 className="font-semibold">{food.title}</h3>
                  <p>{food.nutrients.calories} cal - {food.nutrients.protein} Protein, {food.nutrients.carbs} Carbs, {food.nutrients.fat} Fat</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No food items logged for lunch on this date.</p>
            )}

            <h2>Dinner</h2>
            {dinner.length > 0 ? (
              dinner.map((food, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow mb-4 cursor-pointer"
                  onClick={() => handleNavigateToFoodLog('Dinner')}
                >
                  <h3 className="font-semibold">{food.title}</h3>
                  <p>{food.nutrients.calories} cal - {food.nutrients.protein} Protein, {food.nutrients.carbs} Carbs, {food.nutrients.fat} Fat</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No food items logged for dinner on this date.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <nav className="fixed bottom-0 w-full bg-white border-t flex justify-around p-4">
        <a href="/" className="text-gray-700 flex flex-col items-center">
          <span>Home</span>
        </a>
        <a href="/food-log" className="text-gray-700 flex flex-col items-center">
          <span className="text-4xl">+</span>
        </a>
        <a href="/analytics" className="text-gray-700 flex flex-col items-center">
          <span>Analytics</span>
        </a>
      </nav>
    </div>
  );
};

export default Home;
