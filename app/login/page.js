"use client";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Link from "next/link";

export default function Login() {
  return (
    <div className="font-sans bg-gray-50 text-gray-900 min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow flex items-center justify-center px-4 md:px-8 py-16">
        <div className="w-full max-w-6xl">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-extrabold text-purple-600 mb-4">
              Welcome Back
            </h1>
            <p className="text-xl text-gray-700">
              Choose your login type to continue to Civic Saathi
            </p>
          </div>

          {/* Login Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* User Login */}
            <Link href="/login/user" className="group">
              <div className="bg-white rounded-2xl shadow-lg p-8 h-full hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="text-7xl mb-6 text-center">👤</div>
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
                  Citizen
                </h2>
                <p className="text-gray-600 text-center mb-6 leading-relaxed text-base">
                  Report civic issues, track progress, and help improve your community
                </p>
                <div className="bg-purple-50 rounded-lg p-5 mb-6">
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <span className="text-purple-600">✓</span> Report issues
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-purple-600">✓</span> Track status
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-purple-600">✓</span> View history
                    </li>
                  </ul>
                </div>
                <button className="w-full py-3 px-5 bg-purple-600 text-white font-bold text-base rounded-lg hover:bg-purple-700 transition-colors shadow-md group-hover:shadow-lg">
                  Login as Citizen
                </button>
              </div>
            </Link>

            {/* Admin Login */}
            <Link href="/login/admin" className="group">
              <div className="bg-white rounded-2xl shadow-lg p-8 h-full hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-blue-500">
                <div className="text-7xl mb-6 text-center">👨‍💼</div>
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
                  Admin
                </h2>
                <p className="text-gray-600 text-center mb-6 leading-relaxed text-base">
                  Manage reports, assign tasks, and monitor city-wide issue resolution
                </p>
                <div className="bg-blue-50 rounded-lg p-5 mb-6">
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <span className="text-blue-600">✓</span> Manage reports
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-600">✓</span> Assign teams
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-600">✓</span> View analytics
                    </li>
                  </ul>
                </div>
                <button className="w-full py-3 px-5 bg-blue-600 text-white font-bold text-base rounded-lg hover:bg-blue-700 transition-colors shadow-md group-hover:shadow-lg">
                  Login as Admin
                </button>
              </div>
            </Link>

            {/* Administrator Login */}
            <Link href="/login/administration" className="group">
              <div className="bg-white rounded-2xl shadow-lg p-8 h-full hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-red-500">
                <div className="text-7xl mb-6 text-center">👑</div>
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
                  Administrator
                </h2>
                <p className="text-gray-600 text-center mb-6 leading-relaxed text-base">
                  System administration, user management, and platform configuration
                </p>
                <div className="bg-red-50 rounded-lg p-5 mb-6">
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <span className="text-red-600">✓</span> User management
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-red-600">✓</span> System settings
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-red-600">✓</span> Full access
                    </li>
                  </ul>
                </div>
                <button className="w-full py-3 px-5 bg-red-600 text-white font-bold text-base rounded-lg hover:bg-red-700 transition-colors shadow-md group-hover:shadow-lg">
                  Login as Administrator
                </button>
              </div>
            </Link>
          </div>

          {/* Info Section */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Don't have an account?</h3>
            <p className="text-gray-700 mb-6">
              Create a new account to start reporting civic issues and making a difference in your community.
            </p>
            <Link href="/signup/user" className="inline-block px-8 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors">
              Sign Up as Citizen
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
