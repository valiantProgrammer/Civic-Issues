"use client";

import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import HowCivicWorks from "./components/HowCivicWorks";
import ExploreSection from "./components/ExploreSection";
import CivicPulseSection from "./components/CivicPulseSection";
import AboutSection from "./components/AboutSection";
import Footer from "./components/Footer";
import RoleModal from "./components/RoleModal";

export default function Home() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Select Portal");
  const [currentLang, setCurrentLang] = useState("en");

  const handleOpenLogin = () => {
    setModalTitle(currentLang === "hi" ? "लॉग इन पोर्टल चुनें" : "Select Login Portal");
    setIsLoginModalOpen(true);
  };

  const handleOpenReport = () => {
    setModalTitle(currentLang === "hi" ? "समस्या दर्ज करने के लिए पोर्टल चुनें" : "Report Issue Portal");
    setIsLoginModalOpen(true);
  };

  const toggleLanguage = () => {
    setCurrentLang((prev) => (prev === "en" ? "hi" : "en"));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#080D1A] text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-100 dark:selection:bg-blue-900/40 selection:text-blue-900 dark:selection:text-blue-200 transition-colors duration-200">
      {/* Navigation Header */}
      <Header
        onOpenLogin={handleOpenLogin}
        onOpenReport={handleOpenReport}
        currentLang={currentLang}
        onToggleLang={toggleLanguage}
      />

      <main>
        {/* Hero Section matching the exact design */}
        <Hero
          onOpenLogin={handleOpenLogin}
          onOpenReport={handleOpenReport}
          currentLang={currentLang}
        />

        {/* How Civic साथी Works 4-Step Process Section */}
        <HowCivicWorks currentLang={currentLang} />

        {/* Live Community Issues Explorer */}
        <ExploreSection
          onOpenReport={handleOpenReport}
          currentLang={currentLang}
        />

        {/* City-wide Impact & Civic Pulse Metrics */}
        <CivicPulseSection currentLang={currentLang} />

        {/* About Civic साथी Mission */}
        <AboutSection currentLang={currentLang} />
      </main>

      {/* Modern Light Footer */}
      <Footer currentLang={currentLang} />

      {/* Role Selection Modal for Citizens & Administrators */}
      <RoleModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title={modalTitle}
        currentLang={currentLang}
      />
    </div>
  );
}
