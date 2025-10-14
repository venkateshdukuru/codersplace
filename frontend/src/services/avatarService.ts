//path: frontend/src/services/avatarService.ts

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface AvatarUploadResponse {
  success: boolean;
  data?: {
    url: string;
    fileId: string;
  };
  message?: string;
}

export const avatarService = {
  async uploadAvatar(file: File): Promise<AvatarUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.post('/avatar/upload', formData);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to upload avatar',
      };
    }
  },

  async deleteAvatar(): Promise<AvatarUploadResponse> {
    try {
      const response = await api.delete('/avatar/delete');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to delete avatar',
      };
    }
  },

  async getAuthParams() {
    try {
      const response = await api.get('/avatar/auth');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};