import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles } from "lucide-react";

export interface RecommendationFormData {
  experienceLevel: string;
  preferredStyles: string[];
  goals: string[];
  timeCommitment: string;
  budget: string;
  learningFormat: string;
  location: string;
  additionalNotes: string;
}

interface RecommendationFormProps {
  onSubmit: (data: RecommendationFormData) => void;
  isLoading?: boolean;
}

const martialArtStyles = [
  "Karate",
  "Taekwondo",
  "BJJ",
  "Muay Thai",
  "MMA",
  "Kung Fu",
  "Judo",
  "Boxing",
  "Wrestling",
  "Krav Maga",
];

const goals = [
  "Self-defense",
  "Fitness & Weight Loss",
  "Competition & Tournaments",
  "Mental Discipline",
  "Flexibility & Mobility",
  "Stress Relief",
  "Building Confidence",
  "Learning Traditional Arts",
];

export default function RecommendationForm({ onSubmit, isLoading }: RecommendationFormProps) {
  const [formData, setFormData] = useState<RecommendationFormData>({
    experienceLevel: "",
    preferredStyles: [],
    goals: [],
    timeCommitment: "",
    budget: "",
    learningFormat: "",
    location: "",
    additionalNotes: "",
  });

  const handleStyleToggle = (style: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredStyles: prev.preferredStyles.includes(style)
        ? prev.preferredStyles.filter((s) => s !== style)
        : [...prev.preferredStyles, style],
    }));
  };

  const handleGoalToggle = (goal: string) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.experienceLevel &&
      formData.preferredStyles.length > 0 &&
      formData.goals.length > 0 &&
      formData.timeCommitment &&
      formData.budget &&
      formData.learningFormat
    ) {
      onSubmit(formData);
    }
  };

  const isFormValid =
    formData.experienceLevel &&
    formData.preferredStyles.length > 0 &&
    formData.goals.length > 0 &&
    formData.timeCommitment &&
    formData.budget &&
    formData.learningFormat;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-green-600" />
          <CardTitle className="text-2xl">Find Your Perfect Martial Arts Match</CardTitle>
        </div>
        <CardDescription>
          Tell us about yourself and we'll recommend the best courses and classes for you using AI
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Experience Level */}
          <div className="space-y-2">
            <Label htmlFor="experienceLevel">
              What's your experience level? <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.experienceLevel}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, experienceLevel: value }))
              }
            >
              <SelectTrigger id="experienceLevel">
                <SelectValue placeholder="Select your experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner - New to martial arts</SelectItem>
                <SelectItem value="Intermediate">Intermediate - Some training experience</SelectItem>
                <SelectItem value="Advanced">Advanced - Extensive training experience</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Preferred Styles */}
          <div className="space-y-2">
            <Label>
              Which martial arts styles interest you? (Select all that apply){" "}
              <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-2">
              {martialArtStyles.map((style) => (
                <div key={style} className="flex items-center space-x-2">
                  <Checkbox
                    id={`style-${style}`}
                    checked={formData.preferredStyles.includes(style)}
                    onCheckedChange={() => handleStyleToggle(style)}
                  />
                  <Label
                    htmlFor={`style-${style}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {style}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Goals */}
          <div className="space-y-2">
            <Label>
              What are your main goals? (Select all that apply){" "}
              <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
              {goals.map((goal) => (
                <div key={goal} className="flex items-center space-x-2">
                  <Checkbox
                    id={`goal-${goal}`}
                    checked={formData.goals.includes(goal)}
                    onCheckedChange={() => handleGoalToggle(goal)}
                  />
                  <Label
                    htmlFor={`goal-${goal}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {goal}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Time Commitment */}
          <div className="space-y-2">
            <Label htmlFor="timeCommitment">
              How much time can you commit per week? <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.timeCommitment}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, timeCommitment: value }))
              }
            >
              <SelectTrigger id="timeCommitment">
                <SelectValue placeholder="Select time commitment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-3 hours">1-3 hours per week</SelectItem>
                <SelectItem value="4-6 hours">4-6 hours per week</SelectItem>
                <SelectItem value="7-10 hours">7-10 hours per week</SelectItem>
                <SelectItem value="10+ hours">10+ hours per week</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <Label htmlFor="budget">
              What's your monthly budget? <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.budget}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, budget: value }))
              }
            >
              <SelectTrigger id="budget">
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Under ₹2,000">Under ₹2,000</SelectItem>
                <SelectItem value="₹2,000 - ₹4,000">₹2,000 - ₹4,000</SelectItem>
                <SelectItem value="₹4,000 - ₹6,000">₹4,000 - ₹6,000</SelectItem>
                <SelectItem value="₹6,000 - ₹10,000">₹6,000 - ₹10,000</SelectItem>
                <SelectItem value="Above ₹10,000">Above ₹10,000</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Learning Format */}
          <div className="space-y-2">
            <Label htmlFor="learningFormat">
              Preferred learning format? <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.learningFormat}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, learningFormat: value }))
              }
            >
              <SelectTrigger id="learningFormat">
                <SelectValue placeholder="Select learning format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online Courses (Learn at your own pace)</SelectItem>
                <SelectItem value="in-person">In-Person Classes (Group training)</SelectItem>
                <SelectItem value="both">Both (Flexible options)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location (optional) */}
          <div className="space-y-2">
            <Label htmlFor="location">Location (for in-person classes)</Label>
            <Input
              id="location"
              placeholder="e.g., Mumbai, Delhi, Bangalore"
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
            />
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="additionalNotes">
              Any additional preferences or requirements?
            </Label>
            <Textarea
              id="additionalNotes"
              placeholder="e.g., I prefer morning classes, I have a knee injury, I want to focus on striking..."
              rows={4}
              value={formData.additionalNotes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, additionalNotes: e.target.value }))
              }
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={!isFormValid || isLoading}
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Getting Recommendations...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Get AI Recommendations
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

