'use client';

import React, { useState, useCallback, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import { setWorkerUrl } from 'maplibre-gl';
import Map, { Marker, NavigationControl, Layer } from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import ofmDarkStyle from './ofm_dark.json';
import toast from 'react-hot-toast';

const WORKER_URL = 'https://unpkg.com/maplibre-gl@6.11.2/dist/maplibre-gl-worker.mjs';

if (typeof window !== 'undefined') {
  setWorkerUrl(WORKER_URL);
}

// 3D Building Extrusions from OpenMapTiles / OpenFreeMap vector layer
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
    'fill-extrusion-opacity': 0.88,
  },
};

export default function ReportLocationPicker({
  initialLng = 88.351286,
  initialLat = 22.563282,
  onLocationChange,
}) {
  const mapRef = useRef(null);
  const [markerCoords, setMarkerCoords] = useState({
    lng: initialLng,
    lat: initialLat,
  });
  const [isLocating, setIsLocating] = useState(false);
  const [is3D, setIs3D] = useState(true);

  // Preset civic landmarks in Kolkata
  const presets = [
    { name: 'BBD Bagh', ward: 'Ward 8', lng: 88.351286, lat: 22.563282 },
    { name: 'Esplanade', ward: 'Ward 11', lng: 88.3638, lat: 22.5715 },
    { name: 'Park Street', ward: 'Ward 7', lng: 88.355, lat: 22.549 },
    { name: 'Shyambazar', ward: 'Ward 5', lng: 88.372, lat: 22.595 },
  ];

  const updateLocation = useCallback(
    (lng, lat, wardName, landmark) => {
      setMarkerCoords({ lng, lat });
      if (onLocationChange) {
        onLocationChange({
          lng: Number(lng.toFixed(6)),
          lat: Number(lat.toFixed(6)),
          coordinates: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          ward: wardName || 'Ward 8',
          street: landmark || 'Selected Point on Map',
        });
      }
    },
    [onLocationChange]
  );

  const toggle3D = () => {
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();
    if (is3D) {
      map.easeTo({ pitch: 0, bearing: 0, duration: 800 });
      setIs3D(false);
    } else {
      map.easeTo({ pitch: 55, bearing: -16, zoom: 14.5, duration: 800 });
      setIs3D(true);
    }
  };

  // Handle map click to place pin
  const handleMapClick = useCallback(
    (e) => {
      const { lng, lat } = e.lngLat;
      updateLocation(lng, lat);
      toast.success(`Pin moved to ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    },
    [updateLocation]
  );

  // Handle marker drag
  const handleMarkerDragEnd = useCallback(
    (e) => {
      const { lng, lat } = e.lngLat;
      updateLocation(lng, lat);
      toast.success(`Coordinates set to ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    },
    [updateLocation]
  );

  // GPS Current Location
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { longitude, latitude } = pos.coords;
        updateLocation(longitude, latitude, 'Local Ward', 'Current GPS Position');
        if (mapRef.current) {
          mapRef.current.flyTo({
            center: [longitude, latitude],
            zoom: 15,
            pitch: 55,
            duration: 1200,
          });
        }
        setIsLocating(false);
        toast.success('Your live location has been pinned on the 3D map!');
      },
      (err) => {
        setIsLocating(false);
        toast.error('Could not retrieve current location: ' + err.message);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleSelectPreset = (preset) => {
    updateLocation(preset.lng, preset.lat, preset.ward, preset.name);
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [preset.lng, preset.lat],
        zoom: 14.5,
        pitch: is3D ? 55 : 0,
        bearing: is3D ? -16 : 0,
        duration: 1000,
      });
    }
  };

  return (
    <div className="space-y-3 w-full">
      {/* Map Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
          <span>Click anywhere in 3D city space or drag pin to set coordinates</span>
        </div>

        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-70"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm0-11a3 3 0 100 6 3 3 0 000-6z" />
          </svg>
          <span>{isLocating ? 'Locating...' : 'Use Current GPS'}</span>
        </button>
      </div>

      {/* Preset Landmark Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-semibold text-slate-400 shrink-0">Popular Wards:</span>
        {presets.map((preset) => (
          <button
            key={preset.name}
            type="button"
            onClick={() => handleSelectPreset(preset)}
            className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 text-slate-700 font-medium text-[11px] whitespace-nowrap transition-colors cursor-pointer"
          >
            {preset.name} ({preset.ward})
          </button>
        ))}
      </div>

      {/* Interactive 3D Map Container */}
      <div className="relative w-full h-[300px] sm:h-[350px] rounded-2xl overflow-hidden bg-slate-900 border border-slate-700/60 shadow-inner">
        {/* 2D / 3D Toggle button */}
        <div className="absolute top-3 left-3 z-10">
          <button
            type="button"
            onClick={toggle3D}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/85 backdrop-blur-md border border-slate-700/80 text-[11px] font-semibold text-white shadow-lg hover:bg-slate-800 transition-all cursor-pointer"
            title="Toggle 3D Perspective / 2D Top-down"
          >
            <span className={`w-2 h-2 rounded-full ${is3D ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} />
            {is3D ? '3D View' : '2D View'}
          </button>
        </div>

        <Map
          ref={mapRef}
          mapLib={maplibregl}
          workerUrl={WORKER_URL}
          initialViewState={{
            longitude: markerCoords.lng,
            latitude: markerCoords.lat,
            zoom: 14.2,
            pitch: 55,
            bearing: -16,
          }}
          maxPitch={85}
          onClick={handleMapClick}
          style={{ width: '100%', height: '100%' }}
          mapStyle={ofmDarkStyle}
          attributionControl={false}
          cursor="crosshair"
        >
          <NavigationControl position="top-right" showCompass={true} visualizePitch={true} />

          {/* 3D Buildings Extrusion Layer */}
          <Layer {...building3DLayer} />

          {/* Draggable Teardrop Marker */}
          <Marker
            longitude={markerCoords.lng}
            latitude={markerCoords.lat}
            draggable
            onDragEnd={handleMarkerDragEnd}
            anchor="bottom"
          >
            <div className="relative cursor-grab active:cursor-grabbing group/pin">
              {/* Radar pulse around marker */}
              <span className="absolute -inset-2 rounded-full animate-ping bg-blue-500 opacity-40 pointer-events-none" />

              {/* Pin SVG */}
              <div className="relative transform transition-transform duration-150 hover:scale-125 filter drop-shadow-xl">
                <svg
                  width="32"
                  height="42"
                  viewBox="0 0 30 38"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 0C6.716 0 0 6.716 0 15c0 10.5 15 23 15 23s15-12.5 15-23c0-8.284-6.716-15-15-15z"
                    fill="#2563EB"
                  />
                  <circle cx="15" cy="14" r="5.5" fill="#FFFFFF" />
                </svg>
              </div>

              {/* Coordinate tooltip */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-slate-950/90 text-[10px] text-white font-mono px-2 py-0.5 rounded shadow pointer-events-none whitespace-nowrap">
                {markerCoords.lat.toFixed(4)}, {markerCoords.lng.toFixed(4)}
              </div>
            </div>
          </Marker>
        </Map>

        {/* Live Coordinate Badge in Bottom Left */}
        <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-xl shadow-lg pointer-events-none">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">3D Pinned Location</div>
          <div className="text-xs font-mono font-semibold text-emerald-400">
            {markerCoords.lat.toFixed(6)}, {markerCoords.lng.toFixed(6)}
          </div>
        </div>
      </div>
    </div>
  );
}
