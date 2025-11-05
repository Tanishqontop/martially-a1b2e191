
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create a context to ensure proper cleanup
    const ctx = gsap.context(() => {
      // Main animation timeline
      const tl = gsap.timeline();

      // Set initial states
      gsap.set([headingRef.current, paragraphRef.current, buttonsRef.current?.children], {
        y: 50,
        opacity: 0
      });

      // Hero content animations
      tl.to(headingRef.current, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out"
      })
      .to(paragraphRef.current, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out"
      }, "-=0.8")
      .to(buttonsRef.current?.children, {
        y: 0,
        opacity: 1,
        stagger: 0.25,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.6");

      // Background parallax effect
      if (bgRef.current && heroRef.current) {
        ScrollTrigger.create({
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            gsap.to(bgRef.current, {
              y: self.progress * 150,
              ease: "none",
              duration: 0.1
            });
          }
        });
      }
    }, heroRef); // Scope all selectors to heroRef

    return () => ctx.revert(); // Clean up all GSAP animations
  }, []);

  return (
    <div 
      ref={heroRef} 
      className="relative min-h-[80vh] sm:min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center bg-background text-foreground overflow-hidden"
    >
      <div 
        ref={bgRef} 
        className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-40 scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      <div className="relative z-10 text-center space-y-6 sm:space-y-8 px-4 max-w-5xl mx-auto">
        <h1 
          ref={headingRef} 
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter leading-tight"
        >
          Find Your Path in
          <span className="text-primary block sm:inline"> Martial Arts</span>
        </h1>
        <p 
          ref={paragraphRef} 
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl max-w-3xl mx-auto font-light leading-relaxed"
        >
          Discover and enroll in martial arts classes near you. Start your journey today.
        </p>
        <div 
          ref={buttonsRef} 
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center pt-2 sm:pt-4"
        >
          <Link to="/training-centers">
            <Button className="bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 py-5 sm:py-7 text-lg sm:text-xl w-full sm:w-auto rounded-full hover:scale-105 transition-all duration-300 shadow-lg">
              Find Classes
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="border-primary text-primary hover:bg-primary/5 px-6 sm:px-8 py-5 sm:py-7 text-lg sm:text-xl w-full sm:w-auto rounded-full hover:scale-105 transition-all duration-300"
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
