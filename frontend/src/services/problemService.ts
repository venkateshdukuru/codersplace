// src/services/problemService.ts

import { apiClient } from './CodingApi';
import { Problem, ApiResponse, SubmissionResult } from '../types';

export const problemService = {
  getProblems: async (params?: {
    id?: string;
    title?: string;
    difficulty?: string;
    type?: 'all' | 'public' | 'college';
  }): Promise<ApiResponse<Problem[]>> => {
    const cleanParams: Record<string, string> = {};
    
    if (params?.id) cleanParams.id = params.id;
    if (params?.title) cleanParams.title = params.title;
    if (params?.difficulty) cleanParams.difficulty = params.difficulty;
    if (params?.type && params.type !== 'all') cleanParams.type = params.type;

    const response = await apiClient.get('/problem', { 
      params: Object.keys(cleanParams).length > 0 ? cleanParams : undefined 
    });
    return response.data;
  },

  // ✅ NEW: Get single problem by ID
  getProblemById: async (id: string): Promise<ApiResponse<Problem>> => {
    const response = await apiClient.get('/problem', { 
      params: { id } 
    });
    
    // Backend returns array, so extract first item
    if (response.data.success && response.data.data.length > 0) {
      return {
        success: true,
        data: response.data.data[0],
        message: 'Problem fetched successfully'
      };
    }
    
    throw new Error('Problem not found');
  },

  submitProblem: async (
    problemId: string,
    code: string,
    language: number
  ): Promise<SubmissionResult> => {
    const response = await apiClient.post(`/problem/${problemId}/submit`, {
      code,
      language,
    });
    return response.data;
  },

  createPublicProblem: async (problemData: Partial<Problem>): Promise<ApiResponse<Problem>> => {
    const response = await apiClient.post('/problem/public', problemData);
    return response.data;
  },

  createCollegeProblem: async (problemData: Partial<Problem>): Promise<ApiResponse<Problem>> => {
    const response = await apiClient.post('/problem/college', problemData);
    return response.data;
  },
};