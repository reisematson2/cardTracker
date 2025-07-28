import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Initialize and return a Supabase client using environment variables.
 */
export function getClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_KEY || '';
  return createClient(url, key);
}
