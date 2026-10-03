'use client';

import React from 'react';
import { useTheme } from '@/app/context/ThemeContext';

export default function ThemeToggle({
  className = '',
  size = 'md', // 'sm', 'md', 'lg'
  showLabel = false,
  variant = 'button', // 'button', 'sidebar-item'
}) {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';

  if (variant === 'sidebar-item') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
          isDark
            ? 'text-amber-400 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/20'
            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent'
        } ${className}`}
      >
        <div className="flex items-center gap-3">
          {isDark ? (
            <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
          <span className="truncate">{isDark ? 'Dark Theme' : 'Light Theme'}</span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          {isDark ? 'Dark' : 'Light'}
        </span>
      </button>
    );
  }

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const btnPadding = {
    sm: 'p-1.5 rounded-lg',
    md: 'p-2 rounded-xl',
    lg: 'p-2.5 rounded-xl',
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      className={`inline-flex items-center gap-2 border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-[#111A2E]/90 text-slate-700 dark:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all cursor-pointer shadow-xs backdrop-blur-sm ${btnPadding[size] || btnPadding.md} ${className}`}
    >
      {isDark ? (
        <svg className={`${iconSizes[size] || iconSizes.md} text-amber-400 animate-in spin-in-180 duration-300`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className={`${iconSizes[size] || iconSizes.md} text-slate-600 hover:text-blue-600 transition-colors`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}

      {showLabel && (
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 select-none">
          {isDark ? 'Dark' : 'Light'}
        </span>
      )}
    </button>
  );
}
