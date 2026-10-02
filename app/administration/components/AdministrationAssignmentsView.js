'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function AdministrationAssignmentsView() {
  const [assignments, setAssignments] = useState([
    {
      id: 'ASN-101',
      title: 'Water Leakage Repair - Ward 7',
      department: 'Water Works Division',
      crewLead: 'R. Roy (Crew Alpha)',
      dispatchedAt: 'Today, 08:30 AM',
      slaDeadline: 'Today, 12:30 PM (4h SLA)',
      progress: 65,
      status: 'On-Site Working',
      statusColor: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    {
      id: 'ASN-102',
      title: 'Asphalt Patching & Road Repair - Ward 12',
      department: 'Roads & Infrastructure',
      crewLead: 'D. Ghosh (Squad 3)',
      dispatchedAt: 'Yesterday, 02:00 PM',
      slaDeadline: 'Today, 02:00 PM (24h SLA)',
      progress: 90,
      status: 'Final Quality Check',
      statusColor: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    {
      id: 'ASN-103',
      title: 'Market Garbage Clearance - Ward 5',
      department: 'Solid Waste Management',
      crewLead: 'K. Sen (Fleet Express)',
      dispatchedAt: 'Today, 09:15 AM',
      slaDeadline: 'Today, 01:15 PM (4h SLA)',
      progress: 40,
      status: 'Compactor En Route',
      statusColor: 'bg-amber-50 text-amber-600 border-amber-200',
    },
    {
      id: 'ASN-104',
      title: 'Street Lighting Cable Replacement - Ward 8',
      department: 'Electrical Maintenance',
      crewLead: 'A. Dutta (Unit 2)',
      dispatchedAt: 'Yesterday, 06:00 PM',
      slaDeadline: 'Today, 10:00 AM (Overdue)',
      progress: 75,
      status: 'Cable Splicing',
      statusColor: 'bg-rose-50 text-rose-600 border-rose-200',
    },
  ]);

  const handleComplete = (id) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, progress: 100, status: 'Completed', statusColor: 'bg-emerald-50 text-emerald-600 border-emerald-200' } : a))
    );
    toast.success('Assignment marked as completed!');
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Crew Assignments & Dispatch
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Monitor active municipal work orders, crew leaders, and field resolution timelines.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Crews in Field</span>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">18 Crews</div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">94% Deployment Rate</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Response Time</span>
          <div className="text-3xl font-extrabold text-blue-600 mt-1">32 mins</div>
          <span className="text-xs text-slate-500 mt-1 block">From ticket approval to dispatch</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Today</span>
          <div className="text-3xl font-extrabold text-emerald-600 mt-1">26 Work Orders</div>
          <span className="text-xs text-slate-500 mt-1 block">Across all 5 departments</span>
        </div>
      </div>

      {/* Assignment List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            Active Work Orders ({assignments.length})
          </h2>
        </div>

        <div className="divide-y divide-slate-100">
          {assignments.map((item) => (
            <div key={item.id} className="p-5 space-y-3 hover:bg-slate-50/70 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">{item.id}</span>
                    <span className="text-xs text-slate-300">•</span>
                    <span className="text-xs font-semibold text-blue-600">{item.department}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mt-0.5">{item.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${item.statusColor}`}>
                    {item.status}
                  </span>
                  {item.progress < 100 && (
                    <button
                      type="button"
                      onClick={() => handleComplete(item.id)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-500 pt-1">
                <div>Lead: <span className="font-semibold text-slate-800">{item.crewLead}</span></div>
                <div>Dispatched: <span className="font-semibold text-slate-800">{item.dispatchedAt}</span></div>
                <div>Target SLA: <span className="font-semibold text-slate-800">{item.slaDeadline}</span></div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>Job Completion</span>
                  <span>{item.progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.progress === 100
                        ? 'bg-emerald-500'
                        : item.progress > 60
                        ? 'bg-blue-600'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
