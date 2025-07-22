import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials not found. Database features will be disabled.');
}

export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Persona CRUD operations
export const personaService = {
  async create(personaData) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('personas')
      .insert([personaData])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async getAll() {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('personas')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getById(id) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('personas')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('personas')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async delete(id) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { error } = await supabase
      .from('personas')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

// Analysis Report CRUD operations
export const analysisService = {
  async create(reportData) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('analysis_reports')
      .insert([reportData])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async getAll() {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('analysis_reports')
      .select(`
        *,
        personas (
          name,
          description
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getById(id) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('analysis_reports')
      .select(`
        *,
        personas (
          name,
          description
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { error } = await supabase
      .from('analysis_reports')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};