'use client';

import React, { useState } from 'react';

export default function CivicPulseSection({ currentLang }) {
  const [timeFilter, setTimeFilter] = useState('Last 6 Months');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);

  const t = {
    en: {
      title: 'Civic Pulse',
      subtitle: 'Transparent data. Stronger communities.',
      reportsSubmitted: 'Reports Submitted',
      resolved: 'Resolved',
      resolutionRate: 'Resolution Rate',
      avgResolutionTime: 'Avg. Resolution Time',
      reportsOverTime: 'Reports Over Time',
      issuesByCategory: 'Issues by Category',
      wardWiseDistribution: 'Ward Wise Distribution',
      statusOverview: 'Status Overview',
      total: 'Total',
    },
    hi: {
      title: 'सिविक पल्स (Civic Pulse)',
      subtitle: 'पारदर्शी डेटा। मजबूत समुदाय।',
      reportsSubmitted: 'दर्ज शिकायतें',
      resolved: 'समाधान हुआ',
      resolutionRate: 'समाधान दर',
      avgResolutionTime: 'औसत समाधान समय',
      reportsOverTime: 'समय के साथ शिकायतें',
      issuesByCategory: 'श्रेणी के अनुसार समस्याएं',
      wardWiseDistribution: 'वार्ड अनुसार वितरण',
      statusOverview: 'स्थिति अवलोकन',
      total: 'कुल',
    },
  };

  const text = t[currentLang] || t.en;

  // Filter options
  const filterOptions = ['Last 30 Days', 'Last 3 Months', 'Last 6 Months', 'This Year'];

  // Top metric stats matching reference image
  const stats = [
    {
      value: '2,450',
      label: text.reportsSubmitted,
      change: '+12% from last month',
      changeType: 'positive',
    },
    {
      value: '1,870',
      label: text.resolved,
      change: '+18% from last month',
      changeType: 'positive',
    },
    {
      value: '76%',
      label: text.resolutionRate,
      change: '+8% from last month',
      changeType: 'positive',
    },
    {
      value: '4.8 Days',
      label: text.avgResolutionTime,
      change: '-22% from last month',
      changeType: 'positive', // Lower resolution time is positive!
    },
  ];

  // 1. Line Chart Data: Reports Over Time (Jan to Jun, Max ~150)
  // Coordinates mapped for SVG viewBox 0 0 500 200
  // Values: Jan: 35, Feb: 75, Mar: 110, Apr: 80, May: 120, Jun: 140
  const linePoints = [
    { month: 'Jan', val: 35, x: 45, y: 155 },
    { month: 'Feb', val: 75, x: 130, y: 115 },
    { month: 'Mar', val: 110, x: 215, y: 80 },
    { month: 'Apr', val: 80, x: 300, y: 110 },
    { month: 'May', val: 120, x: 385, y: 70 },
    { month: 'Jun', val: 140, x: 470, y: 50 },
  ];

  const linePathD = `M ${linePoints.map((p) => `${p.x} ${p.y}`).join(' L ')}`;
  const areaPathD = `M ${linePoints[0].x} 180 L ${linePoints.map((p) => `${p.x} ${p.y}`).join(' L ')} L ${linePoints[linePoints.length - 1].x} 180 Z`;

  // 2. Donut Chart 1: Issues by Category
  const categoryData = [
    { name: 'Potholes', percent: 28, color: '#3B82F6', textClass: 'text-blue-500' },
    { name: 'Garbage', percent: 22, color: '#F97316', textClass: 'text-orange-500' },
    { name: 'Street Lights', percent: 18, color: '#84CC16', textClass: 'text-lime-500' },
    { name: 'Water Leakage', percent: 14, color: '#EF4444', textClass: 'text-red-500' },
    { name: 'Road Damage', percent: 10, color: '#F59E0B', textClass: 'text-amber-500' },
    { name: 'Other', percent: 8, color: '#10B981', textClass: 'text-emerald-500' },
  ];

  // Helper to generate SVG Donut arcs
  const createDonutArcs = (data, radius = 70, strokeWidth = 24) => {
    let cumulative = 0;
    const circumference = 2 * Math.PI * radius;
    return data.map((item) => {
      const strokeDasharray = `${(item.percent / 100) * circumference} ${circumference}`;
      const strokeDashoffset = -((cumulative / 100) * circumference);
      cumulative += item.percent;
      return {
        ...item,
        strokeDasharray,
        strokeDashoffset,
      };
    });
  };

  const categoryArcs = createDonutArcs(categoryData);

  // 3. Bar Chart: Ward Wise Distribution
  const wardData = [
    { ward: 'Ward 1', count: 32, height: 32 },
    { ward: '2', count: 70, height: 70 },
    { ward: 'Ward 3', count: 115, height: 115 },
    { ward: 'Ward 4', count: 52, height: 52 },
    { ward: '5', count: 52, height: 52 },
    { ward: 'Ward 6', count: 92, height: 92 },
    { ward: '7', count: 124, height: 124 },
    { ward: '8', count: 48, height: 48 },
    { ward: 'Ward 9', count: 82, height: 82 },
    { ward: 'Ward 10', count: 34, height: 34 },
  ];

  // 4. Donut Chart 2: Status Overview (Total: 384)
  const statusData = [
    { name: 'Open', count: 142, percent: 37, color: '#3B82F6' },
    { name: 'Verified', count: 87, percent: 23, color: '#F59E0B' },
    { name: 'In Progress', count: 61, percent: 16, color: '#6366F1' },
    { name: 'Resolved', count: 94, percent: 24, color: '#10B981' },
  ];

  const statusArcs = createDonutArcs(statusData);

  return (
    <section id="civic-pulse" className="py-12 sm:py-16 lg:py-20 bg-[#F8FAFC] dark:bg-[#080D1A] relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header matching reference image */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {text.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-normal mt-1">
              {text.subtitle}
            </p>
          </div>

          {/* Timeframe Dropdown */}
          <div className="relative self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className="bg-white dark:bg-[#111A2E] border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>{timeFilter}</span>
              <svg
                className={`w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform ${
                  isFilterDropdownOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isFilterDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#111A2E] rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 py-1.5 z-20">
                {filterOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setTimeFilter(opt);
                      setIsFilterDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors ${
                      timeFilter === opt
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 4 Metric Cards in a row matching reference picture */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#111A2E] rounded-2xl p-5 sm:p-6 border border-slate-200/70 dark:border-slate-800 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {s.value}
                </div>
                <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                  {s.label}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span>{s.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 4 Analytics Panels in 2x2 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Panel 1: Reports Over Time */}
          <div className="bg-white dark:bg-[#111A2E] rounded-2xl p-5 sm:p-6 border border-slate-200/70 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-4">
              {text.reportsOverTime}
            </h3>

            <div className="relative w-full h-56 sm:h-64 flex items-end">
              {/* Y-axis values & Gridlines */}
              <div className="absolute inset-0 flex flex-col justify-between text-[11px] font-medium text-slate-400 pointer-events-none pb-7">
                <div className="flex items-center gap-2">
                  <span className="w-6 text-right">150</span>
                  <div className="flex-1 border-b border-slate-100 dark:border-slate-800" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 text-right">100</span>
                  <div className="flex-1 border-b border-slate-100 dark:border-slate-800" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 text-right">50</span>
                  <div className="flex-1 border-b border-slate-100 dark:border-slate-800" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 text-right">0</span>
                  <div className="flex-1 border-b border-slate-100 dark:border-slate-800" />
                </div>
              </div>

              {/* SVG Area & Polyline */}
              <svg className="w-full h-full overflow-visible z-10" viewBox="0 0 500 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Shaded Area */}
                <path d={areaPathD} fill="url(#areaGradient)" />

                {/* Line */}
                <path
                  d={linePathD}
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Points */}
                {linePoints.map((pt, i) => (
                  <g key={i}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="5.5"
                      className="fill-white dark:fill-slate-900 stroke-[#2563EB] stroke-[3px] hover:scale-125 transition-transform cursor-pointer"
                      onMouseEnter={() => setHoveredPoint(pt)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  </g>
                ))}
              </svg>

              {/* Point Tooltip */}
              {hoveredPoint && (
                <div
                  className="absolute bg-slate-900 text-white text-[11px] font-bold px-2 py-1 rounded-md shadow-md pointer-events-none transform -translate-x-1/2 -translate-y-full transition-all"
                  style={{
                    left: `${(hoveredPoint.x / 500) * 100}%`,
                    top: `${(hoveredPoint.y / 200) * 100 - 10}%`,
                  }}
                >
                  {hoveredPoint.month}: {hoveredPoint.val} reports
                </div>
              )}

              {/* X-axis labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between pl-10 pr-4 text-xs font-semibold text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                {linePoints.map((pt) => (
                  <span key={pt.month}>{pt.month}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Panel 2: Issues by Category */}
          <div className="bg-white dark:bg-[#111A2E] rounded-2xl p-5 sm:p-6 border border-slate-200/70 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-4">
              {text.issuesByCategory}
            </h3>

            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
              {/* Donut Chart with Center Text */}
              <div className="relative w-44 h-44 sm:w-48 sm:h-48 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                  {categoryArcs.map((arc, idx) => (
                    <circle
                      key={idx}
                      cx="100"
                      cy="100"
                      r="70"
                      fill="none"
                      stroke={arc.color}
                      strokeWidth="24"
                      strokeDasharray={arc.strokeDasharray}
                      strokeDashoffset={arc.strokeDashoffset}
                      className="hover:opacity-85 transition-opacity cursor-pointer"
                    />
                  ))}
                </svg>

                {/* Center Badge */}
                <div className="absolute text-center pointer-events-none">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                    2,450
                  </div>
                  <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    {text.total}
                  </div>
                </div>
              </div>

              {/* Legend List matching reference image */}
              <div className="grid grid-cols-1 gap-2.5 w-full sm:w-auto min-w-[180px]">
                {categoryData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white ml-4">{item.percent}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Panel 3: Ward Wise Distribution */}
          <div className="bg-white dark:bg-[#111A2E] rounded-2xl p-5 sm:p-6 border border-slate-200/70 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-4">
              {text.wardWiseDistribution}
            </h3>

            <div className="relative w-full h-56 sm:h-64 flex flex-col justify-between pt-2">
              {/* Y-axis grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between text-[11px] font-medium text-slate-400 pointer-events-none pb-7">
                <div className="flex items-center gap-2">
                  <span className="w-6 text-right">100</span>
                  <div className="flex-1 border-b border-slate-100 dark:border-slate-800" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 text-right">50</span>
                  <div className="flex-1 border-b border-slate-100 dark:border-slate-800" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 text-right">0</span>
                  <div className="flex-1 border-b border-slate-100 dark:border-slate-800" />
                </div>
              </div>

              {/* Bar columns */}
              <div className="relative z-10 h-44 flex items-end justify-between pl-8 pr-2 pb-1">
                {wardData.map((w, idx) => {
                  // Normalize height percentage relative to max ~140
                  const heightPercent = Math.min(100, Math.round((w.height / 140) * 100));
                  return (
                    <div
                      key={idx}
                      className="flex-1 h-full flex flex-col justify-end items-center group relative cursor-pointer px-1"
                      onMouseEnter={() => setHoveredBar(w)}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      {/* Bar with gradient matching screenshot */}
                      <div
                        className="w-full max-w-[18px] sm:max-w-[22px] bg-gradient-to-t from-blue-600 via-indigo-600 to-blue-500 rounded-t-md transition-all group-hover:brightness-110"
                        style={{ height: `${heightPercent}%` }}
                      />

                      {/* Tooltip */}
                      {hoveredBar === w && (
                        <div className="absolute -top-7 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow pointer-events-none z-20 whitespace-nowrap">
                          {w.ward}: {w.count}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* X-axis labels */}
              <div className="border-t border-slate-100 dark:border-slate-800 pl-8 pr-2 pt-2 flex justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {wardData.map((w, idx) => (
                  <span key={idx} className="flex-1 text-center truncate">
                    {idx === 0 ? 'Ward 1' : w.ward.replace('Ward ', '')}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Panel 4: Status Overview */}
          <div className="bg-white dark:bg-[#111A2E] rounded-2xl p-5 sm:p-6 border border-slate-200/70 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-4">
              {text.statusOverview}
            </h3>

            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
              {/* Donut Chart with Center Text (384 Total) */}
              <div className="relative w-44 h-44 sm:w-48 sm:h-48 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                  {statusArcs.map((arc, idx) => (
                    <circle
                      key={idx}
                      cx="100"
                      cy="100"
                      r="70"
                      fill="none"
                      stroke={arc.color}
                      strokeWidth="24"
                      strokeDasharray={arc.strokeDasharray}
                      strokeDashoffset={arc.strokeDashoffset}
                      className="hover:opacity-85 transition-opacity cursor-pointer"
                    />
                  ))}
                </svg>

                {/* Center Badge */}
                <div className="absolute text-center pointer-events-none">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                    384
                  </div>
                  <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    {text.total}
                  </div>
                </div>
              </div>

              {/* Legend List matching reference image */}
              <div className="grid grid-cols-1 gap-2.5 w-full sm:w-auto min-w-[180px]">
                {statusData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white ml-4">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
