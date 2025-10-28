// src/contexts/ProblemContext.tsx

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Problem, ApiResponse } from '../types';
import { problemService } from '../services/problemService';

interface ProblemContextType {
  problems: Problem[];
  currentProblem: Problem | null;
  loading: boolean;
  error: string | null;
  meta: ApiResponse<Problem[]>['meta'];
  fetchProblems: (filters?: {
    difficulty?: string;
    type?: 'all' | 'public' | 'college';
    title?: string;
  }) => Promise<void>;
  getProblem: (id: string) => Promise<Problem | null>;
  submitProblem: (problemId: string, code: string, language: number) => Promise<any>;
  refreshProblems: () => Promise<void>;
}

const ProblemContext = createContext<ProblemContextType | undefined>(undefined);

export const ProblemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<ApiResponse<Problem[]>['meta']>();

  const fetchProblems = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const cleanFilters: any = {};
      
      if (filters.difficulty && filters.difficulty !== 'All') {
        cleanFilters.difficulty = filters.difficulty;
      }
      
      if (filters.type && filters.type !== 'all') {
        cleanFilters.type = filters.type;
      }
      
      if (filters.title) {
        cleanFilters.title = filters.title;
      }

      console.log('📥 Fetching problems with filters:', cleanFilters);
      
      const response = await problemService.getProblems(
        Object.keys(cleanFilters).length > 0 ? cleanFilters : undefined
      );
      
      console.log('✅ Received problems:', response.data.length);
      
      setProblems(response.data);
      setMeta(response.meta);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch problems';
      setError(errorMessage);
      console.error('❌ Error fetching problems:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ NEW: Get single problem
  const getProblem = useCallback(async (id: string): Promise<Problem | null> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📥 Fetching problem:', id);
      
      const response = await problemService.getProblemById(id);
      
      console.log('✅ Received problem:', response.data);
      
      setCurrentProblem(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch problem';
      setError(errorMessage);
      console.error('❌ Error fetching problem:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const submitProblem = useCallback(async (problemId: string, code: string, language: number) => {
    try {
      setLoading(true);
      setError(null);
      const result = await problemService.submitProblem(problemId, code, language);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Submission failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshProblems = useCallback(() => fetchProblems(), [fetchProblems]);

  const value = {
    problems,
    currentProblem,
    loading,
    error,
    meta,
    fetchProblems,
    getProblem,
    submitProblem,
    refreshProblems,
  };

  return <ProblemContext.Provider value={value}>{children}</ProblemContext.Provider>;
};

export const useProblem = () => {
  const context = useContext(ProblemContext);
  if (!context) {
    throw new Error('useProblem must be used within ProblemProvider');
  }
  return context;
};