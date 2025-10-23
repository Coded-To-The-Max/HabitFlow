import React, { useState } from 'react';
import { Settings } from '../../types/habit';
import { X, Sun, Moon, Monitor, Bell, BellOff, Volume2, VolumeX, Sparkles } from 'lucide-react';
import clsx from 'clsx';

interface SettingsModalProps {
  settings: Settings;
  onSave: (settings: Partial<Settings>) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onSave, onClose }) => {
  const [formData, setFormData] = useState(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Settings
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* Theme */}
          <div>
            <label className="form-label">Theme</label>
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map(theme => {
                const Icon = theme.icon;
                return (
                  <button
                    key={theme.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, theme: theme.value as any }))}
                    className={clsx(
                      'p-3 rounded-lg border text-center transition-colors duration-200',
                      formData.theme === theme.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    )}
                  >
                    <Icon className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-sm">{theme.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notifications */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Notifications
            </h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {formData.notifications ? (
                  <Bell className="w-5 h-5 text-primary-500" />
                ) : (
                  <BellOff className="w-5 h-5 text-gray-400" />
                )}
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Habit Reminders
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Get notified when it's time for your habits
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.notifications}
                onChange={(e) => setFormData(prev => ({ ...prev, notifications: e.target.checked }))}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {formData.soundEffects ? (
                  <Volume2 className="w-5 h-5 text-primary-500" />
                ) : (
                  <VolumeX className="w-5 h-5 text-gray-400" />
                )}
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Sound Effects
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Play sounds when completing habits
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.soundEffects}
                onChange={(e) => setFormData(prev => ({ ...prev, soundEffects: e.target.checked }))}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    AI Insights
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Get personalized habit insights and suggestions
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.aiInsights}
                onChange={(e) => setFormData(prev => ({ ...prev, aiInsights: e.target.checked }))}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Week Settings */}
          <div>
            <label className="form-label">Week Starts On</label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, weekStartsOn: 0 }))}
                className={clsx(
                  'flex-1 p-2 rounded-lg border text-sm transition-colors duration-200',
                  formData.weekStartsOn === 0
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                )}
              >
                Sunday
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, weekStartsOn: 1 }))}
                className={clsx(
                  'flex-1 p-2 rounded-lg border text-sm transition-colors duration-200',
                  formData.weekStartsOn === 1
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                )}
              >
                Monday
              </button>
            </div>
          </div>

          {/* Sync Settings */}
          <div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Cloud Sync
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Coming soon - sync across devices
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.syncEnabled}
                disabled
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 opacity-50"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;