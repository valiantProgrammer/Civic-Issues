"use client";

import { useState } from "react";
import PanoramaModal from "./PanoramaModal.js";

// Helper function to calculate days ago
const getDaysAgo = (date) => {
  const now = new Date();
  const reportDate = new Date(date);
  const diffTime = Math.abs(now - reportDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
};

// Helper function to format date as "20th feb, 2026, 12:45"
const formatDetailedDate = (date) => {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.toLocaleString('en-US', { month: 'short' }).toLowerCase();
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  // Add ordinal suffix (st, nd, rd, th)
  let daySuffix = 'th';
  if (day === 1 || day === 21 || day === 31) daySuffix = 'st';
  else if (day === 2 || day === 22) daySuffix = 'nd';
  else if (day === 3 || day === 23) daySuffix = 'rd';
  
  return `${day}${daySuffix} ${month}, ${year}, ${hours}:${minutes}`;
};

// Helper function to get location string
const getLocationString = (report) => {
  const parts = [];
  if (report.building) parts.push(report.building);
  if (report.street) parts.push(report.street);
  if (report.locality) parts.push(report.locality);
  return parts.length > 0 ? parts.join(', ') : 'Location not specified';
};

export default function ReportCard({
  title,
  time,
  category,
  status,
  imageSrc,
  onClick,
  description,
  report,
}) {
  const [isPanoramaModalOpen, setIsPanoramaModalOpen] = useState(false);

  // Check if the source is a video by its file extension
  const isVideo = imageSrc && /\.(mp4|webm|ogg)$/i.test(imageSrc);

  const getStatusConfig = (status) => {
    switch (status) {
      case "pending":
        return {
          color: "border-gray-400",
          bgColor: "bg-gray-400",
          text: "Pending",
        };
      case "reviewed":
        return {
          color: "border-yellow-400",
          bgColor: "bg-yellow-400",
          text: "Reviewed",
        };
      case "rejected":
        return {
          color: "border-red-500",
          bgColor: "bg-red-500",
          text: "Rejected",
        };
      case "approved":
        return {
          color: "border-yellow-500",
          bgColor: "bg-yellow-500",
          text: "Actions Taken",
        };
      default:
        return {
          color: "border-gray-400",
          bgColor: "bg-gray-400",
          text: "Unknown",
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  return (
    <>
      <div
        className={`bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 flex items-center space-x-3 sm:space-x-4 w-full transition-all hover:shadow-md ${
          onClick ? "cursor-pointer hover:border-purple-300" : ""
        }`}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={
          onClick
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick();
                }
              }
            : undefined
        }
      >
        {/* Left: Image or Video Thumbnail */}
        <div className="w-16 h-16 sm:w-18 sm:h-18 flex-shrink-0">
          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden relative">
            {isVideo ? (
              <>
                {/* Video Thumbnail */}
                <video
                  src={imageSrc}
                  className="w-full h-full object-cover"
                  preload="metadata"
                  muted
                  playsInline
                >
                  Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="w-8 h-8 bg-purple-600/90 rounded-full flex items-center justify-center shadow-lg">
                    <svg
                      className="w-5 h-5 text-white ml-0.5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Panorama Image Thumbnail */}
                <img
                  src={imageSrc}
                  alt={`${category} issue: ${title}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<div class="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center text-gray-600 font-medium text-sm">${category.charAt(0)}</div>`;
                    }
                  }}
                />
                <div 
                  className="absolute top-1 right-1 bg-purple-600 text-white px-1.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent parent onClick
                    setIsPanoramaModalOpen(true);
                  }}
                >
                  360°
                </div>
              </>
            )}
          </div>
        </div>

        {/* Middle: Content */}
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="text-sm font-medium text-gray-900 truncate leading-tight">
            {title}
          </h3>
          {/* Description with time since submission */}
          <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-snug">
            {description ? description.substring(0, 80) + (description.length > 80 ? '...' : '') : 'No description'} <span className="text-gray-500">report submitted {report && time ? getDaysAgo(time) : 'recently'}</span>
          </p>
          {/* Date, time, and location */}
          <p className="text-xs text-gray-500 mt-1 leading-tight">
            {report && time ? formatDetailedDate(time) : ''} {report ? `at ${getLocationString(report)}` : ''}
          </p>
        </div>

        {/* Right: Status */}
        <div className="flex flex-col items-end space-y-1 flex-shrink-0">
          <div
            className={`w-3 h-3 sm:w-4 sm:h-4 mr-3 rounded-full ${statusConfig.bgColor} ${
              status === "pending" ? "border-2 border-gray-400 bg-transparent" : ""
            }`}
          ></div>
          <span className="text-xs text-right text-gray-600 font-medium leading-tight max-w-16 sm:max-w-20">
            {statusConfig.text}
          </span>
        </div>
      </div>

      {/* Panorama Modal (only for images) */}
      {isPanoramaModalOpen && (
        <PanoramaModal
          imageUrl={imageSrc}
          onClose={() => setIsPanoramaModalOpen(false)}
        />
      )}
    </>
  );
}