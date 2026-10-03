'use client';

import React, { useState, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import { setWorkerUrl } from 'maplibre-gl';
import Map, { Marker, NavigationControl, Layer } from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import ofmDarkStyle from '@/app/user/components/components/ofm_dark.json';

const WORKER_URL = 'https://unpkg.com/maplibre-gl@6.11.2/dist/maplibre-gl-worker.mjs';

if (typeof window !== 'undefined') {
  setWorkerUrl(WORKER_URL);
}

// 3D Building Extrusions Layer
const building3DLayer = {
  id: '3d-buildings',
  source: 'openmaptiles',
  'source-layer': 'building',
  type: 'fill-extrusion',
  minzoom: 13,
  paint: {
    'fill-extrusion-color': [
      'interpolate',
      ['linear'],
      ['coalesce', ['get', 'render_height'], ['get', 'height'], 15],
      0, '#1e293b',
      30, '#334155',
      80, '#475569',
      150, '#64748b'
    ],
    'fill-extrusion-height': [
      'interpolate',
      ['linear'],
      ['zoom'],
      13, 0,
      13.8, ['coalesce', ['get', 'render_height'], ['get', 'height'], 15]
    ],
    'fill-extrusion-base': [
      'interpolate',
      ['linear'],
      ['zoom'],
      13, 0,
      13.8, ['coalesce', ['get', 'render_min_height'], ['get', 'min_height'], 0]
    ],
    'fill-extrusion-opacity': 0.85,
  },
};

const wardCoordinates = {
  'Ward 8': {
    name: 'Ward 8 - Park Street & Esplanade',
    lat: 22.5535,
    lng: 88.3518,
    activeIssues: 12,
    officer: 'S. Chatterjee',
    resolvedRate: '88%',
    zone: 'Borough VII',
  },
  'Ward 12': {
    name: 'Ward 12 - Salt Lake Sector 1 & Ultadanga',
    lat: 22.5867,
    lng: 88.3985,
    activeIssues: 8,
    officer: 'A. Sen',
    resolvedRate: '92%',
    zone: 'Borough III',
  },
  'Ward 5': {
    name: 'Ward 5 - Shyambazar & Hatibagan',
    lat: 22.5982,
    lng: 88.3712,
    activeIssues: 5,
    officer: 'M. Mukherjee',
    resolvedRate: '95%',
    zone: 'Borough II',
  },
  'Ward 11': {
    name: 'Ward 11 - Alipore & New Alipore',
    lat: 22.5298,
    lng: 88.3286,
    activeIssues: 7,
    officer: 'R. Bannerjee',
    resolvedRate: '90%',
    zone: 'Borough IX',
  },
};

export default function LocateWardView() {
  const [selectedWard, setSelectedWard] = useState('Ward 8');
  const mapRef = useRef(null);

  const wardInfo = wardCoordinates[selectedWard] || wardCoordinates['Ward 8'];

  const handleSelectWard = (wardKey) => {
    setSelectedWard(wardKey);
    const target = wardCoordinates[wardKey];
    if (target && mapRef.current) {
      mapRef.current.flyTo({
        center: [target.lng, target.lat],
        zoom: 15,
        pitch: 50,
        bearing: -15,
        duration: 1500,
      });
    }
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Locate Ward
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Explore municipal ward jurisdictions, 3D building density, and active civic issues.
          </p>
        </div>

        {/* Ward Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Select Ward:
          </label>
          <select
            value={selectedWard}
            onChange={(e) => handleSelectWard(e.target.value)}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B132B] font-bold text-sm text-slate-800 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            {Object.keys(wardCoordinates).map((wKey) => (
              <option key={wKey} value={wKey}>
                {wKey}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Map and Ward Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* 3D Map Viewport (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm relative aspect-[16/10] sm:aspect-[16/9]">
          <Map
            ref={mapRef}
            mapLib={maplibregl}
            initialViewState={{
              longitude: wardInfo.lng,
              latitude: wardInfo.lat,
              zoom: 15,
              pitch: 50,
              bearing: -15,
            }}
            mapStyle={ofmDarkStyle}
            style={{ width: '100%', height: '100%' }}
            maxPitch={85}
          >
            <NavigationControl position="top-right" />
            <Layer {...building3DLayer} />

            {/* Ward Center Marker */}
            <Marker longitude={wardInfo.lng} latitude={wardInfo.lat} anchor="center">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-2xl border-2 border-white ring-4 ring-blue-500/30 animate-bounce">
                📍
              </div>
            </Marker>
          </Map>

          <div className="absolute top-4 left-4 z-10 bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 text-white text-xs font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>3D Ward Buildings View</span>
          </div>
        </div>

        {/* Ward Details Card (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-[#111A2E] rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-5 transition-colors">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-100 dark:border-blue-500/20">
              {wardInfo.zone}
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-2">
              {wardInfo.name}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Lat: {wardInfo.lat.toFixed(4)}, Lng: {wardInfo.lng.toFixed(4)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 text-center">
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
                {wardInfo.activeIssues}
              </div>
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                Active Reports
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-center">
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {wardInfo.resolvedRate}
              </div>
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                Resolution Rate
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-400">Officer in Charge:</span>
              <span className="font-bold text-slate-800 dark:text-white">{wardInfo.officer}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-400">Jurisdiction:</span>
              <span className="font-bold text-slate-800 dark:text-white">KMC Central</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-400">Emergency Contact:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">1800-345-5555</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
