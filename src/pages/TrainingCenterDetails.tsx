
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, MapPin, Star, Clock, Phone, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ClassCard from "@/components/ClassCard";

const TrainingCenterDetails = () => {
  const { centerId } = useParams();

  const { data: center, isLoading: centerLoading, error } = useQuery({
    queryKey: ['training-center', centerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('training_centers')
        .select('*')
        .eq('slug', centerId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching training center:', error);
        throw error;
      }
      return data;
    },
    enabled: !!centerId,
  });

  const { data: classes, isLoading: classesLoading } = useQuery({
    queryKey: ['training-center-classes', center?.id],
    queryFn: async () => {
      if (!center?.id) return [];
      
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('training_center_id', center.id);
      
      if (error) {
        console.error('Error fetching classes:', error);
        throw error;
      }
      return data;
    },
    enabled: !!center?.id,
  });

  const getStyleImage = (style: string) => {
    const styles: Record<string, string> = {
      "BJJ": "/bjj.jpg",
      "Muay Thai": "/muaythai.jpg",
      "Karate": "/karate.jpg",
      "Taekwondo": "/tkd.jpg",
      "MMA": "/mma.jpg",
      "Kung Fu": "/kungfu.jpg",
    };
    
    return styles[style] || "/placeholder.svg";
  };

  if (centerLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !center) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link to="/training-centers" className="inline-flex items-center text-green-600 hover:text-green-700 mb-6">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Training Centers
          </Link>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-red-600 mb-2">Training Center Not Found</h1>
            <p className="mb-4">The training center you're looking for doesn't exist or may have been removed.</p>
            <Button asChild>
              <Link to="/training-centers">View All Training Centers</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/training-centers" className="inline-flex items-center text-green-600 hover:text-green-700 mb-6">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Training Centers
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div 
                className="h-64 bg-cover bg-center" 
                style={{ backgroundImage: `url(${center.image_url || '/placeholder.svg'})` }}
              ></div>
              <div className="p-6">
                <h1 className="text-3xl font-bold mb-2">{center.name}</h1>
                <div className="flex items-center mb-4">
                  <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                  <p className="text-gray-600">{center.location}</p>
                </div>
                
                {center.rating && (
                  <div className="flex items-center mb-4">
                    <Star className="h-5 w-5 text-yellow-500 mr-2" />
                    <span className="font-medium">{center.rating}/5</span>
                  </div>
                )}
                
                {center.description && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">About</h2>
                    <p className="text-gray-600 leading-relaxed">{center.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-green-600 mr-3" />
                  <span className="text-sm">{center.location}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Contact details will be available soon.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Classes Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Available Classes</h2>
          {classesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-md mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : classes && classes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map((classItem) => (
                <ClassCard
                  key={classItem.id}
                  id={classItem.id}
                  title={`${classItem.style} with ${classItem.instructor}`}
                  style={classItem.style}
                  location={`Schedule: ${classItem.schedule}`}
                  price={`₹${classItem.price}`}
                  imageUrl={classItem.image_url || getStyleImage(classItem.style)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No classes available at this training center yet.</p>
              <Button asChild variant="outline">
                <Link to="/classes">Browse All Classes</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainingCenterDetails;
