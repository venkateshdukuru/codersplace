
// frontend/src/services/interviewServices.ts
import publicApi from './publicApi'; // Use public API for interviews
import api from './api'; // Keep regular API for authenticated operations like submission

export interface InterviewQuestion {
  text: string;
  options: string[];
  correct: number;
}

export interface Interview {
  _id: string;
  title: string;
  questions: InterviewQuestion[];
  createdAt: string;
  updatedAt?: string;
  completedBy: string[];
}

export interface InterviewFilters {
  title?: string;
}

export interface SubmitInterviewData {
  answers: number[];
}

class InterviewService {
  async getInterviews(filters?: InterviewFilters) {
    try {
      console.log('🚀 Fetching interviews from public API...');
      
      const params = new URLSearchParams();
      if (filters?.title) params.append('title', filters.title);

      const endpoint = `/interview/public${params.toString() ? `?${params.toString()}` : ''}`;
      console.log('📡 Calling endpoint:', endpoint);
      
      // Use publicApi to avoid sending auth headers
      const response = await publicApi.get(endpoint);
      
      console.log('✅ Response status:', response.status);
      console.log('📦 Response data:', response.data);
      
      // Handle your backend response format
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data || []
        };
      }
      
      return {
        success: false,
        data: [],
        message: response.data?.message || 'Invalid response format'
      };
    } catch (error: any) {
      console.error('❌ Error fetching interviews:', error);
      
      let errorMessage = 'Failed to fetch interviews';
      if (error.response) {
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'No response from server. Please check if the backend is running';
      } else {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        data: [],
        message: errorMessage
      };
    }
  }

  async getInterviewById(id: string) {
    try {
      console.log('🚀 Fetching interview by ID:', id);
      // Use publicApi for fetching individual interview details
      const response = await publicApi.get(`/interview/${id}`);
      console.log('✅ Interview response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching interview by ID:', error);
      throw error;
    }
  }

  async submitInterview(interviewId: string, data: SubmitInterviewData) {
    try {
      console.log('🚀 Submitting interview:', interviewId);
      
      // Use authenticated API for submission
      const response = await api.post(`/interview/${interviewId}/submit`, data);
      
      console.log('✅ Submission response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error submitting interview:', error);
      
      let errorMessage = 'Failed to submit interview';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      throw new Error(errorMessage);
    }
  }
}

// Make sure to export the service instance properly
export const interviewService = new InterviewService();