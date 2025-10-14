import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ToastProvider } from './components/ui/toast'; // ✅ fixed typo
import { AuthProvider } from './context/AuthContext';
import { HackathonProvider } from './context/HackathonContext';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>            
      <AuthProvider>
        <HackathonProvider>
          <App />
        </HackathonProvider>
      </AuthProvider>
    </ToastProvider>
  </React.StrictMode>
);