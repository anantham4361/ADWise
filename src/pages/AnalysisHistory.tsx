import React, { useState } from 'react';
import { History, Download, Trash2, Eye, Loader2, X } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';
import ResultsDisplay from '../components/ResultsDisplay';
import { useAuthStore } from '../stores/authStore';
import { useAnalysisReports } from '../hooks/useAnalysisReports';
import { exportToPDF } from '../utils/exportUtils';
import RoleGuard from '../components/RoleGuard';

const AnalysisHistory: React.FC = () => {
  const { isDark } = useThemeStore();
  const { hasPermission } = useAuthStore();
  const { reports, isLoading, deleteReport, isDeleting } = useAnalysisReports();

  const handleDeleteReport = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this analysis report?')) {
      try {
        await deleteReport(id);
      } catch (error) {
        console.error('Error deleting report:', error);
      }
    }
  };
  

  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleViewDetails = (report: any) => {
    setSelectedReport(report);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setSelectedReport(null);
    setShowDetails(false);
  };

  const handleExportPDF = (report: any) => {
    exportToPDF(report);
  };
  
;  const getAdTypeColor = (type: string) => {
    switch (type) {
      case 'image':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'video':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'text':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getWinnerColor = (winner: string) => {
    return winner === 'Ad A' 
      ? 'text-blue-600 dark:text-blue-400' 
      : 'text-purple-600 dark:text-purple-400';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <History className="w-8 h-8 text-indigo-600 mr-3" />
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Analysis History
            </h1>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              View and manage your previous A/B test results
            </p>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <span className={`ml-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Loading reports...</span>
        </div>
      ) : (
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <tr>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Persona
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Ad Type
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Winner
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Scores
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Date
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`${isDark ? 'bg-gray-800' : 'bg-white'} divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {reports.map((report) => (
                  <tr key={report.id} className={`${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {report.personas?.name || `Persona ${report.persona_id?.slice(0, 8)}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAdTypeColor(report.ad_type)}`}>
                        {report.ad_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-semibold ${getWinnerColor(report.winner)}`}>
                        {report.winner}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          A: {report.ad_a_scores?.total || 0}
                        </span>
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>|</span>
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          B: {report.ad_b_scores?.total || 0}
                          
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(report.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">


                        <button
                          className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-100'} text-indigo-600`}
                          title="View Details"
                          onClick={() => handleViewDetails(report)}
                        >
                          <Eye className="w-4 h-4" />
                        </button>


                        <button
                          className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-100'} text-green-600`}
                          title="Export Report"
                          onClick={() => handleExportPDF(report)}
                        >
                          <Download className="w-4 h-4" />
                        </button>
                       <RoleGuard permission="delete">
                         <button
                           onClick={() => handleDeleteReport(report.id)}
                           disabled={isDeleting}
                           className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-100'} text-red-600`}
                           title="Delete Report"
                         >
                           {isDeleting ? (
                             <Loader2 className="w-4 h-4 animate-spin" />
                           ) : (
                             <Trash2 className="w-4 h-4" />
                           )}
                         </button>
                       </RoleGuard>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && reports.length === 0 && (
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-12 text-center`}>
          <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
            No analysis reports yet
          </h3>
          <p className={`text-gray-500 mb-6`}>
            Run your first A/B test to see results here
          </p>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <History className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Total Analyses
              </p>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {reports.length}
              </p>
            </div>
          </div>
        </div>

        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Download className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Avg Score Diff
              </p>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {reports.length > 0 
                  ? (reports.reduce((sum, r) => sum + Math.abs((r.ad_a_scores?.total || 0) - (r.ad_b_scores?.total || 0)), 0) / reports.length).toFixed(1)
                  : '0'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className={`relative ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto`}>
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Analysis Details
              </h2>
              <button
                onClick={handleCloseDetails}
                className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <ResultsDisplay result={{
              ...selectedReport,
              ad_type: selectedReport.ad_type,
              ad_a_scores: selectedReport.ad_a_scores,
              ad_b_scores: selectedReport.ad_b_scores,
              winner: selectedReport.winner,
              explanation: selectedReport.explanation,
              criteria_names: selectedReport.criteria_names,
            }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisHistory;