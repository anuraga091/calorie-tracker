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
import { format, parseISO } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';


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

  const totalBreakfastCalories = breakfast.reduce(
    (sum, food) => sum + food.nutrients.calories,
    0
  );

  const totalLunchCalories = lunch.reduce(
    (sum, food) => sum + food.nutrients.calories,
    0
  );

  const totalDinnerCalories = dinner.reduce(
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
            <h2 className="text-xl">Hello, {'Eunha!'}</h2>
            <p className='mb-4'>{format(parseISO(selectedDate), 'PPP')}</p>
            <CustomDatePicker initialView="date" />
          </div>
          <div className="mb-4 bg-white p-4 rounded-lg shadow flex justify-between">
            <div className="grid grid-rows-2 gap-4 ">
              <div style={{ width: 150, height: 100 , marginLeft: 15}}>
                <CircularProgressbar
                  value={percentageAchieved}
                  text={`${percentageAchieved}%`}
                  styles={buildStyles({
                    textColor: '#000',
                    pathColor: '#0000FF',
                    trailColor: '#d6d6d6',
                  })}
                />
              </div>
              <div className='mt-10 '>
                <p className="text-xl font-bold text-center">{totalCalories}/{DAILY_TARGET} cal</p>
                <p className="text-sm text-gray-500 text-center">Eaten / Target</p>
              </div>
            </div>
            <div className="grid grid-rows-3 gap-4 mt-4 overflow-hidden">
              <NutrientProgress label="Protein" value={totalProtein} maxValue={129} color="#0000FF" />
              <NutrientProgress label="Fat" value={totalFat} maxValue={70} color="#0000FF" />
              <NutrientProgress label="Carbs" value={totalCarbs} maxValue={300} color="#0000FF" />
            </div>
          </div>

          <div className="mt-4 bg-white p-4 rounded-lg shadow cursor-pointer"
            onClick={() => handleNavigateToFoodLog('Breakfast')}
          >
            <h2 className="font-semibold">Breakfast</h2>
            <h2 className="font-semibold mb-2">{totalBreakfastCalories} cal</h2>
            {breakfast.length > 0 ? (
              breakfast.map((food, index) => (
                <div key={index} className="flex justify-between mb-2">
                  <p className="font-normal">{food.title}</p>
                  <p className='ml-4'>{food.nutrients.calories} cal</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No food items logged for breakfast on this date.</p>
            )}
          </div>
          <div className="mt-4 bg-white p-4 rounded-lg shadow cursor-pointer"
            onClick={() => handleNavigateToFoodLog('Lunch')}
          >
            <h2 className="font-semibold">Lunch</h2>
            <h2 className="font-semibold mb-2">{totalLunchCalories} cal</h2>
            {lunch.length > 0 ? (
              lunch.map((food, index) => (
                <div key={index} className="flex justify-between mb-2">
                  <p className="font-normal">{food.title}</p>
                  <p className='ml-4'>{food.nutrients.calories} cal</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No food items logged for lunch on this date.</p>
            )}
          </div>
          <div className="mt-4 bg-white p-4 rounded-lg shadow cursor-pointer"
            onClick={() => handleNavigateToFoodLog('Dinner')}
          >
            <h2 className="font-semibold">Dinner</h2>
            <h2 className="font-semibold mb-2">{totalDinnerCalories} cal</h2>
            {dinner.length > 0 ? (
              dinner.map((food, index) => (
                <div key={index} className="flex justify-between mb-2">
                  <p className="font-normal">{food.title}</p>
                  <p className='ml-4'>{food.nutrients.calories} cal</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No food items logged for dinner on this date.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <div className="fixed bottom-0 w-full bg-white border-t flex justify-around items-center p-4">
        <Link href="/" className="text-gray-700 flex flex-col items-center">
          <Image src='/home.png' height={24} width={24} alt='home'/>

          <span>Home</span>
        </Link>

        <div className="relative">
          <Link href="/food-log" className="bg-blue-500 text-white rounded-full p-4 flex items-center justify-center shadow-lg absolute -top-8 transform -translate-x-1/2 left-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </Link>
        </div>

        <Link href="/analytics" className="text-gray-700 flex flex-col items-center">
          <Image src='/analytics.png' height={24} width={24} alt='analytics'/>
          <span>Analytics</span>
        </Link>
      </div>
    </div>
  );
};

export default Home;
