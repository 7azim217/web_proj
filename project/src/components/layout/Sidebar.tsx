import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  FolderIcon,
  ClipboardListIcon,
  MessageSquareIcon,
} from 'lucide-react';
import useAuthStore from '../../store/authStore';

const Sidebar: React.FC = () => {
  const { user } = useAuthStore();

  const navItems = [
    { name: 'Home', path: '/dashboard', icon: <HomeIcon size={20} /> },
    { name: 'Projects', path: '/projects', icon: <FolderIcon size={20} /> },
    { name: 'Tasks', path: '/tasks', icon: <ClipboardListIcon size={20} /> },
    { name: 'Chat', path: '/chat', icon: <MessageSquareIcon size={20} /> },
  ];

  return (
    <aside className="w-64 bg-gray-200 dark:bg-gray-900 h-full flex flex-col">
      <div className="p-4 border-b border-gray-300 dark:border-gray-800">
        <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">
          Task Manager
        </h2>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `
                  flex items-center p-3 rounded-md transition-colors duration-200
                  ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-800'
                  }
                `}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-300 dark:border-gray-800">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center text-white font-semibold">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3">
            <p className="text-black dark:text-white font-medium">{user?.username}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm capitalize">
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
