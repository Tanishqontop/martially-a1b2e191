import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, BookOpen, Star, Filter } from "lucide-react";
import { Link } from "react-router-dom";

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

const Courses = () => {
  const [selectedStyle, setSelectedStyle] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");

  const { data: courses, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Course[];
    },
  });

  const filteredCourses = courses?.filter((course) => {
    const matchesStyle = selectedStyle === "all" || course.martial_art_style === selectedStyle;
    const matchesLevel = selectedLevel === "all" || course.difficulty_level === selectedLevel;
    return matchesStyle && matchesLevel;
  });

  const martialArtStyles = [...new Set(courses?.map((course) => course.martial_art_style) || [])];
  const difficultyLevels = ["Beginner", "Intermediate", "Advanced"];

  const formatPrice = (price: number) => {
    return `₹${(price / 100).toFixed(0)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Master Martial Arts Online
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn from world-class instructors with our comprehensive video courses. 
            Train at your own pace and master the techniques that matter.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 p-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
          </div>
          
          <Select value={selectedStyle} onValueChange={setSelectedStyle}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Martial Art Style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Styles</SelectItem>
              {martialArtStyles.map((style) => (
                <SelectItem key={style} value={style}>
                  {style}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Difficulty Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {difficultyLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Course Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses?.map((course) => (
              <Card key={course.id} className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden">
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
                  <div className="absolute top-3 right-3">
                    <Badge 
                      variant={course.difficulty_level === "Beginner" ? "default" : 
                               course.difficulty_level === "Intermediate" ? "secondary" : "destructive"}
                    >
                      {course.difficulty_level}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">Instructor: {course.instructor}</span>
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                    {course.description}
                  </p>
                  
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
                    <Link to={`/course/${course.id}`}>
                      View Course
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {filteredCourses?.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No courses found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters to see more courses.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;