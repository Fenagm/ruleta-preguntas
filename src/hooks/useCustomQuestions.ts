import { useState, useEffect } from 'react';
import { supabase, getSessionId, type CustomQuestion } from '../lib/supabase';

export const useCustomQuestions = () => {
  const [questions, setQuestions] = useState<CustomQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load questions on mount
  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      let query = supabase
        .from('custom_questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (user) {
        // Authenticated user - get their questions
        query = query.eq('user_id', user.id);
      } else {
        // Anonymous user - get session questions
        const sessionId = getSessionId();
        
        // Set session context for RLS
        await supabase.rpc('set_config', {
          setting_name: 'app.session_id',
          setting_value: sessionId
        });
        
        query = query.eq('session_id', sessionId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setQuestions(data || []);
    } catch (err) {
      console.error('Error loading questions:', err);
      setError(err instanceof Error ? err.message : 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = async (question: string, category: string) => {
    try {
      setError(null);

      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      const newQuestion: Partial<CustomQuestion> = {
        question,
        category,
      };

      if (user) {
        newQuestion.user_id = user.id;
      } else {
        const sessionId = getSessionId();
        newQuestion.session_id = sessionId;
        
        // Set session context for RLS
        await supabase.rpc('set_config', {
          setting_name: 'app.session_id',
          setting_value: sessionId
        });
      }

      const { data, error: insertError } = await supabase
        .from('custom_questions')
        .insert([newQuestion])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      setQuestions(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error adding question:', err);
      setError(err instanceof Error ? err.message : 'Failed to add question');
      throw err;
    }
  };

  const deleteQuestion = async (id: string) => {
    try {
      setError(null);

      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Set session context for RLS for anonymous users
        const sessionId = getSessionId();
        await supabase.rpc('set_config', {
          setting_name: 'app.session_id',
          setting_value: sessionId
        });
      }

      const { error: deleteError } = await supabase
        .from('custom_questions')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      setQuestions(prev => prev.filter(q => q.id !== id));
    } catch (err) {
      console.error('Error deleting question:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete question');
      throw err;
    }
  };

  return {
    questions,
    loading,
    error,
    addQuestion,
    deleteQuestion,
    refetch: loadQuestions
  };
};