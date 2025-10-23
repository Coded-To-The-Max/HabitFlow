import React from 'react';
import { Habit, HabitCompletion, HabitStreak } from '../../types/habit';
import { DateUtils } from '../../utils/dates';
import { getCategoryIcon, getHabitIcon } from '../../utils/icons';
import { Check, Trash2, Flame } from 'lucide-react';
import clsx from 'clsx';

interface HabitListProps {
  habits: Habit[];
  completions: HabitCompletion[];
  streaks: HabitStreak[];
  onToggleHabit: (habitId: string, completed: boolean) => void;
  onDeleteHabit: (habitId: string) => void;
}

const HabitList: React.FC<HabitListProps> = ({ 
  habits, 
  completions, 
  streaks, 
  onToggleHabit, 
  onDeleteHabit 
}) => {
  const today = DateUtils.today();
  const activeHabits = habits.filter(h => h.isActive);

  const getHabitCompletion = (habitId: string) => {
    return completions.find(c => c.habitId === habitId && c.date === today);
  };

  const getHabitStreak = (habitId: string) => {
    return streaks.find(s => s.habitId === habitId);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      health: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      fitness: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      learning: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      productivity: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      mindfulness: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      social: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
      creativity: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      career: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
      personal: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
      other: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    };
    return colors[category] || colors.other;
  };

  if (activeHabits.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Today's Habits
      </h2>
      
      {activeHabits.map(habit => {
        const completion = getHabitCompletion(habit.id);
        const streak = getHabitStreak(habit.id);
        const isCompleted = completion?.completed || false;
        const HabitIcon = getHabitIcon(habit.icon);
        const currentStreak = streak?.currentStreak || 0;

        return (
          <div key={habit.id} className="habit-card group">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <button
                  onClick={() => onToggleHabit(habit.id, !isCompleted)}
                  className={clsx(
                    'habit-complete-btn',
                    isCompleted ? 'completed' : 'incomplete'
                  )}
                >
                  {isCompleted && <Check className="w-4 h-4" />}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <HabitIcon className="w-4 h-4 text-gray-500" />
                    <h3 className={clsx(
                      'font-medium text-sm',
                      isCompleted 
                        ? 'text-gray-500 dark:text-gray-400 line-through' 
                        : 'text-gray-900 dark:text-white'
                    )}>
                      {habit.name}
                    </h3>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={clsx('category-badge', getCategoryColor(habit.category))}>
                      {habit.category}
                    </span>
                    
                    {currentStreak > 0 && (
                      <div className="flex items-center space-x-1 streak-indicator">
                        <Flame className="w-3 h-3" />
                        <span>{currentStreak}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => onDeleteHabit(habit.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all duration-200"
                title="Delete habit"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            {habit.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 ml-11">
                {habit.description}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default HabitList;