import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_ANON_KEY;

let supabase = null;
if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey);
}

export const authenticateUser = async (req, res, next) => {
  if (!supabase) {
    console.warn('Supabase not configured, skipping authentication');
    return next();
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ detail: 'Missing or invalid authorization header' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify the JWT token
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ detail: 'Invalid or expired token' });
    }

    // Fetch user profile with role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return res.status(401).json({ detail: 'User profile not found' });
    }

    // Attach user and profile to request
    req.user = user;
    req.profile = profile;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ detail: 'Authentication failed' });
  }
};

export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.profile) {
      return res.status(401).json({ detail: 'Authentication required' });
    }

    const rolePermissions = {
      admin: ['create', 'read', 'update', 'delete', 'export', 'analyze'],
      analyst: ['create', 'read', 'export', 'analyze'],
    };

    const userPermissions = rolePermissions[req.profile.role] || [];
    
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({ 
        detail: `Insufficient permissions. Required: ${permission}` 
      });
    }

    next();
  };
};

export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.profile) {
      return res.status(401).json({ detail: 'Authentication required' });
    }

    if (req.profile.role !== role) {
      return res.status(403).json({ 
        detail: `Access denied. Required role: ${role}` 
      });
    }

    next();
  };
};