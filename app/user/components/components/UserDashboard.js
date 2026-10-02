'use client';

import React from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Dynamically import UserMap with SSR disabled since MapLibre GL requires browser APIs
const UserMap = dynamic(() => import('./UserMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[4/3] rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xs text-slate-400">
      Loading OpenFreeMap...
    </div>
  ),
});

export default function UserDashboard({
  userName = 'Rupayan',
  onReportIssue,
  onViewAllReports,
  onSelectReport,
}) {
  // Stats matching the reference picture
  const stats = [
    {
      id: 'total',
      count: '12',
      label: 'Total Reports',
      numColor: 'text-slate-900',
      dotColor: 'bg-emerald-500',
    },
    {
      id: 'open',
      count: '5',
      label: 'Open',
      numColor: 'text-amber-500',
      dotColor: 'bg-amber-400',
    },
    {
      id: 'in-progress',
      count: '3',
      label: 'In Progress',
      numColor: 'text-blue-600',
      dotColor: 'bg-blue-500',
      isDiamond: true,
    },
    {
      id: 'resolved',
      count: '4',
      label: 'Resolved',
      numColor: 'text-emerald-600',
      dotColor: 'bg-emerald-500',
    },
  ];

  // Recent reports matching the reference picture
  const recentReports = [
    {
      id: 'CIVIC-20260928-A72F',
      title: 'Street Light Failure',
      ward: 'Ward 8',
      ticketId: 'CIVIC-20260928-A72F',
      status: 'Verified',
      statusStyle: 'bg-emerald-50 text-emerald-600 border-emerald-200/60',
      image: '/images/street_light_thumb.jpg',
      category: 'Street Light',
      description: 'Street light lamp not turning on during evening hours on main avenue.',
    },
    {
      id: 'CIVIC-20260926-D19K',
      title: 'Road Damage',
      ward: 'Ward 11',
      ticketId: 'CIVIC-20260926-D19K',
      status: 'In Progress',
      statusStyle: 'bg-amber-50 text-amber-600 border-amber-200/60',
      image: '/images/street_issue_thumb.jpg',
      category: 'Road & Transport',
      description: 'Asphalt pothole expanding after recent heavy rainfall near junction.',
    },
    {
      id: 'CIVIC-20260920-P91K',
      title: 'Garbage Not Collected',
      ward: 'Ward 5',
      ticketId: 'CIVIC-20260920-P91K',
      status: 'Resolved',
      statusStyle: 'bg-emerald-50 text-emerald-600 border-emerald-200/60',
      image: '/images/garbage_thumb.jpg',
      category: 'Waste Management',
      description: 'Overflowing commercial waste container cleared by municipal crew.',
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Greeting Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-black tracking-tight text-slate-900">
            Good morning, {userName} 👋
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Here&apos;s what&apos;s happening with your reports.
          </p>
        </div>

        <button
          type="button"
          onClick={onReportIssue}
          className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Report Issue</span>
        </button>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {stats.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div className={`text-3xl sm:text-4xl font-black ${s.numColor} tracking-tight`}>
              {s.count}
            </div>
            <div className="flex items-center gap-1.5 mt-3">
              {s.isDiamond ? (
                <span className="text-blue-600 text-xs">◆</span>
              ) : (
                <span className={`w-2 h-2 rounded-full ${s.dotColor}`} />
              )}
              <span className="text-xs font-semibold text-slate-500">
                {s.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Section: Recent Reports & Your Reports on Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        
        {/* Left Column: Recent Reports (7 cols on lg) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="font-extrabold text-slate-900 text-base sm:text-lg">
                Recent Reports
              </h2>
              <button
                type="button"
                onClick={onViewAllReports}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Status</span>
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

            {/* Reports List */}
            <div className="divide-y divide-slate-100">
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  onClick={() => onSelectReport ? onSelectReport(report) : null}
                  className="py-4 flex items-center justify-between gap-3 group cursor-pointer hover:bg-slate-50/60 -mx-2 px-2 rounded-xl transition-colors"
                >
                  {/* Left: Thumbnail & Titles */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-100">
                      <Image
                        src={report.image}
                        alt={report.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 text-sm sm:text-[15px] truncate group-hover:text-blue-600 transition-colors">
                        {report.title}
                      </div>
                      <div className="text-xs text-slate-400 font-medium truncate mt-0.5">
                        {report.ward} • {report.ticketId}
                      </div>
                    </div>
                  </div>

                  {/* Right: Status Badge */}
                  <div className="shrink-0">
                    <span
                      className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full border ${report.statusStyle}`}
                    >
                      {report.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer View All Link */}
          <div className="pt-3 border-t border-slate-100 mt-2">
            <button
              type="button"
              onClick={onViewAllReports}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Column: Your Reports on Map with MapLibre & ofm_dark.json OpenFreeMap (5 cols on lg) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="pb-4">
              <h2 className="font-extrabold text-slate-900 text-base sm:text-lg">
                Your Reports on Map
              </h2>
            </div>

            {/* MapLibre OpenFreeMap Container using ofm_dark.json */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-sm">
              <UserMap onMarkerClick={onSelectReport} />
            </div>
          </div>

          {/* Footer View Map Link */}
          <div className="pt-4 mt-2">
            <button
              type="button"
              onClick={onViewAllReports}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Map</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
