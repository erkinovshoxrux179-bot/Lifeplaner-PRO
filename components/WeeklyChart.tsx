import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DayProgress } from '../types';

interface WeeklyChartProps {
  data: DayProgress[];
  title: string;
  isDark?: boolean;
}

export const WeeklyChart: React.FC<WeeklyChartProps> = ({ data, title, isDark = false }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-emerald-100 dark:border-slate-700 flex flex-col h-full transition-colors">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">{title}</h3>
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 12 }} 
              dy={10}
            />
            <Tooltip 
              cursor={{ fill: isDark ? '#334155' : '#ecfdf5' }}
              contentStyle={{ 
                  borderRadius: '8px', 
                  border: 'none', 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  backgroundColor: isDark ? '#1e293b' : '#fff',
                  color: isDark ? '#fff' : '#000'
              }}
            />
            <Bar dataKey="score" radius={[6, 6, 6, 6]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.score > 80 ? '#10b981' : (isDark ? '#34d399' : '#6ee7b7')} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};