'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link'; // 1. Imported the Link component for the modal

// SVG Menu Icon component
const MenuIcon = () => (
  <svg className="w-[7vw] h-[7vw] md:w-[2.5vw] md:h-[2.5vw] text-gray-800" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

// Close Icon component
const CloseIcon = () => (
  <svg className="w-[7vw] h-[7vw] md:w-[2.5vw] md:h-[2.5vw] text-gray-800" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Header = () => {
  // State to manage the menu's open/closed status
  const [isOpen, setIsOpen] = useState(false);
  // 2. Added new state to manage the login modal's visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // 3. New handler for the Login button
  const handleLoginClick = () => {
    setIsOpen(false); // First, close the slide-out menu
    setIsModalOpen(true); // Then, open the modal
  };

  // Function to handle smooth scrolling for other nav links
  const handleSmoothScroll = (e) => {
    e.preventDefault();

    const href = e.currentTarget.getAttribute('href');
    if (!href) return;

    const targetId = href.substring(href.indexOf('#') + 1);

    // Close the menu after clicking a link
    setIsOpen(false);

    if (!targetId || href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const elem = document.getElementById(targetId);
    const header = document.getElementById('main-header');

    if (elem && header) {
      const headerOffset = header.offsetHeight;
      const elementPosition = elem.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    } else if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };


  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Interactive Features', href: '#features' },
    { name: 'How to Use', href: '#how' },
    { name: 'Contact Us', href: '#contact' },
    // { name: 'Contact Manager', href: '/contact/page.js' },
  ];

  return (
    <>
      <header id="main-header" className="flex items-center justify-between p-[4vw] md:p-[2vw] bg-white sticky top-0 z-50 shadow-sm">
        <a href="#" onClick={handleSmoothScroll} className="flex items-center">
          <div className="flex items-center gap-[3vw] md:gap-[1vw]">
            <Image
              src="/images/logo.png"
              alt="Civic Saathi Logo"
              width={100}
              height={100}
              className="w-[12vw] h-[12vw] md:w-[3.5vw] md:h-[3.5vw]"
            />
            <span className="text-[6vw] md:text-[2vw] font-extrabold text-gray-800">Civic साथी</span>
          </div>
        </a>

        <button onClick={toggleMenu} aria-label="Toggle menu" className="z-[60] relative h-8 w-8">
          <span className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${isOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`}>
            <MenuIcon />
          </span>
          <span className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${isOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`}>
            <CloseIcon />
          </span>
        </button>
      </header>

      {/* Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleMenu}
      ></div>

      {/* Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Menu</h2>
          <button onClick={toggleMenu} aria-label="Close menu" className="text-gray-500 hover:text-gray-900 transition-colors">
            <CloseIcon />
          </button>
        </div>
        <div className="flex-grow p-6 flex flex-col">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                onClick={handleSmoothScroll}
                className={`block py-3 px-4 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-purple-600 text-lg font-semibold transition-all duration-300 transform ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                style={{ transitionDelay: `${150 + index * 75}ms `}}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* 4. MODIFIED Login Button */}
          <div className="mt-auto">
            <button
              type="button"
              onClick={handleLoginClick} // Changed from handleSmoothScroll
              className={`w-full text-center py-4 px-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-300 transform flex items-center justify-center gap-2 shadow-lg hover:shadow-xl ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
            >
              <span>Login</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>

        {/* 5. ADDED Login Modal (copied from Hero.js) */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-[90vw] max-w-md text-center relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                aria-label="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Log in as?</h2>
              <div className="space-y-4">
                <Link href="/login/user" className="block w-full text-center py-3 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition">
                  User
                </Link>
                <Link href="/login/admin" className="block w-full text-center py-3 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition">
                  Admin
                </Link>
                <Link href="/login/administration" className="block w-full text-center py-3 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition">
                  Administrator
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>);
};

export default Header;