import React, { useState } from 'react';

interface Category {
  emoji: string;
  name: string;
  color: string;
  questions: string[];
}

interface WheelSpinnerProps {
  categories: Category[];
  onResult: (category: Category, question: string) => void;
  isSpinning: boolean;
}

const WheelSpinner: React.FC<WheelSpinnerProps> = ({ categories, onResult, isSpinning }) => {
  const [rotation, setRotation] = useState(0);

  const spinWheel = () => {
    if (isSpinning) return;
    
    const spins = Math.floor(Math.random() * 5) + 5; // 5-9 vueltas
    const finalRotation = rotation + spins * 360 + Math.floor(Math.random() * 360);
    
    setRotation(finalRotation);
    
    setTimeout(() => {
      const normalizedRotation = finalRotation % 360;
      const segmentAngle = 360 / categories.length;
      const selectedIndex = Math.floor((360 - normalizedRotation + segmentAngle / 2) / segmentAngle) % categories.length;
      
      const selectedCategory = categories[selectedIndex];
      const randomQuestion = selectedCategory.questions[Math.floor(Math.random() * selectedCategory.questions.length)];
      
      onResult(selectedCategory, randomQuestion);
    }, 3000);
  };

  const segmentAngle = 360 / categories.length;

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative w-80 h-80 mb-6">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
          <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-b-[25px] border-l-transparent border-r-transparent border-b-white drop-shadow-lg"></div>
        </div>
        
        {/* Wheel */}
        <div 
          className={`relative w-full h-full rounded-full border-4 border-white shadow-2xl transition-transform duration-[3000ms] ease-out`}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <svg className="w-full h-full" viewBox="0 0 200 200">
            {categories.map((category, index) => {
              const startAngle = index * segmentAngle;
              const endAngle = (index + 1) * segmentAngle;
              
              const startAngleRad = (startAngle * Math.PI) / 180;
              const endAngleRad = (endAngle * Math.PI) / 180;
              
              const x1 = 100 + 90 * Math.cos(startAngleRad);
              const y1 = 100 + 90 * Math.sin(startAngleRad);
              const x2 = 100 + 90 * Math.cos(endAngleRad);
              const y2 = 100 + 90 * Math.sin(endAngleRad);
              
              const largeArcFlag = segmentAngle > 180 ? 1 : 0;
              
              const pathData = `M 100 100 L ${x1} ${y1} A 90 90 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
              
              const textAngle = startAngle + segmentAngle / 2;
              const textAngleRad = (textAngle * Math.PI) / 180;
              const textX = 100 + 60 * Math.cos(textAngleRad);
              const textY = 100 + 60 * Math.sin(textAngleRad);
              
              return (
                <g key={index}>
                  <path d={pathData} fill={category.color} stroke="white" strokeWidth="2" />
                  <text
                    x={textX}
                    y={textY - 5}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="20"
                    transform={`rotate(${textAngle > 90 && textAngle < 270 ? textAngle + 180 : textAngle}, ${textX}, ${textY})`}
                  >
                    {category.emoji}
                  </text>
                  <text
                    x={textX}
                    y={textY + 8}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="8"
                    fill="white"
                    fontWeight="bold"
                    transform={`rotate(${textAngle > 90 && textAngle < 270 ? textAngle + 180 : textAngle}, ${textX}, ${textY})`}
                  >
                    {category.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
      
      <button
        onClick={spinWheel}
        disabled={isSpinning}
        className={`px-8 py-4 text-white font-bold text-xl rounded-full shadow-lg transform transition-all duration-200 ${
          isSpinning 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-105 active:scale-95'
        }`}
      >
        {isSpinning ? 'Girando...' : '¡Girar Ruleta!'}
      </button>
    </div>
  );
};

export default WheelSpinner;