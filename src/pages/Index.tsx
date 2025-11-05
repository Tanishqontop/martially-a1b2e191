
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import LogoutButton from "@/components/LogoutButton";
import Logo from "@/components/Logo";
import EditProfileDialog from "@/components/EditProfileDialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ArrowLeft, Home, Menu, User } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  });

  const { data: profile } = useQuery({
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

  const { data: trainingCenters } = useQuery({
    queryKey: ['featuredCenters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('training_centers')
        .select('*')
        .limit(3);
      
      if (error) throw error;
      return data;
    }
  });

  const MobileMenu = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col gap-4 mt-8">
          {profile && <EditProfileDialog profile={profile} />}
          <Button variant="outline" onClick={() => navigate('/my-profile')} className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            View Profile
          </Button>
          <LogoutButton />
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <div className="bg-white shadow-sm relative">
        <div className="absolute top-4 left-4 flex flex-col">
          <Logo />
          {!isMobile && profile && (
            <div className="mt-4 flex flex-col gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/')}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <EditProfileDialog profile={profile} />
              <Button variant="outline" size="sm" onClick={() => navigate('/my-profile')} className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                View Profile
              </Button>
            </div>
          )}
        </div>
        <div className="absolute top-4 right-4">
          {isMobile ? (
            <MobileMenu />
          ) : (
            <LogoutButton />
          )}
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20 md:mt-0">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome{profile?.username ? `, ${profile.username}` : ''}!
          </h1>
          <p className="text-lg text-gray-600">
            Discover and book martial arts classes from top training centers.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Find Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Browse through our collection of martial arts classes.
              </p>
              <Button 
                onClick={() => navigate('/training-centers')}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Explore Classes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                View and manage your class bookings.
              </p>
              <Button 
                variant="outline"
                onClick={() => navigate('/bookings')}
                className="w-full"
              >
                View Bookings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Training Centers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Discover top martial arts training centers.
              </p>
              <Button 
                variant="outline"
                onClick={() => navigate('/training-centers')}
                className="w-full"
              >
                View Centers
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Featured Training Centers */}
        {trainingCenters && trainingCenters.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Featured Training Centers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trainingCenters.map((center) => (
                <Card key={center.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{center.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{center.location}</p>
                    {center.rating && (
                      <p className="text-yellow-500">
                        Rating: {center.rating} ⭐
                      </p>
                    )}
                    <Button 
                      variant="link" 
                      onClick={() => navigate(`/training-center/${center.slug}`)}
                      className="mt-2 p-0"
                    >
                      Learn More →
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
