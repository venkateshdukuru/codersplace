// src/contexts/QuizContext.tsx

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Quiz, ApiResponse } from '../types';
import { quizService } from '../services/quizService';

interface QuizContextType {
  quizzes: Quiz[];
  loading: boolean;
  error: string | null;
  meta: ApiResponse<Quiz[]>['meta'];
  fetchQuizzes: (filters?: {
    type?: 'all' | 'public' | 'college' | 'aptitude' | 'reasoning' | 'verbal';
    difficulty?: string;
  }) => Promise<void>;
  submitQuiz: (quizId: string, answers: number[]) => Promise<any>;
  refreshQuizzes: () => Promise<void>;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<ApiResponse<Quiz[]>['meta']>();

  const fetchQuizzes = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await quizService.getQuizzes(filters);
      setQuizzes(response.data);
      setMeta(response.meta);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch quizzes');
      console.error('Error fetching quizzes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const submitQuiz = useCallback(async (quizId: string, answers: number[]) => {
    try {
      setLoading(true);
      const result = await quizService.submitQuiz(quizId, answers);
      return result;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshQuizzes = useCallback(() => fetchQuizzes(), [fetchQuizzes]);

  const value = {
    quizzes,
    loading,
    error,
    meta,
    fetchQuizzes,
    submitQuiz,
    refreshQuizzes,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within QuizProvider');
  }
  return context;
};