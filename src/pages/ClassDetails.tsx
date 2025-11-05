
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import EnrollButton from "@/components/EnrollButton";

const ClassDetails = () => {
  const { classId } = useParams();

  const { data: classDetails, isLoading, error } = useQuery({
    queryKey: ['class', classId],
    queryFn: async () => {
      // Updated to match database schema
      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          training_centers (
            name,
            location
          )
        `)
        .eq('id', classId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching class details:', error);
        throw error;
      }
      return data;
    },
    enabled: !!classId,
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !classDetails) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link to="/classes" className="inline-flex items-center text-green-600 hover:text-green-700 mb-6">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Classes
          </Link>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
            <p className="mb-4">Could not find class details. The class may have been removed or the URL might be incorrect.</p>
            <Button asChild>
              <Link to="/classes">View All Classes</Link>
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
        <Link to="/classes" className="inline-flex items-center text-green-600 hover:text-green-700 mb-6">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Classes
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div 
                className="h-64 bg-cover bg-center" 
                style={{ backgroundImage: `url(${classDetails.image_url || getStyleImage(classDetails.style)})` }}
              ></div>
              <div className="p-6">
                <h1 className="text-3xl font-bold mb-2">{classDetails.style} Class</h1>
                <p className="text-green-600 font-semibold mb-4">Instructor: {classDetails.instructor}</p>
                
                <h2 className="text-xl font-semibold mt-6 mb-2">Schedule</h2>
                <p className="mb-4">{classDetails.schedule}</p>
                
                <h2 className="text-xl font-semibold mt-6 mb-2">Location</h2>
                <p className="mb-1">{classDetails.training_centers?.name}</p>
                <p className="text-gray-600">{classDetails.training_centers?.location}</p>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-2xl font-bold mb-4">Enrollment</h2>
              <div className="mb-6">
                <p className="text-lg mb-1">Price</p>
                <p className="text-3xl font-bold text-green-600">₹{classDetails.price}</p>
              </div>
              
              <EnrollButton
                classId={classDetails.id}
                style={classDetails.style}
                title={`${classDetails.style} Class`}
                price={`₹${classDetails.price}`}
                className="w-full"
              />
              
              <div className="mt-6 border-t pt-4">
                <h3 className="font-semibold mb-2">Class Details</h3>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Style:</span>
                  <span>{classDetails.style}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Instructor:</span>
                  <span>{classDetails.instructor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetails;
