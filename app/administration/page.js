'use client'
import React, { useState, useEffect, useMemo } from 'react';
import { authApi } from '../../lib/api';
import toast from 'react-hot-toast';
import Navbar from './components/components/Navbar';
import Card from './components/components/Card';
// --- Reusable UI Components defined within the page for simplicity ---


export default function HomePage() {
    const [reports, setReports] = useState([]);
    const [stats, setStats] = useState({ pending: 0, solved: 0, rejected: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            setIsLoading(true);
            try {
                const response = await authApi.getAdminReports();
                const fetchedReports = response.reports || [];
                setReports(fetchedReports);

                const newStats = fetchedReports.reduce((acc, report) => {
                    acc[report.status] = (acc[report.status] || 0) + 1;
                    return acc;
                }, { pending: 0, solved: 0, rejected: 0 });
                setStats(newStats);

            } catch (error) {
                toast.error(`Failed to load reports: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReports();
    }, []);

    const pendingReports = useMemo(() => 
        [reports]
    );

    const handleAction = (action, reportId) => {
        console.log(`Action: ${action} on report ${reportId}`);
        toast.success(`Action '${action}' initiated for report.`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar stats={stats} />
            <main className="max-w-4xl mx-auto px-4 py-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Pending Reports</h2>
                <div className="space-y-4">
                    {isLoading ? (
                        <p className="text-sm text-gray-500">Loading reports...</p>
                    ) : reports.length > 0 ? (
                        reports.map((item) => (
                            <Card
                                key={item._id+1}
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
                            />
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No pending reports found.</p>
                    )}
                </div>
            </main>
        </div>
    );
}

