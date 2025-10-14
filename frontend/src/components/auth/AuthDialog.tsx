// frontend/src/components/auth/AuthDialog.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { 
  Loader2, 
  Mail, 
  Lock, 
  User, 
  Building2, 
  GraduationCap, 
  Hash,
  Eye,
  EyeOff,
  ArrowLeft,
  Sparkles,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AuthDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface InputFieldProps {
  icon: React.ElementType;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  id: string;
  disabled?: boolean;
  maxLength?: number;
  autoComplete?: string;
}

interface PasswordFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  showPassword: boolean;
  onToggle: () => void;
  autoComplete?: string;
  disabled?: boolean;
}

// Move InputField component outside to prevent recreation
const InputField: React.FC<InputFieldProps> = ({ 
  icon: Icon, 
  label, 
  type = "text", 
  value, 
  onChange, 
  placeholder,
  required = true,
  id,
  disabled = false,
  maxLength,
  autoComplete
}) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-200">
      {label}
    </Label>
    <div className="relative group">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors pointer-events-none z-10" />
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        autoComplete={autoComplete}
        className="pl-10 h-12 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 transition-all"
      />
    </div>
  </div>
);

// Move PasswordField component outside to prevent recreation
const PasswordField: React.FC<PasswordFieldProps> = ({ 
  label, 
  id, 
  value, 
  onChange, 
  placeholder, 
  showPassword, 
  onToggle, 
  autoComplete,
  disabled = false
}) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-200">
      {label}
    </Label>
    <div className="relative group">
      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors pointer-events-none z-10" />
      <Input
        id={id}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        disabled={disabled}
        autoComplete={autoComplete}
        className="pl-10 pr-10 h-12 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 transition-all"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors z-10"
        tabIndex={-1}
      >
        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  </div>
);

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

