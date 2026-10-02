'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserSidebar from './components/components/UserSidebar';
import UserDashboard from './components/components/UserDashboard';
import ReportedIssuesSection from './components/components/ReportedIssuesSection';
import ReportDetailCard from './components/components/ReportDetailCard';
import ProfileCard from './components/components/ProfileCard';
import authApi from '@/lib/api';

export default function UserPortalPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'reports', 'add-report', 'notifications', 'profile'
  const [reportFilter, setReportFilter] = useState('pending');
  const [selectedReport, setSelectedReport] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('Rupayan');

  // Fetch logged in user profile name if available
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authApi.getProfile();
        if (response && response.user && response.user.userName) {
          setUserName(response.user.userName);
        }
      } catch (err) {
        // Fallback to Rupayan as shown in the reference picture
        console.log('Using default user name:', err);
      }
    };
    fetchUser();
  }, []);

  // Handle tab switching
  const handleTabChange = (tabId) => {
    setSelectedReport(null);
    if (tabId === 'add-report') {
      router.push('/user/add-report');
      return;
    }
    setActiveTab(tabId);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex">
      
      {/* Left Navigation Sidebar */}
      <UserSidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        
        {/* Top Mobile Bar (Visible only on mobile/tablet) */}
        <header className="lg:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Open sidebar"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-baseline gap-1">
              <span className="font-extrabold text-slate-900 text-lg">Civic</span>
              <span className="font-bold text-slate-800 text-lg">साथी</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push('/user/add-report')}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white font-semibold text-xs shadow-sm flex items-center gap-1"
          >
            <span>+ Report</span>
          </button>
        </header>

        {/* Dynamic Main View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          
          {/* Dashboard View matching the reference picture */}
          {activeTab === 'dashboard' && !selectedReport && (
            <UserDashboard
              userName={userName}
              onReportIssue={() => router.push('/user/add-report')}
              onViewAllReports={() => setActiveTab('reports')}
              onSelectReport={(report) => setSelectedReport(report)}
            />
          )}

          {/* Selected Report Detail View */}
          {selectedReport && (
            <div>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="mb-4 text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Dashboard</span>
              </button>
              <ReportDetailCard
                report={selectedReport}
                onClose={() => setSelectedReport(null)}
              />
            </div>
          )}

          {/* My Reports View */}
          {activeTab === 'reports' && !selectedReport && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-slate-900">My Reports</h1>
                  <p className="text-xs text-slate-500 mt-0.5">Filter and manage all your reported civic issues</p>
                </div>
                <button
                  type="button"
                  onClick={() => router.push('/user/add-report')}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-sm hover:bg-blue-700"
                >
                  + New Report
                </button>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2 border-b border-slate-200 pb-2">
                {['pending', 'approved', 'rejected'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setReportFilter(f)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                      reportFilter === f
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <ReportedIssuesSection
                filter={reportFilter}
                onReportSelect={setSelectedReport}
              />
            </div>
          )}

          {/* Notifications View */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm max-w-2xl">
              <h2 className="text-xl font-black text-slate-900 mb-4">Notifications</h2>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Issue Verified by Ward Officer</div>
                    <p className="text-xs text-slate-500 mt-0.5">Street Light Failure (CIVIC-20260928-A72F) has been verified and assigned to electrical maintenance.</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">2 hours ago</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Issue Resolved</div>
                    <p className="text-xs text-slate-500 mt-0.5">Garbage Not Collected (CIVIC-20260920-P91K) has been resolved by sanitation department.</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">Yesterday</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Profile View */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl">
              <ProfileCard />
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
