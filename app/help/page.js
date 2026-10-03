'use client';

import React from 'react';
import Navbar from '../user/components/components/Navbar.js';
import Footer from '../user/components/components/Footer.js';
import HelpCard from '../user/components/components/HelpCard.js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HelpPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans antialiased text-slate-800">
      <Navbar />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Modern Help & Support Card matching the exact reference */}
        <HelpCard
          onNavigateToReport={() => router.push('/user?tab=add-report')}
          onNavigateToReports={() => router.push('/user?tab=reports')}
        />
      </main>

      <Footer />
    </div>
  );
}