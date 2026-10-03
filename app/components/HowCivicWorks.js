'use client';

import React from 'react';

export default function HowCivicWorks({ currentLang }) {
  const content = {
    en: {
      title: 'How Civic साथी Works',
      subtitle: 'A simple process for a cleaner, safer and better city.',
      steps: [
        {
          number: '01',
          numColor: 'text-blue-600',
          badgeBg: 'bg-blue-50 text-blue-600',
          title: 'Report',
          desc: 'Upload photo, add location and describe the issue.',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
        },
        {
          number: '02',
          numColor: 'text-blue-600',
          badgeBg: 'bg-amber-50 text-amber-500',
          title: 'Verify',
          desc: 'Our team reviews and verifies the report.',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          ),
        },
        {
          number: '03',
          numColor: 'text-emerald-600',
          badgeBg: 'bg-emerald-50 text-emerald-600',
          title: 'Resolve',
          desc: 'Forwarded to the right department and resolved.',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          ),
        },
        {
          number: '04',
          numColor: 'text-purple-600',
          badgeBg: 'bg-blue-50 text-blue-600',
          title: 'Improve',
          desc: 'Track progress and help build a better community.',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          ),
        },
      ],
    },
    hi: {
      title: 'Civic साथी कैसे काम करता है',
      subtitle: 'एक स्वच्छ, सुरक्षित और बेहतर शहर के लिए एक सरल प्रक्रिया।',
      steps: [
        {
          number: '01',
          numColor: 'text-blue-600',
          badgeBg: 'bg-blue-50 text-blue-600',
          title: 'रिपोर्ट करें',
          desc: 'फोटो अपलोड करें, स्थान जोड़ें और समस्या का विवरण दें।',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
        },
        {
          number: '02',
          numColor: 'text-blue-600',
          badgeBg: 'bg-amber-50 text-amber-500',
          title: 'सत्यापित करें',
          desc: 'हमारी टीम रिपोर्ट की समीक्षा और सत्यापन करती है।',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          ),
        },
        {
          number: '03',
          numColor: 'text-emerald-600',
          badgeBg: 'bg-emerald-50 text-emerald-600',
          title: 'समाधान करें',
          desc: 'संबंधित विभाग को अग्रेषित किया गया और समाधान किया गया।',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          ),
        },
        {
          number: '04',
          numColor: 'text-purple-600',
          badgeBg: 'bg-blue-50 text-blue-600',
          title: 'सुधार करें',
          desc: 'प्रगति को ट्रैक करें और एक बेहतर समुदाय बनाने में मदद करें।',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          ),
        },
      ],
    },
  };

  const t = content[currentLang] || content.en;

  return (
    <section id="how-it-works" className="py-12 lg:py-16 bg-white dark:bg-[#080D1A] relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-left mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold tracking-tight text-slate-900 dark:text-white">
            {t.title}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400 font-normal">
            {t.subtitle}
          </p>
        </div>

        {/* 4 Process Cards Row with Connecting Arrows */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch relative">
          {t.steps.map((step, idx) => (
            <React.Fragment key={idx}>
              {/* Process Card */}
              <div className="relative bg-white dark:bg-[#111A2E] rounded-2xl p-6 sm:p-7 border border-slate-100 dark:border-slate-800/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)] hover:shadow-lg dark:hover:border-slate-700 transition-all duration-300 flex flex-col justify-between group">
                
                {/* Card Top: Number & Icon Badge */}
                <div className="flex items-center justify-between">
                  <span className={`text-xl sm:text-2xl font-black ${step.numColor} dark:text-blue-400`}>
                    {step.number}
                  </span>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${step.badgeBg} dark:bg-slate-800 dark:text-blue-400`}>
                    {step.icon}
                  </div>
                </div>

                {/* Card Bottom: Title & Description */}
                <div className="mt-6">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>

              </div>

              {/* Arrow separator (hidden on mobile, shown between cards on large screens) */}
              {idx < t.steps.length - 1 && (
                <div className="hidden lg:flex items-center justify-center absolute z-10 pointer-events-none -translate-y-1/2 top-1/2"
                  style={{ left: `calc(${(idx + 1) * 25}% - 14px)` }}
                >
                  <div className="w-7 h-7 rounded-full bg-white dark:bg-[#0B132B] shadow-xs border border-slate-100 dark:border-slate-800 flex items-center justify-center text-blue-500 dark:text-blue-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

      </div>
    </section>
  );
}
