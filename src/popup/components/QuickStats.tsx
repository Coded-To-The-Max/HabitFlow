import React from 'react';
import { Habit, HabitCompletion, HabitStreak } from '../../types/habit';
import { DateUtils } from '../../utils/dates';
import { TrendingUp, Target, Flame } from 'lucide-react';

interface QuickStatsProps {
  habits: Habit[];
  completions: HabitCompletion[];
  streaks: HabitStreak[];
}

const QuickStats: React.FC<QuickStatsProps> = ({ habits, completions, streaks }) => {
  const today = DateUtils.today();
  
  // Calculate today's completion rate
  const todaysCompletions = completions.filter(c => c.date === today && c.completed);
  const activeHabits = habits.filter(h => h.isActive);
  const completionRate = activeHabits.length > 0 ? (todaysCompletions.length / activeHabits.length) * 100 : 0;
  
  // Calculate total streak
  const totalCurrentStreak = streaks.reduce((sum, streak) => sum + streak.currentStreak, 0);
  
  // Calculate weekly progress
  const weekDays = DateUtils.getWeekDays();
  const weekCompletions = completions.filter(c => 
    weekDays.some(day => DateUtils.formatDate(day) === c.date) && c.completed
  );
  const possibleWeekCompletions = activeHabits.length * weekDays.length;
  const weeklyProgress = possibleWeekCompletions > 0 ? (weekCompletions.length / possibleWeekCompletions) * 100 : 0;

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Today</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {Math.round(completionRate)}%
            </p>
          </div>
          <Target className="w-5 h-5 text-primary-500" />
        </div>
        <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
          <div 
            className="bg-primary-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Streak</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {totalCurrentStreak}
            </p>
          </div>
          <Flame className="w-5 h-5 text-orange-500" />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Total days
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">This Week</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {Math.round(weeklyProgress)}%
            </p>
          </div>
          <TrendingUp className="w-5 h-5 text-success-500" />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {weekCompletions.length}/{possibleWeekCompletions}
        </p>
      </div>
    </div>
  );
};

export default QuickStats;