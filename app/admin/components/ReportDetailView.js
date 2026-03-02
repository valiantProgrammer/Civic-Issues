'use client'

import { useState, useEffect } from 'react'
import React from 'react'
import toast from 'react-hot-toast'
import PanoramicViewer from '@/app/user/components/components/PanoramicViewer'
import { motion, AnimatePresence } from 'framer-motion'

const rejectButtonStyles = `
  .reject-btn {
    background-color: white;
    border: 2px solid #b91c1c;
    color: #dc2626;
    position: relative;
    overflow: hidden;
    font-weight: 600;
    z-index: 1;
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
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
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

const SparklesIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>);

const ReportDetailView = ({ report, onClose, userRole = 'admin', onApprove, onReject, onSend }) => {
  const [similarReports, setSimilarReports] = useState({ areaCount: 0, categoryCount: 0, totalSimilar: 0 })
  const [loading, setLoading] = useState(true)
  const [fullscreenImage, setFullscreenImage] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showSendModal, setShowSendModal] = useState(false)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [showRejectionModal, setShowRejectionModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [isSuggestingReason, setIsSuggestingReason] = useState(false)
  const [suggestedReason, setSuggestedReason] = useState('')
  const [forwardType, setForwardType] = useState('municipality')
  const [forwardData, setForwardData] = useState({
    targetMunicipality: '',
    targetWard: '',
    targetAuthority: '',
    reason: ''
  })
  const contentRef = React.useRef(null)

  const MUNICIPALITIES = [
    { name: 'City North', wards: ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4'] },
    { name: 'City South', wards: ['Ward 5', 'Ward 6', 'Ward 7'] },
    { name: 'City East', wards: ['Ward 8', 'Ward 9'] },
    { name: 'City West', wards: ['Ward 10', 'Ward 11', 'Ward 12'] }
  ]

  const HIGHER_AUTHORITIES = [
    'State Urban Development Department',
    'National Highway Authority of India (NHAI)',
    'Public Works Department (PWD)',
    'State Environmental Protection Agency',
    'Chief Minister\'s Office',
  ]

  const handleSendToMunicipality = (e) => {
    e.preventDefault()
    if (!forwardData.reason) {
      toast.error('Please provide a reason for forwarding')
      return
    }
    if (forwardType === 'municipality' && !forwardData.targetMunicipality) {
      toast.error('Please select a target municipality')
      return
    }
    if (forwardType === 'authority' && !forwardData.targetAuthority) {
      toast.error('Please select a target authority')
      return
    }
    
    if (onSend) {
      const details = forwardType === 'municipality' 
        ? { type: 'municipality', municipality: forwardData.targetMunicipality, ward: forwardData.targetWard, reason: forwardData.reason }
        : { type: 'authority', authority: forwardData.targetAuthority, reason: forwardData.reason }
      onSend(details)
    }
    setShowSendModal(false)
    setForwardType('municipality')
    setForwardData({ targetMunicipality: '', targetWard: '', targetAuthority: '', reason: '' })
    toast.success('Report forwarded successfully')
  }

  const handleConfirmApproval = () => {
    if (onApprove) {
      onApprove()
    }
    setShowApprovalModal(false)
    toast.success('Report approved successfully')
  }

  const handleConfirmRejection = () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }
    if (onReject) {
      onReject(rejectionReason)
    }
    setShowRejectionModal(false)
    setRejectionReason('')
    setSuggestedReason('')
    toast.success('Report rejected successfully')
  }

  const handleSuggestReason = async () => {
    setIsSuggestingReason(true)
    try {
      const response = await fetch('/api/admin-reports/suggest-rejection-reason', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: report.Description })
      })
      if (response.ok) {
        const data = await response.json()
        setSuggestedReason(data.suggestedReason || 'Unable to generate suggestion')
        setRejectionReason(data.suggestedReason || '')
      } else {
        toast.error('Failed to generate suggestion')
      }
    } catch (error) {
      toast.error('Error suggesting reason')
      console.error(error)
    } finally {
      setIsSuggestingReason(false)
    }
  }

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

  const handleScroll = (e) => {
    setIsScrolled(e.target.scrollTop > 0)
  }

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
    <>
      <style>{rejectButtonStyles}</style>
      <div className="bg-white shadow-lg border border-gray-200 w-full rounded-3xl flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className={`sticky top-0 bg-gradient-to-r from-orange-500 to-orange-400 text-white p-6 flex justify-between items-center transition-all ${!isScrolled ? 'rounded-t-3xl' : ''}`}>
          <div>
            <h2 className="text-2xl font-bold">Report Details</h2>
            <p className="text-purple-100 text-sm mt-1">ID: {report._id}</p>
          </div>
          <button
            onClick={onClose}
            className="bg-white font-black bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div 
          className="p-6 space-y-6 overflow-y-auto flex-1"
          ref={contentRef}
          onScroll={handleScroll}
        >
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
        <div className={`bg-gray-50 border-t border-gray-200 p-6 flex justify-end gap-3 transition-all ${!isScrolled ? 'rounded-b-3xl' : ''}`}>
          {/* Admin Role - Pending Reports */}
          {userRole === 'admin' && report.status === 'pending' && (
            <>
              <button
                onClick={() => setShowRejectionModal(true)}
                className="reject-btn px-6 py-2 rounded-lg font-medium"
              >
                Reject
              </button>
              <button
                onClick={() => setShowApprovalModal(true)}
                className="px-6 py-2 bg-green-600 hover:bg-green-900 text-white rounded-lg font-medium transition-colors"
              >
                Approve
              </button>
            </>
          )}

          {/* Admin Role - Rejected Reports */}
          {userRole === 'admin' && report.status === 'rejected' && (
            <button
              onClick={() => onReject && onReject(null)}
              className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors"
            >
              Make Pending
            </button>
          )}

          {/* Administration Role */}
          {userRole === 'administration' && (
            <>
              <button
                onClick={() => setShowSendModal(true)}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                Send to Municipality
              </button>
              <button
                onClick={() => setShowRejectionModal(true)}
                className="reject-btn px-6 py-2 rounded-lg font-medium"
              >
                Reject
              </button>
              <button
                onClick={() => setShowApprovalModal(true)}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
              >
                Approve
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Forward Form Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowSendModal(false); }}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Forward Report</h3>
            <div className="flex border-b border-gray-200 mb-4">
              <button
                onClick={() => setForwardType('municipality')}
                className={`px-4 py-2 text-sm font-medium ${forwardType === 'municipality' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                To Municipality
              </button>
              <button
                onClick={() => setForwardType('authority')}
                className={`px-4 py-2 text-sm font-medium ${forwardType === 'authority' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                To Higher Authority
              </button>
            </div>

            <form onSubmit={handleSendToMunicipality} className="space-y-4">
              {forwardType === 'municipality' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Municipality</label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
                      value={forwardData.targetMunicipality}
                      onChange={(e) => setForwardData({ ...forwardData, targetMunicipality: e.target.value, targetWard: '' })}
                      required={forwardType === 'municipality'}
                    >
                      <option value="" disabled>Select...</option>
                      {MUNICIPALITIES.map((m) => (<option key={m.name} value={m.name}>{m.name}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Ward</label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
                      value={forwardData.targetWard}
                      onChange={(e) => setForwardData({ ...forwardData, targetWard: e.target.value })}
                      disabled={!forwardData.targetMunicipality}
                      required={forwardType === 'municipality'}
                    >
                      <option value="" disabled>Select...</option>
                      {MUNICIPALITIES.find(m => m.name === forwardData.targetMunicipality)?.wards.map((w) => (<option key={w} value={w}>{w}</option>))}
                    </select>
                  </div>
                </div>
              )}

              {forwardType === 'authority' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Authority</label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
                    value={forwardData.targetAuthority}
                    onChange={(e) => setForwardData({ ...forwardData, targetAuthority: e.target.value })}
                    required={forwardType === 'authority'}
                  >
                    <option value="" disabled>Select...</option>
                    {HIGHER_AUTHORITIES.map((auth) => (<option key={auth} value={auth}>{auth}</option>))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Forwarding</label>
                <textarea
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  rows="3"
                  placeholder="Provide a reason..."
                  value={forwardData.reason}
                  onChange={(e) => setForwardData({ ...forwardData, reason: e.target.value })}
                  required
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={() => setShowSendModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      <AnimatePresence>
        {showApprovalModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowApprovalModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto p-6">
              <h3 className="text-xl font-bold mb-4 text-slate-900">Confirm Approval</h3>
              <p className="text-sm text-slate-600 mb-3">Are you sure you want to approve this report?</p>
              <div className="bg-slate-100 p-4 rounded-lg mb-4">
                <p className="font-medium text-slate-800">{report.Description}</p>
                <p className="text-sm text-slate-600 mt-1">Reported by: {report.ReporterName || 'Anonymous'}</p>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button onClick={() => setShowApprovalModal(false)} className="px-5 py-2.5 rounded-lg bg-slate-200 text-slate-800 hover:bg-slate-300 font-semibold">Cancel</button>
                <button onClick={handleConfirmApproval} className="px-5 py-2.5 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600">Confirm Approval</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rejection Modal */}
      <AnimatePresence>
        {showRejectionModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowRejectionModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-900">Reason for Rejection</h3>
                <button onClick={handleSuggestReason} disabled={isSuggestingReason} className="flex items-center text-sm font-semibold text-orange-600 hover:text-orange-800 disabled:text-slate-400">
                  <SparklesIcon className={`mr-2 h-5 w-5 ${isSuggestingReason ? 'animate-spin' : ''}`} />
                  {isSuggestingReason ? 'Thinking...' : 'Suggest Reason'}
                </button>
              </div>
              <p className="text-sm text-slate-600 mb-3">Rejecting report: <span className="font-medium">"{report.Description}"</span></p>
              <textarea 
                value={rejectionReason} 
                onChange={(e) => setRejectionReason(e.target.value)} 
                placeholder="e.g., Duplicate report, insufficient information..." 
                className="w-full text-black h-28 p-3 rounded-lg bg-slate-100 border border-slate-300"
              />
              <div className="mt-6 flex justify-end space-x-3">
                <button onClick={() => { setShowRejectionModal(false); setRejectionReason(''); setSuggestedReason(''); }} className="px-5 py-2.5 rounded-lg bg-slate-200 text-slate-800 hover:bg-slate-300 font-semibold">Cancel</button>
                <button onClick={handleConfirmRejection} disabled={!rejectionReason.trim()} className="px-5 py-2.5 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 disabled:bg-red-300">Confirm Rejection</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
    </>
  )
}

export default ReportDetailView
