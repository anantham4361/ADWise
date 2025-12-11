import React from 'react';
import { 
  Brain, 
  Image, 
  Video, 
  FileText, 
  Users, 
  BarChart3, 
  Zap, 
  Shield,
  Download,
  Target
} from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';

const FeaturesSection: React.FC = () => {
  const { isDark } = useThemeStore();

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms analyze your ads with human-like understanding and precision.',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      icon: Users,
      title: 'Persona Generation',
      description: 'Create detailed user personas from simple descriptions using natural language processing.',
      color: 'from-green-500 to-teal-600'
    },
    {
      icon: Image,
      title: 'Image Ad Testing',
      description: 'Comprehensive visual analysis of static advertisements with detailed scoring across multiple criteria.',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Video,
      title: 'Video Ad Analysis',
      description: 'Evaluate video advertisements for motion, pacing, visual storytelling, and audience engagement.',
      color: 'from-red-500 to-pink-600'
    },
    {
      icon: FileText,
      title: 'Text Ad Evaluation',
      description: 'Analyze copywriting effectiveness, messaging clarity, and emotional impact of text-based ads.',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      icon: BarChart3,
      title: 'Detailed Analytics',
      description: 'Get comprehensive reports with visual charts, radar graphs, and actionable insights.',
      color: 'from-indigo-500 to-purple-600'
    },
    {
      icon: Target,
      title: 'Multi-Persona Testing',
      description: 'Test your ads against up to 5 different personas simultaneously for broader market insights.',
      color: 'from-teal-500 to-green-600'
    },
    {
      icon: Zap,
      title: 'Real-time Results',
      description: 'Get instant feedback and analysis results in seconds, not hours or days.',
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: Download,
      title: 'Export & Share',
      description: 'Export detailed reports in PDF or CSV format for presentations and team collaboration.',
      color: 'from-pink-500 to-rose-600'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Role-based access control.',
      color: 'from-gray-500 to-slate-600'
    }
  ];

  return (
    <section id="features" className={`py-20 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 text-green-800 dark:text-green-200 text-sm font-semibold rounded-full">
              Features
            </span>
          </div>
          
          <h2 className={`text-3xl sm:text-4xl font-bold mb-6 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Everything You Need for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
              Successful Ad Testing
            </span>
          </h2>
          
          <p className={`text-lg max-w-3xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Our comprehensive suite of AI-powered tools helps you create better ads, understand your audience, and make data-driven marketing decisions.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`group p-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  isDark 
                    ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700' 
                    : 'bg-white hover:bg-gray-50 border border-gray-100 shadow-lg'
                }`}
              >
                <div className="mb-6">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                </div>
                
                <h3 className={`text-xl font-semibold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {feature.title}
                </h3>
                
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                  {feature.description}
                </p>

              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className={`inline-flex items-center px-6 py-3 rounded-full ${
            isDark ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100 border border-gray-200'
          }`}>
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Ready to get started?
            </span>
            <a
              href="/signup"
              className="ml-3 px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white text-sm font-medium rounded-full hover:from-green-700 hover:to-blue-700 transition-all duration-200"
            >
              Try it free
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;