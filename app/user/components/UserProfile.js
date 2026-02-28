"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import LocationPicker from "./components/LocationPicker";

// Add custom styles for the edit button
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

  .detail-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
  }

  .detail-value {
    font-size: 0.95rem;
    font-weight: 500;
    color: #1f2937;
    word-break: break-word;
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

  .icon-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 6px;
    font-size: 0.875rem;
  }
`;

export default function UserProfile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState({ phone: "", address: "", lat: "", lng: "" });
    const [updating, setUpdating] = useState(false);
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
                    setEditData({
                        phone: data.user.phone || "",
                        address: data.user.address || "",
                        lat: "",
                        lng: "",
                    });
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

    const handleLocationChange = (locationData) => {
        setEditData((prev) => ({
            ...prev,
            address: locationData.address,
            lat: locationData.lat,
            lng: locationData.lng,
        }));
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
            const response = await fetch("/api/user-profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    phone: editData.phone,
                    address: editData.address,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || "Failed to update profile");
                return;
            }

            if (data.success) {
                setUser(data.user);
                setShowEditModal(false);
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
        <>
            <style>{editButtonStyles}</style>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">

                {/* Profile Card */}
                <div className="bg-white rounded-lg shadow-2xl overflow-hidden pb-8 relative">
                    {/* Account Type Badge */}
                    <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                        Standard User
                    </div>

                    {/* Header Background */}
                    <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

                    {/* Profile Content */}
                    <div className="px-6 flex justify-evenly">
                        {/* Profile Picture and Name */}
                        <div className="flex flex-col items-center -mt-16 mb-6">
                            <div className="w-full">
                                <div className="w-32 h-32 bg-gradient-to-br from-blue-300 to-indigo-400 rounded-full border-4 border-white shadow-lg flex items-center justify-center mb-4">
                                    <span className="text-4xl text-white font-bold">
                                        {user.userName?.charAt(0)?.toUpperCase() || "U"}
                                    </span>
                                </div>
                                <div className="text-center">
                                    <h1 className="text-3xl font-bold text-gray-800">
                                        {user.userName || "User"}
                                    </h1>
                                    <p className="text-gray-500">User Profile</p>
                                </div>
                            </div>

                        </div>

                        {/* Profile Details */}
                        <div className="space-y-3 my-3 w-80">
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

                        {/* Action Buttons */}
                    </div>
                    <div className="mt-8 flex gap-4 flex-col sm:flex-row mx-4">
                        <button
                            onClick={() => setShowEditModal(true)}
                            className="edit-profile-btn flex-1 py-3 px-6 rounded-lg font-semibold text-lg"
                        >
                             Edit Profile
                        </button>
                    </div>
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
                                        Address (Pick from Map)
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

