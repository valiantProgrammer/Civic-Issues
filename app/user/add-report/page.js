'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import UserSidebar from '../components/components/UserSidebar';
import ReportIssueFlow from '../components/components/ReportIssueFlow';

export default function AddReportPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex">
      {/* Left Navigation Sidebar */}
      <UserSidebar
        activeTab="add-report"
        onTabChange={(tabId) => {
          if (tabId === 'dashboard') router.push('/user');
          else if (tabId === 'reports') router.push('/user');
          else if (tabId === 'profile') router.push('/user');
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          <ReportIssueFlow
            onCancel={() => router.push('/user')}
            onComplete={() => router.push('/user')}
          />
        </main>
      </div>
    </div>
  );
}