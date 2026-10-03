'use client';

import React, { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function HelpCard({ onNavigateToReport, onNavigateToReports }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'General Inquiry',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Help topics matching the user reference screenshot
  const helpArticles = [
    {
      id: 'reporting-issue',
      title: 'Reporting an issue',
      summary: 'Learn how to submit civic problems with photos, GPS, and details.',
      steps: [
        'Click the "+ Report" or "Report Issue" button from your dashboard.',
        'Capture or upload a clear, well-lit photo of the civic issue (e.g., pothole, water leak, overflowing garbage, broken streetlight).',
        'Select the appropriate category (Water Works, Roads & Transport, Sanitation, Electrical, Drainage).',
        'Verify your location: our system automatically uses your device GPS or lets you select your Ward & locality.',
        'Add a concise description describing the safety hazard or urgency.',
        'Submit the report — your ticket will receive an immediate Ticket ID and AI preliminary verification.',
      ],
      tip: 'Clear photos with recognizable street landmarks help municipal crews locate and resolve hazards faster.',
      actionLabel: 'Report an Issue Now',
      actionType: 'report',
    },
    {
      id: 'tracking-report',
      title: 'Tracking a report',
      summary: 'Check the real-time progress, status milestones, and history of your reports.',
      steps: [
        'Navigate to "My Reports" from the left sidebar.',
        'Locate your issue using the search bar or filter by Status (Open, In Progress, Resolved).',
        'Click on any report card to open the complete details view.',
        'Review the "Activity History" vertical timeline to see who verified, forwarded, or assigned your case.',
        'Save your Ticket ID (e.g. CIVIC-20261002-A72Q) for reference when contacting authorities.',
      ],
      tip: 'You will also receive automatic notifications when your report changes status or is resolved by engineers.',
      actionLabel: 'View My Reports',
      actionType: 'reports',
    },
    {
      id: 'understanding-statuses',
      title: 'Understanding statuses',
      summary: 'Explanation of what each status badge means throughout the resolution lifecycle.',
      statuses: [
        {
          name: 'Pending',
          badge: 'bg-amber-50 text-amber-700 border-amber-200',
          desc: 'Your report has been submitted into the civic queue and is awaiting admin review and automated verification.',
        },
        {
          name: 'Verified',
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          desc: 'The report has been validated by municipal control officers as genuine and legitimate civic infrastructure work.',
        },
        {
          name: 'Forwarded',
          badge: 'bg-blue-50 text-blue-700 border-blue-200',
          desc: 'The report has been dispatched to the specific Ward Office or Municipal Corporation engineering division.',
        },
        {
          name: 'In Progress',
          badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          desc: 'Field engineers and maintenance repair teams have been mobilized and are working on site.',
        },
        {
          name: 'Resolved',
          badge: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          desc: 'The civic issue has been repaired or cleared. Photographic proof of resolution is attached.',
        },
        {
          name: 'Rejected',
          badge: 'bg-rose-50 text-rose-700 border-rose-200',
          desc: 'The report was flagged as duplicate, outside municipal jurisdiction, or having insufficient evidence.',
        },
      ],
      tip: 'If your report was rejected, you can review the reviewer justification and resubmit with updated photos.',
    },
    {
      id: 'location-problems',
      title: 'Location problems',
      summary: 'Troubleshooting GPS detection, map marker accuracy, and ward selection.',
      steps: [
        'Check your browser permissions: Ensure Location Services are set to "Allow" for civicSaathi.',
        'If outdoors, give your browser 3–5 seconds to acquire satellite precision.',
        'If the pin is slightly off, simply tap or drag the pin on OpenFreeMap to place it at the exact street corner.',
        'If GPS is unavailable, you can manually type your Ward number (e.g. Ward 7) and locality landmark.',
      ],
      tip: 'Accurate ward selection ensures your complaint routes directly to your local Ward Councillor and junior engineer.',
    },
    {
      id: 'account-otp',
      title: 'Account & OTP',
      summary: 'Guidance on logging in, passwordless OTP verification, and profile management.',
      steps: [
        'Civic Saathi supports secure email and mobile OTP authentication for easy citizen access.',
        'When requesting an OTP, allow up to 60 seconds for SMS or email delivery.',
        'Check your Email Spam/Junk folder if the verification code does not arrive in your inbox.',
        'Update your full name, phone number, and residential Ward in your "Profile" tab to personalize civic alerts.',
        'You can safely logout at any time using the Logout button at the bottom of the navigation sidebar.',
      ],
      tip: 'Never share your one-time password (OTP) with anyone. Municipal officers will never request your OTP.',
    },
  ];

  // Filter articles according to search query
  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return helpArticles;
    const q = searchQuery.toLowerCase().trim();
    return helpArticles.filter(
      (art) =>
        art.title.toLowerCase().includes(q) ||
        art.summary.toLowerCase().includes(q) ||
        art.steps?.some((s) => s.toLowerCase().includes(q))
    );
  }, [searchQuery, helpArticles]);

  const toggleArticle = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.subject.trim() || !contactForm.message.trim()) {
      toast.error('Please provide a subject and message');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowContactModal(false);
      setContactForm({
        name: '',
        email: '',
        phone: '',
        category: 'General Inquiry',
        subject: '',
        message: '',
      });
      toast.success('Your message has been sent! Our support team will reach out shortly.');
    }, 800);
  };

  return (
    <div className="w-full font-sans antialiased">
      {/* Main Card matching the screenshot */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
        
        {/* 1. Header Title */}
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            How Can We Help?
          </h1>
        </div>

        {/* 2. Search Input matching screenshot */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search help articles..."
            className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* 3. List of Help Articles matching screenshot */}
        <div className="space-y-2.5">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs sm:text-sm">
              <p>No articles found matching &quot;{searchQuery}&quot;</p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-2 text-blue-600 font-semibold hover:underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            filteredArticles.map((article) => {
              const isExpanded = expandedId === article.id;

              return (
                <div
                  key={article.id}
                  className={`rounded-xl border transition-all ${
                    isExpanded
                      ? 'border-blue-300 bg-blue-50/20 ring-2 ring-blue-500/10'
                      : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  {/* Clickable Header Row matching screenshot */}
                  <button
                    type="button"
                    onClick={() => toggleArticle(article.id)}
                    className="w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Left circular icon matching screenshot */}
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center shrink-0 group-hover:border-blue-500 transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 group-hover:bg-blue-600 transition-colors" />
                      </div>

                      {/* Title */}
                      <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                        {article.title}
                      </span>
                    </div>

                    {/* Right Chevron > matching screenshot */}
                    <div className="text-slate-400 group-hover:text-blue-600 shrink-0 transition-transform duration-200">
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isExpanded ? 'rotate-90 text-blue-600' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>

                  {/* Expandable Article Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 space-y-3.5 border-t border-slate-100">
                          <p className="text-slate-500 leading-relaxed font-medium">
                            {article.summary}
                          </p>

                          {/* Steps if present */}
                          {article.steps && (
                            <ol className="list-decimal list-inside space-y-1.5 text-slate-700 bg-white p-3.5 rounded-xl border border-slate-100 shadow-2xs">
                              {article.steps.map((st, idx) => (
                                <li key={idx} className="leading-relaxed pl-1">
                                  {st}
                                </li>
                              ))}
                            </ol>
                          )}

                          {/* Statuses table if present */}
                          {article.statuses && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {article.statuses.map((st, idx) => (
                                <div
                                  key={idx}
                                  className="p-3 bg-white rounded-xl border border-slate-100 shadow-2xs space-y-1"
                                >
                                  <span
                                    className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${st.badge}`}
                                  >
                                    {st.name}
                                  </span>
                                  <p className="text-[11px] text-slate-600 leading-relaxed">
                                    {st.desc}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Pro Tip */}
                          {article.tip && (
                            <div className="flex items-start gap-2 bg-blue-50/80 p-3 rounded-xl border border-blue-100 text-blue-900 text-xs">
                              <span className="font-bold text-blue-600 shrink-0">💡 Tip:</span>
                              <p className="leading-relaxed">{article.tip}</p>
                            </div>
                          )}

                          {/* Quick action button */}
                          {article.actionLabel && (
                            <div className="pt-1">
                              <button
                                type="button"
                                onClick={() => {
                                  if (article.actionType === 'report' && onNavigateToReport) {
                                    onNavigateToReport();
                                  } else if (
                                    article.actionType === 'reports' &&
                                    onNavigateToReports
                                  ) {
                                    onNavigateToReports();
                                  }
                                }}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-2xs"
                              >
                                <span>{article.actionLabel}</span>
                                <span>→</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        {/* 4. Bottom Section matching screenshot: Info box + "Contact Support" button */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4 flex-wrap">
          {/* Left: Info icon + Need more help text */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200/70 text-slate-600 flex items-center justify-center shrink-0">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 leading-none">
                Need more help?
              </p>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
                Contact our support team.
              </p>
            </div>
          </div>

          {/* Right: Vibrant blue Contact Support button matching screenshot */}
          <button
            type="button"
            onClick={() => setShowContactModal(true)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer"
          >
            Contact Support
          </button>
        </div>
      </div>

      {/* 5. Contact Support Modal */}
      <AnimatePresence>
        {showContactModal && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
            onClick={() => setShowContactModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto p-6 border border-slate-100 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Contact Civic Support</h3>
                  <p className="text-xs text-slate-500">
                    Reach our 24/7 Citizen Redressal & Support Team
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded-lg text-lg"
                >
                  ✕
                </button>
              </div>

              {/* Quick Emergency Helplines Notice */}
              <div className="mb-4 p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs space-y-1">
                <p className="font-bold text-blue-900">Emergency & Direct Helplines:</p>
                <div className="flex items-center gap-4 text-blue-800 flex-wrap">
                  <span>
                    📞 Civic Helpline: <strong>1916</strong>
                  </span>
                  <span>
                    🚨 Police / Fire / Medical: <strong>112</strong>
                  </span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleContactSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rupayan"
                      value={contactForm.name}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, name: e.target.value })
                      }
                      className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email or Mobile
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. citizen@gmail.com"
                      value={contactForm.email}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, email: e.target.value })
                      }
                      className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Inquiry Category
                  </label>
                  <select
                    value={contactForm.category}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, category: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Report Status Escalation">Report Status Escalation</option>
                    <option value="Technical or App Issue">Technical or App Issue</option>
                    <option value="Location / Ward Discrepancy">
                      Location / Ward Discrepancy
                    </option>
                    <option value="Grievance / Feedback">Grievance / Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subject or Ticket ID
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Question regarding CIVIC-20261002-A72Q"
                    value={contactForm.subject}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, subject: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    How can we assist you?
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your issue or query in detail..."
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, message: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowContactModal(false)}
                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2.5 rounded-xl text-white text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-xs"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
