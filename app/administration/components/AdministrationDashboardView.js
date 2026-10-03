'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function AdministrationDashboardView({
  openCount = 142,
  assignedCount = 43,
  inProgressCount = 61,
  completedCount = 38,
  onViewAllIssues,
}) {
  const [priorities, setPriorities] = useState([
    {
      id: 'p-1',
      title: 'Water Leakage - Ward 7',
      sla: 'SLA: 4 hours',
      priority: 'High',
      priorityStyle: 'bg-rose-50 text-rose-600 border-rose-200',
      iconColor: 'bg-rose-500 text-white',
      department: 'Water Works Division',
      ward: 'Ward 7',
      assigned: false,
    },
    {
      id: 'p-2',
      title: 'Road Damage - Ward 12',
      sla: 'SLA: 1 day',
      priority: 'Medium',
      priorityStyle: 'bg-amber-50 text-amber-600 border-amber-200',
      iconColor: 'bg-amber-500 text-white',
      department: 'Roads & Infrastructure',
      ward: 'Ward 12',
      assigned: false,
    },
    {
      id: 'p-3',
      title: 'Garbage Collection - Ward 5',
      sla: 'SLA: 4 hours',
      priority: 'High',
      priorityStyle: 'bg-rose-50 text-rose-600 border-rose-200',
      iconColor: 'bg-emerald-500 text-white',
      department: 'Solid Waste Management',
      ward: 'Ward 5',
      assigned: false,
    },
    {
      id: 'p-4',
      title: 'Street Light Failure - Ward 8',
      sla: 'SLA: 8 hours',
      priority: 'Medium',
      priorityStyle: 'bg-amber-50 text-amber-600 border-amber-200',
      iconColor: 'bg-blue-500 text-white',
      department: 'Electrical Maintenance',
      ward: 'Ward 8',
      assigned: false,
    },
  ]);

  const [selectedTask, setSelectedTask] = useState(null);
  const [assignee, setAssignee] = useState('Rapid Response Crew Alpha');
  const [department, setDepartment] = useState('Water Works Division');
  const [notes, setNotes] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  const handleOpenAssignModal = (task) => {
    setSelectedTask(task);
    setDepartment(task.department);
    setAssignee('Rapid Response Crew Alpha');
    setNotes('');
  };

  const handleConfirmAssignment = (e) => {
    e.preventDefault();
    setIsAssigning(true);

    setTimeout(() => {
      setPriorities((prev) =>
        prev.map((item) =>
          item.id === selectedTask.id
            ? { ...item, assigned: true, assigneeName: assignee }
            : item
        )
      );
      toast.success(`${selectedTask.title} assigned to ${assignee}!`);
      setIsAssigning(false);
      setSelectedTask(null);
    }, 500);
  };

  return (
    <div className="w-full space-y-6">
      
      {/* 1. Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Municipal Control Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage and resolve civic issues efficiently.
        </p>
      </div>

      {/* 2. Top 4 Stat Metric Cards matching the reference screenshot */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1: Open Cases */}
        <div className="bg-white dark:bg-[#111A2E] rounded-2xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {openCount}
          </div>
          <div className="text-xs font-semibold text-slate-400 dark:text-slate-400 mt-1">
            Open Cases
          </div>
        </div>

        {/* Card 2: Assigned */}
        <div className="bg-white dark:bg-[#111A2E] rounded-2xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {assignedCount}
          </div>
          <div className="text-xs font-semibold text-slate-400 dark:text-slate-400 mt-1">
            Assigned
          </div>
        </div>

        {/* Card 3: In Progress (Blue) */}
        <div className="bg-white dark:bg-[#111A2E] rounded-2xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
          <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">
            {inProgressCount}
          </div>
          <div className="text-xs font-semibold text-slate-400 dark:text-slate-400 mt-1">
            In Progress
          </div>
        </div>

        {/* Card 4: Completed */}
        <div className="bg-white dark:bg-[#111A2E] rounded-2xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {completedCount}
          </div>
          <div className="text-xs font-semibold text-slate-400 dark:text-slate-400 mt-1">
            Completed
          </div>
        </div>

      </div>

      {/* 3. Today's Priorities Section matching the reference screenshot */}
      <div className="bg-white dark:bg-[#111A2E] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        
        {/* Section Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Today&apos;s Priorities
          </h2>
          <button
            type="button"
            onClick={onViewAllIssues}
            className="text-xs font-bold text-slate-400 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>All (14)</span>
            <span>→</span>
          </button>
        </div>

        {/* Priority Items List with connected timeline dots */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {priorities.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
            >
              {/* Left: Icon node & Details */}
              <div className="flex items-center gap-4 min-w-0">
                {/* Node icon */}
                <div className={`w-8 h-8 rounded-full ${item.iconColor} flex items-center justify-center font-bold text-xs shadow-sm shrink-0`}>
                  ✓
                </div>

                {/* Content */}
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base truncate">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-400 font-medium mt-0.5">
                    <span>{item.sla}</span>
                    {item.assigned && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          Assigned to {item.assigneeName}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Priority Badge & Assign Action Button */}
              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    item.priority === 'High'
                      ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                      : 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                  }`}
                >
                  {item.priority}
                </span>

                <button
                  type="button"
                  onClick={() => handleOpenAssignModal(item)}
                  className={`px-5 py-2 rounded-xl font-semibold text-xs sm:text-sm shadow-sm transition-all cursor-pointer ${
                    item.assigned
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-blue-500/20'
                  }`}
                >
                  {item.assigned ? 'Reassign' : 'Assign'}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Assignment Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#111A2E] rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-lg overflow-hidden transition-colors">
            
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Assign Task & Dispatch Crew
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {selectedTask.title} • {selectedTask.sla}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmAssignment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Assigned Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-800 dark:text-slate-100 transition-all font-medium bg-white dark:bg-[#0B132B]"
                >
                  <option value="Water Works Division">Water Works Division</option>
                  <option value="Roads & Infrastructure">Roads & Infrastructure</option>
                  <option value="Solid Waste Management">Solid Waste Management</option>
                  <option value="Electrical Maintenance">Electrical Maintenance</option>
                  <option value="Health & Vector Control">Health & Vector Control</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Crew Lead / Contractor
                </label>
                <select
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-800 dark:text-slate-100 transition-all font-medium bg-white dark:bg-[#0B132B]"
                >
                  <option value="Rapid Response Crew Alpha">Rapid Response Crew Alpha (Lead: R. Roy)</option>
                  <option value="Zonal Maintenance Squad 3">Zonal Maintenance Squad 3 (Lead: D. Ghosh)</option>
                  <option value="Emergency Pipeline Unit 2">Emergency Pipeline Unit 2 (Lead: M. Das)</option>
                  <option value="Sanitation Fleet Express">Sanitation Fleet Express (Lead: K. Sen)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Dispatcher Instructions
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Provide urgent dispatch notes or site contact info..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-800 dark:text-slate-100 transition-all font-medium resize-none bg-white dark:bg-[#0B132B] placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedTask(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAssigning}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all disabled:opacity-50 cursor-pointer shadow-blue-500/20"
                >
                  {isAssigning ? 'Dispatching...' : 'Confirm Assignment'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
