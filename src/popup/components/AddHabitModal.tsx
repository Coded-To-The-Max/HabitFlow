import React, { useState } from 'react';
import { Habit, HabitCategory, HabitFrequency } from '../../types/habit';
import { habitIcons, getCategoryIcon } from '../../utils/icons';
import { X, Clock } from 'lucide-react';
import clsx from 'clsx';

interface AddHabitModalProps {
  onSave: (habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}

const categories: { value: HabitCategory; label: string; description: string }[] = [
  { value: 'health', label: 'Health', description: 'Nutrition, wellness, medical' },
  { value: 'fitness', label: 'Fitness', description: 'Exercise, sports, movement' },
  { value: 'learning', label: 'Learning', description: 'Study, reading, skills' },
  { value: 'productivity', label: 'Productivity', description: 'Work, focus, organization' },
  { value: 'mindfulness', label: 'Mindfulness', description: 'Meditation, reflection' },
  { value: 'social', label: 'Social', description: 'Relationships, community' },
  { value: 'creativity', label: 'Creativity', description: 'Art, music, writing' },
  { value: 'career', label: 'Career', description: 'Professional development' },
  { value: 'personal', label: 'Personal', description: 'Self-care, hobbies' },
  { value: 'other', label: 'Other', description: 'Custom category' }
];

const iconOptions = Object.keys(habitIcons);

const colors = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#EC4899', '#6B7280', '#06B6D4', '#84CC16', '#F97316'
];

const AddHabitModal: React.FC<AddHabitModalProps> = ({ onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'other' as HabitCategory,
    frequency: 'daily' as HabitFrequency,
    color: colors[0],
    icon: 'default',
    isActive: true,
    notifications: true,
    reminderTimes: ['09:00'],
    targetDays: [1, 2, 3, 4, 5, 6, 0] // All days of week
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Habit name is required';
    }
    
    if (formData.reminderTimes.some(time => !time.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/))) {
      newErrors.reminderTimes = 'Please enter valid times (HH:MM format)';
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onSave(formData);
    }
  };

  const addReminderTime = () => {
    setFormData(prev => ({
      ...prev,
      reminderTimes: [...prev.reminderTimes, '09:00']
    }));
  };

  const removeReminderTime = (index: number) => {
    setFormData(prev => ({
      ...prev,
      reminderTimes: prev.reminderTimes.filter((_, i) => i !== index)
    }));
  };

  const updateReminderTime = (index: number, time: string) => {
    setFormData(prev => ({
      ...prev,
      reminderTimes: prev.reminderTimes.map((t, i) => i === index ? time : t)
    }));
  };

  const toggleTargetDay = (day: number) => {
    setFormData(prev => ({
      ...prev,
      targetDays: prev.targetDays.indexOf(day) !== -1
        ? prev.targetDays.filter(d => d !== day)
        : [...prev.targetDays, day]
    }));
  };

  const CategoryIcon = getCategoryIcon(formData.category);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Add New Habit
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Habit Name */}
          <div>
            <label className="form-label">
              Habit Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={clsx('form-input', errors.name && 'border-red-500')}
              placeholder="e.g., Drink 8 glasses of water"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="form-label">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="form-input resize-none"
              rows={2}
              placeholder="Optional description..."
            />
          </div>

          {/* Category */}
          <div>
            <label className="form-label">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map(category => {
                const Icon = getCategoryIcon(category.value);
                return (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: category.value }))}
                    className={clsx(
                      'p-2 rounded-lg border text-left transition-colors duration-200',
                      formData.category === category.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    )}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4" />
                      <div>
                        <div className="text-sm font-medium">{category.label}</div>
                        <div className="text-xs text-gray-500">{category.description}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Icon & Color */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Icon</label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                className="form-input"
              >
                {iconOptions.map(icon => (
                  <option key={icon} value={icon}>
                    {icon.charAt(0).toUpperCase() + icon.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Color</label>
              <div className="flex space-x-2">
                {colors.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                    className={clsx(
                      'w-8 h-8 rounded-full border-2 transition-all duration-200',
                      formData.color === color
                        ? 'border-gray-800 dark:border-white scale-110'
                        : 'border-gray-300 dark:border-gray-600'
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Notifications & Reminders */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="checkbox"
                id="notifications"
                checked={formData.notifications}
                onChange={(e) => setFormData(prev => ({ ...prev, notifications: e.target.checked }))}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="notifications" className="form-label mb-0">
                Enable notifications
              </label>
            </div>

            {formData.notifications && (
              <div className="space-y-2">
                <label className="form-label">Reminder Times</label>
                {formData.reminderTimes.map((time, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => updateReminderTime(index, e.target.value)}
                      className="form-input flex-1"
                    />
                    {formData.reminderTimes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeReminderTime(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addReminderTime}
                  className="text-primary-500 hover:text-primary-700 text-sm"
                >
                  + Add reminder time
                </button>
              </div>
            )}
          </div>

          {/* Target Days */}
          <div>
            <label className="form-label">Target Days</label>
            <div className="flex space-x-1">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => toggleTargetDay(index)}
                  className={clsx(
                    'w-8 h-8 rounded-full text-xs font-medium transition-colors duration-200',
                    formData.targetDays.indexOf(index) !== -1
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                  )}
                >
                  {day}
                </button>
              ))}
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
              Create Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHabitModal;