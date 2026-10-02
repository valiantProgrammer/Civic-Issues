'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authApi } from '@/lib/api';

import AdministrationSidebar from './components/AdministrationSidebar';
import AdministrationDashboardView from './components/AdministrationDashboardView';
import AdministrationIssuesView from './components/AdministrationIssuesView';
import AdministrationAssignmentsView from './components/AdministrationAssignmentsView';
import AdministrationForwardingView from './components/AdministrationForwardingView';
import AdministrationEscalationsView from './components/AdministrationEscalationsView';
import AdministrationAnalyticsView from './components/AdministrationAnalyticsView';
import AdminProfile from '@/app/admin/components/AdminProfile';
import ReportDetailView from '@/app/admin/components/ReportDetailView';

export default function AdministrationPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch reports from backend
  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await authApi.getAdministrationReports();
      if (res && res.reports) {
        setReports(res.reports);
      }
    } catch (err) {
      console.log('Reports fetch notice:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Handle Logout
  const handleLogout = () => {
    authApi.logout();
    toast.success('Logged out successfully');
    router.push('/login/administrative');
  };

  const handleUpdateStatus = async (reportId, newStatus, reason = null) => {
    try {
      await authApi.updateReportStatus(reportId, newStatus, reason);
      toast.success(`Report status updated to ${newStatus}`);
      setReports((prev) =>
        prev.map((r) => (r._id === reportId ? { ...r, status: newStatus } : r))
      );
      if (selectedReport && selectedReport._id === reportId) {
        setSelectedReport((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex antialiased">
      
      {/* 1. Left Sidebar Navigation */}
      <AdministrationSidebar
        activeTab={activeTab}
        onTabChange={(tabId) => {
          setSelectedReport(null);
          setActiveTab(tabId);
        }}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onLogout={handleLogout}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        
        {/* Mobile Top Header */}
        <header className="lg:hidden sticky top-0 z-30 bg-[#0B1528] text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-xl text-slate-300 hover:bg-white/10 transition-colors"
              aria-label="Open sidebar"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-baseline gap-1">
              <span className="font-extrabold text-white text-lg">Civic</span>
              <span className="font-bold text-slate-300 text-lg">साथी</span>
              <span className="text-[11px] text-blue-400 font-semibold ml-1.5 px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                Administration
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Main Body Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          
          {/* Detail View when a report is selected */}
          {selectedReport ? (
            <ReportDetailView
              report={selectedReport}
              onClose={() => setSelectedReport(null)}
              userRole="administration"
              onApprove={(id) => handleUpdateStatus(id || selectedReport._id, 'approved')}
              onReject={(id, reason) => handleUpdateStatus(id || selectedReport._id, 'rejected', reason)}
              onSend={(muniName, msg) => {
                toast.success(`Case dispatched to ${muniName}!`);
                setSelectedReport(null);
              }}
            />
          ) : (
            <>
              {/* Dashboard: Municipal Control Center matching the reference screenshot */}
              {activeTab === 'dashboard' && (
                <AdministrationDashboardView
                  openCount={142}
                  assignedCount={43}
                  inProgressCount={61}
                  completedCount={38}
                  onViewAllIssues={() => setActiveTab('issues')}
                />
              )}

              {/* Issues: Comprehensive Civic Issues Console */}
              {activeTab === 'issues' && (
                <AdministrationIssuesView
                  reports={reports}
                  onSelectReport={(r) => setSelectedReport(r)}
                />
              )}

              {/* Assignments: Work Orders & Crew Dispatch */}
              {activeTab === 'assignments' && (
                <AdministrationAssignmentsView />
              )}

              {/* Forwarding: Inter-Departmental & Municipal Forwarding */}
              {activeTab === 'forwarding' && (
                <AdministrationForwardingView />
              )}

              {/* Escalations: Overdue SLAs & Emergency Alerts */}
              {activeTab === 'escalations' && (
                <AdministrationEscalationsView />
              )}

              {/* Analytics: Telemetry, Department SLAs, Ward Ranking */}
              {activeTab === 'analytics' && (
                <AdministrationAnalyticsView />
              )}

              {/* Profile: Administrative Head Account */}
              {activeTab === 'profile' && (
                <AdminProfile />
              )}
            </>
          )}

        </main>
      </div>

    </div>
  );
}
