'use client';

import React from 'react';
import Image from 'next/image';

export default function AdminDashboardView({
  reports = [],
  pendingCount = 38,
  verifiedCount = 21,
  rejectedCount = 6,
  escalatedCount = 4,
  onSelectReport,
  onVerifyReport,
  adminUser = { name: 'Admin Officer', image: null },
}) {
  // Sample recent reports matching the reference screenshot if API reports are few
  const defaultRecentReports = [
    {
      _id: 'sample-1',
      id: 'CIVIC-20261002-P81M',
      title: 'Pothole on Main Road',
      Title: 'Pothole on Main Road',
      ward: 'Ward 12',
      time: '2 hours ago',
      timeOfReporting: '2 hours ago',
      status: 'pending',
      image: '/images/street_issue_thumb.jpg',
      category: 'Road & Transport',
      description: 'Dangerous pothole on main transit corridor risking two-wheeler accidents.',
    },
    {
      _id: 'sample-2',
      id: 'CIVIC-20261002-G19K',
      title: 'Garbage Not Collected',
      Title: 'Garbage Not Collected',
      ward: 'Ward 5',
      time: '4 hours ago',
      timeOfReporting: '4 hours ago',
      status: 'pending',
      image: '/images/garbage_thumb.jpg',
      category: 'Sanitation',
      description: 'Overflowing commercial waste bin near street vegetable market.',
    },
    {
      _id: 'sample-3',
      id: 'CIVIC-20261002-W44L',
      title: 'Water Leakage',
      Title: 'Water Leakage',
      ward: 'Ward 8',
      time: '5 hours ago',
      timeOfReporting: '5 hours ago',
      status: 'pending',
      image: '/images/street_light_thumb.jpg',
      category: 'Water Works',
      description: 'Underground drinking water pipeline burst overflowing on sidewalk.',
    },
    {
      _id: 'sample-4',
      id: 'CIVIC-20261002-L72A',
      title: 'Broken Street Light',
      Title: 'Broken Street Light',
      ward: 'Ward 11',
      time: 'Yesterday',
      timeOfReporting: 'Yesterday',
      status: 'pending',
      image: '/images/street_light_thumb.jpg',
      category: 'Electrical',
      description: 'Street light bulb shattered near public park entrance.',
    },
  ];

  // Merge live API reports if available with sample list
  const displayReports = reports && reports.length > 0 ? reports.slice(0, 6) : defaultRecentReports;

  return (
    <div className="w-full space-y-6">
      
      {/* 1. Header Row */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review and verify citizen reports.
          </p>
        </div>

        {/* Admin Avatar on Right */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-sm border-2 border-white ring-2 ring-slate-100 overflow-hidden">
            {adminUser.image ? (
              <img
                src={adminUser.image}
                alt={adminUser.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>A</span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Top 4 Stat Metric Cards matching the reference screenshot */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1: Pending Review (Amber) */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm">
          <div className="text-3xl sm:text-4xl font-extrabold text-[#F97316] tracking-tight">
            {pendingCount}
          </div>
          <div className="text-xs font-semibold text-slate-400 mt-1">
            Pending Review
          </div>
        </div>

        {/* Card 2: Verified (Emerald Green) */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm">
          <div className="text-3xl sm:text-4xl font-extrabold text-[#10B981] tracking-tight">
            {verifiedCount}
          </div>
          <div className="text-xs font-semibold text-slate-400 mt-1">
            Verified
          </div>
        </div>

        {/* Card 3: Rejected (Rose Red) */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm">
          <div className="text-3xl sm:text-4xl font-extrabold text-[#EF4444] tracking-tight">
            {rejectedCount}
          </div>
          <div className="text-xs font-semibold text-slate-400 mt-1">
            Rejected
          </div>
        </div>

        {/* Card 4: Escalated (Dark Slate) */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm">
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {escalatedCount}
          </div>
          <div className="text-xs font-semibold text-slate-400 mt-1">
            Escalated
          </div>
        </div>

      </div>

      {/* 3. Recent Reports Section matching the reference screenshot */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        
        {/* Section Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            Recent Reports
          </h2>
          <button
            type="button"
            className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>All ({reports.length > 0 ? reports.length : 28})</span>
            <span>→</span>
          </button>
        </div>

        {/* Reports List Items */}
        <div className="divide-y divide-slate-100">
          {displayReports.map((report) => {
            const title = report.Title || report.title || 'Civic Issue';
            const ward = report.ward || 'Ward 12';
            const timeAgo = report.timeOfReporting || report.time || 'Recent';
            const imgSrc = report.image || report.uploadedImage || '/images/street_issue_thumb.jpg';
            const status = report.status || 'pending';

            return (
              <div
                key={report._id || report.id}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors group"
              >
                {/* Left: Thumbnail & Details */}
                <div
                  className="flex items-center gap-4 cursor-pointer min-w-0"
                  onClick={() => onSelectReport(report)}
                >
                  {/* Photo Thumbnail */}
                  <div className="relative w-16 h-14 sm:w-20 sm:h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                    <img
                      src={imgSrc}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Title & Metadata */}
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate group-hover:text-blue-600 transition-colors">
                      {title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mt-1">
                      <span>{ward}</span>
                      <span>•</span>
                      <span>{timeAgo}</span>
                      <svg className="w-3.5 h-3.5 text-slate-400 ml-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Right: Status Pill & Action Buttons */}
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-bold border ${
                      status === 'verified' || status === 'approved'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                        : status === 'rejected'
                        ? 'bg-rose-50 text-rose-600 border-rose-200'
                        : 'bg-amber-50 text-amber-600 border-amber-200'
                    }`}
                  >
                    {status === 'verified' || status === 'approved'
                      ? 'Verified'
                      : status === 'rejected'
                      ? 'Rejected'
                      : 'Pending'}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      if (onVerifyReport) {
                        onVerifyReport(report);
                      } else {
                        onSelectReport(report);
                      }
                    }}
                    className="px-4 sm:px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
                  >
                    {status === 'verified' || status === 'approved' ? 'Review' : 'Verify'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
