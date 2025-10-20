// frontend/src/components/auth/SignUp.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import Navigation from "@/components/Navigation";
import Footer from "../footer";
import { OTPVerification } from "./OTPVerification";
import { authService } from "@/services/authService";
import { 
  Loader2, 
  Mail, 
  Lock, 
  User, 
  Building2, 
  GraduationCap, 
  Hash,
  Phone,
  Eye,
  EyeOff,
  ArrowLeft
} from "lucide-react";

export const SignUp = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [registrationEmail, setRegistrationEmail] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    collegeName: "",
    branch: "",
    rollNumber: "",
    mobile: "",
    password: "",
    confirmPassword: ""
  });

  const { toast } = useToast();
  const { verifyAndCompleteRegistration } = useAuth();

  // --- Validation Helpers ---
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateMobile = (mobile: string) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(mobile);
  };

  const evaluatePasswordStrength = (password: string) => {
    let strength = "Weak";
    if (password.length >= 8) {
      const hasUpper = /[A-Z]/.test(password);
      const hasLower = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      const score = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

      if (score >= 3) strength = "Strong";
      else if (score === 2) strength = "Medium";
      else strength = "Weak";
    } else {
      strength = "Weak";
    }
    setPasswordStrength(strength);
  };

  useEffect(() => {
    evaluatePasswordStrength(signupData.password);
  }, [signupData.password]);

  const handleInitiateRegistration = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {};

    if (!signupData.name.trim()) errors.name = "Full name is required";
    if (!validateEmail(signupData.email)) errors.email = "Enter a valid email address";
    if (!signupData.collegeName.trim()) errors.collegeName = "College name is required";
    if (!signupData.branch.trim()) errors.branch = "Branch is required";
    if (!signupData.rollNumber.trim()) errors.rollNumber = "Roll number is required";
    if (!validateMobile(signupData.mobile)) errors.mobile = "Mobile number must be 10 digits";
    if (signupData.password.length < 8)
      errors.password = "Password must be at least 8 characters long";
    if (signupData.password !== signupData.confirmPassword)
      errors.confirmPassword = "Passwords do not match";
    if (!agreedToTerms)
      errors.terms = "You must agree to the Terms & Conditions";

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast({
        title: "Validation Error",
        description: "Please fix the highlighted fields.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.initiateRegistration({
        name: signupData.name,
        email: signupData.email,
        collegeName: signupData.collegeName,
        branch: signupData.branch,
        rollNumber: signupData.rollNumber,
        mobile: signupData.mobile,
        password: signupData.password
      });

      if (response.success) {
        setRegistrationEmail(signupData.email);
        setStep('verify');
        toast({
          title: "OTP Sent!",
          description: "Please check your email for the verification code",
        });
      } else {
        throw new Error(response.message || 'Failed to send OTP');
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to send OTP",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (otp: string) => {
    setIsLoading(true);
    try {
      await verifyAndCompleteRegistration({
        email: registrationEmail,
        otp
      });

      toast({
        title: "Account Created!",
        description: `Welcome ${signupData.name}! Your account has been verified.`,
      });

      navigate('/');
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid or expired OTP",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      const response = await authService.resendOTP({ email: registrationEmail });

      if (response.success) {
        toast({
          title: "OTP Resent",
          description: "A new OTP has been sent to your email",
        });
      } else {
        throw new Error(response.message || 'Failed to resend OTP');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend OTP",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToRegistration = () => {
    setStep('register');
    setRegistrationEmail('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Navigation />

      <div className="flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
            {step === 'verify' && (
              <button
                onClick={handleBackToRegistration}
                className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to registration
              </button>
            )}

            {step === 'register' ? (
              <>
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Create your account
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Join CodersPlace and start coding
                  </p>
                </div>

                <form onSubmit={handleInitiateRegistration} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="name"
                          value={signupData.name}
                          onChange={(e) => {
                            const onlyLetters = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                            setSignupData(prev => ({ ...prev, name: onlyLetters }));
                          }}
                          placeholder="Amit Sharma"
                          required
                          disabled={isLoading}
                          className="pl-10 h-11"
                        />
                      </div>
                      {validationErrors.name && <p className="text-red-500 text-xs">{validationErrors.name}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          value={signupData.email}
                          onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="you@example.com"
                          required
                          disabled={isLoading}
                          className="pl-10 h-11"
                        />
                      </div>
                      {validationErrors.email && <p className="text-red-500 text-xs">{validationErrors.email}</p>}
                    </div>

                    {/* College */}
                    <div className="space-y-2">
                      <Label htmlFor="college">College Name</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="college"
                          value={signupData.collegeName}
                          onChange={(e) => setSignupData(prev => ({ ...prev, collegeName: e.target.value }))}
                          placeholder="Enter college"
                          required
                          disabled={isLoading}
                          className="pl-10 h-11"
                        />
                      </div>
                      {validationErrors.collegeName && <p className="text-red-500 text-xs">{validationErrors.collegeName}</p>}
                    </div>

                    {/* Branch */}
                    <div className="space-y-2">
                      <Label htmlFor="branch">Branch</Label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="branch"
                          value={signupData.branch}
                          onChange={(e) => setSignupData(prev => ({ ...prev, branch: e.target.value }))}
                          placeholder="Computer Science"
                          required
                          disabled={isLoading}
                          className="pl-10 h-11"
                        />
                      </div>
                      {validationErrors.branch && <p className="text-red-500 text-xs">{validationErrors.branch}</p>}
                    </div>

                    {/* Roll Number */}
                    <div className="space-y-2">
                      <Label htmlFor="roll">Roll Number</Label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="roll"
                          value={signupData.rollNumber}
                          onChange={(e) => setSignupData(prev => ({ ...prev, rollNumber: e.target.value }))}
                          placeholder="CS2024001"
                          required
                          disabled={isLoading}
                          className="pl-10 h-11"
                        />
                      </div>
                      {validationErrors.rollNumber && <p className="text-red-500 text-xs">{validationErrors.rollNumber}</p>}
                    </div>

                    {/* Mobile */}
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="mobile">Mobile Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="mobile"
                          type="tel"
                          value={signupData.mobile}
                          onChange={(e) => {
                            const digitsOnly = e.target.value.replace(/[^0-9]/g, "");
                            setSignupData(prev => ({ ...prev, mobile: digitsOnly }));
                          }}
                          placeholder="10-digit mobile number"
                          required
                          maxLength={10}
                          disabled={isLoading}
                          className="pl-10 h-11"
                        />
                      </div>
                      {validationErrors.mobile && <p className="text-red-500 text-xs">{validationErrors.mobile}</p>}
                    </div>
                  </div>

                  {/* Password Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={signupData.password}
                          onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="Min 8 characters"
                          required
                          disabled={isLoading}
                          className="pl-10 pr-10 h-11"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      <p
                        className={`text-xs mt-1 ${
                          passwordStrength === "Strong"
                            ? "text-green-600"
                            : passwordStrength === "Medium"
                            ? "text-yellow-600"
                            : "text-red-500"
                        }`}
                      >
                        Strength: {passwordStrength}
                      </p>
                      {validationErrors.password && <p className="text-red-500 text-xs">{validationErrors.password}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={signupData.confirmPassword}
                          onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          placeholder="Confirm password"
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
                      {validationErrors.confirmPassword && (
                        <p className="text-red-500 text-xs">{validationErrors.confirmPassword}</p>
                      )}
                    </div>
                  </div>

                  {/* Terms & Conditions */}
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                      className="mt-1"
                    />
                    <Label 
                      htmlFor="terms" 
                      className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
                    >
                      I agree to the{" "}
                      <Link
                        to="/terms"
                        className="text-purple-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Terms & Conditions
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy-policy"
                        className="text-purple-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                  {validationErrors.terms && <p className="text-red-500 text-xs">{validationErrors.terms}</p>}

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      "Continue to Verification"
                    )}
                  </Button>

                  {/* Sign In Link */}
                  <div className="text-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Already have an account?{" "}
                      <Link
                        to="/signin"
                        className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                      >
                        Sign In
                      </Link>
                    </span>
                  </div>
                </form>
              </>
            ) : (
              <OTPVerification
                email={registrationEmail}
                onVerify={handleVerifyOTP}
                onResend={handleResendOTP}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </div>

      <div className="mt-10">
        <Footer />
      </div>
    </div>
  );
};
