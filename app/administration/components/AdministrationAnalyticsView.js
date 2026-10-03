'use client';

import React, { useState } from 'react';
import { FaLightbulb } from "react-icons/fa";
export default function AdministrationAnalyticsView() {
  const [timeRange, setTimeRange] = useState('30days');

  const categories = [
    { name: 'Roads & Infrastructure', count: 412, percentage: 33, color: 'bg-blue-600' },
    { name: 'Water Works & Pipelines', count: 320, percentage: 26, color: 'bg-cyan-500' },
    { name: 'Solid Waste & Sanitation', count: 285, percentage: 23, color: 'bg-emerald-500' },
    { name: 'Street Lighting & Power', count: 145, percentage: 12, color: 'bg-amber-500' },
    { name: 'Drainage & Vector Control', count: 86, percentage: 6, color: 'bg-purple-500' },
  ];

  const wardRankings = [
    { rank: 1, ward: 'Ward 8 - Park Street', issuesResolved: 142, avgHours: '9.2 hrs', score: '98%', status: 'Top Performer' },
    { rank: 2, ward: 'Ward 5 - Shyambazar', issuesResolved: 118, avgHours: '11.5 hrs', score: '95%', status: 'Excellent' },
    { rank: 3, ward: 'Ward 12 - Salt Lake', issuesResolved: 135, avgHours: '13.1 hrs', score: '93%', status: 'Good' },
    { rank: 4, ward: 'Ward 11 - Alipore', issuesResolved: 94, avgHours: '14.8 hrs', score: '90%', status: 'Good' },
    { rank: 5, ward: 'Ward 3 - Dum Dum', issuesResolved: 76, avgHours: '19.4 hrs', score: '82%', status: 'Attention Needed' },
  ];

  return (
    <div className="w-full space-y-6">

      {/* 1. Analytics Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Municipal Analytics & Performance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time telemetry, SLA compliance, department velocity, and civic trends.
          </p>
        </div>

        {/* Time range selector */}
        <div className="flex items-center gap-1.5 bg-white dark:bg-[#111A2E] p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          {['7days', '30days', '90days'].map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${timeRange === range
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              {range === '7days' ? 'Last 7 Days' : range === '30days' ? 'Last 30 Days' : 'Last Quarter'}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Key KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

        {/* Metric 1 */}
        <div className="bg-white dark:bg-[#111A2E] rounded-2xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">Total Cases</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">+12.4%</span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2 tracking-tight">
            1,248
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Processed this period
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-[#111A2E] rounded-2xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">Avg SLA Time</span>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-full">-3.2 hrs</span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400 mt-2 tracking-tight">
            14.2h
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Against 24h municipal target
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-[#111A2E] rounded-2xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">Resolution Rate</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">+4.1%</span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2 tracking-tight">
            89.4%
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Citizen verified resolutions
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white dark:bg-[#111A2E] rounded-2xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">Escalation Ratio</span>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">Low</span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2 tracking-tight">
            2.8%
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Only 35 cases required intervention
          </div>
        </div>

      </div>

      {/* 3. Category Breakdown & Department SLA Meters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Category Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#111A2E] rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            Issue Distribution by Category
          </h2>

          <div className="space-y-4">
            {categories.map((cat) => (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>{cat.name}</span>
                  <span>{cat.count} cases ({cat.percentage}%)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${cat.color}`}
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Primary driver: Road repair & monsoon potholes</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400 cursor-pointer">Download CSV Report ↓</span>
          </div>
        </div>

        {/* Monthly Velocity & Health Indicator (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#111A2E] rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            Department SLA Health
          </h2>

          <div className="space-y-4">
            {[
              { dept: 'Solid Waste Management', compliance: '96%', color: 'text-emerald-600 dark:text-emerald-400' },
              { dept: 'Water Supply Department', compliance: '92%', color: 'text-blue-600 dark:text-blue-400' },
              { dept: 'Electrical Maintenance', compliance: '88%', color: 'text-emerald-600 dark:text-emerald-400' },
              { dept: 'Roads & Infrastructure', compliance: '84%', color: 'text-amber-600 dark:text-amber-400' },
              { dept: 'Drainage & Vector Control', compliance: '82%', color: 'text-amber-600 dark:text-amber-400' },
            ].map((d) => (
              <div key={d.dept} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 dark:bg-[#0B132B] border border-slate-100 dark:border-slate-800/80 transition-colors">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{d.dept}</span>
                <span className={`text-sm font-extrabold ${d.color}`}>{d.compliance}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 flex items-start gap-2.5">
            <span className="text-blue-600 dark:text-blue-400 text-sm"><FaLightbulb /></span>
            <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
              Recommendation: Dispatch 2 additional road maintenance crews to Ward 3 & 12 to bring overall municipal compliance above 90%.
            </p>
          </div>
        </div>

      </div>

      {/* 4. Ward Responsiveness Ranking Table */}
      <div className="bg-white dark:bg-[#111A2E] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Ward Performance & Responsiveness Ranking
          </h2>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-400">
            Updated hourly
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-[#0B132B] text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Ward / Neighborhood</th>
                <th className="py-3 px-4">Resolved Cases</th>
                <th className="py-3 px-4">Avg Speed</th>
                <th className="py-3 px-4">SLA Score</th>
                <th className="py-3 px-4">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {wardRankings.map((w) => (
                <tr key={w.rank} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">#{w.rank}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">{w.ward}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-600 dark:text-slate-300">{w.issuesResolved}</td>
                  <td className="py-3.5 px-4 font-mono font-medium text-blue-600 dark:text-blue-400">{w.avgHours}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{w.score}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${w.status === 'Top Performer'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                          : w.status === 'Excellent' || w.status === 'Good'
                            ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'
                            : 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                        }`}
                    >
                      {w.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
