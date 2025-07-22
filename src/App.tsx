import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Layout from './components/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import Dashboard from './pages/Dashboard';
import AdAnalysisPage from './pages/AdAnalysisPage';
import PersonaManagement from './pages/PersonaManagement';
import AnalysisHistory from './pages/AnalysisHistory';
import EnhanceAdPage from './pages/EnhanceAdPage';
import { useThemeStore } from './stores/themeStore';

export interface Persona {
  id?: string;
  name?: string;
  age: number;
  gender: string;
  interests: string[];
  preferred_colors: string[];
  tone_preference: string;
  personality_traits: string[];
  food_preferences: string[];
  description: string;
  created_at?: string;
}

export interface AdScore {
  visual_attention_grab: number;
  message_clarity: number;
  emotional_engagement: number;
  brand_recall: number;
  health_appeal: number;
  uniqueness: number;
  total: number;
}

export interface EvaluationResult {
  persona: Persona;
  ad_a_scores: AdScore;
  ad_b_scores: AdScore;
  winner: string;
  explanation: string;
  criteria_names: string[];
  ad_type: string;
}

export type AdType = 'image' | 'video' | 'text';

function App() {
  const { isDark } = useThemeStore();
  const { user } = useAuthStore();

  // Apply theme to document root
  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <Router>
      <div className={isDark ? 'dark' : ''}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="analysis" element={<AdAnalysisPage />} />
            <Route path="personas" element={<PersonaManagement />} />
            <Route path="history" element={<AnalysisHistory />} />
            <Route path="enhance" element={<EnhanceAdPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;