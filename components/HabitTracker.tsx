import React, { useState, useRef, useEffect } from 'react';
import { Check, Edit2, Save, X } from 'lucide-react';
import { Habit } from '../types';

interface HabitTrackerProps {
  habits: Habit[];
  onToggle: (id: string, dayIndex: number) => void;
  onEdit: (id: string, newName: string) => void;
  t: any;
}

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export const HabitTracker: React.FC<HabitTrackerProps> = ({ habits, onToggle, onEdit, t }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
        inputRef.current.focus();
    }
  }, [editingId]);

  const startEditing = (habit: Habit) => {
    setEditingId(habit.id);
    setTempName(habit.name);
  };

  const saveEdit = () => {
    if (editingId && tempName.trim()) {
        onEdit(editingId, tempName);
    }
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
        saveEdit();
    } else if (e.key === 'Escape') {
        cancelEdit();
    }
  };

  // Common grid style to ensure alignment between header and rows
  // minmax(160px, 2fr) ensures the text column never gets smaller than 160px
  const gridStyle = "grid grid-cols-[minmax(160px,2fr)_repeat(7,1fr)] gap-2";

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-emerald-100 dark:border-slate-700 overflow-x-auto transition-colors">
      <div className="flex justify-between items-center mb-4 sticky left-0">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">{t.habitTracker}</h3>
        <span className="text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full">{t.week} 42</span>
      </div>
      
      {/* Increased min-width from 300px to 600px to prevent squeezing on mobile */}
      <div className="min-w-[600px]">
        <div className={`${gridStyle} mb-3 border-b border-gray-100 dark:border-slate-700 pb-2`}>
          <div className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider pl-8">{t.habit}</div>
          {DAYS.map((d, i) => (
            <div key={i} className="text-center text-xs font-medium text-gray-400 dark:text-gray-500">{d}</div>
          ))}
        </div>

        <div className="space-y-3">
          {habits.map((habit) => (
            <div key={habit.id} className={`${gridStyle} items-center group`}>
              <div className="flex items-center gap-2 min-w-0 pr-2">
                 {editingId === habit.id ? (
                     <div className="flex items-center gap-1 w-full">
                         <input 
                            ref={inputRef}
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            onBlur={saveEdit}
                            onKeyDown={handleKeyDown}
                            className="flex-1 text-sm border border-emerald-300 dark:border-emerald-600 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-100"
                         />
                     </div>
                 ) : (
                    <>
                        <button 
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                startEditing(habit);
                            }}
                            className="text-gray-300 hover:text-emerald-500 dark:text-gray-600 dark:hover:text-emerald-400 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 shrink-0"
                            title={t.editHabitPrompt}
                        >
                            <Edit2 size={16} />
                        </button>
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-200 break-words whitespace-normal leading-tight">
                            {habit.name}
                        </div>
                    </>
                 )}
              </div>
              
              {habit.days.map((completed, dayIndex) => (
                <button
                  key={dayIndex}
                  onClick={() => onToggle(habit.id, dayIndex)}
                  className={`
                    w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 shrink-0 mx-auto
                    ${completed 
                      ? 'bg-emerald-500 dark:bg-emerald-600 text-white shadow-sm scale-100' 
                      : 'bg-gray-50 dark:bg-slate-700 hover:bg-emerald-100 dark:hover:bg-slate-600 scale-90'}
                  `}
                >
                  {completed && <Check size={16} strokeWidth={3} />}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};