export const AuthDialog = ({ isOpen, onOpenChange }: AuthDialogProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<"login" | "signup" | "forgot">("login");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // Separate password visibility states
  const [passwordVisibility, setPasswordVisibility] = useState({
    loginPassword: false,
    signupPassword: false,
    signupConfirmPassword: false,
    forgotNewPassword: false,
    forgotConfirmPassword: false,
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    collegeName: "",
    branch: "",
    rollNumber: "",
    password: "",
    confirmPassword: ""
  });

  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmNewPassword: "",
    otpSent: false
  });

  const { toast } = useToast();
  const { login, register } = useAuth();

  // Toggle password visibility for specific field
  const togglePasswordVisibility = (field: keyof typeof passwordVisibility) => {
    setPasswordVisibility(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(loginData);
      toast({
        title: "Login Successful!",
        description: "Welcome back!",
      });
      setLoginData({ email: "", password: "" });
      onOpenChange(false);
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      toast({
        title: "Error",
        description: "Please agree to the Terms & Conditions",
        variant: "destructive"
      });
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match",
        variant: "destructive"
      });
      return;
    }

    if (signupData.password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    const registrationData = {
      name: signupData.name,
      email: signupData.email,
      collegeName: signupData.collegeName,
      branch: signupData.branch,
      rollNumber: signupData.rollNumber,
      password: signupData.password
    };

    try {
      await register(registrationData);
      
      toast({
        title: "Account Created Successfully!",
        description: `Welcome ${signupData.name}!`,
      });
      
      setSignupData({
        name: "",
        email: "",
        collegeName: "",
        branch: "",
        rollNumber: "",
        password: "",
        confirmPassword: ""
      });
      setAgreedToTerms(false);
      onOpenChange(false);
      navigate('/');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!forgotPasswordData.otpSent) {
        const { authService } = await import('@/services/authService');
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

        const { authService } = await import('@/services/authService');
        const response = await authService.resetPassword({
          email: forgotPasswordData.email,
          otp: forgotPasswordData.otp,
          newPassword: forgotPasswordData.newPassword
        });

        if (response.success) {
          toast({
            title: "Password Reset Successful",
            description: "You can now login with your new password",
          });
          setForgotPasswordData({
            email: "",
            otp: "",
            newPassword: "",
            confirmNewPassword: "",
            otpSent: false
          });
          setActiveView("login");
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] p-0 overflow-hidden bg-white dark:bg-gray-950 border-0">
        {/* Mobile close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="md:hidden absolute right-4 top-4 z-50 rounded-full p-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
        >
          <X className="h-5 w-5 text-white" />
        </button>

        <div className="grid md:grid-cols-2 min-h-[600px] max-h-[90vh]">
          {/* Left Side - Decorative (Hidden on mobile for login/signup, shown for desktop) */}
          <div className="md:flex flex-col justify-center items-center p-6 md:p-12 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 relative overflow-hidden hidden">
            <div className="absolute inset-0 bg-black/10" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative z-10 text-white text-center"
            >
              <Sparkles className="h-12 md:h-16 w-12 md:w-16 mb-4 md:mb-6 mx-auto" />
              <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Welcome to CodersPlace</h2>
              <p className="text-white/80 text-base md:text-lg px-4">
                {activeView === "signup" 
                  ? "Join our community of passionate coders"
                  : "Sign in to continue your coding journey"}
              </p>
            </motion.div>
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          </div>

          {/* Mobile decorative header */}
          <div className="md:hidden bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 p-6 relative">
            <div className="text-white text-center">
              <Sparkles className="h-10 w-10 mb-2 mx-auto" />
              <h2 className="text-xl font-bold">CodersPlace</h2>
            </div>
          </div>

          {/* Right Side - Forms */}
          <div className="p-6 sm:p-8 md:p-12 flex flex-col justify-center overflow-y-auto max-h-[calc(90vh-100px)] md:max-h-full ">
            <AnimatePresence mode="wait">
              {/* Login Form */}
              {activeView === "login" && (
                <motion.div
                  key="login"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="space-y-4 md:space-y-6">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                        Welcome back
                      </h3>
                      <p className="mt-1 md:mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Sign in to your account to continue
                      </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4 md:space-y-5">
                      <InputField
                        icon={Mail}
                        label="Email Address"
                        type="email"
                        id="login-email"
                        value={loginData.email}
                        onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="you@example.com"
                        autoComplete="email"
                        disabled={isLoading}
                      />

                      <PasswordField
                        label="Password"
                        id="login-password"
                        value={loginData.password}
                        onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Enter your password"
                        showPassword={passwordVisibility.loginPassword}
                        onToggle={() => togglePasswordVisibility('loginPassword')}
                        autoComplete="current-password"
                        disabled={isLoading}
                      />

                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setActiveView("forgot")}
                          className="text-sm text-primary hover:text-primary/80 transition-colors"
                        >
                          Forgot password?
                        </button>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full h-11 md:h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all transform hover:scale-[1.02]"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 md:h-5 w-4 md:w-5 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          "Sign In"
                        )}
                      </Button>
                    </form>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-3 md:px-4 bg-white dark:bg-gray-950 text-gray-500">
                          Don't have an account?
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveView("signup")}
                      className="w-full h-11 md:h-12 border-2 border-gray-200 dark:border-gray-700 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
                    >
                      Create New Account
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Signup Form */}
              {activeView === "signup" && (
                <motion.div
                  key="signup"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="space-y-4 md:space-y-6">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                        Create your account
                      </h3>
                      <p className="mt-1 md:mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Join CodersPlace and start coding
                      </p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-3 md:space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                        <InputField
  icon={User}
  label="Full Name"
  id="signup-name"
  value={signupData.name}
  onChange={(e) => {
    const onlyLetters = e.target.value.replace(/[^a-zA-Z\s]/g, ""); 
    setSignupData(prev => ({ ...prev, name: onlyLetters }));
  }}
  placeholder="Amit Sharma"
  autoComplete="name"
  disabled={isLoading}
/>


                        <InputField
                          icon={Mail}
                          label="Email Address"
                          type="email"
                          id="signup-email"
                          value={signupData.email}
                          onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="you@example.com"
                          autoComplete="email"
                          disabled={isLoading}
                        />

                        <InputField
                          icon={Building2}
                          label="College Name"
                          id="signup-college"
                          value={signupData.collegeName}
                          onChange={(e) => setSignupData(prev => ({ ...prev, collegeName: e.target.value }))}
                          placeholder="Enter college"
                          autoComplete="organization"
                          disabled={isLoading}
                        />

                        <InputField
                          icon={GraduationCap}
                          label="Branch"
                          id="signup-branch"
                          value={signupData.branch}
                          onChange={(e) => setSignupData(prev => ({ ...prev, branch: e.target.value }))}
                          placeholder="Computer Science"
                          autoComplete="off"
                          disabled={isLoading}
                        />

                        <InputField
                          icon={Hash}
                          label="Roll Number"
                          id="signup-roll"
                          value={signupData.rollNumber}
                          onChange={(e) => setSignupData(prev => ({ ...prev, rollNumber: e.target.value }))}
                          placeholder="CS2024001"
                          autoComplete="off"
                          disabled={isLoading}
                        />

                        <PasswordField
                          label="Password"
                          id="signup-password"
                          value={signupData.password}
                          onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="Min 8 characters"
                          showPassword={passwordVisibility.signupPassword}
                          onToggle={() => togglePasswordVisibility('signupPassword')}
                          autoComplete="new-password"
                          disabled={isLoading}
                        />
                      </div>

                      <PasswordField
                        label="Confirm Password"
                        id="signup-confirm"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirm password"
                        showPassword={passwordVisibility.signupConfirmPassword}
                        onToggle={() => togglePasswordVisibility('signupConfirmPassword')}
                        autoComplete="new-password"
                        disabled={isLoading}
                      />

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="terms"
                          checked={agreedToTerms}
                          onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                          className="mt-1"
                        />
                        <Label 
                          htmlFor="terms" 
                          className="text-xs md:text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
                        >
                          By signing up, you agree to our{" "}
                          <span className="text-primary hover:underline">Terms & Conditions</span>
                          {" "}and{" "}
                          <span className="text-primary hover:underline">Privacy Policy</span>
                        </Label>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full h-11 md:h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all transform hover:scale-[1.02]"
                        disabled={isLoading || !agreedToTerms}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 md:h-5 w-4 md:w-5 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          "Create Account"
                        )}
                      </Button>
                    </form>

                    <div className="text-center">
                      <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{" "}
                        <button
                          onClick={() => setActiveView("login")}
                          className="text-primary hover:text-primary/80 font-medium transition-colors"
                        >
                          Sign In
                        </button>
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Forgot Password Form */}
              {activeView === "forgot" && (
                <motion.div
                  key="forgot"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="space-y-4 md:space-y-6">
                    <div>
                      <button
                        onClick={() => setActiveView("login")}
                        className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-3 md:mb-4 transition-colors"
                      >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to login
                      </button>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                        Reset your password
                      </h3>
                      <p className="mt-1 md:mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {!forgotPasswordData.otpSent 
                          ? "Enter your email to receive a password reset OTP"
                          : "Enter the OTP and create a new password"
                        }
                      </p>
                    </div>

                    <form onSubmit={handleForgotPassword} className="space-y-4 md:space-y-5">
                      {!forgotPasswordData.otpSent ? (
                        <InputField
                          icon={Mail}
                          label="Email Address"
                          type="email"
                          id="forgot-email"
                          value={forgotPasswordData.email}
                          onChange={(e) => setForgotPasswordData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="you@example.com"
                          autoComplete="email"
                          disabled={isLoading}
                        />
                      ) : (
                        <>
                          <InputField
                            icon={Hash}
                            label="OTP Code"
                            id="forgot-otp"
                            value={forgotPasswordData.otp}
                            onChange={(e) => setForgotPasswordData(prev => ({ ...prev, otp: e.target.value.toUpperCase() }))}
                            placeholder="Enter 6-character OTP"
                            maxLength={6}
                            autoComplete="one-time-code"
                            disabled={isLoading}
                          />
                          
                          <PasswordField
                            label="New Password"
                            id="forgot-new-password"
                            value={forgotPasswordData.newPassword}
                            onChange={(e) => setForgotPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                            placeholder="Min 8 characters"
                            showPassword={passwordVisibility.forgotNewPassword}
                            onToggle={() => togglePasswordVisibility('forgotNewPassword')}
                            autoComplete="new-password"
                            disabled={isLoading}
                          />
                          
                          <PasswordField
                            label="Confirm New Password"
                            id="forgot-confirm-password"
                            value={forgotPasswordData.confirmNewPassword}
                            onChange={(e) => setForgotPasswordData(prev => ({ ...prev, confirmNewPassword: e.target.value }))}
                            placeholder="Confirm new password"
                            showPassword={passwordVisibility.forgotConfirmPassword}
                            onToggle={() => togglePasswordVisibility('forgotConfirmPassword')}
                            autoComplete="new-password"
                            disabled={isLoading}
                          />
                        </>
                      )}

                      <Button 
                        type="submit" 
                        className="w-full h-11 md:h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all transform hover:scale-[1.02]"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 md:h-5 w-4 md:w-5 animate-spin" />
                            {!forgotPasswordData.otpSent ? "Sending OTP..." : "Resetting password..."}
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
                          className="w-full h-11 md:h-12"
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};