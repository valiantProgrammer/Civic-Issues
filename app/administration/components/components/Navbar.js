import { useState } from 'react';
import Link from 'next/link';

const Navbar = ({ stats = { pending: 0, approved: 0, rejected: 0, forwarded: 0 } }) => {
  const [open, setOpen] = useState(false);

  const pageLinks = {
    Pending: '/',
    Approved: '/approved',
    Rejected: '/rejected',
    Forwarded: '/forwarded'
  };

  return (
    <>
      {/* Mobile/Tablet Header - LG screens won't show this */}
      <nav className="lg:hidden w-full bg-white shadow-sm border-b border-gray-100 sticky top-0 z-30">
        <div className="px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Logo and Site Name */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-md flex-shrink-0"></div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Administration</h1>
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
                  <div className="rounded-md border border-purple-200 bg-purple-50 text-center py-3">
                    <div className="text-lg font-bold text-purple-700">{stats.forwarded || 0}</div>
                    <div className="text-xs text-purple-800">Forwarded</div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="space-y-2 mb-8">
                <h3 className="text-sm font-medium text-gray-700">Navigation</h3>
                {Object.entries(pageLinks).map(([section, href]) => (
                  <Link
                    key={section}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2 rounded-md hover:bg-gray-50 text-gray-800 text-sm font-medium transition-colors"
                  >
                    {section} Reports
                  </Link>
                ))}
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
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-md"></div>
            <div>
              <h2 className="font-bold text-gray-900">Administration</h2>
              <p className="text-xs text-gray-500">Dashboard</p>
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
            <div className="rounded-lg border border-purple-200 bg-purple-50 p-3 text-center">
              <div className="text-xl font-bold text-purple-700">{stats.forwarded || 0}</div>
              <div className="text-xs text-purple-800">Forwarded</div>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="p-4 space-y-2 flex-1">
          <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Reports</h3>
          {Object.entries(pageLinks).map(([section, href]) => (
            <Link
              key={section}
              href={href}
              className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-800 text-sm font-medium transition-colors border border-transparent hover:border-gray-200"
            >
              {section} Reports
            </Link>
          ))}
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