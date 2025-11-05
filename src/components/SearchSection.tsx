
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const SearchSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (sectionRef.current && formRef.current) {
      // Initial state - necessary for animation
      gsap.set(formRef.current, { 
        y: 50, 
        opacity: 0 
      });
      
      // Create animation
      const animation = gsap.to(formRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        paused: true
      });
      
      // Create scroll trigger
      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        onEnter: () => animation.play(),
        onLeaveBack: () => animation.reverse()
      });
      
      return () => {
        // Clean up
        animation.kill();
        trigger.kill();
      };
    }
  }, []);

  return (
    <div 
      ref={sectionRef}
      className="bg-gradient-to-r from-accent/90 to-accent/70 py-16 px-4 shadow-lg"
    >
      <div className="max-w-6xl mx-auto">
        <div 
          ref={formRef}
          className="flex flex-col md:flex-row gap-4 bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-glass hover:shadow-xl transition-all duration-500 border border-white/30"
        >
          <Input 
            placeholder="Enter your location" 
            className="flex-grow text-lg py-7 bg-white/70 backdrop-blur-lg border-0 shadow-soft hover:shadow-md transition-all rounded-xl"
          />
          <Input 
            placeholder="Martial art style" 
            className="flex-grow text-lg py-7 bg-white/70 backdrop-blur-lg border-0 shadow-soft hover:shadow-md transition-all rounded-xl"
          />
          <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-7 text-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 rounded-xl">
            <Search className="mr-2" />
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
