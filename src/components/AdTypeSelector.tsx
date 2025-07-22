
import React from 'react';
import { Image, Video, FileText } from 'lucide-react';
import { AdType } from '../App'; 

import { useThemeStore } from '../stores/themeStore';

interface AdTypeSelectorProps {
  selectedType: AdType;
  onTypeChange: (type: AdType) => void;
  disabled?: boolean;
}

const AdTypeSelector: React.FC<AdTypeSelectorProps> = ({ selectedType, onTypeChange, disabled = false }) => {
  const { isDark } = useThemeStore();

  const adTypes = [
    {
      type: 'image' as AdType,
      label: 'Image Ads(Coming Soon)',
      icon: Image,
      description: 'Analyze static image advertisements',
      color: 'blue'
    },
    {
      type: 'video' as AdType,
      label: 'Video Ads(Coming Soon)',
      icon: Video,
      description: 'Analyze video advertisements',
      color: 'purple'
    },
    {
      type: 'text' as AdType,
      label: 'Text Ads',
      icon: FileText,
      description: 'Analyze text-based advertisements',
      color: 'green'
    }
  ];

  
  const getColorClasses = (color: string, isSelected: boolean) => {
    const commonClasses = {
      blue: {
        baseBg: 'bg-blue-50', baseBorder: 'border-blue-300', baseHoverBg: 'hover:bg-blue-100', baseHoverBorder: 'hover:border-blue-300',
        baseIcon: 'text-blue-600', baseText: 'text-blue-900',
        darkBg: 'dark:bg-blue-900', darkBorder: 'dark:border-blue-700', darkHoverBg: 'dark:hover:bg-blue-800', darkHoverBorder: 'dark:hover:border-blue-500',
        darkIcon: 'dark:text-blue-400', darkText: 'dark:text-blue-300', darkSelectedBorder: 'dark:border-blue-400'
      },
      purple: {
        baseBg: 'bg-purple-50', baseBorder: 'border-purple-300', baseHoverBg: 'hover:bg-purple-100', baseHoverBorder: 'hover:border-purple-300',
        baseIcon: 'text-purple-600', baseText: 'text-purple-900',
        darkBg: 'dark:bg-purple-900', darkBorder: 'dark:border-purple-700', darkHoverBg: 'dark:hover:bg-purple-800', darkHoverBorder: 'dark:hover:border-purple-500',
        darkIcon: 'dark:text-purple-400', darkText: 'dark:text-purple-300', darkSelectedBorder: 'dark:border-purple-400'
      },
      green: {
        baseBg: 'bg-green-50', baseBorder: 'border-green-300', baseHoverBg: 'hover:bg-green-100', baseHoverBorder: 'hover:border-green-300',
        baseIcon: 'text-green-600', baseText: 'text-green-900',
        darkBg: 'dark:bg-green-900', darkBorder: 'dark:border-green-700', darkHoverBg: 'dark:hover:bg-green-800', darkHoverBorder: 'dark:hover:border-green-500',
        darkIcon: 'dark:text-green-400', darkText: 'dark:text-green-300', darkSelectedBorder: 'dark:border-green-400'
      }
    };

    const c = commonClasses[color as keyof typeof commonClasses];

    if (isSelected) {
      return {
        bg: isDark ? `${c.darkBg} ${c.darkSelectedBorder}` : `${c.baseBg} ${c.baseBorder}`,
        icon: isDark ? c.darkIcon : c.baseIcon,
        text: isDark ? c.darkText : c.baseText,
        // No specific hover for selected state, or you can define one if needed
        hover: '',
        // For the small selected dot, use the icon's base color
        selectedDotBg: isDark ? c.darkIcon.replace('dark:text-', 'dark:bg-') : c.baseIcon.replace('text-', 'bg-')
      };
    } else {
      return {
        // Base state (not selected, light/dark mode)
        bg: isDark ? `bg-gray-800 border-gray-700` : `bg-white border-gray-200`,
        icon: isDark ? 'text-gray-500' : 'text-gray-400',
        text: isDark ? 'text-gray-300' : 'text-gray-700',
        // Hover state (not selected)
        hover: isDark ? `${c.darkHoverBg} ${c.darkHoverBorder}` : `${c.baseHoverBg} ${c.baseHoverBorder}`,
        selectedDotBg: '' // Not applicable for unselected
      };
    }
  };

  return (
    <div className={`
      rounded-xl shadow-lg p-6 border
      ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}
    `}>
      <div className="flex items-center mb-6">
        <div className="w-6 h-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded mr-2"></div>
        <h2 className={`text-2xl font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
          Select Ad Type
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {adTypes.map(({ type, label, icon: Icon, description, color }) => {
          const isSelected = selectedType === type;
          const colorClasses = getColorClasses(color, isSelected);

          return (
            <button
              key={type}
              onClick={() => onTypeChange(type)}
              disabled={disabled}
              className={`
                p-6 rounded-lg border-2 transition-all duration-200 text-left
                ${colorClasses.bg} ${colorClasses.hover}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer transform hover:scale-105'}
              `}
            >
              <div className="flex items-center mb-3">
                <Icon className={`w-8 h-8 ${colorClasses.icon} mr-3`} />
                <h3 className={`text-lg font-semibold ${colorClasses.text}`}>
                  {label}
                </h3>
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {description}
              </p>
              {isSelected && (
                <div className="mt-3 flex items-center">
                  <div className={`w-2 h-2 rounded-full ${colorClasses.selectedDotBg} mr-2`}></div>
                  <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Selected</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className={`mt-4 p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          <span className={`font-medium ${isDark ? 'text-yellow-400' : 'text-gray-800'}`}>💡 Tip:</span> Each ad type uses specialized AI analysis tailored to the medium.
          Image ads focus on visual elements, video ads analyze motion and audio cues, and text ads evaluate messaging and copy effectiveness.
        </p>
      </div>
    </div>
  );
};

export default AdTypeSelector;