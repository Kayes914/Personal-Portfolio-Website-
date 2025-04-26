import { createClient } from '@supabase/supabase-js';

// Get environment variables or use hardcoded values as fallback
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ielnmrbzdausronymhdc.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllbG5tcmJ6ZGF1c3JvbnltaGRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3OTk3MjksImV4cCI6MjA2MDM3NTcyOX0.CKIqa7294ynyV5EE0P3ZPfbsWytmFgolp6vRp6zhPss";

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
});

// Add error handling middleware for browser environments
if (typeof window !== 'undefined') {
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event);
  });
}

// Safe RPC function that handles errors
export async function safeRpc(fnName: string, params?: object, options?: any) {
  try {
    return await supabase.rpc(fnName, params, options);
  } catch (error) {
    console.error('Supabase RPC error:', error);
    throw error;
  }
} 