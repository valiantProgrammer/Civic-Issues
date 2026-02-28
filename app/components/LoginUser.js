"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from './Header'; // Assuming Header is in a shared location
import Link from 'next/link';
import { authApi, setCookie } from '@/lib/api';
import toast from 'react-hot-toast';

export default function LoginUser() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const validate = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) newErrors.email = 'Please add your email';
        else if (!emailRegex.test(email)) newErrors.email = 'Please enter a valid email';

        if (!password) newErrors.password = 'Please add your password';

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            setIsLoading(true);
            try {
                const data = await authApi.userSignin({ email, password });
                
                toast.success('Sign-in successful!');
                setCookie('accessToken', data.accessToken, 1);
                setCookie('refreshToken', data.refreshToken, 7);

                router.replace('/user'); // Redirect to home page on successful login

            } catch (error) {
                const errorMessage = error.message || 'An unexpected error occurred. Please try again.';
                setApiError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="flex text-slate-600 items-center justify-center py-12 px-4">
                <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg space-y-6">
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        User Login
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="font-medium text-gray-700">Email address</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className={`w-full mt-2 p-3 border rounded-md outline-none focus:ring-2 ${errors.email ? 'border-red-500 ring-red-300' : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'}`}
                                disabled={isLoading}
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label htmlFor="password" className="font-medium text-gray-700">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className={`w-full mt-2 p-3 border rounded-md outline-none focus:ring-2 ${errors.password ? 'border-red-500 ring-red-300' : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'}`}
                                disabled={isLoading}
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>

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
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing In...
                                </>
                            ) : (
                                'Log In'
                            )}
                        </button>
                        <p className="text-center text-sm text-gray-600">
                            No account?{' '}
                            <Link href="/signup/user" className="font-medium text-purple-600 hover:text-purple-500">
                                Sign Up
                            </Link>
                        </p>
                    </form>
                </div>
            </main>
        </div>
    );
}

