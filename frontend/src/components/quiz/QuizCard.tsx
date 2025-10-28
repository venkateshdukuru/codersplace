// src/components/quiz/QuizCard.tsx

import React from 'react';
import { Quiz } from '../../types';
import { CollegeBadge } from '../common/CollegeBadge';

interface QuizCardProps {
  quiz: Quiz;
  onClick: () => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({ quiz, onClick }) => {
  const isCompleted = quiz.completedBy.length > 0;

  return (
    <div
      onClick={onClick}
      className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{quiz.title}</h3>
        {isCompleted && (
          <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
        )}
      </div>

      <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
        <span className="flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
          </svg>
          {quiz.questions.length} Questions
        </span>
        {quiz.difficulty && (
          <span className="px-2 py-1 text-xs bg-gray-100 rounded">
            {quiz.difficulty}
          </span>
        )}
      </div>

      <CollegeBadge source={quiz.source} />
    </div>
  );
};