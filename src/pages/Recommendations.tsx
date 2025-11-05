import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import RecommendationForm, { RecommendationFormData } from "@/components/RecommendationForm";
import { getRecommendations, CourseRecommendation, ClassRecommendation } from "@/utils/gemini";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Clock, BookOpen, Star, MapPin, Calendar, Sparkles, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface RecommendationResult {
  courses: CourseRecommendation[];
  classes: ClassRecommendation[];
  reasoning: string;
}

const Recommendations = () => {
  const [formData, setFormData] = useState<RecommendationFormData | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all courses
  const { data: allCourses } = useQuery({
    queryKey: ["all-courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as CourseRecommendation[];
    },
  });

  // Fetch all classes
  const { data: allClasses } = useQuery({
    queryKey: ["all-classes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("classes")
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

      if (error) throw error;
      return data.map((c: any) => ({
        ...c,
        center_name: c.training_centers?.name,
      })) as ClassRecommendation[];
    },
  });

  const handleFormSubmit = async (data: RecommendationFormData) => {
    if (!allCourses || !allClasses) {
      toast.error("Please wait for data to load");
      return;
    }

    if (allCourses.length === 0 && allClasses.length === 0) {
      toast.error("No courses or classes available to recommend");
      return;
    }

    console.log("Submitting form with:", data);
    console.log("Available courses:", allCourses.length);
    console.log("Available classes:", allClasses.length);

    setIsLoading(true);
    setFormData(data);

    try {
      const result = await getRecommendations(
        {
          experienceLevel: data.experienceLevel,
          preferredStyles: data.preferredStyles,
          goals: data.goals,
          timeCommitment: data.timeCommitment,
          budget: data.budget,
          learningFormat: data.learningFormat,
          location: data.location,
          additionalNotes: data.additionalNotes,
        },
        allCourses,
        allClasses
      );

      console.log("Recommendations received:", result);
      setRecommendations(result);
      toast.success("Recommendations generated successfully!");
    } catch (error: any) {
      console.error("Error getting recommendations:", error);
      toast.error(error.message || "Failed to get recommendations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `₹${(price / 100).toFixed(0)}`;
  };

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

  const getMatchColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-orange-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {!recommendations ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
                <Sparkles className="h-10 w-10 text-green-600" />
                AI-Powered Recommendations
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Tell us about your preferences and goals, and we'll use AI to find the perfect
                martial arts courses and classes for you.
              </p>
            </div>
            <RecommendationForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Button
                variant="outline"
                onClick={() => {
                  setRecommendations(null);
                  setFormData(null);
                }}
                className="mb-4"
              >
                ← Start Over
              </Button>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Recommendations</h1>
              <p className="text-gray-600">{recommendations.reasoning}</p>
            </div>

            {/* Note: We now rely on the backend/fallback to determine availability.
                If AI fails, the header reasoning already communicates local fallback. */}

            {/* Recommended Courses */}
            {recommendations.courses.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-green-600" />
                  Recommended Online Courses
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.courses.map((course) => (
                    <Card
                      key={course.id}
                      className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={course.thumbnail_url || "/placeholder.svg"}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                        <div className="absolute top-3 left-3">
                          <Badge variant="secondary" className="bg-white/90 text-gray-900">
                            {course.martial_art_style}
                          </Badge>
                        </div>
                        <div className="absolute top-3 right-3 flex flex-col gap-2">
                          <Badge
                            variant={
                              course.difficulty_level === "Beginner"
                                ? "default"
                                : course.difficulty_level === "Intermediate"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {course.difficulty_level}
                          </Badge>
                          {course.matchScore && (
                            <Badge
                              className={`${getMatchColor(course.matchScore)} text-white`}
                            >
                              {course.matchScore}% Match
                            </Badge>
                          )}
                        </div>
                      </div>

                      <CardHeader>
                        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                          {course.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{course.instructor}</span>
                        </CardDescription>
                      </CardHeader>

                      <CardContent>
                        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                          {course.description}
                        </p>
                        {course.matchReason && (
                          <p className="text-xs text-green-600 mb-4 italic">
                            💡 {course.matchReason}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {course.duration_hours}h
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {course.total_lessons} lessons
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="flex items-center justify-between pt-0">
                        <div className="text-2xl font-bold text-primary">
                          {formatPrice(course.price)}
                        </div>
                        <Button asChild>
                          <Link to={`/course/${course.id}`}>View Course</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Classes */}
            {recommendations.classes.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-green-600" />
                  Recommended In-Person Classes
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.classes.map((classItem) => (
                    <Card
                      key={classItem.id}
                      className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={classItem.image_url || getStyleImage(classItem.style)}
                          alt={classItem.style}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                        <div className="absolute top-3 left-3">
                          <Badge variant="secondary" className="bg-white/90 text-gray-900">
                            {classItem.style}
                          </Badge>
                        </div>
                        {classItem.matchScore && (
                          <div className="absolute top-3 right-3">
                            <Badge
                              className={`${getMatchColor(classItem.matchScore)} text-white`}
                            >
                              {classItem.matchScore}% Match
                            </Badge>
                          </div>
                        )}
                      </div>

                      <CardHeader>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {classItem.style} with {classItem.instructor}
                        </CardTitle>
                        {classItem.center_name && (
                          <CardDescription className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{classItem.center_name}</span>
                          </CardDescription>
                        )}
                      </CardHeader>

                      <CardContent>
                        <div className="flex items-center gap-2 mb-4">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{classItem.schedule}</span>
                        </div>
                        {classItem.matchReason && (
                          <p className="text-xs text-green-600 mb-4 italic">
                            💡 {classItem.matchReason}
                          </p>
                        )}
                      </CardContent>

                      <CardFooter className="flex items-center justify-between pt-0">
                        <div className="text-2xl font-bold text-primary">
                          ₹{classItem.price}
                        </div>
                        <Button asChild>
                          <Link to={`/class/${classItem.id}`}>View Class</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* No Recommendations */}
            {recommendations.courses.length === 0 && recommendations.classes.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No recommendations found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your preferences to see more options.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setRecommendations(null);
                    setFormData(null);
                  }}
                >
                  Start Over
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;

