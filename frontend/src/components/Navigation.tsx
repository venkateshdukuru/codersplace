// frontend/src/components/Navigation.tsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Code,
  Brain,
  Users,
  Trophy,
  Home,
  LogIn,
  UserPlus,
  User,
  LogOut,
  Settings,
  UserCircle,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { ProfileDialog } from "./profile/ProfileDialog";
import { useAuth } from "@/context/AuthContext";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    <nav className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
              <Code className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              CodersPlace
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Auth/Profile Section (Desktop) */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-all">
                   <Avatar className="w-8 h-8 ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
  {user?.avatar?.url ? (
    <AvatarImage src={user.avatar.url} alt="Profile" />
  ) : null}
  <AvatarFallback className="text-xs bg-gradient-to-br from-primary to-accent text-white">
    {user?.name ? getInitials(user.name) : "U"}
  </AvatarFallback>
</Avatar>
                    <span className="hidden lg:inline font-medium text-sm">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem
                    onClick={() => navigate("/profile-info")}
                  >
                    <UserCircle className="w-4 h-4 mr-2" />
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setIsProfileDialogOpen(true)}
                  >
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
              <div className="flex items-center gap-2">
                {/* <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/auth/signin")}
                  className="flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Button> */}
                <Button
                  variant="gradient"
                  size="sm"
                  onClick={() => navigate("/signin")}
                  className="flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign In</span>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800 animate-in slide-in-from-top duration-200">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                      isActive
                        ? "bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      <ProfileDialog 
        isOpen={isProfileDialogOpen} 
        onOpenChange={setIsProfileDialogOpen} 
      />
    </nav>
  );
};

export default Navigation;
