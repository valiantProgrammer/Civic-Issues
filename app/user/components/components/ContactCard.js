"use client";

import Contact from "@/app/components/Contact";

export default function ContactCard() {
  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-6">
        <h2 className="text-3xl font-bold text-white">Contact Manager</h2>
        <p className="text-white/80 mt-2">Get in touch with the management team</p>
      </div>
        <Contact />
    </div>
  );
}
