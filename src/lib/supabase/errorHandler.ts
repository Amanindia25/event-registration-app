import type { PostgrestError } from '@supabase/supabase-js';

export function handleSupabaseError(error: PostgrestError | Error): string {
  if ('code' in error) {
    const pgError = error as PostgrestError;
    
    switch (pgError.code) {
      case '23505': // Unique violation
        return 'This record already exists';
      case '23503': // Foreign key violation
        return 'Referenced record not found';
      case '42501': // Insufficient privileges
        return 'You do not have permission to perform this action';
      case '42P01': // Undefined table
        return 'Database table not found. Please check your database setup';
      case '28000': // Invalid authorization specification
        return 'Authentication failed. Please sign in again';
      default:
        return pgError.message || 'An unknown error occurred';
    }
  }
  
  return error.message || 'An unexpected error occurred';
}

export function logError(context: string, error: unknown) {
  if (import.meta.env.DEV) {
    console.error(`[${context}]`, error);
  }
}