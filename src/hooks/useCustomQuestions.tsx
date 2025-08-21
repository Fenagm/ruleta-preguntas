import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { db, getSessionId, initAuth, auth, CustomQuestion } from '../lib/firebase';

export const useCustomQuestions = () => {
  const [questions, setQuestions] = useState<CustomQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAndFetch = async () => {
      try {
        await initAuth();
        fetchQuestions();
      } catch (error) {
        console.error('Error initializing:', error);
        setError('Error al inicializar la aplicación');
        setLoading(false);
      }
    };

    initializeAndFetch();
  }, []);

  const fetchQuestions = () => {
    try {
      const sessionId = getSessionId();
      const q = query(
        collection(db, 'custom_questions'),
        where('session_id', '==', sessionId),
        orderBy('created_at', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedQuestions: CustomQuestion[] = [];
        snapshot.forEach((doc) => {
          fetchedQuestions.push({
            id: doc.id,
            ...doc.data(),
            created_at: doc.data().created_at?.toDate() || new Date()
          } as CustomQuestion);
        });
        setQuestions(fetchedQuestions);
        setLoading(false);
        setError(null);
      }, (error) => {
        console.error('Error fetching questions:', error);
        setError('Error al cargar las preguntas');
        setLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up questions listener:', error);
      setError('Error al configurar la carga de preguntas');
      setLoading(false);
    }
  };

  const addQuestion = async (questionText: string, category: string) => {
    try {
      const sessionId = getSessionId();
      const userId = auth.currentUser?.uid;
      
      await addDoc(collection(db, 'custom_questions'), {
        question: questionText,
        category,
        created_at: new Date(),
        session_id: sessionId,
        user_id: userId || null
      });
      
      setError(null);
    } catch (error) {
      console.error('Error adding question:', error);
      setError('Error al agregar la pregunta');
      throw error;
    }
  };

  const deleteQuestion = async (questionId: string) => {
    try {
      await deleteDoc(doc(db, 'custom_questions', questionId));
      setError(null);
    } catch (error) {
      console.error('Error deleting question:', error);
      setError('Error al eliminar la pregunta');
      throw error;
    }
  };

  return {
    questions,
    loading,
    error,
    addQuestion,
    deleteQuestion
  };
};