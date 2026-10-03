'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authApi } from '@/lib/api';

import dynamic from 'next/dynamic';

import AdminSidebar from './components/AdminSidebar';
import AdminDashboardView from './components/AdminDashboardView';
import RegisterMunicipalityView from './components/RegisterMunicipalityView';
import RegisterWardView from './components/RegisterWardView';
import AddAdminHeadView from './components/AddAdminHeadView';
import AddAdminView from './components/AddAdminView';
import AdminProfile from './components/AdminProfile';
import ReportDetailView from './components/ReportDetailView';
import ThemeToggle from '@/app/components/ThemeToggle';

const LocateWardView = dynamic(() => import('./components/LocateWardView'), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[16/9] rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xs text-slate-400">
      Loading 3D Ward Map...
    </div>
  ),
});

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [adminProfile, setAdminProfile] = useState(null);

  // Fetch reports from backend
  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch admin profile
      try {
        const prof = await authApi.getProfile();
        if (prof) setAdminProfile(prof.user || prof);
      } catch (e) {
        console.log('Profile fetch notice:', e);
      }

      // Fetch reports
      const res = await authApi.getReports();
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
    router.push('/login/admin');
  };

  // Status Counts
  const pendingCount = reports.filter((r) => r.status === 'pending' || !r.status).length || 38;
  const verifiedCount = reports.filter((r) => r.status === 'verified' || r.status === 'approved').length || 21;
  const rejectedCount = reports.filter((r) => r.status === 'rejected').length || 6;
  const escalatedCount = 4;

  const handleUpdateStatus = async (reportId, newStatus, reason = null) => {
    try {
      await authApi.updateReportStatus(reportId, newStatus, reason);
      toast.success(`Report updated to ${newStatus}`);
      setReports((prev) =>
        prev.map((r) => (r._id === reportId ? { ...r, status: newStatus, rejectionReason: reason } : r))
      );
      if (selectedReport && selectedReport._id === reportId) {
        setSelectedReport((prev) => ({ ...prev, status: newStatus, rejectionReason: reason }));
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#080D1A] text-slate-800 dark:text-slate-100 font-sans flex antialiased transition-colors duration-200">
      
      {/* 1. Left Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={(tabId) => {
          setSelectedReport(null);
          setActiveTab(tabId);
        }}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onLogout={handleLogout}
      />

      {/* 2. Main Body Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        
        {/* Desktop Top Header Bar with Theme Toggler */}
        <header className="hidden lg:flex sticky top-0 z-20 bg-white/80 dark:bg-[#0B132B]/80 backdrop-blur-md px-8 py-3.5 items-center justify-between border-b border-slate-200/80 dark:border-slate-800 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Admin Portal</span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 capitalize">
              {activeTab.replace(/([A-Z])/g, ' $1')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle size="sm" showLabel={true} />
          </div>
        </header>

        {/* Mobile Top Bar */}
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
              <span className="text-xs text-blue-400 font-semibold ml-1.5 px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">Admin</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle size="sm" />
          </div>
        </header>

        {/* Dynamic Content Views */}
        <main className={`flex-1 w-full ${selectedReport ? 'p-3 sm:p-4 lg:p-5' : 'p-4 sm:p-6 lg:p-8'}`}>
          
          {/* Detail View when a report is selected */}
          {selectedReport ? (
            <ReportDetailView
              report={selectedReport}
              onClose={() => setSelectedReport(null)}
              userRole="admin"
              onApprove={(id) => handleUpdateStatus(id || selectedReport._id, 'verified')}
              onReject={(id, reason) => handleUpdateStatus(id || selectedReport._id, 'rejected', reason)}
            />
          ) : (
            <>
              {/* Dashboard View */}
              {activeTab === 'dashboard' && (
                <AdminDashboardView
                  reports={reports}
                  pendingCount={pendingCount}
                  verifiedCount={verifiedCount}
                  rejectedCount={rejectedCount}
                  escalatedCount={escalatedCount}
                  onSelectReport={(r) => setSelectedReport(r)}
                  onVerifyReport={(r) => setSelectedReport(r)}
                  adminUser={{
                    name: adminProfile?.fullName || adminProfile?.userName || 'Admin Officer',
                    image: adminProfile?.profilePicture || null,
                  }}
                />
              )}

              {/* Register Municipality */}
              {activeTab === 'registerMunicipality' && (
                <RegisterMunicipalityView />
              )}

              {/* Register Ward */}
              {activeTab === 'registerWard' && (
                <RegisterWardView />
              )}

              {/* Locate Ward */}
              {activeTab === 'locateWard' && (
                <LocateWardView />
              )}

              {/* Add Admin Head */}
              {activeTab === 'addAdminHead' && (
                <AddAdminHeadView />
              )}

              {/* Add Admin */}
              {activeTab === 'addAdmin' && (
                <AddAdminView />
              )}

              {/* Profile */}
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
