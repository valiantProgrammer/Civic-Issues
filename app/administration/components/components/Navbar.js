import { useState } from 'react';
import Image from 'next/image';

// Icons
const PendingIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ApprovedIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const RejectedIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const LogoutIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;

const Navbar = ({ stats = { pending: 0, approved: 0, rejected: 0 }, currentView = 'pending', setCurrentView = () => {} }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile/Tablet Header - LG screens won't show this */}
      <nav className="lg:hidden w-full bg-white shadow-sm border-b border-gray-100 sticky top-0 z-30">
        <div className="px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Logo and Site Name */}
            <div className="flex items-center space-x-3">
              <Image
                src="/images/logo.png"
                alt="Civic Saathi Logo"
                width={100}
                height={100}
                className="w-[12vw] h-[12vw] md:w-[3.5vw] md:h-[3.5vw]"
              />
              <div className="flex flex-col">
                <h1 className="text-sm font-bold text-slate-800 tracking-tight">Civic साथी</h1>
                <p className="text-xs text-gray-600">Administration</p>
              </div>
            </div>

            {/* Right side - Hamburger Menu */}
            <button
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="flex flex-col space-y-1 cursor-pointer p-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
            >
              <span className="w-6 h-0.5 bg-gray-700"></span>
              <span className="w-6 h-0.5 bg-gray-700"></span>
              <span className="w-6 h-0.5 bg-gray-700"></span>
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {open && (
          <div className="fixed inset-0 z-40">
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setOpen(false)}
            ></div>
            <aside className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl z-50 p-5 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                <button aria-label="Close menu" onClick={() => setOpen(false)} className="text-gray-600 hover:text-gray-800 text-2xl leading-none">✕</button>
              </div>
              
              {/* Statistics */}
              <div className="space-y-3 mb-6">
                <h3 className="text-sm font-medium text-gray-700">Statistics</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-md border border-blue-200 bg-blue-50 text-center py-3">
                    <div className="text-lg font-bold text-blue-700">{stats.pending || 0}</div>
                    <div className="text-xs text-blue-800">Pending</div>
                  </div>
                  <div className="rounded-md border border-green-200 bg-green-50 text-center py-3">
                    <div className="text-lg font-bold text-green-700">{stats.approved || 0}</div>
                    <div className="text-xs text-green-800">Approved</div>
                  </div>
                  <div className="rounded-md border border-red-200 bg-red-50 text-center py-3">
                    <div className="text-lg font-bold text-red-700">{stats.rejected || 0}</div>
                    <div className="text-xs text-red-800">Rejected</div>
                  </div>

                </div>
              </div>

              {/* Navigation */}
              <div className="space-y-2 mb-8">
                <h3 className="text-sm font-medium text-gray-700">Navigation</h3>
                <button
                  onClick={() => { setCurrentView('pending'); setOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left ${
                    currentView === 'pending'
                      ? 'text-purple-700 font-semibold bg-gradient-to-r from-yellow-200 to-blue-200 border-2 border-yellow-900'
                      : 'text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <PendingIcon /> Pending Reports
                </button>
                <button
                  onClick={() => { setCurrentView('approved'); setOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left ${
                    currentView === 'approved'
                      ? 'text-purple-700 font-semibold bg-gradient-to-r from-yellow-200 to-blue-200 border-2 border-yellow-900'
                      : 'text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <ApprovedIcon /> Approved Reports
                </button>
                <button
                  onClick={() => { setCurrentView('rejected'); setOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left ${
                    currentView === 'rejected'
                      ? 'text-purple-700 font-semibold bg-gradient-to-r from-yellow-200 to-blue-200 border-2 border-yellow-900'
                      : 'text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <RejectedIcon /> Rejected Reports
                </button>
              </div>

              {/* Logout */}
              <div className="p-3 border-t border-gray-200">
                <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-red-600 rounded-md hover:bg-red-50 font-semibold transition-colors text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </aside>
          </div>
        )}
      </nav>

      {/* Desktop Sidebar - Only shown on LG screens */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:h-screen lg:bg-white lg:shadow-lg lg:border-r lg:border-gray-200 lg:overflow-y-auto">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
              <Image
                            src="/images/logo.png"
                            alt="Civic Saathi Logo"
                            width={100}
                            height={100}
                            className="w-[12vw] h-[12vw] md:w-[3.5vw] md:h-[3.5vw]"
                        />
            <div>
              <h1 className="text-lg font-bold text-slate-800 tracking-tight">Civic साथी</h1>
              <p className="text-xs text-gray-600">Administration</p>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="p-4 space-y-3 border-b border-gray-200">
          <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Statistics</h3>
          <div className="space-y-2">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-center">
              <div className="text-xl font-bold text-blue-700">{stats.pending || 0}</div>
              <div className="text-xs text-blue-800">Pending</div>
            </div>
            <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-center">
              <div className="text-xl font-bold text-green-700">{stats.approved || 0}</div>
              <div className="text-xs text-green-800">Approved</div>
            </div>
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center">
              <div className="text-xl font-bold text-red-700">{stats.rejected || 0}</div>
              <div className="text-xs text-red-800">Rejected</div>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="p-4 space-y-2 flex-1">
          <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Reports</h3>
          <button
            onClick={() => setCurrentView('pending')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
              currentView === 'pending'
                ? 'text-purple-700 font-semibold bg-gradient-to-r from-yellow-200 to-blue-200 border-2 border-yellow-900'
                : 'text-gray-800 hover:bg-gray-100 border border-transparent hover:border-gray-200'
            }`}
          >
            <PendingIcon /> Pending Reports
          </button>
          <button
            onClick={() => setCurrentView('approved')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
              currentView === 'approved'
                ? 'text-purple-700 font-semibold bg-gradient-to-r from-yellow-200 to-blue-200 border-2 border-yellow-900'
                : 'text-gray-800 hover:bg-gray-100 border border-transparent hover:border-gray-200'
            }`}
          >
            <ApprovedIcon /> Approved Reports
          </button>
          <button
            onClick={() => setCurrentView('rejected')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
              currentView === 'rejected'
                ? 'text-purple-700 font-semibold bg-gradient-to-r from-yellow-200 to-blue-200 border-2 border-yellow-900'
                : 'text-gray-800 hover:bg-gray-100 border border-transparent hover:border-gray-200'
            }`}
          >
            <RejectedIcon /> Rejected Reports
          </button>
        </div>

        {/* Logout Section */}
        <div className="p-4 border-t border-gray-200">
          <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-red-600 rounded-lg hover:bg-red-50 font-semibold transition-colors text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Navbar;