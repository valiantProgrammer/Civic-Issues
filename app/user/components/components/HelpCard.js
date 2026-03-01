"use client";

import Help from "@/app/components/Help";

export default function HelpCard() {
  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-6">
        <h2 className="text-3xl font-bold text-white">Help Page</h2>
        <p className="text-white/80 mt-2">This is a placeholder help page. Here you can provide information about how to use the civic issues reporting system.</p>
      </div>
        <Help />
    </div>
  );
}
