import React, { useState } from 'react';
import { Users, Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';
import { useAuthStore } from '../stores/authStore';
import { usePersonas } from '../hooks/usePersonas';
import { Link } from 'react-router-dom';
import RoleGuard from '../components/RoleGuard';

const PersonaManagement: React.FC = () => {
  const { isDark } = useThemeStore();
  const { hasPermission } = useAuthStore();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [personaPrompt, setPersonaPrompt] = useState('');
  const [personaName, setPersonaName] = useState('');
  const [editingPersona, setEditingPersona] = useState<any>(null);
  
  const { 
    personas, 
    isLoading, 
    createPersona, 
    deletePersona, 
    updatePersona,
    isCreating, 
    isDeleting 
  } = usePersonas();

  const handleCreatePersona = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!personaPrompt.trim()) return;

    try {
      const newPersona = await createPersona(personaPrompt);
      if (personaName.trim()) {
        await updatePersona({ id: newPersona.id!, updates: { name: personaName } });
      }
      setShowCreateForm(false);
      setPersonaPrompt('');
      setPersonaName('');
    } catch (error) {
      console.error('Error creating persona:', error);
    }
  };

  const handleDeletePersona = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this persona?')) {
      try {
        await deletePersona(id);
      } catch (error) {
        console.error('Error deleting persona:', error);
      }
    }
  };

  const resetForm = () => {
    setShowCreateForm(false);
    setPersonaPrompt('');
    setPersonaName('');
    setEditingPersona(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Users className="w-8 h-8 text-indigo-600 mr-3" />
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Persona Management
            </h1>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Create and manage user personas for ad testing
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          disabled={isCreating}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
        >
          {isCreating ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Plus className="w-5 h-5 mr-2" />
          )}
          Create Persona
        </button>
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {editingPersona ? 'Edit Persona' : 'Create New Persona'}
              </h2>
              <button
                onClick={resetForm}
                className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleCreatePersona} className="space-y-6">
              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Persona Name
                </label>
                <input
                  type="text"
                  value={personaName}
                  onChange={(e) => setPersonaName(e.target.value)}
                  placeholder="e.g., Fitness Enthusiast Sarah"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Description
                </label>
                <textarea
                  rows={4}
                  value={personaPrompt}
                  onChange={(e) => setPersonaPrompt(e.target.value)}
                  placeholder="Describe the persona in detail..."
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className={`px-6 py-2 border rounded-lg ${
                    isDark 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !personaPrompt.trim()}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {isCreating ? 'Creating...' : editingPersona ? 'Update Persona' : 'Create Persona'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Personas Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <span className={`ml-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Loading personas...</span>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personas.map((persona) => (
            <div key={persona.id} className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                    {persona.name || `Persona ${persona.id?.slice(0, 8)}`}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {persona.age} years old • {persona.gender}
                  </p>
                </div>
                <div className="flex space-x-2">
                  
                  
                  <RoleGuard permission="delete">
                    <button 
                      onClick={() => handleDeletePersona(persona.id!)}
                      disabled={isDeleting}
                      className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} text-red-500`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </RoleGuard>
                </div>
              </div>
              
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4 line-clamp-3`}>
                {persona.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Created: {persona.created_at ? new Date(persona.created_at).toLocaleDateString() : 'Unknown'}
                </span>
                {/* go to analysis page*/}
                <Link  to={`/analysis`} className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                  Use in Analysis
                </Link>
                
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {personas.length === 0 && (
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-12 text-center`}>
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
            No personas created yet
          </h3>
          <p className={`text-gray-500 mb-6`}>
            Create your first persona to start analyzing ad performance
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Create Your First Persona
          </button>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
          <div className="flex items-center">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
              <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Total Personas
              </p>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {personas.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonaManagement;