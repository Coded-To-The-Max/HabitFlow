import React, { useState, useEffect } from 'react';
import { Habit, HabitCompletion, HabitStreak, Settings, HabitInsight } from '../types/habit';
import { StorageService } from '../utils/storage';
import { AIService } from '../services/aiService';
import { ArrowLeft, Sparkles, TrendingUp, Calendar, BarChart3 } from 'lucide-react';

const DashboardApp: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [streaks, setStreaks] = useState<HabitStreak[]>([]);
  const [insights, setInsights] = useState<HabitInsight[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingInsights, setLoadingInsights] = useState(false);

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
      const [habitsData, completionsData, streaksData, settingsData, insightsData] = await Promise.all([
        StorageService.getHabits(),
        StorageService.getCompletions(),
        StorageService.getStreaks(),
        StorageService.getSettings(),
        StorageService.getInsights()
      ]);

      setHabits(habitsData);
      setCompletions(completionsData);
      setStreaks(streaksData);
      setSettings(settingsData);
      setInsights(insightsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = async () => {
    if (!settings?.aiInsights) return;
    
    setLoadingInsights(true);
    try {
      const stats = await Promise.all(
        habits.map(habit => StorageService.calculateHabitStats(habit.id))
      );
      
      const newInsights = await AIService.generateHabitInsights(
        habits,
        completions,
        streaks,
        stats
      );

      // Save insights
      for (const insight of newInsights) {
        await StorageService.saveInsight(insight);
      }

      setInsights(await StorageService.getInsights());
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setLoadingInsights(false);
    }
  };

  const goBackToPopup = () => {
    window.close();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={goBackToPopup}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  HabitFlow Dashboard
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your complete habit tracking overview
                </p>
              </div>
            </div>
            
            {settings?.aiInsights && (
              <button
                onClick={generateInsights}
                disabled={loadingInsights}
                className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loadingInsights ? 'Generating...' : 'Generate AI Insights'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-primary-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Habits</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{habits.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-success-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Streaks</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {streaks.filter(s => s.currentStreak > 0).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Best Streak</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {Math.max(...streaks.map(s => s.longestStreak), 0)} days
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Sparkles className="w-8 h-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">AI Insights</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{insights.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        {insights.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              AI Insights & Suggestions
            </h2>
            <div className="space-y-4">
              {insights.slice(0, 5).map((insight, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`
                      w-2 h-2 rounded-full mt-2 flex-shrink-0
                      ${insight.type === 'suggestion' ? 'bg-blue-500' : 
                        insight.type === 'motivation' ? 'bg-green-500' : 
                        'bg-orange-500'}
                    `} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {insight.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)} • 
                        Confidence: {Math.round(insight.confidence * 100)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Habit Overview */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Habit Overview
          </h2>
          
          {habits.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700 text-center">
              <div className="text-gray-400 mb-4">
                <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm">No habits yet</p>
                <p className="text-xs text-gray-500">
                  Close this dashboard and add your first habit from the popup!
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  All Habits ({habits.length})
                </h3>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {habits.map(habit => {
                  const streak = streaks.find(s => s.habitId === habit.id);
                  const habitCompletions = completions.filter(c => c.habitId === habit.id);
                  const completedCount = habitCompletions.filter(c => c.completed).length;
                  const completionRate = habitCompletions.length > 0 
                    ? (completedCount / habitCompletions.length) * 100 
                    : 0;

                  return (
                    <div key={habit.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: habit.color }}
                          />
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                              {habit.name}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {habit.category} • Created {habit.createdAt.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm">
                          <div className="text-center">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {streak?.currentStreak || 0}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Current Streak
                            </p>
                          </div>
                          
                          <div className="text-center">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {streak?.longestStreak || 0}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Best Streak
                            </p>
                          </div>
                          
                          <div className="text-center">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {Math.round(completionRate)}%
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Completion Rate
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Coming Soon Features */}
        <div className="mt-8 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-primary-200 dark:border-primary-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Coming Soon
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We're working on exciting new features for your dashboard:
          </p>
          <ul className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
            <li>• Calendar heatmap view</li>
            <li>• Detailed analytics & charts</li>
            <li>• Habit streak visualizations</li>
            <li>• Weekly/monthly reports</li>
            <li>• Gamification badges</li>
            <li>• Cloud sync & backup</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardApp;