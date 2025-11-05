import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock, BookOpen, Play, Lock, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { initializeRazorpayPayment, loadRazorpayScript } from "@/utils/razorpay";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  thumbnail_url: string | null;
  martial_art_style: string;
  difficulty_level: string;
  duration_hours: number;
  total_lessons: number;
}

interface VideoLesson {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  duration_minutes: number;
  lesson_order: number;
  is_preview: boolean;
}

interface Purchase {
  id: string;
  status: string;
}

const CourseDetails = () => {
  const { courseId } = useParams();
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  if (!courseId) {
    return <Navigate to="/courses" replace />;
  }

  // Get current user session
  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  // Fetch course details
  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();

      if (error) throw error;
      return data as Course;
    },
  });

  // Fetch video lessons
  const { data: lessons, isLoading: lessonsLoading } = useQuery({
    queryKey: ["lessons", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("video_lessons")
        .select("*")
        .eq("course_id", courseId)
        .order("lesson_order", { ascending: true });

      if (error) throw error;
      return data as VideoLesson[];
    },
  });

  // Check if user has purchased this course
  const { data: purchase } = useQuery({
    queryKey: ["purchase", courseId, session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from("course_purchases")
        .select("*")
        .eq("course_id", courseId)
        .eq("user_id", session.user.id)
        .eq("status", "completed")
        .maybeSingle();

      if (error) throw error;
      return data as Purchase | null;
    },
    enabled: !!session?.user?.id,
  });

  const handlePurchase = async () => {
    if (!session?.user) {
      toast.error("Please sign in to purchase this course");
      return;
    }

    if (!course) return;

    setIsPaymentLoading(true);
    
    try {
      // Load Razorpay script
      const isRazorpayLoaded = await loadRazorpayScript();
      if (!isRazorpayLoaded) {
        throw new Error("Failed to load payment gateway");
      }

      // Initialize payment
      const paymentResult = await initializeRazorpayPayment(
        course.price,
        {
          product: {
            name: course.title,
            description: `Online course: ${course.title}`,
            image: course.thumbnail_url || "/placeholder.svg",
          },
          style: course.martial_art_style,
          instructor: course.instructor,
          courseId: course.id,
        }
      );

      if (paymentResult.razorpay_payment_id) {
        // Create purchase record
        const { error } = await supabase.from("course_purchases").insert({
          user_id: session.user.id,
          course_id: course.id,
          amount: course.price,
          payment_id: paymentResult.razorpay_payment_id,
          status: "completed",
        });

        if (error) throw error;

        toast.success("Course purchased successfully! You now have access to all lessons.");
        
        // Refresh the purchase query
        window.location.reload();
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `₹${(price / 100).toFixed(0)}`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (courseLoading || lessonsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return <Navigate to="/courses" replace />;
  }

  const previewLessons = lessons?.filter(lesson => lesson.is_preview) || [];
  const paidLessons = lessons?.filter(lesson => !lesson.is_preview) || [];
  const hasPurchased = !!purchase;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary">{course.martial_art_style}</Badge>
            <Badge 
              variant={course.difficulty_level === "Beginner" ? "default" : 
                       course.difficulty_level === "Intermediate" ? "secondary" : "destructive"}
            >
              {course.difficulty_level}
            </Badge>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {course.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            {course.description}
          </p>
          
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {course.duration_hours} hours
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {course.total_lessons} lessons
            </div>
            <div>
              Instructor: <span className="font-medium text-gray-900">{course.instructor}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Thumbnail */}
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <img
                src={course.thumbnail_url || "/placeholder.svg"}
                alt={course.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            </div>

            {/* Course Curriculum */}
            <Card>
              <CardHeader>
                <CardTitle>Course Curriculum</CardTitle>
                <CardDescription>
                  {lessons?.length || 0} lessons • {formatDuration(lessons?.reduce((acc, lesson) => acc + lesson.duration_minutes, 0) || 0)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Preview Lessons */}
                {previewLessons.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
                      <Play className="h-4 w-4" />
                      Free Preview Lessons
                    </h4>
                    <div className="space-y-2">
                      {previewLessons.map((lesson) => (
                        <div key={lesson.id} className="flex items-center justify-between p-3 border rounded-lg bg-green-50 border-green-200">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Play className="h-4 w-4 text-green-600" />
                              <span className="font-medium">{lesson.title}</span>
                              <Badge variant="outline" className="text-xs bg-green-100 text-green-700">
                                FREE
                              </Badge>
                            </div>
                            {lesson.description && (
                              <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                            )}
                          </div>
                          <span className="text-sm text-gray-500 ml-4">
                            {formatDuration(lesson.duration_minutes)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Paid Lessons */}
                {paidLessons.length > 0 && (
                  <div>
                    {previewLessons.length > 0 && <Separator className="my-4" />}
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      {hasPurchased ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Course Content
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 text-gray-500" />
                          Premium Content
                        </>
                      )}
                    </h4>
                    <div className="space-y-2">
                      {paidLessons.map((lesson) => (
                        <div key={lesson.id} className={`flex items-center justify-between p-3 border rounded-lg ${
                          hasPurchased ? "bg-white border-gray-200" : "bg-gray-50 border-gray-200"
                        }`}>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {hasPurchased ? (
                                <Play className="h-4 w-4 text-blue-600" />
                              ) : (
                                <Lock className="h-4 w-4 text-gray-400" />
                              )}
                              <span className={`font-medium ${hasPurchased ? "text-gray-900" : "text-gray-500"}`}>
                                {lesson.title}
                              </span>
                            </div>
                            {lesson.description && (
                              <p className={`text-sm mt-1 ${hasPurchased ? "text-gray-600" : "text-gray-400"}`}>
                                {lesson.description}
                              </p>
                            )}
                          </div>
                          <span className={`text-sm ml-4 ${hasPurchased ? "text-gray-500" : "text-gray-400"}`}>
                            {formatDuration(lesson.duration_minutes)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Purchase Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {hasPurchased ? "Course Purchased" : formatPrice(course.price)}
                </CardTitle>
                <CardDescription>
                  {hasPurchased 
                    ? "You have full access to this course"
                    : "Get lifetime access to all course content"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Lessons:</span>
                    <span className="font-medium">{course.total_lessons}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">{course.duration_hours} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Difficulty:</span>
                    <span className="font-medium">{course.difficulty_level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Instructor:</span>
                    <span className="font-medium">{course.instructor}</span>
                  </div>
                </div>
                
                <Separator />
                
                {hasPurchased ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Course Purchased</span>
                    </div>
                    <Button className="w-full" asChild>
                      <a href={`/course/${course.id}/watch`}>
                        Start Learning
                      </a>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {!session?.user ? (
                      <Button className="w-full" asChild>
                        <a href="/auth">
                          Sign In to Purchase
                        </a>
                      </Button>
                    ) : (
                      <Button 
                        className="w-full" 
                        onClick={handlePurchase}
                        disabled={isPaymentLoading}
                      >
                        {isPaymentLoading ? "Processing..." : `Purchase for ${formatPrice(course.price)}`}
                      </Button>
                    )}
                    
                    <div className="text-xs text-gray-500 text-center">
                      Secure payment powered by Razorpay
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;