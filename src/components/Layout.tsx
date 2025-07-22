import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import Sidebar from './Sidebar';
import { useThemeStore } from '../stores/themeStore';
import { useBackendStatus } from '../hooks/useBackendStatus';
import { Circle } from 'lucide-react';

const Layout: React.FC = () => {
  const { isDark } = useThemeStore();
  const { profile } = useAuthStore();
  const backendStatus = useBackendStatus();

  const getStatusColor = () => {
    switch (backendStatus) {
      case 'active':
        return 'text-green-500';
      case 'inactive':
        return 'text-red-500';
      case 'checking':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusText = () => {
    switch (backendStatus) {
      case 'active':
        return 'Backend Active';
      case 'inactive':
        return 'Backend Offline';
      case 'checking':
        return 'Checking...';
      default:
        return 'Unknown';
    }
  };

  return (
  <div className={`min-h-screen flex ${isDark ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
    
    {/* Sidebar wrapper with fixed width */}
    <div className="w-64 flex-shrink-0">
      <Sidebar />
    </div>

    {/* Right Content */}
    <div className="flex-1 flex flex-col">
      
      {/* Header */}
      <header className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img src="/logo.png" alt="Logo" className="w-8 h-8 mr-3" />
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Persona-Based Ad Testing
            </h1>
            {profile && (
              <span className={`ml-4 px-3 py-1 rounded-full text-xs font-medium ${
                profile.role === 'admin' 
                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              }`}>
                {profile.role.toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Circle className={`w-3 h-3 ${getStatusColor()} ${backendStatus === 'checking' ? 'animate-pulse' : ''}`} fill="currentColor" />
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {getStatusText()}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`flex-1 p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Outlet />
      </main>
    </div>
  </div>
);

  
};

export default Layout;