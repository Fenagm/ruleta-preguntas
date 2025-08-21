// CustomQuestions.tsx
import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useCustomQuestions } from '../hooks/useCustomQuestions';

interface Category {
  name: string;
  emoji: string;
}

interface CustomQuestionsProps {
  categories: Category[];
  onQuestionsChange: () => void;
}

const CustomQuestions: React.FC<CustomQuestionsProps> = ({ categories, onQuestionsChange }) => {
  const [newQuestion, setNewQuestion] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { questions, loading, error, addQuestion, deleteQuestion } = useCustomQuestions();

  const handleAddQuestion = async () => {
    if (!newQuestion.trim() || !selectedCategory) return;
    
    try {
      await addQuestion(newQuestion.trim(), selectedCategory);
      setNewQuestion('');
      setSelectedCategory('');
      onQuestionsChange();
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    try {
      await deleteQuestion(id);
      onQuestionsChange();
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Tus Preguntas Personalizadas</h3>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Cargando preguntas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Tus Preguntas Personalizadas</h3>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Add new question form */}
      <div className="mb-6">
        <div className="grid gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((category) => (
              <option key={category.name} value={category.name}>
                {category.emoji} {category.name}
              </option>
            ))}
          </select>
          
          <textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Escribe tu pregunta personalizada..."
            rows={3}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
          
          <button
            onClick={handleAddQuestion}
            disabled={!newQuestion.trim() || !selectedCategory}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Plus size={20} className="mr-2" />
            Agregar Pregunta
          </button>
        </div>
      </div>

      {/* Questions list */}
      <div>
        <h4 className="text-lg font-semibold text-gray-700 mb-3">Tus Preguntas</h4>
        
        {questions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No tienes preguntas personalizadas aún.
          </p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {questions.map((question) => (
              <div key={question.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700">
                    {question.question}
                  </span>
                  <span className="block text-xs text-gray-500 mt-1">
                    Categoría: {question.category}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteQuestion(question.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar pregunta"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomQuestions;