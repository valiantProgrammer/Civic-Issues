'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function UserNotificationsView({ onSelectReport }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Your report CIVIC-20261002-A72Q was verified.',
      time: '10 minutes ago',
      category: 'updates',
      ticketId: 'CIVIC-20261002-A72Q',
      unread: true,
      iconColor: 'bg-[#F5F3FF] border border-[#DDD6FE] text-[#7C3AED]',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 20V10a8 8 0 1116 0v10M9 20v-4a3 3 0 016 0v4" />
        </svg>
      ),
    },
    {
      id: 'notif-2',
      title: 'Your report has been forwarded to Ward 8.',
      time: '2 hours ago',
      category: 'updates',
      ticketId: 'CIVIC-20261002-A72Q',
      unread: true,
      iconColor: 'bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB]',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
          <circle cx="12" cy="13" r="7.5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.5v3.5l2.5 2.5M5 5l2.5 2M19 5l-2.5 2" />
        </svg>
      ),
    },
    {
      id: 'notif-3',
      title: 'CIVIC-20260928-91KD has been resolved.',
      time: '1 day ago',
      category: 'resolved',
      ticketId: 'CIVIC-20260928-91KD',
      unread: true,
      iconColor: 'bg-[#FFF7ED] border border-[#FED7AA] text-[#EA580C]',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
          <circle cx="12" cy="12" r="8" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12l2.5 2.5 5-5" />
        </svg>
      ),
    },
    {
      id: 'notif-4',
      title: 'Your report CIVIC-20260921-72PA was rejected.',
      time: '3 days ago',
      category: 'system',
      ticketId: 'CIVIC-20260921-72PA',
      unread: true,
      iconColor: 'bg-[#FFF1F2] border border-[#FECDD3] text-[#E11D48]',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v5m0 3h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
      ),
    },
  ]);

  const filterTabs = [
    { id: 'all', label: 'All' },
    { id: 'updates', label: 'Updates' },
    { id: 'resolved', label: 'Resolved' },
    { id: 'system', label: 'System' },
  ];

  const filteredNotifications = notifications.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.category === activeFilter;
  });

  const handleToggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    toast.success('All notifications marked as read');
  };

  return (
    <div className="w-full max-w-4xl py-2">
      
      {/* 1. Header with Title and optional Mark All as Read */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl sm:text-[28px] font-black text-slate-900 dark:text-white tracking-tight">
          Notifications
        </h1>

        <button
          type="button"
          onClick={handleMarkAllRead}
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50/80 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer"
        >
          Mark all as read
        </button>
      </div>

      {/* 2. Filter Pills matching the screenshot exactly */}
      <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap mb-6">
        {filterTabs.map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-blue-50/80 dark:bg-slate-800/80 text-blue-600 dark:text-blue-400 hover:bg-blue-100/90 dark:hover:bg-slate-700/80'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 3. Notification List with clean dividers matching the screenshot */}
      <div className="w-full divide-y divide-slate-100 dark:divide-slate-800/80">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                handleToggleRead(notif.id);
                if (notif.ticketId && onSelectReport) {
                  onSelectReport({ id: notif.ticketId, ticketId: notif.ticketId });
                }
              }}
              className="py-4.5 sm:py-5 flex items-center justify-between gap-4 transition-colors cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/40 rounded-xl px-2 -mx-2 group"
            >
              {/* Left: Colored rounded icon & Details */}
              <div className="flex items-center gap-4 min-w-0">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${notif.iconColor}`}
                >
                  {notif.icon}
                </div>

                <div className="min-w-0">
                  <h3 className="text-[15px] sm:text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {notif.title}
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-normal mt-0.5">
                    {notif.time}
                  </p>
                </div>
              </div>

              {/* Right: Solid blue dot indicator matching the screenshot */}
              <div className="shrink-0 flex items-center justify-center w-5">
                {notif.unread && (
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm font-medium">
            No notifications in this category.
          </div>
        )}
      </div>

    </div>
  );
}
