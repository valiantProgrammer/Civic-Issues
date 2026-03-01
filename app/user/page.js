'use client'
import { useState } from 'react';
import ReportedIssuesSection from './components/components/ReportedIssuesSection';
import ReportDetailCard from './components/components/ReportDetailCard.js';
import FloatingAddButton from './components/components/FloatingAddButton.js';
import Navbar from './components/components/Navbar';
import Footer from './components/components/Footer';
import ProfileCard from './components/components/ProfileCard';
import ContactCard from './components/components/ContactCard';
import HelpCard from './components/components/HelpCard';

export default function Home() {
  const [reportFilter, setReportFilter] = useState('pending');
  const [activeView, setActiveView] = useState('reports'); // 'reports', 'profile', 'contact', 'help'
  const [selectedReport, setSelectedReport] = useState(null);

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
          <div className="bg-gray-50 mx-auto py-3 px-3 sm:px-4 lg:px-8 lg:py-8 mb-12">
            {activeView === 'reports' && (
              <>
                {selectedReport ? (
                  <div>
                    <ReportDetailCard 
                      report={selectedReport}
                      onClose={() => setSelectedReport(null)}
                    />
                  </div>
                ) : (
                  <div>
                    <ReportedIssuesSection 
                      filter={reportFilter}
                      onReportSelect={setSelectedReport}
                    />
                    <FloatingAddButton />
                  </div>
                )}
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
