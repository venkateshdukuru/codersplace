// frontend/src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Coding from "./pages/Coding";
import ARV from "./pages/ARV";
import NotFound from "./pages/NotFound";
import Hackathons from "./pages/Hackathons";

// Auth Pages
import { SignIn } from "./components/auth/SignIn";
import { SignUp } from "./components/auth/SignUp";
import { ForgotPassword } from "./components/auth/ForgotPassword";
import Terms from "./components/auth/Terms";
import PrivacyPolicy from "./components/auth/PrivacyPolicy";
import { Interview } from "./pages/Interview";
import CodingPage from "./pages/CodingPage";
import { InterviewProvider } from "./context/InterviewContext";
import Profile from "./components/auth/Profile-info";
import ScrollToTop from "./components/ScrollToTop";

// ✅ Import ScrollToTop


export const serverUrl = "http://localhost:5002";
const queryClient = new QueryClient();

const App = () => {
  return (
    <AuthProvider>
      {/* <HackathonProvider> */}
      <InterviewProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              {/* ✅ Add ScrollToTop inside BrowserRouter */}
              <ScrollToTop />

              <Routes>
                {/* Auth Routes - No Layout */}
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />

                {/* Main App Routes - With Layout */}
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="/coding" element={<Coding />} />
                  <Route path="solve/:id" element={<CodingPage />} />
                  <Route path="arv" element={<ARV />} />
                  <Route path="interview" element={<Interview />} />
                  <Route path="hackathons" element={<Hackathons />} />
                  <Route path="profile-info" element={<Profile />} />
                  {/* <Route path="api-test" element={<ApiTest />} /> */}
                  {/* <Route path="debug" element={<HackathonDebug />} /> */}
                </Route>

                {/* Catch-all route for 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </InterviewProvider>
      {/* </HackathonProvider> */}
    </AuthProvider>
  );
};

export default App;
