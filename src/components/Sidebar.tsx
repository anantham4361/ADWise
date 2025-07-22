import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { 
  BarChart3, 
  Users, 
  History, 
  Sparkles, 
  Settings, 
  Moon, 
  Sun,
  TestTube,
  User,
  Crown,
  LogOut
} from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';

const Sidebar = () => {
  const location = useLocation();
  const { isDark, toggleTheme } = useThemeStore();
  const { profile, signOut } = useAuthStore();

  const navigation = [
    { name: 'Ad Analysis', href: '/', icon: BarChart3 },
    { name: 'Persona Management', href: '/personas', icon: Users },
    { name: 'Analysis History', href: '/history', icon: History },
    { name: 'Enhance Ad', href: '/enhance', icon: Sparkles },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    // <div className="w-64 bg-gray-900 text-white h-screen flex flex-col">
    <div className="fixed top-0 left-0 w-64 h-screen bg-gray-900 text-white flex flex-col z-50">
      {/* Logo */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-md flex items-center justify-center">
            <TestTube className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold">ADWise</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive(item.href)
                  ? 'bg-green-600 text-white border-r-2 border-green-400'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 mr-3 flex-shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Settings Section */}
      <div className="border-t border-gray-800">
        <div className="px-3 py-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Settings
          </p>
        </div>
        <div className="px-3 pb-4 space-y-1">
          <button
            onClick={toggleTheme}
            className="group flex items-center w-full px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white transition-colors"
          >
            {isDark ? (
              <Sun className="w-4 h-4 mr-3 flex-shrink-0" />
            ) : (
              <Moon className="w-4 h-4 mr-3 flex-shrink-0" />
            )}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button
            onClick={handleSignOut}
            className="group flex items-center w-full px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4 mr-3 flex-shrink-0" />
            Sign Out
          </button>
        </div>
      </div>

      {/* User Profile */}
      <div className="border-t border-gray-800 p-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {profile?.full_name || profile?.email || 'User'}
            </p>
            <div className="flex items-center space-x-1">
              <Crown className={`w-3 h-3 ${profile?.role === 'admin' ? 'text-red-400' : 'text-blue-400'}`} />
              <p className="text-xs text-gray-400 capitalize">{profile?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;