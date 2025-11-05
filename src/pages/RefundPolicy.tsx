
import React from "react";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-8">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
          
          <h1 className="text-3xl font-bold mb-8">Refund and Cancellation Policy</h1>
          
          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Class Booking Cancellations</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>24+ hours before class:</strong> Full refund</li>
                <li><strong>12-24 hours before class:</strong> 50% refund</li>
                <li><strong>Less than 12 hours:</strong> No refund</li>
                <li><strong>No-show:</strong> No refund</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Membership Cancellations</h2>
              <p className="mb-4">
                Monthly memberships can be cancelled with 30 days notice. Annual memberships are non-refundable after 7 days from purchase.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Merchandise Returns</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Items can be returned within 30 days of purchase</li>
                <li>Items must be in original condition with tags</li>
                <li>Custom or personalized items are non-returnable</li>
                <li>Return shipping costs are borne by the customer</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Refund Processing</h2>
              <p className="mb-4">
                Approved refunds will be processed within 5-7 business days to the original payment method.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Training Center Cancellations</h2>
              <p className="mb-4">
                If a training center cancels a class, students will receive a full refund or the option to reschedule to another available slot.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Emergency Situations</h2>
              <p className="mb-4">
                In case of medical emergencies or other unforeseen circumstances, refund requests will be reviewed on a case-by-case basis.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. How to Request a Refund</h2>
              <p className="mb-4">
                To request a refund, contact us at refunds@martially.com with your booking details and reason for cancellation.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
