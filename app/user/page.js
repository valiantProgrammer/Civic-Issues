'use client'
import { useState } from 'react';
import ReportedIssuesSection from './components/components/ReportedIssuesSection';
import FloatingAddButton from './components/components/FloatingAddButton.js';
import Navbar from './components/components/Navbar';
import Footer from './components/components/Footer';
import ProfileCard from './components/components/ProfileCard';
import ContactCard from './components/components/ContactCard';
import HelpCard from './components/components/HelpCard';
export default function Home() {
  const [reportFilter, setReportFilter] = useState('pending');
  const [activeView, setActiveView] = useState('reports'); // 'reports', 'profile', 'contact'

  return (
    <div className="relative lg:flex">
      <Navbar 
        onReportFilterChange={setReportFilter}
        onProfileClick={() => setActiveView('profile')}
        onContactClick={() => setActiveView('contact')}
        onReportsClick={() => setActiveView('reports')}
        onHelpClick={() => setActiveView('help')}
      />

      <div className="flex flex-col flex-1 lg:ml-64">
        <main className="flex-1 pt-16 lg:pt-0">
          <div className="bg-gray-50 mx-auto py-3 px-3 sm:px-4 lg:px-8 lg:py-8 pb-20">
            {activeView === 'reports' && (
              <>
                <ReportedIssuesSection filter={reportFilter} />
                <FloatingAddButton />
              </>
            )}
            {activeView === 'profile' && <ProfileCard />}
            {activeView === 'contact' && <ContactCard />}
            {activeView === 'help' && <HelpCard />}
          </div>
        </main>
        <Footer />
      </div>
    </div> 
  );
}
