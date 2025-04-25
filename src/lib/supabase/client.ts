import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Function to create a Supabase client with the proper configuration
export function createClient() {
  // Get environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // Check if environment variables are defined
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and Anon Key must be defined in environment variables');
  }
  
  // Create and return the Supabase client
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
} 