"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from './Header'; // Assuming a Header component exists
import Link from 'next/link';
import authApi from '@/lib/api';
import toast from 'react-hot-toast';

export default function SignupAdmin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    age: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Number must be 10 digits';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.age) newErrors.age = 'Age is required';
    else if (formData.age < 18) newErrors.age = 'Must be 18 or older';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

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
        await authApi.adminSignup(formData);
        toast.success('Admin account created successfully! Check your email.');
        router.push('/login/admin');
      } catch (error) {
        const errorMessage = error.message || 'An unexpected error occurred.';
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
            Create Admin Account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {Object.entries({
              fullName: { label: 'Full Name', type: 'text', placeholder: 'Enter your name' },
              email: { label: 'Email Address', type: 'email', placeholder: 'Enter your email' },
              phone: { label: 'Phone Number', type: 'tel', placeholder: 'Enter your phone' },
              address: { label: 'Address', type: 'text', placeholder: 'Enter your address' },
              age: { label: 'Age', type: 'number', placeholder: 'Enter your age' },
              password: { label: 'Password', type: 'password', placeholder: 'Enter your password' },
              confirmPassword: { label: 'Confirm Password', type: 'password', placeholder: 'Confirm your password' }
            }).map(([id, { label, type, placeholder }]) => (
              <div key={id}>
                <label htmlFor={id} className="font-medium text-gray-700">{label}</label>
                <input
                  id={id}
                  type={type}
                  placeholder={placeholder}
                  value={formData[id]}
                  onChange={handleChange}
                  className={`w-full mt-2 p-3 border rounded-md outline-none focus:ring-2 ${errors[id] ? 'border-red-500 ring-red-300' : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'}`}
                  disabled={isLoading}
                />
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
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
