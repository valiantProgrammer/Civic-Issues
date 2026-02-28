"use client";

import React, { useState } from 'react';
import Header from './Header';
import Link from 'next/link';

export default function SignupAdmin() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        age: '',
        designation: '',
        authority: '',
        Municipality: '',
        userId: ''
    });
    const [errors, setErrors] = useState({});

    const authorityCategory = [
        'High',
        'Medium',
        'Low'
    ]

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
        if (!formData.userId) newErrors.userId = 'User ID is required';

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            // TODO: Handle successful admin signup
            console.log('Form submitted:', formData);
            alert('Admin signup successful!');
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
                            fullName: { label: 'Full Name', type: 'text' },
                            email: { label: 'Email Address', type: 'email' },
                            phone: { label: 'Phone Number', type: 'tel' },
                            address: { label: 'Address', type: 'text' },
                            designation: { label: 'Designation', type: 'text' },
                            age: { label: 'Age', type: 'number' }
                        }).map(([id, { label, type }]) => (
                            <div key={id}>
                                <label htmlFor={id} className="font-medium text-gray-700">{label}</label>
                                <input
                                    id={id}
                                    type={type}
                                    value={formData[id]}
                                    onChange={handleChange}
                                    className={`w-full mt-2 p-3 border rounded-md outline-none focus:ring-2 ${errors[id] ? 'border-red-500 ring-red-300' : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'}`}
                                />
                                {errors[id] && <p className="text-red-500 text-sm mt-1">{errors[id]}</p>}
                            </div>
                        ))}
                        <div>
                            <label htmlFor="authority" className="block text-sm font-medium text-gray-700 mb-2">
                                Issue Category *
                            </label>
                            <select
                                id="authority"
                                value={formData.authority}
                                onChange={(e) => setFormData(prev => ({ ...prev, authority: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                required
                            >
                                <option value="">Select an issue category</option>
                                {authorityCategory.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}