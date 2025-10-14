import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import axios from 'axios';

const HackathonDebug: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testDirectConnection = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🔍 Testing direct connection to http://localhost:8080/hackathons');
      
      const response = await axios.get('http://localhost:8080/hackathons', {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('✅ Direct connection successful:', response);
      setResult({
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers
      });

    } catch (err: any) {
      console.error('❌ Direct connection failed:', err);
      
      let errorDetails = {
        message: 'Unknown error',
        code: null,
        status: null,
        response: null
      };

      if (axios.isAxiosError(err)) {
        errorDetails = {
          message: err.message,
          code: err.code || null,
          status: err.response?.status || null,
          response: err.response?.data || null
        };
      }

      setError(JSON.stringify(errorDetails, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const testServerHealth = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🏥 Testing server health check');
      
      const response = await axios.get('http://localhost:8080/health', {
        timeout: 5000
      });

      setResult({
        healthCheck: 'passed',
        status: response.status,
        data: response.data
      });

    } catch (err: any) {
      console.log('🏥 Health check failed, testing base URL');
      
      try {
        const response = await axios.get('http://localhost:8080/', {
          timeout: 5000
        });
        
        setResult({
          healthCheck: 'base URL works',
          status: response.status,
          data: response.data
        });
      } catch (baseErr: any) {
        setError('Server appears to be down or not responding');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>🔧 Hackathon API Debug Tool</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={testDirectConnection}
              disabled={loading}
              variant="outline"
            >
              {loading ? 'Testing...' : 'Test /hackathons Endpoint'}
            </Button>
            
            <Button 
              onClick={testServerHealth}
              disabled={loading}
              variant="outline"
            >
              {loading ? 'Testing...' : 'Test Server Connection'}
            </Button>
          </div>

          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-700">❌ Error Details</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm text-red-600 whitespace-pre-wrap">{error}</pre>
              </CardContent>
            </Card>
          )}

          {result && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-700">✅ Success Response</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm text-green-800 whitespace-pre-wrap overflow-auto max-h-96">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-700">💡 Troubleshooting Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-blue-800 space-y-2">
              <div>1. Make sure your backend server is running on <code>http://localhost:8080</code></div>
              <div>2. Check if the <code>/hackathons</code> endpoint exists in your backend</div>
              <div>3. Verify CORS is configured to allow requests from your frontend</div>
              <div>4. Check browser console for additional error details</div>
              <div>5. Test the endpoint directly in your browser: <a href="http://localhost:8080/hackathons" target="_blank" className="underline">http://localhost:8080/hackathons</a></div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default HackathonDebug;