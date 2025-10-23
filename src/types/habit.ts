export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  color: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  notifications: boolean;
  reminderTimes: string[]; // ['09:00', '18:00']
  targetDays: number[]; // [1,2,3,4,5] for weekdays, [0,1,2,3,4,5,6] for all days
}

export interface HabitCompletion {
  habitId: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
  completedAt?: Date;
  notes?: string;
}

export interface HabitStreak {
  habitId: string;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate?: string;
}

export type HabitCategory = 
  | 'health'
  | 'fitness'
  | 'learning'
  | 'productivity'
  | 'mindfulness'
  | 'social'
  | 'creativity'
  | 'career'
  | 'personal'
  | 'other';

export type HabitFrequency = 
  | 'daily'
  | 'weekly'
  | 'custom';

export interface HabitInsight {
  habitId: string;
  type: 'suggestion' | 'motivation' | 'timing' | 'streak' | 'improvement';
  message: string;
  confidence: number; // 0-1
  generatedAt: Date;
  actionable?: boolean;
}

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  aiInsights: boolean;
  soundEffects: boolean;
  weekStartsOn: 0 | 1; // 0 = Sunday, 1 = Monday
  language: string;
  syncEnabled: boolean;
  lastSyncAt?: Date;
}

export interface HabitStats {
  habitId: string;
  totalCompletions: number;
  completionRate: number; // 0-100
  averageCompletionsPerWeek: number;
  bestStreak: number;
  currentStreak: number;
  missedDaysThisWeek: number;
  consistencyScore: number; // 0-100
}