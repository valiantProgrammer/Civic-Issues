'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function AdministrationEscalationsView() {
  const [escalations, setEscalations] = useState([
    {
      id: 'ESC-401',
      ticketId: 'CIVIC-20260928-E91P',
      title: 'Open Deep Sewer Trench near Primary School',
      ward: 'Ward 11',
      severity: 'Critical',
      breachedBy: 'Overdue by 18 hours',
      escalationReason: 'Safety hazard to children. Ward officer unresponsive.',
      department: 'Drainage & Sewerage',
      contactOfficer: 'R. Bannerjee (+91 98765 11002)',
      status: 'Action Required',
    },
    {
      id: 'ESC-402',
      ticketId: 'CIVIC-20260929-W22L',
      title: 'Contaminated Drinking Water Odor in Apartment Complex',
      ward: 'Ward 7',
      severity: 'Critical',
      breachedBy: 'Overdue by 12 hours',
      escalationReason: 'Health risk. Multiple citizen re-reports in 24 hours.',
      department: 'Water Quality Inspection',
      contactOfficer: 'M. Mukherjee (+91 98765 07001)',
      status: 'Action Required',
    },
    {
      id: 'ESC-403',
      ticketId: 'CIVIC-20260930-R77X',
      title: 'Main Arterial Road Cave-in after Water Burst',
      ward: 'Ward 12',
      severity: 'High',
      breachedBy: 'Overdue by 6 hours',
      escalationReason: 'Major traffic bottleneck affecting 15 bus routes.',
      department: 'Roads & Infrastructure',
      contactOfficer: 'A. Sen (+91 98765 12004)',
      status: 'Investigating',
    },
  ]);

  const handleExecutiveAction = (id, action) => {
    setEscalations((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status: `Executive ${action} Dispatched` } : e
      )
    );
    toast.success(`Executive ${action} triggered for ${id}!`);
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Urgent Escalations & SLA Breaches
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Executive oversight center for critical civic hazards and overdue municipal tickets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            {escalations.length} Active Escalations
          </span>
        </div>
      </div>

      {/* Escalations List */}
      <div className="space-y-4">
        {escalations.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-5 sm:p-6 border-l-4 border-l-rose-500 border border-slate-100 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200">
                    {item.severity}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    {item.ticketId}
                  </span>
                  <span className="text-xs text-slate-300">•</span>
                  <span className="text-xs font-semibold text-slate-600">
                    {item.ward}
                  </span>
                  <span className="text-xs text-slate-300">•</span>
                  <span className="text-xs font-bold text-rose-600 bg-rose-50/50 px-2 py-0.5 rounded">
                    ⚠️ {item.breachedBy}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 mt-1.5">
                  {item.title}
                </h2>
              </div>

              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 self-start">
                {item.status}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
              <div className="text-slate-700 font-medium">
                <strong className="text-slate-900">Escalation Trigger: </strong>
                {item.escalationReason}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-slate-500">
                <span>Dept: <strong className="text-slate-800">{item.department}</strong></span>
                <span>Ward Officer: <strong className="text-slate-800">{item.contactOfficer}</strong></span>
              </div>
            </div>

            {/* Direct Executive Actions */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleExecutiveAction(item.id, 'Intervention Order')}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                Issue Show-Cause Notice
              </button>

              <button
                type="button"
                onClick={() => handleExecutiveAction(item.id, 'Emergency Flying Squad')}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>⚡ Dispatch Emergency Flying Squad</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
