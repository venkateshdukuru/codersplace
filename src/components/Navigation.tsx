import { Link, useLocation } from "react-router-dom";
import { Code, Brain, Users, Trophy, Home, LogIn, UserPlus, User, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { AuthDialog } from "./auth/AuthDialog";
import { ProfileDialog } from "./profile/ProfileDialog";
import { useAuth } from "@/context/AuthContext";

const Navigation = () => {
  const location = useLocation();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/coding", label: "Coding", icon: Code },
    { href: "/arv", label: "ARV", icon: Brain },
    { href: "/interview", label: "Interview", icon: Users },
    { href: "/hackathons", label: "Hackathons", icon: Trophy },
  ];

  return (
    <nav className="bg-card shadow-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              CodersPlace
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-gradient-primary text-white shadow-elevated"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
            
            {/* Auth/Profile Section */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 p-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user?.profilePhoto} alt="Profile" />
                      <AvatarFallback className="text-xs">
                        {user?.name ? getInitials(user.name) : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline font-medium">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => setIsProfileDialogOpen(true)}>
                    <User className="w-4 h-4 mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsProfileDialogOpen(true)}>
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="gradient" 
                size="sm"
                onClick={() => setIsAuthDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Login / Sign Up</span>
                <span className="sm:hidden">Auth</span>
              </Button>
            )}
          </div>

          {/* Mobile menu */}
          <div className="md:hidden flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "p-2 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-gradient-primary text-white"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </Link>
              );
            })}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={user?.profilePhoto} alt="Profile" />
                      <AvatarFallback className="text-xs">
                        {user?.name ? getInitials(user.name) : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => setIsProfileDialogOpen(true)}>
                    <User className="w-4 h-4 mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsAuthDialogOpen(true)}
                className="p-2"
              >
                <LogIn className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Dialogs */}
      <AuthDialog 
        isOpen={isAuthDialogOpen} 
        onOpenChange={setIsAuthDialogOpen} 
      />
      <ProfileDialog 
        isOpen={isProfileDialogOpen} 
        onOpenChange={setIsProfileDialogOpen} 
      />
    </nav>
  );
};

export default Navigation;