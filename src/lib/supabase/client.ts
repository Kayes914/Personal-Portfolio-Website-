import { supabase } from '@/lib/supabase';

// Function to create a Supabase client with the proper configuration
export function createClient() {
  // Simply return the already instantiated supabase client
  return supabase;
} 