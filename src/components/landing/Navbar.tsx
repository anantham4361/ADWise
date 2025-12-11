import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, TestTube } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';

const Navbar: React.FC = () => {
  const { isDark } = useThemeStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isDark ? 'bg-gray-900/95 backdrop-blur-sm' : 'bg-white/95 backdrop-blur-sm'
    } border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                ADWISE
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a
                href="#home"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isDark 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Home
              </a>
              <a
                href="#about"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isDark 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                About
              </a>
              <a
                href="#features"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isDark 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Features
              </a>
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center space-x-4">
              <Link
                to="/login"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isDark 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md text-sm font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200 transform hover:scale-105"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className={`p-2 rounded-md ${
                isDark 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className={`md:hidden ${isDark ? 'bg-gray-900' : 'bg-white'} border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="#home"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isDark 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </a>
            <a
              href="#about"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isDark 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </a>
            <a
              href="#features"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isDark 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center px-3 space-x-3">
                <Link
                  to="/login"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isDark 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md text-sm font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;