import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Auth Client Library
 * Handles Supabase authentication for the frontend
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-anon-key';

export const createClient = () => {
  return createSupabaseClient(supabaseUrl, supabaseKey);
};

// Auth functions
export const auth = {
  async signUp(email: string, password: string, fullName: string) {
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async signIn(email: string, password: string) {
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async signOut() {
    const supabase = createClient();
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async getCurrentUser() {
    const supabase = createClient();
    
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return { success: true, user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async resetPassword(email: string) {
    const supabase = createClient();
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async updatePassword(password: string) {
    const supabase = createClient();
    
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
};

export default createClient;
