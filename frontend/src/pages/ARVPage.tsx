// src/pages/ARVPage.tsx

import React, { useEffect, useState } from 'react';
import { useQuiz } from '@/context/QuizContext';
import { QuizCard } from '../components/quiz/QuizCard';
import { QuizAttempt } from '../components/quiz/QuizAttempt';
import { Loader, EmptyState } from '../components/common/LoadingSkeleton';
import { Quiz } from '../types';

const QUIZ_TYPES = [
  { label: 'All', value: 'all' },
  { label: 'Aptitude', value: 'aptitude' },
  { label: 'Reasoning', value: 'reasoning' },
  { label: 'Verbal', value: 'verbal' },
];

const SOURCE_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Your College', value: 'college' },
  { label: 'Public', value: 'public' },
];

export const ARVPage: React.FC = () => {
  const { quizzes, loading, meta, fetchQuizzes, submitQuiz } = useQuiz();
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [typeFilter, setTypeFilter] = useState<any>('all');
  const [sourceFilter, setSourceFilter] = useState<any>('all');

  useEffect(() => {
    fetchQuizzes({
      type: typeFilter,
    });
  }, [typeFilter, fetchQuizzes]);

  const filteredQuizzes = sourceFilter === 'all'
    ? quizzes
    : quizzes.filter(q => 
        sourceFilter === 'college' 
          ? q.source === 'your-college'
          : q.source === 'public'
      );

  const handleSubmit = async (answers: number[]) => {
    if (!selectedQuiz) return;
    return await submitQuiz(selectedQuiz._id, answers);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ARV Practice
          </h1>
          <p className="text-gray-600">
            Aptitude, Reasoning, and Verbal ability questions
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          {/* Type Tabs */}
          <div className="flex gap-2 mb-4">
            {QUIZ_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => setTypeFilter(type.value)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  typeFilter === type.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Source Filter */}
          <div className="flex gap-2">
            {SOURCE_FILTERS.map((source) => (
              <button
                key={source.value}
                onClick={() => setSourceFilter(source.value)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  sourceFilter === source.value
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {source.label}
              </button>
            ))}
          </div>

          {/* Stats */}
          {meta && (
            <div className="mt-4 pt-4 border-t flex gap-6 text-sm text-gray-600">
              <span>Total: {meta.total}</span>
              <span>Your College: {meta.collegeSpecific}</span>
              <span>Public: {meta.public}</span>
            </div>
          )}
        </div>

        {/* Quiz List */}
        {loading ? (
          <Loader />
        ) : filteredQuizzes.length === 0 ? (
          <EmptyState message="No quizzes found" />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredQuizzes.map((quiz) => (
              <QuizCard
                key={quiz._id}
                quiz={quiz}
                onClick={() => setSelectedQuiz(quiz)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quiz Attempt Modal */}
      {selectedQuiz && (
        <QuizAttempt
          quiz={selectedQuiz}
          onSubmit={handleSubmit}
          onClose={() => setSelectedQuiz(null)}
        />
      )}
    </div>
  );
};