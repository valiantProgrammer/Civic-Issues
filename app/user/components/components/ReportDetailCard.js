'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PanoramaModal from './PanoramaModal.js';
import VideoPlayerModal from './VideoPlayerModal.js';
import toast from 'react-hot-toast';

export default function ReportDetailCard({ report, onClose }) {
  const [isPanoramaModalOpen, setIsPanoramaModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const router = useRouter();

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
      <div className="bg-white rounded-lg shadow-lg overflow-y-auto flex flex-col max-h-screen">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-6 flex justify-between items-start border-b">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2">{report.Title}</h2>
            <p className="text-white/80 text-sm">{report.category}</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors ml-4"
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

        {/* Description */}
        <div className="px-6 py-6 border-b">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {report.Description || 'No additional description provided'}
          </p>
        </div>

        {/* Details */}
        <div className="px-6 py-6 border-b">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Report Details</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Category</p>
              <p className="text-sm text-gray-900">{report.category}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Severity</p>
              <p className="text-sm text-gray-900 capitalize">{report.severity || 'Medium'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Location</p>
              <p className="text-sm text-gray-900">
                {report.street || `${report.locationCoordinates}`}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Submitted On</p>
              <p className="text-sm text-gray-900">{formatDate(report.createdAt)}</p>
            </div>
            {report.updatedAt && report.updatedAt !== report.createdAt && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Last Updated</p>
                <p className="text-sm text-gray-900">{formatDate(report.updatedAt)}</p>
              </div>
            )}
          </div>
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
