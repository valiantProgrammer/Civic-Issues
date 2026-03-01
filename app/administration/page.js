'use client'
import React, { useState, useEffect, useMemo } from 'react';
import { authApi } from '../../lib/api';
import toast from 'react-hot-toast';
import Navbar from './components/components/Navbar';
import Card from './components/components/Card';
import ReportDetailView from '@/app/admin/components/ReportDetailView';
// --- Reusable UI Components defined within the page for simplicity ---


export default function HomePage() {
    const [reports, setReports] = useState([]);
    const [stats, setStats] = useState({ pending: 0, verified: 0, rejected: 0, approved: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);
    const [currentView, setCurrentView] = useState('pending');

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
        const statusMap = { pending: 'verified', approved: 'approved', rejected: 'rejected' };
        return reports.filter(report => report.status === statusMap[currentView]);
    }, [reports, currentView]);

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
            <div className="flex-1 lg:ml-64">
                {selectedReport ? (
                    <ReportDetailView report={selectedReport} onClose={() => setSelectedReport(null)} userRole="administration" onApprove={() => handleApprove(selectedReport._id)} onReject={(reason) => handleReject(selectedReport._id, reason)} onSend={handleSendToMunicipality} />
                ) : (
                    <main className="max-w-6xl mx-auto px-4 py-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-3 capitalize">{currentView} Reports</h2>
                        <div className="space-y-4">
                            {isLoading ? (
                                <p className="text-sm text-gray-500">Loading reports...</p>
                            ) : filteredReports.length > 0 ? (
                                filteredReports.map((item) => (
                                    <div key={item._id} onClick={(e) => {
                                        // Only open detail view if clicking on the card itself, not on buttons
                                        if (e.target.closest('button')) return;
                                        setSelectedReport(item);
                                    }} className="cursor-pointer">
                                        <Card
                                            id={item._id}
                                            title={item.Title}
                                            description={item.Description}
                                            onAction={handleAction}
                                            isCompleted={false}
                                            imageIndex={item.image}
                                            severity={item.severity}
                                            lat={item.locationCoordinates?.coordinates[1]}
                                            lng={item.locationCoordinates?.coordinates[0]}
                                            date={item.timeOfReporting}
                                            municipality={item.municipalityName}
                                            ward={item.ward}
                                            type={item.mediaType}
                                            reportedAt={item.createdAt}
                                            disableDetailsModal={true}
                                        />
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">No {currentView} reports found.</p>
                            )}
                        </div>
                    </main>
                )}
            </div>
        </div>
    );
}

