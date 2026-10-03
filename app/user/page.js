'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserSidebar from './components/components/UserSidebar';
import UserDashboard from './components/components/UserDashboard';
import ReportedIssuesSection from './components/components/ReportedIssuesSection';
import ReportDetailCard from './components/components/ReportDetailCard';
import ProfileCard from './components/components/ProfileCard';
import ReportIssueFlow from './components/components/ReportIssueFlow';
import UserReportHistory from './components/components/UserReportHistory';
import UserNotificationsView from './components/components/UserNotificationsView';
import HelpCard from './components/components/HelpCard';
import authApi from '@/lib/api';
import { useTheme } from '@/app/context/ThemeContext';
import ThemeToggle from '@/app/components/ThemeToggle';

export default function UserPortalPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'reports', 'add-report', 'notifications', 'profile', 'help'
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
    setActiveTab(tabId);
  };

  // Support ?tab= parameter in URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      if (tabParam && ['dashboard', 'reports', 'add-report', 'notifications', 'profile', 'help'].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#080D1A] text-slate-800 dark:text-slate-100 font-sans flex transition-colors duration-200">
      
      {/* Left Navigation Sidebar */}
      <UserSidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        
        {/* Top Desktop Bar (Theme Toggle & User Quick Actions) */}
        <header className="hidden lg:flex sticky top-0 z-30 bg-white/80 dark:bg-[#0B132B]/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 px-8 py-3.5 items-center justify-between transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
              Citizen Portal
            </span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 capitalize">
              {activeTab.replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle size="sm" showLabel={true} />
            <button
              type="button"
              onClick={() => setActiveTab('add-report')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-blue-500/20"
            >
              <span>+</span>
              <span>Report Issue</span>
            </button>
          </div>
        </header>

        {/* Top Mobile Bar (Visible only on mobile/tablet) */}
        <header className="lg:hidden sticky top-0 z-30 bg-white/95 dark:bg-[#0B132B]/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 py-3 flex items-center justify-between transition-colors">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Open sidebar"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-baseline gap-1">
              <span className="font-extrabold text-slate-900 dark:text-white text-lg">Civic</span>
              <span className="font-bold text-blue-600 text-lg">साथी</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle size="sm" />
            <button
              type="button"
              onClick={() => setActiveTab('add-report')}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm flex items-center gap-1 cursor-pointer"
            >
              <span>+ Report</span>
            </button>
          </div>
        </header>

        {/* Dynamic Main View */}
        <main className={`flex-1 w-full ${selectedReport ? 'p-3 sm:p-4 lg:p-5' : 'p-4 sm:p-6 lg:p-8'}`}>
          
          {/* Dashboard View matching the reference picture */}
          {activeTab === 'dashboard' && !selectedReport && (
            <UserDashboard
              userName={userName}
              onReportIssue={() => setActiveTab('add-report')}
              onViewAllReports={() => setActiveTab('reports')}
              onSelectReport={(report) => setSelectedReport(report)}
            />
          )}

          {/* Add Report Flow matching the reference picture */}
          {activeTab === 'add-report' && !selectedReport && (
            <ReportIssueFlow
              onCancel={() => setActiveTab('dashboard')}
              onComplete={() => setActiveTab('reports')}
            />
          )}

          {/* Selected Report Detail View matching the exact reference picture */}
          {selectedReport && (
            <ReportDetailCard
              report={selectedReport}
              onClose={() => setSelectedReport(null)}
            />
          )}

          {/* My Report History View matching the exact reference picture */}
          {activeTab === 'reports' && !selectedReport && (
            <UserReportHistory
              onReportSelect={(report) => setSelectedReport(report)}
            />
          )}

          {/* Notifications View */}
          {activeTab === 'notifications' && (
            <div className="w-full">
              <UserNotificationsView
                onSelectReport={(report) => setSelectedReport(report)}
              />
            </div>
          )}

          {/* Profile View */}
          {activeTab === 'profile' && (
            <div className="w-full">
              <ProfileCard />
            </div>
          )}

          {/* Help & Support View matching the reference card */}
          {activeTab === 'help' && (
            <div className="w-full">
              <HelpCard
                onNavigateToReport={() => setActiveTab('add-report')}
                onNavigateToReports={() => setActiveTab('reports')}
              />
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
