import { useState } from 'react';

interface FlashcardData {
  id: string;
  question: string;
  answer: string;
  options: string[];
}

interface FlashcardProps {
  flashcard: FlashcardData;
}

export default function Flashcard({ flashcard }: FlashcardProps) {
  const [flip, setFlip] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative rounded-2xl shadow-md cursor-pointer transition-all duration-300 bg-gradient-to-br from-[#fef3c7] to-[#fde68a] select-none w-full min-h-[160px]"
      style={{ 
        transformStyle: 'preserve-3d',
        transform: `perspective(1000px) rotateY(${flip ? 180 : 0}deg) translateY(${isHovered ? -4 : 0}px)`,
        boxShadow: isHovered ? '0 10px 20px rgba(0,0,0,0.15)' : '0 4px 6px rgba(0,0,0,0.1)'
      }}
      onClick={() => setFlip(!flip)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="w-full min-h-[160px] p-6 flex flex-col justify-between text-slate-800 relative" 
        style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
      >
        <div className="text-sm font-bold text-center flex-grow flex items-center justify-center leading-relaxed">
          {flashcard.question}
        </div>
        {flashcard.options && flashcard.options.length > 0 && (
          <div className="flex flex-col gap-1 bg-black/5 p-3 rounded-lg backdrop-blur-sm mt-3">
            {flashcard.options.map((option) => (
              <div className="text-xs text-slate-700 flex flex-row items-center gap-1.5" key={option}>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0" />
                <span className="truncate">{option}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div 
        className="absolute inset-0 p-6 flex items-center justify-center text-white font-bold text-base text-center bg-gradient-to-br from-blue to-blue-brighter rounded-2xl" 
        style={{ 
          backfaceVisibility: 'hidden', 
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)'
        }}
      >
        {flashcard.answer}
      </div>
    </div>
  );
}
