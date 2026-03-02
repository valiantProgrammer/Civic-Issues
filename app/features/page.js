"use client";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Link from "next/link";

export default function Features() {
  const features = [
    {
      title: "Real-time Issue Reporting",
      description: "Report civic issues instantly with detailed descriptions, photos, and location data. Our system captures all essential information in seconds.",
      icon: "📍",
    },
    {
      title: "Location-based Tracking",
      description: "Automatically detect your location or manually pin the issue on a map. Track exactly where problems are occurring across your city.",
      icon: "🗺️",
    },
    {
      title: "Photo & Video Evidence",
      description: "Capture clear photos and videos of issues to provide authorities with concrete evidence for faster resolution.",
      icon: "📸",
    },
    {
      title: "AI-powered Classification",
      description: "Our machine learning model automatically classifies issue severity and routes them to the appropriate department instantly.",
      icon: "🤖",
    },
    {
      title: "Live Status Updates",
      description: "Receive real-time notifications on the progress of your reported issues from initial submission to final resolution.",
      icon: "🔔",
    },
    {
      title: "Multiple User Roles",
      description: "Support for Citizens, Admins, and Administrators with tailored dashboards and permissions for each role.",
      icon: "👥",
    },
    {
      title: "Similar Issue Detection",
      description: "Automatically identify and group similar issues reported by multiple citizens to prioritize high-impact problems.",
      icon: "🔍",
    },
    {
      title: "Verified Citizen Portal",
      description: "Verify your email and phone number to establish trust and ensure authentic reporting from verified citizens.",
      icon: "✅",
    },
  ];

  return (
    <div className="font-sans bg-gray-50 text-gray-900 min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-800 text-white py-16 px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6">Interactive Features</h1>
            <p className="text-xl md:text-2xl mb-4">Comprehensive Tools for Civic Issue Management</p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="max-w-6xl mx-auto px-4 md:px-8 py-16">
          <h2 className="text-4xl font-bold text-center mb-12 text-purple-600">Powerful Capabilities</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl hover:scale-105 transition">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-700 text-lg leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Advanced Features Section */}
        <section className="bg-gradient-to-br from-purple-50 to-blue-50 py-16 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-purple-600">Advanced Capabilities</h2>
            
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h3 className="text-3xl font-bold mb-4 text-gray-800">Smart Analytics Dashboard</h3>
                <ul className="space-y-3 text-lg text-gray-700">
                  <li className="flex gap-3">
                    <span className="text-purple-600 font-bold">→</span>
                    Track issue statistics and trends
                  </li>
                  <li className="flex gap-3">
                    <span className="text-purple-600 font-bold">→</span>
                    Visualize problem hotspots on maps
                  </li>
                  <li className="flex gap-3">
                    <span className="text-purple-600 font-bold">→</span>
                    Monitor resolution rates
                  </li>
                  <li className="flex gap-3">
                    <span className="text-purple-600 font-bold">→</span>
                    Compare performance across departments
                  </li>
                </ul>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-6xl text-center mb-4">📊</div>
                <p className="text-center text-gray-700">Data-driven insights to improve city infrastructure</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-6xl text-center mb-4">🔐</div>
                <p className="text-center text-gray-700">Enterprise-grade security and privacy</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-4 text-gray-800">Secure & Private</h3>
                <ul className="space-y-3 text-lg text-gray-700">
                  <li className="flex gap-3">
                    <span className="text-purple-600 font-bold">→</span>
                    Encrypted data transmission
                  </li>
                  <li className="flex gap-3">
                    <span className="text-purple-600 font-bold">→</span>
                    Secure user authentication
                  </li>
                  <li className="flex gap-3">
                    <span className="text-purple-600 font-bold">→</span>
                    Privacy-first data handling
                  </li>
                  <li className="flex gap-3">
                    <span className="text-purple-600 font-bold">→</span>
                    Compliance with data protection laws
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-purple-600 text-white py-16 px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
            <p className="text-xl mb-8">
              Start reporting civic issues today and help build a better community.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link href="/signup/user" className="inline-block px-8 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition">
                Sign Up Now
              </Link>
              <Link href="/how-to-use" className="inline-block px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-purple-600 transition">
                Learn How to Use
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
