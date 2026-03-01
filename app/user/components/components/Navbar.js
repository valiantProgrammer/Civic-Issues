'use client'

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import authApi from '@/lib/api';
import { toast } from 'react-toastify';

// Icons
const HomeIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a2 2 0 002 2h10a2 2 0 002-2V10M9 20v-6a2 2 0 012-2h2a2 2 0 012 2v6" /></svg>;
const HelpIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9.247a1 1 0 011.414 0L12 11.586l2.358-2.359a1 1 0 111.414 1.414L13.414 13l2.358 2.359a1 1 0 01-1.414 1.414L12 14.414l-2.358 2.359a1 1 0 01-1.414-1.414L10.586 13l-2.358-2.359a1 1 0 010-1.414z" /></svg>;
const ContactIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const PendingReportsIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ApprovedReportsIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const RejectedReportsIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ProfileIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const LogoutIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;

const primaryLinks = [
  { href: '/', label: 'Home', icon: <HomeIcon /> },
];

export default function Navbar({ onReportFilterChange, onProfileClick, onContactClick, onReportsClick, onHelpClick}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedReportFilter, setSelectedReportFilter] = useState('pending');
  const [activeSection, setActiveSection] = useState(null); // 'help', 'contact', 'profile', or null
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchReportCounts = async () => {
      try {
        const response = await authApi.getUserReports();
        if (response.reports && Array.isArray(response.reports)) {
          const pending = response.reports.filter(report => report.status === 'pending').length;
          const approved = response.reports.filter(report => report.status === 'approved').length;
          const rejected = response.reports.filter(report => report.status === 'rejected').length;

          setPendingCount(pending);
          setApprovedCount(approved);
          setRejectedCount(rejected);
        }
      } catch (error) {
        console.error('Failed to fetch report counts:', error);
      }
    };

    fetchReportCounts();
  }, []);

  const handleLogout = useCallback(async () => {
    await authApi.logout();
    toast.success('You have been logged out.');
    router.push('/');
  }, [router]);

  const handleReportFilterClick = (filterType) => {
    setSelectedReportFilter(filterType);
    setActiveSection(null); // Clear section selection when viewing reports
    onReportFilterChange(filterType);
    setIsMenuOpen(false);
  };

  const NavLink = ({ href, label, icon }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
          isActive
            ? ' text-purple-700 font-semibold border-2 border-yellow-900 bg-gradient-to-r from-yellow-200 to-blue-200'
            : 'text-gray-700 hover:bg-gray-100 hover:text-purple-600'
        }`}
        onClick={() => {
          setActiveSection(null);
          setIsMenuOpen(false);
        }}
      >
        {icon}
        <span>{label}</span>
      </Link>
    );
  };

  const reportLinks = [
    { type: 'pending', label: 'Pending Reports', icon: <PendingReportsIcon /> },
    { type: 'approved', label: 'Approved Reports', icon: <ApprovedReportsIcon /> },
    { type: 'rejected', label: 'Rejected Reports', icon: <RejectedReportsIcon /> },
  ];

  const NavContent = () => (
    <div className="flex flex-col justify-between h-full p-4">
      <div>
        <div className="mb-6">
          <h3 className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            General
          </h3>
          <div className="space-y-1">
            {primaryLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
            <button
              onClick={() => {
                setActiveSection('help');
                onHelpClick();
                setIsMenuOpen(false);
              }}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg w-full text-left transition-colors ${
                activeSection === 'help'
                  ? 'text-purple-700 font-semibold border-2 border-yellow-900 bg-gradient-to-r from-yellow-200 to-blue-200'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-purple-600'
              }`}
            >
              <HelpIcon />
              <span>Need Help</span>
            </button>
            <button
              onClick={() => {
                setActiveSection('contact');
                onContactClick();
                setIsMenuOpen(false);
              }}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg w-full text-left transition-colors ${
                activeSection === 'contact'
                  ? 'text-purple-700 font-semibold border-2 border-yellow-900 bg-gradient-to-r from-yellow-200 to-blue-200'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-purple-600'
              }`}
            >
              <ContactIcon />
              <span>Contact Manager</span>
            </button>
          </div>
        </div>

        <div>
          <h3 className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Reports
          </h3>
          <div className="space-y-1">
            {reportLinks.map((link) => (
              <button
                key={link.type}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg w-full text-left transition-colors ${
                  selectedReportFilter === link.type && activeSection === null
                    ? ' text-purple-700 font-semibold border-1 border-yellow-900 bg-gradient-to-r from-yellow-200 to-blue-200'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-purple-600'
                }`}
                onClick={() => {
                  handleReportFilterClick(link.type);
                  onReportsClick();
                }}
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Profile History
          </h3>
          <div className="space-y-1">
            <button
              onClick={() => {
                setActiveSection('profile');
                onProfileClick();
                setIsMenuOpen(false);
              }}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg w-full text-left transition-colors ${
                activeSection === 'profile'
                  ? 'text-purple-700 font-semibold border-2 border-yellow-900 bg-gradient-to-r from-yellow-200 to-blue-200'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-purple-600'
              }`}
            >
              <ProfileIcon />
              <span>Profile</span>
            </button>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Statistics
          </h3>
          <div className="grid grid-cols-3 gap-2 px-2">
            <div className="text-center bg-blue-100 p-2 rounded-lg">
              <p className="font-bold text-blue-800 text-xl">{pendingCount}</p>
              <p className="text-xs text-blue-700">Pending</p>
            </div>
            <div className="text-center bg-green-100 p-2 rounded-lg">
              <p className="font-bold text-green-800 text-xl">{approvedCount}</p>
              <p className="text-xs text-green-700">Approved</p>
            </div>
            <div className="text-center bg-red-100 p-2 rounded-lg">
              <p className="font-bold text-red-800 text-xl">{rejectedCount}</p>
              <p className="text-xs text-red-700">Rejected</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 mt-6">
        <button
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-purple-600 transition-colors"
          onClick={handleLogout}
        >
          <LogoutIcon />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <nav className="lg:hidden fixed top-0 left-0 w-full bg-white shadow-md z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">CI</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Civic साथी</h1>
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-900 hover:text-purple-600 focus:outline-none p-2"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`lg:hidden fixed inset-0 z-50 transform transition-transform ease-in-out duration-300 ${
          isMenuOpen ? 'translate-x-0 delay-0' : '-translate-x-full delay-300'
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity ease-in-out duration-300 ${
            isMenuOpen ? 'opacity-100 delay-300' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMenuOpen(false)}
        ></div>
        <div className="absolute top-0 left-0 h-full w-64 bg-white shadow-xl flex flex-col">
          <div className="p-4 border-b flex items-center justify-between h-16">
            <h2 className="font-bold text-xl text-gray-900">Menu</h2>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-900 hover:text-purple-600 focus:outline-none p-2"
              aria-label="Close menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <NavContent />
          </div>
        </div>
      </div>

      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:h-screen lg:fixed lg:bg-white lg:border-r">
        <div className="h-16 flex items-center px-4 border-b">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">CI</span>
          </div>
          <h1 className="ml-2 text-xl font-bold text-gray-900">Civic साथी</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          <NavContent />
        </div>
      </aside>
    </>
  );
}