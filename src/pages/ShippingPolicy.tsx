
import React from "react";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-8">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
          
          <h1 className="text-3xl font-bold mb-8">Shipping and Delivery Policy</h1>
          
          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Delivery Timelines</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Within Bengaluru:</strong> 1-2 business days</li>
                <li><strong>Karnataka:</strong> 2-4 business days</li>
                <li><strong>Other Indian cities:</strong> 4-7 business days</li>
                <li><strong>Remote areas:</strong> 7-10 business days</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Shipping Costs</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Free shipping on orders above ₹1,500</li>
                <li>Within Bengaluru: ₹50</li>
                <li>Within Karnataka: ₹100</li>
                <li>Other states: ₹150</li>
                <li>Express delivery: Additional ₹100</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Order Processing</h2>
              <p className="mb-4">
                Orders are processed within 1-2 business days. Orders placed on weekends or holidays will be processed on the next business day.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Delivery Partners</h2>
              <p className="mb-4">
                We partner with reliable courier services including Delhivery, Blue Dart, and India Post to ensure safe delivery of your orders.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Tracking Your Order</h2>
              <p className="mb-4">
                Once your order is shipped, you'll receive a tracking number via email and SMS to monitor your package's progress.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Delivery Attempts</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Courier will make 3 delivery attempts</li>
                <li>If unsuccessful, package will be held at the nearest courier office</li>
                <li>You'll be notified to collect within 7 days</li>
                <li>Uncollected packages will be returned to us</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Damaged or Lost Packages</h2>
              <p className="mb-4">
                If your package arrives damaged or is lost in transit, please contact us immediately at shipping@martially.com. We'll investigate and provide a replacement or refund.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Address Changes</h2>
              <p className="mb-4">
                Address changes are only possible before order dispatch. Contact us within 2 hours of placing your order for any address modifications.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
