
import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "./ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingBag, User, Menu, X } from "lucide-react";

const Navbar = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setLoading(false);
      } catch (error) {
        console.error("Error checking auth:", error);
        setSession(null);
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center">
          <Link to="/" className="mr-4 sm:mr-6" onClick={closeMobileMenu}>
            <Logo />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/training-centers" className={navigationMenuTriggerStyle()}>
                    Training Centers
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/classes" className={navigationMenuTriggerStyle()}>
                    Classes
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/courses" className={navigationMenuTriggerStyle()}>
                    Courses
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/recommendations" className={navigationMenuTriggerStyle()}>
                    Recommendations
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/community" className={navigationMenuTriggerStyle()}>
                    Community
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/shop" className={navigationMenuTriggerStyle()}>
                    Shop
                  </Link>
                </NavigationMenuItem>
                {session && (
                  <>
                    <NavigationMenuItem>
                      <Link to="/my-orders" className={navigationMenuTriggerStyle()}>
                        <ShoppingBag className="mr-1 h-4 w-4" />
                        My Orders
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Link to="/my-profile" className={navigationMenuTriggerStyle()}>
                        <User className="mr-1 h-4 w-4" />
                        Profile
                      </Link>
                    </NavigationMenuItem>
                  </>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Auth Button */}
          {loading ? (
            <div className="h-9 w-16 sm:w-20 bg-gray-200 animate-pulse rounded-md"></div>
          ) : session ? (
            <Button asChild variant="default" className="bg-green-600 hover:bg-green-700 text-sm px-3 sm:px-4">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <Button asChild variant="default" className="bg-green-600 hover:bg-green-700 text-sm px-3 sm:px-4">
              <Link to="/auth">Sign In</Link>
            </Button>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden p-2"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`lg:hidden transition-all duration-300 ease-in-out ${
        isMobileMenuOpen 
          ? 'max-h-96 opacity-100 border-t visible' 
          : 'max-h-0 opacity-0 overflow-hidden invisible'
      } bg-white/95 backdrop-blur-sm`}>
        <div className="px-4 py-2 space-y-1 max-w-7xl mx-auto">
          <Link 
            to="/training-centers" 
            className="block px-3 py-3 text-base font-medium hover:bg-gray-100 rounded-md transition-colors"
            onClick={closeMobileMenu}
          >
            Training Centers
          </Link>
          <Link 
            to="/classes" 
            className="block px-3 py-3 text-base font-medium hover:bg-gray-100 rounded-md transition-colors"
            onClick={closeMobileMenu}
          >
            Classes
          </Link>
          <Link 
            to="/courses" 
            className="block px-3 py-3 text-base font-medium hover:bg-gray-100 rounded-md transition-colors"
            onClick={closeMobileMenu}
          >
            Courses
          </Link>
          <Link 
            to="/recommendations" 
            className="block px-3 py-3 text-base font-medium hover:bg-gray-100 rounded-md transition-colors"
            onClick={closeMobileMenu}
          >
            Recommendations
          </Link>
          <Link 
            to="/community" 
            className="block px-3 py-3 text-base font-medium hover:bg-gray-100 rounded-md transition-colors"
            onClick={closeMobileMenu}
          >
            Community
          </Link>
          <Link 
            to="/shop" 
            className="block px-3 py-3 text-base font-medium hover:bg-gray-100 rounded-md transition-colors"
            onClick={closeMobileMenu}
          >
            Shop
          </Link>
          {session && (
            <>
              <Link 
                to="/my-orders" 
                className="block px-3 py-3 text-base font-medium hover:bg-gray-100 rounded-md flex items-center transition-colors"
                onClick={closeMobileMenu}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                My Orders
              </Link>
              <Link 
                to="/my-profile" 
                className="block px-3 py-3 text-base font-medium hover:bg-gray-100 rounded-md flex items-center transition-colors"
                onClick={closeMobileMenu}
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Navbar;
