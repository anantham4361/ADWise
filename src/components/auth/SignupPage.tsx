import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Shield, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { UserRole } from '../../lib/supabase';

const SignupPage: React.FC = () => {
  const { isDark } = useThemeStore();
  const { signUp, loading } = useAuthStore();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('analyst');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      await signUp(email, password, fullName, role);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`max-w-md w-full space-y-8 p-8 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Create Account
          </h2>
          <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Join ADWise to start analyzing ads
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="fullName" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="role" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Role
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="analyst">Analyst</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <p className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {role === 'admin' ? 'Full access to all features' : 'Can analyze, create, and export (no delete)'}
            </p>
          </div>

          <div>
            <label htmlFor="password" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Create Account'
            )}
          </button>

          <div className="text-center">
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                Sign in
              </Link>
            </p>
            <Link to="/" className="font-small text-blue-500 hover:text-blue-900">
                            Go back
                          </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;