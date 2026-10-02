'use client';

import React from 'react';

export default function AboutSection({ currentLang }) {
  const content = {
    en: {
      badge: 'Our Mission',
      title: 'Bridging Citizens & Municipal Authorities',
      p1: 'Every day, citizens walk past potholes, flickering streetlights, or overflowing waste bins — small everyday issues that compound into major disruptions. Most often, we notice them, shake our heads, and wonder who to call.',
      p2: 'Civic साथी transforms this reality. With AI-assisted location tagging and photo evidence, any citizen can report an issue in seconds. We route every report directly to the concerned municipal department, track every step transparently, and verify resolutions on the ground.',
      pillar1Title: 'For Citizens',
      pillar1Desc: 'Real voice, zero red tape, and verifiable live updates directly on your smartphone.',
      pillar2Title: 'For Ward Admins',
      pillar2Desc: 'Structured triage, deduplication, and automated routing to on-ground work crews.',
      pillar3Title: 'For City Leaders',
      pillar3Desc: 'Data-driven infrastructure planning, heatmaps, and accountability across all departments.',
    },
    hi: {
      badge: 'हमारा उद्देश्य',
      title: 'नागरिकों और नगर निगम के बीच सीधा सेतु',
      p1: 'हर दिन, नागरिक गड्ढों, खराब स्ट्रीट लाइटों या कचरे के ढेरों के पास से गुजरते हैं। अक्सर हम सोचते हैं कि इन्हें ठीक करने के लिए किससे संपर्क करें।',
      p2: 'Civic साथी इस व्यवस्था को बदलता है। एआई-सक्षम लोकेशन और फोटो साक्ष्य के साथ, कोई भी नागरिक सेकंडों में समस्या दर्ज कर सकता है। हर रिपोर्ट सीधे संबंधित विभाग तक पहुंचाई जाती है और समाधान को सत्यापित किया जाता है।',
      pillar1Title: 'नागरिकों के लिए',
      pillar1Desc: 'बिना किसी परेशानी के अपनी आवाज़ उठाएं और सीधे स्मार्टफोन पर प्रगति ट्रैक करें।',
      pillar2Title: 'वार्ड एडमिन के लिए',
      pillar2Desc: 'समस्याओं का व्यवस्थित सत्यापन और ऑन-ग्राउंड टीमों को त्वरित कार्य सौंपना।',
      pillar3Title: 'शहर प्रशासकों के लिए',
      pillar3Desc: 'डेटा-संचालित योजना, हीटमैप और सभी विभागों में जवाबदेही।',
    },
  };

  const t = content[currentLang] || content.en;

  return (
    <section id="about" className="py-14 lg:py-20 bg-slate-50/70 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mb-12 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 text-blue-700 text-xs font-semibold mb-3">
            {t.badge}
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold tracking-tight text-slate-900 leading-tight">
            {t.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            {t.p1}
          </p>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            {t.p2}
          </p>
        </div>

        {/* 3 Pillars Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-7 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg mb-5">
              👥
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {t.pillar1Title}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              {t.pillar1Desc}
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg mb-5">
              🛡️
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {t.pillar2Title}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              {t.pillar2Desc}
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg mb-5">
              🏛️
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {t.pillar3Title}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              {t.pillar3Desc}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
