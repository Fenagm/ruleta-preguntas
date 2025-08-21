import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Generate a session ID for anonymous users
export const getSessionId = () => {
  let sessionId = localStorage.getItem('conversation_game_session');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('conversation_game_session', sessionId);
  }
  return sessionId;
};

export type CustomQuestion = {
  id: string;
  question: string;
  category: string;
  created_at: string;
  user_id?: string;
  session_id?: string;
};