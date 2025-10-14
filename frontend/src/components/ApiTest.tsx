// Create this as a temporary test component: src/components/ApiTest.tsx
import React, { useState } from 'react';
import axios from 'axios';

const ApiTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [testCredentials, setTestCredentials] = useState({
    email: 'test@example.com',
    password: 'testpassword123'
  });

  const testRegistration = async () => {
    setLoading(true);
    try {
      const registrationData = {
        name: 'Test User',
        email: testCredentials.email,
        password: testCredentials.password,
        collegeName: 'Test College',
        branch: 'Computer Science',
        rollNumber: 'TEST123'
      };

      const response = await axios.post('http://localhost:5002/api/v1/auth/register', registrationData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      
      setTestResult(`✅ Registration Success: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error: any) {
      console.error('Registration test error:', error);
      
      const errorDetails = {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      };
      
      setTestResult(`Registration Error: ${JSON.stringify(errorDetails, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  const testDirectAPI = async () => {
    setLoading(true);
    try {
      // Test direct axios call without your service layer
      const response = await axios.post('http://localhost:5002/api/v1/auth/login', {
        email: testCredentials.email,
        password: testCredentials.password
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      
      setTestResult(`✅ Login Success: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error: any) {
      console.error('Direct API test error:', error);
      
      const errorDetails = {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        }
      };
      
      // If it's a 401, that's expected for non-existent user
      if (error.response?.status === 401) {
        setTestResult(`Expected 401 (user doesn't exist): ${JSON.stringify(errorDetails.data, null, 2)}`);
      } else {
        setTestResult(`❌ Unexpected error: ${JSON.stringify(errorDetails, null, 2)}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const testBackendHealth = async () => {
    setLoading(true);
    try {
      // Test a simple endpoint that should exist
      const response = await axios.get('http://localhost:5002/api/v1', {
        withCredentials: true,
      });
      
      setTestResult(`Backend Connection: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error: any) {
      console.error('Backend connection test error:', error);
      
      // Even a 404 means the server is running
      if (error.response?.status === 404) {
        setTestResult(`✅ Backend is running! (Got 404 for /api/v1, which is expected)`);
      } else {
        const errorDetails = {
          status: error.response?.status || 'No response - server may be down',
          statusText: error.response?.statusText || 'No status text',
          message: error.message,
        };
        
        setTestResult(`❌ Backend Connection Error: ${JSON.stringify(errorDetails, null, 2)}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">API Debug Test</h2>
      
      <div className="space-y-4">
        <div className="mb-4 p-4 border rounded">
          <h3 className="font-semibold mb-2">Test Credentials:</h3>
          <input
            type="email"
            value={testCredentials.email}
            onChange={(e) => setTestCredentials(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Email"
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="password"
            value={testCredentials.password}
            onChange={(e) => setTestCredentials(prev => ({ ...prev, password: e.target.value }))}
            placeholder="Password"
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          onClick={testBackendHealth}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Backend Connection'}
        </button>
        
        <button
          onClick={testRegistration}
          disabled={loading}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 ml-2"
        >
          {loading ? 'Testing...' : 'Test Registration'}
        </button>
        
        <button
          onClick={testDirectAPI}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 ml-2"
        >
          {loading ? 'Testing...' : 'Test Login'}
        </button>
      </div>
      
      {testResult && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Test Result:</h3>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
            {testResult}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ApiTest;