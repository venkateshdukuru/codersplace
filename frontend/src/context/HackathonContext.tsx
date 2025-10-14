
// frontend/src/context/HackathonContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { hackathonService, Hackathon, HackathonFilters } from '../services/hackathonService';

interface HackathonContextType {
  hackathons: Hackathon[];
  isLoading: boolean;
  error: string | null;
  filters: HackathonFilters;
  setFilters: (filters: HackathonFilters) => void;
  refreshHackathons: () => Promise<void>;
}

const HackathonContext = createContext<HackathonContextType | undefined>(undefined);

export const useHackathons = () => {
  const context = useContext(HackathonContext);
  if (context === undefined) {
    throw new Error('useHackathons must be used within a HackathonProvider');
  }
  return context;
};

interface HackathonProviderProps {
  children: ReactNode;
}

export const HackathonProvider: React.FC<HackathonProviderProps> = ({ children }) => {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<HackathonFilters>({});

  const fetchHackathons = useCallback(async () => {
    console.log('🔄 Starting to fetch hackathons...');
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await hackathonService.getHackathons(filters);
      console.log(' Service response:', response);
      
      if (response.success && Array.isArray(response.data)) {
        console.log(' Setting hackathons:', response.data.length, 'items');
        setHackathons(response.data);
        setError(null);
      } else {
        console.log('Response indicates failure or invalid data:', response);
        setError(response.message || 'Failed to fetch hackathons');
        setHackathons([]);
      }
    } catch (err: unknown) {
      console.error('Fetch hackathons error:', err);
      
      let errorMessage = 'Failed to fetch hackathons';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setHackathons([]);
    } finally {
      console.log('🏁 Fetch hackathons completed');
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    console.log(' useEffect triggered, calling fetchHackathons...');
    fetchHackathons();
  }, [fetchHackathons]);

  const refreshHackathons = async () => {
    console.log('🔄 Manual refresh triggered');
    await fetchHackathons();
  };

  const value: HackathonContextType = {
    hackathons,
    isLoading,
    error,
    filters,
    setFilters,
    refreshHackathons,
  };

  console.log('HackathonProvider render:', { 
    hackathonsCount: hackathons.length, 
    isLoading, 
    error,
    hackathonTitles: hackathons.map(h => h.title)
  });

  return <HackathonContext.Provider value={value}>{children}</HackathonContext.Provider>;
};