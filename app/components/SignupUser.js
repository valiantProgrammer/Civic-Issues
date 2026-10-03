'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import authApi, { setCookie } from '@/lib/api';
import toast from 'react-hot-toast';

export default function SignupUser() {
  const router = useRouter();

  // Multi-step flow: 1: 'account', 2: 'verify', 3: 'profile'
  const [step, setStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    ward: '',
    address: '',
    age: '',
  });

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Timer for Resend OTP in Step 2
  const [countdown, setCountdown] = useState(45);
  const [canResend, setCanResend] = useState(false);

  // Right-side Victoria Memorial slide carousel
  const [activeSlide, setActiveSlide] = useState(0);

  const otpInputRefs = useRef([]);

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

  // Resend Countdown Timer
  useEffect(() => {
    let timer;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [step, countdown, canResend]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  // Step 1 Validation
  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    return newErrors;
  };

  // Step 1 Submit: Trigger OTP via backend
  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setApiError('');
    const validationErrors = validateStep1();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      try {
        const response = await authApi.userSignup(
          formData.email.trim(),
          formData.fullName.trim()
        );
        toast.success(response?.message || 'Verification code sent to your email!');
        setStep(2);
        setCountdown(45);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        // Focus first OTP field
        setTimeout(() => {
          if (otpInputRefs.current[0]) {
            otpInputRefs.current[0].focus();
          }
        }, 150);
      } catch (err) {
        const errorMessage =
          err.message || 'Failed to start registration. Please check your details.';
        setApiError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // OTP Input Handlers
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const digit = value.slice(-1); // Only keep single digit
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setApiError('');

    if (digit && index < 5 && otpInputRefs.current[index + 1]) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && otpInputRefs.current[index - 1]) {
      otpInputRefs.current[index - 1].focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain').trim();
    if (/^\d{6}$/.test(pasteData)) {
      const pasteArray = pasteData.split('');
      setOtp(pasteArray);
      if (otpInputRefs.current[5]) {
        otpInputRefs.current[5].focus();
      }
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend || isLoading) return;
    setApiError('');
    setIsLoading(true);

    try {
      await authApi.sendOtp(formData.email.trim(), formData.fullName.trim());
      setCanResend(false);
      setCountdown(45);
      setOtp(['', '', '', '', '', '']);
      toast.success('New 6-digit verification code sent!');
      if (otpInputRefs.current[0]) {
        otpInputRefs.current[0].focus();
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to resend code. Please try again.';
      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2 Submit: Verify OTP and Register
  const handleStep2Submit = async (e) => {
    if (e) e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setApiError('Please enter the complete 6-digit code');
      return;
    }

    setApiError('');
    setIsLoading(true);

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        otp: otpCode,
      };

      const data = await authApi.verifyOtp(payload);

      if (data.accessToken) setCookie('accessToken', data.accessToken, 1);
      if (data.refreshToken) setCookie('refreshToken', data.refreshToken, 7);

      toast.success('Email successfully verified!');
      // Move to Step 3 (Profile completion)
      setStep(3);
    } catch (err) {
      const errorMessage =
        err.message || 'Invalid or expired verification code. Please try again.';
      setApiError(errorMessage);
      toast.error(errorMessage);
      setOtp(['', '', '', '', '', '']);
      if (otpInputRefs.current[0]) {
        otpInputRefs.current[0].focus();
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3 Submit: Complete Profile (optional/extra details)
  const handleStep3Submit = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setApiError('');

    try {
      const fullAddress = [formData.ward, formData.address].filter(Boolean).join(', ');
      const updatePayload = {};

      if (formData.phone.trim()) updatePayload.phone = formData.phone.trim();
      if (fullAddress) updatePayload.address = fullAddress;
      if (formData.age.trim()) updatePayload.age = Number(formData.age.trim());

      if (Object.keys(updatePayload).length > 0) {
        await authApi.updateUserProfile(updatePayload);
      }

      toast.success('Welcome to Civic साथी! Profile saved.');
      router.replace('/user');
    } catch (err) {
      console.warn('Profile update warning:', err);
      // Even if secondary profile fields fail, the account is created, so redirect to user portal
      toast.success('Welcome to Civic साथी!');
      router.replace('/user');
    } finally {
      setIsLoading(false);
    }
  };

  // Skip step 3 directly to user portal
  const handleSkipProfile = () => {
    toast.success('Welcome to Civic साथी!');
    router.replace('/user');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans antialiased relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Signup Card */}
      <div className="w-full max-w-[960px] bg-white rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-slate-800/20 grid grid-cols-1 md:grid-cols-2 relative z-10">
        
        {/* Left Column: Form Section */}
        <div className="p-7 sm:p-10 lg:p-11 flex flex-col justify-between bg-white min-h-[580px]">
          <div>
            {/* Logo and Brand Header */}
            <div className="flex items-center justify-between gap-3 mb-6">
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
                  <span className="text-lg font-bold text-blue-600 font-hindi">
                    साथी
                  </span>
                </div>
              </Link>

              {/* Citizen Badge */}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold border border-blue-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                Citizen Sign Up
              </span>
            </div>

            {/* Stepper (Account -> Verify -> Profile) */}
            <div className="flex items-center justify-between mb-7 px-1">
              {/* Step 1: Account */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step > 1
                      ? 'bg-blue-600 text-white'
                      : step === 1
                      ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-100'
                      : 'border border-slate-200 text-slate-400'
                  }`}
                >
                  {step > 1 ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    '1'
                  )}
                </div>
                <span
                  className={`text-xs ${
                    step === 1
                      ? 'font-bold text-slate-900'
                      : step > 1
                      ? 'font-medium text-blue-600'
                      : 'font-medium text-slate-400'
                  }`}
                >
                  Account
                </span>
              </div>

              {/* Connector line 1-2 */}
              <div
                className={`flex-1 h-[2px] mx-2 transition-colors ${
                  step > 1 ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              />

              {/* Step 2: Verify */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step > 2
                      ? 'bg-blue-600 text-white'
                      : step === 2
                      ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-100'
                      : 'border border-slate-200 text-slate-400'
                  }`}
                >
                  {step > 2 ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    '2'
                  )}
                </div>
                <span
                  className={`text-xs ${
                    step === 2
                      ? 'font-bold text-slate-900'
                      : step > 2
                      ? 'font-medium text-blue-600'
                      : 'font-medium text-slate-400'
                  }`}
                >
                  Verify
                </span>
              </div>

              {/* Connector line 2-3 */}
              <div
                className={`flex-1 h-[2px] mx-2 transition-colors ${
                  step > 2 ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              />

              {/* Step 3: Profile */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === 3
                      ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-100'
                      : 'border border-slate-200 text-slate-400'
                  }`}
                >
                  3
                </div>
                <span
                  className={`text-xs ${
                    step === 3 ? 'font-bold text-slate-900' : 'font-medium text-slate-400'
                  }`}
                >
                  Profile
                </span>
              </div>
            </div>

            {/* API Error Alert Banner */}
            {apiError && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1">
                <svg
                  className="w-4 h-4 text-red-500 shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="flex-1 font-medium">{apiError}</span>
              </div>
            )}

            {/* ================= STEP 1: CREATE ACCOUNT ================= */}
            {step === 1 && (
              <div className="animate-in fade-in duration-300">
                <div className="mb-5">
                  <h1 className="text-2xl sm:text-[28px] font-extrabold text-slate-900 tracking-tight">
                    Create Account
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                    Join thousands of citizens building a better community.
                  </p>
                </div>

                <form onSubmit={handleStep1Submit} className="space-y-3.5">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Rupayan Dey"
                      disabled={isLoading}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 bg-white transition-all outline-none focus:ring-2 ${
                        errors.fullName
                          ? 'border-red-400 ring-red-200'
                          : 'border-slate-200 focus:border-blue-600 focus:ring-blue-100'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-xs mt-1 font-medium">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      disabled={isLoading}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 bg-white transition-all outline-none focus:ring-2 ${
                        errors.email
                          ? 'border-red-400 ring-red-200'
                          : 'border-slate-200 focus:border-blue-600 focus:ring-blue-100'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>
                    )}
                  </div>

                  {/* Password */}
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
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        disabled={isLoading}
                        className={`w-full px-3.5 py-2.5 pr-10 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 bg-white transition-all outline-none focus:ring-2 ${
                          errors.password
                            ? 'border-red-400 ring-red-200'
                            : 'border-slate-200 focus:border-blue-600 focus:ring-blue-100'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1 cursor-pointer"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>
                    )}
                  </div>

                  {/* Continue Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-md shadow-blue-600/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Sending code...</span>
                        </>
                      ) : (
                        <span>Continue</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ================= STEP 2: VERIFY EMAIL ================= */}
            {step === 2 && (
              <div className="animate-in fade-in duration-300">
                <div className="mb-6">
                  <h1 className="text-2xl sm:text-[28px] font-extrabold text-slate-900 tracking-tight">
                    Verify Your Email
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                    Enter the 6-digit code sent to{' '}
                    <span className="font-semibold text-slate-800">{formData.email}</span>
                  </p>
                </div>

                <form onSubmit={handleStep2Submit} className="space-y-6">
                  {/* 6 Digit Inputs */}
                  <div className="flex justify-between items-center gap-2 sm:gap-2.5">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (otpInputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={handleOtpPaste}
                        disabled={isLoading}
                        className="w-11 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm"
                      />
                    ))}
                  </div>

                  {/* Resend Countdown / Trigger */}
                  <div className="text-center text-xs sm:text-sm">
                    {countdown > 0 ? (
                      <p className="text-slate-500 font-medium">
                        Resend code in{' '}
                        <span className="text-blue-600 font-bold">
                          00:{countdown.toString().padStart(2, '0')}
                        </span>
                      </p>
                    ) : (
                      <p className="text-slate-500 font-medium">
                        Didn't receive the code?{' '}
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={isLoading}
                          className="text-blue-600 font-bold hover:underline cursor-pointer disabled:opacity-50"
                        >
                          Resend code
                        </button>
                      </p>
                    )}
                  </div>

                  {/* Verify Button */}
                  <div>
                    <button
                      type="submit"
                      disabled={isLoading || otp.join('').length !== 6}
                      className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-md shadow-blue-600/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <span>Verify</span>
                      )}
                    </button>
                  </div>

                  {/* Back to Step 1 Link */}
                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
                    >
                      ← Back to Signup
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ================= STEP 3: COMPLETE PROFILE ================= */}
            {step === 3 && (
              <div className="animate-in fade-in duration-300">
                <div className="mb-5">
                  <h1 className="text-2xl sm:text-[28px] font-extrabold text-slate-900 tracking-tight">
                    Complete Your Profile
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                    Add your area & contact details to get localized community updates.
                  </p>
                </div>

                <form onSubmit={handleStep3Submit} className="space-y-3.5">
                  {/* Phone Number */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                        +91
                      </span>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        maxLength={10}
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="9876543210"
                        disabled={isLoading}
                        className="w-full pl-12 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 bg-white transition-all outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  {/* Ward / Area */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="ward"
                        className="block text-xs font-semibold text-slate-700 mb-1.5"
                      >
                        Ward / Zone
                      </label>
                      <input
                        id="ward"
                        name="ward"
                        type="text"
                        value={formData.ward}
                        onChange={handleChange}
                        placeholder="e.g. Ward 7"
                        disabled={isLoading}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 bg-white transition-all outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="age"
                        className="block text-xs font-semibold text-slate-700 mb-1.5"
                      >
                        Age (Optional)
                      </label>
                      <input
                        id="age"
                        name="age"
                        type="number"
                        min="1"
                        max="120"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="e.g. 26"
                        disabled={isLoading}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 bg-white transition-all outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  {/* Residential Address */}
                  <div>
                    <label
                      htmlFor="address"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      Residential Locality / Address
                    </label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Street, Landmark or Locality"
                      disabled={isLoading}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 bg-white transition-all outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* Actions */}
                  <div className="pt-2 space-y-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-md shadow-blue-600/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Saving Profile...</span>
                        </>
                      ) : (
                        <span>Complete Registration</span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleSkipProfile}
                      disabled={isLoading}
                      className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                    >
                      Skip for now →
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Footer: Log in info (only on Step 1) */}
          {step === 1 && (
            <div className="mt-6 text-center">
              <p className="text-xs text-slate-500">
                Already have an account?{' '}
                <Link href="/login/user" className="text-blue-600 font-semibold hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Photograph with City Overlay (Victoria Memorial) */}
        <div className="relative hidden md:block min-h-[580px] overflow-hidden select-none bg-slate-900">
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
            <h2 className="text-3xl lg:text-[36px] font-black text-white leading-[1.14] tracking-tight drop-shadow-lg whitespace-pre-line">
              {slides[activeSlide].title}
            </h2>
            <p className="text-sm text-slate-300 mt-2 font-medium">
              {slides[activeSlide].subtitle}
            </p>

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
