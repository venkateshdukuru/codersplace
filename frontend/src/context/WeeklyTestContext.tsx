// src/contexts/WeeklyTestContext.tsx

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { WeeklyTest, ApiResponse } from '../types';
import { weeklyTestService } from '../services/weeklyTestService';

interface WeeklyTestContextType {
  weeklyTests: WeeklyTest[];
  loading: boolean;
  error: string | null;
  meta: ApiResponse<WeeklyTest[]>['meta'];
  fetchWeeklyTests: (filters?: {
    weekNumber?: string;
    type?: 'all' | 'public' | 'college';
  }) => Promise<void>;
  submitWeeklyTest: (testId: string, answers: number[]) => Promise<any>;
  refreshWeeklyTests: () => Promise<void>;
}

const WeeklyTestContext = createContext<WeeklyTestContextType | undefined>(undefined);

export const WeeklyTestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [weeklyTests, setWeeklyTests] = useState<WeeklyTest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<ApiResponse<WeeklyTest[]>['meta']>();

  const fetchWeeklyTests = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await weeklyTestService.getWeeklyTests(filters);
      setWeeklyTests(response.data);
      setMeta(response.meta);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch weekly tests');
      console.error('Error fetching weekly tests:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const submitWeeklyTest = useCallback(async (testId: string, answers: number[]) => {
    try {
      setLoading(true);
      const result = await weeklyTestService.submitWeeklyTest(testId, answers);
      return result;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshWeeklyTests = useCallback(() => fetchWeeklyTests(), [fetchWeeklyTests]);

  const value = {
    weeklyTests,
    loading,
    error,
    meta,
    fetchWeeklyTests,
    submitWeeklyTest,
    refreshWeeklyTests,
  };

  return <WeeklyTestContext.Provider value={value}>{children}</WeeklyTestContext.Provider>;
};

export const useWeeklyTest = () => {
  const context = useContext(WeeklyTestContext);
  if (!context) {
    throw new Error('useWeeklyTest must be used within WeeklyTestProvider');
  }
  return context;
};