'use client';

import React, { useState, useMemo } from 'react';

export default function AdministrationIssuesView({
  reports = [],
  onSelectReport,
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [wardFilter, setWardFilter] = useState('all');

  // Sample default reports if database has few
  const defaultIssues = [
    {
      _id: 'iss-1',
      id: 'CIVIC-20261002-A72Q',
      ticketId: 'CIVIC-20261002-A72Q',
      title: 'Water Leakage - Ward 7',
      Title: 'Water Leakage - Ward 7',
      ward: 'Ward 7',
      status: 'pending',
      severity: 'High',
      category: 'Water Works',
      timeOfReporting: '2 hours ago',
      Description: 'Major main line pipe burst causing street inundation.',
      image: '/images/street_light_thumb.jpg',
    },
    {
      _id: 'iss-2',
      id: 'CIVIC-20261002-B81P',
      ticketId: 'CIVIC-20261002-B81P',
      title: 'Road Damage - Ward 12',
      Title: 'Road Damage - Ward 12',
      ward: 'Ward 12',
      status: 'in_progress',
      severity: 'Medium',
      category: 'Road & Transport',
      timeOfReporting: '5 hours ago',
      Description: 'Deep road potholes near junction slowing down buses.',
      image: '/images/street_issue_thumb.jpg',
    },
    {
      _id: 'iss-3',
      id: 'CIVIC-20261002-C99X',
      ticketId: 'CIVIC-20261002-C99X',
      title: 'Garbage Collection - Ward 5',
      Title: 'Garbage Collection - Ward 5',
      ward: 'Ward 5',
      status: 'pending',
      severity: 'High',
      category: 'Sanitation',
      timeOfReporting: '4 hours ago',
      Description: 'Commercial market garbage dumping overflowing onto sidewalk.',
      image: '/images/garbage_thumb.jpg',
    },
    {
      _id: 'iss-4',
      id: 'CIVIC-20261001-D42M',
      ticketId: 'CIVIC-20261001-D42M',
      title: 'Street Light Failure - Ward 8',
      Title: 'Street Light Failure - Ward 8',
      ward: 'Ward 8',
      status: 'approved',
      severity: 'Medium',
      category: 'Electrical',
      timeOfReporting: '1 day ago',
      Description: 'Park Street lights out during nighttime causing safety risks.',
      image: '/images/street_light_thumb.jpg',
    },
    {
      _id: 'iss-5',
      id: 'CIVIC-20260930-E11Z',
      ticketId: 'CIVIC-20260930-E11Z',
      title: 'Open Drain Hazard - Ward 11',
      Title: 'Open Drain Hazard - Ward 11',
      ward: 'Ward 11',
      status: 'escalated',
      severity: 'High',
      category: 'Drainage',
      timeOfReporting: '2 days ago',
      Description: 'Uncovered sewer trench near primary school.',
      image: '/images/street_issue_thumb.jpg',
    },
  ];

  const allReports = reports.length > 0 ? reports : defaultIssues;

  const filtered = useMemo(() => {
    return allReports.filter((r) => {
      const title = (r.Title || r.title || '').toLowerCase();
      const desc = (r.Description || r.description || '').toLowerCase();
      const ticket = (r.ticketId || r.id || '').toLowerCase();
      const ward = r.ward || 'Ward 12';
      const status = r.status || 'pending';

      const matchesSearch =
        !search.trim() ||
        title.includes(search.toLowerCase()) ||
        desc.includes(search.toLowerCase()) ||
        ticket.includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'open' && (status === 'pending' || status === 'verified')) ||
        (statusFilter === 'in_progress' && status === 'in_progress') ||
        (statusFilter === 'completed' && (status === 'approved' || status === 'resolved')) ||
        (statusFilter === 'escalated' && status === 'escalated');

      const matchesWard = wardFilter === 'all' || ward === wardFilter;

      return matchesSearch && matchesStatus && matchesWard;
    });
  }, [allReports, search, statusFilter, wardFilter]);

  return (
    <div className="w-full space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Civic Issues Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review, filter, inspect, and dispatch actions across all municipal reports.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ticket ID, title, keyword..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 font-medium"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 shadow-xs focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open / Verified</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed / Approved</option>
            <option value="escalated">Escalated</option>
          </select>

          {/* Ward filter */}
          <select
            value={wardFilter}
            onChange={(e) => setWardFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 shadow-xs focus:outline-none cursor-pointer"
          >
            <option value="all">All Wards</option>
            <option value="Ward 5">Ward 5</option>
            <option value="Ward 7">Ward 7</option>
            <option value="Ward 8">Ward 8</option>
            <option value="Ward 11">Ward 11</option>
            <option value="Ward 12">Ward 12</option>
          </select>
        </div>
      </div>

      {/* Issues Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Showing {filtered.length} Case{filtered.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {filtered.map((issue) => {
            const title = issue.Title || issue.title || 'Civic Issue';
            const ticket = issue.ticketId || issue.id || 'CIVIC-ID';
            const ward = issue.ward || 'Ward 12';
            const timeAgo = issue.timeOfReporting || issue.time || 'Recently';
            const status = issue.status || 'pending';
            const imgSrc = issue.image || '/images/street_issue_thumb.jpg';

            return (
              <div
                key={issue._id || issue.id}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors group cursor-pointer"
                onClick={() => onSelectReport(issue)}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-16 h-14 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                    <img src={imgSrc} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-slate-400">
                        {ticket}
                      </span>
                      <span className="text-xs text-slate-300">•</span>
                      <span className="text-xs font-semibold text-slate-500">
                        {ward}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate group-hover:text-blue-600 transition-colors mt-0.5">
                      {title}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      Reported {timeAgo}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      status === 'approved' || status === 'completed' || status === 'resolved'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                        : status === 'in_progress'
                        ? 'bg-blue-50 text-blue-600 border-blue-200'
                        : status === 'escalated'
                        ? 'bg-rose-50 text-rose-600 border-rose-200'
                        : 'bg-amber-50 text-amber-600 border-amber-200'
                    }`}
                  >
                    {status === 'approved' || status === 'completed'
                      ? 'Completed'
                      : status === 'in_progress'
                      ? 'In Progress'
                      : status === 'escalated'
                      ? 'Escalated'
                      : 'Open'}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectReport(issue);
                    }}
                    className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Review →
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
