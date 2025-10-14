// // frontend/src/services/hackathonService.ts

// import api from './api';

// export interface Hackathon {
//   _id: string;
//   title: string;
//   description?: string;
//   startDate: string;
//   endDate: string;
//   createdAt: string;
//   updatedAt?: string;
//   completedBy: string[];
// }

// export interface HackathonFilters {
//   title?: string;
//   startDate?: string;
//   endDate?: string;
// }

// class HackathonService {
//   async getHackathons(filters?: HackathonFilters) {
//     const params = new URLSearchParams();
//     if (filters?.title) params.append('title', filters.title);
//     if (filters?.startDate) params.append('startDate', filters.startDate);
//     if (filters?.endDate) params.append('endDate', filters.endDate);

//     const response = await api.get(`/hackathons?${params.toString()}`);
//     return response.data;
//   }

//   async getHackathonById(id: string) {
//     const response = await api.get(`/hackathons?id=${id}`);
//     return response.data;
//   }

//   async registerForHackathon(hackathonId: string) {
//     // Since there's no specific registration endpoint in backend,
//     // we'll simulate this by adding user to completedBy array
//     const response = await api.post(`/hackathons/${hackathonId}/register`);
//     return response.data;
//   }
// }

// export const hackathonService = new HackathonService();


// frontend/src/services/hackathonService.ts
// frontend/src/services/hackathonService.ts
import api from './api'; // Use the configured API instance

export interface Hackathon {
  _id: string;
  title: string;
  description?: string;
  link?: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt?: string;
  completedBy: string[];
}

export interface HackathonFilters {
  title?: string;
  startDate?: string;
  endDate?: string;
}

class HackathonService {
  async getHackathons(filters?: HackathonFilters) {
    try {
      console.log('🚀 Fetching hackathons from API...');
      
      const params = new URLSearchParams();
      if (filters?.title) params.append('title', filters.title);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      
      // Use the correct endpoint that matches your backend
      const endpoint = `/hackathon${params.toString() ? `?${params.toString()}` : ''}`;
      console.log('📡 Calling endpoint:', endpoint);
      
      const response = await api.get(endpoint);
      
      console.log('✅ Response status:', response.status);
      console.log('📦 Response data:', response.data);
      
      // Your backend returns: {"success":true,"data":[...]}
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data || []
        };
      }
      
      // Fallback for other response formats
      return {
        success: false,
        data: [],
        message: response.data?.message || 'Invalid response format'
      };
      
    } catch (error: any) {
      console.error('❌ Error fetching hackathons:', error);
      
      let errorMessage = 'Failed to fetch hackathons';
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        console.error('No response received:', error.request);
        errorMessage = 'No response from server. Please check if the backend is running on http://localhost:5002';
      } else {
        console.error('Error setting up request:', error.message);
        errorMessage = error.message;
      }
      
      return {
        success: false,
        data: [],
        message: errorMessage
      };
    }
  }

  async getHackathonById(id: string) {
    try {
      console.log('🚀 Fetching hackathon by ID:', id);
      const response = await api.get(`/hackathon/${id}`);
      console.log('✅ Hackathon response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching hackathon by ID:', error);
      throw error;
    }
  }

  async registerForHackathon(hackathonId: string) {
    try {
      console.log('🚀 Registering for hackathon:', hackathonId);
      
      const response = await api.post(`/hackathon/${hackathonId}/register`);
      
      console.log('✅ Registration response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error registering for hackathon:', error);
      
      let errorMessage = 'Failed to register for hackathon';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      throw new Error(errorMessage);
    }
  }
}

// Make sure to export the service instance
export const hackathonService = new HackathonService();