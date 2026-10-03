'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function RegisterMunicipalityView() {
  const [formData, setFormData] = useState({
    name: '',
    city: 'Kolkata',
    state: 'West Bengal',
    fileName: '',
    zoneCode: '',
    headquarters: '',
  });

  const [municipalities, setMunicipalities] = useState([
    {
      id: 'KMC-01',
      name: 'Kolkata Municipal Corporation',
      city: 'Kolkata',
      state: 'West Bengal',
      wardsCount: 144,
      status: 'Active',
    },
    {
      id: 'HMC-02',
      name: 'Howrah Municipal Corporation',
      city: 'Howrah',
      state: 'West Bengal',
      wardsCount: 50,
      status: 'Active',
    },
    {
      id: 'BMC-03',
      name: 'Bidhannagar Municipal Corporation',
      city: 'Bidhannagar',
      state: 'West Bengal',
      wardsCount: 41,
      status: 'Active',
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Please enter the municipality name');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API registration or local state save
      await new Promise((resolve) => setTimeout(resolve, 600));

      const newMuni = {
        id: `MUNI-${Math.floor(10 + Math.random() * 90)}`,
        name: formData.name,
        city: formData.city,
        state: formData.state,
        wardsCount: 0,
        status: 'Active',
      };

      setMunicipalities((prev) => [newMuni, ...prev]);
      toast.success(`${formData.name} registered successfully!`);
      setFormData({
        name: '',
        city: 'Kolkata',
        state: 'West Bengal',
        fileName: '',
        zoneCode: '',
        headquarters: '',
      });
    } catch {
      toast.error('Failed to register municipality');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Register Municipality
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Add and manage municipal corporations under civic jurisdiction.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Registration Form Card */}
        <div className="lg:col-span-7 bg-white dark:bg-[#111A2E] rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            Municipality Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Municipality Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Kolkata Municipal Corporation"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B132B] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-800 dark:text-white transition-all font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Kolkata"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B132B] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-800 dark:text-white transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="e.g. West Bengal"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B132B] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-800 dark:text-white transition-all font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  GeoJSON Boundary File
                </label>
                <input
                  type="text"
                  value={formData.fileName}
                  onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
                  placeholder="e.g. kolkata_wards.geojson"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B132B] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-800 dark:text-white transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Zone Code / ID
                </label>
                <input
                  type="text"
                  value={formData.zoneCode}
                  onChange={(e) => setFormData({ ...formData, zoneCode: e.target.value })}
                  placeholder="e.g. KMC-ZN-01"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B132B] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-800 dark:text-white transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Headquarters Address
              </label>
              <textarea
                rows={2}
                value={formData.headquarters}
                onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
                placeholder="5, S.N. Banerjee Road, Kolkata - 700013"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B132B] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-800 dark:text-white transition-all font-medium resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Registering...' : 'Register Municipality'}
              </button>
            </div>
          </form>
        </div>

        {/* Existing Municipalities List */}
        <div className="lg:col-span-5 bg-white dark:bg-[#111A2E] rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Active Municipalities
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
              {municipalities.length} Registered
            </span>
          </div>

          <div className="space-y-3">
            {municipalities.map((muni) => (
              <div
                key={muni.id}
                className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-slate-700 transition-colors bg-slate-50/50 dark:bg-slate-800/40"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                      {muni.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {muni.city}, {muni.state}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                    {muni.status}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2">
                  <span>ID: {muni.id}</span>
                  <span>{muni.wardsCount} Wards</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
