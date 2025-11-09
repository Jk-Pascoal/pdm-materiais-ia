
import React from 'react';

interface QualityScoreProps {
  score: number;
}

const QualityScore: React.FC<QualityScoreProps> = ({ score }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s < 50) return 'text-red-500';
    if (s < 80) return 'text-yellow-500';
    return 'text-green-500';
  };
  
  const colorClass = getColor(score);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full" viewBox="0 0 120 120">
          <circle
            className="text-gray-200"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
          />
          <circle
            className={`transition-all duration-500 ease-in-out ${colorClass}`}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-3xl font-bold ${colorClass}`}>{score}</span>
          <span className={`text-lg font-medium ${colorClass}`}>%</span>
        </div>
      </div>
      <p className="mt-2 text-sm font-medium text-gray-600">Completeness Score</p>
    </div>
  );
};

export default QualityScore;
