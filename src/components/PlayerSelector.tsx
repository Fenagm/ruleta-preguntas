import React from 'react';
import { Users } from 'lucide-react';

interface PlayerSelectorProps {
  currentPlayer: number;
  onPlayerChange: (player: number) => void;
}

const PlayerSelector: React.FC<PlayerSelectorProps> = ({ currentPlayer, onPlayerChange }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
      <div className="flex items-center justify-center mb-4">
        <Users className="text-indigo-600 mr-2" size={24} />
        <h3 className="text-xl font-bold text-gray-800">Turno Actual</h3>
      </div>
      
      <div className="flex justify-center space-x-4">
        {[1, 2].map((player) => (
          <button
            key={player}
            onClick={() => onPlayerChange(player)}
            className={`px-6 py-3 rounded-full font-bold transition-all duration-200 transform hover:scale-105 ${
              currentPlayer === player
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Jugador {player}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlayerSelector;