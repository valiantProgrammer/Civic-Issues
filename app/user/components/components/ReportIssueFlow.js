'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import ReportSubmissionSuccessCard from './ReportSubmissionSuccessCard';

// Dynamically import interactive map location picker
const ReportLocationPicker = dynamic(() => import('./ReportLocationPicker'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[280px] sm:h-[320px] rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xs text-slate-400">
      Loading OpenFreeMap...
    </div>
  ),
});

export default function ReportIssueFlow({ onCancel, onComplete }) {
  const router = useRouter();
  const fileInputRef = useRef(null);

  // Stepper state: 1: Evidence, 2: Category, 3: Location, 4: Details, 5: Review
  const [currentStep, setCurrentStep] = useState(1);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  // Form data matching Civic Saathi reporting schema
  const [uploadedImage, setUploadedImage] = useState('/images/street_issue_thumb.jpg');
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Road Damage & Potholes');
  const [locationData, setLocationData] = useState({
    street: 'BBD Bagh Avenue Road',
    ward: 'Ward 8',
    locality: 'Central Kolkata',
    coordinates: '22.563282, 88.351286',
  });
  const [details, setDetails] = useState({
    title: 'Severe Road Pothole near Junction',
    description: 'Deep road potholes after recent rainfall creating dangerous traffic bottleneck and accident risk.',
    severity: 'High',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step definitions
  const steps = [
    { id: 1, label: 'Evidence' },
    { id: 2, label: 'Category' },
    { id: 3, label: 'Location' },
    { id: 4, label: 'Details' },
    { id: 5, label: 'Review' },
  ];

  // Civic Categories
  const categories = [
    { id: 'road', name: 'Road Damage & Potholes', icon: '🛣️', color: 'from-amber-500/10 to-amber-500/5' },
    { id: 'light', name: 'Street Light Failure', icon: '💡', color: 'from-yellow-500/10 to-yellow-500/5' },
    { id: 'garbage', name: 'Garbage & Sanitation', icon: '🗑️', color: 'from-emerald-500/10 to-emerald-500/5' },
    { id: 'water', name: 'Water Leakage & Drainage', icon: '🚰', color: 'from-blue-500/10 to-blue-500/5' },
    { id: 'health', name: 'Public Health & Stray Animals', icon: '🐾', color: 'from-rose-500/10 to-rose-500/5' },
    { id: 'pollution', name: 'Pollution & Tree Fall', icon: '🌳', color: 'from-teal-500/10 to-teal-500/5' },
    { id: 'footpath', name: 'Footpath Encroachment', icon: '🚶', color: 'from-purple-500/10 to-purple-500/5' },
    { id: 'other', name: 'Other Civic Hazards', icon: '⚠️', color: 'from-slate-500/10 to-slate-500/5' },
  ];

  // Handle file upload
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size exceeds 10MB limit');
        return;
      }
      const localUrl = URL.createObjectURL(file);
      setUploadedImage(localUrl);
      toast.success('Media evidence attached successfully');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size exceeds 10MB limit');
        return;
      }
      const localUrl = URL.createObjectURL(file);
      setUploadedImage(localUrl);
      toast.success('Media evidence attached successfully');
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setUploadedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    toast('Image removed');
  };

  const handleContinue = () => {
    if (currentStep === 1 && !uploadedImage) {
      toast.error('Please upload or keep a photo of the civic issue');
      return;
    }
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      if (onCancel) onCancel();
      else router.push('/user');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate submission or call API
      await new Promise((resolve) => setTimeout(resolve, 800));
      const generatedTicket = 'CIVIC-20261002-A72Q';
      setSubmittedTicket(generatedTicket);
      toast.success('Civic Issue Reported Successfully!');
    } catch {
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render success screen matching reference image when submitted
  if (submittedTicket) {
    return (
      <div className="w-full py-8 flex items-center justify-center">
        <ReportSubmissionSuccessCard
          ticketId={submittedTicket}
          onTrackReport={(tid) => {
            if (onComplete) onComplete(tid);
            else router.push('/user?tab=reports');
          }}
          onBackHome={() => {
            if (onCancel) onCancel();
            else router.push('/user');
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-full font-sans space-y-6 pb-10">
      {/* 1. Top Stepper matching the design */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-4 sm:mb-6">
        {steps.map((step) => {
          const isActive = currentStep === step.id;
          const isPassed = currentStep > step.id;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => setCurrentStep(step.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-600/20'
                  : isPassed
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-white text-slate-500 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              <span
                className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full text-[11px] font-bold flex items-center justify-center ${
                  isActive
                    ? 'bg-white text-blue-600'
                    : isPassed
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {step.id}
              </span>
              <span>{step.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Main Card matching reference picture */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xs border border-slate-200/90 transition-all w-full">
        
        {/* Step 1: Evidence (Exact Reference Screenshot Layout) */}
        {currentStep === 1 && (
          <div>
            <div className="mb-6">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Upload Photos or Videos
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Capture the issue clearly to help faster resolution.
              </p>
            </div>

            {/* Layout: Upload Zone on Left, Preview Card on Right */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
              
              {/* Left Dropzone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`md:col-span-8 border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[220px] ${
                  isDragOver
                    ? 'border-blue-500 bg-blue-50/60'
                    : 'border-blue-200 bg-blue-50/20 hover:bg-blue-50/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* Blue Cloud Icon matching the image */}
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mb-3 shadow-md shadow-blue-500/20">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.5 19H6.5C4.01 19 2 16.99 2 14.5C2 12.19 3.73 10.28 6.01 10.03C6.54 6.64 9.47 4 13 4C16.14 4 18.8 6.13 19.64 9.07C21.57 9.45 23 11.13 23 13.17C23 15.54 21.09 17.47 18.73 17.5"
                      fill="none"
                    />
                    <path
                      d="M19.35 10.04C18.67 6.59 15.64 4 12 4C9.11 4 6.6 5.64 5.35 8.04C2.34 8.36 0 10.91 0 14C0 17.31 2.69 20 6 20H19C21.76 20 24 17.76 24 15C24 12.36 21.95 10.22 19.35 10.04ZM13 13V17H11V13H8L12 8L16 13H13Z"
                      fill="white"
                    />
                  </svg>
                </div>

                <span className="font-bold text-slate-800 text-sm">
                  Drag & drop files here
                </span>
                <span className="text-xs text-slate-400 mt-0.5">
                  or click to upload
                </span>
                <span className="text-[11px] text-slate-400 mt-2 font-medium">
                  Supports images and videos (Max 10MB)
                </span>
              </div>

              {/* Right Preview Card (as in screenshot) */}
              <div className="md:col-span-4 flex items-center justify-center">
                {uploadedImage ? (
                  <div className="relative w-full max-w-[280px] aspect-[3/4] rounded-2xl overflow-hidden border border-slate-200 shadow-md group">
                    <Image
                      src={uploadedImage}
                      alt="Uploaded civic evidence"
                      fill
                      className="object-cover object-center"
                    />

                    {/* Dark gradient for legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

                    {/* Delete button (X circle) in top-right */}
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="w-6 h-6 rounded-full bg-slate-900/80 hover:bg-slate-950 text-white flex items-center justify-center absolute top-2 right-2 shadow-md cursor-pointer transition-transform hover:scale-110"
                      title="Remove image"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>

                    <div className="absolute bottom-2 left-2 right-2 text-[10px] text-white font-medium bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md text-center truncate">
                      Evidence Attached
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full max-w-[280px] aspect-[3/4] rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-center p-3 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <span className="text-2xl mb-1">📷</span>
                    <span className="text-xs font-semibold text-slate-500">No media yet</span>
                    <span className="text-[10px] text-slate-400 mt-1">Click to attach photo</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Category Selection */}
        {currentStep === 2 && (
          <div>
            <div className="mb-6">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Select Category
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Choose the civic domain that best matches your issue.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.name;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-600/30'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-2xl w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                      {cat.icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-slate-900">{cat.name}</div>
                      <div className="text-[11px] text-slate-500">Verified by Municipal Dept</div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                        ✓
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Location with Interactive Map */}
        {currentStep === 3 && (
          <div>
            <div className="mb-4">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Issue Location
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Pinpoint the exact civic hazard on the map or use GPS.
              </p>
            </div>

            <div className="space-y-4">
              {/* Interactive OpenFreeMap Location Picker with Draggable Pin */}
              <ReportLocationPicker
                initialLng={88.351286}
                initialLat={22.563282}
                onLocationChange={(loc) => {
                  setLocationData((prev) => ({
                    ...prev,
                    coordinates: loc.coordinates,
                    ward: loc.ward || prev.ward,
                    street: loc.street || prev.street,
                  }));
                }}
              />

              {/* Editable Street / Ward Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Street / Landmark
                  </label>
                  <input
                    type="text"
                    value={locationData.street}
                    onChange={(e) => setLocationData({ ...locationData, street: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ward Number
                  </label>
                  <input
                    type="text"
                    value={locationData.ward}
                    onChange={(e) => setLocationData({ ...locationData, ward: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Details */}
        {currentStep === 4 && (
          <div>
            <div className="mb-6">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Provide Details
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Add an issue title and description.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Issue Title
                </label>
                <input
                  type="text"
                  value={details.title}
                  onChange={(e) => setDetails({ ...details, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Broken streetlight on main road"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Detailed Description
                </label>
                <textarea
                  rows={3}
                  value={details.description}
                  onChange={(e) => setDetails({ ...details, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Explain the problem and severity to assist field engineers..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Severity Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { level: 'Low', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
                    { level: 'Medium', color: 'text-amber-700 bg-amber-50 border-amber-200' },
                    { level: 'High', color: 'text-rose-700 bg-rose-50 border-rose-200' },
                  ].map((s) => (
                    <button
                      key={s.level}
                      type="button"
                      onClick={() => setDetails({ ...details, severity: s.level })}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        details.severity === s.level
                          ? `${s.color} ring-2 ring-blue-500/20 shadow-sm`
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {s.level} Priority
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {currentStep === 5 && (
          <div>
            <div className="mb-6">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Review Report
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Verify the details before sending to the municipal resolution team.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-4">
              <div className="flex items-center gap-4">
                {uploadedImage && (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                    <Image src={uploadedImage} alt="Preview" fill className="object-cover" />
                  </div>
                )}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-100/70 px-2 py-0.5 rounded-md">
                    {selectedCategory}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mt-1">{details.title}</h3>
                  <p className="text-xs text-slate-500">{locationData.ward} • {locationData.street}</p>
                </div>
              </div>

              <div className="text-xs text-slate-600 leading-relaxed border-t border-slate-200 pt-3">
                {details.description}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-200 pt-3">
                <span>Severity: <strong className="text-slate-800">{details.severity}</strong></span>
                <span>Coordinates: <strong className="text-slate-800">{locationData.coordinates}</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* 3. Bottom Action Buttons matching the reference picture */}
        <div className="flex items-center justify-between mt-8 pt-5 border-t border-slate-100">
          <button
            type="button"
            onClick={handleBack}
            className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </button>

          <button
            type="button"
            onClick={handleContinue}
            disabled={isSubmitting}
            className="px-7 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold text-sm shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-70"
          >
            {isSubmitting ? (
              <span>Submitting...</span>
            ) : currentStep === 5 ? (
              'Submit Report'
            ) : (
              <>
                <span>Continue</span>
                <span className="text-base leading-none">→</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
