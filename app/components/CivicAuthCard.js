'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi, setCookie } from '@/lib/api';
import toast from 'react-hot-toast';

export default function CivicAuthCard({ initialRole = 'user' }) {
  const router = useRouter();
  const [role, setRole] = useState(initialRole);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  // Sync role if initialRole prop changes
  useEffect(() => {
    setRole(initialRole);
    setErrors({});
    setApiError('');
  }, [initialRole]);

  const slides = [
    {
      title: 'Your City\nYour Voice\nReal Action',
      subtitle: 'Transforming civic infrastructure together.',
    },
    {
      title: 'Report Issues\nIn Real-Time',
      subtitle: 'Geo-tagged reports sent straight to authorities.',
    },
    {
      title: 'Track Every\nResolution',
      subtitle: 'Transparent updates at every stage of work.',
    },
    {
      title: 'Cleaner, Safer\nSmart Communities',
      subtitle: 'Join citizens across Kolkata shaping the future.',
    },
  ];

  // Auto-advance photo slide indicator
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const validate = () => {
    const newErrors = {};

    if (!identifier.trim()) {
      if (role === 'user') {
        newErrors.identifier = 'Please enter your email address';
      } else if (role === 'admin') {
        newErrors.identifier = 'Please enter your Admin User ID';
      } else {
        newErrors.identifier = 'Please enter your Official Login ID';
      }
    } else if (role === 'user') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(identifier.trim())) {
        newErrors.identifier = 'Please enter a valid email address';
      }
    }

    if (!password) {
      newErrors.password = 'Please enter your password';
    }

    return newErrors;
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setErrors({});
    setApiError('');
    if (newRole === 'user') {
      router.push('/login/user');
    } else if (newRole === 'admin') {
      router.push('/login/admin');
    } else if (newRole === 'administration') {
      router.push('/login/administration');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      try {
        let data;
        if (role === 'admin') {
          data = await authApi.adminSignin({ userId: identifier.trim(), password });
        } else if (role === 'administration') {
          data = await authApi.administrationSignin({ loginId: identifier.trim(), password });
        } else {
          data = await authApi.userSignin({ email: identifier.trim(), password });
        }

        toast.success(
          role === 'admin'
            ? 'Admin login successful!'
            : role === 'administration'
            ? 'Official login successful!'
            : 'Sign-in successful!'
        );

        if (data.accessToken) setCookie('accessToken', data.accessToken, 1);
        if (data.refreshToken) setCookie('refreshToken', data.refreshToken, 7);

        if (role === 'admin') {
          router.replace('/admin');
        } else if (role === 'administration') {
          router.replace('/administration');
        } else {
          router.replace('/user');
        }
      } catch (error) {
        const errorMessage = error.message || 'Invalid credentials. Please verify and try again.';
        setApiError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans antialiased relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-[940px] bg-white rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-slate-800/20 grid grid-cols-1 md:grid-cols-2 relative z-10">
        
        {/* Left Column: Form Section */}
        <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-between bg-white">
          <div>
            {/* Logo & Role Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="relative w-8 h-8 rounded-full overflow-hidden shadow-sm ring-1 ring-slate-100 flex items-center justify-center bg-white">
                  <Image
                    src="/images/logo.png"
                    alt="Civic Saathi Logo"
                    width={32}
                    height={32}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    priority
                  />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-extrabold tracking-tight text-slate-900">
                    Civic
                  </span>
                  <span className="text-lg font-bold text-slate-800">
                    साथी
                  </span>
                </div>
              </Link>

              {/* 3-Role Switcher Tabs */}
              <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-lg text-[11px] font-semibold text-slate-600">
                <button
                  type="button"
                  onClick={() => handleRoleChange('user')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    role === 'user'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Citizen
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('admin')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    role === 'admin'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('administration')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    role === 'administration'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Official
                </button>
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {role === 'admin'
                  ? 'Admin Portal'
                  : role === 'administration'
                  ? 'Administrative Portal'
                  : 'Welcome Back'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                {role === 'admin'
                  ? 'Log in to manage civic reports, teams, and assignments.'
                  : role === 'administration'
                  ? 'Log in to review departmental action plans & field operations.'
                  : 'Log in to continue making your city better.'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Identifier Input */}
              <div>
                <label
                  htmlFor="identifier"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  {role === 'user'
                    ? 'Email'
                    : role === 'admin'
                    ? 'Admin User ID'
                    : 'Official Login ID'}
                </label>
                <input
                  id="identifier"
                  type={role === 'user' ? 'email' : 'text'}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    role === 'user'
                      ? 'you@example.com'
                      : role === 'admin'
                      ? 'admin@civicsaathi.gov.in'
                      : 'OFF-WB-XXXXX'
                  }
                  disabled={isLoading}
                  className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 bg-white transition-all outline-none focus:ring-2 ${
                    errors.identifier
                      ? 'border-red-400 ring-red-200'
                      : 'border-slate-200 focus:border-blue-600 focus:ring-blue-100'
                  }`}
                />
                {errors.identifier && (
                  <p className="text-red-500 text-xs mt-1 font-medium">{errors.identifier}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isLoading}
                    className={`w-full px-3.5 py-2.5 sm:py-3 pr-10 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 bg-white transition-all outline-none focus:ring-2 ${
                      errors.password
                        ? 'border-red-400 ring-red-200'
                        : 'border-slate-200 focus:border-blue-600 focus:ring-blue-100'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {showPassword ? (
                        <>
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </>
                      ) : (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="pt-0.5">
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* API Error Alert */}
              {apiError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
                  {apiError}
                </div>
              )}

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 sm:py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-600/35 transition-all flex items-center justify-center cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Authenticating...</span>
                    </div>
                  ) : role === 'admin' ? (
                    'Log In as Admin'
                  ) : role === 'administration' ? (
                    'Log In as Official'
                  ) : (
                    'Log In'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Footer: Sign up / Support info */}
          <div className="mt-8 text-center">
            {role === 'user' ? (
              <p className="text-xs text-slate-500">
                Don't have an account?{' '}
                <Link href="/signup/user" className="text-blue-600 font-semibold hover:underline">
                  Sign up
                </Link>
              </p>
            ) : role === 'admin' ? (
              <p className="text-xs text-slate-500">
                Authorized municipal administrators only.{' '}
                <Link href="/contact" className="text-blue-600 font-semibold hover:underline">
                  IT Support
                </Link>
              </p>
            ) : (
              <p className="text-xs text-slate-500">
                Departmental officers & field supervisors.{' '}
                <Link href="/contact" className="text-blue-600 font-semibold hover:underline">
                  Helpdesk
                </Link>
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Photograph with City Overlay */}
        <div className="relative hidden md:block min-h-[540px] overflow-hidden select-none bg-slate-900">
          {/* Photograph: Victoria Memorial Kolkata */}
          <Image
            src="/images/victoria_memorial.jpg"
            alt="Victoria Memorial, Kolkata"
            fill
            className="object-cover object-center transform scale-105 transition-transform duration-1000"
            priority
          />

          {/* Vignette & Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/15" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/20" />

          {/* Content container at the bottom */}
          <div className="absolute inset-0 p-8 lg:p-12 flex flex-col justify-end text-white z-10">
            {/* Tagline */}
            <h2 className="text-3xl lg:text-[38px] font-black text-white leading-[1.12] tracking-tight drop-shadow-lg whitespace-pre-line">
              {slides[activeSlide].title}
            </h2>

            {/* Pagination Dots */}
            <div className="flex items-center gap-1.5 mt-8">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-2 transition-all rounded-full cursor-pointer ${
                    activeSlide === idx
                      ? 'w-6 bg-blue-500'
                      : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
