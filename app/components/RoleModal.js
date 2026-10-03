'use client';

import React from 'react';
import Link from 'next/link';

export default function RoleModal({ isOpen, onClose, title = "Select Portal", currentLang = "en" }) {
  if (!isOpen) return null;

  const roles = [
    {
      title: currentLang === 'hi' ? 'नागरिक पोर्टल' : 'Citizen Portal',
      subtitle: currentLang === 'hi' ? 'समस्याओं की रिपोर्ट करें और ट्रैक करें' : 'Report local problems & track resolution',
      href: '/login/user',
      signupHref: '/signup/user',
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      badge: 'Public',
      badgeColor: 'bg-blue-50 text-blue-700',
    },
    {
      title: currentLang === 'hi' ? 'वार्ड एडमिन' : 'Ward Admin',
      subtitle: currentLang === 'hi' ? 'वार्ड स्तर की समस्याओं का सत्यापन करें' : 'Verify & triage ward level reports',
      href: '/login/admin',
      signupHref: '/signup/admin',
      icon: (
        <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      badge: 'Staff',
      badgeColor: 'bg-amber-50 text-amber-700',
    },
    {
      title: currentLang === 'hi' ? 'नगर निगम प्रशासक' : 'City Administrator',
      subtitle: currentLang === 'hi' ? 'शहरव्यापी विश्लेषण और विभाग प्रबंधन' : 'City-wide analytics & dept allocation',
      href: '/login/administration',
      signupHref: '/signup/administration',
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      badge: 'HQ',
      badgeColor: 'bg-purple-50 text-purple-700',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />

      <div className="relative bg-white dark:bg-[#0B132B] rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md border border-slate-100 dark:border-slate-800 z-10 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="text-left mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 text-xs font-semibold mb-3 border border-blue-200/50 dark:border-blue-800/50">
            Civic साथी
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {title}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {currentLang === 'hi' ? 'जारी रखने के लिए अपनी भूमिका चुनें' : 'Choose your role to continue'}
          </p>
        </div>

        {/* Roles List */}
        <div className="space-y-3">
          {roles.map((role, idx) => (
            <div key={idx} className="group border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 rounded-2xl p-4 transition-all duration-200 hover:shadow-md bg-white dark:bg-[#111A2E] hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
              <Link href={role.href} className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-700 shadow-xs transition-colors">
                  {role.icon}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {role.title}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${role.badgeColor}`}>
                      {role.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {role.subtitle}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {currentLang === 'hi' ? 'नया नागरिक खाता बनाएं?' : "Don't have an account?"}{' '}
            <Link href="/signup/user" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
              {currentLang === 'hi' ? 'साइन अप करें' : 'Sign up'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
