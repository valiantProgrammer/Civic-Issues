'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import HelpCard from './HelpCard';

export default function ReportDetailCard({ report, onClose }) {
  const [rightSideTab, setRightSideTab] = useState('both'); // 'both', 'history', 'help'
  if (!report) return null;

  // Formatting ticket ID and attributes
  const ticketId = report.ticketId || report.id || 'CIVIC-20261002-A72Q';
  const title = report.title || report.Title || 'Street Light Failure';
  const ward = report.ward || report.locality || 'Ward 8, Kolkata';
  const dateFormatted = report.date || 'Oct 02, 2026';
  const timeFormatted = report.time || '10:21 AM';
  const status = report.status || 'Verified';
  const description =
    report.description ||
    report.Description ||
    'Street light not working on main road near park junction creating safety hazards at night.';

  // Image gallery with fallback thumbnails
  const primaryImage = report.image || '/images/street_issue_thumb.jpg';
  const [activeImage, setActiveImage] = useState(primaryImage);

  const galleryImages = [
    primaryImage,
    '/images/street_light_thumb.jpg',
    '/images/garbage_thumb.jpg',
  ];

  // Activity History timeline milestones
  const timelineNodes = [
    {
      id: 1,
      title: 'Report submitted',
      time: 'Oct 02, 10:21 AM',
      completed: true,
      color: 'blue',
      icon: 'check',
    },
    {
      id: 2,
      title: 'Verified by Admin',
      time: 'Oct 02, 10:45 AM',
      completed: true,
      color: 'green',
      icon: 'check',
    },
    {
      id: 3,
      title: 'Forwarded to Municipality',
      time: 'Oct 03, 11:10 AM',
      completed: true,
      color: 'green',
      icon: 'check',
    },
    {
      id: 4,
      title: 'Assigned to Department',
      time: 'Oct 03, 08:20 AM',
      completed: status === 'In Progress' || status === 'Resolved',
      inProgress: status === 'Verified',
      color: 'teal',
      icon: 'clock',
    },
    {
      id: 5,
      title: 'In Progress',
      time: status === 'In Progress' || status === 'Resolved' ? 'Oct 04, 02:15 PM' : 'Oct 04, 02:15 PM',
      completed: status === 'Resolved',
      inProgress: status === 'In Progress',
      color: 'amber',
      icon: 'clock',
    },
    {
      id: 6,
      title: 'Resolved',
      time: status === 'Resolved' ? 'Oct 05, 04:30 PM' : 'Pending',
      completed: status === 'Resolved',
      color: 'slate',
      icon: 'circle',
    },
  ];

  return (
    <div className="w-full space-y-4 sm:space-y-5 font-sans antialiased pb-10">
      {/* 1. Top Navigation Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-2xs">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors mb-2 cursor-pointer"
        >
          <span className="text-sm">←</span>
          <span>Back to Reports</span>
        </button>

        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {ticketId}
          </h1>

          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-xs ${
              status === 'Verified' || status === 'Resolved'
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200/80'
                : status === 'In Progress'
                ? 'bg-amber-50 text-amber-600 border-amber-200/80'
                : 'bg-rose-50 text-rose-600 border-rose-200/80'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            <span>{status}</span>
          </span>
        </div>
      </div>

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (8 cols): Media Gallery + Issue Details & Mini Map */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-5">
          
          {/* Photos Side (6 cols) */}
          <div className="md:col-span-6 space-y-2">
            {/* Big Main Image */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm">
              <Image
                src={activeImage}
                alt="Report main evidence"
                fill
                className="object-cover object-center"
                priority
              />
            </div>

            {/* 3 Thumbnails row below */}
            <div className="grid grid-cols-3 gap-2">
              {galleryImages.map((imgSrc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(imgSrc)}
                  className={`relative aspect-[4/3] rounded-xl overflow-hidden border transition-all cursor-pointer ${
                    activeImage === imgSrc
                      ? 'border-blue-600 ring-2 ring-blue-500/30'
                      : 'border-slate-200 opacity-75 hover:opacity-100 hover:border-slate-300'
                  }`}
                >
                  <Image
                    src={imgSrc}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details & Map Card (6 cols) */}
          <div className="md:col-span-6 bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {title}
              </h2>
              <div className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
                {ward}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Submitted {dateFormatted} • {timeFormatted}
              </div>

              {/* Description */}
              <div className="mt-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
                  Description
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  {description}
                </p>
              </div>
            </div>

            {/* Location & Mini Map Card */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                Location
              </div>

              <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner group">
                {/* Visual Map Backdrop */}
                <Image
                  src="/images/city_map_bg.jpg"
                  alt="City Map Preview"
                  fill
                  className="object-cover opacity-90 contrast-105"
                />

                {/* Center Pin */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg ring-2 ring-white animate-bounce">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                {/* View Map Button Overlay */}
                <div className="absolute top-2.5 right-2.5">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ward)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/95 hover:bg-white text-blue-600 text-[11px] font-bold rounded-lg shadow-sm border border-slate-200/80 transition-all hover:shadow"
                  >
                    <span>View Map</span>
                    <span className="text-xs">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Full Right Side with Activity History and Help/Support */}
        <div className="lg:col-span-4 space-y-4">
          {/* Segmented Switcher Tab */}
          <div className="bg-white rounded-2xl p-1.5 border border-slate-100 shadow-2xs flex items-center gap-1">
            <button
              type="button"
              onClick={() => setRightSideTab('history')}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                rightSideTab === 'history'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Activity History
            </button>
            <button
              type="button"
              onClick={() => setRightSideTab('help')}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-1 ${
                rightSideTab === 'help'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>Help & Support</span>
            </button>
            <button
              type="button"
              onClick={() => setRightSideTab('both')}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                rightSideTab === 'both'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
              }`}
              title="Show Both Stacked on Right Side"
            >
              Both
            </button>
          </div>

          {/* 1. Activity History (Current Thing) */}
          {(rightSideTab === 'history' || rightSideTab === 'both') && (
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Activity History
                </h2>
                <span className="text-[11px] font-semibold text-slate-400">
                  Live Updates
                </span>
              </div>

              {/* Vertical Stepper Timeline */}
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {timelineNodes.map((node) => (
                  <div key={node.id} className="relative flex items-start gap-3">
                    {/* Node Indicator Icon */}
                    <div className="absolute -left-6 top-0.5">
                      {node.completed ? (
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-xs ${
                            node.color === 'blue'
                              ? 'bg-blue-600 ring-4 ring-blue-100'
                              : 'bg-emerald-500 ring-4 ring-emerald-100'
                          }`}
                        >
                          ✓
                        </div>
                      ) : node.inProgress ? (
                        <div className="w-5 h-5 rounded-full border-2 border-emerald-500 bg-white flex items-center justify-center ring-4 ring-emerald-50">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 bg-white flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                        {node.title}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                        {node.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Help & Support (Full Right Side) */}
          {(rightSideTab === 'help' || rightSideTab === 'both') && (
            <div className="w-full">
              <HelpCard />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
