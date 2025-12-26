import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle2, Circle, Plus, Edit2 } from 'lucide-react';
import { Task } from '../types';

interface TaskListProps {
  title: string;
  tasks: Task[];
  onToggle: (id: string) => void;
  onAdd: () => void;
  onEditTask: (id: string, newText: string) => void;
  onCategoryChange?: (id: string, newCategory: string) => void;
  t: any;
}

export const TaskList: React.FC<TaskListProps> = ({ title, tasks, onToggle, onAdd, onEditTask, onCategoryChange, t }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempText, setTempText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
      if (editingId && inputRef.current) {
          inputRef.current.focus();
      }
  }, [editingId]);

  const startEditing = (task: Task) => {
      setEditingId(task.id);
      setTempText(task.text);
  };

  const saveEdit = () => {
      if (editingId && tempText.trim()) {
          onEditTask(editingId, tempText);
      }
      setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
          saveEdit();
      } else if (e.key === 'Escape') {
          setEditingId(null);
      }
  };

  const handleCategoryClick = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    if (!onCategoryChange) return;
    
    const newCategory = prompt(t.editTagPrompt, task.category || "");
    if (newCategory !== null && newCategory.trim() !== "") {
      onCategoryChange(task.id, newCategory.trim());
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-emerald-100 dark:border-slate-700 h-full flex flex-col transition-colors">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">{title}</h3>
        <button onClick={onAdd} className="text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-700 p-1 rounded-full transition-colors">
            <Plus size={20} />
        </button>
      </div>
      
      <div className="flex-1 space-y-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
        {tasks.map((task) => (
          <div 
            key={task.id} 
            className={`
              group flex items-center gap-3 p-3 rounded-xl transition-all border
              ${task.completed 
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30' 
                : 'bg-white dark:bg-slate-700/50 border-gray-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-slate-600 hover:shadow-sm'}
            `}
          >
            <div 
                onClick={() => onToggle(task.id)}
                className={`
                  text-emerald-500 dark:text-emerald-400 transition-transform duration-300 cursor-pointer
                  ${task.completed ? 'scale-110' : 'scale-100 group-hover:scale-110'}
                `}
            >
              {task.completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {editingId === task.id ? (
                     <input 
                        ref={inputRef}
                        value={tempText}
                        onChange={(e) => setTempText(e.target.value)}
                        onBlur={saveEdit}
                        onKeyDown={handleKeyDown}
                        className="flex-1 text-sm border border-emerald-300 dark:border-emerald-600 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100"
                        onClick={(e) => e.stopPropagation()}
                     />
                ) : (
                    <>
                        <p 
                            onClick={() => onToggle(task.id)}
                            className={`text-sm font-medium transition-colors truncate flex-1 cursor-pointer ${task.completed ? 'text-emerald-800 dark:text-emerald-400 line-through opacity-70' : 'text-gray-700 dark:text-gray-200'}`}
                        >
                            {task.text}
                        </p>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                startEditing(task);
                            }}
                            className="text-gray-300 hover:text-emerald-500 dark:text-gray-600 dark:hover:text-emerald-400 transition-all p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-600"
                            title={t.editTaskPrompt}
                        >
                            <Edit2 size={16} />
                        </button>
                    </>
                )}
              </div>
              
              {task.category && (
                <div className="flex items-center gap-1 group/tag">
                    <span 
                      onClick={(e) => handleCategoryClick(e, task)}
                      title="Click to edit tag"
                      className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-400 bg-gray-50 dark:bg-slate-600 px-2 py-0.5 rounded-full mt-1 inline-block hover:bg-emerald-100 dark:hover:bg-emerald-900/40 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800 cursor-pointer"
                    >
                      {task.category}
                    </span>
                </div>
              )}
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
            <div className="text-center text-gray-400 text-sm py-8">{t.noTasks}</div>
        )}
      </div>
    </div>
  );
};