'use client'
import React, { useState, useEffect, useMemo } from 'react';
import { authApi } from '../../lib/api';
import toast from 'react-hot-toast';
import Navbar from './components/components/Navbar';
import ReportDetailView from '@/app/admin/components/ReportDetailView';
import AdminProfile from './components/AdminProfile';
// --- Reusable UI Components defined within the page for simplicity ---


export default function HomePage() {
    const [reports, setReports] = useState([]);
    const [stats, setStats] = useState({ pending: 0, verified: 0, rejected: 0, approved: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);
    const [currentView, setCurrentView] = useState('pending');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchReports = async () => {
            setIsLoading(true);
            try {
                const response = await authApi.getAdministrationReports();
                const fetchedReports = response.reports || [];
                console.log('Fetched reports:', fetchedReports);
                console.log('Report statuses:', fetchedReports.map(r => ({ id: r._id, status: r.status })));
                setReports(fetchedReports);

                const newStats = fetchedReports.reduce((acc, report) => {
                    acc[report.status] = (acc[report.status] || 0) + 1;
                    return acc;
                }, { pending: 0, verified: 0, rejected: 0, approved: 0 });
                console.log('Calculated stats:', newStats);
                setStats(newStats);

            } catch (error) {
                toast.error(`Failed to load reports: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReports();
    }, []);

    const filteredReports = useMemo(() => {
        if (currentView === 'profile') return [];
        const statusMap = { pending: 'verified', approved: 'approved', rejected: 'rejected' };
        
        let filtered = reports.filter(report => report.status === statusMap[currentView]);
        
        // Apply search filter if search query exists
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(report => 
                report.Title?.toLowerCase().includes(query) ||
                report.Description?.toLowerCase().includes(query) ||
                report.municipalityName?.toLowerCase().includes(query) ||
                report.ward?.toLowerCase().includes(query) ||
                report.severity?.toLowerCase().includes(query) ||
                report.mediaType?.toLowerCase().includes(query) ||
                report.ticketId?.toLowerCase().includes(query) ||
                report._id?.toLowerCase().includes(query)
            );
        }
        
        return filtered;
    }, [reports, currentView, searchQuery]);

    // Close report details when switching tabs
    useEffect(() => {
      setSelectedReport(null);
    }, [currentView]);

    const handleAction = (action, reportId, augmentedDescription) => {
        if (action === 'Approved') {
            handleApprove(reportId);
        } else if (action === 'Rejected') {
            // Extract rejection reason from augmented description
            const reasonMatch = augmentedDescription?.match(/Rejection Reason: (.+)$/m);
            const reason = reasonMatch ? reasonMatch[1] : 'No reason provided';
            handleReject(reportId, reason);
        }
    };

    const updateReportStatus = async (reportId, newStatus, reason = null) => {
        try {
            // Update the report status via API
            await authApi.updateReportStatus(reportId, newStatus, reason);
            
            // Update local state - update the report and refresh stats
            const updatedReports = reports.map(report =>
                report._id === reportId ? { ...report, status: newStatus } : report
            );
            setReports(updatedReports);
            
            // Recalculate stats
            const newStats = updatedReports.reduce((acc, report) => {
                acc[report.status] = (acc[report.status] || 0) + 1;
                return acc;
            }, { pending: 0, verified: 0, rejected: 0, approved: 0 });
            setStats(newStats);
            
            // Close the detail view
            setSelectedReport(null);
            
            toast.success(`Report ${newStatus} successfully!`);
        } catch (error) {
            toast.error(`Failed to update report: ${error.message}`);
        }
    };

    const handleApprove = (reportId) => {
        updateReportStatus(reportId, 'approved');
    };

    const handleReject = (reportId, reason) => {
        updateReportStatus(reportId, 'rejected', reason);
    };

    const handleSendToMunicipality = (municipalityName, message) => {
        try {
            // Update to indicate report was forwarded
            const updatedReports = reports.map(report =>
                report._id === selectedReport._id 
                    ? { ...report, status: 'sent', targetMunicipality: municipalityName, forwardMessage: message }
                    : report
            );
            setReports(updatedReports);
            setSelectedReport(null);
            toast.success(`Report sent to ${municipalityName} successfully!`);
        } catch (error) {
            toast.error(`Failed to send report: ${error.message}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
            {/* Navbar - Fixed on left for lg, top for smaller screens */}
            <div className="lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-64">
                <Navbar stats={{ pending: stats.verified || 0, approved: stats.approved || 0, rejected: stats.rejected || 0 }} currentView={currentView} setCurrentView={setCurrentView} />
            </div>
            
            {/* Main Content - Adjusted for sidebar on lg */}
            <div className="flex-1 lg:ml-64 p-6">
                {selectedReport ? (
                    <ReportDetailView report={selectedReport} onClose={() => setSelectedReport(null)} userRole="administration" onApprove={() => handleApprove(selectedReport._id)} onReject={(reason) => handleReject(selectedReport._id, reason)} onSend={handleSendToMunicipality} />
                ) : currentView === 'profile' ? (
                    <AdminProfile />
                ) : (
                    <main className="px-4 py-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 capitalize">{currentView} Reports</h2>
                            <div className="w-full sm:w-80">
                                <div className="relative">
                                    <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Search by title, location, severity, ticket ID..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm text-black"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {searchQuery && (
                            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    Found <span className="font-semibold">{filteredReports.length}</span> {currentView} report{filteredReports.length !== 1 ? 's' : ''} matching &quot;<span className="font-semibold">{searchQuery}</span>&quot;
                                </p>
                            </div>
                        )}

                        <div className="space-y-3 sm:space-y-4">
                            {isLoading ? (
                                <p className="text-sm text-gray-500">Loading reports...</p>
                            ) : filteredReports.length > 0 ? (
                                filteredReports.map((item) => (
                                    <div
                                        key={item._id}
                                        onClick={() => setSelectedReport(item)}
                                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 flex items-center space-x-3 sm:space-x-4 w-full transition-all hover:shadow-md cursor-pointer hover:border-orange-300"
                                    >
                                        {/* Left: Image Thumbnail */}
                                        <div className="w-16 h-16 sm:w-18 sm:h-18 flex-shrink-0">
                                            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        alt={item.Title}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.style.display = "none";
                                                            e.target.parentElement.innerHTML = `<div class="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center text-gray-600 font-medium text-sm">${item.Title?.charAt(0) || 'R'}</div>`;
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                                                        {item.Title?.charAt(0) || 'R'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Middle: Content */}
                                        <div className="flex-1 min-w-0 pr-2">
                                            <h3 className="text-sm font-medium text-gray-900 truncate leading-tight">
                                                {item.Title}
                                            </h3>
                                            <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-snug">
                                                {item.Description ? item.Description.substring(0, 80) + (item.Description.length > 80 ? '...' : '') : 'No description'}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1 leading-tight">
                                                {item.municipalityName} • {item.severity || 'Medium'} severity
                                            </p>
                                        </div>

                                        {/* Right: Status Badge */}
                                        <div className="flex flex-col items-end space-y-1 flex-shrink-0">
                                            <div className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                currentView === 'pending' ? 'bg-blue-100 text-blue-700' :
                                                currentView === 'approved' ? 'bg-green-100 text-green-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                                {currentView === 'pending' ? 'Verified' : currentView === 'approved' ? 'Approved' : 'Rejected'}
                                            </div>
                                            {item.ticketId && (
                                                <span className="text-xs text-gray-500 font-medium max-w-16 sm:max-w-20 text-right">
                                                    {item.ticketId}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">
                                    {searchQuery 
                                        ? `No ${currentView} reports found matching "${searchQuery}".` 
                                        : `No ${currentView} reports found.`
                                    }
                                </p>
                            )}
                        </div>
                    </main>
                )}
            </div>
        </div>
    );
}

