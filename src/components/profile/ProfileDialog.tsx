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
import { Camera, User, Lock, Phone, Mail, School, Calendar } from "lucide-react";

interface ProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProfileDialog = ({ isOpen, onOpenChange }: ProfileDialogProps) => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    college: user?.college || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileData.name || !profileData.email || !profileData.phone || !profileData.college) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }
    updateUser(profileData);
    toast({ title: "Profile Updated", description: "Your profile has been updated successfully." });
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

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const photoUrl = event.target?.result as string;
        updateUser({ profilePhoto: photoUrl });
        toast({ title: "Profile Photo Updated", description: "Profile photo updated successfully." });
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
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
            <Avatar className="w-24 h-24">
              <AvatarImage src={user?.profilePhoto} alt="Profile" />
              <AvatarFallback className="text-xl">{user?.name ? getInitials(user.name) : "U"}</AvatarFallback>
            </Avatar>

            <Label
              htmlFor="photo-upload"
              className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Camera className="w-4 h-4" /> Change Photo
            </Label>
            <Input id="photo-upload" type="file" accept="image/*" onChange={handleProfilePhotoChange} className="hidden" />

            {user?.joinDate && (
              <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                <Calendar className="w-4 h-4" />
                Member since {new Date(user.joinDate).toLocaleDateString()}
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
  );
};
