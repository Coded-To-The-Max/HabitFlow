import React from 'react';
import { Settings as SettingsIcon, ExternalLink, Sun, Moon } from 'lucide-react';
import { Settings } from '../../types/habit';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenDashboard: () => void;
  settings: Settings | null;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings, onOpenDashboard, settings }) => {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            HabitFlow
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {greeting}! Ready to build habits?
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenDashboard}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            title="Open Full Dashboard"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          
          <button
            onClick={onOpenSettings}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            title="Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
          
          <div className="flex items-center text-gray-400">
            {settings?.theme === 'dark' ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;