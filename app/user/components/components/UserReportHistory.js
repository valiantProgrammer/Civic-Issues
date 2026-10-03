'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { authApi } from '@/lib/api';

export default function UserReportHistory({ onReportSelect }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [apiReports, setApiReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Default sample reports matching the exact screenshot
  const initialReports = [
    {
      id: 'CIVIC-20261002-A72Q',
      ticketId: 'CIVIC-20261002-A72Q',
      title: 'Street Light Failure',
      date: '2026-10-02',
      month: 'OCT',
      day: '02',
      ward: 'Ward 8',
      status: 'Verified',
      statusCode: 'open',
      statusStyle: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/70 dark:border-emerald-800/60',
      image: '/images/street_light_thumb.jpg',
      category: 'Street Light',
      description: 'Street light lamp not turning on during evening hours on main avenue.',
    },
    {
      id: 'CIVIC-20260928-91KD',
      ticketId: 'CIVIC-20260928-91KD',
      title: 'Water Leakage',
      date: '2026-09-28',
      month: 'SEP',
      day: '28',
      ward: 'Ward 5',
      status: 'Resolved',
      statusCode: 'resolved',
      statusStyle: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/70 dark:border-emerald-800/60',
      image: '/images/street_issue_thumb.jpg',
      category: 'Water Supply',
      description: 'Underground pipeline leakage waterlogged the street corner.',
    },
    {
      id: 'CIVIC-20260921-72PA',
      ticketId: 'CIVIC-20260921-72PA',
      title: 'Road Damage',
      date: '2026-09-21',
      month: 'SEP',
      day: '21',
      ward: 'Ward 11',
      status: 'In Progress',
      statusCode: 'in_progress',
      statusStyle: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/70 dark:border-amber-800/60',
      image: '/images/street_issue_thumb.jpg',
      category: 'Road & Transport',
      description: 'Large asphalt potholes causing vehicle damage and traffic slowdown.',
    },
    {
      id: 'CIVIC-20260915-D11K',
      ticketId: 'CIVIC-20260915-D11K',
      title: 'Garbage Not Collected',
      date: '2026-09-15',
      month: 'SEP',
      day: '15',
      ward: 'Ward 3',
      status: 'Rejected',
      statusCode: 'rejected',
      statusStyle: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200/70 dark:border-rose-800/60',
      image: '/images/garbage_thumb.jpg',
      category: 'Waste Management',
      description: 'Community waste bins overflowing for 4 consecutive days.',
    },
    {
      id: 'CIVIC-20260910-K82W',
      ticketId: 'CIVIC-20260910-K82W',
      title: 'Open Drain Safety',
      date: '2026-09-10',
      month: 'SEP',
      day: '10',
      ward: 'Ward 7',
      status: 'Verified',
      statusCode: 'open',
      statusStyle: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/70 dark:border-emerald-800/60',
      image: '/images/street_issue_thumb.jpg',
      category: 'Sanitation',
      description: 'Broken slab over stormwater canal creating danger for pedestrians.',
    },
  ];

  // Try fetching live user reports from MongoDB API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const res = await authApi.getUserReports();
        if (res && res.reports && res.reports.length > 0) {
          const mapped = res.reports.map((r, i) => {
            const created = r.createdAt ? new Date(r.createdAt) : new Date();
            const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            const m = monthNames[created.getMonth()];
            const d = String(created.getDate()).padStart(2, '0');
            const statusStr = r.status === 'approved' ? 'Resolved' : r.status === 'reviewed' ? 'In Progress' : r.status === 'rejected' ? 'Rejected' : 'Verified';
            const statusClass = statusStr === 'Resolved' || statusStr === 'Verified'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/70 dark:border-emerald-800/60'
              : statusStr === 'In Progress'
              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/70 dark:border-amber-800/60'
              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200/70 dark:border-rose-800/60';

            return {
              id: r._id || `REP-${i}`,
              ticketId: r._id ? `CIVIC-${r._id.slice(-8).toUpperCase()}` : `CIVIC-${i}`,
              title: r.Title || 'Civic Issue',
              date: created.toISOString().split('T')[0],
              month: m,
              day: d,
              ward: r.locality || 'Ward 8',
              status: statusStr,
              statusCode: r.status === 'approved' ? 'resolved' : r.status === 'reviewed' ? 'in_progress' : r.status === 'rejected' ? 'rejected' : 'open',
              statusStyle: statusClass,
              image: r.uploadedImage || '/images/street_issue_thumb.jpg',
              category: r.category || 'General',
              description: r.Description || '',
            };
          });
          setApiReports(mapped);
        }
      } catch {
        // Fallback silently to initialReports
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  const reports = apiReports.length > 0 ? apiReports : initialReports;

  // Compute status counts
  const counts = useMemo(() => {
    return {
      all: reports.length,
      open: reports.filter((r) => r.statusCode === 'open' || r.status === 'Verified').length,
      in_progress: reports.filter((r) => r.statusCode === 'in_progress' || r.status === 'In Progress').length,
      resolved: reports.filter((r) => r.statusCode === 'resolved' || r.status === 'Resolved').length,
    };
  }, [reports]);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      // Status filter
      if (activeFilter === 'open' && report.statusCode !== 'open' && report.status !== 'Verified') return false;
      if (activeFilter === 'in_progress' && report.statusCode !== 'in_progress' && report.status !== 'In Progress') return false;
      if (activeFilter === 'resolved' && report.statusCode !== 'resolved' && report.status !== 'Resolved') return false;

      // Date filter
      if (selectedDate && !report.date.includes(selectedDate)) return false;

      return true;
    });
  }, [reports, activeFilter, selectedDate]);

  return (
    <div className="w-full space-y-6 font-sans">
      {/* 1. Header matching the screenshot */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          My Report History
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          View and track all your submitted reports.
        </p>
      </div>

      {/* 2. Top Filter Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Status Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25 ring-2 ring-blue-600/20'
                : 'bg-white dark:bg-[#111A2E] text-slate-600 dark:text-slate-400 border border-slate-200/90 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            All ({counts.all})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('open')}
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeFilter === 'open'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25 ring-2 ring-blue-600/20'
                : 'bg-white dark:bg-[#111A2E] text-slate-600 dark:text-slate-400 border border-slate-200/90 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            Open ({counts.open})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('in_progress')}
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeFilter === 'in_progress'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25 ring-2 ring-blue-600/20'
                : 'bg-white dark:bg-[#111A2E] text-slate-600 dark:text-slate-400 border border-slate-200/90 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            In Progress ({counts.in_progress})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('resolved')}
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeFilter === 'resolved'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25 ring-2 ring-blue-600/20'
                : 'bg-white dark:bg-[#111A2E] text-slate-600 dark:text-slate-400 border border-slate-200/90 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            Resolved ({counts.resolved})
          </button>
        </div>

        {/* Date Filter Button */}
        <div className="relative">
          <div className="flex items-center gap-1 bg-white dark:bg-[#111A2E] border border-slate-200/90 dark:border-slate-800 px-3 py-1.5 rounded-xl shadow-xs text-xs font-medium text-slate-700 dark:text-slate-300">
            <button
              type="button"
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{selectedDate ? selectedDate : 'Select Date'}</span>
            </button>

            {selectedDate && (
              <button
                type="button"
                onClick={() => setSelectedDate('')}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-1 p-0.5"
                title="Clear date filter"
              >
                ✕
              </button>
            )}
          </div>

          {showDatePicker && (
            <div className="absolute right-0 top-full mt-2 bg-white dark:bg-[#111A2E] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-3 z-30">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setShowDatePicker(false);
                }}
                className="text-xs p-2 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
              />
            </div>
          )}
        </div>
      </div>

      {/* 3. Reports List matching the exact row cards in the screenshot */}
      <div className="space-y-3">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            onClick={() => onReportSelect?.(report)}
            className="group bg-white dark:bg-[#111A2E] rounded-2xl border border-slate-100/90 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all p-3.5 sm:p-4 flex items-center justify-between gap-3 sm:gap-4 cursor-pointer"
          >
            {/* Left Section: Date Badge + Thumbnail + Details */}
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              {/* Date Column */}
              <div className="w-10 sm:w-12 text-center shrink-0">
                <div className="text-[10px] sm:text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  {report.month}
                </div>
                <div className="text-base sm:text-lg font-black text-slate-800 dark:text-white leading-tight">
                  {report.day}
                </div>
              </div>

              {/* Thumbnail Photo */}
              <div className="relative w-14 h-12 sm:w-16 sm:h-14 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700 shrink-0 bg-slate-100 dark:bg-slate-800">
                <Image
                  src={report.image}
                  alt={report.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Title & Ticket ID */}
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {report.title}
                </h3>
                <div className="text-[11px] text-slate-400 font-mono tracking-wide mt-0.5 truncate">
                  {report.ticketId}
                </div>
              </div>
            </div>

            {/* Right Section: Ward Tag + Status Pill */}
            <div className="flex items-center gap-4 sm:gap-8 shrink-0">
              {/* Ward */}
              <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hidden md:block">
                {report.ward}
              </div>

              {/* Status Badge */}
              <div
                className={`text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full border shadow-xs ${
                  report.statusStyle && report.statusStyle.includes('dark:')
                    ? report.statusStyle
                    : (report.status === 'Resolved' || report.status === 'Verified')
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/70 dark:border-emerald-800/60'
                    : report.status === 'In Progress'
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/70 dark:border-amber-800/60'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200/70 dark:border-rose-800/60'
                }`}
              >
                {report.status}
              </div>
            </div>
          </div>
        ))}

        {filteredReports.length === 0 && (
          <div className="bg-white dark:bg-[#111A2E] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-12 text-center text-slate-500 dark:text-slate-400">
            <span className="text-3xl mb-2 block">📋</span>
            <div className="font-bold text-sm text-slate-700 dark:text-slate-200">No reports found</div>
            <div className="text-xs text-slate-400 mt-1">There are no civic reports matching the selected filters.</div>
          </div>
        )}
      </div>
    </div>
  );
}
