// frontend/src/App.tsx - Update with new auth routes
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { HackathonProvider } from "./context/HackathonContext";
import { InterviewProvider } from "./context/InterviewContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Coding from "./pages/Coding";
import ARV from "./pages/ARV";
import { Interview } from "./pages/Interview";
import { Hackathons } from "./pages/Hackathons";
import NotFound from "./pages/NotFound";

// Import new auth pages
import { SignIn } from "./components/auth/SignIn";
import { SignUp } from "./components/auth/SignUp";
import { ForgotPassword } from "./components/auth/ForgotPassword";

import ApiTest from "./components/ApiTest";
import HackathonDebug from "./components/HackathonDebug";
import ProblemPage from "./components/coding/ProblemPage";
import {CodingPage} from "./pages/CodingPage";
import { ARVPage } from "./pages/ARVPage";
import { WeeklyTestPage } from "./pages/WeeklyTestPage";

const queryClient = new QueryClient();

const App = () => (
  <AuthProvider>
    <HackathonProvider>
      <InterviewProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Auth Routes - Outside of Layout */}
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                
                {/* Main App Routes */}
                <Route path="/" element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="coding" element={<Coding />} />  
                  <Route path="coding/problem/:id" element={<CodingPage />} />
                  <Route path="arvtemp" element={<ARVPage />} />
                  <Route path="weekly-tests" element={<WeeklyTestPage />} />
                  <Route path="arv" element={<ARV />} />
                  <Route path="interview" element={<Interview />} />
                  <Route path="hackathons" element={<Hackathons />} />
                  <Route path="/api-test" element={<ApiTest />} />
                  <Route path="/debug" element={<HackathonDebug />} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </InterviewProvider>
    </HackathonProvider>
  </AuthProvider>
);

export default App;