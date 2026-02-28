'use client'

import { useState, useEffect, Suspense, useRef, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Navbar from '../components/components/Navbar.js'
import Footer from '../components/components/Footer.js'
import PanoramicViewer from '../components/components/PanoramicViewer.js'
import Link from 'next/link'
import LocationPicker from '../components/components/LocationPicker.js'
import authApi from '@/lib/api.js'

function AddReportContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const verified = searchParams.get('verified')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    coordinates: '22.563282, 88.351286',
    buildingName: '',
    streetName: '',
    locality: '',
    propertyType: '',
    uploadedImage: '',
    severity: '',
    useCurrentLocation: false
  })

  // Map related state
  const [map, setMap] = useState(null)
  const [marker, setMarker] = useState(null)
  const [showFullMap, setShowFullMap] = useState(false)
  const [googleMaps, setGoogleMaps] = useState(null) // Store Google Maps instance
  const mapRef = useRef(null)
  const fullMapRef = useRef(null)

  // Rest of your existing state variables...
  const issueCategories = [
    'Waste Management & Sanitation',
    'Water Supply & Drainage',
    'Road & Transport Issues',
    'Streetlight & Public Utility Maintenance',
    'Public Health & Stray Animal Issues',
    'Pollution & Environmental Issues',
    'Housing & Infrastructure Issues',
    'Accountability & Technology Gaps'
  ]

  const issueSeverity = [
    'High',
    'Medium',
    'Low'
  ]

  const [reporterDetails, setReporterDetails] = useState({
    fullName: '',
    age: '',
    address: '',
    emailId: '',
    phoneNumber: ''
  })

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authApi.getProfile();
        if (response && response.user) {
          const user = response.user;
          setReporterDetails({
            fullName: user.userName || '',
            age: user.age || '',
            address: user.Address || '',
            emailId: user.email || '',
            phoneNumber: user.phone ? `+91 ${user.phone}` : '+91 ',
          });
          setOriginalEmail(user.email || '');
          setIsEmailVerified(true); // Assume fetched email is already verified
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        toast.error("Could not load your profile data.");
      }
    };
    fetchUser();
  }, []);


  const [isEditing, setIsEditing] = useState(false)
  const [errors, setErrors] = useState({})
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [panoramicImage, setPanoramicImage] = useState('')
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [originalEmail, setOriginalEmail] = useState('chhotabheem@email.com')
  const [hasEmailChanged, setHasEmailChanged] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verification, setVerification] = useState(true)

  const handleLocationChange = useCallback((locationData) => {
    setFormData(prev => ({
      ...prev,
      ...locationData
    }));
  }, []);


  // Initialize Google Maps after it's loaded

  // Parse coordinates from string to object
  const parseCoordinates = (coordString) => {
    if (!coordString) return { lat: 19.0760, lng: 72.8777 }

    const parts = coordString.split(',')
    if (parts.length !== 2) return { lat: 19.0760, lng: 72.8777 }

    const lat = parseFloat(parts[0].trim())
    const lng = parseFloat(parts[1].trim())

    if (isNaN(lat) || isNaN(lng)) return { lat: 19.0760, lng: 72.8777 }

    return { lat, lng }
  }

  // Update map when coordinates change
  useEffect(() => {
    if (formData.coordinates && map && marker) {
      const coords = parseCoordinates(formData.coordinates)
      marker.setPosition(coords)
      map.setCenter(coords)
    }
  }, [formData.coordinates, map, marker])

  // Check if email was verified when returning from verification page
  useEffect(() => {
    if (verified === 'true') {
      setIsEmailVerified(true)
      // Clean up the URL parameter
      router.replace('/add-report')
    }
  }, [verified, router])

  // Handle using current location

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhoneNumber = (phone) => {
    // Check if it starts with +91 and has exactly 10 digits after it
    const phoneRegex = /^\+91\s\d{10}$/
    return phoneRegex.test(phone)
  }

  const handlePhoneNumberChange = (value) => {
    // If the user is clearing the field completely, just set it to +91 with space
    if (value === '' || value === '+91' || value === '+91 ') {
      setReporterDetails(prev => ({ ...prev, phoneNumber: '+91 ' }))
      return
    }

    // Remove all non-digit characters except + and space
    const cleaned = value.replace(/[^\d+]/g, '')

    // Ensure it starts with +91
    let formatted = '+91'

    // Add digits after +91, limiting to 10 digits
    const digits = cleaned.replace('+91', '').replace(/\s/g, '').slice(0, 10)

    if (digits.length > 0) {
      formatted += ' ' + digits
    } else {
      // If no digits, just show +91 with a space
      formatted += ' '
    }

    setReporterDetails(prev => ({ ...prev, phoneNumber: formatted }))
  }

  const validateReporterDetails = () => {
    const newErrors = {}

    if (!reporterDetails.fullName.trim()) {
      newErrors.fullName = 'Please add full name'
    }
    if (!reporterDetails.emailId.trim()) {
      newErrors.emailId = 'Please add email ID'
    } else if (!validateEmail(reporterDetails.emailId)) {
      newErrors.emailId = 'Please enter a valid email address'
    }
    if (!reporterDetails.address.trim()) {
      newErrors.address = 'Please add address'
    }
    if (!validatePhoneNumber(reporterDetails.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be +91 followed by 10 digits'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveChanges = () => {
    if (validateReporterDetails()) {
      // Check if email has changed and needs verification
      if (hasEmailChanged && !isEmailVerified) {
        alert('Please verify your new email address before saving changes')
        return
      }

      setIsEditing(false)
      setErrors({})
      // Update original email if verification was successful
      if (isEmailVerified) {
        setOriginalEmail(reporterDetails.emailId)
        setHasEmailChanged(false)
      }
    }
  }

  const handleCancelEdit = () => {
    // Reset to original values if email was changed but not verified
    if (hasEmailChanged && !isEmailVerified) {
      setReporterDetails(prev => ({ ...prev, emailId: originalEmail }))
      setHasEmailChanged(false)
      setIsEmailVerified(false)
    }
    setIsEditing(false)
    setErrors({})
  }

  const handleEmailChange = (email) => {
    setReporterDetails(prev => ({ ...prev, emailId: email }))

    // Check if email has changed from original
    if (email !== originalEmail) {
      setHasEmailChanged(true)
      setIsEmailVerified(false)
    } else {
      setHasEmailChanged(false)
      setIsEmailVerified(true)
    }
  }

  const handleVerifyEmail = () => {
    if (!validateEmail(reporterDetails.emailId)) {
      setErrors(prev => ({ ...prev, emailId: 'Please enter a valid email address first' }))
      return
    }

    // Redirect to pincode verification page
    router.push(`/verify-email?email=${encodeURIComponent(reporterDetails.emailId)}`)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.uploadedImage) {
      alert("Please provide media evidence (panorama or video) to submit the report.");
      return;
    }

    // Basic form validations (unchanged)
    if (!formData.title.trim()) {
      alert("Please select a category for the issue");
      return;
    }
    if (!formData.description.trim()) {
      alert("Please enter a description for the issue");
      return;
    }
    if (!validateReporterDetails()) {
      return;
    }
    if (hasEmailChanged && !isEmailVerified) {
      alert("Please verify your new email address before submitting the report");
      return;
    }

    // --- 1. AI IMAGE VERIFICATION ON SUBMIT ---
    if (formData.uploadedImage && formData.title) {
      setIsVerifying(true);
      try {
        const verificationRes = await fetch('/api/verify-image-category', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageUrl: formData.uploadedImage,
            category: formData.title,
          }),
        });

        // if (!verificationRes.ok) {
        //   throw new Error('Image verification service failed.');
        // }

        const verificationData = await verificationRes.json() || [];
        console.log(verificationData.isMatch);
        if (!verificationData.isMatch) {
          setIsVerifying(false);
          setVerification(false)
        }
      } catch (err) {
        console.error("Verification error:", err);
        setIsVerifying(false);
        return; // Stop submission on error
      }
    }
    // --- END OF VERIFICATION BLOCK ---

    // --- 2. PROCEED WITH SUBMISSION IF VERIFICATION PASSED ---
    try {
      let locationCoordinates = [];
      if (formData.coordinates) {
        const [lat, lng] = formData.coordinates.split(",").map(v => parseFloat(v.trim()));
        if (!isNaN(lat) && !isNaN(lng)) {
          locationCoordinates = [lng, lat];
        }
      }

      const payload = {
        Title: formData.title,
        Description: formData.description,
        building: formData.buildingName,
        street: formData.streetName,
        locality: formData.locality,
        propertyType: formData.propertyType,
        reporterId: reporterDetails.emailId,
        ReporterName: reporterDetails.fullName,
        locationCoordinates,
        image: formData.uploadedImage,
        severity: formData.severity,
        verified: verification,
      };

      const res = await authApi.submitReport(payload);

      if (!res.ok) {
        throw new Error("Failed to submit report");
      }

      await res.json();
      alert("Issue reported successfully!");

      // Reset form
      setFormData({
        title: "", description: "", coordinates: "", buildingName: "", severity: "",
        streetName: "", locality: "", propertyType: "", uploadedImage: "", useCurrentLocation: false,
      });
      // ... reset other states
    } catch (err) {
      console.error("Error submitting report:", err);
      alert("There was an error submitting your report. Please try again.");
    } finally {
      // Ensure verification state is always reset
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen  bg-gray-50 text-slate-500">
      <Navbar />
      <main className="lg:ml-64 max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12 pb-20">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Report An Issue</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Panoramic Image Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Add Panoramic View
              </label>
              <PanoramicViewer
                imageSrc={formData.uploadedImage}
                // This correctly saves the URL to the right state. No changes needed.
                onImageCaptured={(url) => setFormData(prev => ({ ...prev, uploadedImage: url }))}
              />
            </div>

            {/* Issue Details */}
            <div className="space-y-10">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Category *
                </label>
                <select
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="" className="text-gray-500">Select an issue category</option>
                  {issueCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="Severity" className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Severity * <span className='text-red-500'>Wrong or Misleading data will directly result into Rejection of issue</span>
                </label>
                <select
                  id="Severity"
                  value={formData.severity}
                  onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="" className="text-gray-500">Select an issue Severity</option>
                  {issueSeverity.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-500"
                  placeholder="Describe the issue in detail"
                  required
                />
              </div>
            </div>

            {/* Location Section with Map */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="mb-4">
                <LocationPicker onLocationChange={handleLocationChange} />
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={formData.coordinates}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 placeholder:text-gray-500"
                  placeholder="Coordinates (auto-filled by map)"
                />

                <input
                  type="text"
                  value={formData.propertyType}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 placeholder:text-gray-500"
                  placeholder="Property Type (auto-filled by map)"
                />

                <input
                  type="text"
                  value={formData.buildingName}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 placeholder:text-gray-500"
                  placeholder="Building Name (auto-filled by map)"
                />

                <input
                  type="text"
                  value={formData.streetName}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 placeholder:text-gray-500"
                  placeholder="Street Name (auto-filled by map)"
                />

                <input
                  type="text"
                  value={formData.locality}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 placeholder:text-gray-500"
                  placeholder="Locality (auto-filled by map)"
                />
              </div>
            </div>

            {/* Reporter Details Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Details of Reporter</h2>
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center space-x-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={handleSaveChanges}
                      className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={reporterDetails.fullName}
                    onChange={(e) => setReporterDetails(prev => ({ ...prev, fullName: e.target.value }))}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'} ${errors.fullName ? 'border-red-500' : ''}`}
                    required
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    value={reporterDetails.age}
                    onChange={(e) => setReporterDetails(prev => ({ ...prev, age: e.target.value }))}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'}`}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    value={reporterDetails.address}
                    onChange={(e) => setReporterDetails(prev => ({ ...prev, address: e.target.value }))}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'} ${errors.address ? 'border-red-500' : ''}`}
                    required
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email ID *
                  </label>
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <input
                        type="email"
                        value={reporterDetails.emailId}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        disabled={!isEditing}
                        className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-500 ${isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'} ${errors.emailId ? 'border-red-500' : ''}`}
                        placeholder="Enter email ID"
                        required
                      />
                      {isEditing && !isEmailVerified && (
                        <button
                          type="button"
                          onClick={handleVerifyEmail}
                          className="px-3 py-2 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 whitespace-nowrap"
                        >
                          Verify Email
                        </button>
                      )}
                    </div>
                    {isEmailVerified && (
                      <div className="flex items-center space-x-2 text-yellow-600 text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        <span>Email verified</span>
                      </div>
                    )}
                  </div>
                  {errors.emailId && (
                    <p className="text-red-500 text-sm mt-1">{errors.emailId}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={reporterDetails.phoneNumber}
                    onChange={(e) => handlePhoneNumberChange(e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-500 ${isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'} ${errors.phoneNumber ? 'border-red-500' : ''}`}
                    placeholder="+91 1234567890"
                    required
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Format: +91 followed by 10 digits</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Link
                href="/"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={!formData.uploadedImage}
                className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Submit Report
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default function AddReportPage() {
  return (
    <Suspense fallback={null}>
      <AddReportContent />
    </Suspense>
  )
}