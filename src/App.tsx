
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import TrainingCenters from "./pages/TrainingCenters";
import TrainingCenterDetails from "./pages/TrainingCenterDetails";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Auth from "./pages/Auth";
import Bookings from "./pages/Bookings";
import Classes from "./pages/Classes";
import ClassDetails from "./pages/ClassDetails";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import CourseWatch from "./pages/CourseWatch";
import Community from "./pages/Community";
import Recommendations from "./pages/Recommendations";
import MyOrders from "./pages/MyOrders";
import MyProfile from "./pages/MyProfile";
import TermsAndConditions from "./pages/TermsAndConditions";
import ContactUs from "./pages/ContactUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import "./App.css";
import { Toaster } from "@/components/ui/toaster";

const queryClient = new QueryClient();

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        setSession(currentSession);

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
          console.log("Auth state changed:", _event, session?.user?.id);
          setSession(session);
        });

        setLoading(false);
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Auth initialization error:", error);
        setSession(null);
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={session ? <Navigate to="/dashboard" /> : <Auth />} />
            <Route path="/shop" element={<Products />} />
            <Route path="/product/:productId" element={<ProductDetails />} />
            <Route path="/training-centers" element={<TrainingCenters />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/class/:classId" element={<ClassDetails />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/course/:courseId" element={<CourseDetails />} />
            <Route path="/course/:courseId/watch" element={<CourseWatch />} />
            <Route path="/community" element={<Community />} />
            <Route path="/recommendations" element={<Recommendations />} />
            
            {/* Legal and Policy Pages */}
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={session ? <Index /> : <Navigate to="/auth" />}
            />
            <Route
              path="/training-center/:centerId"
              element={<TrainingCenterDetails />}
            />
            <Route
              path="/bookings"
              element={session ? <Bookings /> : <Navigate to="/auth" />}
            />
            <Route
              path="/my-orders"
              element={session ? <MyOrders /> : <Navigate to="/auth" />}
            />
            <Route
              path="/my-profile"
              element={session ? <MyProfile /> : <Navigate to="/auth" />}
            />
            
            {/* Catch all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </QueryClientProvider>
      <Toaster />
    </>
  );
}

export default App;
