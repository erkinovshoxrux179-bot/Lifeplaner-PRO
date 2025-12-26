import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarViewProps {
  locale: string;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ locale = 'en-US' }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  // Adjust for Monday start (0=Sun -> 6, 1=Mon -> 0, etc.)
  const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  // Use the passed locale for formatting
  const monthName = currentDate.toLocaleString(locale, { month: 'long' });
  // Capitalize first letter as some locales return lowercase
  const formattedMonthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  
  const year = currentDate.getFullYear();
  const today = new Date();

  const prevMonth = () => setCurrentDate(new Date(year, currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, currentDate.getMonth() + 1, 1));

  const days = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  // Localize day names (Mon, Tue etc)
  const weekDays = [];
  for(let i=1; i<=7; i++) {
     // Create a dummy date for each day of the week (Jan 1 2024 was a Monday)
     const d = new Date(2024, 0, i); 
     weekDays.push(d.toLocaleString(locale, { weekday: 'narrow' }));
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-emerald-100 dark:border-slate-700 h-full flex flex-col transition-colors">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">{formattedMonthName} {year}</h3>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"><ChevronLeft size={20} className="text-gray-500 dark:text-gray-400"/></button>
          <button onClick={nextMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"><ChevronRight size={20} className="text-gray-500 dark:text-gray-400"/></button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {weekDays.map((d, i) => (
          <div key={i} className="text-xs font-medium text-gray-400 dark:text-gray-500 py-1">{d}</div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1 flex-1 content-start">
        {days.map((d, i) => {
          const isToday = d === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
          return (
            <div key={i} className={`
              aspect-square flex items-center justify-center rounded-lg text-sm transition-all
              ${!d ? '' : 'hover:bg-emerald-50 dark:hover:bg-slate-700 cursor-pointer text-gray-700 dark:text-gray-300 font-medium'}
              ${isToday ? 'bg-emerald-500 dark:bg-emerald-600 text-white shadow-md hover:bg-emerald-600 dark:hover:bg-emerald-500 font-bold' : ''}
            `}>
              {d}
            </div>
          );
        })}
      </div>
    </div>
  );
};