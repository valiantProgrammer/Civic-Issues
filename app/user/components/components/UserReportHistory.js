'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { authApi } from '@/lib/api';

export default function UserReportHistory({ onReportSelect }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [apiReports, setApiReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Status mapping helper for real database lifecycle statuses
  const mapReportStatus = (status) => {
    const s = (status || '').toLowerCase();
    if (['resolved', 'closed', 'solved'].includes(s)) {
      return {
        label: 'Resolved',
        code: 'resolved',
        style: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/70 dark:border-emerald-800/60',
      };
    }
    if (['verified', 'resolution_submitted', 'verification', 'approved'].includes(s)) {
      return {
        label: 'Verified',
        code: 'open',
        style: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/70 dark:border-emerald-800/60',
      };
    }
    if (['in_progress', 'inspection', 'action_planned', 'assigned', 'on_hold', 'rework_required', 'reopened', 'escalated', 'reviewed'].includes(s)) {
      return {
        label: 'In Progress',
        code: 'in_progress',
        style: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/70 dark:border-amber-800/60',
      };
    }
    if (['rejected', 'duplicate', 'inspection_failed'].includes(s)) {
      return {
        label: 'Rejected',
        code: 'rejected',
        style: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200/70 dark:border-rose-800/60',
      };
    }
    // submitted, acknowledged, triaged, under_review, needs_information, pending
    return {
      label: 'Verified',
      code: 'open',
      style: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/70 dark:border-emerald-800/60',
    };
  };

  // Fetch live reports directly from MongoDB API
  useEffect(() => {
    let isMounted = true;
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const res = await authApi.getUserReports();
        if (isMounted && res && res.reports) {
          const mapped = res.reports.map((r, i) => {
            const created = r.createdAt ? new Date(r.createdAt) : new Date();
            const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            const m = monthNames[created.getMonth()];
            const d = String(created.getDate()).padStart(2, '0');

            const statusObj = mapReportStatus(r.status);

            // Format ward
            let wardStr = r.ward ? String(r.ward).trim() : 'Ward 1';
            if (!wardStr.toLowerCase().startsWith('ward')) {
              wardStr = `Ward ${wardStr}`;
            }

            return {
              ...r,
              id: r._id || `REP-${i}`,
              ticketId: r.ticketId || (r._id ? `CIVIC-${r._id.slice(-8).toUpperCase()}` : `CIVIC-${i}`),
              title: r.Title || 'Civic Issue',
              date: created.toISOString().split('T')[0],
              month: m,
              day: d,
              ward: wardStr,
              status: statusObj.label,
              statusCode: statusObj.code,
              statusStyle: statusObj.style,
              image: r.image || r.mediaUrl || '/images/street_issue_thumb.jpg',
              category: r.category || 'General',
              description: r.Description || '',
            };
          });
          setApiReports(mapped);
        }
      } catch (err) {
        console.error('Error fetching user reports from database:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchReports();
    return () => {
      isMounted = false;
    };
  }, []);

  // ONLY show live reports fetched from database
  const reports = apiReports;

  // Compute status counts dynamically from database records
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
      {/* 1. Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Report History
          </h1>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>MongoDB Connected</span>
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal mt-1">
          Review, filter and track all complaints filed across the municipal grievance lifecycle.
        </p>
      </div>

      {/* 2. Top Filter Bar & Date Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-[#111A2E] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-slate-800'
            }`}
          >
            All Reports ({counts.all})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('open')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === 'open'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-[#111A2E] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-slate-800'
            }`}
          >
            Open ({counts.open})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('in_progress')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === 'in_progress'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-[#111A2E] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-slate-800'
            }`}
          >
            In Progress ({counts.in_progress})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('resolved')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === 'resolved'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-[#111A2E] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-slate-800'
            }`}
          >
            Resolved ({counts.resolved})
          </button>
        </div>

        {/* Date Filter */}
        <div className="relative self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="bg-white dark:bg-[#111A2E] border border-slate-200/80 dark:border-slate-800 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-2xs flex items-center gap-2 hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{selectedDate ? selectedDate : 'Filter by Date'}</span>
            {selectedDate && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDate('');
                }}
                className="ml-1 text-slate-400 hover:text-rose-500 font-bold"
              >
                ✕
              </span>
            )}
          </button>

          {showDatePicker && (
            <div className="absolute right-0 mt-2 p-3 bg-white dark:bg-[#111A2E] border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl z-20">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setShowDatePicker(false);
                }}
                className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* 3. Reports List */}
      <div className="space-y-3">
        {isLoading && (
          <div className="bg-white dark:bg-[#111A2E] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-12 text-center text-slate-500 dark:text-slate-400">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
            <div className="font-bold text-sm text-slate-700 dark:text-slate-200">Loading reports from database...</div>
          </div>
        )}

        {!isLoading && filteredReports.map((report) => (
          <div
            key={report.id}
            onClick={() => onReportSelect?.(report)}
            className="group bg-white dark:bg-[#111A2E] border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-sm"
          >
            {/* Left section: Date badge + Image + Title + Ticket */}
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              {/* Date Block */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center shrink-0 border border-slate-200/50 dark:border-slate-800">
                <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">
                  {report.month}
                </span>
                <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-none mt-0.5">
                  {report.day}
                </span>
              </div>

              {/* Thumbnail Image */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 relative">
                <Image
                  src={report.image}
                  alt={report.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  sizes="56px"
                />
              </div>

              {/* Title & Ticket ID */}
              <div className="min-w-0">
                <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                  {report.title}
                </div>
                <div className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-2">
                  <span>{report.ticketId}</span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="truncate">{report.category}</span>
                </div>
              </div>
            </div>

            {/* Right section: Ward + Status Badge */}
            <div className="flex items-center gap-4 sm:gap-8 shrink-0">
              {/* Ward */}
              <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hidden md:block">
                {report.ward}
              </div>

              {/* Status Badge with dark theme styling */}
              <div
                className={`text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full border shadow-xs transition-colors ${
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

        {!isLoading && filteredReports.length === 0 && (
          <div className="bg-white dark:bg-[#111A2E] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-12 text-center text-slate-500 dark:text-slate-400">
            <span className="text-3xl mb-2 block">📋</span>
            <div className="font-bold text-sm text-slate-700 dark:text-slate-200">No reports found in database</div>
            <div className="text-xs text-slate-400 mt-1">There are no civic reports matching the selected filters.</div>
          </div>
        )}
      </div>
    </div>
  );
}
