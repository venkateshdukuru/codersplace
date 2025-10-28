// src/services/quizService.ts

import { apiClient } from './CodingApi';
import { Quiz, ApiResponse, SubmissionResult } from '../types';

export const quizService = {
  // Get quizzes with filters
  getQuizzes: async (params?: {
    type?: 'all' | 'public' | 'college' | 'aptitude' | 'reasoning' | 'verbal';
    difficulty?: string;
  }): Promise<ApiResponse<Quiz[]>> => {
    const response = await apiClient.get('/quizzes', { params });
    return response.data;
  },

  // Get single quiz
  getQuiz: async (id: string): Promise<ApiResponse<Quiz>> => {
    const response = await apiClient.get(`/quizzes/${id}`);
    return response.data;
  },

  // Submit quiz answers
  submitQuiz: async (
    quizId: string,
    answers: number[]
  ): Promise<SubmissionResult> => {
    const response = await apiClient.post(`/quizzes/${quizId}/submit`, {
      answers,
    });
    return response.data;
  },

  // Create public quiz
  createPublicQuiz: async (quizData: Partial<Quiz>): Promise<ApiResponse<Quiz>> => {
    const response = await apiClient.post('/quizzes/public', quizData);
    return response.data;
  },

  // Create college quiz
  createCollegeQuiz: async (quizData: Partial<Quiz>): Promise<ApiResponse<Quiz>> => {
    const response = await apiClient.post('/quizzes/college', quizData);
    return response.data;
  },
};