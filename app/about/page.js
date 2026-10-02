'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export default function AboutPage() {
  const pillars = [
    {
      title: 'Citizen Empowerment',
      subtitle: 'Your voice matters.',
      description: 'Every resident has the direct power to flag civic issues, hold authorities accountable, and shape their neighborhood.',
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      title: 'Transparency',
      subtitle: 'Track every action.',
      description: 'Full public visibility from the moment a ticket is submitted to officer inspection, dispatch, and final photo verification.',
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: 'Efficient Management',
      subtitle: 'Faster resolutions.',
      description: 'Automated ward routing, AI severity triage, and strict SLA compliance ensure no citizen complaint falls through the cracks.',
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: 'Community Building',
      subtitle: 'Stronger together.',
      description: 'Bringing residents, ward councilors, and municipal field teams into a collaborative civic ecosystem for a cleaner, safer city.',
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Capture & Geotag',
      description: 'Snap a photo of the pothole, water leak, or garbage dump. Our 3D map automatically captures the exact coordinates and ward jurisdiction.',
    },
    {
      step: '02',
      title: 'AI Classification & Triage',
      description: 'Our intelligent algorithms cross-reference severity, detect duplicate tickets in the vicinity, and route directly to the designated ward inspector.',
    },
    {
      step: '03',
      title: 'Municipal Field Dispatch',
      description: 'Field repair squads are mobilized with time-bound SLAs. Track real-time progress on your personal dashboard.',
    },
    {
      step: '04',
      title: 'Public Verification',
      description: 'Upon resolution, before-and-after photo proof is uploaded. Citizens confirm the resolution before the ticket is officially closed.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex flex-col antialiased">
      <Header />

      <main className="flex-1">
        
        {/* 1. Hero Showcase Section matching the uploaded reference image */}
        <section className="relative overflow-hidden bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Content Area matching the screenshot */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                    About Civic साथी
                  </h1>
                  <h2 className="text-xl sm:text-2xl font-bold text-blue-600 mt-2">
                    Where Your Voice Meets Actions
                  </h2>
                  <p className="text-slate-600 text-sm sm:text-base lg:text-lg mt-3 max-w-xl leading-relaxed">
                    Civic साथी connects citizens with municipal systems to ensure transparent, accountable, and swift civic resolutions across your city.
                  </p>
                </div>

                {/* 4 Feature Cards (2x2 Grid) matching the screenshot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 pt-2">
                  {pillars.map((item) => (
                    <div
                      key={item.title}
                      className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-md hover:border-blue-200 transition-all flex items-center gap-3.5 group"
                    >
                      {/* Circular Icon with soft blue glow */}
                      <div className="w-12 h-12 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-blue-100/80 transition-all shadow-xs">
                        {item.icon}
                      </div>

                      {/* Text */}
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight truncate">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Action CTAs */}
                <div className="flex flex-wrap items-center gap-3.5 pt-4">
                  <Link
                    href="/user"
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all"
                  >
                    Report an Issue Now →
                  </Link>
                  <Link
                    href="/how-to-use"
                    className="px-6 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all"
                  >
                    Learn How It Works
                  </Link>
                </div>
              </div>

              {/* Right Image Area matching the screenshot (Victoria Memorial) */}
              <div className="lg:col-span-5 relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
                <Image
                  src="/images/victoria_memorial.jpg"
                  alt="Victoria Memorial Kolkata - Civic Heritage"
                  fill
                  className="object-cover object-center"
                  priority
                />
                {/* Smooth left gradient overlay matching the reference screenshot */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/20 to-transparent lg:hidden" />
                <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-slate-950/70 to-transparent p-6 flex flex-col justify-end text-white">
                  <span className="text-xs font-bold tracking-wider uppercase text-blue-300">
                    City Heritage & Infrastructure
                  </span>
                  <p className="text-sm font-semibold text-white/90 mt-0.5">
                    Kolkata Municipal Corporation Jurisdictions
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 2. City Infrastructure Impact Telemetry */}
        <section className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
              <div className="pt-4 md:pt-0">
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">144</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-400 mt-1">Wards Connected</div>
              </div>
              <div className="pt-4 md:pt-0">
                <div className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">89.4%</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-400 mt-1">Resolution Rate</div>
              </div>
              <div className="pt-4 md:pt-0">
                <div className="text-3xl sm:text-4xl font-black text-blue-400 tracking-tight">14.2h</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-400 mt-1">Average SLA Response</div>
              </div>
              <div className="pt-4 md:pt-0">
                <div className="text-3xl sm:text-4xl font-black text-amber-400 tracking-tight">50,000+</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-400 mt-1">Active Citizens</div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. The 4-Step Civic Loop (How It Works) */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              The Civic Loop
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
              From Complaint to Verified Resolution
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-2">
              A transparent, closed-loop process ensuring every reported civic issue reaches field action.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div
                key={s.step}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all relative group"
              >
                <div className="text-3xl font-black text-blue-600/20 group-hover:text-blue-600/40 transition-colors">
                  {s.step}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-2">
                  {s.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Our Mission & Values */}
        <section className="bg-white border-y border-slate-100 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Our Purpose
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Bridging the Gap Between Citizens & Governance
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Historically, civic complaints got lost in bureaucracy, paper files, or unregistered phone calls. Citizens felt unheard while municipal officers struggled with unverified reports.
              </p>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Civic साथी replaces guesswork with cutting-edge 3D geospatial maps, photo evidence, automated ward boundaries, and public audit trails. Every road repair, broken lamp, and water pipe fix is accounted for.
              </p>
              <div className="pt-2 flex items-center gap-6 text-sm font-bold text-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span> 100% Open Tracking
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span> Zero Red Tape
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span> Direct Ward Routing
                </div>
              </div>
            </div>

            {/* Visual Quote / Testimonial Box */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-8 rounded-3xl border border-blue-100 space-y-4 shadow-sm">
              <span className="text-4xl text-blue-500 font-serif leading-none block">&ldquo;</span>
              <p className="text-base sm:text-lg text-slate-800 font-medium italic leading-relaxed">
                A city is not measured by the height of its buildings, but by how quickly it listens and responds when a citizen flags a cracked road or a broken pipe.
              </p>
              <div className="pt-2 border-t border-blue-200/50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                  CS
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">Civic साथी Mission Board</div>
                  <div className="text-xs text-slate-500">Kolkata Municipal Collaboration</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Call To Action Footer Banner */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Be the Change in Your Neighborhood
          </h2>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
            Take 30 seconds to report an issue on your street and track its resolution in real time.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/user"
              className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all"
            >
              Report an Issue
            </Link>
            <Link
              href="/login"
              className="px-8 py-3.5 rounded-xl border border-slate-300 hover:bg-white text-slate-700 font-semibold text-sm transition-all"
            >
              Track an Existing Ticket
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
