
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { loadRazorpayScript, initializeRazorpayPayment } from "@/utils/razorpay";

interface EnrollButtonProps {
  classId: string;
  style: string;
  title: string;
  price: string;
  className?: string;
}

const EnrollButton = ({ classId, style, title, price, className }: EnrollButtonProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleEnrollClick = async () => {
    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to enroll in classes",
          variant: "destructive"
        });
        return;
      }

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast({
          title: "Payment Error",
          description: "Could not load payment system. Please try again.",
          variant: "destructive"
        });
        return;
      }

      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          class_id: classId,
          amount: parseFloat(price.replace('₹', '')),
          status: 'pending'
        })
        .select()
        .single();

      if (bookingError) {
        throw bookingError;
      }

      const response = await initializeRazorpayPayment(
        parseFloat(price.replace('₹', '')),
        {
          style: style,
          instructor: title,
          bookingId: booking.id
        }
      );

      if (response.razorpay_payment_id) {
        const { error: updateError } = await supabase
          .from('bookings')
          .update({ 
            status: 'completed',
            payment_id: response.razorpay_payment_id
          })
          .eq('id', booking.id);

        if (updateError) throw updateError;

        toast({
          title: "Enrollment Successful",
          description: "You have successfully enrolled in the class!",
        });
      }
    } catch (error: any) {
      console.error('Enrollment error:', error);
      toast({
        title: "Enrollment Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      className={`bg-green-600 hover:bg-green-700 text-white ${className || ''}`}
      onClick={handleEnrollClick}
      disabled={isLoading}
    >
      {isLoading ? "Processing..." : "Enroll Now"}
    </Button>
  );
};

export default EnrollButton;
