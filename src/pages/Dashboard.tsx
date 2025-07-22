import React from 'react';
import { Link } from 'react-router-dom';
import { TestTube, Users, History, Sparkles, TrendingUp, BarChart3 } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';
import { useAnalysisReports } from '../hooks/useAnalysisReports';
import { usePersonas } from '../hooks/usePersonas';

const Dashboard: React.FC = () => {
  const { isDark } = useThemeStore();
  const {reports} = useAnalysisReports();
  const {personas} = usePersonas();
    const quickActions = [
    {
      title: 'New Ad Analysis',
      description: 'Start a new A/B test analysis',
      icon: TestTube,
      to: '/analysis',
      color: 'bg-blue-500',
    },
    {
      title: 'Create Persona',
      description: 'Add a new user persona',
      icon: Users,
      to: '/personas',
      color: 'bg-green-500',
    },
    {
      title: 'View History',
      description: 'Browse past analysis reports',
      icon: History,
      to: '/history',
      color: 'bg-purple-500',
    },
    {
      title: 'Enhance Ad',
      description: 'Improve ads using AI insights',
      icon: Sparkles,
      to: '/enhance',
      color: 'bg-orange-500',
    },
  ];

  const stats = [
    { label: 'Total Analyses', value: reports.length, icon: BarChart3 },
    { label: 'Created Personas', value: personas.length, icon: Users },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8`}>
        <div className="text-center">
          <img src="/logo.png" alt="Logo" className="w-16 h-16 mx-auto mb-4" />
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
            Welcome to AdWise
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Generate detailed personas and evaluate ad performance across images, videos, and text with AI-powered analysis
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {label}
                </p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
          Quick Actions
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map(({ title, description, icon: Icon, to, color }) => (
            <Link
              key={title}
              to={to}
              className={`${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} rounded-xl shadow-lg p-6 transition-all duration-200 hover:scale-105 hover:shadow-xl`}
            >
              <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                {title}
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Getting Started */}
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8`}>
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
          Getting Started
        </h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">1</span>
            </div>
            <div className="ml-4">
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Create User Personas
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Start by creating detailed user personas that represent your target audience
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">2</span>
            </div>
            <div className="ml-4">
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Run A/B Tests
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Upload or input your ad variations and let AI analyze their effectiveness
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">3</span>
            </div>
            <div className="ml-4">
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Review & Enhance
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Analyze results and use AI to enhance your ads for better performance
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;