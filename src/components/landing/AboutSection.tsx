import React from 'react';
import { CheckCircle, Target, Zap, Users } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';

const AboutSection: React.FC = () => {
  const { isDark } = useThemeStore();

  const benefits = [
    {
      icon: Target,
      title: 'Precision Targeting',
      description: 'Create detailed personas that match your exact target audience'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Get comprehensive ad analysis results in seconds, not days'
    },
    {
      icon: Users,
      title: 'Multi-Persona Testing',
      description: 'Test against multiple personas simultaneously for broader insights'
    }
  ];

  return (
    <section id="about" className={`py-20 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="mb-12 lg:mb-0">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 text-green-800 dark:text-green-200 text-sm font-semibold rounded-full">
                About ADWISE
              </span>
            </div>
            
            <h2 className={`text-3xl sm:text-4xl font-bold mb-6 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Revolutionizing Ad Testing with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                Artificial Intelligence
              </span>
            </h2>
            
            <p className={`text-lg mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              ADWISE combines the power of advanced AI with intuitive design to help marketers and advertisers make data-driven decisions. Our platform generates detailed user personas and evaluates ad performance across multiple formats, giving you the insights you need to optimize your campaigns.
            </p>

            <div className="space-y-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className={`text-lg font-semibold mb-2 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {benefit.title}
                      </h3>
                      <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex items-center space-x-6">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  No setup required
                </span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Enterprise-grade security
                </span>
              </div>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Team analyzing data and charts"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-green-600/20 to-blue-600/20"></div>
            </div>
            
            {/* Floating Stats Card */}
            <div className={`absolute -bottom-6 -left-6 p-6 rounded-xl shadow-xl ${
              isDark ? 'bg-gray-900' : 'bg-white'
            }`}>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    3x
                  </div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Faster Results
                  </div>
                </div>
              </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-20 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;