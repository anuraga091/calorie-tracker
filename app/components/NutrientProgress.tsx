import React from 'react';

interface NutrientProgressProps {
  label: string;
  value: number;
  maxValue: number;
  color: string;
}

const NutrientProgress: React.FC<NutrientProgressProps> = ({ label, value, maxValue, color }) => {
  const percentage = (value / maxValue) * 100;
  return (
    <div className="mb-2">
      <div className="flex justify-between">
        <span className="text-sm">{label}</span>
        <span className="text-sm">{value}/{maxValue} g</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className="h-2.5 rounded-full" style={{ width: `${percentage}%`, backgroundColor: color }}></div>
      </div>
    </div>
  );
};

export default NutrientProgress;
