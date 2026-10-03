'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import toast from 'react-hot-toast';
import PanoramaModal from '@/app/user/components/components/PanoramaModal';
import HelpCard from '@/app/user/components/components/HelpCard';
import { motion, AnimatePresence } from 'framer-motion';

const rejectButtonStyles = `
  .reject-btn {
    background-color: white;
    border: 2px solid #b91c1c;
    color: #dc2626;
    position: relative;
    overflow: hidden;
    font-weight: 600;
    z-index: 1;
    transition: color 0.3s ease, border-color 0.3s ease;
  }

  .reject-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #dc2626 0%, #991b1b 100%);
    transform: translateX(-100%);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: -1;
  }

  .reject-btn:hover::before {
    transform: translateX(0);
  }

  .reject-btn:hover {
    color: white;
    border-color: #dc2626;
  }
`;

const SparklesIcon = ({ className = 'w-4 h-4' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

export default function ReportDetailView({
  report = {},
  onClose,
  userRole = 'admin',
  onApprove,
  onReject,
  onSend,
}) {
  const [similarReports, setSimilarReports] = useState({
    areaCount: 0,
    categoryCount: 0,
    totalSimilar: 0,
  });
  const [loadingSimilar, setLoadingSimilar] = useState(true);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSuggestingReason, setIsSuggestingReason] = useState(false);
  const [suggestedReason, setSuggestedReason] = useState('');
  const [forwardType, setForwardType] = useState('municipality');
  const [forwardData, setForwardData] = useState({
    targetMunicipality: '',
    targetWard: '',
    targetAuthority: '',
    reason: '',
  });
  const [rightSideTab, setRightSideTab] = useState('both'); // 'both', 'history', 'help'

  // Extract core fields with solid defaults
  const ticketId = report?.ticketId || report?.id || report?._id || 'CIVIC-20261002-A72Q';
  const title = report?.Title || report?.title || `${report?.category || 'Civic Issue'} - ${report?.ward || 'Area'}`;
  const ward = report?.ward || 'Ward 7';
  const municipality = report?.municipalityName || report?.municipality || 'City South';
  const category = report?.category || 'Water Works';
  const severity = report?.severity || 'High';
  const description =
    report?.Description ||
    report?.description ||
    'Major main line pipe burst causing street inundation.';

  // Format dates safely to eliminate any "Invalid Date"
  const formatReportDate = (rep) => {
    const raw = rep?.createdAt || rep?.date || rep?.reportedDate;
    if (raw) {
      const d = new Date(raw);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      }
    }
    if (rep?.timeOfReporting) return rep.timeOfReporting;
    return 'Oct 02, 2026';
  };

  const formatReportTime = (rep) => {
    const raw = rep?.createdAt || rep?.date;
    if (raw) {
      const d = new Date(raw);
      if (!isNaN(d.getTime())) {
        return d.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        });
      }
    }
    if (rep?.time) return rep.time;
    return '10:21 AM';
  };

  const formatReportDateTime = (rep) => {
    const raw = rep?.createdAt || rep?.date || rep?.reportedDate;
    if (raw) {
      const d = new Date(raw);
      if (!isNaN(d.getTime())) {
        return d.toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      }
    }
    if (rep?.timeOfReporting) return rep.timeOfReporting;
    return 'Oct 02, 2026, 10:21 AM';
  };

  // Image Gallery
  const defaultThumb = '/images/street_issue_thumb.jpg';
  const primaryImage = report?.image || report?.images?.[0] || defaultThumb;
  const [activeImage, setActiveImage] = useState(primaryImage);

  useEffect(() => {
    setActiveImage(report?.image || report?.images?.[0] || defaultThumb);
  }, [report?.image, report?.images]);

  const galleryImages = useMemo(() => {
    return [
      primaryImage,
      report?.images?.[1] || '/images/street_light_thumb.jpg',
      report?.images?.[2] || '/images/garbage_thumb.jpg',
    ];
  }, [primaryImage, report?.images]);

  // Normalized Status and Badge Details
  const rawStatus = (report?.status || 'pending').toLowerCase().replace(/_/g, ' ');

  const getStatusBadgeConfig = (status) => {
    if (status === 'verified' || status === 'approved') {
      return {
        label: 'Verified',
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
        border: 'border-emerald-200/80',
        dot: 'bg-emerald-500',
      };
    }
    if (status === 'in progress' || status === 'assigned') {
      return {
        label: 'In Progress',
        bg: 'bg-amber-50',
        text: 'text-amber-600',
        border: 'border-amber-200/80',
        dot: 'bg-amber-500',
      };
    }
    if (status === 'solved' || status === 'resolved') {
      return {
        label: 'Resolved',
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-300',
        dot: 'bg-emerald-600',
      };
    }
    if (status === 'forwarded') {
      return {
        label: 'Forwarded',
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        border: 'border-blue-200/80',
        dot: 'bg-blue-500',
      };
    }
    if (status === 'rejected') {
      return {
        label: 'Rejected',
        bg: 'bg-rose-50',
        text: 'text-rose-600',
        border: 'border-rose-200/80',
        dot: 'bg-rose-500',
      };
    }
    return {
      label: 'Pending',
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-200/80',
      dot: 'bg-amber-500',
    };
  };

  const badgeConfig = getStatusBadgeConfig(rawStatus);

  // Activity History Stepper Milestones matching screenshot
  const timelineNodes = useMemo(() => {
    const isApprovedOrVerified =
      ['verified', 'approved', 'forwarded', 'in progress', 'assigned', 'solved', 'resolved'].includes(rawStatus) ||
      Boolean(report?.verified) ||
      Boolean(report?.verifiedBy);
    const isForwarded =
      ['forwarded', 'assigned', 'in progress', 'solved', 'resolved'].includes(rawStatus) ||
      Boolean(report?.forwardedTo);
    const isAssigned = ['assigned', 'in progress', 'solved', 'resolved'].includes(rawStatus);
    const isInProgress = ['in progress', 'solved', 'resolved'].includes(rawStatus);
    const isResolved = ['solved', 'resolved'].includes(rawStatus);
    const isRejected = rawStatus === 'rejected';

    if (isRejected) {
      return [
        {
          id: 1,
          title: 'Report submitted',
          time: `${formatReportDate(report)}, ${formatReportTime(report)}`,
          completed: true,
          color: 'blue',
        },
        {
          id: 2,
          title: 'Rejected by Reviewer',
          time: report?.rejectedAt ? formatReportDateTime({ createdAt: report.rejectedAt }) : 'Review completed',
          completed: true,
          color: 'rose',
          isRejectedNode: true,
        },
      ];
    }

    return [
      {
        id: 1,
        title: 'Report submitted',
        time: `${formatReportDate(report)}, ${formatReportTime(report)}`,
        completed: true,
        color: 'blue',
      },
      {
        id: 2,
        title: 'Verified by Admin',
        time: isApprovedOrVerified
          ? report?.verifiedAt
            ? formatReportDateTime({ createdAt: report.verifiedAt })
            : 'Oct 02, 10:45 AM'
          : 'Pending',
        completed: isApprovedOrVerified,
        inProgress: rawStatus === 'pending',
        color: 'green',
      },
      {
        id: 3,
        title: 'Forwarded to Municipality',
        time: isForwarded
          ? report?.forwardedAt
            ? formatReportDateTime({ createdAt: report.forwardedAt })
            : 'Oct 03, 11:10 AM'
          : 'Pending',
        completed: isForwarded,
        inProgress: rawStatus === 'verified' || rawStatus === 'approved',
        color: 'green',
      },
      {
        id: 4,
        title: 'Assigned to Department',
        time: isAssigned ? 'Oct 03, 08:20 AM' : 'Pending',
        completed: isAssigned,
        inProgress: rawStatus === 'forwarded',
        color: 'teal',
      },
      {
        id: 5,
        title: 'In Progress',
        time: isInProgress ? 'Oct 04, 02:15 PM' : 'Pending',
        completed: isResolved,
        inProgress: rawStatus === 'in progress',
        color: 'amber',
      },
      {
        id: 6,
        title: 'Resolved',
        time: isResolved ? 'Oct 05, 04:30 PM' : 'Pending',
        completed: isResolved,
        color: 'slate',
      },
    ];
  }, [report, rawStatus]);

  // Fetch Similar Reports Statistics
  useEffect(() => {
    const fetchSimilarReports = async () => {
      try {
        if (!report?._id || !report?.ward || !report?.category) {
          setLoadingSimilar(false);
          return;
        }

        const response = await fetch(
          `/api/reports/similar?reportId=${report._id}&ward=${encodeURIComponent(report.ward)}&category=${encodeURIComponent(report.category)}`
        );
        if (response.ok) {
          const data = await response.json();
          setSimilarReports(data);
        }
      } catch (error) {
        console.error('Error fetching similar reports:', error);
      } finally {
        setLoadingSimilar(false);
      }
    };

    fetchSimilarReports();
  }, [report?._id, report?.ward, report?.category]);

  // Municipalities for forwarding
  const MUNICIPALITIES = [
    { name: 'City North', wards: ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4'] },
    { name: 'City South', wards: ['Ward 5', 'Ward 6', 'Ward 7'] },
    { name: 'City East', wards: ['Ward 8', 'Ward 9'] },
    { name: 'City West', wards: ['Ward 10', 'Ward 11', 'Ward 12'] },
  ];

  const HIGHER_AUTHORITIES = [
    'State Urban Development Department',
    'National Highway Authority of India (NHAI)',
    'Public Works Department (PWD)',
    'State Environmental Protection Agency',
    "Chief Minister's Office",
  ];

  // Actions
  const handleSendToMunicipality = (e) => {
    e.preventDefault();
    if (!forwardData.reason) {
      toast.error('Please provide a reason for forwarding');
      return;
    }
    if (forwardType === 'municipality' && !forwardData.targetMunicipality) {
      toast.error('Please select a target municipality');
      return;
    }
    if (forwardType === 'authority' && !forwardData.targetAuthority) {
      toast.error('Please select a target authority');
      return;
    }

    if (onSend) {
      const details =
        forwardType === 'municipality'
          ? {
              type: 'municipality',
              municipality: forwardData.targetMunicipality,
              ward: forwardData.targetWard,
              reason: forwardData.reason,
            }
          : {
              type: 'authority',
              authority: forwardData.targetAuthority,
              reason: forwardData.reason,
            };
      onSend(
        forwardData.targetMunicipality || forwardData.targetAuthority,
        forwardData.reason,
        details
      );
    }
    setShowSendModal(false);
    setForwardType('municipality');
    setForwardData({
      targetMunicipality: '',
      targetWard: '',
      targetAuthority: '',
      reason: '',
    });
    toast.success('Report forwarded successfully');
  };

  const handleConfirmApproval = () => {
    if (onApprove) {
      onApprove(report?._id || report?.id);
    }
    setShowApprovalModal(false);
    toast.success('Report approved successfully');
  };

  const handleConfirmRejection = () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    if (onReject) {
      onReject(report?._id || report?.id, rejectionReason);
    }
    setShowRejectionModal(false);
    setRejectionReason('');
    setSuggestedReason('');
    toast.success('Report rejected successfully');
  };

  const handleSuggestReason = async () => {
    setIsSuggestingReason(true);
    try {
      const response = await fetch('/api/admin-reports/suggest-rejection-reason', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });
      if (response.ok) {
        const data = await response.json();
        const reason =
          data.suggestedReason ||
          'Duplicate report already queued for municipal review in this ward.';
        setSuggestedReason(reason);
        setRejectionReason(reason);
      } else {
        const fallback =
          'Insufficient photographic evidence or vague location provided for dispatch.';
        setSuggestedReason(fallback);
        setRejectionReason(fallback);
      }
    } catch {
      const fallback =
        'Issue falls outside the municipal civic jurisdiction or is duplicate.';
      setSuggestedReason(fallback);
      setRejectionReason(fallback);
    } finally {
      setIsSuggestingReason(false);
    }
  };

  // Google Maps Search Query
  const mapSearchQuery = useMemo(() => {
    if (report?.locationCoordinates?.coordinates) {
      return `${report.locationCoordinates.coordinates[1]},${report.locationCoordinates.coordinates[0]}`;
    }
    const parts = [
      report?.street,
      report?.locality,
      ward,
      municipality,
      'Kolkata',
    ].filter((p) => p && p !== 'Not specified');
    return parts.length > 0 ? parts.join(', ') : 'Kolkata, India';
  }, [report, ward, municipality]);

  return (
    <>
      <style>{rejectButtonStyles}</style>

      <div className="w-full space-y-6 font-sans antialiased text-slate-800 pb-16">
        {/* 1. Top Navigation & Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors mb-2 cursor-pointer"
            >
              <span className="text-sm">←</span>
              <span>Back to Reports</span>
            </button>

            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {ticketId}
              </h1>

              {/* Status Badge */}
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-xs ${badgeConfig.bg} ${badgeConfig.text} ${badgeConfig.border}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${badgeConfig.dot}`} />
                <span>{badgeConfig.label}</span>
              </span>

              {/* AI Verified Pill if applicable */}
              {report?.verified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  AI Verified
                </span>
              )}

              {/* Copy Ticket ID button */}
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(ticketId);
                  toast.success('Ticket ID copied to clipboard');
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Copy Ticket ID"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Quick Action Buttons in Header for fast desktop access */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {userRole === 'administration' && (
              <>
                <button
                  type="button"
                  onClick={() => setShowSendModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Forward to Municipality
                </button>
                <button
                  type="button"
                  onClick={() => setShowRejectionModal(true)}
                  className="reject-btn px-4 py-2 rounded-xl text-xs sm:text-sm cursor-pointer"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => setShowApprovalModal(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Approve
                </button>
              </>
            )}

            {userRole === 'admin' && rawStatus === 'pending' && (
              <>
                <button
                  type="button"
                  onClick={() => setShowRejectionModal(true)}
                  className="reject-btn px-4 py-2 rounded-xl text-xs sm:text-sm cursor-pointer"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => setShowApprovalModal(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Approve
                </button>
              </>
            )}

            {userRole === 'admin' && rawStatus === 'rejected' && (
              <button
                type="button"
                onClick={() => onReject && onReject(report?._id || report?.id, null)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Make Pending
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

        {/* 2. Hero Section: Exact 2-Column Layout matching Screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left / Center Column (8 cols): Media Gallery + Details & Mini Map */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Photos Side (6 cols) */}
            <div className="md:col-span-6 space-y-2">
              {/* Big Main Image */}
              <div
                className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm cursor-pointer group"
                onClick={() => setFullscreenImage(activeImage)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setFullscreenImage(activeImage)}
                title="Click to view full size 360°"
              >
                <img
                  src={activeImage}
                  alt="Report evidence"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5 backdrop-blur-[2px]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                  <span>Click to view full size</span>
                </div>
              </div>

              {/* 3 Thumbnails row below */}
              <div className="grid grid-cols-3 gap-2">
                {galleryImages.map((imgSrc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(imgSrc)}
                    className={`relative aspect-[4/3] rounded-xl overflow-hidden border transition-all cursor-pointer ${
                      activeImage === imgSrc
                        ? 'border-blue-600 ring-2 ring-blue-500/30'
                        : 'border-slate-200 opacity-75 hover:opacity-100 hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={imgSrc}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Details & Map Card (6 cols) */}
            <div className="md:col-span-6 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {title}
                </h2>
                <div className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
                  {ward}{municipality && `, ${municipality}`}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Submitted {formatReportDate(report)} • {formatReportTime(report)}
                </div>

                {/* Description */}
                <div className="mt-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
                    Description
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>

              {/* Location & Mini Map Card */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                  Location
                </div>

                <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner group">
                  {/* Visual Map Backdrop */}
                  <img
                    src="/images/city_map_bg.jpg"
                    alt="City Map Preview"
                    className="w-full h-full object-cover opacity-90 contrast-105"
                  />

                  {/* Center Pin */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center pointer-events-none">
                    <div className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg ring-2 ring-white animate-bounce">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* View Map Button Overlay */}
                  <div className="absolute top-2.5 right-2.5">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        mapSearchQuery
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/95 hover:bg-white text-blue-600 text-[11px] font-bold rounded-lg shadow-sm border border-slate-200/80 transition-all hover:shadow"
                    >
                      <span>View Map</span>
                      <span className="text-xs">→</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Full Right Side containing Activity History & Help/Support */}
          <div className="lg:col-span-4 space-y-4">
            {/* Segmented Tab Switcher */}
            <div className="bg-white rounded-2xl p-1.5 border border-slate-200 shadow-2xs flex items-center gap-1">
              <button
                type="button"
                onClick={() => setRightSideTab('history')}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                  rightSideTab === 'history'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Activity History
              </button>
              <button
                type="button"
                onClick={() => setRightSideTab('help')}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-1 ${
                  rightSideTab === 'help'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>Help & Support</span>
              </button>
              <button
                type="button"
                onClick={() => setRightSideTab('both')}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                  rightSideTab === 'both'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                }`}
                title="Show Both Stacked on Right Side"
              >
                Both
              </button>
            </div>

            {/* 1. Activity History (Current Thing) */}
            {(rightSideTab === 'history' || rightSideTab === 'both') && (
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Activity History
                  </h2>
                  <span className="text-[11px] font-semibold text-slate-400">
                    Live Progress
                  </span>
                </div>

                {/* Vertical Stepper Timeline matching user reference */}
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {timelineNodes.map((node) => (
                    <div key={node.id} className="relative flex items-start gap-3">
                      {/* Node Indicator Icon */}
                      <div className="absolute -left-6 top-0.5">
                        {node.completed ? (
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-xs ${
                              node.color === 'blue'
                                ? 'bg-blue-600 ring-4 ring-blue-100'
                                : node.color === 'rose'
                                ? 'bg-rose-600 ring-4 ring-rose-100'
                                : 'bg-emerald-500 ring-4 ring-emerald-100'
                            }`}
                          >
                            {node.isRejectedNode ? '✕' : '✓'}
                          </div>
                        ) : node.inProgress ? (
                          <div className="w-5 h-5 rounded-full border-2 border-emerald-500 bg-white flex items-center justify-center ring-4 ring-emerald-50">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-slate-300 bg-white flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                          </div>
                        )}
                      </div>

                      {/* Node Details */}
                      <div className="flex-1">
                        <p
                          className={`text-xs sm:text-sm font-bold ${
                            node.completed
                              ? 'text-slate-900'
                              : node.inProgress
                              ? 'text-emerald-700'
                              : 'text-slate-400'
                          }`}
                        >
                          {node.title}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{node.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Audit Log Entries if present in database */}
                {Array.isArray(report?.history) && report.history.length > 0 && (
                  <div className="mt-8 pt-5 border-t border-slate-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">
                      Audit Records ({report.history.length})
                    </p>
                    <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1 text-xs">
                      {report.history.map((entry, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70"
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="font-semibold text-slate-800 capitalize">
                              {entry.action || 'Updated'}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {formatReportDateTime({ createdAt: entry.timestamp || entry.date })}
                            </span>
                          </div>
                          {entry.changedBy && (
                            <p className="text-[11px] text-slate-500">By: {entry.changedBy}</p>
                          )}
                          {entry.note && (
                            <p className="text-[11px] text-slate-600 mt-0.5 italic">&quot;{entry.note}&quot;</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. Help & Support (Full Right Side matching reference) */}
            {(rightSideTab === 'help' || rightSideTab === 'both') && (
              <div className="w-full">
                <HelpCard />
              </div>
            )}
          </div>
        </div>

        {/* 3. Detailed Administration Sections requested by User */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Issue Information */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Issue Information
            </h3>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Category</span>
                <span className="font-bold text-slate-800">{category}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Severity</span>
                <span
                  className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    severity.toLowerCase() === 'high'
                      ? 'bg-rose-100 text-rose-800'
                      : severity.toLowerCase() === 'medium'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {severity}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Reported Date</span>
                <span className="font-semibold text-slate-800">
                  {formatReportDate(report)}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 font-medium">Reported Time</span>
                <span className="font-semibold text-slate-800">
                  {formatReportTime(report)}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Location Information */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Location Information
            </h3>
            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Ward Number</span>
                <span className="font-bold text-slate-800">{ward}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Municipality</span>
                <span className="font-bold text-slate-800">{municipality}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Building</span>
                <span className="text-slate-700">{report?.building || 'Not specified'}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Street</span>
                <span className="text-slate-700">{report?.street || 'Not specified'}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Locality</span>
                <span className="text-slate-700">{report?.locality || 'Not specified'}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Property Type</span>
                <span className="text-slate-700">{report?.propertyType || 'Not specified'}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 font-medium">Coordinates</span>
                <span className="font-mono text-[11px] text-slate-700">
                  {report?.locationCoordinates?.coordinates
                    ? `${report.locationCoordinates.coordinates[1].toFixed(4)}, ${report.locationCoordinates.coordinates[0].toFixed(4)}`
                    : report?.coordinates || 'Not available'}
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Report Processing Information */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Report Processing
            </h3>
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-500 font-medium">Reported By</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                    Submitted
                  </span>
                </div>
                <p className="font-semibold text-slate-900">
                  {report?.ReporterName || report?.reporterName || 'Anonymous'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-500 font-medium">Verified By</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      report?.verified || report?.verifiedBy
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {report?.verified || report?.verifiedBy ? '✓ Verified' : 'Pending'}
                  </span>
                </div>
                <p className="font-semibold text-slate-900">
                  {report?.verifiedBy || report?.verifiedByName || (report?.verified ? 'Automated AI Verification' : 'Pending')}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-500 font-medium">Processed By</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      report?.processedBy || report?.processedByName
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {report?.processedBy || report?.processedByName ? '✓ Processed' : 'Pending'}
                  </span>
                </div>
                <p className="font-semibold text-slate-900">
                  {report?.processedBy || report?.processedByName || 'Not Yet Processed'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Similar Reports in Area Statistics */}
        <div className="bg-gradient-to-br from-blue-50/70 to-indigo-50/50 border border-blue-200/80 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">Similar Reports in Area</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Duplicate detection and concentration analysis for Ward {ward}
              </p>
            </div>
            {loadingSimilar && (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-blue-100 rounded-xl p-4 shadow-2xs">
              <p className="text-xs font-semibold text-slate-500 mb-1">Same Area (Ward)</p>
              <p className="text-2xl sm:text-3xl font-black text-blue-600">
                {similarReports.areaCount}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Reports in {ward}</p>
            </div>

            <div className="bg-white border border-purple-100 rounded-xl p-4 shadow-2xs">
              <p className="text-xs font-semibold text-slate-500 mb-1">Same Category</p>
              <p className="text-2xl sm:text-3xl font-black text-purple-600">
                {similarReports.categoryCount}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">{category}</p>
            </div>

            <div className="bg-white border border-amber-100 rounded-xl p-4 shadow-2xs">
              <p className="text-xs font-semibold text-slate-500 mb-1">Total Similar</p>
              <p className="text-2xl sm:text-3xl font-black text-amber-600">
                {similarReports.totalSimilar}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Area + Category overlap</p>
            </div>
          </div>
        </div>

        {/* 5. Rejection Reason Banner if applicable */}
        {report?.rejectionReason && (
          <div className="border border-rose-200 bg-rose-50 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-2 text-rose-800 font-bold text-sm">
              <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Rejection Reason</span>
            </div>
            <p className="text-xs sm:text-sm text-rose-900 leading-relaxed pl-7">
              {report.rejectionReason}
            </p>
          </div>
        )}
      </div>

      {/* Forward Form Modal */}
      {showSendModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowSendModal(false);
          }}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Forward Civic Case</h3>
                <p className="text-xs text-slate-500">
                  Routing Ticket {ticketId} to field authorities
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSendModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="flex border-b border-slate-200 mb-4">
              <button
                type="button"
                onClick={() => setForwardType('municipality')}
                className={`flex-1 py-2 text-xs sm:text-sm font-semibold text-center transition-all ${
                  forwardType === 'municipality'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                To Municipality
              </button>
              <button
                type="button"
                onClick={() => setForwardType('authority')}
                className={`flex-1 py-2 text-xs sm:text-sm font-semibold text-center transition-all ${
                  forwardType === 'authority'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                To Higher Authority
              </button>
            </div>

            <form onSubmit={handleSendToMunicipality} className="space-y-4">
              {forwardType === 'municipality' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Target Municipality
                    </label>
                    <select
                      className="w-full border text-slate-800 border-slate-300 rounded-xl px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      value={forwardData.targetMunicipality}
                      onChange={(e) =>
                        setForwardData({
                          ...forwardData,
                          targetMunicipality: e.target.value,
                          targetWard: '',
                        })
                      }
                      required={forwardType === 'municipality'}
                    >
                      <option value="" disabled>
                        Select municipality...
                      </option>
                      {MUNICIPALITIES.map((m) => (
                        <option key={m.name} value={m.name}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Target Ward
                    </label>
                    <select
                      className="w-full border text-slate-800 border-slate-300 rounded-xl px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      value={forwardData.targetWard}
                      onChange={(e) =>
                        setForwardData({ ...forwardData, targetWard: e.target.value })
                      }
                      disabled={!forwardData.targetMunicipality}
                      required={forwardType === 'municipality'}
                    >
                      <option value="" disabled>
                        Select ward...
                      </option>
                      {MUNICIPALITIES.find(
                        (m) => m.name === forwardData.targetMunicipality
                      )?.wards.map((w) => (
                        <option key={w} value={w}>
                          {w}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {forwardType === 'authority' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Select Higher Authority
                  </label>
                  <select
                    className="w-full border text-slate-800 border-slate-300 rounded-xl px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    value={forwardData.targetAuthority}
                    onChange={(e) =>
                      setForwardData({ ...forwardData, targetAuthority: e.target.value })
                    }
                    required={forwardType === 'authority'}
                  >
                    <option value="" disabled>
                      Select authority...
                    </option>
                    {HIGHER_AUTHORITIES.map((auth) => (
                      <option key={auth} value={auth}>
                        {auth}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason for Forwarding
                </label>
                <textarea
                  className="w-full border text-slate-800 border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  rows="3"
                  placeholder="e.g., Ward boundary realignment or engineering intervention required..."
                  value={forwardData.reason}
                  onChange={(e) =>
                    setForwardData({ ...forwardData, reason: e.target.value })
                  }
                  required
                />
              </div>

              <div className="flex space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowSendModal(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-xl text-white text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
                >
                  Forward Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Approval Confirmation Modal */}
      <AnimatePresence>
        {showApprovalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50"
            onClick={() => setShowApprovalModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto p-6 border border-slate-100"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-900">Confirm Report Approval</h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-4">
                Are you sure you want to approve this civic report? It will progress to departmental dispatch and assignment.
              </p>
              <div className="bg-slate-50 p-4 rounded-xl mb-5 border border-slate-200/70">
                <p className="text-xs font-semibold text-slate-800 line-clamp-2">{description}</p>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Reported by: <span className="font-semibold text-slate-700">{report?.ReporterName || 'Anonymous'}</span> • {ward}
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowApprovalModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs sm:text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmApproval}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs sm:text-sm hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  Confirm Approval
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rejection Modal with AI Assistant */}
      <AnimatePresence>
        {showRejectionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50"
            onClick={() => setShowRejectionModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto p-6 border border-slate-100"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-slate-900">Reason for Rejection</h3>
                <button
                  type="button"
                  onClick={handleSuggestReason}
                  disabled={isSuggestingReason}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors disabled:opacity-50"
                  title="Generate suggested rejection reason"
                >
                  <SparklesIcon className="w-3.5 h-3.5 text-blue-600" />
                  <span>{isSuggestingReason ? 'Thinking...' : 'AI Suggest'}</span>
                </button>
              </div>

              <p className="text-xs text-slate-500 mb-3">
                Please specify the justification for rejecting Ticket <span className="font-semibold text-slate-700">{ticketId}</span>.
              </p>

              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g., Duplicate report, insufficient photographic evidence, or issue already addressed..."
                className="w-full text-slate-800 text-xs sm:text-sm h-28 p-3 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />

              <div className="mt-5 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowRejectionModal(false);
                    setRejectionReason('');
                    setSuggestedReason('');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs sm:text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRejection}
                  disabled={!rejectionReason.trim()}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 text-white font-semibold text-xs sm:text-sm hover:bg-rose-700 disabled:bg-rose-300 transition-colors shadow-xs"
                >
                  Confirm Rejection
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen / Panoramic 360 Viewer */}
      {fullscreenImage && (
        <PanoramaModal
          imageUrl={fullscreenImage}
          onClose={() => setFullscreenImage(null)}
        />
      )}
    </>
  );
}
