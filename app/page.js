"use client";

import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Features from "./components/Features";
import HowToUse from "./components/HowToUse";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="font-sans bg-gray-50 text-gray-900">
      <Header />
      <Hero />
      <About />
      <Features />
      <HowToUse />
      <Contact />
      <Footer />
    </div>
  );
}
