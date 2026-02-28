'use client'
import { useState } from 'react';
import ReportedIssuesSection from './components/components/ReportedIssuesSection';
import FloatingAddButton from './components/components/FloatingAddButton.js';
import Navbar from './components/components/Navbar';
import Footer from './components/components/Footer';

export default function Home() {
  const [reportFilter, setReportFilter] = useState('pending'); // Default filter

  return (
    <div className="relative lg:flex">
      <Navbar onReportFilterChange={setReportFilter} />

      <div className="flex flex-col flex-1 lg:ml-64">
        <main className="flex-1 pt-16 lg:pt-0">
          <div className="bg-gray-50 mx-auto px-3 sm:px-4 lg:px-8 pb-20">
            <ReportedIssuesSection filter={reportFilter} />
            <FloatingAddButton />
          </div>
        </main>
        <Footer />
      </div>
    </div> 
  );
}
