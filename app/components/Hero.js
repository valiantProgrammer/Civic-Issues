'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero({ onOpenLogin, onOpenReport, currentLang }) {
  const [activePin, setActivePin] = useState(null);

  const t = {
    en: {
      title1: 'Your City.',
      title2: 'Your Voice.',
      title3: 'Real Action.',
      subtitle: 'Report local problems, track every step, and help build a better community for everyone.',
      btnReport: 'Report an Issue',
      btnExplore: 'Explore Issues',
      stat1Number: '2,450+',
      stat1Label: 'Reports Submitted',
      stat2Number: '1,870+',
      stat2Label: 'Issues Resolved',
      stat3Number: '42',
      stat3Label: 'Active Wards',
      categories: [
        { label: 'Potholes', color: '#EF4444' },
        { label: 'Street Light', color: '#F59E0B' },
        { label: 'Water Leakage', color: '#0EA5E9' },
        { label: 'Garbage', color: '#10B981' },
        { label: 'Road Damage', color: '#EA580C' },
        { label: 'Other', color: '#8B5CF6' },
      ],
      sampleIssue: {
        title: 'Street Light Issue',
        location: 'Ward 12, Main Road',
        status: 'Verified',
        time: '2 hours ago',
      },
    },
    hi: {
      title1: 'आपका शहर.',
      title2: 'आपकी आवाज़.',
      title3: 'ठोस कार्रवाई.',
      subtitle: 'स्थानीय समस्याओं की रिपोर्ट करें, हर कदम को ट्रैक करें और सभी के लिए एक बेहतर समुदाय बनाएं।',
      btnReport: 'समस्या दर्ज करें',
      btnExplore: 'समस्याएं देखें',
      stat1Number: '2,450+',
      stat1Label: 'दर्ज रिपोर्ट',
      stat2Number: '1,870+',
      stat2Label: 'हल की गई समस्याएं',
      stat3Number: '42',
      stat3Label: 'सक्रिय वार्ड',
      categories: [
        { label: 'गड्ढे', color: '#EF4444' },
        { label: 'स्ट्रीट लाइट', color: '#F59E0B' },
        { label: 'पानी का रिसाव', color: '#0EA5E9' },
        { label: 'कचरा', color: '#10B981' },
        { label: 'सड़क क्षति', color: '#EA580C' },
        { label: 'अन्य', color: '#8B5CF6' },
      ],
      sampleIssue: {
        title: 'स्ट्रीट लाइट समस्या',
        location: 'वार्ड 12, मेन रोड',
        status: 'सत्यापित',
        time: '2 घंटे पहले',
      },
    },
  };

  const text = t[currentLang] || t.en;

  // Exact map pins matching the reference placement and colors
  const mapPins = [
    {
      id: 1,
      type: 'garbage',
      color: '#10B981',
      top: '29%',
      left: '56.8%',
      label: 'Overflowing Bin - Ward 07',
      inner: '!',
    },
    {
      id: 2,
      type: 'pothole',
      color: '#EF4444',
      top: '26.8%',
      left: '63%',
      label: 'Deep Pothole - Junction 3',
      inner: null,
    },
    {
      id: 3,
      type: 'garbage',
      color: '#10B981',
      top: '22.5%',
      left: '75.8%',
      label: 'Waste Collection Required',
      inner: null,
    },
    {
      id: 4,
      type: 'streetlight',
      color: '#F59E0B',
      top: '41%',
      left: '64.6%',
      label: 'Street Light Issue',
      inner: '0',
    },
    {
      id: 5,
      type: 'pothole',
      color: '#EF4444',
      top: '47.2%',
      left: '52.2%',
      label: 'Road Surface Damage',
      inner: null,
    },
    {
      id: 6,
      type: 'other',
      color: '#8B5CF6',
      top: '60.8%',
      left: '85.5%',
      label: 'Civic Maintenance - Harbor',
      inner: null,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F2F6FE] via-[#F8FAFF] to-white pt-6 pb-12 lg:pt-10 lg:pb-16">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[420px] h-[420px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-5 left-10 w-[380px] h-[380px] bg-purple-100/35 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
          
          {/* Left Column: Headline, Subtitle, CTA & Stats */}
          <div className="lg:col-span-5 flex flex-col justify-center text-left pt-2 lg:pt-0">
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] xl:text-[62px] font-black tracking-tight leading-[1.08] text-slate-900">
              <span className="block text-slate-900">{text.title1}</span>
              <span className="block text-[#5B4FE9]">{text.title2}</span>
              <span className="block text-slate-900">{text.title3}</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 sm:mt-6 text-base sm:text-lg text-slate-600 max-w-lg leading-relaxed font-normal">
              {text.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="mt-7 sm:mt-8 flex flex-wrap items-center gap-3.5 sm:gap-4">
              <button
                type="button"
                onClick={onOpenReport}
                className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-sm sm:text-base shadow-lg shadow-blue-500/25 transition-all cursor-pointer inline-flex items-center"
              >
                {text.btnReport}
              </button>
              <a
                href="#explore"
                className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-white hover:bg-slate-50 active:scale-95 text-slate-800 border border-slate-200/90 font-semibold text-sm sm:text-base shadow-sm hover:shadow transition-all cursor-pointer inline-flex items-center"
              >
                {text.btnExplore}
              </a>
            </div>

            {/* Statistics Row */}
            <div className="mt-10 sm:mt-12 pt-7 border-t border-slate-200/60 grid grid-cols-3 gap-3 sm:gap-6">
              <div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                  {text.stat1Number}
                </div>
                <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  {text.stat1Label}
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                  {text.stat2Number}
                </div>
                <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  {text.stat2Label}
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                  {text.stat3Number}
                </div>
                <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  {text.stat3Label}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Stylized City Map Illustration with Legend & Issue Card */}
          <div className="lg:col-span-7 relative w-full flex items-center justify-center">
            
            {/* Map Canvas Container */}
            <div className="relative w-full aspect-[4/3] max-h-[580px] rounded-3xl overflow-hidden shadow-[0_12px_40px_-10px_rgba(20,40,90,0.12)] border border-blue-100/60 bg-[#EAF2FA]">
              
              {/* Map background image */}
              <Image
                src="/images/city_map_bg.jpg"
                alt="Civic issues interactive city map"
                fill
                priority
                className="object-cover object-center filter saturate-[1.04] brightness-[1.01]"
              />

              {/* Soft vignette on map edges */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-white/10 pointer-events-none" />

              {/* Interactive Teardrop Location Pins */}
              {mapPins.map((pin) => (
                <div
                  key={pin.id}
                  style={{ top: pin.top, left: pin.left }}
                  onMouseEnter={() => setActivePin(pin.id)}
                  onMouseLeave={() => setActivePin(null)}
                  className="absolute -translate-x-1/2 -translate-y-[85%] z-20 cursor-pointer group/pin"
                >
                  {/* Subtle Pulse ring */}
                  <span
                    className="absolute inset-0 rounded-full animate-ping opacity-30"
                    style={{ backgroundColor: pin.color }}
                  />

                  {/* Teardrop Pin Marker */}
                  <div className="relative transition-transform duration-200 group-hover/pin:scale-125 filter drop-shadow-md">
                    <svg
                      className="w-7 h-9 sm:w-8 sm:h-10"
                      viewBox="0 0 30 38"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15 0C6.716 0 0 6.716 0 15c0 10.5 15 23 15 23s15-12.5 15-23c0-8.284-6.716-15-15-15z"
                        fill={pin.color}
                      />
                      <circle cx="15" cy="14" r="6" fill="white" />
                      {pin.inner && (
                        <text
                          x="15"
                          y="17"
                          fill={pin.color}
                          fontSize="9"
                          fontWeight="bold"
                          textAnchor="middle"
                          fontFamily="sans-serif"
                        >
                          {pin.inner}
                        </text>
                      )}
                    </svg>
                  </div>

                  {/* Tooltip on hover */}
                  {activePin === pin.id && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1 bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-semibold rounded-md shadow-lg whitespace-nowrap z-30 pointer-events-none animate-in fade-in duration-150">
                      {pin.label}
                    </div>
                  )}
                </div>
              ))}

              {/* Floating Legend Card (Top Right Overlay) */}
              <div className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 shadow-[0_8px_25px_-5px_rgba(0,0,0,0.12)] border border-slate-100 min-w-[145px] sm:min-w-[160px] pointer-events-auto">
                <div className="flex flex-col gap-2">
                  {text.categories.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-[11px] sm:text-xs font-semibold text-slate-700 whitespace-nowrap">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Live Issue Card (Bottom Right Overlay) */}
              <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 shadow-[0_12px_32px_-5px_rgba(0,0,0,0.16)] border border-slate-100 flex items-center gap-3 sm:gap-3.5 max-w-[270px] sm:max-w-[310px] transition-all hover:scale-[1.02]">
                {/* Photo Thumbnail */}
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border border-slate-100 shadow-xs">
                  <Image
                    src="/images/street_issue_thumb.jpg"
                    alt="Street issue photo"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Issue Details */}
                <div className="flex flex-col min-w-0 pr-1">
                  <div className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                    {text.sampleIssue.title}
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-500 font-medium truncate mt-0.5">
                    {text.sampleIssue.location}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {text.sampleIssue.status}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
                      • {text.sampleIssue.time}
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}