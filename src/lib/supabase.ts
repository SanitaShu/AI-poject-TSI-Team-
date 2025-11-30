import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase environment variables not found. Database features will be disabled.');
  console.warn('To enable database features, add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.');
}

// Create a single supabase client for interacting with your database
// Use dummy values if env vars are missing (for testing without database)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Export a flag to check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);
