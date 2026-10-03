'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import HelpCard from './HelpCard';
import { useTheme } from '@/app/context/ThemeContext';

export default function ReportDetailCard({ report, onClose }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Left panel view: 'track' (default), 'help', 'notification'
  // When switching, ONLY the left part changes; the right "Report Details" card stays fixed!
  const [leftView, setLeftView] = useState('track');

  if (!report) return null;

  // Formatting ticket ID and attributes matching the screenshot
  const ticketId = report.ticketId || report.id || 'CIVIC-20261002-A72Q';
  const title = report.title || report.Title || 'Street Light Failure';
  const ward = report.ward || report.locality || 'Ward 8, Kolkata';
  const dateFormatted = report.date || 'Oct 02, 2026';
  const timeFormatted = report.time || '10:21 AM';
  const status = report.status || 'Administration Review';
  const description =
    report.description ||
    report.Description ||
    'Street light is not working on the main road near park junction creating safety hazards at night.';

  // Thumbnail image
  const primaryImage = report.image || '/images/street_issue_thumb.jpg';

  // 6 Stepper milestones matching the exact user screenshot
  const steps = [
    {
      id: 1,
      title: 'Submitted',
      time: 'Oct 01, 2026 • 10:21 AM',
      state: 'completed',
      lineColor: 'green',
    },
    {
      id: 2,
      title: 'Verified',
      time: 'Oct 02, 2026 • 10:45 AM',
      state: 'completed',
      lineColor: 'blue',
    },
    {
      id: 3,
      title: 'Administration Review',
      time: 'In progress',
      state: 'active',
      lineColor: 'gray',
    },
    {
      id: 4,
      title: 'Assigned',
      time: 'Pending',
      state: 'pending',
      lineColor: 'gray',
    },
    {
      id: 5,
      title: 'In Progress',
      time: 'Pending',
      state: 'pending',
      lineColor: 'gray',
    },
    {
      id: 6,
      title: 'Completed',
      time: 'Pending',
      state: 'pending',
      lineColor: 'gray',
    },
  ];

  // Notifications state matching the exact user reference screenshot
  const [notifFilter, setNotifFilter] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: `Your report ${ticketId} was verified.`,
      time: '10 minutes ago',
      category: 'updates',
      ticketId: ticketId,
      unread: true,
      iconColor: 'bg-[#F5F3FF] dark:bg-purple-950/40 border border-[#DDD6FE] dark:border-purple-800 text-[#7C3AED] dark:text-purple-400',
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 20V10a8 8 0 1116 0v10M9 20v-4a3 3 0 016 0v4" />
        </svg>
      ),
    },
    {
      id: 'notif-2',
      title: `Your report has been forwarded to ${ward.split(',')[0] || 'Ward 8'}.`,
      time: '2 hours ago',
      category: 'updates',
      ticketId: ticketId,
      unread: true,
      iconColor: 'bg-[#EFF6FF] dark:bg-blue-950/40 border border-[#BFDBFE] dark:border-blue-800 text-[#2563EB] dark:text-blue-400',
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
          <circle cx="12" cy="13" r="7.5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.5v3.5l2.5 2.5M5 5l2.5 2M19 5l-2.5 2" />
        </svg>
      ),
    },
    {
      id: 'notif-3',
      title: 'CIVIC-20260928-91KD has been resolved.',
      time: '1 day ago',
      category: 'resolved',
      ticketId: 'CIVIC-20260928-91KD',
      unread: true,
      iconColor: 'bg-[#FFF7ED] dark:bg-amber-950/40 border border-[#FED7AA] dark:border-amber-800 text-[#EA580C] dark:text-amber-400',
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
          <circle cx="12" cy="12" r="8" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12l2.5 2.5 5-5" />
        </svg>
      ),
    },
    {
      id: 'notif-4',
      title: 'Your report CIVIC-20260921-72PA was rejected.',
      time: '3 days ago',
      category: 'system',
      ticketId: 'CIVIC-20260921-72PA',
      unread: true,
      iconColor: 'bg-[#FFF1F2] dark:bg-rose-950/40 border border-[#FECDD3] dark:border-rose-800 text-[#E11D48] dark:text-rose-400',
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v5m0 3h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
      ),
    },
  ]);

  const filterTabs = [
    { id: 'all', label: 'All' },
    { id: 'updates', label: 'Updates' },
    { id: 'resolved', label: 'Resolved' },
    { id: 'system', label: 'System' },
  ];

  const filteredNotifications = notifications.filter((item) => {
    if (notifFilter === 'all') return true;
    return item.category === notifFilter;
  });

  const handleToggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    toast.success('All notifications marked as read');
  };

  const handleCopyTicket = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(ticketId);
      toast.success(`Copied ${ticketId} to clipboard!`);
    }
  };

  return (
    <div className="w-full space-y-4 sm:space-y-5 font-sans antialiased pb-12">
      
      {/* 1. Header Navigation Bar */}
      <div className="bg-white dark:bg-[#111A2E] rounded-2xl p-4 sm:p-5 border border-slate-100 dark:border-slate-800 shadow-2xs flex items-center justify-between gap-4 transition-colors">
        
        {/* Left: Back Button & Ticket ID */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Reports</span>
          </button>

          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>

          <button
            type="button"
            onClick={handleCopyTicket}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer group"
            title="Click to copy Ticket ID"
          >
            <span>{ticketId}</span>
            <svg className="w-3 h-3 opacity-60 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>

        {/* Right: Status Tag */}
        <div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
            ['Resolved', 'Closed', 'resolved', 'closed', 'Verified', 'verified'].includes(status)
              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/70'
              : ['Rejected', 'rejected'].includes(status)
              ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/70'
              : 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/70'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              ['Resolved', 'Closed', 'resolved', 'closed', 'Verified', 'verified'].includes(status)
                ? 'bg-emerald-500'
                : ['Rejected', 'rejected'].includes(status)
                ? 'bg-rose-500'
                : 'bg-amber-500 animate-pulse'
            }`} />
            <span>{status}</span>
          </span>
        </div>

      </div>

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN (5 cols on lg): Changes between Track, Help, or Notification */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 px-1 sm:px-2 pt-1 space-y-4">
          
          {/* The 3 Buttons: Track, Help, Notification (controls ONLY the left part) */}
          <div className="inline-flex items-center p-1 rounded-xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/70 dark:border-slate-800 shadow-2xs">
            
            {/* 1. Track Button */}
            <button
              type="button"
              id="btn-switch-track"
              onClick={() => setLeftView('track')}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                leftView === 'track'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A2 2 0 013 15.488V5.512a2 2 0 011.553-1.956L9 2m0 16l6-3m-6 3V2m6 15l5.447 2.724A2 2 0 0021 17.976V8.024a2 2 0 00-1.553-1.956L15 5m0 12V5m0 0L9 2" />
              </svg>
              <span>Track</span>
            </button>

            {/* 2. Help Button */}
            <button
              type="button"
              id="btn-switch-help"
              onClick={() => setLeftView('help')}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                leftView === 'help'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round" />
              </svg>
              <span>Help</span>
            </button>

            {/* 3. Notification Button */}
            <button
              type="button"
              id="btn-switch-notif"
              onClick={() => setLeftView('notification')}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer relative ${
                leftView === 'notification'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <span>Notification</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </button>

          </div>

          {/* VIEW A: TRACK YOUR REPORT (Default - Matches Screenshot Exactly) */}
          {leftView === 'track' && (
            <div className="pt-2 animate-in fade-in duration-200">
              
              {/* Heading & Ticket ID */}
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Track Your Report
              </h2>
              <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-500 tracking-tight mt-1 mb-8">
                {ticketId}
              </div>

              {/* Stepper Timeline with Custom Icons & Connecting Lines */}
              <div className="relative space-y-7 pl-1">
                {steps.map((step, idx) => {
                  const isLast = idx === steps.length - 1;

                  return (
                    <div key={step.id} className="relative flex items-start gap-4 group">
                      
                      {/* Vertical Connecting Line to Next Node */}
                      {!isLast && (
                        <div
                          className={`absolute left-4 top-8 -bottom-7 w-0.5 z-0 ${
                            step.lineColor === 'green'
                              ? 'bg-emerald-500'
                              : step.lineColor === 'blue'
                              ? 'bg-blue-600'
                              : 'bg-slate-200 dark:bg-slate-800'
                          }`}
                        />
                      )}

                      {/* Step Icon Marker */}
                      <div className="relative z-10 shrink-0">
                        {step.state === 'completed' ? (
                          // Completed Green Node with White Checkmark
                          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-xs ring-4 ring-emerald-50 dark:ring-emerald-950/40">
                            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        ) : step.state === 'active' ? (
                          // Active Blue Node with Down Chevron
                          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs ring-4 ring-blue-100 dark:ring-blue-950/50">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        ) : (
                          // Pending Muted Slate Node with Subtle Down Chevron
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500 flex items-center justify-center">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Step Labels */}
                      <div className="min-w-0 pt-0.5">
                        <div
                          className={`text-sm sm:text-[15px] font-bold leading-tight ${
                            step.state === 'completed' || step.state === 'active'
                              ? 'text-slate-900 dark:text-white'
                              : 'text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {step.title}
                        </div>

                        <div
                          className={`text-xs mt-0.5 font-medium ${
                            step.state === 'active'
                              ? 'text-blue-600 dark:text-blue-400 font-semibold'
                              : 'text-slate-400 dark:text-slate-400'
                          }`}
                        >
                          {step.time}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* VIEW B: HELP & SUPPORT (Exact layout matching the user's reference screenshot) */}
          {leftView === 'help' && (
            <div className="pt-1 animate-in fade-in duration-200">
              <HelpCard />
            </div>
          )}

          {/* VIEW C: NOTIFICATION (Exact layout matching the user's reference screenshot) */}
          {leftView === 'notification' && (
            <div className="pt-1 space-y-4 animate-in fade-in duration-200">
              
              {/* 1. Header with Title & Mark all as read */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl sm:text-[28px] font-black text-slate-900 dark:text-white tracking-tight">
                  Notifications
                </h2>

                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Mark all as read
                </button>
              </div>

              {/* 2. Filter Pills row matching screenshot */}
              <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                {filterTabs.map((tab) => {
                  const isActive = notifFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setNotifFilter(tab.id)}
                      className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-blue-50/80 dark:bg-slate-800/80 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-slate-700/80'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* 3. Notification List with Dividers matching screenshot */}
              <div className="w-full divide-y divide-slate-100 dark:divide-slate-800/80 pt-1">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleToggleRead(notif.id)}
                      className="py-4 flex items-center justify-between gap-3 sm:gap-4 transition-colors cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/40 rounded-xl px-2 -mx-2 group"
                    >
                      {/* Left: Squircle colored icon & Details */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${notif.iconColor}`}
                        >
                          {notif.icon}
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {notif.title}
                          </h3>
                          <p className="text-xs text-slate-400 dark:text-slate-500 font-normal mt-0.5">
                            {notif.time}
                          </p>
                        </div>
                      </div>

                      {/* Right: Solid blue dot indicator */}
                      <div className="shrink-0 flex items-center justify-center w-4 sm:w-5">
                        {notif.unread && (
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-slate-400 dark:text-slate-500 text-xs sm:text-sm font-medium">
                    No notifications in this category.
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN (7 cols on lg): "Report Details" Card (ALWAYS REMAINS FIXED) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 bg-white dark:bg-[#111A2E] rounded-3xl p-6 sm:p-7 border border-slate-100 dark:border-slate-800 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] transition-colors">
          
          {/* Card Header */}
          <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white mb-5">
            Report Details
          </h3>

          {/* Top Info Layout: Left Thumbnail & Right Metadata Stack */}
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5 pb-5 border-b border-slate-100 dark:border-slate-800/80">
            
            {/* Left: Thumbnail with Rounded Corners */}
            <div className="relative w-36 h-28 sm:w-44 sm:h-32 rounded-2xl overflow-hidden shrink-0 border border-slate-200/80 dark:border-slate-700 bg-slate-900 shadow-xs">
              <Image
                src={primaryImage}
                alt={title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Right: Category badge, Ward, Submitted date, Status */}
            <div className="flex flex-col justify-between min-w-0 flex-1 py-0.5">
              
              {/* Category Pill with Target / Circle Icon */}
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/70 dark:border-blue-800/60">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="3" fill="currentColor" />
                  </svg>
                  <span>{title}</span>
                </span>

                {/* Ward / Location Text */}
                <div className="text-sm sm:text-[15px] font-semibold text-slate-800 dark:text-slate-200 mt-2 truncate">
                  {ward}
                </div>

                {/* Submitted Date */}
                <div className="text-xs text-slate-400 dark:text-slate-400 mt-0.5">
                  Submitted {dateFormatted}
                </div>
              </div>

              {/* Status Row: "Status" label + Amber Badge */}
              <div className="flex items-center gap-2 mt-3 sm:mt-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Status:
                </span>
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-extrabold bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200/70 dark:border-amber-800/70">
                  {status}
                </span>
              </div>

            </div>
          </div>

          {/* Description Section */}
          <div className="mt-5">
            <h4 className="font-bold text-sm sm:text-[15px] text-slate-900 dark:text-white">
              Description
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-normal">
              {description}
            </p>
          </div>

          {/* Location Section with Theme-Adaptive Map Preview */}
          <div className="mt-5">
            <h4 className="font-bold text-sm sm:text-[15px] text-slate-900 dark:text-white mb-2.5">
              Location
            </h4>

            {/* Map Preview Container */}
            <div className="relative w-full h-36 sm:h-44 rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-700/80 bg-slate-100 dark:bg-slate-900 shadow-inner group">
              
              {/* Dynamic Map Image (city_map_dark.jpg in Dark, city_map_light.jpg in Light) */}
              <Image
                src={isDark ? '/images/city_map_dark.jpg' : '/images/city_map_light.jpg'}
                alt="City Map Preview"
                fill
                className="object-cover opacity-90 contrast-[1.04]"
              />

              {/* Red Location Pin near Center */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center pointer-events-none z-10">
                <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg ring-2 ring-white animate-bounce">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* "View on Map →" Pill Button matching the screenshot */}
              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ward)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>View on Map</span>
                  <span className="text-xs">→</span>
                </a>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
