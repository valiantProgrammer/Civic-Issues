'use client';

import { useState, useEffect } from 'react';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

// Icons
const MailIcon = () => (
  <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 00.948.684l1.498 4.493a1 1 0 00.502.756l2.73 1.365a1 1 0 001.27-1.27L13.596 9l2.068.567a1 1 0 00.756-.502l4.493-1.498a1 1 0 00.684-.948V5a2 2 0 00-2-2h-1" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CameraIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
  </svg>
);

const InfoField = ({ icon, label, value, isEditing = false, onChange = null, type = 'text' }) => (
  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <label className="text-sm font-medium text-slate-700">{label}</label>
    </div>
    {isEditing ? (
      <input
        type={type}
        value={value || ''}
        onChange={onChange}
        className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
    ) : (
      <p className="text-slate-900 font-semibold">{value || 'N/A'}</p>
    )}
  </div>
);

export default function AdminProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [formData, setFormData] = useState({});
  const [profilePictureFile, setProfilePictureFile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await authApi.getUserProfile();
      setProfile(response);
      setFormData(response);
      setProfilePictureUrl(response.profilePicture || null);
    } catch (error) {
      toast.error(`Failed to load profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      await handleSaveChanges();
    } else {
      setIsEditing(true);
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const updatedData = new FormData();
      
      // Add only editable form fields (exclude email and phone)
      Object.keys(formData).forEach(key => {
        if (key !== 'profilePicture' && key !== 'email' && key !== 'phone' && formData[key] !== profile[key]) {
          updatedData.append(key, formData[key]);
        }
      });

      // Add profile picture if changed
      if (profilePictureFile) {
        updatedData.append('profilePicture', profilePictureFile);
      }

      const response = await authApi.updateAdministrativeProfile(updatedData);
      setProfile(response);
      setIsEditing(false);
      setProfilePictureFile(null);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(`Failed to update profile: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      setProfilePictureFile(file);
      
      // Create temporary preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePictureUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-6">
        <p className="text-sm text-slate-500">Loading profile...</p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-6">
        <p className="text-sm text-slate-500">No profile data available.</p>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-slate-800">Admin Profile</h1>
      <p className="text-slate-500 mt-1">Manage your profile information and account settings.</p>
      
      <div className="w-full bg-white p-8 mt-8 rounded-xl shadow-md border border-slate-200">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center text-center border-b border-slate-200 pb-8">
          <div className="relative">
            <img 
              src={profilePictureUrl || `https://ui-avatars.com/api/?name=${formData.fullName || 'Admin'}&background=random&size=128`}
              alt="Profile Avatar"
              className="w-24 h-24 rounded-full object-cover ring-4 ring-orange-100"
            />
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-full cursor-pointer transition-colors">
                <CameraIcon />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          
          <h2 className="mt-4 text-2xl font-bold text-slate-900">{formData.fullName || 'Admin'}</h2>
          <p className="text-slate-600">{formData.designation || 'Administrative Head'}</p>
          {isEditing && profilePictureFile && (
            <p className="text-xs text-orange-600 mt-2">✓ Profile picture updated</p>
          )}
        </div>

        {/* Profile Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <InfoField
            icon={<BuildingIcon />}
            label="Full Name"
            value={formData.fullName}
            isEditing={isEditing}
            onChange={(e) => handleFieldChange('fullName', e.target.value)}
          />
          
          <InfoField
            icon={<MailIcon />}
            label="Email Address"
            value={formData.email}
            isEditing={false}
            type="email"
          />
          
          <InfoField
            icon={<PhoneIcon />}
            label="Phone Number"
            value={formData.phone}
            isEditing={false}
            type="tel"
          />
          
          <InfoField
            icon={<BuildingIcon />}
            label="Age"
            value={formData.age}
            isEditing={isEditing}
            onChange={(e) => handleFieldChange('age', e.target.value)}
            type="number"
          />
          
          <InfoField
            icon={<BuildingIcon />}
            label="Designation"
            value={formData.designation}
            isEditing={isEditing}
            onChange={(e) => handleFieldChange('designation', e.target.value)}
          />
          
          <InfoField
            icon={<ShieldIcon />}
            label="Authority Level"
            value={formData.authority}
            isEditing={isEditing}
            onChange={(e) => handleFieldChange('authority', e.target.value)}
          />
          
          <InfoField
            icon={<BuildingIcon />}
            label="Municipality"
            value={formData.municipality}
            isEditing={isEditing}
            onChange={(e) => handleFieldChange('municipality', e.target.value)}
          />
          
          <InfoField
            icon={<BuildingIcon />}
            label="User ID"
            value={formData.userId}
            isEditing={false}
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={handleEditToggle}
            disabled={isSaving}
            className={`w-full py-2.5 px-5 font-semibold rounded-lg transition-colors ${
              isEditing
                ? 'bg-green-600 hover:bg-green-700 text-white disabled:bg-green-400'
                : 'bg-orange-600 hover:bg-orange-700 text-white disabled:bg-orange-400'
            }`}
          >
            {isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
          
          {isEditing && (
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData(profile);
                setProfilePictureUrl(profile.profilePicture || null);
                setProfilePictureFile(null);
              }}
              className="w-full py-2.5 px-5 font-semibold rounded-lg bg-slate-200 text-slate-800 hover:bg-slate-300 transition-colors"
            >
              Cancel
            </button>
          )}
          
          <button className="w-full py-2.5 px-5 font-semibold rounded-lg bg-slate-200 text-slate-800 hover:bg-slate-300 transition-colors">
            Change Password
          </button>
        </div>
      </div>
    </main>
  );
}
