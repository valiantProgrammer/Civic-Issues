'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export default function ExploreSection({ onOpenReport, currentLang }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    { id: 'All', labelEn: 'All Issues', labelHi: 'सभी समस्याएं' },
    { id: 'Potholes', labelEn: 'Potholes', labelHi: 'गड्ढे', color: '#EF4444' },
    { id: 'Street Light', labelEn: 'Street Light', labelHi: 'स्ट्रीट लाइट', color: '#F59E0B' },
    { id: 'Water Leakage', labelEn: 'Water Leakage', labelHi: 'पानी का रिसाव', color: '#0EA5E9' },
    { id: 'Garbage', labelEn: 'Garbage', labelHi: 'कचरा', color: '#10B981' },
    { id: 'Road Damage', labelEn: 'Road Damage', labelHi: 'सड़क क्षति', color: '#EA580C' },
  ];

  const issues = [
    {
      id: 'CS-8492',
      title: 'Deep Pothole near Metro Station Gate 2',
      category: 'Potholes',
      ward: 'Ward 14, Central Sector',
      status: 'Verified',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      time: '1 hour ago',
      upvotes: 38,
      image: '/images/street_issue_thumb.jpg',
    },
    {
      id: 'CS-8488',
      title: 'Flickering Street Lights on 4th Main Avenue',
      category: 'Street Light',
      ward: 'Ward 12, Main Road',
      status: 'In Progress',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
      time: '3 hours ago',
      upvotes: 24,
      image: '/images/street_issue_thumb.jpg',
    },
    {
      id: 'CS-8475',
      title: 'Underground Pipeline Leakage Flooding Sidewalk',
      category: 'Water Leakage',
      ward: 'Ward 08, Lakeview Road',
      status: 'Resolved',
      statusColor: 'bg-blue-50 text-blue-700 border-blue-200',
      time: 'Yesterday',
      upvotes: 52,
      image: '/images/street_issue_thumb.jpg',
    },
    {
      id: 'CS-8461',
      title: 'Overflowing Commercial Dumpster & Plastic Debris',
      category: 'Garbage',
      ward: 'Ward 21, Market Area',
      status: 'Verified',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      time: '5 hours ago',
      upvotes: 19,
      image: '/images/street_issue_thumb.jpg',
    },
    {
      id: 'CS-8450',
      title: 'Cracked Road Surface Following Monsoon Drain Work',
      category: 'Road Damage',
      ward: 'Ward 05, Ring Road Bypass',
      status: 'In Progress',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
      time: '1 day ago',
      upvotes: 41,
      image: '/images/street_issue_thumb.jpg',
    },
    {
      id: 'CS-8432',
      title: 'Open Drainage Manhole without Safety Warning Cone',
      category: 'Other',
      ward: 'Ward 19, North Colony',
      status: 'Resolved',
      statusColor: 'bg-blue-50 text-blue-700 border-blue-200',
      time: '2 days ago',
      upvotes: 89,
      image: '/images/street_issue_thumb.jpg',
    },
  ];

  const filteredIssues = selectedCategory === 'All'
    ? issues
    : issues.filter((item) => item.category === selectedCategory);

  return (
    <section id="explore" className="py-14 lg:py-20 bg-slate-50/60 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 text-blue-700 text-xs font-semibold mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              {currentLang === 'hi' ? 'लाइव रिपोर्ट' : 'Live Community Feed'}
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold tracking-tight text-slate-900">
              {currentLang === 'hi' ? 'नागरिक समस्याओं का अन्वेषण करें' : 'Explore Civic Issues'}
            </h2>
            <p className="mt-1 text-sm sm:text-base text-slate-500 font-normal">
              {currentLang === 'hi'
                ? 'अपने क्षेत्र में दर्ज समस्याओं की स्थिति और समाधान प्रगति देखें।'
                : 'Browse reported civic problems and real-time status updates across active wards.'}
            </p>
          </div>

          <button
            onClick={onOpenReport}
            className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {currentLang === 'hi' ? 'नई समस्या जोड़ें' : 'Report an Issue'}
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none mb-8">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {cat.color && (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                )}
                {currentLang === 'hi' ? cat.labelHi : cat.labelEn}
              </button>
            );
          })}
        </div>

        {/* Issues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIssues.map((issue) => (
            <div
              key={issue.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Image & Badges */}
              <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
                <Image
                  src={issue.image}
                  alt={issue.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />

                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-[11px] font-bold text-slate-800 shadow-xs">
                    {issue.id}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-md ${issue.statusColor}`}>
                    ● {issue.status}
                  </span>
                </div>

                <div className="absolute bottom-2.5 left-3 text-[11px] text-white/90 font-medium">
                  {issue.time}
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-semibold text-blue-600 mb-1">
                    {issue.category}
                  </div>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors line-clamp-2">
                    {issue.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                    <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{issue.ward}</span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                    <svg className="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    <span>{issue.upvotes} citizens verified</span>
                  </div>

                  <button
                    onClick={onOpenReport}
                    className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1"
                  >
                    View details
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
