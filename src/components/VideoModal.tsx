import React, { useRef, useEffect } from 'react';
import { X, Maximize } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title?: string;
}

const VideoModal: React.FC<VideoModalProps> = ({ 
  isOpen, 
  onClose, 
  videoUrl, 
  title = "ADWISE Demo" 
}) => {
  const { isDark } = useThemeStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle click outside modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // Handle fullscreen
  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  // Pause video when modal closes
  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className={`relative w-full max-w-4xl mx-4 rounded-xl overflow-hidden shadow-2xl ${
          isDark ? 'bg-gray-900' : 'bg-white'
        }`}
      >
        {/* Modal Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
        }`}>
          <h3 className={`text-lg font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {title}
          </h3>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleFullscreen}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title="Fullscreen"
            >
              <Maximize className="w-5 h-5" />
            </button>
            
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Container */}
        <div className="relative bg-black">
          <video
            ref={videoRef}
            className="w-full h-auto max-h-[70vh]"
            controls
            preload="metadata"
            poster="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          >
            <source src={videoUrl} type="video/mp4" />
            <source src={videoUrl} type="video/webm" />
            <source src={videoUrl} type="video/ogg" />
            Your browser does not support the video tag.
          </video>
          
          {/* Loading overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Loading demo video...</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className={`p-4 border-t ${
          isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center justify-between">
            <p className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              See how ADWISE transforms your ad testing workflow
            </p>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isDark 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Close
              </button>
              
              <a
                href="/signup"
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;