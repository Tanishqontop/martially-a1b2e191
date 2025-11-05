
-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  instructor TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  thumbnail_url TEXT,
  martial_art_style TEXT NOT NULL,
  difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced')),
  duration_hours INTEGER DEFAULT 0,
  total_lessons INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create video lessons table
CREATE TABLE public.video_lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 0,
  lesson_order INTEGER NOT NULL DEFAULT 1,
  is_preview BOOLEAN DEFAULT false, -- Free preview lessons
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create course purchases table
CREATE TABLE public.course_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  payment_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  purchased_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Create lesson progress tracking table
CREATE TABLE public.lesson_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.video_lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  watch_time_seconds INTEGER DEFAULT 0,
  last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Enable Row Level Security
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for courses (public read access)
CREATE POLICY "Anyone can view courses" ON public.courses
  FOR SELECT USING (true);

-- RLS Policies for video lessons
CREATE POLICY "Anyone can view preview lessons" ON public.video_lessons
  FOR SELECT USING (is_preview = true);

CREATE POLICY "Purchased course lessons viewable" ON public.video_lessons
  FOR SELECT USING (
    NOT is_preview AND EXISTS (
      SELECT 1 FROM public.course_purchases 
      WHERE user_id = auth.uid() 
      AND course_id = video_lessons.course_id 
      AND status = 'completed'
    )
  );

-- RLS Policies for course purchases
CREATE POLICY "Users can view own purchases" ON public.course_purchases
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create own purchases" ON public.course_purchases
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own purchases" ON public.course_purchases
  FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for lesson progress
CREATE POLICY "Users can view own progress" ON public.lesson_progress
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create own progress" ON public.lesson_progress
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own progress" ON public.lesson_progress
  FOR UPDATE USING (user_id = auth.uid());

-- Insert sample courses data
INSERT INTO public.courses (title, description, instructor, price, martial_art_style, difficulty_level, duration_hours, total_lessons, thumbnail_url) VALUES
('Complete Karate Fundamentals', 'Master the basics of Karate with step-by-step video lessons covering stances, strikes, and kata.', 'Sensei Tanaka', 2999, 'Karate', 'Beginner', 8, 12, '/karate.jpg'),
('Advanced BJJ Techniques', 'Take your Brazilian Jiu-Jitsu to the next level with advanced submissions and transitions.', 'Professor Santos', 4999, 'BJJ', 'Advanced', 15, 20, '/bjj.jpg'),
('Muay Thai Striking Mastery', 'Learn devastating Muay Thai techniques including kicks, knees, elbows and clinch work.', 'Kru Somchai', 3499, 'Muay Thai', 'Intermediate', 10, 15, '/muaythai.jpg'),
('MMA Ground Game', 'Complete mixed martial arts ground fighting course covering wrestling and submission grappling.', 'Coach Anderson', 3999, 'MMA', 'Intermediate', 12, 18, '/mma.jpg');

-- Insert sample video lessons
INSERT INTO public.video_lessons (course_id, title, description, video_url, duration_minutes, lesson_order, is_preview) VALUES
-- Karate course lessons
((SELECT id FROM public.courses WHERE title = 'Complete Karate Fundamentals'), 'Introduction to Karate', 'Welcome and overview of what you will learn', 'https://example.com/karate-intro.mp4', 15, 1, true),
((SELECT id FROM public.courses WHERE title = 'Complete Karate Fundamentals'), 'Basic Stances', 'Learn the fundamental karate stances', 'https://example.com/karate-stances.mp4', 25, 2, false),
((SELECT id FROM public.courses WHERE title = 'Complete Karate Fundamentals'), 'Punching Techniques', 'Master basic punching forms', 'https://example.com/karate-punches.mp4', 30, 3, false),

-- BJJ course lessons  
((SELECT id FROM public.courses WHERE title = 'Advanced BJJ Techniques'), 'Course Overview', 'Introduction to advanced BJJ concepts', 'https://example.com/bjj-intro.mp4', 10, 1, true),
((SELECT id FROM public.courses WHERE title = 'Advanced BJJ Techniques'), 'Triangle Choke Variations', 'Multiple ways to finish the triangle', 'https://example.com/bjj-triangle.mp4', 35, 2, false),
((SELECT id FROM public.courses WHERE title = 'Advanced BJJ Techniques'), 'Omoplata Setup and Finish', 'Master this shoulder lock submission', 'https://example.com/bjj-omoplata.mp4', 40, 3, false);
