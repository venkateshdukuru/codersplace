
// frontend/src/context/InterviewContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { interviewService, Interview, InterviewFilters, SubmitInterviewData } from '../services/interviewServices';
import { useAuth } from './AuthContext';

interface InterviewContextType {
  interviews: Interview[];
  isLoading: boolean;
  error: string | null;
  filters: InterviewFilters;
  setFilters: (filters: InterviewFilters) => void;
  refreshInterviews: () => Promise<void>;
  submitInterview: (interviewId: string, data: SubmitInterviewData) => Promise<{ score: number; total: number }>;
}

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export const useInterviews = () => {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error('useInterviews must be used within an InterviewProvider');
  }
  return context;
};

interface InterviewProviderProps {
  children: ReactNode;
}

export const InterviewProvider: React.FC<InterviewProviderProps> = ({ children }) => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<InterviewFilters>({});
  const { isAuthenticated } = useAuth();

  const fetchInterviews = useCallback(async () => {
    console.log('🔄 Starting to fetch interviews...');
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await interviewService.getInterviews(filters);
      console.log(' Service response:', response);
      
      if (response.success && Array.isArray(response.data)) {
        console.log(' Setting interviews:', response.data.length, 'items');
        setInterviews(response.data);
        setError(null);
      } else {
        console.log('⚠️ Response indicates failure or invalid data:', response);
        setError(response.message || 'Failed to fetch interviews');
        setInterviews([]);
      }
    } catch (err: unknown) {
      console.error(' Fetch interviews error:', err);
      
      let errorMessage = 'Failed to fetch interviews';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setInterviews([]);
    } finally {
      console.log(' Fetch interviews completed');
      setIsLoading(false);
    }
  }, [filters]); // Removed isAuthenticated dependency

  useEffect(() => {
    console.log('🎯 useEffect triggered, calling fetchInterviews...');
    fetchInterviews(); // Always fetch, not dependent on authentication
  }, [fetchInterviews]);

  const refreshInterviews = async () => {
    console.log('Manual refresh triggered');
    await fetchInterviews();
  };

  const submitInterview = async (interviewId: string, data: SubmitInterviewData) => {
    // Submission still requires authentication
    if (!isAuthenticated) {
      throw new Error('Please login to submit interview answers');
    }
    
    try {
      console.log('🎯 Attempting to submit interview:', interviewId);
      const response = await interviewService.submitInterview(interviewId, data);
      
      if (response.success) {
        // Refresh interviews to update completion status
        await refreshInterviews();
        return { score: response.score, total: response.total };
      } else {
        throw new Error(response.message || 'Failed to submit interview');
      }
    } catch (err: unknown) {
      console.error('Interview submission error:', err);
      if (err instanceof Error) {
        throw err;
      } else {
        throw new Error('Failed to submit interview');
      }
    }
  };

  const value: InterviewContextType = {
    interviews,
    isLoading,
    error,
    filters,
    setFilters,
    refreshInterviews,
    submitInterview,
  };

  console.log('🎭 InterviewProvider render:', { 
    interviewsCount: interviews.length, 
    isLoading, 
    error,
    interviewTitles: interviews.map(i => i.title)
  });

  return <InterviewContext.Provider value={value}>{children}</InterviewContext.Provider>;
};

