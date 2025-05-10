// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// ✅ Load environment variables from Vite (defined in Netlify or local .env file)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ✅ Validate keys before initializing
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase environment variables are missing.");
  throw new Error("Missing Supabase URL or Anon Key in environment variables.");
}

// ✅ Create and export Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
