'use client';

import React, { useState, useRef, useMemo } from 'react';
import * as maplibregl from 'maplibre-gl';
import { setWorkerUrl } from 'maplibre-gl';
import Map, { Marker, Popup, NavigationControl, Layer } from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useTheme } from '@/app/context/ThemeContext';
import ofmDarkStyle from './ofm_dark.json';
import ofmLightStyle from './ofm_light.json';

const WORKER_URL = 'https://unpkg.com/maplibre-gl@6.11.2/dist/maplibre-gl-worker.mjs';

if (typeof window !== 'undefined') {
  setWorkerUrl(WORKER_URL);
}

export default function UserMap({ onMarkerClick }) {
  const mapRef = useRef(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const currentMapStyle = isDark ? ofmDarkStyle : ofmLightStyle;

  const [selectedPin, setSelectedPin] = useState(null);
  const [hoveredPin, setHoveredPin] = useState(null);
  const [is3D, setIs3D] = useState(true);

  // 3D Building Extrusions layer from OpenMapTiles vector data with theme-adaptive colors
  const building3DLayer = useMemo(() => ({
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
        0, isDark ? '#1e293b' : '#e2e8f0',
        30, isDark ? '#334155' : '#cbd5e1',
        80, isDark ? '#475569' : '#94a3b8',
        150, isDark ? '#64748b' : '#64748b'
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
      'fill-extrusion-opacity': isDark ? 0.88 : 0.72,
    },
  }), [isDark]);

  const toggle3D = () => {
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();
    if (is3D) {
      map.easeTo({ pitch: 0, bearing: 0, duration: 800 });
      setIs3D(false);
    } else {
      map.easeTo({ pitch: 55, bearing: -18, zoom: 13.8, duration: 800 });
      setIs3D(true);
    }
  };

  // Markers representing the user's reports matching the dashboard
  const reportPins = [
    {
      id: 'CIVIC-20260928-A72F',
      title: 'Street Light Failure',
      ward: 'Ward 8',
      status: 'Verified',
      statusColor: '#10B981',
      color: '#F59E0B',
      coords: [88.351286, 22.563282], // [lng, lat]
    },
    {
      id: 'CIVIC-20260926-D19K',
      title: 'Road Damage',
      ward: 'Ward 11',
      status: 'In Progress',
      statusColor: '#F59E0B',
      color: '#EF4444',
      coords: [88.3638, 22.5715],
      pulse: true,
    },
    {
      id: 'CIVIC-20260920-P91K',
      title: 'Garbage Not Collected',
      ward: 'Ward 5',
      status: 'Resolved',
      statusColor: '#10B981',
      color: '#10B981',
      coords: [88.3395, 22.5582],
    },
    {
      id: 'CIVIC-20260915-W03',
      title: 'Water Leakage',
      ward: 'Ward 3',
      status: 'Open',
      statusColor: '#0EA5E9',
      color: '#2563EB',
      coords: [88.3450, 22.5780],
    },
    {
      id: 'CIVIC-20260912-W09',
      title: 'Waste Overflow',
      ward: 'Ward 9',
      status: 'Verified',
      statusColor: '#10B981',
      color: '#10B981',
      coords: [88.3720, 22.5650],
    },
    {
      id: 'CIVIC-20260908-W07',
      title: 'Open Drain Safety',
      ward: 'Ward 7',
      status: 'Open',
      statusColor: '#EF4444',
      color: '#EA580C',
      coords: [88.3550, 22.5490],
    },
    {
      id: 'CIVIC-20260905-W02',
      title: 'Footpath Blocked',
      ward: 'Ward 2',
      status: 'Open',
      statusColor: '#F59E0B',
      color: '#F59E0B',
      coords: [88.3320, 22.5420],
    },
  ];

  const activePopupPin = hoveredPin || selectedPin;

  return (
    <div className="relative w-full h-full min-h-[250px] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors">
      {/* 2D / 3D Toggle button */}
      <div className="absolute top-3 left-3 z-10">
        <button
          onClick={toggle3D}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/90 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200 dark:border-slate-700/80 text-[11px] font-semibold text-slate-800 dark:text-white shadow-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
          title="Toggle 3D Perspective / 2D Top-down"
        >
          <span className={`w-2 h-2 rounded-full ${is3D ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
          {is3D ? '3D View' : '2D View'}
        </button>
      </div>

      <Map
        ref={mapRef}
        mapLib={maplibregl}
        workerUrl={WORKER_URL}
        initialViewState={{
          longitude: 88.354,
          latitude: 22.562,
          zoom: 13.4,
          pitch: 52,
          bearing: -16,
        }}
        maxPitch={85}
        style={{ width: '100%', height: '100%', minHeight: '250px' }}
        mapStyle={currentMapStyle}
        attributionControl={false}
      >
        <NavigationControl position="top-right" showCompass={true} visualizePitch={true} />

        {/* 3D Buildings Extrusion Layer */}
        <Layer {...building3DLayer} />

        {/* Render styled teardrop pins with @vis.gl/react-maplibre Marker */}
        {reportPins.map((pin) => (
          <Marker
            key={pin.id}
            longitude={pin.coords[0]}
            latitude={pin.coords[1]}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelectedPin(pin);
              if (onMarkerClick) onMarkerClick(pin);
            }}
          >
            <div
              className="relative cursor-pointer group/pin"
              onMouseEnter={() => setHoveredPin(pin)}
              onMouseLeave={() => setHoveredPin(null)}
            >
              {/* Optional pulse ring */}
              {pin.pulse && (
                <span
                  className="absolute -inset-1 rounded-full animate-ping opacity-50"
                  style={{ backgroundColor: pin.color }}
                />
              )}

              {/* Pin Teardrop Shape */}
              <div className="relative transition-transform duration-200 hover:scale-125 filter drop-shadow-md">
                <svg
                  width="26"
                  height="34"
                  viewBox="0 0 30 38"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 0C6.716 0 0 6.716 0 15c0 10.5 15 23 15 23s15-12.5 15-23c0-8.284-6.716-15-15-15z"
                    fill={pin.color}
                  />
                  <circle cx="15" cy="14" r="5.5" fill="#FFFFFF" />
                </svg>
              </div>
            </div>
          </Marker>
        ))}

        {/* Popup for hovered/selected pin */}
        {activePopupPin && (
          <Popup
            longitude={activePopupPin.coords[0]}
            latitude={activePopupPin.coords[1]}
            anchor="top"
            closeButton={false}
            offset={14}
            className="rounded-xl overflow-hidden"
          >
            <div className="p-2 text-left bg-white dark:bg-[#111A2E] rounded-lg min-w-[140px] border border-slate-100 dark:border-slate-800 shadow-lg">
              <div className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                {activePopupPin.title}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-1">
                {activePopupPin.ward} • {activePopupPin.id}
              </div>
              <div
                className="text-[10px] font-bold mt-1.5"
                style={{ color: activePopupPin.statusColor }}
              >
                ● {activePopupPin.status}
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
