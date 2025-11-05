
import React from "react";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { ChevronLeft, Mail, Phone, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ContactUs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 py-8 sm:py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-6 sm:mb-8">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
          
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Contact Us</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Get in Touch</h2>
              <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
                We're here to help! Reach out to us with any questions, concerns, or feedback about Martially.
              </p>
              
              <div className="space-y-4 sm:space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center space-y-0 pb-3 sm:pb-4">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-3" />
                    <CardTitle className="text-base sm:text-lg">Email</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm sm:text-base">info@martially.com</p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">We typically respond within 24 hours</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center space-y-0 pb-3 sm:pb-4">
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-3" />
                    <CardTitle className="text-base sm:text-lg">Phone</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm sm:text-base">+91 6363224102</p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">Monday - Friday, 9 AM - 6 PM IST</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center space-y-0 pb-3 sm:pb-4">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-3" />
                    <CardTitle className="text-base sm:text-lg">Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm sm:text-base">Janapriya Apartments, Hesarghatta Rd, Geleyara Balaga Layout, Chikkabanavara, Bengaluru, Guddahalli, Karnataka 560090</p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">India</p>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Business Hours</h2>
              <Card>
                <CardContent className="pt-4 sm:pt-6">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between text-sm sm:text-base">
                      <span>Monday - Friday</span>
                      <span className="text-gray-600">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base">
                      <span>Saturday</span>
                      <span className="text-gray-600">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base">
                      <span>Sunday</span>
                      <span className="text-gray-600">Closed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-6 sm:mt-8">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Frequently Asked Questions</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <h4 className="font-medium text-sm sm:text-base">How do I book a class?</h4>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">Visit our Training Centers page, select a center, and choose your preferred class and time slot.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm sm:text-base">What payment methods do you accept?</h4>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">We accept all major credit cards, debit cards, and digital wallets through our secure payment gateway.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm sm:text-base">Can I cancel my booking?</h4>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">Yes, cancellation policies vary by training center. Please check our Refund and Cancellation Policy for details.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
