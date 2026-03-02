"use client";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Link from "next/link";

export default function About() {
  return (
    <div className="font-sans bg-gray-50 text-gray-900 min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-16 px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6">About Civic Saathi</h1>
            <p className="text-xl md:text-2xl mb-4">Empowering Citizens to Report and Resolve Civic Issues</p>
          </div>
        </section>

        {/* About Content */}
        <section className="max-w-6xl mx-auto px-4 md:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-purple-600">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                Civic Saathi is a civic issue reporting and management platform designed to bridge the gap between citizens and authorities. We empower citizens to report issues like potholes, broken streetlights, water pipeline leaks, and more with real-time tracking and updates.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our mission is to make civic infrastructure management transparent, efficient, and citizen-centric by providing a seamless reporting mechanism and tracking system.
              </p>
            </div>
            <div className="bg-purple-100 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4 text-purple-600">Key Features</h3>
              <ul className="space-y-3 text-lg text-gray-700">
                <li className="flex items-center gap-3">
                  <span className="text-purple-600 font-bold">✓</span> Real-time Issue Reporting
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-purple-600 font-bold">✓</span> Location-based Tracking
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-purple-600 font-bold">✓</span> Photo & Video Evidence
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-purple-600 font-bold">✓</span> Live Status Updates
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-purple-600 font-bold">✓</span> AI-powered Severity Classification
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-12 mb-16">
            <h2 className="text-4xl font-bold mb-8 text-purple-600">Why Civic Saathi?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl mb-4">📱</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">Easy Reporting</h3>
                <p className="text-gray-700">Simple, intuitive interface for quick issue reporting in just a few clicks</p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">🚀</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">Instant Updates</h3>
                <p className="text-gray-700">Get real-time notifications on the status of your reported issues</p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">🤝</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">Community Impact</h3>
                <p className="text-gray-700">Together we make our cities better, one issue at a time</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-4xl font-bold mb-6 text-purple-600">Smart Issue Classification</h2>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                Using advanced AI technology, Civic Saathi automatically classifies the severity of reported issues and routes them to the appropriate authorities. This ensures urgent matters get immediate attention.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                From high-priority safety concerns to routine maintenance issues, our intelligent system ensures every report reaches the right department at the right time.
              </p>
              <Link href="/how-to-use" className="inline-block px-8 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition">
                Learn How to Use
              </Link>
            </div>
            <div className="order-1 md:order-2 bg-gradient-to-br from-purple-100 to-purple-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4 text-purple-600">Severity Levels</h3>
              <ul className="space-y-3 text-lg text-gray-700">
                <li className="border-l-4 border-red-500 pl-4">
                  <strong>High Priority:</strong> Safety hazards, accidents
                </li>
                <li className="border-l-4 border-yellow-500 pl-4">
                  <strong>Medium Priority:</strong> Infrastructure damage
                </li>
                <li className="border-l-4 border-green-500 pl-4">
                  <strong>Low Priority:</strong> Routine maintenance
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-purple-50 py-16 px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Join the Civic Saathi Community</h2>
            <p className="text-xl text-gray-700 mb-8">
              Be part of the change. Report issues, track progress, and help make your city better.
            </p>
            <Link href="/signup/user" className="inline-block px-12 py-4 bg-purple-600 text-white font-bold text-lg rounded-lg hover:bg-purple-700 transition shadow-lg">
              Get Started Today
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
