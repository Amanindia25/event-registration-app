import { createClient } from '@supabase/supabase-js';
import { logError } from './errorHandler';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = 'Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.';
  logError('SupabaseClient', errorMsg);
  throw new Error(errorMsg);
}

// Validate URL format
if (!supabaseUrl.startsWith('https://')) {
  const warningMsg = 'Supabase URL should start with https://';
  logError('SupabaseClient', warningMsg);
}

// Validate key format (should be a long string)
if (supabaseAnonKey.length < 50) {
  const warningMsg = 'Supabase anon key appears to be too short';
  logError('SupabaseClient', warningMsg);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'x-application-name': 'event-registration-app',
    },
  },
  db: {
    schema: 'public',
  },
});

// Add development helpers
if (import.meta.env.DEV) {
  window.supabase = supabase;
}