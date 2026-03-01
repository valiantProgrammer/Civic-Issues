'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import PanoramicViewer from '@/app/user/components/components/PanoramicViewer'

const ReportDetailView = ({ report, onClose, userRole = 'admin' }) => {
  const [similarReports, setSimilarReports] = useState({ areaCount: 0, categoryCount: 0, totalSimilar: 0 })
  const [loading, setLoading] = useState(true)
  const [fullscreenImage, setFullscreenImage] = useState(null)

  useEffect(() => {
    const fetchSimilarReports = async () => {
      try {
        if (!report._id || !report.ward || !report.category) {
          setLoading(false)
          return
        }

        const response = await fetch(`/api/reports/similar?reportId=${report._id}&ward=${report.ward}&category=${report.category}`)
        if (response.ok) {
          const data = await response.json()
          setSimilarReports(data)
        }
      } catch (error) {
        console.error('Error fetching similar reports:', error)
        toast.error('Failed to fetch similar reports count')
      } finally {
        setLoading(false)
      }
    }

    fetchSimilarReports()
  }, [report._id, report.ward, report.category])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-50 border-yellow-200',
      solved: 'bg-green-50 border-green-200',
      rejected: 'bg-red-50 border-red-200',
      forwarded: 'bg-blue-50 border-blue-200'
    }
    return colors[status] || 'bg-gray-50 border-gray-200'
  }

  const getStatusBadgeColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      solved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      forwarded: 'bg-blue-100 text-blue-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Report Details</h2>
            <p className="text-purple-100 text-sm mt-1">ID: {report._id}</p>
          </div>
          <button
            onClick={onClose}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Media - NOW ON TOP - Shows image and opens pano viewer on click */}
          {report.image && (
            <div 
              className="w-full rounded-lg overflow-hidden bg-gray-900 h-80 shadow-md border-2 border-gray-400 cursor-pointer hover:shadow-lg transition-all"
              onClick={() => setFullscreenImage(report.image)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && setFullscreenImage(report.image)}
            >
              <img 
                src={report.image} 
                alt="Report Issue" 
                className="w-full h-full object-cover hover:brightness-110 transition-all"
                loading="lazy"
              />
            </div>
          )}

          {/* Status Badge */}
          <div className="flex justify-between items-start">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadgeColor(report.status)}`}>
              {report.status?.charAt(0).toUpperCase() + report.status?.slice(1)}
            </span>
            {report.verified && (
              <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                ✓ AI Verified
              </span>
            )}
          </div>

          {/* Issue Details Grid */}
          <div className={`border rounded-lg p-6 ${getStatusColor(report.status)}`}>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Issue Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Title</p>
                <p className="text-gray-900 font-medium">{report.Title}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Category</p>
                <p className="text-gray-900 font-medium">{report.category || report.Title}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-semibold text-gray-600 mb-1">Description</p>
                <p className="text-gray-900 whitespace-pre-wrap">{report.Description}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Severity</p>
                <p className="text-gray-900 font-medium">{report.severity}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Reported Date</p>
                <p className="text-gray-900">{formatDate(report.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Reporter Details */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Reporter Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Name</p>
                <p className="text-gray-900 font-medium">{report.ReporterName || 'Anonymous'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Reporter ID</p>
                <p className="text-gray-900 font-medium text-sm">{report.reporterId || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Location Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Ward Number</p>
                <p className="text-gray-900 font-medium">{report.ward || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Municipality</p>
                <p className="text-gray-900 font-medium">{report.municipalityName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Building</p>
                <p className="text-gray-900 font-medium">{report.building || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Street</p>
                <p className="text-gray-900 font-medium">{report.street || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Locality</p>
                <p className="text-gray-900 font-medium">{report.locality || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Property Type</p>
                <p className="text-gray-900 font-medium">{report.propertyType || 'N/A'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-semibold text-gray-600 mb-1">Coordinates</p>
                <p className="text-gray-900 font-medium">
                  {report.locationCoordinates?.coordinates 
                    ? `${report.locationCoordinates.coordinates[1]}, ${report.locationCoordinates.coordinates[0]}`
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Similar Reports Statistics */}
          <div className="border border-blue-200 bg-blue-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Similar Reports in Area</h3>
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-600 mb-1">Same Area (Ward)</p>
                  <p className="text-3xl font-bold text-blue-600">{similarReports.areaCount}</p>
                  <p className="text-xs text-gray-600 mt-1">Reports in Ward {report.ward}</p>
                </div>
                <div className="bg-white border border-purple-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-600 mb-1">Same Category</p>
                  <p className="text-3xl font-bold text-purple-600">{similarReports.categoryCount}</p>
                  <p className="text-xs text-gray-600 mt-1">{report.category || report.Title}</p>
                </div>
                <div className="bg-white border border-orange-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-600 mb-1">Total Similar</p>
                  <p className="text-3xl font-bold text-orange-600">{similarReports.totalSimilar}</p>
                  <p className="text-xs text-gray-600 mt-1">Area + Category overlap</p>
                </div>
              </div>
            )}
          </div>

          {/* Rejection Reason (if applicable) */}
          {report.rejectionReason && (
            <div className="border border-red-200 bg-red-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-red-900 mb-2">Rejection Reason</h3>
              <p className="text-red-800">{report.rejectionReason}</p>
            </div>
          )}

          {/* History/Timeline */}
          {report.history && report.history.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Action History</h3>
              <div className="space-y-4">
                {report.history.map((entry, idx) => (
                  <div key={idx} className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0">
                    <div className="min-w-12">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-purple-600 font-bold">{idx + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 capitalize">{entry.action}</p>
                      <p className="text-sm text-gray-600">{entry.actorName || 'System'} • {entry.actorRole}</p>
                      {entry.notes && <p className="text-sm text-gray-700 mt-1">{entry.notes}</p>}
                      <p className="text-xs text-gray-500 mt-1">{formatDate(entry.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 p-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Fullscreen Panoramic Viewer */}
      {fullscreenImage && (
        <div 
          className="fixed inset-0 bg-black z-[60]"
          onClick={() => setFullscreenImage(null)}
        >
          <div className="w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-full h-full">
              <PanoramicViewer imageSrc={fullscreenImage} hideInfoBox={true} />
            </div>
          </div>
          <button
            onClick={() => setFullscreenImage(null)}
            className="fixed top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all text-white z-20"
            aria-label="Close panoramic viewer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

export default ReportDetailView
