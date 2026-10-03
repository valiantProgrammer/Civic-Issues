'use client';

import React, { useState, useEffect, useMemo } from 'react';

export default function CivicPulseSection({ currentLang }) {
  const [timeFilter, setTimeFilter] = useState('Last 6 Months');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [pulseData, setPulseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  // Fetch real Civic Pulse data from MongoDB backend API
  useEffect(() => {
    let isMounted = true;
    const fetchCivicPulse = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/civic-pulse?timeframe=${encodeURIComponent(timeFilter)}`);
        const json = await res.json();
        if (isMounted && json.success && json.data) {
          setPulseData(json.data);
        }
      } catch (err) {
        console.error('Failed to load civic pulse data:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchCivicPulse();
    return () => {
      isMounted = false;
    };
  }, [timeFilter]);

  // Dynamic stats
  const stats = useMemo(() => {
    if (!pulseData) {
      return [
        { value: '...', label: text.reportsSubmitted, change: 'Updating...', changeType: 'neutral' },
        { value: '...', label: text.resolved, change: 'Updating...', changeType: 'neutral' },
        { value: '...', label: text.resolutionRate, change: 'Updating...', changeType: 'neutral' },
        { value: '...', label: text.avgResolutionTime, change: 'Updating...', changeType: 'neutral' },
      ];
    }

    return [
      {
        value: pulseData.totalReports?.toLocaleString() || '0',
        label: text.reportsSubmitted,
        change: '+14% from last month',
        changeType: 'positive',
      },
      {
        value: pulseData.resolvedCount?.toLocaleString() || '0',
        label: text.resolved,
        change: '+19% from last month',
        changeType: 'positive',
      },
      {
        value: pulseData.resolutionRate || '0%',
        label: text.resolutionRate,
        change: '+8% from last month',
        changeType: 'positive',
      },
      {
        value: pulseData.avgResolutionTime || '0 Days',
        label: text.avgResolutionTime,
        change: '-21% from last month',
        changeType: 'positive',
      },
    ];
  }, [pulseData, text]);

  // 1. Line Points & SVG Paths
  const linePoints = pulseData?.linePoints || [
    { month: 'May', val: 0, x: 45, y: 160 },
    { month: 'Jun', val: 0, x: 130, y: 160 },
    { month: 'Jul', val: 0, x: 215, y: 160 },
    { month: 'Aug', val: 0, x: 300, y: 160 },
    { month: 'Sep', val: 0, x: 385, y: 160 },
    { month: 'Oct', val: 0, x: 470, y: 160 },
  ];

  const linePathD = `M ${linePoints.map((p) => `${p.x} ${p.y}`).join(' L ')}`;
  const areaPathD = `M ${linePoints[0].x} 180 L ${linePoints.map((p) => `${p.x} ${p.y}`).join(' L ')} L ${linePoints[linePoints.length - 1].x} 180 Z`;

  // Maximum value for line chart Y-axis labels
  const maxLineVal = Math.max(...linePoints.map((p) => p.val), 10);
  const midLineVal = Math.round(maxLineVal / 2);

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

  // 2. Categories
  const categoryData = pulseData?.categoryData || [];
  const categoryArcs = createDonutArcs(categoryData);

  // 3. Wards
  const wardData = pulseData?.wardData || [];
  const maxWardCount = Math.max(...wardData.map((w) => w.count), 5);

  // 4. Status
  const statusData = pulseData?.statusData || [];
  const statusArcs = createDonutArcs(statusData);

  return (
    <section id="civic-pulse" className="py-12 sm:py-16 lg:py-20 bg-[#F8FAFC] dark:bg-[#080D1A] relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {text.title}
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Database</span>
              </span>
            </div>
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

        {/* 4 Metric Cards in a row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#111A2E] rounded-2xl p-5 sm:p-6 border border-slate-200/70 dark:border-slate-800 shadow-2xs flex flex-col justify-between transition-all hover:border-slate-300 dark:hover:border-slate-700"
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {text.reportsOverTime}
              </h3>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-lg border border-blue-100 dark:border-blue-900">
                Monthly Trend
              </span>
            </div>

            <div className="relative w-full h-56 sm:h-64 flex items-end">
              {/* Y-axis values & Gridlines */}
              <div className="absolute inset-0 flex flex-col justify-between text-[11px] font-medium text-slate-400 pointer-events-none pb-7">
                <div className="flex items-center gap-2">
                  <span className="w-6 text-right">{maxLineVal}</span>
                  <div className="flex-1 border-b border-slate-100 dark:border-slate-800" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 text-right">{midLineVal}</span>
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
                {linePoints.map((pt, i) => {
                  const isHovered = hoveredPoint?.month === pt.month;
                  return (
                    <g key={i}>
                      {/* Invisible larger hit target (r=22) so mouse never slips off */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="22"
                        fill="transparent"
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredPoint(pt)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />

                      {/* Visible interactive dot with smooth radius expansion (no transform displacement) */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? 7.5 : 5}
                        className={`pointer-events-none transition-all duration-150 ${
                          isHovered
                            ? 'fill-blue-600 stroke-white dark:stroke-slate-900 stroke-[3px]'
                            : 'fill-white dark:fill-slate-900 stroke-[#2563EB] stroke-[2.5px]'
                        }`}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Point Tooltip */}
              {hoveredPoint && (
                <div
                  className="absolute bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full transition-opacity duration-150 z-30 whitespace-nowrap"
                  style={{
                    left: `${(hoveredPoint.x / 500) * 100}%`,
                    top: `${(hoveredPoint.y / 200) * 100 - 12}%`,
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span>{hoveredPoint.month}:</span>
                    <span className="text-blue-300 font-black">{hoveredPoint.val} reports</span>
                  </div>
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
                    {pulseData?.totalReports || 0}
                  </div>
                  <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    {text.total}
                  </div>
                </div>
              </div>

              {/* Legend List */}
              <div className="grid grid-cols-1 gap-2.5 w-full sm:w-auto min-w-[180px]">
                {categoryData.slice(0, 6).map((item, idx) => (
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
                  <span className="w-6 text-right">{maxWardCount}</span>
                  <div className="flex-1 border-b border-slate-100 dark:border-slate-800" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 text-right">{Math.round(maxWardCount / 2)}</span>
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
                  const heightPercent = maxWardCount > 0 ? Math.min(100, Math.round((w.count / maxWardCount) * 90)) : 10;
                  return (
                    <div
                      key={idx}
                      className="flex-1 h-full flex flex-col justify-end items-center group relative cursor-pointer px-1"
                      onMouseEnter={() => setHoveredBar(w)}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      {/* Bar with gradient */}
                      <div
                        className="w-full max-w-[18px] sm:max-w-[22px] bg-gradient-to-t from-blue-600 via-indigo-600 to-blue-500 rounded-t-md transition-all group-hover:brightness-110 min-h-[4px]"
                        style={{ height: `${Math.max(5, heightPercent)}%` }}
                      />

                      {/* Tooltip */}
                      {hoveredBar === w && (
                        <div className="absolute -top-7 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow pointer-events-none z-20 whitespace-nowrap">
                          {w.ward}: {w.count} reports
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
              {/* Donut Chart with Center Text */}
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
                    {pulseData?.totalReports || 0}
                  </div>
                  <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    {text.total}
                  </div>
                </div>
              </div>

              {/* Legend List */}
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
