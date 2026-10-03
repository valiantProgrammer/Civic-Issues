'use client';

import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CivicPulseSection from '../components/CivicPulseSection';

export default function CivicPulsePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        <CivicPulseSection currentLang="en" />
      </main>
      <Footer />
    </div>
  );
}
