'use client';

import React from 'react';

const ReportHistory = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <h3 style={{ marginTop: 0 }} className="text-slate-700"> Report History</h3>
        <p style={{ color: '#666', marginBottom: 0 }}>No history available for this report yet.</p>
      </div>
    );
  }

  const getActionBadgeColor = (action) => {
    switch (action) {
      case 'created':
        return '#4CAF50'; // Green
      case 'verified':
      case 'approved':
        return '#2196F3'; // Blue
      case 'rejected':
        return '#f44336'; // Red
      case 'pending':
        return '#ff9800'; // Orange
      case 'transferred':
      case 'forwarded':
        return '#9C27B0'; // Purple
      default:
        return '#757575'; // Gray
    }
  };

  const getActionLabel = (action) => {
    const labels = {
      created: ' Created',
      verified: 'Verified',
      approved: 'Approved',
      rejected: 'Rejected',
      pending: 'Pending',
      transferred: 'Transferred',
      forwarded: 'Forwarded',
    };
    return labels[action] || action;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
      <h3 style={{ marginTop: 0, marginBottom: '20px' }} className='text-slate-800 font-bold'>Report History & Audit Trail</h3>
      
      <div style={{ position: 'relative', paddingLeft: '40px' }}>
        {history.map((entry, index) => (
          <div
            key={index}
            style={{
              marginBottom: '20px',
              paddingBottom: '20px',
              borderBottom: index < history.length - 1 ? '1px solid #ddd' : 'none',
              position: 'relative',
            }}
          >
            {/* Timeline dot */}
            <div
              style={{
                position: 'absolute',
                left: '-40px',
                top: '0px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: getActionBadgeColor(entry.action),
                border: '3px solid white',
                boxShadow: '0 0 0 2px #ddd',
              }}
            />

            {/* Timeline line */}
            {index < history.length - 1 && (
              <div
                style={{
                  position: 'absolute',
                  left: '-30px',
                  top: '20px',
                  width: '2px',
                  height: 'calc(100% + 20px)',
                  backgroundColor: '#ddd',
                }}
              />
            )}

            {/* Action Badge */}
            <div
              style={{
                display: 'inline-block',
                backgroundColor: getActionBadgeColor(entry.action),
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold',
                marginBottom: '8px',
              }}
            >
              {getActionLabel(entry.action)}
            </div>

            {/* Actor Information */}
            <div style={{ marginTop: '8px' }}>
              <p style={{ margin: '4px 0', fontSize: '14px', color: '#333' }}>
                <strong>By:</strong> {entry.actorName || 'Unknown'} 
                <span style={{ color: '#666', fontSize: '12px', marginLeft: '8px' }}>
                  ({entry.actorRole || 'unknown'})
                </span>
              </p>
              
              <p style={{ margin: '4px 0', fontSize: '13px', color: '#666' }}>
                <strong>When:</strong> {formatDate(entry.timestamp)}
              </p>

              {entry.notes && (
                <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#555', fontStyle: 'italic' }}>
                  <strong>Details:</strong> {entry.notes}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportHistory;
