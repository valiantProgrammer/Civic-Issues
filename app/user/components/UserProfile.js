"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/user-profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to fetch profile");
          if (response.status === 401) {
            router.push("/login/user");
          }
          return;
        }

        if (data.success) {
          setUser(data.user);
          setError(null);
        } else {
          setError(data.message || "Failed to fetch profile");
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Failed to load profile. Please try again.");
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <p className="text-red-600 font-semibold text-lg mb-4">{error}</p>
          <button
            onClick={() => router.push("/login/user")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <p className="text-gray-600 text-lg">No user data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          {/* Header Background */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

          {/* Profile Content */}
          <div className="px-6 pb-6">
            {/* Profile Picture and Name */}
            <div className="flex flex-col items-center -mt-16 mb-6">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-300 to-indigo-400 rounded-full border-4 border-white shadow-lg flex items-center justify-center mb-4">
                <span className="text-4xl text-white font-bold">
                  {user.userName?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 text-center">
                {user.userName || "User"}
              </h1>
              <p className="text-gray-500 mt-1">User Profile</p>
            </div>

            {/* Profile Details */}
            <div className="space-y-4">
              {/* Email */}
              <div className="border-b border-gray-200 pb-4">
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  📧 Email Address
                </label>
                <p className="text-lg text-gray-800">{user.email || "N/A"}</p>
              </div>

              {/* Phone */}
              <div className="border-b border-gray-200 pb-4">
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  📱 Phone Number
                </label>
                <p className="text-lg text-gray-800">
                  {user.phone ? `+${user.phone}` : "N/A"}
                </p>
              </div>

              {/* Age */}
              <div className="border-b border-gray-200 pb-4">
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  🎂 Age
                </label>
                <p className="text-lg text-gray-800">{user.age || "N/A"} years</p>
              </div>

              {/* Address */}
              <div className="border-b border-gray-200 pb-4">
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  📍 Address
                </label>
                <p className="text-lg text-gray-800">
                  {user.address || "N/A"}
                </p>
              </div>

              {/* User ID */}
              <div className="border-b border-gray-200 pb-4">
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  🆔 User ID
                </label>
                <p className="text-lg text-gray-800 font-mono">
                  {user.userId || "N/A"}
                </p>
              </div>

              {/* Last Login */}
              {user.timeOfLogin && (
                <div className="pb-4">
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    🕐 Last Login
                  </label>
                  <p className="text-lg text-gray-800">
                    {new Date(user.timeOfLogin).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4 flex-col sm:flex-row">
              <button
                onClick={() => router.push("/user")}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                ← Back to Dashboard
              </button>
              <button
                onClick={() => router.push("/api/logout")}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Account Information</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-600 font-semibold">Account Type</p>
              <p className="text-gray-800 mt-1">Standard User</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <p className="text-gray-600 font-semibold">Status</p>
              <p className="text-green-600 mt-1">✓ Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
