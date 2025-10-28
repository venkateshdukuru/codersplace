import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Camera, User, Lock, Phone, Mail, School, Calendar, Trash2 } from "lucide-react";
import { AvatarUpload } from "./AvatarUpload";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface ProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// Default avatar SVG
const DefaultAvatar = ({ name, className }: { name?: string; className?: string }) => {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className={`flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold ${className}`}>
      {initials}
    </div>
  );
};

export const ProfileDialog = ({ isOpen, onOpenChange }: ProfileDialogProps) => {
  const { user, updateUser, refreshUser } = useAuth();
  const { toast } = useToast();

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    college: user?.collegeName || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isAvatarUploadOpen, setIsAvatarUploadOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileData.name || !profileData.email || !profileData.phone || !profileData.college) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }
    
    try {
      await updateUser(profileData);
      toast({ title: "Profile Updated", description: "Your profile has been updated successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update profile", variant: "destructive" });
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast({ title: "Error", description: "Please fill all password fields", variant: "destructive" });
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    toast({ title: "Password Changed", description: "Your password has been updated successfully." });
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleAvatarUploadComplete = async (url: string) => {
    await refreshUser();
    toast({ 
      title: "Avatar Updated", 
      description: "Your profile picture has been updated successfully." 
    });
  };

  const handleDeleteAvatar = async () => {
    setIsDeleting(true);
    try {
      const response = await avatarService.deleteAvatar();
      if (response.success) {
        await refreshUser();
        toast({ 
          title: "Avatar Removed", 
          description: "Your profile picture has been removed." 
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to delete avatar", 
        variant: "destructive" 
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-xl shadow-xl">
          <DialogHeader className="text-center mb-6">
            <DialogTitle className="text-2xl font-bold">Profile Settings</DialogTitle>
            <DialogDescription className="text-gray-400">
              Manage your account, security, and preferences
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="flex flex-col items-center md:items-start md:w-1/3 gap-4">
              <div className="relative group">
                <Avatar className="w-24 h-24 ring-2 ring-gray-200">
                  {user?.avatar?.url ? (
                    <AvatarImage src={user.avatar.url} alt="Profile" />
                  ) : null}
                  <AvatarFallback className="text-xl">
                    <DefaultAvatar name={user?.name} className="w-full h-full rounded-full" />
                  </AvatarFallback>
                </Avatar>
                {user?.avatar?.url && (
                  <button
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    title="Remove avatar"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>

              <Button
                onClick={() => setIsAvatarUploadOpen(true)}
                variant="outline"
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors"
              >
                <Camera className="w-4 h-4" />
                {user?.avatar?.url ? "Change Photo" : "Upload Photo"}
              </Button>

              {user?.createdAt && (
                <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                  <Calendar className="w-4 h-4" />
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </div>
              )}
            </div>

            {/* Tabs Content */}
            <div className="flex-1">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-100 rounded-lg p-1">
                  <TabsTrigger value="profile" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg">
                    Profile Info
                  </TabsTrigger>
                  <TabsTrigger value="security" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg">
                    Security
                  </TabsTrigger>
                </TabsList>

                {/* Profile Info */}
                <TabsContent value="profile">
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">Personal Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="profile-name" className="flex items-center gap-2">
                              <User className="w-4 h-4" /> Full Name
                            </Label>
                            <Input
                              id="profile-name"
                              value={profileData.name}
                              onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="profile-email" className="flex items-center gap-2">
                              <Mail className="w-4 h-4" /> Email
                            </Label>
                            <Input
                              id="profile-email"
                              type="email"
                              value={profileData.email}
                              onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="profile-phone" className="flex items-center gap-2">
                              <Phone className="w-4 h-4" /> Phone
                            </Label>
                            <Input
                              id="profile-phone"
                              type="tel"
                              value={profileData.phone}
                              onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="profile-college" className="flex items-center gap-2">
                              <School className="w-4 h-4" /> College
                            </Label>
                            <Input
                              id="profile-college"
                              value={profileData.college}
                              onChange={(e) => setProfileData((prev) => ({ ...prev, college: e.target.value }))}
                              disabled
                            />
                          </div>
                        </div>

                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                          Update Profile
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Security */}
                <TabsContent value="security">
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">Change Password</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password" className="flex items-center gap-2">
                            <Lock className="w-4 h-4" /> Current Password
                          </Label>
                          <Input
                            id="current-password"
                            type="password"
                            placeholder="Enter current password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="new-password" className="flex items-center gap-2">
                            <Lock className="w-4 h-4" /> New Password
                          </Label>
                          <Input
                            id="new-password"
                            type="password"
                            placeholder="Enter new password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirm-password" className="flex items-center gap-2">
                            <Lock className="w-4 h-4" /> Confirm Password
                          </Label>
                          <Input
                            id="confirm-password"
                            type="password"
                            placeholder="Confirm new password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                          />
                        </div>

                        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white shadow-md">
                          Change Password
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Avatar Upload Dialog */}
      <AvatarUpload
        isOpen={isAvatarUploadOpen}
        onClose={() => setIsAvatarUploadOpen(false)}
        onUploadComplete={handleAvatarUploadComplete}
        currentImage={user?.avatar?.url}
      />

      {/* Delete Avatar Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Profile Picture</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove your profile picture? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAvatar}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};