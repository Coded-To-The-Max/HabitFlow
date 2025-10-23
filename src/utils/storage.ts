import { Habit, HabitCompletion, HabitStreak, HabitInsight, Settings, HabitStats } from '../types/habit';

export class StorageService {
  // Generic storage methods
  static async get<T>(key: string): Promise<T | null> {
    return new Promise((resolve) => {
      chrome.storage.local.get([key], (result) => {
        resolve(result[key] || null);
      });
    });
  }

  static async set<T>(key: string, value: T): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, () => {
        resolve();
      });
    });
  }

  static async remove(key: string): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.remove([key], () => {
        resolve();
      });
    });
  }

  // Habit-specific methods
  static async getHabits(): Promise<Habit[]> {
    const habits = await this.get<Habit[]>('habits');
    return habits || [];
  }

  static async saveHabit(habit: Habit): Promise<void> {
    const habits = await this.getHabits();
    const index = habits.findIndex(h => h.id === habit.id);
    
    if (index >= 0) {
      habits[index] = { ...habit, updatedAt: new Date() };
    } else {
      habits.push(habit);
    }
    
    await this.set('habits', habits);
  }

  static async deleteHabit(habitId: string): Promise<void> {
    const habits = await this.getHabits();
    const filteredHabits = habits.filter(h => h.id !== habitId);
    await this.set('habits', filteredHabits);
    
    // Clean up related data
    await this.removeHabitCompletions(habitId);
    await this.removeHabitStreak(habitId);
    await this.removeHabitInsights(habitId);
  }

  // Completion methods
  static async getCompletions(): Promise<HabitCompletion[]> {
    const completions = await this.get<HabitCompletion[]>('completions');
    return completions || [];
  }

  static async getHabitCompletions(habitId: string): Promise<HabitCompletion[]> {
    const completions = await this.getCompletions();
    return completions.filter(c => c.habitId === habitId);
  }

  static async saveCompletion(completion: HabitCompletion): Promise<void> {
    const completions = await this.getCompletions();
    const index = completions.findIndex(c => 
      c.habitId === completion.habitId && c.date === completion.date
    );
    
    if (index >= 0) {
      completions[index] = completion;
    } else {
      completions.push(completion);
    }
    
    await this.set('completions', completions);
  }

  static async removeHabitCompletions(habitId: string): Promise<void> {
    const completions = await this.getCompletions();
    const filteredCompletions = completions.filter(c => c.habitId !== habitId);
    await this.set('completions', filteredCompletions);
  }

  // Streak methods
  static async getStreaks(): Promise<HabitStreak[]> {
    const streaks = await this.get<HabitStreak[]>('streaks');
    return streaks || [];
  }

  static async getHabitStreak(habitId: string): Promise<HabitStreak | null> {
    const streaks = await this.getStreaks();
    return streaks.find(s => s.habitId === habitId) || null;
  }

  static async saveStreak(streak: HabitStreak): Promise<void> {
    const streaks = await this.getStreaks();
    const index = streaks.findIndex(s => s.habitId === streak.habitId);
    
    if (index >= 0) {
      streaks[index] = streak;
    } else {
      streaks.push(streak);
    }
    
    await this.set('streaks', streaks);
  }

  static async removeHabitStreak(habitId: string): Promise<void> {
    const streaks = await this.getStreaks();
    const filteredStreaks = streaks.filter(s => s.habitId !== habitId);
    await this.set('streaks', filteredStreaks);
  }

  // Insights methods
  static async getInsights(): Promise<HabitInsight[]> {
    const insights = await this.get<HabitInsight[]>('insights');
    return insights || [];
  }

  static async saveInsight(insight: HabitInsight): Promise<void> {
    const insights = await this.getInsights();
    insights.push(insight);
    
    // Keep only recent insights (last 50)
    insights.sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime());
    const recentInsights = insights.slice(0, 50);
    
    await this.set('insights', recentInsights);
  }

  static async removeHabitInsights(habitId: string): Promise<void> {
    const insights = await this.getInsights();
    const filteredInsights = insights.filter(i => i.habitId !== habitId);
    await this.set('insights', filteredInsights);
  }

  // Settings methods
  static async getSettings(): Promise<Settings> {
    const defaultSettings: Settings = {
      theme: 'light',
      notifications: true,
      aiInsights: true,
      soundEffects: true,
      weekStartsOn: 1,
      language: 'en',
      syncEnabled: false
    };
    
    const settings = await this.get<Settings>('settings');
    return { ...defaultSettings, ...settings };
  }

  static async saveSettings(settings: Partial<Settings>): Promise<void> {
    const currentSettings = await this.getSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    await this.set('settings', updatedSettings);
  }

  // Stats calculation
  static async calculateHabitStats(habitId: string): Promise<HabitStats> {
    const completions = await this.getHabitCompletions(habitId);
    const streak = await this.getHabitStreak(habitId);
    
    const totalCompletions = completions.filter(c => c.completed).length;
    const totalDays = completions.length;
    const completionRate = totalDays > 0 ? (totalCompletions / totalDays) * 100 : 0;
    
    // Calculate weekly average (last 4 weeks)
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
    const recentCompletions = completions.filter(c => 
      new Date(c.date) >= fourWeeksAgo && c.completed
    );
    const averageCompletionsPerWeek = recentCompletions.length / 4;
    
    // Calculate missed days this week
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const thisWeekCompletions = completions.filter(c => 
      new Date(c.date) >= weekStart
    );
    const missedDaysThisWeek = thisWeekCompletions.filter(c => !c.completed).length;
    
    // Consistency score based on recent completion rate and streak
    const recentCompletionRate = recentCompletions.length / Math.min(28, totalDays);
    const streakBonus = streak ? Math.min(streak.currentStreak / 30, 0.3) : 0;
    const consistencyScore = Math.min((recentCompletionRate * 70) + (streakBonus * 30), 100);
    
    return {
      habitId,
      totalCompletions,
      completionRate,
      averageCompletionsPerWeek,
      bestStreak: streak?.longestStreak || 0,
      currentStreak: streak?.currentStreak || 0,
      missedDaysThisWeek,
      consistencyScore
    };
  }
}