import React, { useState } from 'react';
import WheelSpinner from './components/WheelSpinner';
import QuestionCard from './components/QuestionCard';
import PlayerSelector from './components/PlayerSelector';
import CustomQuestions from './components/CustomQuestions';
import { useCustomQuestions } from './hooks/useCustomQuestions';
import { gameCategories } from './data/questions';
import { Sparkles } from 'lucide-react';

function App() {
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [showCustomQuestions, setShowCustomQuestions] = useState(false);
  const { questions: customQuestions } = useCustomQuestions();

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
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Un juego mágico para conectar, descubrir y divertirse juntos. 
            ¡Cada pregunta es una aventura nueva!
          </p>
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
              
              <div className="mt-6 flex space-x-4">
                <button
                  onClick={() => setShowCustomQuestions(!showCustomQuestions)}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-full hover:from-indigo-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  {showCustomQuestions ? 'Ocultar' : 'Personalizar'} Preguntas
                </button>
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
              {gameCategories.map((category, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-all duration-200">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: category.color + '20' }}
                  >
                    <span className="text-2xl">{category.emoji}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600">
                    {category.questions.length} preguntas disponibles
                  </p>
                </div>
              ))}
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
      </div>
    </div>
  );
}

export default App;