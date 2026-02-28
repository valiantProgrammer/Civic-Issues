'use client';

import React from 'react';

// --- SVG Icon Components ---
const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);

const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
);


/**
 * A user-friendly page to show when a user is authenticated but not authorized
 * to view a specific route based on their role.
 */
export default function UnauthorizedPage() {
    // Replaced Next.js router with standard browser history API to resolve compile error
    const handleGoBack = () => {
        window.history.back();
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md text-center">
                <div className="mx-auto mb-6 bg-red-100 rounded-full h-20 w-20 flex items-center justify-center">
                    <LockIcon className="h-10 w-10 text-red-500" />
                </div>

                <h1 className="text-4xl font-extrabold text-slate-800">Access Denied</h1>
                <p className="mt-4 text-lg text-slate-600">
                    You do not have the necessary permissions to access this page. Your current role does not grant you access to this resource.
                </p>
                <p className="mt-2 text-sm text-slate-500">
                    If you believe this is an error, please contact your system administrator.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={handleGoBack}
                        className="w-full sm:w-auto px-6 py-3 bg-slate-200 text-slate-800 font-semibold rounded-lg shadow-sm hover:bg-slate-300 transition-colors"
                    >
                        Go Back
                    </button>
                    {/* Replaced Next.js Link with a standard anchor tag */}
                    <a href="/" className="w-full sm:w-auto px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 transition-colors">
                        Return to Homepage
                    </a>
                </div>

                <div className="mt-12 flex items-center justify-center space-x-3 text-slate-500">
                     <div className="bg-orange-500 p-2 rounded-lg"><StarIcon /></div>
                     <span className="font-bold">Civic साथी</span>
                </div>
            </div>
        </div>
    );
}

