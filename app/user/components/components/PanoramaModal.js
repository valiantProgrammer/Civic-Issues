"use client";

import { useEffect, useRef } from "react";

// Dynamically import Panolens (client-only)
const loadPanolens = () => import("panolens");

export default function PanoramaModal({ imageUrl, onClose }) {
  const panoContainerRef = useRef(null);

  useEffect(() => {
    if (!imageUrl) return;

    let panoViewer, panorama;

    async function initPanorama() {
      const PANOLENS = await loadPanolens();

      panorama = new PANOLENS.ImagePanorama(imageUrl);
      panoViewer = new PANOLENS.Viewer({
        container: panoContainerRef.current,
      });
      panoViewer.add(panorama);

      // Speed up rotation
      if (panoViewer.OrbitControls) {
        panoViewer.OrbitControls.rotateSpeed = -1.0; // invert drag
        panoViewer.OrbitControls.zoomSpeed = 20;   // keep zoom natural
      }

    }

    initPanorama();

    return () => {
      if (panoViewer && panoViewer.dispose) panoViewer.dispose();
    };
  }, [imageUrl]);

  return (
    <div className="w-full cursor-grab h-full bg-black">
      <div className="fixed inset-0 flex items-center justify-center text-gray-700 backdrop-blur-xl z-50 bg-white">
        {/* Instructions */}
        <div className="absolute top-4 left-4 z-10 bg-black/30 bg-opacity-75 text-white px-4 py-2 rounded-lg backdrop-blur-xl">
          <p className="text-sm">
            <span className="font-medium">Click &amp; Drag:</span> Rotate view •{" "}
            <span className="font-medium">Scroll:</span> Zoom
          </p>
        </div>

        {imageUrl ? (
          <div className="relative w-[100%] h-[100%] bg-black shadow-lg overflow-hidden">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-50 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
            >
              ✕
            </button>

            {/* Panorama container */}
            <div
              ref={panoContainerRef}
              className="w-full h-full"
              style={{ background: "#000" }}
            />
          </div>
        ) : (
          <p className="text-center mt-10 text-white">No pano image provided</p>
        )}
      </div>
    </div>
  );
}
