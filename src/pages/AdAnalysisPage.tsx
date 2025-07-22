import React, { useState } from 'react';
import { TestTube, User, Users, CheckCircle, Loader2 } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';
import { usePersonas } from '../hooks/usePersonas';
import { multiPersonaEvaluation } from '../services/api';
import PersonaInput from '../components/PersonaInput';
import AdTypeSelector from '../components/AdTypeSelector';
import ImageUpload from '../components/ImageUpload';
import VideoUpload from '../components/VideoUpload';
import TextAdInput from '../components/TextAdInput';
import PersonaDisplay from '../components/PersonaDisplay';
import ResultsDisplay from '../components/ResultsDisplay';
import LoadingSpinner from '../components/LoadingSpinner';
import { AdType, EvaluationResult, Persona } from '../App';
import { useAuthStore } from '../stores/authStore';


interface MultiPersonaResult {
  persona: Persona;
  result: EvaluationResult;
  reportId: string;
}

const AdAnalysisPage: React.FC = () => {
  const { isDark } = useThemeStore();

  
  

  const [selectedPersonas, setSelectedPersonas] = useState<string[]>([]);
  const [personaPrompt, setPersonaPrompt] = useState('');
  const [adType, setAdType] = useState<AdType>('image');
  
  // Image ads
  const [adImageA, setAdImageA] = useState<File | null>(null);
  const [adImageB, setAdImageB] = useState<File | null>(null);
  
  // Video ads
  const [adVideoA, setAdVideoA] = useState<File | null>(null);
  const [adVideoB, setAdVideoB] = useState<File | null>(null);
  
  // Text ads
  const [adTextA, setAdTextA] = useState('');
  const [adTextB, setAdTextB] = useState('');
  
  const [evaluationResults, setEvaluationResults] = useState<MultiPersonaResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPersonaIndex, setCurrentPersonaIndex] = useState(0);

  const { personas, isLoading: personasLoading } = usePersonas();

  const validateInputs = () => {
    if (!personaPrompt.trim() && selectedPersonas.length === 0) {
      return 'Please select at least one persona or provide a persona description';
    }
    if (selectedPersonas.length > 5) {
      return 'Maximum 5 personas can be selected for analysis';
    }

    switch (adType) {
      case 'image':
        if (!adImageA || !adImageB) {
          return 'Please upload both ad images';
        }
        break;
      case 'video':
        if (!adVideoA || !adVideoB) {
          return 'Please upload both ad videos';
        }
        break;
      case 'text':
        if (!adTextA.trim() || !adTextB.trim()) {
          return 'Please provide both text advertisements';
        }
        break;
    }
    return null;
  };

  const handlePersonaSelection = (personaId: string) => {
    setSelectedPersonas(prev => {
      if (prev.includes(personaId)) {
        return prev.filter(id => id !== personaId);
      } else if (prev.length < 5) {
        return [...prev, personaId];
      }
      return prev;
    });
  };
  const handleEvaluate = async () => {
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);
    setEvaluationResults([]);
    setCurrentPersonaIndex(0);

    try {
      // Determine which personas to use
      let personasToAnalyze: Persona[] = [];
      
      if (selectedPersonas.length > 0) {
        personasToAnalyze = personas.filter(p => selectedPersonas.includes(p.id!));
      } else if (personaPrompt.trim()) {
        // Create a temporary persona from the prompt
        const tempPersona: Persona = {
          id: 'temp',
          description: personaPrompt,
          age: 25,
          gender: 'Unknown',
          interests: [],
          preferred_colors: [],
          tone_preference: 'neutral',
          personality_traits: [],
          food_preferences: [],
        };
        personasToAnalyze = [tempPersona];
      }

      // Prepare ad data
      const adData: {
        imageA?: File;
        imageB?: File;
        videoA?: File;
        videoB?: File;
        textA?: string;
        textB?: string;
      } = {};

      if (adImageA) adData.imageA = adImageA;
      if (adImageB) adData.imageB = adImageB;
      if (adVideoA) adData.videoA = adVideoA;
      if (adVideoB) adData.videoB = adVideoB;
      if (adTextA.trim()) adData.textA = adTextA;
      if (adTextB.trim()) adData.textB = adTextB;

      // Perform multi-persona evaluation
      const results = await multiPersonaEvaluation.evaluate(
        personasToAnalyze,
        adType,
        adData
      );

      setEvaluationResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedPersonas([]);
    setPersonaPrompt('');
    setAdType('image');
    setAdImageA(null);
    setAdImageB(null);
    setAdVideoA(null);
    setAdVideoB(null);
    setAdTextA('');
    setAdTextB('');
    setEvaluationResults([]);
    setError(null);
    setCurrentPersonaIndex(0);
  };

  const renderAdInputs = () => {
    switch (adType) {
      case 'image':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <ImageUpload
              title="Ad A"
              image={adImageA}
              onImageChange={setAdImageA}
              disabled={loading}
            />
            <ImageUpload
              title="Ad B"
              image={adImageB}
              onImageChange={setAdImageB}
              disabled={loading}
            />
          </div>
        );
      case 'video':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <VideoUpload
              title="Video Ad A"
              video={adVideoA}
              onVideoChange={setAdVideoA}
              disabled={loading}
            />
            <VideoUpload
              title="Video Ad B"
              video={adVideoB}
              onVideoChange={setAdVideoB}
              disabled={loading}
            />
          </div>
        );
      case 'text':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <TextAdInput
              title="Text Ad A"
              value={adTextA}
              onChange={setAdTextA}
              disabled={loading}
            />
            <TextAdInput
              title="Text Ad B"
              value={adTextB}
              onChange={setAdTextB}
              disabled={loading}
            />
          </div>
        );
    }
  };

  // Show results if we have them
  if (evaluationResults.length > 0) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TestTube className="w-8 h-8 text-indigo-600 mr-3" />
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Multi-Persona Analysis Results
            </h1>
          </div>
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-200"
          >
            New Analysis
          </button>
        </div>

        {/* Results Summary */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
          <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Analysis Summary ({evaluationResults.length} personas)
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {evaluationResults.filter(r => r.result.winner === 'Ad A').length}
              </div>
              <div className="text-sm text-gray-600">Ad A Wins</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {evaluationResults.filter(r => r.result.winner === 'Ad B').length}
              </div>
              <div className="text-sm text-gray-600">Ad B Wins</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {Math.round(evaluationResults.reduce((sum, r) => sum + Math.max(r.result.ad_a_scores.total, r.result.ad_b_scores.total), 0) / evaluationResults.length)}
              </div>
              <div className="text-sm text-gray-600">Avg Winner Score</div>
            </div>
          </div>
        </div>

        {/* Individual Results */}
        {evaluationResults.map((result, index) => (
          <div key={index} className="space-y-6">
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-4`}>
              <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                Result {index + 1}: {result.persona.name || `Persona ${result.persona.id?.slice(0, 8)}`}
              </h3>
            </div>
            <PersonaDisplay persona={result.result.persona} />
            <ResultsDisplay result={result.result} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center">
        <TestTube className="w-8 h-8 text-indigo-600 mr-3" />
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Multi-Persona Ad Analysis
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Test your ads against up to 5 personas simultaneously
          </p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Loading Progress */}
      {loading && (
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
          <div className="flex items-center justify-center mb-4">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mr-3" />
            <span className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Analyzing ads for multiple personas...
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentPersonaIndex + 1) / Math.max(selectedPersonas.length, 1)) * 100}%` }}
            ></div>
          </div>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2 text-center`}>
            Processing persona {currentPersonaIndex + 1} of {Math.max(selectedPersonas.length, 1)}
          </p>
        </div>
      )}

      {/* Persona Selection */}
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
        <div className="flex items-center mb-4">
          <Users className="w-6 h-6 text-indigo-600 mr-2" />
          <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Select Personas (Max 5)
          </h2>
        </div>
        
        {personasLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mr-2" />
            <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Loading personas...</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {personas.map((persona) => (
                <div
                  key={persona.id}
                  onClick={() => handlePersonaSelection(persona.id!)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedPersonas.includes(persona.id!)
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : isDark
                      ? 'border-gray-600 hover:border-gray-500 bg-gray-700'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  } ${selectedPersonas.length >= 5 && !selectedPersonas.includes(persona.id!) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {persona.name || `Persona ${persona.id?.slice(0, 8)}`}
                    </h3>
                    {selectedPersonas.includes(persona.id!) && (
                      <CheckCircle className="w-5 h-5 text-indigo-600" />
                    )}
                  </div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                    {persona.age} years old • {persona.gender}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} line-clamp-2`}>
                    {persona.description}
                  </p>
                </div>
              ))}
            </div>
            
            {selectedPersonas.length > 0 && (
              <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <p className={`text-sm ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>
                  Selected {selectedPersonas.length} of 5 personas for analysis
                </p>
              </div>
            )}
            
            <div className="text-center">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>or</span>
            </div>
            
            <PersonaInput
              value={personaPrompt}
              onChange={(value) => {
                setPersonaPrompt(value);
                if (value) setSelectedPersonas([]);
              }}
              disabled={loading || selectedPersonas.length > 0}
            />
          </div>
        )}
      </div>

      {/* Ad Type Selector */}
      <AdTypeSelector
        selectedType={adType}
        onTypeChange={setAdType}
        disabled={loading}
      />

      {/* Ad Inputs */}
      {renderAdInputs()}

      {/* Analyze Button */}
      <div className="text-center">
        <button
          onClick={handleEvaluate}
          disabled={loading || !!validateInputs()}
          className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <div className="flex items-center">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Analyzing {selectedPersonas.length || 1} Persona{(selectedPersonas.length || 1) > 1 ? 's' : ''}...
            </div>
          ) : (
            `Analyze Ads for ${selectedPersonas.length || 1} Persona${(selectedPersonas.length || 1) > 1 ? 's' : ''}`
          )}
        </button>
      </div>

      {validateInputs() && (
        <p className="text-center text-sm text-red-500 mt-2">
          {validateInputs()}
        </p>
      )}
    </div>
  );
};

export default AdAnalysisPage;