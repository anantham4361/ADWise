import React from 'react';
import { Link } from 'react-router-dom';
import {  Github, Mail } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';

const Footer: React.FC = () => {
  const { isDark } = useThemeStore();

  const footerLinks = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#' },
      { name: 'API', href: '#' },
      { name: 'Documentation', href: '#' }
    ],
    
  };

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: '#' },
    { name: 'Email', icon: Mail, href: '#' }
  ];

  return (
    <footer className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'} border-t`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              
              <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                ADWISE
              </span>
            </div>
            
            <p className={`text-sm mb-6 max-w-md ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              AI-powered ad testing platform that helps marketers create better campaigns through intelligent persona generation and comprehensive ad analysis.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark 
                        ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className={`text-sm font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Product
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className={`text-sm transition-colors ${
                      isDark 
                        ? 'text-gray-400 hover:text-white' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          
        </div>

        {/* Bottom Section */}
        <div className={`mt-12 pt-8 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              © 2025 ADWISE. All rights reserved.
            </p>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-6">
              <Link
                to="/login"
                className={`text-sm transition-colors ${
                  isDark 
                    ? 'text-gray-400 hover:text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;