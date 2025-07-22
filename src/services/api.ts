import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import { Persona, EvaluationResult, AdType } from '../App';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      useAuthStore.getState().signOut();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Persona API calls
export const personaApi = {
  getAll: async (): Promise<Persona[]> => {
    const response = await api.get('/api/personas');
    return response.data;
  },

  create: async (prompt: string): Promise<Persona> => {
    const response = await api.post('/api/personas', { prompt });
    return response.data;
  },

  update: async (id: string, updates: Partial<Persona>): Promise<Persona> => {
    const response = await api.put(`/api/personas/${id}`, updates);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/personas/${id}`);
  },
};

// Analysis Report API calls
export const analysisApi = {
  getAll: async (): Promise<any[]> => {
    const response = await api.get('/api/analysis-reports');
    return response.data;
  },

  getById: async (id: string): Promise<any> => {
    const response = await api.get(`/api/analysis-reports/${id}`);
    return response.data;
  },

  create: async (reportData: any): Promise<any> => {
    const response = await api.post('/api/analysis-reports', reportData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/analysis-reports/${id}`);
  },
};

interface EnhanceAdResult {
  enhancedContent: string;
  explanation: string;
  improvementSummary: {
    improvements: string[];
    predictedScores: Record<string, number>;
  };
}

// Ad Enhancement API calls
export const enhanceApi = {
  enhanceAd: async (reportId: string, adToEnhance: 'Ad A' | 'Ad B'): Promise<EnhanceAdResult> => {
    const response = await api.post('/api/enhance-ad', {
      reportId,
      adToEnhance,
    });
    return response.data;
  },
};

// Ad Evaluation API calls
export const evaluationApi = {
  evaluateImageAds: async (personaDescription: string, adA: File, adB: File): Promise<EvaluationResult> => {
    const formData = new FormData();
    formData.append('persona_prompt', personaDescription);
    formData.append('ad_a', adA);
    formData.append('ad_b', adB);

    const response = await api.post('/evaluate-ads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  evaluateVideoAds: async (personaDescription: string, adA: File, adB: File): Promise<EvaluationResult> => {
    const formData = new FormData();
    formData.append('persona_prompt', personaDescription);
    formData.append('ad_a', adA);
    formData.append('ad_b', adB);

    const response = await api.post('/evaluate-video-ads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  evaluateTextAds: async (personaDescription: string, adAText: string, adBText: string): Promise<EvaluationResult> => {
    const formData = new FormData();
    formData.append('persona_prompt', personaDescription);
    formData.append('ad_a_text', adAText);
    formData.append('ad_b_text', adBText);

    const response = await api.post('/evaluate-text-ads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

// Multi-persona evaluation
export const multiPersonaEvaluation = {
  evaluate: async (
    personas: Persona[],
    adType: AdType,
    adData: {
      imageA?: File;
      imageB?: File;
      videoA?: File;
      videoB?: File;
      textA?: string;
      textB?: string;
    }
  ): Promise<Array<{ persona: Persona; result: EvaluationResult; reportId: string }>> => {
    const results = [];

    for (const persona of personas) {
      let evaluationResult: EvaluationResult;

      try {
        // Perform evaluation based on ad type
        switch (adType) {
          case 'image':
            evaluationResult = await evaluationApi.evaluateImageAds(
              persona.description,
              adData.imageA!,
              adData.imageB!
            );
            break;
          case 'video':
            evaluationResult = await evaluationApi.evaluateVideoAds(
              persona.description,
              adData.videoA!,
              adData.videoB!
            );
            break;
          case 'text':
            evaluationResult = await evaluationApi.evaluateTextAds(
              persona.description,
              adData.textA!,
              adData.textB!
            );
            break;
          default:
            throw new Error('Invalid ad type');
        }

        // Save analysis report to database
        const reportData = {
          persona_id: persona.id,
          ad_type: adType,
          ad_a_scores: evaluationResult.ad_a_scores,
          ad_b_scores: evaluationResult.ad_b_scores,
          winner: evaluationResult.winner,
          explanation: evaluationResult.explanation,
          criteria_names: evaluationResult.criteria_names,
        };

        const savedReport = await analysisApi.create(reportData);

        results.push({
          persona,
          result: { ...evaluationResult, ad_type: adType },
          reportId: savedReport.id,
        });
      } catch (error) {
        console.error(`Error evaluating for persona ${persona.id}:`, error);
        throw error;
      }
    }

    return results;
  },
};