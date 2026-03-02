"use client";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Image from "next/image";
import Link from "next/link";

export default function HowToUse() {
  const steps = [
    {
      number: 1,
      title: "Sign Up or Log In",
      description: "Create a new account or log in to your existing Civic Saathi account. Verify your email and phone number for a trusted profile.",
      image: "/images/step1.jpg",
    },
    {
      number: 2,
      title: "Navigate to Report Issue",
      description: "From the dashboard, click on 'Add Report' or the '+' button to start reporting a new civic issue.",
      image: "/images/step2.jpg",
    },
    {
      number: 3,
      title: "Fill in Issue Details",
      description: "Enter a clear title and detailed description of the issue you've encountered.",
      image: "/images/step3.jpg",
    },
    {
      number: 4,
      title: "Select Issue Category",
      description: "Choose the appropriate category (Pothole, Streetlight, Water Leak, etc.) for your issue.",
      image: "/images/step4.jpg",
    },
    {
      number: 5,
      title: "Add Your Location",
      description: "Allow the app to access your location or manually pin the exact location on the map.",
      image: "/images/step5.jpg",
    },
    {
      number: 6,
      title: "Capture Evidence",
      description: "Take photos or videos of the issue to provide clear visual evidence.",
      image: "/images/step6.jpg",
    },
    {
      number: 7,
      title: "Review Your Report",
      description: "Double-check all information and photos before submitting your report.",
      image: "/images/step7.jpg",
    },
    {
      number: 8,
      title: "Submit Your Report",
      description: "Click submit to send your report to the authorities. You'll receive a confirmation and ticket ID.",
      image: "/images/step8.jpg",
    },
    {
      number: 9,
      title: "Track Your Issue",
      description: "Monitor the progress of your reported issue in real-time through the dashboard.",
      image: "/images/step9.jpg",
    },
    {
      number: 10,
      title: "Receive Updates",
      description: "Get notifications as authorities work on resolving your reported issue.",
      image: "/images/step10.jpg",
    },
    {
      number: 11,
      title: "Issue Resolution",
      description: "View the final status and photos of completed work on your reported issue.",
      image: "/images/step11.jpg",
    },
  ];

  return (
    <div className="font-sans bg-gray-50 text-gray-900 min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 to-purple-800 text-white py-16 px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6">How to Use Civic Saathi</h1>
            <p className="text-xl md:text-2xl mb-4">Step-by-Step Guide to Report and Track Issues</p>
          </div>
        </section>

        {/* Quick Tips Section */}
        <section className="max-w-6xl mx-auto px-4 md:px-8 py-12">
          <h2 className="text-3xl font-bold mb-8 text-purple-600">Quick Tips for Success</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
              <h3 className="text-xl font-bold mb-3 text-blue-900">📸 Quality Photos</h3>
              <p className="text-gray-700">Take clear, well-lit photos from multiple angles to provide complete evidence of the issue.</p>
            </div>
            <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-500">
              <h3 className="text-xl font-bold mb-3 text-green-900">📍 Accurate Location</h3>
              <p className="text-gray-700">Ensure the location is precisely marked on the map for quick identification and action.</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-500">
              <h3 className="text-xl font-bold mb-3 text-yellow-900">📝 Clear Description</h3>
              <p className="text-gray-700">Write detailed descriptions explaining the issue and its impact on the community.</p>
            </div>
          </div>
        </section>

        {/* Step-by-Step Guide */}
        <section className="max-w-6xl mx-auto px-4 md:px-8 pb-16">
          <h2 className="text-4xl font-bold text-center mb-12 text-purple-600">Step-by-Step Process</h2>
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={index} className={`flex gap-8 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                <div className="flex-1">
                  <div className="bg-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-3xl font-bold mb-3 text-gray-800">{step.title}</h3>
                  <p className="text-lg text-gray-700 leading-relaxed">{step.description}</p>
                </div>
                <div className="flex-1 relative h-96 md:h-[28rem] rounded-xl overflow-hidden shadow-lg bg-gray-200">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Best Practices Section */}
        <section className="bg-purple-50 py-16 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-purple-600">Best Practices</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold mb-4 text-green-600">✓ Do's</h3>
                <ul className="space-y-3 text-lg text-gray-700">
                  <li>✓ Report issues promptly when discovered</li>
                  <li>✓ Provide accurate location information</li>
                  <li>✓ Include clear photos or videos</li>
                  <li>✓ Write detailed descriptions</li>
                  <li>✓ Track your report progress regularly</li>
                  <li>✓ Be respectful and professional</li>
                </ul>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold mb-4 text-red-600">✗ Don'ts</h3>
                <ul className="space-y-3 text-lg text-gray-700">
                  <li>✗ Submit false or misleading reports</li>
                  <li>✗ Provide vague location details</li>
                  <li>✗ Upload blurry or irrelevant photos</li>
                  <li>✗ Report private property issues</li>
                  <li>✗ Use the platform for complaints unrelated to civic issues</li>
                  <li>✗ Harass authorities or other users</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Ticket System Section */}
        <section className="max-w-6xl mx-auto px-4 md:px-8 py-16">
          <h2 className="text-4xl font-bold text-center mb-12 text-purple-600">Understanding Your Ticket</h2>
          <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl shadow-lg p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Ticket ID</h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Every report you submit receives a unique Ticket ID. Use this ID to track your issue and reference it in any communications with authorities.
                </p>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Status Tracking</h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Your ticket progresses through various stages:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li><strong>Submitted:</strong> Report received</li>
                  <li><strong>Under Review:</strong> Authority examining the issue</li>
                  <li><strong>In Progress:</strong> Work has started</li>
                  <li><strong>Resolved:</strong> Issue has been fixed</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎫</div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Sample Ticket</h4>
                  <div className="text-left space-y-2 text-gray-700">
                    <p><strong>Ticket ID:</strong> TKT-2024-001234</p>
                    <p><strong>Issue:</strong> Pothole on Main Street</p>
                    <p><strong>Status:</strong> In Progress</p>
                    <p><strong>Reported:</strong> March 2, 2024</p>
                    <p><strong>Expected:</strong> March 9, 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-gray-100 py-16 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-purple-600">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-bold mb-3 text-purple-600">How long does it take to resolve an issue?</h3>
                <p className="text-gray-700">Resolution time varies based on severity. High-priority safety issues are addressed within 24-48 hours, while routine maintenance may take 1-2 weeks.</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-bold mb-3 text-purple-600">Can I report multiple issues?</h3>
                <p className="text-gray-700">Yes! Each issue should be reported separately to ensure proper tracking and categorization.</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-bold mb-3 text-purple-600">What if my issue is not resolved?</h3>
                <p className="text-gray-700">You can follow up on your ticket, add updates, or contact the assigned authority through the ticket details.</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-bold mb-3 text-purple-600">Is my personal data safe?</h3>
                <p className="text-gray-700">Yes, we use enterprise-grade encryption and follow strict data protection policies to keep your information secure.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16 px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Report Your First Issue?</h2>
            <p className="text-xl mb-8">
              Join thousands of citizens making a difference in their communities.
            </p>
            <Link href="/signup/user" className="inline-block px-12 py-4 bg-white text-purple-600 font-bold text-lg rounded-lg hover:bg-gray-100 transition shadow-lg">
              Get Started Now
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
