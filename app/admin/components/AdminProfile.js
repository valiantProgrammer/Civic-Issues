'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { authApi } from '@/lib/api';

const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const InfoField = ({ icon, label, value, isEditing, onEdit, isReadOnly = false }) => (
  <div className="mb-6">
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <div className="flex items-center gap-3">
      <span className="text-gray-500">{icon}</span>
      {isEditing && !isReadOnly ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onEdit(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-gray-900"
        />
      ) : (
        <p className="flex-1 text-gray-900 font-medium">{value || 'N/A'}</p>
      )}
    </div>
  </div>
);

export default function AdminProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    phone: '',
    email: '',
    address: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user-profile', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success && data.user) {
        setProfile(data.user);
        setFormData({
          fullName: data.user.fullName || '',
          age: data.user.age || '',
          phone: data.user.phone || '',
          email: data.user.email || '',
          address: data.user.address || '',
        });
        if (data.user.profilePicture) {
          setProfilePicturePreview(data.user.profilePicture);
        }
      } else {
        toast.error(data.message || 'Failed to fetch profile');
      }
    } catch (error) {
      toast.error('Failed to load profile');
      console.error('Profile fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicturePreview(reader.result);
      setProfilePicture(file);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      const data = new FormData();
      data.append('fullName', formData.fullName);
      data.append('age', formData.age);
      data.append('phone', formData.phone);
      if (profilePicture) {
        data.append('profilePicture', profilePicture);
      }

      const response = await fetch('/api/user-profile', {
        method: 'PUT',
        credentials: 'include',
        body: data,
      });

      const result = await response.json();

      if (result.success) {
        setProfile(result.user);
        setIsEditing(false);
        setProfilePicture(null);
        toast.success('Profile updated successfully!');
      } else {
        toast.error(result.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to save profile');
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-orange-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <p className="text-red-600 text-center">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="h-32 bg-gradient-to-r from-orange-500 to-orange-400"></div>

      <div className="px-6 py-8">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center -mt-20 mb-8">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
              {profilePicturePreview ? (
                <img src={profilePicturePreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl text-white font-bold">
                  {profile.fullName?.[0]?.toUpperCase() || 'A'}
                </span>
              )}
            </div>
            {isEditing && (
              <label htmlFor="profilePictureInput" className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full cursor-pointer hover:bg-orange-600 transition">
                <CameraIcon />
                <input
                  id="profilePictureInput"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900 text-center">{profile.fullName}</h2>
          <p className="text-gray-500">Admin Account</p>
        </div>

        {/* Form Fields */}
        <div className="max-w-2xl mx-auto space-y-6 mb-8">
          <InfoField
            icon={<MailIcon />}
            label="Email Address"
            value={formData.email}
            isEditing={false}
            isReadOnly={true}
          />

          <InfoField
            icon={<PhoneIcon />}
            label="Phone Number"
            value={formData.phone}
            isEditing={isEditing && false}
            onEdit={(value) => handleInputChange('phone', value)}
            isReadOnly={true}
          />

          <InfoField
            icon={<span>👤</span>}
            label="Full Name"
            value={formData.fullName}
            isEditing={isEditing}
            onEdit={(value) => handleInputChange('fullName', value)}
          />

          <InfoField
            icon={<span>🎂</span>}
            label="Age"
            value={formData.age}
            isEditing={isEditing}
            onEdit={(value) => handleInputChange('age', value)}
          />

          <InfoField
            icon={<span>📍</span>}
            label="Address"
            value={formData.address}
            isEditing={isEditing}
            onEdit={(value) => handleInputChange('address', value)}
          />
        </div>

        {/* Edit/Save Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-8 py-2.5 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-lg font-semibold hover:shadow-lg transition"
            >
              ✏️ Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleSaveChanges}
                disabled={saving}
                className="px-8 py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition"
              >
                {saving ? 'Saving...' : '✓ Save Changes'}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setProfilePicture(null);
                  setProfilePicturePreview(profile.profilePicture || null);
                  setFormData({
                    fullName: profile.fullName || '',
                    age: profile.age || '',
                    phone: profile.phone || '',
                    email: profile.email || '',
                    address: profile.address || '',
                  });
                }}
                className="px-8 py-2.5 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
