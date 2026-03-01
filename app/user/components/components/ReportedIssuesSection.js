'use client'

import { useState, useEffect, useCallback } from 'react';
import ReportCard from './ReportCard.js';
import ReportModal from './ReportModal.js';
import { authApi } from '@/lib/api.js';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function ReportedIssuesSection({ filter }) {
    const [allReports, setAllReports] = useState([]); // Store all reports
    const [filteredReports, setFilteredReports] = useState([]); // Store filtered reports
    const [selectedReport, setSelectedReport] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchReports = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await authApi.getUserReports(); // No filter passed
            setAllReports(response.reports || []);
        } catch (err) {
            toast.error("Could not fetch your reports.");
            console.error("Error fetching reports:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Apply filter locally whenever allReports or filter changes
    useEffect(() => {
        const filtered = allReports.filter(report => report.status === filter);
        setFilteredReports(filtered);
    }, [allReports, filter]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    const handleReportClick = (report) => {
        setSelectedReport(report);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedReport(null), 300);
    };

    if (isLoading) {
        return (
            <section className="py-4 sm:py-6 min-h-full">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 px-1">Previously Reported</h2>
                <div className="text-center text-gray-500">Loading your reports...</div>
            </section>
        );
    }

    const hasReports = filteredReports.length > 0;

    return (
        <>
            <section className="py-4 sm:py-6 min-h-full">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 px-1">Previously Reported</h2>

                {hasReports ? (
                    <div className="space-y-3 sm:space-y-4">
                        {filteredReports.map((report) => (
                            <ReportCard
                                key={report._id}
                                title={report.Title}
                                time={report.createdAt || report.timeOfReporting}
                                category={report.category}
                                status={report.status}
                                imageSrc={report.image}
                                onClick={() => handleReportClick(report)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 text-center mx-1">
                        <p className="text-gray-600 mb-4">No reports found for the selected filter.</p>
                        <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                            Report Your First Issue
                        </button>
                    </div>
                )}
            </section>

            <AnimatePresence>
                {isModalOpen && selectedReport && (
                    <ReportModal
                        key="report-modal"
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        report={selectedReport}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
