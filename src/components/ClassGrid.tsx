
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ClassCard from "./ClassCard";

const ClassGrid = () => {
  const { data: classes, isLoading, error } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classes')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold mb-8">Loading classes...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold mb-8 text-red-600">Error loading classes</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold mb-8">Available Classes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes?.map((classItem) => (
          <ClassCard 
            key={classItem.id}
            id={classItem.id}
            title={`${classItem.style} Class`}
            style={classItem.style}
            location={`Schedule: ${classItem.schedule}`}
            price={`₹${classItem.price}`}
            imageUrl={classItem.image_url || '/placeholder.svg'}
          />
        ))}
      </div>
    </div>
  );
};

export default ClassGrid;
