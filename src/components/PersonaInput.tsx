import React from 'react';
import { User } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore'; 

interface PersonaInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const PersonaInput: React.FC<PersonaInputProps> = ({ value, onChange, disabled = false }) => {
  const { isDark } = useThemeStore(); 
  return (
     <div className={`
      rounded-xl shadow-lg p-6 border
      ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}
    `}>
      <div className="flex items-center mb-4">
        <User className="w-6 h-6 text-indigo-600 mr-2" />
        <h2 className={`text-2xl font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Describe Your Target Persona</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="persona-prompt"
            className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Natural Language Description
          </label>
          <textarea
            id="persona-prompt"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder="Example: I am a 25-year-old fitness enthusiast who loves healthy food, prefers bright colors, and has an active lifestyle. I care about sustainability and enjoy sharing workout tips on social media."
            className={`
              w-full px-4 py-3 border rounded-lg resize-none transition-all duration-200
              focus:ring-2 focus:ring-indigo-500 focus:border-transparent
              ${isDark
                ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-indigo-600'
                : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
              }
              ${disabled
                ? 'opacity-60 cursor-not-allowed' + (isDark ? ' bg-gray-900' : ' bg-gray-100')
                : ''
              }
            `}
            rows={4}
          />
        </div>

        <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          <p className="font-medium mb-1">💡 Tips for better results:</p>
          <ul className={`list-disc list-inside space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <li>Include age, gender, and interests</li>
            <li>Mention color preferences and personality traits</li>
            <li>Describe lifestyle and values</li>
            <li>Add any specific preferences (food, activities, etc.)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PersonaInput;