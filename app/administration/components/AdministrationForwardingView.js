'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function AdministrationForwardingView() {
  const [targetMuni, setTargetMuni] = useState('Howrah Municipal Corporation');
  const [targetDept, setTargetDept] = useState('Borough V - Public Works');
  const [ticketId, setTicketId] = useState('CIVIC-20261002-A72Q');
  const [notes, setNotes] = useState('');
  const [isForwarding, setIsForwarding] = useState(false);

  const [forwardHistory, setForwardHistory] = useState([
    {
      id: 'FWD-881',
      ticketId: 'CIVIC-20261001-A72Q',
      title: 'Water Leakage - Border Zone Ward 7',
      from: 'KMC Administration',
      to: 'Howrah Municipal Corporation (HMC)',
      timestamp: 'Today, 09:30 AM',
      status: 'Acknowledged',
      notes: 'Leak originates on Howrah side of pipeline bridge.',
    },
    {
      id: 'FWD-880',
      ticketId: 'CIVIC-20260930-B14K',
      title: 'Highway Road Damage near Bypass',
      from: 'KMC Administration',
      to: 'KMDA (Kolkata Metropolitan Development Authority)',
      timestamp: 'Yesterday, 04:15 PM',
      status: 'Under Review',
      notes: 'Highway section under state PWD maintenance contract.',
    },
    {
      id: 'FWD-879',
      ticketId: 'CIVIC-20260929-C55P',
      title: 'Electric Substation Transformer Sparking',
      from: 'KMC Administration',
      to: 'CESC (Calcutta Electric Supply Corporation)',
      timestamp: 'Sep 29, 11:00 AM',
      status: 'Resolved by CESC',
      notes: 'Urgent power grid intervention requested.',
    },
  ]);

  const handleForwardSubmit = (e) => {
    e.preventDefault();
    if (!ticketId.trim()) {
      toast.error('Please specify a valid Ticket ID');
      return;
    }

    setIsForwarding(true);
    setTimeout(() => {
      const newEntry = {
        id: `FWD-${Math.floor(100 + Math.random() * 900)}`,
        ticketId,
        title: `Forwarded Case ${ticketId}`,
        from: 'KMC Administration',
        to: `${targetMuni} (${targetDept})`,
        timestamp: 'Just now',
        status: 'Sent (Pending Ack)',
        notes: notes || 'Administrative transfer for jurisdictional action.',
      };

      setForwardHistory([newEntry, ...forwardHistory]);
      toast.success(`Case ${ticketId} successfully forwarded!`);
      setTicketId('');
      setNotes('');
      setIsForwarding(false);
    }, 600);
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Inter-Departmental & Municipal Forwarding
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Route jurisdictional cross-border civic cases to external municipal authorities or utility boards.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Forwarding Form (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Forward Civic Case
          </h2>

          <form onSubmit={handleForwardSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Case Ticket ID *
              </label>
              <input
                type="text"
                required
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                placeholder="e.g. CIVIC-20261002-A72Q"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm text-slate-800 font-mono font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Target Authority / Municipality *
              </label>
              <select
                value={targetMuni}
                onChange={(e) => setTargetMuni(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm text-slate-800 font-medium bg-white"
              >
                <option value="Howrah Municipal Corporation">Howrah Municipal Corporation (HMC)</option>
                <option value="Bidhannagar Municipal Corporation">Bidhannagar Municipal Corporation (BMC)</option>
                <option value="KMDA (Metropolitan Authority)">KMDA (Metropolitan Authority)</option>
                <option value="CESC Power Corporation">CESC Power Corporation</option>
                <option value="State PWD Highways">State PWD Highways</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Target Department / Unit
              </label>
              <input
                type="text"
                value={targetDept}
                onChange={(e) => setTargetDept(e.target.value)}
                placeholder="e.g. Borough V - Public Works"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm text-slate-800 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Forwarding Note / Reason
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Explain the jurisdictional handover or reason for forwarding..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm text-slate-800 font-medium resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isForwarding}
                className="w-full px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                {isForwarding ? 'Forwarding...' : 'Dispatch Handover'}
              </button>
            </div>
          </form>
        </div>

        {/* Forwarding History Log (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Forwarding Audit Trail
            </h2>
            <span className="text-xs font-semibold text-slate-400">
              {forwardHistory.length} Transferred
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {forwardHistory.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 space-y-2 hover:bg-slate-50/70 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-700">
                    {item.ticketId}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                    {item.status}
                  </span>
                </div>

                <div className="text-sm font-bold text-slate-900">
                  {item.title}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{item.from}</span>
                  <span>→</span>
                  <span className="font-semibold text-slate-800">{item.to}</span>
                </div>

                <p className="text-xs text-slate-400 italic">
                  &quot;{item.notes}&quot;
                </p>

                <div className="text-[11px] text-slate-400 pt-1">
                  Transferred {item.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
