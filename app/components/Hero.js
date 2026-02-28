"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="relative bg-gradient-to-r from-purple-100 via-white to-yellow-100 text-center py-[10vh] md:py-[15vh]">
        <div className="max-w-full mx-auto px-[5vw]">
          <h1 className="text-[9vw] md:text-[5vw] font-extrabold leading-tight">
            Where your <span className="text-purple-600">voice</span> meets <span className="text-yellow-500">actions</span>
          </h1>
          <p className="mt-[7vh] text-gray-700 text-[4vw] md:text-[1.5vw] max-w-[90vw] md:max-w-[60vw] mx-auto">
            Report local issues with just a few taps and help create a better community for everyone.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-[7vh] px-[5vw] py-[2vh] bg-purple-600 text-white text-[4vw] md:text-[1.5vw] font-semibold rounded-lg shadow-lg hover:bg-purple-700 transition"
          >
            Log In
          </button>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          {/* ## CUSTOM CLASS ADDED HERE ## */}
          <div className="login-modal-card bg-white rounded-xl shadow-2xl p-8 w-[90vw] max-w-md text-center relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Log in as?</h2>
            <div className="space-y-4">
              <Link href="/login/user" className="block w-full text-center py-3 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition">
                User
              </Link>
              <Link href="/login/admin" className="block w-full text-center py-3 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition">
                Admin
              </Link>
              <Link href="/login/administration" className="block w-full text-center py-3 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition">
                Administrator
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}