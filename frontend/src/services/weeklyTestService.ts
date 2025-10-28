// src/services/weeklyTestService.ts

import { apiClient } from './CodingApi';
import { WeeklyTest, ApiResponse, SubmissionResult } from '../types';

export const weeklyTestService = {
  // Get weekly tests
  getWeeklyTests: async (params?: {
    id?: string;
    title?: string;
    weekNumber?: string;
    type?: 'all' | 'public' | 'college';
  }): Promise<ApiResponse<WeeklyTest[]>> => {
    const response = await apiClient.get('/weekly-tests', { params });
    return response.data;
  },

  // Get single test
  getWeeklyTest: async (id: string): Promise<ApiResponse<WeeklyTest>> => {
    const response = await apiClient.get(`/weekly-tests/${id}`);
    return response.data;
  },

  // Submit test
  submitWeeklyTest: async (
    testId: string,
    answers: number[]
  ): Promise<SubmissionResult> => {
    const response = await apiClient.post(`/weekly-tests/${testId}/submit`, {
      answers,
    });
    return response.data;
  },

  // Create public test
  createPublicTest: async (testData: Partial<WeeklyTest>): Promise<ApiResponse<WeeklyTest>> => {
    const response = await apiClient.post('/weekly-tests/public', testData);
    return response.data;
  },

  // Create college test
  createCollegeTest: async (testData: Partial<WeeklyTest>): Promise<ApiResponse<WeeklyTest>> => {
    const response = await apiClient.post('/weekly-tests/college', testData);
    return response.data;
  },
};