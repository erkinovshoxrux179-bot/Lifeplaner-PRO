export interface Task {
  id: string;
  text: string;
  completed: boolean;
  category?: string;
}

export interface Habit {
  id: string;
  name: string;
  days: boolean[]; // Array representing Mon-Sun
}

export interface DayProgress {
  name: string;
  score: number;
}
