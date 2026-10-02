'use client';

import React from 'react';

export default function CivicPulseSection({ currentLang }) {
  const t = {
    en: {
      badge: 'Real-Time Governance',
      title: 'Civic Pulse & Impact Metrics',
      subtitle: 'Transparent monitoring of city-wide problem turnaround and municipal department accountability.',
      avgResolution: '48.4 hrs',
      avgResolutionLabel: 'Average Resolution Time',
      satisfaction: '94.2%',
      satisfactionLabel: 'Citizen Satisfaction Rate',
      activeWards: '42 / 48',
      activeWardsLabel: 'Active Municipal Wards',
      aiAccuracy: '98.7%',
      aiAccuracyLabel: 'AI Image Verification Accuracy',
      wardHeader: 'Top Performing Wards this Month',
    },
    hi: {
      badge: 'वास्तविक समय निगरानी',
      title: 'सिविक पल्स और प्रभाव मेट्रिक्स',
      subtitle: 'शहर भर में समस्याओं के समाधान और नगरपालिका विभाग की जवाबदेही की पारदर्शी निगरानी।',
      avgResolution: '48.4 घंटे',
      avgResolutionLabel: 'औसत समाधान समय',
      satisfaction: '94.2%',
      satisfactionLabel: 'नागरिक संतुष्टि दर',
      activeWards: '42 / 48',
      activeWardsLabel: 'सक्रिय नगर निगम वार्ड',
      aiAccuracy: '98.7%',
      aiAccuracyLabel: 'एआई सत्यापन सटीकता',
      wardHeader: 'इस महीने के शीर्ष प्रदर्शन करने वाले वार्ड',
    },
  };

  const text = t[currentLang] || t.en;

  const topWards = [
    { name: 'Ward 12 - Civil Lines', resolved: 312, rate: '97%', badge: 'Top Performer' },
    { name: 'Ward 08 - Lakeview District', resolved: 284, rate: '94%', badge: 'Fastest Response' },
    { name: 'Ward 14 - Metro Central', resolved: 265, rate: '92%', badge: 'High Activity' },
    { name: 'Ward 21 - Market Hub', resolved: 248, rate: '89%', badge: 'Improving' },
  ];

  return (
    <section id="civic-pulse" className="py-14 lg:py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-left mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-ping" />
            {text.badge}
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold tracking-tight text-slate-900">
            {text.title}
          </h2>
          <p className="mt-1 text-sm sm:text-base text-slate-500 font-normal max-w-2xl">
            {text.subtitle}
          </p>
        </div>

        {/* Pulse Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-50/60 to-white p-5 sm:p-6 rounded-2xl border border-blue-100 shadow-xs">
            <div className="text-3xl sm:text-4xl font-black text-blue-600 tracking-tight">
              {text.avgResolution}
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-600 mt-2">
              {text.avgResolutionLabel}
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50/60 to-white p-5 sm:p-6 rounded-2xl border border-emerald-100 shadow-xs">
            <div className="text-3xl sm:text-4xl font-black text-emerald-600 tracking-tight">
              {text.satisfaction}
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-600 mt-2">
              {text.satisfactionLabel}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50/60 to-white p-5 sm:p-6 rounded-2xl border border-purple-100 shadow-xs">
            <div className="text-3xl sm:text-4xl font-black text-purple-600 tracking-tight">
              {text.activeWards}
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-600 mt-2">
              {text.activeWardsLabel}
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50/60 to-white p-5 sm:p-6 rounded-2xl border border-amber-100 shadow-xs">
            <div className="text-3xl sm:text-4xl font-black text-amber-600 tracking-tight">
              {text.aiAccuracy}
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-600 mt-2">
              {text.aiAccuracyLabel}
            </div>
          </div>
        </div>

        {/* Ward Accountability Table Card */}
        <div className="bg-slate-50/70 rounded-2xl p-6 sm:p-8 border border-slate-100">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-5">
            {text.wardHeader}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topWards.map((w, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                      {w.badge}
                    </span>
                    <span className="text-xs font-bold text-emerald-600">
                      {w.rate}
                    </span>
                  </div>
                  <div className="font-bold text-slate-800 text-sm">
                    {w.name}
                  </div>
                </div>
                <div className="text-xs text-slate-500 font-medium mt-3 pt-2 border-t border-slate-100">
                  {w.resolved} issues resolved
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
