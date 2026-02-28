"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from './Header'; // Assuming a Header component exists
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import authApi, { setCookie } from '@/lib/api'; // Corrected import
import toast from 'react-hot-toast';

export default function SignupUser() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        email: '',
        phone: '',
        age: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [canResendOTP, setCanResendOTP] = useState(true);
    const [resendTimeout, setResendTimeout] = useState(0);

    const modalRef = useRef(null);
    const otpInputRefs = useRef([]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.fullName) newErrors.fullName = 'Please add your full name';
        if (!formData.address) newErrors.address = 'Please add your address';
        if (!formData.email) newErrors.email = 'Please add your email';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email';
        if (!formData.phone) newErrors.phone = 'Please add your phone number';
        else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Number must be 10 digits';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
        else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        return newErrors;
    };

    // Auto-submit when OTP is filled
    useEffect(() => {
        if (otp.join('').length === 6) {
            verifyAndRegister();
        }
    }, [otp]);

    // Timer for resending OTP
    useEffect(() => {
        let timer;
        if (resendTimeout > 0) {
            timer = setInterval(() => {
                setResendTimeout(prev => prev - 1);
            }, 1000);
        } else if (resendTimeout === 0 && !canResendOTP) {
            setCanResendOTP(true);
        }
        return () => clearInterval(timer);
    }, [resendTimeout, canResendOTP]);

    // Handle main form submission to send OTP
    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            setIsLoading(true);
            try {
                const email = formData.email;
                const username = formData.fullName;
                await authApi.userSignup( email, username );
                toast.success('OTP sent successfully!');
                setIsOTPModalOpen(true);
            } catch (error) {
                const errorMessage = error.message || 'An unexpected error occurred. Please try again.';
                setApiError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Close modal on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setIsOTPModalOpen(false); // Correctly close the modal
            }
        };
        if (isOTPModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOTPModalOpen]);

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5 && otpInputRefs.current[index + 1]) {
            otpInputRefs.current[index + 1].focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text/plain').trim();
        if (/^\d{6}$/.test(pasteData)) {
            const pasteArray = pasteData.split('');
            setOtp(pasteArray.slice(0, 6));
        }
    };

    // Verify OTP and complete user registration
    const verifyAndRegister = async () => {
        const otpString = otp.join('');
        if (isLoading || otpString.length !== 6) {
             return;
        };

        setErrors({});
        setApiError('');
        setIsLoading(true);

        try {
            const payload = { ...formData, otp: otpString };
            // Use the authApi module instead of fetch
            const data = await authApi.verifyOtp(payload);

            toast.success('Registration successful!');
            setCookie('accessToken', data.accessToken, 1);
            setCookie('refreshToken', data.refreshToken, 7);

            router.replace('/');
        } catch (err) {
            const errorMessage = err.message || 'Verification failed. Please try again.';
            setErrors({ message: errorMessage });
            toast.error(errorMessage);
            setOtp(['', '', '', '', '', '']);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (!canResendOTP) return;
        setApiError('');
        setErrors({});
        setIsLoading(true);

        try {
            // Use the authApi module instead of fetch
            await authApi.sendOtp(formData.email, formData.fullName);

            setCanResendOTP(false);
            setResendTimeout(30);
            toast.success('New OTP sent successfully');
        } catch (err) {
            const errorMessage = err.message || 'Failed to resend OTP';
            setErrors({ message: errorMessage });
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    // Note: To use react-hot-toast, you must add <Toaster /> to your root layout.js
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="flex items-center text-slate-600 justify-center py-12 px-4">
                <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg space-y-6">
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        Create User Account
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {Object.entries({
                            fullName: { label: 'Full Name', type: 'text', placeholder: 'Chhota Bheem' },
                            address: { label: 'Address', type: 'text', placeholder: 'Dholakpur' },
                            email: { label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
                            phone: { label: 'Phone Number', type: 'tel', placeholder: '1234567890' },
                            age: { label: 'Age (Optional)', type: 'number', placeholder: '10' },
                            password: { label: 'Password', type: 'password', placeholder: '••••••••' },
                            confirmPassword: { label: 'Confirm Password', type: 'password', placeholder: '••••••••' }
                        }).map(([id, { label, type, placeholder }]) => (
                            <div key={id}>
                                <label htmlFor={id} className="font-medium text-gray-700">{label}</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        id={id}
                                        type={type}
                                        value={formData[id]}
                                        onChange={handleChange}
                                        placeholder={placeholder}
                                        className={`w-full mt-2 p-3 border rounded-md outline-none focus:ring-2 ${errors[id] ? 'border-red-500 ring-red-300' : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'}`}
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors[id] && <p className="text-red-500 text-sm mt-1">{errors[id]}</p>}
                            </div>
                        ))}

                        {apiError && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                <span className="block sm:inline">{apiError}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-4 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition flex justify-center items-center disabled:bg-purple-400 disabled:cursor-not-allowed"
                        >
                            {isLoading && !isOTPModalOpen ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending OTP...
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </button>
                        <p className="text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link href="/login/user" className="font-medium text-purple-600 hover:text-purple-500">
                                Log In
                            </Link>
                        </p>
                    </form>
                </div>
            </main>

            <AnimatePresence>
                {isOTPModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center text-slate-700 justify-center p-4"
                    >
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
                        <motion.div
                            ref={modalRef}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden"
                        >
                            <div className="px-6 py-4">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Verify Your Email</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    We've sent a 6-digit code to <span className="font-semibold">{formData.email}</span>
                                </p>
                                <div className="mb-4">
                                    <div className="flex justify-center space-x-2">
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={(el) => (otpInputRefs.current[index] = el)}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength="1"
                                                value={digit}
                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                                onPaste={handleOtpPaste}
                                                onFocus={(e) => e.target.select()}
                                                className="w-12 h-12 text-2xl text-center text-slate-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            />
                                        ))}
                                    </div>
                                </div>
                                {errors.message && (
                                    <div className="mb-4 text-sm text-red-600 text-center">{errors.message}</div>
                                )}
                                <div className="flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={handleResendOTP}
                                        disabled={!canResendOTP || isLoading}
                                        className={`text-sm font-medium ${canResendOTP ? 'text-indigo-600 hover:text-indigo-500' : 'text-gray-400'}`}
                                    >
                                        {resendTimeout > 0 ? `Resend in ${resendTimeout}s` : 'Resend Code'}
                                    </button>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsOTPModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={verifyAndRegister}
                                    disabled={isLoading || otp.join('').length !== 6}
                                    className="px-4 py-2 bg-indigo-600 text-sm font-medium text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Verifying...' : 'Verify & Register'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

