

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Hero from "@/components/Hero";
import Logo from "@/components/Logo";
import MerchandiseSection from "@/components/MerchandiseSection";
import Navbar from "@/components/Navbar";
import { 
  MapPin, 
  Users, 
  Award, 
  Calendar, 
  Shield, 
  Star, 
  ChevronRight 
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const stylesRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Features section animation - fixed implementation
    if (featuresRef.current) {
      const featureCards = featuresRef.current.querySelectorAll('.feature-card');
      
      // Make sure cards are initially invisible
      gsap.set(featureCards, { opacity: 0, y: 50 });
      
      featureCards.forEach((card, index) => {
        gsap.to(card, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top bottom-=100",
              end: "bottom top+=100",
              toggleActions: "play none none reverse"
            },
            delay: index * 0.1
        });
      });
    }
    
    // Martial Arts Styles animation
    if (stylesRef.current) {
      const styleCards = stylesRef.current.querySelectorAll('.style-card');
      
      // Make sure cards are initially invisible
      gsap.set(styleCards, { opacity: 0, y: 40 });
      
      styleCards.forEach((card, index) => {
        gsap.to(card, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top bottom-=50",
              end: "bottom top+=100",
              toggleActions: "play none none reverse"
            },
            delay: index * 0.1
        });
      });
    }
    
    // CTA section animation
    if (ctaRef.current) {
      // Set initial state
      gsap.set(ctaRef.current, { opacity: 0, y: 30 });
      
      gsap.to(ctaRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top bottom-=100",
          end: "bottom top+=100",
          toggleActions: "play none none reverse"
        }
      });
    }
    
    return () => {
      // Clean up ScrollTrigger instances
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <section className="py-12 px-4 sm:py-16 md:py-24 bg-white" ref={featuresRef}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Why Choose <span className="text-green-600">Martially</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg px-2">
              We make it easy to discover and book martial arts classes tailored to your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <FeatureCard 
              icon={<MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />}
              title="Find Classes Nearby"
              description="Discover martial arts training centers in your area with our location-based search."
            />
            <FeatureCard 
              icon={<Users className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />}
              title="Expert Instructors"
              description="Learn from certified professionals with years of experience in various martial arts styles."
            />
            <FeatureCard 
              icon={<Award className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />}
              title="All Skill Levels"
              description="Whether you're a beginner or advanced practitioner, find classes that match your level."
            />
            <FeatureCard 
              icon={<Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />}
              title="Easy Scheduling"
              description="Book classes that fit your schedule with our simple booking system."
            />
            <FeatureCard 
              icon={<Shield className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />}
              title="Verified Centers"
              description="All training centers on our platform are verified for quality and safety."
            />
            <FeatureCard 
              icon={<Star className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />}
              title="Community Reviews"
              description="Read authentic reviews from students to make informed decisions."
            />
          </div>
        </div>
      </section>

      {/* Merchandise Section */}
      <MerchandiseSection />

      {/* Martial Arts Styles Section */}
      <section className="py-12 px-4 sm:py-16 md:py-24 bg-martial-gray" ref={stylesRef}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Explore Martial Arts Styles
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg px-2">
              Discover a variety of martial arts disciplines to find what resonates with you.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <StyleCard
              image="/lovable-uploads/a70e09ba-043b-4358-91f9-5ae59f798d36.png"
              title="Karate"
              description="A Japanese martial art emphasizing striking techniques using the hands, feet, elbows and knees."
            />
            <StyleCard
              image="/lovable-uploads/3c0a55c7-728e-40da-9344-df27e6615bb6.png"
              title="Brazilian Jiu-Jitsu"
              description="A ground-focused martial art emphasizing grappling and submission holds."
            />
            <StyleCard
              image="/lovable-uploads/92b0b3df-ea68-4898-a9c1-e108608a9510.png"
              title="Muay Thai"
              description="A combat sport from Thailand using stand-up striking and clinching techniques."
            />
            <StyleCard
              image="/lovable-uploads/d4b832ee-8119-4e34-b07d-07ce99ebad20.png"
              title="Taekwondo"
              description="A Korean martial art characterized by head-height kicks, jumping kicks, and spinning kicks."
            />
            <StyleCard
              image="/lovable-uploads/9ade8d3d-57e5-4263-ad49-a9270bc941cc.png"
              title="Kung Fu"
              description="A collection of Chinese martial arts that have developed over centuries in China."
            />
            <StyleCard
              image="/lovable-uploads/55a6d3f5-864e-4da5-9cf9-f754cd16b032.png"
              title="Mixed Martial Arts"
              description="A full-contact combat sport incorporating techniques from various combat sports."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 sm:py-16 md:py-24 bg-green-50" ref={ctaRef}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 px-2">
            Ready to Begin Your Martial Arts Journey?
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            Join thousands of students who have discovered their passion for martial arts through our platform.
          </p>
          <Link to="/auth">
            <Button className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg w-full sm:w-auto max-w-xs mx-auto">
              Start Now
              <ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 sm:py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo className="text-white" />
            <p className="mt-3 sm:mt-4 text-gray-300 text-sm sm:text-base">
              Connecting martial arts enthusiasts with quality training centers since 2023.
            </p>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
              <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link to="/training-centers" className="text-gray-300 hover:text-white">Find Classes</Link></li>
              <li><Link to="/auth" className="text-gray-300 hover:text-white">Sign In</Link></li>
              <li><Link to="/auth" className="text-gray-300 hover:text-white">Register</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Legal</h3>
            <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
              <li><Link to="/terms-and-conditions" className="text-gray-300 hover:text-white">Terms & Conditions</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/refund-policy" className="text-gray-300 hover:text-white">Refund Policy</Link></li>
              <li><Link to="/shipping-policy" className="text-gray-300 hover:text-white">Shipping Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contact Us</h3>
            <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
              <li className="text-gray-300">Email: info@martially.com</li>
              <li className="text-gray-300">Phone: +91 6363224102</li>
              <li className="text-gray-300">Address: Janapriya Apartments, Hesarghatta Rd, Geleyara Balaga Layout, Chikkabanavara, Bengaluru, Guddahalli, Karnataka 560090</li>
              <li><Link to="/contact-us" className="text-gray-300 hover:text-white">Contact Page</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-700 text-center text-gray-400 text-sm sm:text-base">
          <p>&copy; {new Date().getFullYear()} Martially. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  return (
    <Card className="feature-card border-gray-200 hover:border-green-500 hover:shadow-md transition-all">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="mb-2">{icon}</div>
        <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 text-sm sm:text-base">{description}</p>
      </CardContent>
    </Card>
  );
};

const StyleCard = ({ image, title, description }: { image: string, title: string, description: string }) => {
  return (
    <Card className="style-card overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
      <div className="h-40 sm:h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{description}</p>
      </CardContent>
      <CardFooter>
        <Link to="/training-centers" className="text-green-600 hover:text-green-700 font-medium flex items-center text-sm sm:text-base">
          Find Classes
          <ChevronRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
};

export default LandingPage;

