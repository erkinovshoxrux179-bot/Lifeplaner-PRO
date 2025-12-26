import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Download, Menu, Share2, Sparkles, Globe, Moon, Sun } from 'lucide-react';
import { CircularProgress } from './components/CircularProgress';
import { WeeklyChart } from './components/WeeklyChart';
import { HabitTracker } from './components/HabitTracker';
import { TaskList } from './components/TaskList';
import { CalendarView } from './components/CalendarView';
import { Task, Habit } from './types';
import { translations, Language } from './translations';

// Initial Mock Data
const INITIAL_HABITS: Habit[] = [
  { id: '1', name: 'Wake up at 6:00', days: [false, false, false, false, false, false, false] },
  { id: '2', name: 'Read 30 mins', days: [false, false, false, false, false, false, false] },
  { id: '3', name: 'Workout', days: [false, false, false, false, false, false, false] },
  { id: '4', name: 'No Sugar', days: [false, false, false, false, false, false, false] },
  { id: '5', name: 'Code Session', days: [false, false, false, false, false, false, false] },
];

const INITIAL_TASKS: Task[] = [
  { id: '1', text: 'Create development plan', completed: false, category: 'Work' },
  { id: '2', text: 'Analyze marketing report', completed: false, category: 'Work' },
  { id: '3', text: 'Write 10 content ideas', completed: false, category: 'Creative' },
  { id: '4', text: 'Update website portfolio', completed: false, category: 'Dev' },
  { id: '5', text: 'Review gym membership', completed: false, category: 'Personal' },
  { id: '6', text: 'Call Mom', completed: false, category: 'Family' },
];

