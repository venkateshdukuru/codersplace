// frontend/src/components/auth/ForgotPassword.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { 
  Loader2, 
  Mail, 
  Lock, 
  Hash,
  Eye,
  EyeOff,
  ArrowLeft
} from "lucide-react";
import { authService } from "@/services/authService";
import Footer from "../Footer";

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmNewPassword: "",
    otpSent: false
  });

  const { toast } = useToast();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!forgotPasswordData.otpSent) {
        const response = await authService.forgotPassword({ 
          email: forgotPasswordData.email 
        });
        
        if (response.success) {
          setForgotPasswordData(prev => ({ ...prev, otpSent: true }));
          toast({
            title: "OTP Sent",
            description: "Check your email for the OTP code",
          });
        } else {
          throw new Error(response.message);
        }
      } else {
        if (forgotPasswordData.newPassword !== forgotPasswordData.confirmNewPassword) {
          toast({
            title: "Error",
            description: "Passwords don't match",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }

        const response = await authService.resetPassword({
          email: forgotPasswordData.email,
          otp: forgotPasswordData.otp,
          newPassword: forgotPasswordData.newPassword
        });

        if (response.success) {
          toast({
            title: "Password Reset Successful",
            description: "You can now sign in with your new password",
          });
          navigate("/signin");
        } else {
          throw new Error(response.message);
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Navigation />
      
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 space-y-6">
            {/* Header */}
            <div>
              <Link
                to="/signin"
                className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-6 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to sign in
              </Link>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Reset your password
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {!forgotPasswordData.otpSent 
                  ? "Enter your email to receive a password reset OTP"
                  : "Enter the OTP and create a new password"
                }
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleForgotPassword} className="space-y-5">
              {!forgotPasswordData.otpSent ? (
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={forgotPasswordData.email}
                      onChange={(e) => setForgotPasswordData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="you@example.com"
                      required
                      disabled={isLoading}
                      className="pl-10 h-11"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="otp">OTP Code</Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="otp"
                        value={forgotPasswordData.otp}
                        onChange={(e) => setForgotPasswordData(prev => ({ ...prev, otp: e.target.value.toUpperCase() }))}
                        placeholder="Enter 6-character OTP"
                        maxLength={6}
                        required
                        disabled={isLoading}
                        className="pl-10 h-11"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={forgotPasswordData.newPassword}
                        onChange={(e) => setForgotPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        placeholder="Min 8 characters"
                        required
                        disabled={isLoading}
                        className="pl-10 pr-10 h-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        tabIndex={-1}
                      >
                        {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={forgotPasswordData.confirmNewPassword}
                        onChange={(e) => setForgotPasswordData(prev => ({ ...prev, confirmNewPassword: e.target.value }))}
                        placeholder="Confirm new password"
                        required
                        disabled={isLoading}
                        className="pl-10 pr-10 h-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {!forgotPasswordData.otpSent ? "Sending OTP..." : "Resetting..."}
                  </>
                ) : (
                  <>
                    {!forgotPasswordData.otpSent ? "Send OTP" : "Reset Password"}
                  </>
                )}
              </Button>

              {forgotPasswordData.otpSent && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11"
                  onClick={() => setForgotPasswordData({
                    email: "",
                    otp: "",
                    newPassword: "",
                    confirmNewPassword: "",
                    otpSent: false
                  })}
                  disabled={isLoading}
                >
                  Try Different Email
                </Button>
              )}
            </form>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
    
  );
};