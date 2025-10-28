// frontend/src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, LoginData, RegisterData, AdminRegisterData, User, VerifyOTPData } from '../services/authService';
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string;
  role: string;
  collegeId?: string;
  collegeName?: string;
  email?: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  verifyAndCompleteRegistration: (data: VerifyOTPData) => Promise<void>;
  registerAdmin: (data: AdminRegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded: DecodedToken = jwtDecode(token);
          const response = await authService.getProfile();
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            setUser({
              _id: decoded.id,
              name: decoded.name || 'User',
              email: decoded.email || '',
              collegeName: decoded.collegeName || '',
              branch: '',
              rollNumber: '',
              role: decoded.role as any,
              collegeId: decoded.collegeId,
              createdAt: new Date().toISOString(),
            });
          }
        } catch (error) {
          console.error('Token decode error:', error);
          localStorage.removeItem('token');
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: LoginData) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      if (response.success) {
        try {
          const profileResponse = await authService.getProfile();
          if (profileResponse.success && profileResponse.data) {
            setUser(profileResponse.data);
          } else {
            const token = localStorage.getItem('token');
            if (token) {
              const decoded: DecodedToken = jwtDecode(token);
              setUser({
                _id: decoded.id,
                name: decoded.name || data.email.split('@')[0],
                email: data.email,
                collegeName: decoded.collegeName || '',
                branch: '',
                rollNumber: '',
                role: decoded.role as any,
                collegeId: decoded.collegeId,
                createdAt: new Date().toISOString(),
              });
            }
          }
        } catch (profileError) {
          console.warn('Could not fetch profile, using token data');
          const token = localStorage.getItem('token');
          if (token) {
            const decoded: DecodedToken = jwtDecode(token);
            setUser({
              _id: decoded.id,
              name: decoded.name || data.email.split('@')[0],
              email: data.email,
              collegeName: decoded.collegeName || '',
              branch: '',
              rollNumber: '',
              role: decoded.role as any,
              collegeId: decoded.collegeId,
              createdAt: new Date().toISOString(),
            });
          }
        }
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      localStorage.removeItem('token');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAndCompleteRegistration = async (data: VerifyOTPData) => {
    setIsLoading(true);
    try {
      const response = await authService.verifyRegistration(data);
      if (response.success) {
        const token = localStorage.getItem('token');
        if (token) {
          const decoded: DecodedToken = jwtDecode(token);
          
          // Use user data from response if available
          if (response.user) {
            setUser(response.user);
          } else {
            setUser({
              _id: decoded.id,
              name: decoded.name || data.email.split('@')[0],
              email: data.email,
              collegeName: decoded.collegeName || '',
              branch: '',
              rollNumber: '',
              role: 'student',
              collegeId: decoded.collegeId,
              createdAt: new Date().toISOString(),
              emailVerified: true,
            });
          }
        }
      } else {
        throw new Error(response.message || 'Verification failed');
      }
    } catch (error) {
      localStorage.removeItem('token');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const registerAdmin = async (data: AdminRegisterData) => {
    setIsLoading(true);
    try {
      const response = await authService.registerAdmin(data);
      if (response.success) {
        const token = localStorage.getItem('token');
        if (token) {
          const decoded: DecodedToken = jwtDecode(token);
          setUser({
            _id: decoded.id,
            name: data.name || data.email.split('@')[0],
            email: data.email,
            collegeName: decoded.collegeName || '',
            branch: data.branch || 'Faculty',
            rollNumber: data.rollNumber || '',
            role: 'superadmin',
            collegeId: decoded.collegeId,
            createdAt: new Date().toISOString(),
          });
        }
      } else {
        throw new Error(response.message || 'Admin registration failed');
      }
    } catch (error) {
      localStorage.removeItem('token');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('token');
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authService.getProfile();
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        const token = localStorage.getItem('token');
        if (!token) {
          setUser(null);
          localStorage.removeItem('token');
        }
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
      }
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    verifyAndCompleteRegistration,
    registerAdmin,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};