'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer({ currentLang }) {
  return (
    <footer className="bg-white border-t border-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="Civic Saathi"
              width={36}
              height={36}
              className="object-contain"
            />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-extrabold text-slate-900 text-lg">Civic</span>
            <span className="font-bold text-slate-800 text-lg">साथी</span>
          </div>
          <span className="text-xs text-slate-400 ml-2">
            | {currentLang === 'hi' ? 'नागरिक सशक्तिकरण पोर्टल' : 'Citizen Empowerment Portal'}
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-xs sm:text-sm text-slate-500 font-medium">
          <a href="#how-it-works" className="hover:text-blue-600 transition-colors">
            {currentLang === 'hi' ? 'प्रक्रिया' : 'How It Works'}
          </a>
          <a href="#explore" className="hover:text-blue-600 transition-colors">
            {currentLang === 'hi' ? 'समस्याएं' : 'Explore Issues'}
          </a>
          <a href="#civic-pulse" className="hover:text-blue-600 transition-colors">
            {currentLang === 'hi' ? 'सिविक पल्स' : 'Civic Pulse'}
          </a>
          <a href="/about" className="hover:text-blue-600 transition-colors">
            {currentLang === 'hi' ? 'परिचय' : 'About'}
          </a>
        </div>

        {/* Copyright */}
        <p className="text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Civic साथी. All rights reserved.
        </p>

      </div>
    </footer>
  );
}