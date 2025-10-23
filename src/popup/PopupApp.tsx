import React, { useState, useEffect } from 'react';
import { Habit, HabitCompletion, HabitStreak, Settings } from '../types/habit';
import { StorageService } from '../utils/storage';
import { DateUtils } from '../utils/dates';
import Header from './components/Header';
import HabitList from './components/HabitList';
import QuickStats from './components/QuickStats';
import AddHabitModal from './components/AddHabitModal';
import SettingsModal from './components/SettingsModal';
import { Plus, Target } from 'lucide-react';

const PopupApp: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [streaks, setStreaks] = useState<HabitStreak[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Handle theme changes
  useEffect(() => {
    if (settings) {
      const root = document.documentElement;
      if (settings.theme === 'dark' || 
          (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [settings]);

  const loadData = async () => {
    try {
      const [habitsData, completionsData, streaksData, settingsData] = await Promise.all([
        StorageService.getHabits(),
        StorageService.getCompletions(),
        StorageService.getStreaks(),
        StorageService.getSettings()
      ]);

      setHabits(habitsData);
      setCompletions(completionsData);
      setStreaks(streaksData);
      setSettings(settingsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleHabit = async (habitId: string, completed: boolean) => {
    const today = DateUtils.today();
    
    try {
      // Update completion
      const completion: HabitCompletion = {
        habitId,
        date: today,
        completed,
        completedAt: completed ? new Date() : undefined
      };

      await StorageService.saveCompletion(completion);

      // Update streak
      const habitCompletions = await StorageService.getHabitCompletions(habitId);
      const streakData = DateUtils.calculateStreak(habitCompletions);
      
      const streak: HabitStreak = {
        habitId,
        currentStreak: streakData.currentStreak,
        longestStreak: streakData.longestStreak,
        lastCompletedDate: completed ? today : undefined
      };

      await StorageService.saveStreak(streak);

      // Reload data
      loadData();

      // Play completion sound if enabled
      if (completed && settings?.soundEffects) {
        // Chrome extension can't play audio directly, but we could trigger a notification
        if (settings.notifications) {
          chrome.notifications.create({
            type: 'basic',
            iconUrl: '/icons/icon48.png',
            title: 'Habit Completed! 🎉',
            message: `Great job completing your habit!`
          });
        }
      }
    } catch (error) {
      console.error('Error toggling habit:', error);
    }
  };

  const handleAddHabit = async (habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newHabit: Habit = {
        ...habit,
        id: `habit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await StorageService.saveHabit(newHabit);
      
      // Set up reminders if enabled
      if (newHabit.notifications && newHabit.reminderTimes.length > 0) {
        newHabit.reminderTimes.forEach(time => {
          const [hours, minutes] = time.split(':').map(Number);
          const reminderTime = new Date();
          reminderTime.setHours(hours, minutes, 0, 0);
          
          chrome.runtime.sendMessage({
            action: 'setReminder',
            habitId: newHabit.id,
            time: reminderTime.getTime()
          });
        });
      }

      loadData();
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding habit:', error);
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    try {
      await StorageService.deleteHabit(habitId);
      
      // Clear reminders
      chrome.runtime.sendMessage({
        action: 'clearReminder',
        habitId
      });

      loadData();
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const handleUpdateSettings = async (newSettings: Partial<Settings>) => {
    try {
      await StorageService.saveSettings(newSettings);
      loadData();
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const openFullDashboard = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') });
  };

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header 
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenDashboard={openFullDashboard}
        settings={settings}
      />
      
      <div className="p-4 space-y-4">
        <QuickStats 
          habits={habits}
          completions={completions}
          streaks={streaks}
        />
        
        <HabitList 
          habits={habits}
          completions={completions}
          streaks={streaks}
          onToggleHabit={handleToggleHabit}
          onDeleteHabit={handleDeleteHabit}
        />
        
        {habits.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <Target className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">No habits yet</p>
              <p className="text-xs text-gray-500">Add your first habit to get started!</p>
            </div>
          </div>
        )}
      </div>

      {/* Add Habit Button */}
      <button 
        onClick={() => setShowAddModal(true)}
        className="floating-button"
        title="Add New Habit"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Modals */}
      {showAddModal && (
        <AddHabitModal 
          onSave={handleAddHabit}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {showSettingsModal && settings && (
        <SettingsModal 
          settings={settings}
          onSave={handleUpdateSettings}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </div>
  );
};

export default PopupApp;