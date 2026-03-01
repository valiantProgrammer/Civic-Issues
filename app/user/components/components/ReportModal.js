'use client'

import { useEffect, useState } from 'react'
import PanoramaModal from './PanoramaModal.js'
import VideoPlayerModal from './VideoPlayerModal.js'

export default function ReportModal({ isOpen, onClose, report }) {
  // 1. This check is now at the very top to prevent errors.
  if (!isOpen || !report) {
    return null;
  }

  const [isPanoramaModalOpen, setIsPanoramaModalOpen] = useState(false)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

  // 3. The useEffect hook now only handles side effects (keyboard events and body scroll).
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose]) // This effect only depends on isOpen and onClose

  // Check if the source is a video by its file extension
  const isVideo = report.image && /\.(mp4|webm|ogg)$/i.test(report.image);

  // No need for a placeholder image as we will use the video tag itself for thumbnails
  // const displayImage = isVideo ? `https://via.placeholder.com/400x300/8a2be2/ffffff?text=Video+Report` : report.imageSrc;


  const handleMediaClick = () => {
    if (isVideo) {
      setIsVideoModalOpen(true);
    } else {
      setIsPanoramaModalOpen(true);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending': return { color: 'border-gray-400', bgColor: 'bg-gray-400', text: 'Pending' };
      case 'reviewed': return { color: 'border-yellow-400', bgColor: 'bg-yellow-400', text: 'Reviewed' };
      case 'rejected': return { color: 'border-red-500', bgColor: 'bg-red-500', text: 'Rejected' };
      case 'approved': return { color: 'border-yellow-500', bgColor: 'bg-yellow-500', text: 'Actions Taken' };
      default: return { color: 'border-gray-400', bgColor: 'bg-gray-400', text: 'Unknown' };
    }
  }

  function timeAgo(timeString) {
    const timestamp = new Date(timeString).getTime();
    const now = Date.now();
    const diffMs = now - timestamp;  // Time difference in ms

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);

    if (seconds < 60) {
      return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
    } else if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (days < 30) {
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else {
      return `${months} month${months !== 1 ? 's' : ''} ago`;
    }
  }



  const statusConfig = getStatusConfig(report.status)

  return (
    <>
      <div className="fixed inset-0 z-75 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Media Display Area */}
          <div className="w-full h-48 sm:h-56 bg-gray-200 overflow-hidden relative group" onClick={handleMediaClick}>
            {isVideo ? (
              <>
                {/* Video Thumbnail with Play Button */}
                <video
                  src={report.image}
                  className="w-full h-full object-cover cursor-pointer transition-transform group-hover:scale-110"
                  preload="metadata"
                  muted
                  playsInline
                >
                  Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-100 transition-opacity">
                  <div className="w-12 h-12 bg-purple-600/90 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white ml-1" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Image Display */}
                <img
                  src={report.image}
                  alt={`${report.category} issue: ${report.title}`}
                  className="w-full h-full object-cover cursor-pointer transition-transform group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<div class="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium text-lg">${report.category.charAt(0)}</div>`;
                    }
                  }}
                />
                <div className="absolute top-2 right-2 bg-purple-600/80 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                  360°
                </div>
                <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                  Click to view in 3D
                </div>
              </>
            )}
          </div>

          <div className="p-4 space-y-4 max-h-64 overflow-y-auto">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 leading-tight">
                {report.title}
              </h2>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {report.description || `This is a ${report.category} issue that was reported ${report.time}. The issue has been logged and is currently being reviewed by our team.`}
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Category</span>
                <span className="text-sm font-medium text-gray-900">{report.Title}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Reported</span>
                <span className="text-sm font-medium text-gray-900">{timeAgo(report.createdAt || report.timeOfReporting)}</span>
                {/* <span className="text-sm font-medium text-gray-900">{report.timeOfReporting}</span> */}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${statusConfig.bgColor} ${report.status === 'pending' ? 'border-2 border-gray-400 bg-transparent' : ''}`}></div>
                  <span className="text-sm font-medium text-gray-900">{statusConfig.text}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isPanoramaModalOpen && (
        <PanoramaModal
          imageUrl={report?.image}
          onClose={() => setIsPanoramaModalOpen(false)}
        />
      )}
      {isVideoModalOpen && (
        <VideoPlayerModal
          videoUrl={report?.image}
          onClose={() => setIsVideoModalOpen(false)}
        />
      )}
    </>
  )
}