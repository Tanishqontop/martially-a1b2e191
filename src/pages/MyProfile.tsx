
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, UserRound, Settings, ShoppingBag } from "lucide-react";
import EditProfileDialog from "@/components/EditProfileDialog";
import { useQuery } from "@tanstack/react-query";

const MyProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  });

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const isLoading = isUserLoading || isProfileLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <UserRound className="h-6 w-6 text-green-600" />
          <h1 className="text-2xl font-bold">My Profile</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Summary Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Profile Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="bg-green-100 text-green-800 text-xl">
                  {profile?.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <h2 className="text-xl font-semibold mb-1">{profile?.username || 'Not set'}</h2>
              <p className="text-gray-500 mb-4">{user.email}</p>
              
              {profile && <EditProfileDialog profile={profile} />}
            </CardContent>
          </Card>

          {/* Account Details */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:gap-4">
                  <dt className="font-medium text-gray-500 min-w-[120px]">Username</dt>
                  <dd>{profile?.username || 'Not set'}</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-4">
                  <dt className="font-medium text-gray-500 min-w-[120px]">Email</dt>
                  <dd>{user.email}</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-4">
                  <dt className="font-medium text-gray-500 min-w-[120px]">Account Type</dt>
                  <dd className="capitalize">{profile?.user_type || 'User'}</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-4">
                  <dt className="font-medium text-gray-500 min-w-[120px]">Member Since</dt>
                  <dd>{new Date(user.created_at || '').toLocaleDateString()}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Quick Links Card */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="flex items-center justify-start p-4 h-auto" 
                  onClick={() => navigate('/my-orders')}
                >
                  <ShoppingBag className="mr-2 h-5 w-5 text-green-600" />
                  <div className="text-left">
                    <div className="font-medium">My Orders</div>
                    <div className="text-sm text-gray-500">View your order history</div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-center justify-start p-4 h-auto" 
                  onClick={() => navigate('/bookings')}
                >
                  <Settings className="mr-2 h-5 w-5 text-green-600" />
                  <div className="text-left">
                    <div className="font-medium">My Bookings</div>
                    <div className="text-sm text-gray-500">Manage class bookings</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
