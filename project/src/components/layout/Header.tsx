import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { LogOutIcon, SunIcon, MoonIcon } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(() =>
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    root.classList.toggle('dark');
    setIsDarkMode(root.classList.contains('dark'));
  };

  const formattedDate = format(currentTime, 'EEEE, MMMM d, yyyy \'at\' hh:mm:ss a');

  return (
    <header className="flex justify-between items-center py-3 px-6 border-b border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900">
      <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
        {formattedDate}
      </div>

      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition"
          title="Toggle Theme"
        >
          {isDarkMode ? <SunIcon size={20} /> : <MoonIcon size={20} />}
        </button>

        {/* User Info */}
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-800 dark:text-white">
            {user?.role === 'admin' ? 'Admin' : ''} {user?.username}
          </p>
        </div>

        {/* Logout Button */}
        <Button
          variant="danger"
          size="sm"
          onClick={logout}
          className="flex items-center"
        >
          <LogOutIcon size={16} className="mr-1" />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;
