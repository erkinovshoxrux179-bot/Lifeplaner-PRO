import React from 'react';

interface CircularProgressProps {
  percentage: number;
  label: string;
  subLabel?: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({ 
  percentage, 
  label, 
  subLabel,
  size = 180, 
  strokeWidth = 15,
  color = "text-emerald-500"
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-emerald-100 dark:border-slate-700 relative transition-colors">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            className="text-emerald-100 dark:text-slate-700"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className={`${color} transition-all duration-1000 ease-out`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-gray-800 dark:text-white">{percentage}%</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">{subLabel}</span>
        </div>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-200">{label}</h3>
    </div>
  );
};