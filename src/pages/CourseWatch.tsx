import { useState, useRef, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, ChevronLeft, ChevronRight, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";

interface VideoLesson {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  duration_minutes: number;
  lesson_order: number;
  is_preview: boolean;
}

interface LessonProgress {
  id: string;
  completed: boolean;
  watch_time_seconds: number;
}

const CourseWatch = () => {
  const { courseId } = useParams();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressUpdateRef = useRef<NodeJS.Timeout>();
  const queryClient = useQueryClient();

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

  // Check if user has purchased this course
  const { data: hasPurchased, isLoading: purchaseLoading } = useQuery({
    queryKey: ["purchase", courseId, session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return false;
      
      const { data, error } = await supabase
        .from("course_purchases")
        .select("id")
        .eq("course_id", courseId)
        .eq("user_id", session.user.id)
        .eq("status", "completed")
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!session?.user?.id,
  });

  // Fetch accessible lessons (purchased content + previews)
  const { data: lessons, isLoading: lessonsLoading } = useQuery({
    queryKey: ["accessible-lessons", courseId, hasPurchased],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("video_lessons")
        .select("*")
        .eq("course_id", courseId)
        .or(hasPurchased ? "is_preview.eq.true,is_preview.eq.false" : "is_preview.eq.true")
        .order("lesson_order", { ascending: true });

      if (error) throw error;
      return data as VideoLesson[];
    },
    enabled: hasPurchased !== undefined,
  });

  // Fetch lesson progress
  const { data: progressData } = useQuery({
    queryKey: ["lesson-progress", courseId, session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id || !lessons) return [];
      
      const { data, error } = await supabase
        .from("lesson_progress")
        .select("*")
        .eq("user_id", session.user.id)
        .in("lesson_id", lessons.map(l => l.id));

      if (error) throw error;
      return data as LessonProgress[];
    },
    enabled: !!session?.user?.id && !!lessons,
  });

  // Update lesson progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async ({ lessonId, watchTime, completed }: { 
      lessonId: string; 
      watchTime: number; 
      completed: boolean; 
    }) => {
      if (!session?.user?.id) return;

      const { error } = await supabase
        .from("lesson_progress")
        .upsert({
          user_id: session.user.id,
          lesson_id: lessonId,
          watch_time_seconds: Math.floor(watchTime),
          completed,
          last_watched_at: new Date().toISOString(),
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson-progress"] });
    },
  });

  const currentLesson = lessons?.[currentLessonIndex];
  const currentProgress = progressData?.find(p => p.id === currentLesson?.id);

  // Handle video events
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      setCurrentTime(currentTime);
      
      // Update progress in database every 10 seconds
      if (currentLesson && session?.user?.id) {
        if (progressUpdateRef.current) {
          clearTimeout(progressUpdateRef.current);
        }
        
        progressUpdateRef.current = setTimeout(() => {
          const watchTimeSeconds = Math.floor(currentTime);
          const completed = currentTime >= (duration * 0.9); // 90% completion
          
          updateProgressMutation.mutate({
            lessonId: currentLesson.id,
            watchTime: watchTimeSeconds,
            completed,
          });
        }, 2000);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      
      // Resume from saved progress
      if (currentProgress?.watch_time_seconds) {
        videoRef.current.currentTime = currentProgress.watch_time_seconds;
      }
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const goToLesson = (index: number) => {
    if (lessons && index >= 0 && index < lessons.length) {
      setCurrentLessonIndex(index);
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const markLessonComplete = () => {
    if (currentLesson && session?.user?.id) {
      updateProgressMutation.mutate({
        lessonId: currentLesson.id,
        watchTime: Math.floor(currentTime),
        completed: true,
      });
      toast.success("Lesson marked as complete!");
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateProgress = (lesson: VideoLesson) => {
    const progress = progressData?.find(p => p.id === lesson.id);
    if (!progress) return 0;
    
    const progressPercent = (progress.watch_time_seconds / (lesson.duration_minutes * 60)) * 100;
    return Math.min(progressPercent, 100);
  };

  if (purchaseLoading || lessonsLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return <Navigate to="/auth" replace />;
  }

  if (!hasPurchased && !lessons?.some(l => l.is_preview)) {
    return <Navigate to={`/course/${courseId}`} replace />;
  }

  if (!lessons || lessons.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-white">No accessible lessons found.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Video Player */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-black flex items-center justify-center">
            <div className="w-full max-w-4xl aspect-video">
              <video
                ref={videoRef}
                src={currentLesson?.video_url}
                className="w-full h-full"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                controls
              />
            </div>
          </div>
          
          {/* Video Controls & Info */}
          <div className="bg-gray-800 text-white p-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{currentLesson?.title}</h2>
                  <p className="text-gray-300 text-sm">{currentLesson?.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  {!currentLesson?.is_preview && (
                    <Badge variant="secondary">Premium</Badge>
                  )}
                  {currentProgress?.completed && (
                    <Badge className="bg-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => goToLesson(currentLessonIndex - 1)}
                  disabled={currentLessonIndex === 0}
                  className="text-white hover:bg-gray-700"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlayPause}
                  className="text-white hover:bg-gray-700"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => goToLesson(currentLessonIndex + 1)}
                  disabled={currentLessonIndex === lessons.length - 1}
                  className="text-white hover:bg-gray-700"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
                
                <div className="flex-1 text-center text-sm text-gray-300">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
                
                {!currentProgress?.completed && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={markLessonComplete}
                    className="text-white border-white hover:bg-white hover:text-gray-900"
                  >
                    Mark Complete
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Lesson Sidebar */}
        <div className="w-80 bg-gray-100 flex flex-col">
          <div className="p-4 border-b bg-white">
            <h3 className="font-semibold">Course Lessons</h3>
            <p className="text-sm text-gray-600">
              {lessons.filter(l => progressData?.find(p => p.id === l.id)?.completed).length} of {lessons.length} completed
            </p>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {lessons.map((lesson, index) => {
              const progress = calculateProgress(lesson);
              const isCompleted = progressData?.find(p => p.id === lesson.id)?.completed;
              const isActive = index === currentLessonIndex;
              
              return (
                <div
                  key={lesson.id}
                  className={`p-4 border-b cursor-pointer transition-colors ${
                    isActive ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                  }`}
                  onClick={() => goToLesson(index)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isActive ? "border-blue-600 bg-blue-600" : "border-gray-300"
                        }`}>
                          {isActive && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-medium text-sm ${isActive ? "text-blue-600" : "text-gray-900"}`}>
                          {lesson.title}
                        </h4>
                        {lesson.is_preview && (
                          <Badge variant="outline" className="text-xs">FREE</Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <Clock className="h-3 w-3" />
                        {lesson.duration_minutes}m
                      </div>
                      
                      {progress > 0 && (
                        <Progress value={progress} className="h-1" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseWatch;