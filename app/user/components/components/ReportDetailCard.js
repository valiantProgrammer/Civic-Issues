'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PanoramaModal from './PanoramaModal.js';
import VideoPlayerModal from './VideoPlayerModal.js';
import toast from 'react-hot-toast';
import authApi from '@/lib/api.js';

export default function ReportDetailCard({ report, onClose }) {
  const [isPanoramaModalOpen, setIsPanoramaModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [allReports, setAllReports] = useState([]);
  const [statistics, setStatistics] = useState({
    areaReports: 0,
    categoryReports: 0,
    samePlaceAndCategory: 0,
  });
  const router = useRouter();

  // Fetch all reports to calculate statistics
  useEffect(() => {
    const fetchReportsForStats = async () => {
      try {
        const response = await authApi.getUserReports();
        if (response.reports && Array.isArray(response.reports)) {
          setAllReports(response.reports);
          
          // Calculate statistics
          // 1. Reports in same area (same locality)
          const areaReports = response.reports.filter(r => 
            r.locality === report.locality && r._id !== report._id
          ).length;
          
          // 2. Reports with same category
          const categoryReports = response.reports.filter(r =>
            r.category === report.category && r._id !== report._id
          ).length;
          
          // 3. Reports with same place AND same category
          const samePlaceAndCategory = response.reports.filter(r =>
            (r.locality === report.locality || r.street === report.street || r.building === report.building) &&
            r.category === report.category &&
            r._id !== report._id
          ).length;
          
          setStatistics({
            areaReports,
            categoryReports,
            samePlaceAndCategory,
          });
        }
      } catch (error) {
        console.error('Failed to fetch reports for statistics:', error);
      }
    };
    
    if (report) {
      fetchReportsForStats();
    }
  }, [report]);

  if (!report) {
    return null;
  }

  const isVideo = report.image && /\.(mp4|webm|ogg)$/i.test(report.image);

  const handleMediaClick = () => {
    if (isVideo) {
      setIsVideoModalOpen(true);
    } else {
      setIsPanoramaModalOpen(true);
    }
  };

  // Get tracking timeline from history and status
  const getTrackingTimeline = () => {
    const timeline = [];

    // Step 1: Submitted
    const createdEntry = report.history?.find(h => h.action === 'created');
    timeline.push({
      step: 1,
      title: 'Report Submitted',
      description: 'Your report has been submitted for verification',
      date: report.createdAt || createdEntry?.timestamp,
      completed: true,
      current: report.status === 'pending',
    });

    // Step 2: Admin Verification/Review or Rejection
    const approvedEntry = report.history?.find(h => h.action === 'approved');
    const rejectedEntry = report.history?.find(h => h.action === 'rejected');
    
    if (report.status === 'rejected') {
      timeline.push({
        step: 2,
        title: 'Rejected',
        description: `Report was rejected - ${report.rejectionReason || 'See reason above'}`,
        date: rejectedEntry?.timestamp || report.updatedAt,
        completed: true,
        current: true,
        isRejected: true,
      });
    } else if (approvedEntry || report.status !== 'pending') {
      timeline.push({
        step: 2,
        title: 'Verified by Admin',
        description: `Report verified and sent to ${report.municipalityName || 'Municipality'}`,
        date: approvedEntry?.timestamp,
        completed: !!approvedEntry || report.status === 'forwarded' || report.status === 'solved',
        current: !approvedEntry && report.status === 'pending' ? false : true,
      });
    }

    // Step 3: Municipality Processing
    const forwardedEntry = report.history?.find(h => h.action === 'forwarded');
    if (forwardedEntry || report.status === 'forwarded' || report.status === 'solved') {
      timeline.push({
        step: 3,
        title: 'In Progress with Municipality',
        description: report.municipalityName
          ? `Assigned to ${report.municipalityName}`
          : 'Being processed by municipality',
        date: forwardedEntry?.timestamp,
        completed: true,
        current: report.status === 'forwarded' || report.status === 'solved',
      });
    }

    // Step 4: Transferred (if applicable)
    const transferredEntry = report.history?.find(h => h.action === 'transferred');
    if (transferredEntry) {
      timeline.push({
        step: 4,
        title: 'Transferred',
        description: `Transferred to ${transferredEntry.notes || 'another municipality'}`,
        date: transferredEntry.timestamp,
        completed: true,
        current: false,
      });
    }

    // Step 5: Resolved
    if (report.status === 'solved') {
      timeline.push({
        step: timeline.length + 1,
        title: 'Resolved',
        description: 'The issue has been resolved and addressed',
        date: report.updatedAt,
        completed: true,
        current: false,
      });
    }

    return timeline;
  };

  const getStatusMessage = () => {
    switch (report.status) {
      case 'pending':
        return 'Report submitted for the verification to the admin';
      case 'forwarded':
        return `Report is verified by the admin and sent to municipality: ${report.municipalityName || 'Pending'}`;
      case 'solved':
        return `Report has been resolved by ${report.municipalityName || 'the municipality'}`;
      case 'rejected':
        return `Report was rejected. Reason: ${report.rejectionReason || 'Not specified'}. Please edit and resubmit with necessary corrections.`;
      default:
        return 'Status unknown';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const handleEditAndResubmit = () => {
    // Store the report data in session/state for editing
    sessionStorage.setItem('editingReport', JSON.stringify(report));
    toast.success('Navigating to edit report...');
    router.push(`/user/add-report?editId=${report._id}`);
  };

  const timeline = getTrackingTimeline();

  return (
    <>
      <style>{`
        .report-detail-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .report-detail-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .report-detail-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #475569 0%, #334155 100%);
          border-radius: 10px;
          border: 2px solid #f1f5f9;
        }
        .report-detail-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
        }
      `}</style>
      <div className="bg-white rounded-lg shadow-lg overflow-y-auto flex flex-col max-h-screen report-detail-scrollbar">
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 px-6 py-6 flex justify-between items-start border-b-2 border-slate-700 shadow-sm">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-white mb-1 tracking-tight">{report.Title}</h2>
            <p className="text-slate-300 text-sm font-normal">{report.category}</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white hover:bg-slate-700 p-2 rounded-lg transition-all duration-200 ml-4"
              aria-label="Back to list"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
        </div>

        {/* Media */}
        {report.image && (
          <div className="px-6 py-6 border-b">
            <div
              className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden hover:opacity-90 transition-opacity"
              onClick={handleMediaClick}
            >
              {isVideo ? (
                <video
                  src={report.image}
                  className="w-full h-full object-cover"
                  controls
                />
              ) : (
                <img
                  src={report.image}
                  alt="Report"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">Click to view full size</p>
          </div>
        )}

        {/* Status Message */}
        <div className={`px-6 py-4 border-b ${
          report.status === 'rejected' 
            ? 'bg-red-50' 
            : 'bg-blue-50'
        }`}>
          <p className={`text-sm font-medium ${
            report.status === 'rejected' 
              ? 'text-red-900' 
              : 'text-blue-900'
          }`}>
            {getStatusMessage()}
          </p>
        </div>

        {/* Ticket ID */}
        {report.ticketId && (
          <div className="px-6 py-4 bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200">
            <p className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Ticket ID</p>
            <div className="flex items-center gap-3">
              <code className="bg-slate-800 text-slate-100 px-4 py-2 rounded-lg font-mono text-sm font-semibold flex-1">
                {report.ticketId}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(report.ticketId);
                  toast.success('Ticket ID copied to clipboard');
                }}
                className="flex-shrink-0 p-2 hover:bg-slate-200 rounded-lg transition-colors duration-200 text-slate-700 hover:text-slate-900"
                title="Copy to clipboard"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">Use this ID to reference your report</p>
          </div>
        )}

        {/* Description */}
        <div className="px-6 py-6 border-b">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {report.Description || 'No additional description provided'}
          </p>
        </div>

        {/* Details - Table Format */}
        <div className="px-6 py-8 border-b">
          <h3 className="text-lg font-bold text-slate-900 mb-6 tracking-tight">Issue Information</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4 font-semibold text-slate-700 bg-slate-100 w-1/3 text-base">Category</td>
                  <td className="px-4 py-4 text-slate-900 font-bold text-base">{report.category || 'Not specified'}</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4 font-semibold text-slate-700 bg-slate-100 text-base">Severity Level</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${
                      report.severity === 'High' ? 'bg-red-100 text-red-900' :
                      report.severity === 'Medium' ? 'bg-yellow-100 text-yellow-900' :
                      'bg-green-100 text-green-900'
                    }`}>
                      {report.severity || 'Medium'}
                    </span>
                  </td>
                </tr>
                {report.mlPredictedSeverity && (
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4 font-semibold text-slate-700 bg-slate-100 text-base">AI Predicted Severity</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${
                        report.mlPredictedSeverity === 'High' ? 'bg-red-100 text-red-900' :
                        report.mlPredictedSeverity === 'Medium' ? 'bg-yellow-100 text-yellow-900' :
                        'bg-green-100 text-green-900'
                      }`}>
                        {report.mlPredictedSeverity} {report.mlConfidence && `(${(report.mlConfidence * 100).toFixed(1)}%)`}
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-bold text-slate-900 mt-8 mb-6 tracking-tight">Location Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4 font-semibold text-slate-700 bg-slate-100 w-1/3 text-base">Locality</td>
                  <td className="px-4 py-4 text-slate-900 font-bold text-base">{report.locality || 'Not specified'}</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4 font-semibold text-slate-700 bg-slate-100 text-base">Street Name</td>
                  <td className="px-4 py-4 text-slate-900 text-base">{report.street || 'Not specified'}</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4 font-semibold text-slate-700 bg-slate-100 text-base">Building/House Number</td>
                  <td className="px-4 py-4 text-slate-900 text-base">{report.building || 'Not specified'}</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4 font-semibold text-slate-700 bg-slate-100 text-base">Property Type</td>
                  <td className="px-4 py-4 text-slate-900 text-base">{report.propertyType || 'Not specified'}</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4 font-semibold text-slate-700 bg-slate-100 text-base">Ward</td>
                  <td className="px-4 py-4 text-slate-900 text-base">{report.ward || 'Not specified'}</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4 font-semibold text-slate-700 bg-slate-100 text-base">Municipality</td>
                  <td className="px-4 py-4 text-slate-900 font-bold text-base">{report.municipalityName || 'Not specified'}</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4 font-semibold text-slate-700 bg-slate-100 text-base">Coordinates</td>
                  <td className="px-4 py-4 text-slate-900 font-mono text-sm">
                    {report.locationCoordinates?.coordinates 
                      ? `${report.locationCoordinates.coordinates[1]}, ${report.locationCoordinates.coordinates[0]}` 
                      : 'Not available'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-bold text-slate-900 mt-8 mb-6 tracking-tight">Timeline & Dates</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4 font-semibold text-slate-700 bg-slate-100 w-1/3 text-base">Submitted</td>
                  <td className="px-4 py-4 text-slate-900 text-base">{formatDate(report.createdAt)}</td>
                </tr>
                {report.updatedAt && report.updatedAt !== report.createdAt && (
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4 font-semibold text-slate-700 bg-slate-100 text-base">Last Updated</td>
                    <td className="px-4 py-4 text-slate-900 text-base">{formatDate(report.updatedAt)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Admin Processing Information */}
        {report.history && report.history.length > 0 && (
          <div className="px-6 py-8 border-b bg-gradient-to-r from-slate-50 to-blue-50">
            <h3 className="text-lg font-bold text-slate-900 mb-6 tracking-tight">Admin Processing History</h3>
            <div className="space-y-4">
              {report.history.map((entry, index) => (
                <div key={index} className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${
                          entry.action === 'created' ? 'bg-blue-100 text-blue-800' :
                          entry.action === 'approved' ? 'bg-green-100 text-green-800' :
                          entry.action === 'rejected' ? 'bg-red-100 text-red-800' :
                          entry.action === 'forwarded' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {entry.action.charAt(0).toUpperCase() + entry.action.slice(1)}
                        </span>
                      </div>
                      <p className="text-base text-slate-700">
                        <span className="font-bold text-slate-900">{entry.actorName || 'System'}</span>
                        <span className="text-slate-500"> • {entry.actorRole || 'Unknown'}</span>
                      </p>
                      <p className="text-sm text-slate-500 mt-1">{formatDate(entry.timestamp)}</p>
                    </div>
                  </div>
                  {entry.notes && (
                    <div className="mt-4 p-4 bg-slate-100 rounded border-l-4 border-orange-500">
                      <p className="text-sm font-bold text-slate-700 uppercase mb-2">Notes/Reason:</p>
                      <p className="text-base text-slate-800">{entry.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Impact & Statistics */}
        <div className="px-6 py-8 border-b bg-blue-50">
          <h3 className="text-lg font-bold text-slate-900 mb-6 tracking-tight">Impact & Community Alert</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-5 text-center border-2 border-blue-300 shadow-sm">
              <p className="text-3xl font-bold text-blue-600">{statistics.areaReports}</p>
              <p className="text-sm text-slate-700 mt-2 font-medium">Similar reports in<br />{report.locality || 'this area'}</p>
            </div>
            <div className="bg-white rounded-lg p-5 text-center border-2 border-purple-300 shadow-sm">
              <p className="text-3xl font-bold text-purple-600">{statistics.categoryReports}</p>
              <p className="text-sm text-slate-700 mt-2 font-medium">Reports of same<br />issue type</p>
            </div>
            <div className="bg-white rounded-lg p-5 text-center border-2 border-orange-300 shadow-sm">
              <p className="text-3xl font-bold text-orange-600">{statistics.samePlaceAndCategory}</p>
              <p className="text-sm text-slate-700 mt-2 font-medium">Same location &<br />category</p>
            </div>
          </div>
          {statistics.samePlaceAndCategory > 0 && (
            <div className="mt-4 p-4 bg-orange-100 rounded-lg border-l-4 border-orange-500">
              <p className="text-sm text-orange-900 font-bold">
                ⚠️ <strong>{statistics.samePlaceAndCategory} other report(s)</strong> have been submitted for the same issue at this location. This increases the priority of your report!
              </p>
            </div>
          )}
          {statistics.categoryReports > 0 && statistics.samePlaceAndCategory === 0 && (
            <div className="mt-4 p-4 bg-blue-100 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm text-blue-900 font-bold">
                ℹ️ <strong>{statistics.categoryReports + 1} total report(s)</strong> of this issue type have been submitted in your area, showing a community-wide concern.
              </p>
            </div>
          )}
        </div>

        {/* Tracking Timeline */}
        <div className="px-6 py-6 border-b">
          <h3 className="text-sm font-semibold text-gray-900 mb-6">Tracking Timeline</h3>
          <div className="space-y-4">
            {timeline.map((step, index) => (
              <div key={step.step} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step.isRejected
                        ? 'bg-red-100 text-red-700'
                        : step.completed
                          ? 'bg-green-100 text-green-700'
                          : step.current
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {step.isRejected ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    ) : step.completed ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      step.step
                    )}
                  </div>
                  {index < timeline.length - 1 && (
                    <div
                      className={`w-1 h-8 mt-2 ${
                        step.isRejected
                          ? 'bg-red-200'
                          : step.completed
                            ? 'bg-green-200'
                            : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
                <div className="pb-4">
                  <h4 className={`text-sm font-semibold ${step.isRejected ? 'text-red-900' : 'text-gray-900'}`}>
                    {step.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                  {step.date && (
                    <p className="text-xs text-gray-500 mt-2">{formatDate(step.date)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Edit and Resubmit Button for Rejected Reports */}
        {report.status === 'rejected' && (
          <div className="px-6 py-6 bg-red-50 border-t">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-900 mb-1">Report Rejected</h3>
                <p className="text-sm text-red-700 mb-4">
                  {report.rejectionReason || 'Your report needs additional information or corrections before resubmission.'}
                </p>
              </div>
            </div>
            <button
              onClick={handleEditAndResubmit}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit and Resubmit
            </button>
          </div>
        )}
      </div>

      {isPanoramaModalOpen && (
        <PanoramaModal
          imageUrl={report.image}
          onClose={() => setIsPanoramaModalOpen(false)}
        />
      )}

      {isVideoModalOpen && (
        <VideoPlayerModal
          videoUrl={report.image}
          onClose={() => setIsVideoModalOpen(false)}
        />
      )}
    </>
  );
}
