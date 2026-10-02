'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function RegisterWardView() {
  const [formData, setFormData] = useState({
    wardNumber: '',
    municipality: 'Kolkata Municipal Corporation',
    locality: '',
    inspectorName: '',
    inspectorPhone: '',
    population: '',
  });

  const [wards, setWards] = useState([
    {
      id: 'WARD-08',
      wardNumber: 'Ward 8',
      municipality: 'Kolkata Municipal Corporation',
      locality: 'Park Street, Esplanade & Camac Street',
      inspector: 'S. Chatterjee',
      activeIssues: 12,
    },
    {
      id: 'WARD-12',
      wardNumber: 'Ward 12',
      municipality: 'Kolkata Municipal Corporation',
      locality: 'Salt Lake Sector 1 & Ultadanga',
      inspector: 'A. Sen',
      activeIssues: 8,
    },
    {
      id: 'WARD-05',
      wardNumber: 'Ward 5',
      municipality: 'Kolkata Municipal Corporation',
      locality: 'Shyambazar, Hatibagan & Sovabazar',
      inspector: 'M. Mukherjee',
      activeIssues: 5,
    },
    {
      id: 'WARD-11',
      wardNumber: 'Ward 11',
      municipality: 'Kolkata Municipal Corporation',
      locality: 'Alipore, New Alipore & Chetla',
      inspector: 'R. Bannerjee',
      activeIssues: 7,
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.wardNumber.trim()) {
      toast.error('Please enter the ward number');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const newWard = {
        id: `WARD-${formData.wardNumber.replace(/\D/g, '') || Math.floor(10 + Math.random() * 80)}`,
        wardNumber: formData.wardNumber.startsWith('Ward') ? formData.wardNumber : `Ward ${formData.wardNumber}`,
        municipality: formData.municipality,
        locality: formData.locality || 'Municipal Ward Area',
        inspector: formData.inspectorName || 'Assigned Officer',
        activeIssues: 0,
      };

      setWards((prev) => [newWard, ...prev]);
      toast.success(`${newWard.wardNumber} registered successfully!`);
      setFormData({
        wardNumber: '',
        municipality: 'Kolkata Municipal Corporation',
        locality: '',
        inspectorName: '',
        inspectorPhone: '',
        population: '',
      });
    } catch {
      toast.error('Failed to register ward');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Register Ward
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Add new administrative wards and associate them with municipal corporations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Ward Registration Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Ward Information
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Ward Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.wardNumber}
                  onChange={(e) => setFormData({ ...formData, wardNumber: e.target.value })}
                  placeholder="e.g. Ward 8 or 14"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-800 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Select Municipality *
                </label>
                <select
                  value={formData.municipality}
                  onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-800 transition-all font-medium bg-white"
                >
                  <option value="Kolkata Municipal Corporation">Kolkata Municipal Corporation</option>
                  <option value="Howrah Municipal Corporation">Howrah Municipal Corporation</option>
                  <option value="Bidhannagar Municipal Corporation">Bidhannagar Municipal Corporation</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Key Localities / Neighborhoods *
              </label>
              <input
                type="text"
                required
                value={formData.locality}
                onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                placeholder="e.g. Park Street, Camac Street, Shakespeare Sarani"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-800 transition-all font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Ward Officer / Inspector Name
                </label>
                <input
                  type="text"
                  value={formData.inspectorName}
                  onChange={(e) => setFormData({ ...formData, inspectorName: e.target.value })}
                  placeholder="e.g. S. Chatterjee"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-800 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Officer Contact Phone
                </label>
                <input
                  type="tel"
                  value={formData.inspectorPhone}
                  onChange={(e) => setFormData({ ...formData, inspectorPhone: e.target.value })}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-800 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Estimated Population
              </label>
              <input
                type="number"
                value={formData.population}
                onChange={(e) => setFormData({ ...formData, population: e.target.value })}
                placeholder="e.g. 45000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-800 transition-all font-medium"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Registering...' : 'Register Ward'}
              </button>
            </div>
          </form>
        </div>

        {/* Existing Wards List */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Registered Wards
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
              {wards.length} Active
            </span>
          </div>

          <div className="space-y-3">
            {wards.map((w) => (
              <div
                key={w.id}
                className="p-4 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors bg-slate-50/50"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {w.wardNumber}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5 font-medium">
                      {w.locality}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {w.municipality} • Officer: {w.inspector}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200 shrink-0">
                    {w.activeIssues} Issues
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
