import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ginsvqdxoxmgnidyshmm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpbnN2cWR4b3htZ25pZHlzaG1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NjUxNjIsImV4cCI6MjA3NDU0MTE2Mn0._-nMjHAp-4gC9C7ULIcbZ8KbC0GjACsAI6wvwiZl6Zc';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided in environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
