"use client";
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useFoodStore } from '../store/foodStore';
import { useDateStore } from '../store/dateStore';
import { format, subDays } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Analytics: React.FC = () => {
  const { foodLogs } = useFoodStore();
  const { selectedDate } = useDateStore();

  const getLast7DaysCalories = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(selectedDate), i);
      const formattedDate = format(date, 'yyyy-MM-dd');
      const foodLog = foodLogs[formattedDate] || { breakfast: [], lunch: [], dinner: [] };
      const totalCalories = [...foodLog.breakfast, ...foodLog.lunch, ...foodLog.dinner].reduce(
        (sum, food) => sum + food.nutrients.calories,
        0
      );
      last7Days.push({ date: formattedDate, calories: totalCalories });
    }
    return last7Days;
  };

  const data = getLast7DaysCalories();
  const chartData = {
    labels: data.map(entry => format(new Date(entry.date), 'MMM dd')),
    datasets: [
      {
        label: 'Calories',
        data: data.map(entry => entry.calories),
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Calorie Trend (Last 7 Days)</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default Analytics;
