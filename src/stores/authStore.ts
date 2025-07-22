import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase, UserProfile, UserRole } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role?: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  hasPermission: (action: string) => boolean;
  isAdmin: () => boolean;
  isAnalyst: () => boolean;
}

const ROLE_PERMISSIONS = {
  admin: ['create', 'read', 'update', 'delete', 'export', 'analyze'],
  analyst: ['create', 'read', 'export', 'analyze'],
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      loading: false,

      signIn: async (email: string, password: string) => {
        set({ loading: true });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          set({ user: data.user });
          await get().fetchProfile();
        } catch (error) {
          console.error('Sign in error:', error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      signUp: async (email: string, password: string, fullName: string, role: UserRole = 'analyst') => {
        set({ loading: true });
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });

          if (error) throw error;

          if (data.user) {
            // Create user profile
            const { error: profileError } = await supabase
              .from('profiles')
              .insert([
                {
                  id: data.user.id,
                  email: data.user.email,
                  full_name: fullName,
                  role: role,
                },
              ]);

            if (profileError) throw profileError;
          }

          set({ user: data.user });
        } catch (error) {
          console.error('Sign up error:', error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      signOut: async () => {
        set({ loading: true });
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          set({ user: null, profile: null });
        } catch (error) {
          console.error('Sign out error:', error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      fetchProfile: async () => {
        const { user } = get();
        if (!user) return;

        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) throw error;
          set({ profile: data });
        } catch (error) {
          console.error('Fetch profile error:', error);
        }
      },

      updateProfile: async (updates: Partial<UserProfile>) => {
        const { user } = get();
        if (!user) return;

        try {
          const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id)
            .select()
            .single();

          if (error) throw error;
          set({ profile: data });
        } catch (error) {
          console.error('Update profile error:', error);
          throw error;
        }
      },

      hasPermission: (action: string) => {
        const { profile } = get();
        if (!profile) return false;
        return ROLE_PERMISSIONS[profile.role]?.includes(action) || false;
      },

      isAdmin: () => {
        const { profile } = get();
        return profile?.role === 'admin';
      },

      isAnalyst: () => {
        const { profile } = get();
        return profile?.role === 'analyst';
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, profile: state.profile }),
    }
  )
);

// Initialize auth state
supabase.auth.onAuthStateChange((event, session) => {
  const { fetchProfile } = useAuthStore.getState();
  
  if (event === 'SIGNED_IN' && session?.user) {
    useAuthStore.setState({ user: session.user });
    fetchProfile();
  } else if (event === 'SIGNED_OUT') {
    useAuthStore.setState({ user: null, profile: null });
  }
});