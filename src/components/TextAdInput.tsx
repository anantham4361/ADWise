import React from 'react';
import { FileText, Type } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore'; 
interface TextAdInputProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const TextAdInput: React.FC<TextAdInputProps> = ({ title, value, onChange, disabled = false }) => {
  const wordCount = value.trim().split(/\s+/).filter(word => word.length > 0).length;
  const charCount = value.length;
  const { isDark } = useThemeStore(); 

  return (


    
     <div className={`
      rounded-xl shadow-lg p-6 border
      ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}
    `}>
      <div className="flex items-center mb-4">
        <FileText className="w-6 h-6 text-green-600 mr-2" />
        <h3 className={`text-xl font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{title}</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor={`text-ad-${title}`}
            className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Advertisement Copy
          </label>
          <textarea
            id={`text-ad-${title}`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder="Enter your advertisement text here. Include headlines, body copy, call-to-action, and any other text elements..."
            className={`
              w-full px-4 py-3 border rounded-lg resize-none transition-all duration-200
              focus:ring-2 focus:ring-green-500 focus:border-transparent
              ${isDark
                ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-green-600'
                : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
              }
              ${disabled
                ? 'opacity-60 cursor-not-allowed' + (isDark ? ' bg-gray-900' : ' bg-gray-100')
                : ''
              }
            `}
            rows={8}
          />
        </div>

        {/* Statistics */}
        <div className={`
          flex items-center justify-between text-sm rounded-lg p-3
          ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'}
        `}>
          <div className="flex items-center">
            <Type className="w-4 h-4 mr-1" />
            <span>Characters: {charCount}</span>
          </div>
          <div>
            <span>Words: {wordCount}</span>
          </div>
        </div>

        {/* Guidelines */}
        <div className={`
          rounded-lg p-4
          ${isDark ? 'bg-green-900 bg-opacity-30' : 'bg-green-50'}
        `}>
          <h4 className={`font-medium mb-2 ${isDark ? 'text-green-300' : 'text-green-800'}`}>💡 Text Ad Guidelines:</h4>
          <ul className={`text-sm space-y-1 ${isDark ? 'text-green-200' : 'text-green-700'}`}>
            <li>• Include a compelling headline</li>
            <li>• Add clear value proposition</li>
            <li>• Include a strong call-to-action</li>
            <li>• Mention key benefits or features</li>
            <li>• Consider target audience language</li>
          </ul>
        </div>

        {/* Preview */}
        {value.trim() && (
          <div className={`
            rounded-lg p-4
            ${isDark ? 'border-gray-600 border' : 'border-gray-200 border'}
          `}>
            <h4 className={`font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Preview:</h4>
            <div className={`
              rounded p-3 text-sm whitespace-pre-wrap
              ${isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-50 text-gray-800'}
            `}>
              {value}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextAdInput;