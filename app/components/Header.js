'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '@/app/context/ThemeContext';

export default function Header({ onOpenLogin, onOpenReport, currentLang, onToggleLang }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (!targetId || targetId === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const elem = document.getElementById(targetId);
    if (elem) {
      const header = document.getElementById('main-header');
      const headerOffset = header ? header.offsetHeight : 70;
      const elementPosition = elem.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header
      id="main-header"
      className="sticky top-0 z-50 bg-white/90 dark:bg-[#0B132B]/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 transition-colors duration-250 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_-3px_rgba(0,0,0,0.4)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden shadow-sm ring-1 ring-slate-100 dark:ring-slate-800 flex items-center justify-center bg-white dark:bg-slate-900">
            <Image
              src="/images/logo.png"
              alt="Civic Saathi Logo"
              width={48}
              height={48}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform"
              priority
            />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white transition-colors">
              Civic
            </span>
            <span className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-blue-400 transition-colors">
              साथी
            </span>
          </div>
        </Link>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-9">
          <button
            onClick={() => onOpenReport ? onOpenReport() : null}
            className="text-sm lg:text-[15px] font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            {currentLang === 'hi' ? 'समस्या रिपोर्ट करें' : 'Report Issue'}
          </button>
          <a
            href="#explore"
            onClick={(e) => handleSmoothScroll(e, 'explore')}
            className="text-sm lg:text-[15px] font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            {currentLang === 'hi' ? 'अन्वेषण' : 'Explore'}
          </a>
          <a
            href="#how-it-works"
            onClick={(e) => handleSmoothScroll(e, 'how-it-works')}
            className="text-sm lg:text-[15px] font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            {currentLang === 'hi' ? 'यह कैसे काम करता है' : 'How It Works'}
          </a>
          <a
            href="#civic-pulse"
            onClick={(e) => handleSmoothScroll(e, 'civic-pulse')}
            className="text-sm lg:text-[15px] font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            {currentLang === 'hi' ? 'सिविक पल्स' : 'Civic Pulse'}
          </a>
          <a
            href="#about"
            onClick={(e) => handleSmoothScroll(e, 'about')}
            className="text-sm lg:text-[15px] font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            {currentLang === 'hi' ? 'परिचय' : 'About'}
          </a>
        </nav>

        {/* Right CTA Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-3 lg:gap-3.5">
          {/* Language Toggle */}
          <button
            type="button"
            onClick={() => onToggleLang ? onToggleLang() : null}
            className="px-2.5 py-1.5 text-xs lg:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer flex items-center gap-1 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850"
            title="Switch Language"
          >
            <span className={currentLang === 'en' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 dark:text-slate-400'}>EN</span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className={currentLang === 'hi' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 dark:text-slate-400'}>हिंदी</span>
          </button>

          {/* Theme Toggle Button (Light / Dark) */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            className="p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all cursor-pointer shadow-xs flex items-center justify-center"
          >
            {theme === 'dark' ? (
              <svg className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-slate-700 hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Log In Button */}
          <button
            type="button"
            onClick={() => onOpenLogin ? onOpenLogin() : null}
            className="px-5 py-2 rounded-full border border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-sm font-semibold transition-all shadow-sm cursor-pointer"
          >
            {currentLang === 'hi' ? 'लॉग इन' : 'Log In'}
          </button>

          {/* Primary Report Issue Button */}
          <button
            type="button"
            onClick={() => onOpenReport ? onOpenReport() : null}
            className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-sm font-semibold transition-all shadow-md shadow-blue-500/25 cursor-pointer"
          >
            {currentLang === 'hi' ? 'समस्या रिपोर्ट करें' : 'Report Issue'}
          </button>
        </div>

        {/* Mobile Menu Actions */}
        <div className="flex items-center gap-1.5 md:hidden">
          {/* Mobile Language Toggle */}
          <button
            type="button"
            onClick={() => onToggleLang ? onToggleLang() : null}
            className="px-2 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-800 rounded-lg"
          >
            {currentLang === 'en' ? 'हिंदी' : 'EN'}
          </button>

          {/* Mobile Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
          >
            {theme === 'dark' ? (
              <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-[#0B132B]/98 backdrop-blur-lg px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-2.5">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (onOpenReport) onOpenReport();
              }}
              className="text-left py-2.5 px-3 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800/80 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-base transition-colors"
            >
              {currentLang === 'hi' ? 'समस्या रिपोर्ट करें' : 'Report Issue'}
            </button>
            <a
              href="#explore"
              onClick={(e) => handleSmoothScroll(e, 'explore')}
              className="py-2.5 px-3 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800/80 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-base transition-colors"
            >
              {currentLang === 'hi' ? 'अन्वेषण' : 'Explore'}
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => handleSmoothScroll(e, 'how-it-works')}
              className="py-2.5 px-3 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800/80 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-base transition-colors"
            >
              {currentLang === 'hi' ? 'यह कैसे काम करता है' : 'How It Works'}
            </a>
            <a
              href="#civic-pulse"
              onClick={(e) => handleSmoothScroll(e, 'civic-pulse')}
              className="py-2.5 px-3 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800/80 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-base transition-colors"
            >
              {currentLang === 'hi' ? 'सिविक पल्स' : 'Civic Pulse'}
            </a>
            <a
              href="#about"
              onClick={(e) => handleSmoothScroll(e, 'about')}
              className="py-2.5 px-3 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800/80 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-base transition-colors"
            >
              {currentLang === 'hi' ? 'परिचय' : 'About'}
            </a>

            {/* Mobile Log In and Report CTAs */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5 mt-1">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onOpenLogin) onOpenLogin();
                }}
                className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-200 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                {currentLang === 'hi' ? 'लॉग इन' : 'Log In'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onOpenReport) onOpenReport();
                }}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all"
              >
                {currentLang === 'hi' ? 'समस्या रिपोर्ट करें' : 'Report Issue'}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}