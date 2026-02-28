'use client'

import { useEffect } from 'react';

export default function VideoPlayerModal({ videoUrl, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  if (!videoUrl) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shadow-lg hover:bg-white/30 transition-all"
        aria-label="Close video player"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div 
        className="w-full h-auto max-w-4xl max-h-[80vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <video
          src={videoUrl}
          controls
          autoPlay
          className="w-full h-full rounded-lg"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}