import { useState } from 'react';
import Link from 'next/link';

const Navbar = ({ stats = { pending: 0, approved: 0, rejected: 0, forwarded: 0 } }) => {
  const [open, setOpen] = useState(false);

  // --- FIX: Created a mapping for the new page links ---
  const pageLinks = {
    Pending: '/',
    Approved: '/approved',
    Rejected: '/rejected',
    Forwarded: '/forwarded'
  };

  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Site Name */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded-md flex-shrink-0"></div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">MySite Administration</h1>
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

      {/* Drawer overlay */}
      {open && (
        <div className="fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          ></div>
          {/* Drawer */}
          <aside className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl z-50 p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button aria-label="Close menu" onClick={() => setOpen(false)} className="text-gray-600 hover:text-gray-800">✕</button>
            </div>
            
            {/* Profile Section */}
            <div className="mb-6">
              <Link href="/profile" className="flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-gray-100">
                <img src="https://i.pravatar.cc/40" alt="User Profile" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-gray-800">John Doe</p>
                  <p className="text-xs text-gray-500">View Profile</p>
                </div>
              </Link>
            </div>
            {/* Statistics */}
            <div className="space-y-3 mb-6">
              <h3 className="text-sm font-medium text-gray-700">Statistics</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-md border border-gray-100 bg-blue-50 text-center py-3">
                  <div className="text-xl font-bold text-blue-700">{stats.pending || 0}</div>
                  <div className="text-xs text-blue-800">Pending</div>
                </div>
                <div className="rounded-md border border-gray-100 bg-green-50 text-center py-3">
                  <div className="text-xl font-bold text-green-700">{stats.approved || 0}</div>
                  <div className="text-xs text-green-800">Approved</div>
                </div>
                <div className="rounded-md border border-gray-100 bg-rose-50 text-center py-3">
                  <div className="text-xl font-bold text-rose-700">{stats.rejected || 0}</div>
                  <div className="text-xs text-rose-800">Rejected</div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 mt-3">
                <div className="rounded-md border border-gray-100 bg-indigo-50 text-center py-3">
                  <div className="text-xl font-bold text-indigo-700">{stats.forwarded || 0}</div>
                  <div className="text-xs text-indigo-800">Forwarded</div>
                </div>
              </div>
            </div>

            {/* --- FIX: Navigation with direct page links --- */}
            <div className="space-y-2 mb-8">
              <h3 className="text-sm font-medium text-gray-700">Navigation</h3>
              {Object.entries(pageLinks).map(([section, href]) => (
                <Link
                  key={section}
                  href={href}
                  onClick={() => setOpen(false)} // Closes menu on link click
                  className="block px-3 py-2 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-100 text-gray-800 text-sm font-medium transition-colors"
                >
                  {section} Reports
                </Link>
              ))}
            </div>

            {/* Help & Support */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">Help & Support</h3>
              <ul className="space-y-1 text-gray-700">
                <li><a href="#" className="block px-3 py-2 rounded-md hover:bg-gray-50">Documentation</a></li>
                <li><a href="#" className="block px-3 py-2 rounded-md hover:bg-gray-50">Contact Support</a></li>
                <li><a href="#" className="block px-3 py-2 rounded-md hover:bg-gray-50">Feedback</a></li>
              </ul>
            </div>
            {/*Logout*/}
            <div className="p-5 mt-auto border-t border-gray-200">
              <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-red-600 rounded-md hover:bg-red-50 font-semibold transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
            
          </aside>
        </div>
      )}
    </nav>
  );
};

export default Navbar;