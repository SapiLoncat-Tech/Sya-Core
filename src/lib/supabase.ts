import { createClient } from '@supabase/supabase-js';

// Pastikan untuk mengganti nilai ini di file .env.local nantinya
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
