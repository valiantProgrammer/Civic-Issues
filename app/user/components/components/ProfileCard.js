"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import LocationPicker from "./LocationPicker";

const editButtonStyles = `
  .edit-profile-btn {
    background-color: white;
    border: 2px solid #d1d5db;
    color: #374151;
    position: relative;
    overflow: hidden;
    font-weight: 600;
    font-size: 1.125rem;
    z-index: 1;
  }

  .edit-profile-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #a855f7 0%, #ec4899 100%);
    transform: translateX(-100%);
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: -1;
  }

  .edit-profile-btn:hover::before {
    transform: translateX(0);
  }

  .edit-profile-btn:hover {
    color: white;
    border-color: #a855f7;
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(168, 85, 247, 0.5);
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .profile-detail-card {
    padding: 12px 0;
    border-bottom: 1px solid rgba(199, 210, 254, 0.3);
  }

  .profile-detail-card:last-child {
    border-bottom: none;
  }

  .copy-button {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    background: rgba(168, 85, 247, 0.1);
    border: 1px solid rgba(168, 85, 247, 0.3);
    border-radius: 6px;
    color: #a855f7;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-left: 8px;
  }

  .copy-button:hover {
    background: rgba(168, 85, 247, 0.2);
    border-color: rgba(168, 85, 247, 0.5);
  }
`;

export default function ProfileCard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({ phone: "", address: "", lat: "", lng: "", profilePicture: null });
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [updating, setUpdating] = useState(false);

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
          return;
        }

        if (data.success) {
          setUser(data.user);
          setEditData({
            phone: data.user.phone || "",
            address: data.user.address || "",
            lat: "",
            lng: "",
            profilePicture: null,
          });
          if (data.user.profilePicture) {
            setProfilePicturePreview(data.user.profilePicture);
          }
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
  }, []);

  const handleLocationChange = (locationData) => {
    setEditData((prev) => ({
      ...prev,
      address: locationData.address,
      lat: locationData.lat,
      lng: locationData.lng,
    }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicturePreview(reader.result);
      setEditData((prev) => ({
        ...prev,
        profilePicture: file,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleCopyUserId = async () => {
    const userIdText = user.userId || "N/A";
    try {
      await navigator.clipboard.writeText(userIdText);
      toast.success("User ID copied to clipboard!", { position: "top-right", duration: 3000 });
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy User ID", { position: "top-right" });
    }
  };

  const handleUpdateProfile = async () => {
    if (!editData.phone || !editData.address) {
      toast.error("Please fill in all fields");
      return;
    }

    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append('phone', editData.phone);
      formData.append('address', editData.address);
      if (editData.profilePicture) {
        formData.append('profilePicture', editData.profilePicture);
      }

      const response = await fetch("/api/user-profile", {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to update profile");
        return;
      }

      if (data.success) {
        setUser(data.user);
        setShowEditModal(false);
        if (data.user.profilePicture) {
          setProfilePicturePreview(data.user.profilePicture);
        }
        toast.success("Profile updated successfully!");
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-xl p-8">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-xl p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-xl p-8">
        <p className="text-gray-600 text-lg">No user data available</p>
      </div>
    );
  }

  return (
    <>
      <style>{editButtonStyles}</style>
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Account Type Badge */}

        {/* Header Background */}
        <div className="h-32 bg-gradient-to-r from-purple-500 to-purple-600">
          <div className="relative top-1/6 w-fit left-5/6 z-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
            Standard User
          </div>

        </div>

        {/* Profile Content */}
        <div className="px-6 py-8 flex justify-around">
          {/* Profile Avatar and Name */}
          <div className="flex flex-col items-center -mt-16 mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-300 to-indigo-400 rounded-full border-4 border-white shadow-lg flex items-center justify-center mb-4 overflow-hidden">
              {profilePicturePreview ? (
                <img src={profilePicturePreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl text-white font-bold">
                  {user.userName?.charAt(0)?.toUpperCase() || "U"}
                </span>
              )}
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800">
                {user.userName || "User"}
              </h1>
              <p className="text-gray-500">User Profile</p>
            </div>
            <div className="profile-detail-card">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">User ID</p>
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-gray-900 font-mono">
                  {user.userId || "N/A"}
                </p>
                <button
                  onClick={handleCopyUserId}
                  className="copy-button"
                  title="Click to copy User ID"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="space-y-3 mb-6 max-w-md">
            {/* Email */}
            <div className="profile-detail-card">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Email Address</p>
              <p className="text-lg font-medium text-gray-900">{user.email || "N/A"}</p>
            </div>

            {/* Phone */}
            <div className="profile-detail-card">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Phone Number</p>
              <p className="text-lg font-medium text-gray-900">
                {user.phone ? `+91 ${user.phone}` : "N/A"}
              </p>
            </div>

            {/* Age */}
            <div className="profile-detail-card">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Age</p>
              <p className="text-lg font-medium text-gray-900">{user.age || "N/A"} years</p>
            </div>

            {/* Address */}
            <div className="profile-detail-card">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Address</p>
              <p className="text-lg font-medium text-gray-900">
                {user.address || "N/A"}
              </p>
            </div>

            {/* User ID */}
            

            {/* Last Login */}
            {user.timeOfLogin && (
              <div className="profile-detail-card">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Last Login</p>
                <p className="text-base font-medium text-gray-900">
                  {new Date(user.timeOfLogin).toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* Edit Button */}
        </div>
          <div className="flex justify-center my-4">
            <button
              onClick={() => setShowEditModal(true)}
              className="edit-profile-btn py-3 px-8 rounded-lg font-semibold"
            >
               Edit Profile
            </button>
          </div>

        {/* Edit Profile Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto explorer-scrollbar">
              <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-white text-2xl hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Profile Picture Upload Section */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Profile Picture
                  </label>
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-gray-200 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center overflow-hidden mb-4">
                      {profilePicturePreview ? (
                        <img src={profilePicturePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      )}
                    </div>
                    <input
                      type="file"
                      id="profilePictureInput"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="profilePictureInput"
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer font-semibold transition"
                    >
                      Choose Image
                    </label>
                    <p className="text-xs text-gray-500 mt-2">Max 5MB, JPG/PNG</p>
                  </div>
                </div>

                {/* Phone Number Section */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    placeholder="Enter phone number"
                    className="w-full text-gray-900 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Address Section */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    📍 Address (Pick from Map)
                  </label>
                  <LocationPicker
                    onLocationChange={handleLocationChange}
                    initialCenter={{ lat: 22.5726, lng: 88.3639 }}
                  />
                  {editData.address && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Selected Address:</strong> {editData.address}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleUpdateProfile}
                    disabled={updating}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
                  >
                    {updating ? "Updating..." : "✓ Save Changes"}
                  </button>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
