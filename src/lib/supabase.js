import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a singleton instance of the Supabase client if environment variables are provided
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

/**
 * Helper to execute Supabase queries with a graceful fallback to local data.
 * If Supabase is not configured, it throws a specific error that the app can catch
 * and fallback to localStorage.
 */
export async function withSupabaseFallback(supabasePromise, fallbackAction) {
  if (!supabase) {
    console.warn('Supabase not configured. Falling back to local data.');
    return fallbackAction();
  }
  
  try {
    const { data, error } = await supabasePromise;
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Supabase query failed:', err);
    console.warn('Falling back to local data.');
    return fallbackAction();
  }
}
