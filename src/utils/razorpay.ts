
import { supabase } from "@/integrations/supabase/client";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const loadRazorpayScript = () => {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    
    script.onload = () => {
      resolve(true);
    };
    
    script.onerror = () => {
      console.error('Failed to load Razorpay script. This might be due to an ad blocker.');
      resolve(false);
    };
    
    document.body.appendChild(script);
  });
};

export type RazorpayDetails = {
  productTitle?: string;
  productId?: string;
  quantity?: number;
  style?: string;
  instructor?: string;
  bookingId?: string;
  courseId?: string;
  product?: {
    name: string;
    description: string;
    image: string;
  };
};

export const initializeRazorpayPayment = async (
  amount: number,
  details: RazorpayDetails
): Promise<{ razorpay_payment_id?: string }> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Using the provided test key directly
      const RAZORPAY_KEY_ID = "rzp_test_ChqH0Ki6nlpIqf";

      console.log('Initializing Razorpay with amount:', amount); // Debug log

      let name = "Martial Arts Shop";
      let description = "";
      
      if (details.product) {
        name = details.product.name;
        description = details.product.description;
      } else if (details.productTitle && details.quantity) {
        description = `${details.quantity}x ${details.productTitle}`;
      } else if (details.style && details.instructor) {
        name = "Martial Arts Academy";
        description = `${details.style} class with ${details.instructor}`;
      }

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: amount * 100, // Amount in smallest currency unit (paise for INR)
        currency: "INR",
        name: name,
        description: description,
        handler: function (response: any) {
          console.log('Payment successful:', response); // Debug log
          resolve(response);
        },
        prefill: {
          name: "",
          email: "",
          contact: ""
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal dismissed'); // Debug log
            reject(new Error('Payment cancelled by user'));
          }
        },
        theme: {
          color: "#16a34a"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error: any) {
      console.error('Razorpay initialization error:', error);
      reject(new Error(error.message || 'Failed to initialize payment'));
    }
  });
};
