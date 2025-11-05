
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import ClassCard from "@/components/ClassCard";

interface TrainingCenter {
  name: string;
}

interface ClassType {
  id: string;
  style: string;
  description: string;
  instructor: string;
  image_url?: string;
  training_center_id?: string;
  center_name?: string;
  training_centers?: TrainingCenter;
  schedule: string;
  price: number;
}

const Classes = () => {
  const { data: classes, isLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      // Fixed the query by removing the reference to center_id which doesn't exist
      const { data, error } = await supabase
        .from('classes')
        .select(`
          id,
          style,
          instructor,
          training_center_id,
          schedule,
          price,
          image_url,
          training_centers (
            name
          )
        `);
      
      if (error) {
        console.error('Error fetching classes:', error);
        throw error;
      }
      
      return data.map((c: any) => ({
        ...c,
        center_name: c.training_centers?.name
      })) as ClassType[];
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-800">Martial Arts Classes</h1>
          <Link to="/dashboard" className="inline-flex items-center text-green-600 hover:text-green-700">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
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
            {classes && classes.length > 0 ? (
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
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-lg text-gray-600 mb-4">No classes available at this time.</p>
                <Button asChild variant="outline">
                  <Link to="/">Return Home</Link>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Classes;
