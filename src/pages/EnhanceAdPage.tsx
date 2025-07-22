import React, { useState, useEffect } from 'react';
import { Sparkles, Upload, Wand2, ArrowRight, Check } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';
import { analysisApi, enhanceApi } from '../services/api';
import { useAnalysisReports } from '../hooks/useAnalysisReports';
interface EnhanceResult {
  enhancedContent: string;
  explanation: string;
  improvementSummary: {
    improvements: string[];
    predictedScores: Record<string, number>;
  };
}

interface AnalysisReport {
  id: string;
  persona_id: string;
  ad_type: 'image' | 'video' | 'text';
  ad_a_scores: Record<string, number>;
  ad_b_scores: Record<string, number>;
  winner: 'Ad A' | 'Ad B';
  explanation: string;
  created_at: string;
}

const EnhanceAdPage: React.FC = () => {
  const { isDark } = useThemeStore();
  const { reports, isLoading: reportsLoading } = useAnalysisReports();
  const [selectedReport, setSelectedReport] = useState<AnalysisReport | null>(null);
  const [enhancedResult, setEnhancedResult] = useState<EnhanceResult | null>(null);
  const [enhancing, setEnhancing] = useState(false);

  const handleEnhanceAd = async (report: AnalysisReport) => {
    setSelectedReport(report);
    setEnhancing(true);
    
    try {
      // Get the winning elements and scores
      const winningAd = report.winner === 'Ad A' ? report.ad_a_scores : report.ad_b_scores;
      const losingAd = report.winner === 'Ad A' ? report.ad_b_scores : report.ad_a_scores;
      
      // Create a prompt that describes what made the winning ad successful
      let enhancementPrompt = `Create an enhanced ad that combines these winning elements:\n`;
      Object.entries(winningAd).forEach(([criterion, score]) => {
        if (score >= 8) { // Only include high-scoring elements
          enhancementPrompt += `- ${criterion.replace(/_/g, ' ')}: ${score}/10\n`;
        }
      });
      
      // Also include any good elements from the losing ad
      Object.entries(losingAd).forEach(([criterion, score]) => {
        if (score >= 8) {
          enhancementPrompt += `- From other ad - ${criterion.replace(/_/g, ' ')}: ${score}/10\n`;
        }
      });
      
      // Add the enhancement request
      enhancementPrompt += `\nCreate an improved version that maintains these strengths while addressing any weaknesses.`;
      
      // Call the enhancement API
      const result = await enhanceApi.enhanceAd(report.id, report.winner);
      setEnhancedResult(result);
      
    } catch (error) {
      console.error('Error enhancing ad:', error);
    } finally {
      setEnhancing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center">
        <Sparkles className="w-8 h-8 text-indigo-600 mr-3" />
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Enhance Ad
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Use AI insights to create improved ad variations
          </p>
        </div>
      </div>

      {/* Reports List */}
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Select Analysis to Enhance
          </h2>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            Choose an analysis report to create an enhanced version
          </p>
        </div>

        {reportsLoading ? (
          <div className="p-8 text-center">
            <Wand2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Loading analysis reports...
            </p>
          </div>
        ) : reports.length === 0 ? (
          <div className="p-8 text-center">
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              No analysis reports found. Run some A/B tests first!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {reports.map((report: AnalysisReport) => (
              <div key={report.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {report.ad_type.charAt(0).toUpperCase() + report.ad_type.slice(1)} Ad Analysis
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                      Winner: {report.winner} • Created {new Date(report.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleEnhanceAd(report)}
                    disabled={enhancing}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {enhancing && selectedReport?.id === report.id ? (
                      <Wand2 className="w-5 h-5 animate-spin" />
                    ) : (
                      'Enhance'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Result */}
      {enhancedResult && (
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Enhanced Ad Suggestion
          </h2>
          
          {/* Enhanced Content */}
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'} mb-4`}>
            <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
              Enhanced Version
            </h3>
            <pre className={`whitespace-pre-wrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {enhancedResult.enhancedContent}
            </pre>
          </div>

          {/* Improvements */}
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'} mb-4`}>
            <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
              Key Improvements
            </h3>
            <ul className={`list-disc list-inside text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {enhancedResult.improvementSummary.improvements.map((improvement, index) => (
                <li key={index}>{improvement}</li>
              ))}
            </ul>
          </div>

          {/* Predicted Scores */}
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
              Predicted Performance
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(enhancedResult.improvementSummary.predictedScores).map(([criterion, score]) => (
                <div key={criterion}>
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {criterion.replace(/_/g, ' ')}
                  </p>
                  <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {score}/60
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Explanation */}
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'} mt-4`}>
            <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
              Explanation
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {enhancedResult.explanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhanceAdPage;