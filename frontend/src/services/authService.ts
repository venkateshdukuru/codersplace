// frontend/src/services/authService.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAuthEndpoint = error.config?.url?.includes('/auth/login') || 
                             error.config?.url?.includes('/auth/register');
      
      if (!isAuthEndpoint) {
        localStorage.removeItem('token');
        if (window.location.pathname !== '/' && window.location.pathname !== '/login') {
          window.location.href = '/';
        }
      }
    }
    return Promise.reject(error);
  }
);

export interface RegisterData {
  name: string;
  email: string;
  collegeName: string;
  branch: string;
  rollNumber: string;
  password: string;
}

export interface VerifyOTPData {
  email: string;
  otp: string;
}

export interface ResendOTPData {
  email: string;
}

export interface AdminRegisterData {
  token: string;
  email: string;
  password: string;
  name?: string;
  rollNumber?: string;
  branch?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
    email: string;
    otp: string;
    newPassword: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  collegeName: string;
  branch: string;
  rollNumber: string;
  role: 'student' | 'faculty' | 'superadmin';
  collegeId?: string;
  createdAt: string;
  lastLogin?: string;
  emailVerified?: boolean;
   avatar?: {
    url?: string;
    fileId?: string;
    uploadedAt?: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  token?: string;
  email?: string;
  user?: User;
}

export const authService = {
  // Step 1: Initiate registration - Send OTP
  async initiateRegistration(data: RegisterData): Promise<ApiResponse> {
    try {
      const response = await api.post('/auth/register/initiate', data);
      return response.data;
    } catch (error: any) {
      console.error('Registration initiation error:', error.response?.data);
      return {
        success: false,
        message: error.response?.data?.error || error.response?.data?.message || 'Failed to send OTP',
      };
    }
  },

  // Step 2: Verify OTP and complete registration
  async verifyRegistration(data: VerifyOTPData): Promise<ApiResponse> {
    try {
      const response = await api.post('/auth/register/verify', data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error: any) {
      console.error('OTP verification error:', error.response?.data);
      return {
        success: false,
        message: error.response?.data?.error || error.response?.data?.message || 'Invalid or expired OTP',
      };
    }
  },

  // Resend OTP
  async resendOTP(data: ResendOTPData): Promise<ApiResponse> {
    try {
      const response = await api.post('/auth/register/resend-otp', data);
      return response.data;
    } catch (error: any) {
      console.error('Resend OTP error:', error.response?.data);
      return {
        success: false,
        message: error.response?.data?.error || error.response?.data?.message || 'Failed to resend OTP',
      };
    }
  },

  // Register admin with invitation token
  async registerAdmin(data: AdminRegisterData): Promise<ApiResponse> {
    try {
      const response = await api.post('/auth/register-admin', data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.error || error.response?.data?.message || 'Admin registration failed',
      };
    }
  },

  // Login user
  async login(data: LoginData): Promise<ApiResponse> {
    try {
      const response = await api.post('/auth/login', data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error.response?.data);
      return {
        success: false,
        message: error.response?.data?.error || error.response?.data?.message || 'Login failed',
      };
    }
  },

  // Get user profile
  async getProfile(): Promise<ApiResponse<User>> {
    try {
      const response = await api.get('/user/profile');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.error || error.response?.data?.message || 'Failed to fetch profile',
      };
    }
  },

  // Forgot password - send OTP
  async forgotPassword(data: ForgotPasswordData): Promise<ApiResponse> {
    try {
      const response = await api.post('/auth/forgot-password', data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.error || error.response?.data?.message || 'Failed to send OTP',
      };
    }
  },

  // Reset password with OTP
  async resetPassword(data: ResetPasswordData): Promise<ApiResponse> {
    try {
      const response = await api.post('/auth/reset-password', data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.error || error.response?.data?.message || 'Failed to reset password',
      };
    }
  },

  // Logout user
  async logout(): Promise<ApiResponse> {
    try {
      const response = await api.post('/auth/logout');
      localStorage.removeItem('token');
      return response.data;
    } catch (error: any) {
      localStorage.removeItem('token');
      return {
        success: true,
        message: 'Logged out successfully',
      };
    }
  },

  // Generate admin invitation (superadmin only)
  async generateAdminInvitation(collegeName: string, uniqueCode: string): Promise<ApiResponse> {
    try {
      const response = await api.post('/auth/admin-invitation', {
        collegeName,
        uniqueCode,
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.error || error.response?.data?.message || 'Failed to generate invitation',
      };
    }
  },
};