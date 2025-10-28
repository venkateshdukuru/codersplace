import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import { ToastProvider } from './context/toast';   // adjust the path
import { ToastProvider } from './components/ui/tooast';
import { AuthProvider } from './context/AuthContext';
import { HackathonProvider } from './context/HackathonContext';
import './index.css';
import { ProblemProvider } from './context/ProblemContext';
import { QuizProvider } from './context/QuizContext';
import { WeeklyTestProvider } from './context/WeeklyTestContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>            
      <AuthProvider>
        <HackathonProvider>
          <ProblemProvider>
            <QuizProvider>
              <WeeklyTestProvider>
                <App />
              </WeeklyTestProvider>
            </QuizProvider>
          </ProblemProvider>
          
        </HackathonProvider>
      </AuthProvider>
    </ToastProvider>
  </React.StrictMode>
);
