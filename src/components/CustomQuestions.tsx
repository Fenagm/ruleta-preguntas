import React, { useState } from 'react';
import { Plus, Trash2, MessageCircle } from 'lucide-react';
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleAddQuestion();
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center mb-4">
          <MessageCircle className="text-purple-600 mr-2" size={24} />
          <h3 className="text-xl font-bold text-gray-800">Tus Preguntas Personalizadas</h3>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Cargando preguntas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center mb-4">
        <MessageCircle className="text-purple-600 mr-2" size={24} />
        <h3 className="text-xl font-bold text-gray-800">Tus Preguntas Personalizadas</h3>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Add new question form */}
      <div className="mb-6 space-y-4">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100">
          <h4 className="text-lg font-semibold text-gray-700 mb-3">Agregar Nueva Pregunta</h4>
          
          <div className="space-y-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu pregunta personalizada... (Ctrl+Enter para agregar)"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
            
            <button
              onClick={handleAddQuestion}
              disabled={!newQuestion.trim() || !selectedCategory}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <Plus size={20} className="mr-2" />
              Agregar Pregunta
            </button>
          </div>
        </div>
      </div>

      {/* Questions list */}
      <div>
        <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
          Tus Preguntas
          <span className="ml-2 bg-purple-100 text-purple-700 text-sm px-2 py-1 rounded-full">
            {questions.length}
          </span>
        </h4>
        
        {questions.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <MessageCircle className="mx-auto text-gray-400 mb-3" size={48} />
            <p className="text-gray-500 text-lg font-medium">
              No tienes preguntas personalizadas aún
            </p>
            <p className="text-gray-400 text-sm mt-1">
              ¡Agrega tu primera pregunta arriba!
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {questions.map((question) => {
              const category = categories.find(cat => cat.name === question.category);
              return (
                <div key={question.id} className="flex items-start justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border hover:shadow-md transition-all duration-200">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-lg mr-2">{category?.emoji || '❓'}</span>
                      <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                        {question.category}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 leading-relaxed">
                      {question.question}
                    </p>
                    <span className="text-xs text-gray-500 mt-1 block">
                      Agregada el {question.created_at.toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteQuestion(question.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-3 flex-shrink-0"
                    title="Eliminar pregunta"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {questions.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            💡 <strong>Tip:</strong> Tus preguntas personalizadas aparecerán automáticamente en la ruleta junto con las preguntas predeterminadas.
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomQuestions;