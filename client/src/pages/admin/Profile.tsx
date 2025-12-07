import { useState, useRef, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  Camera,
  Save,
  Lock,
  Clock,
  Activity,
  Package,
  Edit3,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface AdminProfile {
  id: string;
  username: string;
  email: string;
  name: string;
  role: string;
  avatar: string | null;
  phone: string | null;
  joinedDate: string;
  lastActive: string;
}

export default function AdminProfile() {
  const { updateAdminProfile: updateStoreProfile } = useStore();
  
  const { data: phones = [] } = useQuery<{ id: string }[]>({
    queryKey: ['/api/phones'],
  });
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const { data: profile, isLoading: isLoadingProfile, error: profileError } = useQuery<AdminProfile>({
    queryKey: ['/api/admin/profile'],
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
      });
      updateStoreProfile({
        name: profile.name,
        email: profile.email,
        phone: profile.phone || undefined,
        avatar: profile.avatar || undefined,
        role: profile.role as 'admin' | 'manager' | 'staff',
        joinedDate: profile.joinedDate,
        lastActive: profile.lastActive,
      });
    }
  }, [profile]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { name?: string; email?: string; phone?: string }) => {
      const response = await apiRequest('PATCH', '/api/admin/profile', data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/profile'] });
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const response = await apiRequest('POST', '/api/admin/change-password', data);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to change password');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully.",
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    },
    onError: (error: Error) => {
      toast({
        title: "Password Change Failed",
        description: error.message || "Failed to change password. Please try again.",
        variant: "destructive",
      });
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);
      const response = await fetch('/api/admin/avatar', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to upload avatar');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/profile'] });
      toast({
        title: "Avatar Updated",
        description: "Your profile picture has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload avatar. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    updateProfileMutation.mutate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    });
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      });
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters.",
        variant: "destructive",
      });
      return;
    }
    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      uploadAvatarMutation.mutate(file);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
      case 'manager': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
      default: return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  const stats = [
    { label: 'Products Managed', value: phones.length, icon: Package },
    { label: 'Days Active', value: profile ? Math.floor((Date.now() - new Date(profile.joinedDate).getTime()) / (1000 * 60 * 60 * 24)) : 0, icon: Activity },
  ];

  if (isLoadingProfile) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  if (profileError || !profile) {
    return (
      <AdminLayout>
        <div className="text-center py-20">
          <p className="text-muted-foreground">Failed to load profile. Please try again later.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/admin/profile'] })}
          >
            Retry
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileChange}
        data-testid="input-avatar-file"
      />
      
      <div className="mb-8">
        <h1 className="font-heading font-bold text-3xl text-foreground">My Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden">
            <div className="h-24 bg-gradient-to-br from-primary via-primary/80 to-accent relative">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
            </div>
            <CardContent className="pt-0 -mt-12 text-center">
              <div className="relative inline-block">
                <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                  <AvatarImage src={profile.avatar || undefined} alt={profile.name} />
                  <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <button 
                  className="absolute bottom-0 right-0 p-2 bg-background rounded-full shadow-md border border-border/50 hover-elevate transition-colors disabled:opacity-50"
                  onClick={handleAvatarClick}
                  disabled={uploadAvatarMutation.isPending}
                  data-testid="button-change-avatar"
                >
                  {uploadAvatarMutation.isPending ? (
                    <Loader2 size={14} className="animate-spin text-muted-foreground" />
                  ) : (
                    <Camera size={14} className="text-muted-foreground" />
                  )}
                </button>
              </div>
              
              <h2 className="font-heading font-bold text-xl mt-4">{profile.name}</h2>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
              
              <div className="mt-3">
                <Badge 
                  variant="outline" 
                  className={`capitalize font-semibold ${getRoleBadgeColor(profile.role)}`}
                >
                  <Shield size={12} className="mr-1" />
                  {profile.role}
                </Badge>
              </div>

              <Separator className="my-6" />
              
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-muted rounded-lg">
                    <Calendar size={14} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Joined</p>
                    <p className="font-medium">{format(new Date(profile.joinedDate), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-muted rounded-lg">
                    <Clock size={14} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Last Active</p>
                    <p className="font-medium">{format(new Date(profile.lastActive), 'MMM dd, yyyy h:mm a')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center justify-between gap-4 p-3 bg-muted rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-background rounded-lg shadow-sm">
                      <stat.icon size={16} className="text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                  </div>
                  <span className="font-bold text-lg" data-testid={`text-stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>{stat.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User size={18} />
                    Personal Information
                  </CardTitle>
                  <CardDescription>Update your personal details here.</CardDescription>
                </div>
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} data-testid="button-edit-profile">
                    <Edit3 size={14} className="mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2 flex-wrap">
                    <Button variant="ghost" size="sm" onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: profile.name || '',
                        email: profile.email || '',
                        phone: profile.phone || '',
                      });
                    }} data-testid="button-cancel-edit">
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleSaveProfile} 
                      disabled={updateProfileMutation.isPending}
                      data-testid="button-save-profile"
                    >
                      {updateProfileMutation.isPending ? (
                        <Loader2 size={14} className="mr-2 animate-spin" />
                      ) : (
                        <Save size={14} className="mr-2" />
                      )}
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User size={14} className="text-muted-foreground" />
                    Full Name
                  </Label>
                  <Input 
                    id="name" 
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? 'bg-muted' : ''}
                    data-testid="input-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail size={14} className="text-muted-foreground" />
                    Email Address
                  </Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? 'bg-muted' : ''}
                    data-testid="input-email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone size={14} className="text-muted-foreground" />
                    Phone Number
                  </Label>
                  <Input 
                    id="phone" 
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? 'bg-muted' : ''}
                    data-testid="input-phone"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Shield size={14} className="text-muted-foreground" />
                    Role
                  </Label>
                  <Input 
                    value={profile.role.charAt(0).toUpperCase() + profile.role.slice(1)} 
                    disabled 
                    className="bg-muted capitalize"
                  />
                  <p className="text-xs text-muted-foreground">Role can only be changed by a super admin.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock size={18} />
                Change Password
              </CardTitle>
              <CardDescription>Ensure your account stays secure by using a strong password.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input 
                  id="currentPassword" 
                  type="password"
                  placeholder="Enter current password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  data-testid="input-current-password"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input 
                    id="newPassword" 
                    type="password"
                    placeholder="Enter new password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    data-testid="input-new-password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password"
                    placeholder="Confirm new password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    data-testid="input-confirm-password"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button 
                  onClick={handlePasswordChange}
                  disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword || changePasswordMutation.isPending}
                  data-testid="button-change-password"
                >
                  {changePasswordMutation.isPending ? (
                    <Loader2 size={14} className="mr-2 animate-spin" />
                  ) : (
                    <Lock size={14} className="mr-2" />
                  )}
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
