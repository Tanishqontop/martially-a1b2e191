
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MapPin, Star, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { seedTrainingCenters, seedClasses } from "@/utils/seedData";
import { useEffect } from "react";

interface TrainingCenter {
  id: string;
  name: string;
  location: string;
  rating?: number;
  slug: string;
  description?: string;
  image_url?: string;
}

const TrainingCenters = () => {
  const { data: trainingCenters, isLoading, refetch } = useQuery({
    queryKey: ['training-centers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('training_centers')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching training centers:', error);
        throw error;
      }
      
      return data as TrainingCenter[];
    }
  });

  // Seed data if no training centers exist
  useEffect(() => {
    const initializeData = async () => {
      if (trainingCenters && trainingCenters.length === 0) {
        console.log('No training centers found, seeding data...');
        await seedTrainingCenters();
        await seedClasses();
        refetch();
      }
    };

    if (!isLoading && trainingCenters !== undefined) {
      initializeData();
    }
  }, [trainingCenters, isLoading, refetch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-800">Training Centers</h1>
          <Link to="/" className="inline-flex items-center text-green-600 hover:text-green-700">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-md mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {trainingCenters && trainingCenters.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {trainingCenters.map((center) => (
                  <Card key={center.id} className="hover:shadow-lg transition-shadow">
                    <div className="h-48 overflow-hidden rounded-t-lg">
                      <img 
                        src={center.image_url || "/placeholder.svg"} 
                        alt={center.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl">{center.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center mb-2">
                        <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                        <p className="text-gray-600 text-sm">{center.location}</p>
                      </div>
                      {center.rating && (
                        <div className="flex items-center mb-3">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm">{center.rating}/5</span>
                        </div>
                      )}
                      {center.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {center.description}
                        </p>
                      )}
                      <Button asChild className="w-full">
                        <Link to={`/training-center/${center.slug}`}>
                          View Details
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-lg text-gray-600 mb-4">Loading training centers...</p>
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-600"></div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TrainingCenters;
