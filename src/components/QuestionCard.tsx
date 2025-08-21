import React from 'react';
import { X } from 'lucide-react';

interface QuestionCardProps {
  category: {
    emoji: string;
    name: string;
    color: string;
  };
  question: string;
  currentPlayer: number;
  onFinishTurn: () => void;
  onClose: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ 
  category, 
  question, 
  currentPlayer, 
  onFinishTurn,
  onClose 
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-8 relative shadow-2xl transform animate-pulse-gentle">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="text-center mb-8">
          <div 
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ backgroundColor: category.color }}
          >
            <span className="text-3xl">{category.emoji}</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{category.name}</h2>
          <div className="inline-block px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full font-semibold">
            Turno del Jugador {currentPlayer}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-8">
          <p className="text-lg text-gray-700 leading-relaxed text-center font-medium">
            {question}
          </p>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={onFinishTurn}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-full hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Finalizar Turno
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;