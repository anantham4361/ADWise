import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import VideoModal from '../VideoModal';

const HeroSection: React.FC = () => {
  const { isDark } = useThemeStore();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const handleWatchDemo = () => {
    setIsVideoModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsVideoModalOpen(false);
  };

  return (
    <>
      <section id="home" className={`pt-20 pb-16 ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            <h1 className={`text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              <span className="block">AI-Powered</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-600">
                Ad Testing
              </span>
              <span className="block">Made Simple</span>
            </h1>
            
            <p className={`mt-6 text-lg sm:text-xl md:mt-8 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Generate detailed user personas and evaluate ad performance across images, videos, and text with cutting-edge AI analysis. Make data-driven decisions that boost your campaign ROI.
            </p>

            <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/signup"
                  className="flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                
                <button className={`flex items-center justify-center px-8 py-4 border-2 text-base font-medium rounded-lg transition-all duration-200 ${
                  isDark 
                    ? 'border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white hover:bg-gray-800' 
                    : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={handleWatchDemo}>
                  <Play className="mr-2 w-5 h-5" />
                  Watch Demo
                </button>
              </div>
            </div>

            {/* Stats */}
            {/* <div className="mt-12 grid grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center">
                <div className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  10K+
                </div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Ads Analyzed
                </div>
              </div>
              <div className="text-center">
                <div className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  95%
                </div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Accuracy Rate
                </div>
              </div>
              <div className="text-center">
                <div className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  24/7
                </div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  AI Analysis
                </div>
              </div>
            </div> */}
          </div>

          {/* Right Content - Hero Image */}
          <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
            <div className="relative mx-auto w-full lg:max-w-md">
              <div className={`relative rounded-2xl shadow-2xl overflow-hidden ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}>
                <img
                  src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="AI-powered ad analysis dashboard"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-green-600/10 to-blue-600/10"></div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </div>
      </section>

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={handleCloseModal}
        videoUrl="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
        title="AdTestLab Demo - AI-Powered Ad Testing"
      />
    </>
  );
};

export default HeroSection;