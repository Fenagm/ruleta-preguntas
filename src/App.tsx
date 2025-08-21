import React, { useState, useEffect } from 'react';
import WheelSpinner from './components/WheelSpinner';
import QuestionCard from './components/QuestionCard';
import PlayerSelector from './components/PlayerSelector';
import CustomQuestions from './components/CustomQuestions';
import { useCustomQuestions } from './hooks/useCustomQuestions';
import { gameCategories } from './data/questions';
import { Sparkles, Settings } from 'lucide-react';

function App() {
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [showCustomQuestions, setShowCustomQuestions] = useState(false);
  const { questions: customQuestions, loading } = useCustomQuestions();

  // Merge default categories with custom questions
  const mergedCategories = gameCategories.map(category => ({
    ...category,
    questions: [
      ...category.questions,
      ...customQuestions
        .filter(cq => cq.category === category.name)
        .map(cq => cq.question)
    ]
  }));

  const handleSpinResult = (category: any, question: string) => {
    setSelectedCategory(category);
    setSelectedQuestion(question);
    setIsSpinning(false);
  };

  const handleSpin = () => {
    setIsSpinning(true);
    setSelectedCategory(null);
    setSelectedQuestion('');
  };

  const handleFinishTurn = () => {
    setSelectedCategory(null);
    setSelectedQuestion('');
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
  };

  const handleCloseQuestion = () => {
    setSelectedCategory(null);
    setSelectedQuestion('');
    setIsSpinning(false);
  };

  const handleQuestionsChange = () => {
    // This will trigger a re-render to update the merged categories
    // The useCustomQuestions hook will handle the actual data fetching
  };

  const getTotalQuestions = () => {
    return mergedCategories.reduce((total, category) => total + category.questions.length, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="text-purple-600 mr-3" size={32} />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Ruleta de Conversación
            </h1>
            <Sparkles className="text-pink-600 ml-3" size={32} />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
            Un juego mágico para conectar, descubrir y divertirse juntos. 
            ¡Cada pregunta es una aventura nueva!
          </p>
          {!loading && customQuestions.length > 0 && (
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              {customQuestions.length} preguntas personalizadas activas
            </div>
          )}
        </header>

        <div className="max-w-4xl mx-auto">
          <PlayerSelector 
            currentPlayer={currentPlayer} 
            onPlayerChange={setCurrentPlayer} 
          />

          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center">
              <WheelSpinner
                categories={mergedCategories}
                onResult={handleSpinResult}
                isSpinning={isSpinning}
              />
              
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowCustomQuestions(!showCustomQuestions)}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-full hover:from-indigo-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center"
                >
                  <Settings className="mr-2" size={20} />
                  {showCustomQuestions ? 'Ocultar' : 'Personalizar'} Preguntas
                </button>
                
                {!showCustomQuestions && (
                  <div className="text-center sm:text-left">
                    <p className="text-sm text-gray-600">
                      <strong>{getTotalQuestions()}</strong> preguntas disponibles
                    </p>
                    <p className="text-xs text-gray-500">
                      {customQuestions.length} personalizadas
                    </p>
                  </div>
                )}
              </div>
            </div>

            {showCustomQuestions && (
              <div>
                <CustomQuestions
                  categories={gameCategories}
                  onQuestionsChange={handleQuestionsChange}
                />
              </div>
            )}
          </div>

          {!showCustomQuestions && (
            <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mergedCategories.map((category, index) => {
                const originalCount = gameCategories.find(cat => cat.name === category.name)?.questions.length || 0;
                const customCount = category.questions.length - originalCount;
                
                return (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-all duration-200">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                      style={{ backgroundColor: category.color + '20' }}
                    >
                      <span className="text-2xl">{category.emoji}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{category.name}</h3>
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">{category.questions.length} preguntas disponibles</p>
                      {customCount > 0 && (
                        <p className="text-purple-600 text-xs mt-1">
                          +{customCount} personalizada{customCount !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {selectedCategory && selectedQuestion && (
          <QuestionCard
            category={selectedCategory}
            question={selectedQuestion}
            currentPlayer={currentPlayer}
            onFinishTurn={handleFinishTurn}
            onClose={handleCloseQuestion}
          />
        )}

        {/* Loading overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-40">
            <div className="bg-white rounded-lg p-6 shadow-xl">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-3"></div>
              <p className="text-gray-600">Cargando preguntas personalizadas...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;