import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

interface AuthDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AuthDialog = ({ isOpen, onOpenChange }: AuthDialogProps) => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    password: "",
    confirmPassword: ""
  });

  const { toast } = useToast();
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    // Simulate login process - will check credentials with Supabase later
    const userData = {
      name: "Demo User", // This would come from database
      email: loginData.email,
      phone: "+1234567890", // This would come from database
      college: "Demo College", // This would come from database
      joinDate: new Date().toISOString()
    };

    login(userData);
    
    toast({
      title: "Login Successful!",
      description: `Welcome back! You are now logged in as ${loginData.email}`,
    });
    
    // Close dialog and reset form
    setLoginData({ email: "", password: "" });
    onOpenChange(false);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupData.name || !signupData.email || !signupData.phone || !signupData.college || !signupData.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
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
    
    if (signupData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }

    // Create user data and login
    const userData = {
      name: signupData.name,
      email: signupData.email,
      phone: signupData.phone,
      college: signupData.college,
      joinDate: new Date().toISOString()
    };
    
    login(userData);

    toast({
      title: "Account Created Successfully!",
      description: `Welcome ${signupData.name}! Your account has been created and you're now logged in.`,
    });
    
    // Reset form and close dialog
    setSignupData({
      name: "",
      email: "",
      phone: "",
      college: "",
      password: "",
      confirmPassword: ""
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>s
      <DialogContent className="sm:max-w-[500px] ">
        <DialogHeader>
          <DialogTitle>Welcome to CodingPlatform</DialogTitle>
          <DialogDescription>
            Sign in to your account or create a new one to start coding
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Sign In
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
            <TabsContent value="signup">
  <Card className="rounded-2xl shadow-lg">
    <CardHeader>
      <CardTitle>Create Account</CardTitle>
      <CardDescription>
        Fill in your details to create a new account
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form onSubmit={handleSignup} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="signup-name">Full Name</Label>
            <Input
              id="signup-name"
              type="text"
              placeholder="Enter your full name"
              value={signupData.name}
              onChange={(e) => setSignupData(prev => ({ ...prev, name: e.target.value }))}
              required
              className="h-12"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input
              id="signup-email"
              type="email"
              placeholder="Enter your email"
              value={signupData.email}
              onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
              required
              className="h-12"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="signup-phone">Phone Number</Label>
            <Input
              id="signup-phone"
              type="tel"
              placeholder="Enter your phone number"
              value={signupData.phone}
              onChange={(e) => setSignupData(prev => ({ ...prev, phone: e.target.value }))}
              required
              className="h-12"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="signup-college">College Name</Label>
            <Input
              id="signup-college"
              type="text"
              placeholder="Enter your college name"
              value={signupData.college}
              onChange={(e) => setSignupData(prev => ({ ...prev, college: e.target.value }))}
              required
              className="h-12"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="signup-password">Password</Label>
            <Input
              id="signup-password"
              type="password"
              placeholder="Create a password"
              value={signupData.password}
              onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
              required
              className="h-12"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="signup-confirm">Confirm Password</Label>
            <Input
              id="signup-confirm"
              type="password"
              placeholder="Confirm your password"
              value={signupData.confirmPassword}
              onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              required
              className="h-12"
            />
          </div>
        </div>
        <Button type="submit" className="w-full h-12 text-base font-medium rounded-xl">
          Create Account
        </Button>
      </form>
    </CardContent>
  </Card>
</TabsContent>

        </Tabs>
      </DialogContent>
    </Dialog>
  );
};