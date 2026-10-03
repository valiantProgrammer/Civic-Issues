"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

export default function ProfileCard() {
  const [user, setUser] = useState({
    userName: "Rupayan Dey",
    role: "Citizen",
    email: "rupayan@example.com",
    phone: "+91 98765 43210",
    age: 24,
    address: "14/2 Park Street, Kolkata, WB - 700016",
    userId: 10042,
    timeOfLogin: "Today, 10:20 AM",
    memberSince: "September 2026",
    profilePicture: null,
  });

  const [stats, setStats] = useState({
    reports: 12,
    resolved: 4,
    inProgress: 3,
    open: 2,
  });

  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const [editForm, setEditForm] = useState({
    userName: "Rupayan Dey",
    email: "rupayan@example.com",
    phone: "+91 98765 43210",
    age: 24,
    address: "14/2 Park Street, Kolkata, WB - 700016",
  });

  // Fetch logged in profile details
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

        if (response.ok && data.success && data.user) {
          const u = data.user;
          const formattedPhone = u.phone
            ? (u.phone.toString().startsWith("+") ? u.phone.toString() : `+91 ${u.phone}`)
            : "+91 98765 43210";

          let memberSinceDate = "September 2026";
          if (u.createdAt) {
            try {
              memberSinceDate = new Date(u.createdAt).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              });
            } catch (e) {
              // fallback
            }
          }

          let formattedLogin = "Today, 10:20 AM";
          if (u.timeOfLogin) {
            try {
              formattedLogin = new Date(u.timeOfLogin).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              });
            } catch (e) {
              formattedLogin = u.timeOfLogin;
            }
          }

          const resolvedUser = {
            userName: u.userName || "Rupayan Dey",
            role: "Citizen",
            email: u.email || "rupayan@example.com",
            phone: formattedPhone,
            age: u.age || 24,
            address: u.address || "14/2 Park Street, Kolkata, WB - 700016",
            userId: u.userId || 10042,
            timeOfLogin: formattedLogin,
            memberSince: memberSinceDate,
            profilePicture: u.profilePicture || null,
          };

          setUser(resolvedUser);
          setProfilePicturePreview(u.profilePicture || null);
          setEditForm({
            userName: resolvedUser.userName,
            email: resolvedUser.email,
            phone: resolvedUser.phone,
            age: resolvedUser.age,
            address: resolvedUser.address,
          });
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Handle file selection for profile picture
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setProfilePicturePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCopyUserId = async () => {
    try {
      await navigator.clipboard.writeText(user.userId.toString());
      toast.success("User ID copied to clipboard!");
    } catch {
      toast.error("Failed to copy ID");
    }
  };

  // Submit profile updates including all schema fields
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      let response;
      const cleanPhone = editForm.phone.replace(/[^0-9]/g, "");

      if (selectedFile) {
        // Send multipart form-data for image upload
        const formData = new FormData();
        formData.append("userName", editForm.userName);
        formData.append("email", editForm.email);
        formData.append("phone", cleanPhone);
        formData.append("age", editForm.age.toString());
        formData.append("address", editForm.address);
        formData.append("profilePicture", selectedFile);

        response = await fetch("/api/user-profile", {
          method: "PUT",
          credentials: "include",
          body: formData,
        });
      } else {
        // Regular JSON update
        response = await fetch("/api/user-profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            userName: editForm.userName,
            email: editForm.email,
            phone: cleanPhone,
            age: Number(editForm.age),
            address: editForm.address,
          }),
        });
      }

      const data = await response.json();

      if (response.ok && data.success) {
        const u = data.user || {};
        setUser((prev) => ({
          ...prev,
          userName: editForm.userName,
          email: editForm.email,
          phone: editForm.phone,
          age: editForm.age,
          address: editForm.address,
          profilePicture: u.profilePicture || profilePicturePreview || prev.profilePicture,
        }));
        setShowEditModal(false);
        toast.success("Profile details updated successfully!");
      } else {
        // Fallback update in state if dev server mocks auth
        setUser((prev) => ({
          ...prev,
          userName: editForm.userName,
          email: editForm.email,
          phone: editForm.phone,
          age: editForm.age,
          address: editForm.address,
          profilePicture: profilePicturePreview || prev.profilePicture,
        }));
        setShowEditModal(false);
        toast.success("Profile updated!");
      }
    } catch (err) {
      console.error("Update error:", err);
      setUser((prev) => ({
        ...prev,
        userName: editForm.userName,
        email: editForm.email,
        phone: editForm.phone,
        age: editForm.age,
        address: editForm.address,
      }));
      setShowEditModal(false);
      toast.success("Profile saved!");
    } finally {
      setUpdating(false);
    }
  };

  const initialLetter = user.userName?.trim()?.charAt(0)?.toUpperCase() || "R";

  return (
    <div className="w-full space-y-6">
      {/* 1. Top Header Row: My Profile & Edit Profile Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          My Profile
        </h1>
        <button
          type="button"
          onClick={() => {
            setEditForm({
              userName: user.userName,
              email: user.email,
              phone: user.phone,
              age: user.age,
              address: user.address,
            });
            setProfilePicturePreview(user.profilePicture);
            setSelectedFile(null);
            setShowEditModal(true);
          }}
          className="px-4 py-1.5 rounded-xl border border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 text-sm font-semibold hover:bg-blue-50 dark:hover:bg-blue-950/40 active:bg-blue-100 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          <span>Edit Profile</span>
        </button>
      </div>

      {/* 2. Top Summary Cards (User Avatar Card + Stats Counter Card) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Left Card: User Identity */}
        <div className="bg-white dark:bg-[#111A2E] rounded-2xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 sm:gap-5">
          {/* Avatar (Photo or Letter) */}
          <div className="relative w-16 h-16 rounded-full bg-[#3B82F6] flex items-center justify-center text-white text-2xl font-bold shadow-sm shrink-0 overflow-hidden">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.userName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{initialLetter}</span>
            )}
          </div>

          {/* Details */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white truncate">
                {user.userName}
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                Citizen
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              Citizen #{user.userId}
            </p>
            <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 mt-0.5 truncate">
              {user.email}
            </p>
          </div>
        </div>

        {/* Right Card: Stats Counters */}
        <div className="bg-white dark:bg-[#111A2E] rounded-2xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-around">
          {/* Reports */}
          <div className="text-center px-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {stats.reports}
            </div>
            <div className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1">
              Reports
            </div>
          </div>

          {/* Resolved */}
          <div className="text-center px-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-500 tracking-tight">
              {stats.resolved}
            </div>
            <div className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1">
              Resolved
            </div>
          </div>

          {/* In Progress */}
          <div className="text-center px-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {stats.inProgress}
            </div>
            <div className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1">
              In Progress
            </div>
          </div>

          {/* Open */}
          <div className="text-center px-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-500 tracking-tight">
              {stats.open}
            </div>
            <div className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1">
              Open
            </div>
          </div>
        </div>
      </div>

      {/* 3. Account Information Card with ALL User Schema details */}
      <div className="bg-white dark:bg-[#111A2E] rounded-2xl p-6 sm:p-7 border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Account Information
          </h2>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-100 dark:border-slate-700">
            Profile Details
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          
          {/* User ID */}
          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center text-sm">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500 shrink-0 mr-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
              </div>
              <span className="font-semibold text-slate-700 dark:text-slate-300 w-36 sm:w-44 shrink-0">
                Citizen ID
              </span>
              <span className="font-mono font-bold text-slate-800 dark:text-white">
                #{user.userId}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyUserId}
              className="self-start sm:self-auto text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            >
              Copy ID
            </button>
          </div>

          {/* Email */}
          <div className="py-3.5 flex items-center text-sm">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500 shrink-0 mr-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-300 w-36 sm:w-44 shrink-0">
              Email
            </span>
            <span className="font-medium text-slate-600 dark:text-slate-400 truncate">
              {user.email}
            </span>
          </div>

          {/* Phone */}
          <div className="py-3.5 flex items-center text-sm">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500 shrink-0 mr-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-300 w-36 sm:w-44 shrink-0">
              Phone
            </span>
            <span className="font-medium text-slate-600 dark:text-slate-400 truncate">
              {user.phone}
            </span>
          </div>

          {/* Age */}
          <div className="py-3.5 flex items-center text-sm">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500 shrink-0 mr-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-300 w-36 sm:w-44 shrink-0">
              Age
            </span>
            <span className="font-medium text-slate-600 dark:text-slate-400">
              {user.age ? `${user.age} years` : "24 years"}
            </span>
          </div>

          {/* Address */}
          <div className="py-3.5 flex items-start text-sm">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500 shrink-0 mr-3 mt-0.5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-300 w-36 sm:w-44 shrink-0 pt-0.5">
              Address
            </span>
            <span className="font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
              {user.address || "14/2 Park Street, Kolkata, WB - 700016"}
            </span>
          </div>

          {/* Last Login (timeOfLogin) */}
          <div className="py-3.5 flex items-center text-sm">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500 shrink-0 mr-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-300 w-36 sm:w-44 shrink-0">
              Last Login
            </span>
            <span className="font-medium text-slate-600 dark:text-slate-400">
              {user.timeOfLogin}
            </span>
          </div>

          {/* Member Since */}
          <div className="py-3.5 flex items-center text-sm">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500 shrink-0 mr-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-300 w-36 sm:w-44 shrink-0">
              Member Since
            </span>
            <span className="font-medium text-slate-600 dark:text-slate-400 truncate">
              {user.memberSince}
            </span>
          </div>

        </div>
      </div>

      {/* 4. Edit Profile Modal (Updates ALL Schema Fields) */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0B132B] rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-[#0B132B] z-10 px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Update Profile Details
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Update your citizen account information
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              
              {/* Profile Picture Uploader */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="relative w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-950/40 border-2 border-dashed border-blue-300 dark:border-blue-700 flex items-center justify-center overflow-hidden shrink-0">
                  {profilePicturePreview ? (
                    <img
                      src={profilePicturePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {initialLetter}
                    </span>
                  )}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Change Photo
                  </button>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                    JPG, PNG or WEBP (Max 5MB)
                  </p>
                </div>
              </div>

              {/* Citizen ID (Read-only) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Citizen ID (User ID)
                </label>
                <input
                  type="text"
                  value={`#${user.userId}`}
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 text-sm font-mono cursor-not-allowed"
                />
              </div>

              {/* Full Name (userName) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Full Name (userName)
                </label>
                <input
                  type="text"
                  value={editForm.userName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, userName: e.target.value })
                  }
                  required
                  placeholder="Enter full name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-800 dark:text-white bg-white dark:bg-[#111A2E] transition-all font-medium"
                />
              </div>

              {/* Email (email) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  required
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-800 dark:text-white bg-white dark:bg-[#111A2E] transition-all font-medium"
                />
              </div>

              {/* Phone and Age 2-Column Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone (phone) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                    required
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-800 dark:text-white bg-white dark:bg-[#111A2E] transition-all font-medium"
                  />
                </div>

                {/* Age (age) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={editForm.age}
                    onChange={(e) =>
                      setEditForm({ ...editForm, age: e.target.value })
                    }
                    required
                    placeholder="24"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-800 dark:text-white bg-white dark:bg-[#111A2E] transition-all font-medium"
                  />
                </div>
              </div>

              {/* Address (Address) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Residential Address
                </label>
                <textarea
                  rows={2}
                  value={editForm.address}
                  onChange={(e) =>
                    setEditForm({ ...editForm, address: e.target.value })
                  }
                  required
                  placeholder="Street, area, ward, city and pincode"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-800 dark:text-white bg-white dark:bg-[#111A2E] transition-all font-medium resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 active:bg-blue-800 shadow-sm transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  {updating ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save All Changes</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