export default function App() {
  const [lang, setLang] = useState<Language>('uz');
  const [darkMode, setDarkMode] = useState(false);
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  const t = translations[lang];

  // Calculate Progress
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const taskProgress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const totalHabitChecks = habits.reduce((acc, h) => acc + h.days.filter(Boolean).length, 0);
  const possibleHabitChecks = habits.length * 7;
  const habitProgress = Math.round((totalHabitChecks / possibleHabitChecks) * 100);

  const overallScore = Math.round((taskProgress + habitProgress) / 2);

  // Dynamic Weekly Data Calculation
  const weeklyStats = useMemo(() => {
    // 2024-01-01 was a Monday. We use this to generate consistent Mon-Sun labels.
    const baseDate = new Date(2024, 0, 1); 
    return Array.from({ length: 7 }).map((_, index) => {
      // 1. Calculate Score based on Habits
      const totalHabits = habits.length;
      const completedCount = habits.reduce((count, habit) => count + (habit.days[index] ? 1 : 0), 0);
      const score = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;

      // 2. Generate Label based on Locale
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + index);
      const rawName = d.toLocaleDateString(t.locale, { weekday: 'short' });
      // Capitalize first letter
      const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);

      return { name, score };
    });
  }, [habits, t.locale]);

  // Handlers
  const toggleHabit = (id: string, dayIndex: number) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const newDays = [...h.days];
        newDays[dayIndex] = !newDays[dayIndex];
        return { ...h, days: newDays };
      }
      return h;
    }));
  };

  const updateHabitName = (id: string, newName: string) => {
    if (newName && newName.trim()) {
      setHabits(prev => prev.map(h => h.id === id ? { ...h, name: newName.trim() } : h));
    }
  }

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const updateTaskCategory = (id: string, newCategory: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, category: newCategory } : t));
  };

  const updateTaskText = (id: string, newText: string) => {
    if (newText && newText.trim()) {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, text: newText.trim() } : t));
    }
  }

  const addTask = () => {
    const text = prompt(t.newTaskPrompt);
    if (text) {
      setTasks(prev => [...prev, { id: Date.now().toString(), text, completed: false, category: 'General' }]);
    }
  };

  // PWA Install Logic
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
        alert("O'rnatish uchun (To install): Ulashish (Share) tugmasini bosing va 'Ekranga qo'shish' (Add to Home Screen) ni tanlang.");
        return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-[#F1F5F9] dark:bg-slate-900 pb-20 md:pb-8 transition-colors duration-300">
        {/* Top Navigation */}
        <nav className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-2">
                <div className="bg-emerald-500 p-2 rounded-lg text-white">
                  <Calendar size={20} />
                </div>
                <span className="font-bold text-xl text-gray-800 dark:text-white tracking-tight">Life<span className="text-emerald-600 dark:text-emerald-400">Plan</span></span>
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                 {/* Language Switcher */}
                <div className="flex items-center bg-gray-50 dark:bg-slate-700 rounded-full px-2 py-1 border border-gray-200 dark:border-slate-600">
                  <Globe size={16} className="text-gray-400 dark:text-gray-300 mr-2" />
                  <select 
                      value={lang} 
                      onChange={(e) => setLang(e.target.value as Language)}
                      className="bg-transparent border-none text-sm text-gray-700 dark:text-gray-200 font-medium focus:ring-0 cursor-pointer outline-none"
                  >
                      <option value="uz" className="dark:bg-slate-800">O'zbek</option>
                      <option value="en" className="dark:bg-slate-800">English</option>
                      <option value="ru" className="dark:bg-slate-800">Русский</option>
                  </select>
                </div>

                {/* Dark Mode Toggle */}
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 bg-gray-50 dark:bg-slate-700 rounded-full border border-gray-200 dark:border-slate-600 transition-colors"
                  title="Toggle Theme"
                >
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <button 
                  onClick={handleInstallClick}
                  className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-2 md:px-4 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors border border-transparent dark:border-emerald-800"
                >
                  {isInstallable ? <Download size={16} /> : <Share2 size={16} />}
                  <span className="hidden sm:inline">{isInstallable ? t.install : t.share}</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          
          {/* Inspiration Banner */}
          <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 dark:from-emerald-950 dark:to-emerald-900 rounded-2xl p-6 sm:p-10 text-white relative overflow-hidden shadow-lg">
            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center gap-2 text-emerald-300 mb-2">
                <Sparkles size={16} />
                <span className="text-sm font-medium uppercase tracking-wider">{t.quoteTitle}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-light leading-tight">
                "{t.quoteBody}"
              </h1>
              <p className="mt-4 text-emerald-100/80 font-mono text-sm">{t.quoteTarget}</p>
            </div>
            {/* Abstract Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Overall Progress Gauge */}
            <div className="lg:col-span-1">
              <CircularProgress 
                percentage={overallScore} 
                label={t.overallProgress} 
                subLabel={t.productivity}
                color={overallScore > 75 ? "text-emerald-500 dark:text-emerald-400" : overallScore > 40 ? "text-emerald-400" : "text-yellow-400"}
              />
            </div>

            {/* Weekly Chart */}
            <div className="lg:col-span-2 h-64 md:h-auto">
              <WeeklyChart data={weeklyStats} title={t.weeklyFocus} isDark={darkMode} />
            </div>

            {/* Task Summary / Mini Stat */}
            <div className="lg:col-span-1 grid grid-rows-2 gap-6">
               <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-emerald-100 dark:border-slate-700 shadow-sm flex flex-col justify-center transition-colors">
                  <span className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{t.tasksCompleted}</span>
                  <div className="flex items-end gap-2">
                     <span className="text-4xl font-bold text-gray-800 dark:text-white">{completedTasks}</span>
                     <span className="text-gray-400 dark:text-gray-500 mb-1">/ {totalTasks}</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-slate-700 h-2 rounded-full mt-3 overflow-hidden">
                     <div className="bg-emerald-500 dark:bg-emerald-400 h-full rounded-full" style={{ width: `${taskProgress}%` }}></div>
                  </div>
               </div>
               <div className="bg-emerald-50 dark:bg-slate-800 p-6 rounded-2xl border border-emerald-100 dark:border-slate-700 shadow-sm flex flex-col justify-center relative overflow-hidden transition-colors">
                  <span className="text-emerald-800 dark:text-emerald-400 text-sm font-medium mb-1 z-10">{t.streak}</span>
                  <span className="text-4xl font-bold text-emerald-900 dark:text-emerald-100 z-10">12 {t.days}</span>
                  <Sparkles className="absolute right-4 bottom-4 text-emerald-200 dark:text-slate-700" size={48} />
               </div>
            </div>
          </div>

          {/* Bottom Section: Calendar, Habits, Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Calendar (1 Col) */}
            <div className="lg:col-span-1 min-h-[300px]">
              <CalendarView locale={t.locale} />
            </div>
            
            {/* Habits (2 Cols) */}
            <div className="lg:col-span-2">
              <HabitTracker 
                habits={habits} 
                onToggle={toggleHabit} 
                onEdit={updateHabitName}
                t={t}
              />
            </div>

            {/* Tasks (1 Col) */}
            <div className="lg:col-span-1">
              <TaskList 
                title={t.tasksTitle} 
                tasks={tasks} 
                onToggle={toggleTask} 
                onAdd={addTask}
                onEditTask={updateTaskText}
                onCategoryChange={updateTaskCategory}
                t={t}
              />
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}