/**
 * Gemini API utility for course and class recommendations
 */

export interface RecommendationPreferences {
  experienceLevel: string;
  preferredStyles: string[];
  goals: string[];
  timeCommitment: string;
  budget: string;
  learningFormat: string; // "online" | "in-person" | "both"
  location?: string;
  additionalNotes?: string;
}

export interface CourseRecommendation {
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
  matchScore?: number;
  matchReason?: string;
}

export interface ClassRecommendation {
  id: string;
  style: string;
  instructor: string;
  schedule: string;
  price: number;
  image_url?: string;
  center_name?: string;
  matchScore?: number;
  matchReason?: string;
}

export interface RecommendationResult {
  courses: CourseRecommendation[];
  classes: ClassRecommendation[];
  reasoning: string;
}

/**
 * Get recommendations using Gemini API
 */
export async function getRecommendations(
  preferences: RecommendationPreferences,
  courses: CourseRecommendation[],
  classes: ClassRecommendation[]
): Promise<RecommendationResult> {
  function computeLocalRecommendations(): RecommendationResult {
    const learningFormat = preferences.learningFormat || "both";

    function scoreDifficulty(difficulty: string): number {
      const map: Record<string, number> = { Beginner: 1, Intermediate: 2, Advanced: 3 };
      const desired = preferences.experienceLevel in map ? map[preferences.experienceLevel] : 2;
      const actual = difficulty in map ? map[difficulty] : 2;
      const diff = Math.abs(desired - actual);
      return Math.max(0, 30 - diff * 10); // 30 max
    }

    function styleMatchScore(style: string): number {
      if (!preferences.preferredStyles || preferences.preferredStyles.length === 0) return 0;
      return preferences.preferredStyles.includes(style) ? 40 : 0; // 40 max
    }

    function budgetMax(): number | null {
      const b = (preferences.budget || "").toLowerCase();
      if (b.includes("under") || b.includes("<") || b.includes("below")) return 2000;
      if (b.includes("2,000 - 4,000") || b.includes("2000 - 4000")) return 4000;
      if (b.includes("4,000 - 6,000") || b.includes("4000 - 6000")) return 6000;
      if (b.includes("6,000 - 10,000") || b.includes("6000 - 10000")) return 10000;
      if (b.includes("above") || b.includes(">")) return null; // no upper bound
      return null;
    }

    const maxBudget = budgetMax();

    function priceScore(price: number): number {
      if (maxBudget === null) return 15; // neutral if no budget bound
      return price <= maxBudget ? 15 : 0; // 15 max
    }

    function goalsScore(title: string, description: string, style?: string): number {
      const text = `${title} ${description} ${style || ""}`.toLowerCase();
      let score = 0;
      for (const g of preferences.goals || []) {
        const gl = g.toLowerCase();
        if (text.includes(gl)) score += 5;
      }
      return Math.min(15, score); // 15 max
    }

    const courseCandidates = courses
      .map((c) => {
        const s = styleMatchScore(c.martial_art_style) +
                  scoreDifficulty(c.difficulty_level) +
                  priceScore(c.price) +
                  goalsScore(c.title, c.description, c.martial_art_style);
        return { ...c, matchScore: s, matchReason: `Matched on ${c.martial_art_style}, ${c.difficulty_level} level${maxBudget ? ", within budget" : ""}.` };
      })
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
      .slice(0, 5);

    const classCandidates = classes
      .map((c) => {
        const s = styleMatchScore(c.style) + priceScore(c.price) + goalsScore(c.style, c.instructor);
        return { ...c, matchScore: s, matchReason: `Matched on ${c.style}${maxBudget ? ", within budget" : ""}.` };
      })
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
      .slice(0, 5);

    const result: RecommendationResult = {
      courses: learningFormat === "in-person" ? [] : courseCandidates,
      classes: learningFormat === "online" ? [] : classCandidates,
      reasoning: "AI was unavailable. Recommendations computed locally based on your styles, level, goals, and budget.",
    };
    return result;
  }

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  
  console.log("Gemini API Key check:", GEMINI_API_KEY ? "Found" : "Not found");
  
  if (!GEMINI_API_KEY) {
    // No key: return local recommendations instead of throwing
    return computeLocalRecommendations();
  }

  // Limit payload size for Gemini (take up to 30 items each)
  const limitedCourses = courses.slice(0, 30);
  const limitedClasses = classes.slice(0, 30);

  // Prepare course data for Gemini
  const coursesData = limitedCourses.map(c => ({
    id: c.id,
    title: c.title,
    description: c.description,
    instructor: c.instructor,
    price: c.price,
    martial_art_style: c.martial_art_style,
    difficulty_level: c.difficulty_level,
    duration_hours: c.duration_hours,
    total_lessons: c.total_lessons
  }));

  // Prepare class data for Gemini
  const classesData = limitedClasses.map(c => ({
    id: c.id,
    style: c.style,
    instructor: c.instructor,
    schedule: c.schedule,
    price: c.price,
    center_name: c.center_name
  }));

  // Create prompt for Gemini
  const prompt = `You are a martial arts recommendation system. Based on the user's preferences, recommend the best courses and classes from the available options.

User Preferences:
- Experience Level: ${preferences.experienceLevel}
- Preferred Styles: ${preferences.preferredStyles.join(", ")}
- Goals: ${preferences.goals.join(", ")}
- Time Commitment: ${preferences.timeCommitment}
- Budget: ${preferences.budget}
- Learning Format: ${preferences.learningFormat}
${preferences.location ? `- Location: ${preferences.location}` : ""}
${preferences.additionalNotes ? `- Additional Notes: ${preferences.additionalNotes}` : ""}

Available Courses:
${JSON.stringify(coursesData, null, 2)}

Available Classes:
${JSON.stringify(classesData, null, 2)}

Please analyze the user's preferences and return a JSON response with:
1. Top 5 recommended courses (if format is "online" or "both") with match scores (0-100) and brief match reasons
2. Top 5 recommended classes (if format is "in-person" or "both") with match scores (0-100) and brief match reasons
3. A brief reasoning paragraph explaining why these recommendations were made

Return ONLY valid JSON in this exact format:
{
  "courses": [
    {
      "id": "course_id",
      "matchScore": 85,
      "matchReason": "Brief explanation why this matches"
    }
  ],
  "classes": [
    {
      "id": "class_id",
      "matchScore": 90,
      "matchReason": "Brief explanation why this matches"
    }
  ],
  "reasoning": "Overall explanation of recommendations"
}

Important: Only include courses if learningFormat is "online" or "both". Only include classes if learningFormat is "in-person" or "both".`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    console.log("Calling Gemini API...");
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    console.log("Gemini API response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Gemini API error:", errorData);
      throw new Error(
        `Gemini API error: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    console.log("Gemini API response:", data);
    
    // Extract text from Gemini response
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    if (!responseText) {
      console.error("Empty response from Gemini API:", data);
      // Fallback to local recommendations on empty
      return computeLocalRecommendations();
    }
    
    // Parse JSON from response (Gemini might wrap it in markdown code blocks)
    let jsonText = responseText.trim();
    
    // Remove markdown code blocks if present
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "");
    }
    
    console.log("Parsing JSON from response:", jsonText.substring(0, 200));
    
    let recommendations: any;
    try {
      recommendations = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("Failed to parse JSON:", parseError);
      console.error("Response text:", jsonText);
      // Try extracting the first JSON object heuristically
      try {
        const first = jsonText.indexOf("{");
        const last = jsonText.lastIndexOf("}");
        if (first >= 0 && last > first) {
          const maybe = jsonText.substring(first, last + 1);
          recommendations = JSON.parse(maybe);
        } else {
          return computeLocalRecommendations();
        }
      } catch {
        return computeLocalRecommendations();
      }
    }

    // Merge recommendations with full course/class data
    const recommendedCourses: CourseRecommendation[] = (recommendations.courses || [])
      ?.map((rec: { id: string; matchScore: number; matchReason: string }) => {
        const course = courses.find((c) => c.id === rec.id) || limitedCourses.find((c) => c.id === rec.id);
        return course
          ? {
              ...course,
              matchScore: rec.matchScore,
              matchReason: rec.matchReason,
            }
          : null;
      })
      .filter((c: CourseRecommendation | null) => c !== null)
      .sort((a: CourseRecommendation, b: CourseRecommendation) => (b.matchScore || 0) - (a.matchScore || 0)) || [];

    const recommendedClasses: ClassRecommendation[] = (recommendations.classes || [])
      ?.map((rec: { id: string; matchScore: number; matchReason: string }) => {
        const classItem = classes.find((c) => c.id === rec.id) || limitedClasses.find((c) => c.id === rec.id);
        return classItem
          ? {
              ...classItem,
              matchScore: rec.matchScore,
              matchReason: rec.matchReason,
            }
          : null;
      })
      .filter((c: ClassRecommendation | null) => c !== null)
      .sort((a: ClassRecommendation, b: ClassRecommendation) => (b.matchScore || 0) - (a.matchScore || 0)) || [];

    let reasoning = recommendations.reasoning || "Recommendations based on your preferences.";
    if (recommendedCourses.length === 0 && recommendedClasses.length === 0) {
      // If AI returned nothing useful, fallback
      return computeLocalRecommendations();
    }

    return {
      courses: recommendedCourses,
      classes: recommendedClasses,
      reasoning,
    };
  } catch (error: any) {
    console.error("Error getting recommendations:", error);
    // Fallback to local recommendations on any error
    return computeLocalRecommendations();
  }
}

