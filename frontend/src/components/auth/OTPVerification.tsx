// frontend/src/components/auth/OTPVerification.tsx
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, RefreshCw } from "lucide-react";

interface OTPVerificationProps {
  email: string;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  isLoading: boolean;
}

export const OTPVerification = ({ 
  email, 
  onVerify, 
  onResend, 
  isLoading 
}: OTPVerificationProps) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

const handleChange = (index: number, value: string) => {
  if (value.length > 1) {
    // Handle paste - only numbers
    const pastedData = value.slice(0, 6).replace(/\D/g, '').split("");
    const newOtp = [...otp];
    pastedData.forEach((char, i) => {
      if (index + i < 6) {
        newOtp[index + i] = char;
      }
    });
    setOtp(newOtp);
    
    const nextIndex = Math.min(index + pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
    return;
  }

  // Only allow numbers (0-9)
  if (!/^[0-9]?$/.test(value)) return;

  const newOtp = [...otp];
  newOtp[index] = value;
  setOtp(newOtp);

  // Auto-focus next input
  if (value && index < 5) {
    inputRefs.current[index + 1]?.focus();
  }
};
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length === 6) {
      await onVerify(otpString);
    }
  };

  const handleResend = async () => {
    await onResend();
    setTimer(300);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
          <Mail className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Verify Your Email
        </h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          We've sent a 6-character code to
        </p>
        <p className="font-medium text-purple-600 dark:text-purple-400">
          {email}
        </p>
      </div>

      {/* OTP Input Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label className="text-center block text-sm text-gray-700 dark:text-gray-300">
            Enter OTP Code
          </Label>
          <div className="flex gap-2 justify-center">
            {otp.map((digit, index) => (
              <Input
  key={index}
  ref={(el) => (inputRefs.current[index] = el)}
  type="tel"
  inputMode="numeric"
  pattern="[0-9]*"
  maxLength={1}
  value={digit}
  onChange={(e) => handleChange(index, e.target.value)}
  onKeyDown={(e) => handleKeyDown(index, e)}
  disabled={isLoading}
  className="w-12 h-12 text-center text-lg font-semibold"
  autoFocus={index === 0}
/>
            ))}
          </div>
        </div>

        {/* Timer */}
        <div className="text-center">
          {timer > 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Code expires in{" "}
              <span className="font-semibold text-purple-600 dark:text-purple-400">
                {formatTime(timer)}
              </span>
            </p>
          ) : (
            <p className="text-sm text-red-600 dark:text-red-400">
              Code expired. Please request a new one.
            </p>
          )}
        </div>

        {/* Verify Button */}
        <Button
          type="submit"
          className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          disabled={isLoading || otp.join("").length !== 6}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify & Create Account"
          )}
        </Button>

        {/* Resend Button */}
        <Button
          type="button"
          variant="outline"
          className="w-full h-11"
          onClick={handleResend}
          disabled={!canResend || isLoading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {canResend ? "Resend OTP" : `Resend in ${formatTime(timer)}`}
        </Button>
      </form>

      {/* Help Text */}
      <p className="text-xs text-center text-gray-500 dark:text-gray-400">
        Didn't receive the code? Check your spam folder or click resend.
      </p>
    </div>
  );
};