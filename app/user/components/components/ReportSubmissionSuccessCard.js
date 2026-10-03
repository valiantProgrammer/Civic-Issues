'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ReportSubmissionSuccessCard({
  ticketId = 'CIVIC-20261002-A72Q',
  onTrackReport,
  onBackHome,
}) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleCopyTicket = () => {
    navigator.clipboard.writeText(ticketId);
    setCopied(true);
    toast.success('Ticket ID copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTrack = () => {
    if (onTrackReport) {
      onTrackReport(ticketId);
    } else {
      router.push('/user?tab=reports');
    }
  };

  const handleHome = () => {
    if (onBackHome) {
      onBackHome();
    } else {
      router.push('/user');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-100/90 shadow-xl shadow-slate-200/50 text-center font-sans">
      
      {/* 1. Green Circle Checkmark Badge with Confetti Sparkles matching reference screenshot */}
      <div className="relative w-24 h-24 mx-auto flex items-center justify-center mb-2">
        {/* Floating Confetti Dots */}
        <span className="absolute top-1 left-2 w-2 h-2 rounded-full bg-teal-400" />
        <span className="absolute top-4 left-0 w-2 h-2 rounded-full bg-teal-400" />
        <span className="absolute bottom-4 left-3 w-2 h-2 rounded-full bg-orange-400" />
        
        <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-teal-400" />
        <span className="absolute top-4 right-1 w-2 h-2 rounded-full bg-orange-400" />
        <span className="absolute bottom-4 right-3 w-2 h-2 rounded-full bg-teal-400" />

        {/* Center Green Badge */}
        <div className="w-16 h-16 rounded-full bg-[#10B981] flex items-center justify-center shadow-lg shadow-emerald-500/25">
          <svg
            className="w-8 h-8 text-white stroke-[3.5]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>

      {/* 2. Heading & Subtitle */}
      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-2">
        Report Submitted Successfully!
      </h2>
      <p className="text-xs sm:text-sm text-slate-500 font-normal mt-1.5 max-w-xs mx-auto">
        Your issue has been recorded and will be reviewed soon.
      </p>

      {/* 3. Ticket ID Display with Copy Button matching reference screenshot */}
      <div className="bg-[#EFF6FF] rounded-2xl py-3.5 px-5 my-6 flex items-center justify-between border border-blue-100/80">
        <span className="text-lg sm:text-2xl font-black text-[#2563EB] tracking-wide font-sans">
          {ticketId}
        </span>

        <button
          type="button"
          onClick={handleCopyTicket}
          title="Copy Ticket ID"
          className="text-slate-600 hover:text-blue-600 p-1.5 rounded-lg hover:bg-blue-100/60 transition-colors cursor-pointer"
        >
          {copied ? (
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          )}
        </button>
      </div>

      {/* 4. Action Buttons matching reference screenshot */}
      <div className="grid grid-cols-2 gap-3.5">
        <button
          type="button"
          onClick={handleTrack}
          className="w-full bg-[#2563EB] hover:bg-blue-700 active:scale-[0.99] text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-blue-500/25 text-xs sm:text-sm transition-all cursor-pointer"
        >
          Track Report
        </button>

        <button
          type="button"
          onClick={handleHome}
          className="w-full bg-white border border-slate-200 hover:bg-slate-50 active:scale-[0.99] text-slate-800 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all cursor-pointer shadow-2xs"
        >
          Back to Home
        </button>
      </div>

    </div>
  );
}
