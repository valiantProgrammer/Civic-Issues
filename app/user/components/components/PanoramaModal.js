"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// Panorama viewer built with Three.js - no external dependencies
const PanoramaContent = ({ imageUrl, containerRef, isActive, cursorSpeed = 1, zoomSpeed = 1 }) => {
  const [error, setError] = useState(null);
  const resourcesRef = useRef(null);
  const rafIdRef = useRef(null);
  const listenersRef = useRef({});
  const speedRef = useRef({ cursor: 1, zoom: 1 });

  // Update speed values in ref whenever props change
  useEffect(() => {
    speedRef.current.cursor = cursorSpeed;
    speedRef.current.zoom = zoomSpeed;
  }, [cursorSpeed, zoomSpeed]);

  useEffect(() => {
    if (!imageUrl || !containerRef.current || !isActive) {
      return;
    }

    let scene, camera, renderer, sphere, geometry, material, texture;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotation = { x: 0, y: 0 };
    let targetRotation = { x: 0, y: 0 };

    const initPanorama = async () => {
      try {
        const container = containerRef.current;
        if (!container) return;

        const width = container.clientWidth;
        const height = container.clientHeight;

        // Scene setup
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set(0, 0, 0);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0x000000, 1);
        container.appendChild(renderer.domElement);

        // Load panorama image with proper texture settings
        const textureLoader = new THREE.TextureLoader();
        texture = await new Promise((resolve, reject) => {
          textureLoader.load(
            imageUrl,
            (tex) => {
              // Optimize texture for panorama
              tex.magFilter = THREE.LinearFilter;
              tex.minFilter = THREE.LinearMipmapLinearFilter;
              resolve(tex);
            },
            undefined,
            reject
          );
        });

        // Create sphere with high resolution for smooth panorama
        // Using equirectangular mapping (standard for panorama images)
        geometry = new THREE.SphereGeometry(100, 128, 128);
        material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.BackSide, // Render inside of sphere
        });
        sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        // Store resources for cleanup
        resourcesRef.current = { geometry, material, texture, renderer };

        // Mouse drag controls
        const onMouseDown = (event) => {
          isDragging = true;
          previousMousePosition = { x: event.clientX, y: event.clientY };
        };

        const onMouseMove = (event) => {
          if (!isDragging) return;

          const deltaX = event.clientX - previousMousePosition.x;
          const deltaY = event.clientY - previousMousePosition.y;

          // Use current speed value from ref
          const speedFactor = speedRef.current.cursor;

          // Adjust rotation based on mouse movement with speed control
          targetRotation.y += (deltaX * Math.PI * speedFactor) / width;
          targetRotation.x += (deltaY * Math.PI * speedFactor) / height;

          // Clamp vertical rotation to prevent flipping
          targetRotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRotation.x));

          previousMousePosition = { x: event.clientX, y: event.clientY };
        };

        const onMouseUp = () => {
          isDragging = false;
        };

        // Wheel zoom with adjustable speed
        let zoomLevel = 1;
        const onMouseWheel = (event) => {
          event.preventDefault();
          // Use current zoom speed value from ref
          const zoomFactor = speedRef.current.zoom;
          // Scroll up (deltaY < 0) = zoom in, Scroll down (deltaY > 0) = zoom out
          zoomLevel += (event.deltaY < 0 ? 0.1 : -0.1) * zoomFactor;
          zoomLevel = Math.max(0.5, Math.min(3, zoomLevel));
          camera.fov = 75 / zoomLevel;
          camera.updateProjectionMatrix();
        };

        const handleResize = () => {
          const container = containerRef.current;
          if (!container) return;
          const newWidth = container.clientWidth;
          const newHeight = container.clientHeight;
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        };

        // Store listener references for cleanup
        listenersRef.current = {
          onMouseDown,
          onMouseMove,
          onMouseUp,
          onMouseWheel,
          handleResize,
        };

        container.addEventListener("mousedown", onMouseDown);
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
        container.addEventListener("wheel", onMouseWheel, { passive: false });
        window.addEventListener("resize", handleResize);

        // Animation loop with smooth rotation interpolation
        const animate = () => {
          if (!isActive) return;
          rafIdRef.current = requestAnimationFrame(animate);

          // Smooth interpolation for rotation
          rotation.x += (targetRotation.x - rotation.x) * 0.1;
          rotation.y += (targetRotation.y - rotation.y) * 0.1;

          // Apply rotation to camera using Euler angles
          camera.rotation.order = "YXZ";
          camera.rotation.y = rotation.y;
          camera.rotation.x = rotation.x;

          renderer.render(scene, camera);
        };

        animate();
      } catch (err) {
        console.error("Failed to load panorama:", err);
        setError(err.message || "Failed to load panorama image");
      }
    };

    initPanorama();

    return () => {
      // Cancel animation frame
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      const container = containerRef.current;
      const listeners = listenersRef.current;

      // Remove event listeners using stored references
      if (listeners.onMouseDown) {
        container?.removeEventListener("mousedown", listeners.onMouseDown);
      }
      if (listeners.onMouseMove) {
        document.removeEventListener("mousemove", listeners.onMouseMove);
      }
      if (listeners.onMouseUp) {
        document.removeEventListener("mouseup", listeners.onMouseUp);
      }
      if (listeners.onMouseWheel) {
        container?.removeEventListener("wheel", listeners.onMouseWheel);
      }
      if (listeners.handleResize) {
        window.removeEventListener("resize", listeners.handleResize);
      }

      // Safely remove DOM element
      const { renderer } = resourcesRef.current || {};
      if (renderer && container && container.contains(renderer.domElement)) {
        try {
          container.removeChild(renderer.domElement);
        } catch (e) {
          // Element may have already been removed
        }
      }

      // Dispose Three.js resources
      const { geometry, material, texture } = resourcesRef.current || {};
      geometry?.dispose();
      material?.dispose();
      texture?.dispose();
      renderer?.dispose();

      resourcesRef.current = null;
      listenersRef.current = {};
    };
  }, [imageUrl, containerRef, isActive]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  return <div ref={containerRef} className="w-full h-full" style={{ background: "#000", cursor: "grab" }} />;
};

export default function PanoramaModal({ imageUrl, onClose }) {
  const panoContainerRef = useRef(null);
  const imageContainerRef = useRef(null);
  const imgRef = useRef(null);
  const [viewMode, setViewMode] = useState("pano"); // "pano" or "image"
  const [showSettings, setShowSettings] = useState(false);
  const [cursorSpeed, setCursorSpeed] = useState(1);
  const [zoomSpeed, setZoomSpeed] = useState(1);
  const [imageZoom, setImageZoom] = useState(100);
  const [gearRotation, setGearRotation] = useState(0);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  // Use refs for smooth dragging without state updates on every mousemove
  const imageOffsetRef = useRef({ x: 0, y: 0 });
  const dragStartRef = useRef({ x: 0, y: 0 });
  const dragStartOffsetRef = useRef({ x: 0, y: 0 });

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    setGearRotation(gearRotation + (showSettings ? -35 : 35));
  };

  const closeSettings = () => {
    setShowSettings(false);
    setGearRotation(gearRotation - 35);
  };

  const handleImageZoomIn = () => {
    setImageZoom((prev) => Math.min(prev + 10, 300));
  };

  const handleImageZoomOut = () => {
    setImageZoom((prev) => Math.max(prev - 10, 50));
  };

  const handleImageZoomReset = () => {
    setImageZoom(100);
  };

  const handleImageContainerWheel = (e) => {
    if (viewMode !== "image") return;
    e.preventDefault();
    // Apply zoom speed multiplier to image zoom as well
    const speedFactor = zoomSpeed || 1;
    // Scroll up (deltaY < 0) = zoom in, Scroll down (deltaY > 0) = zoom out
    const zoomChange = (e.deltaY < 0 ? 10 : -10) * speedFactor;
    setImageZoom((prev) => Math.max(50, Math.min(prev + zoomChange, 300)));
  };

  const handleImageMouseDown = (e) => {
    if (viewMode !== "image") return;
    setIsDraggingImage(true);
    // Store raw cursor position and current offset at drag start
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    dragStartOffsetRef.current = { x: imageOffsetRef.current.x, y: imageOffsetRef.current.y };
  };

  const handleImageMouseMove = (e) => {
    if (!isDraggingImage || viewMode !== "image" || !imageContainerRef.current) return;
    // Calculate how far cursor moved since drag started
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    // Apply delta to the starting offset to get new offset
    const newX = dragStartOffsetRef.current.x + deltaX;
    const newY = dragStartOffsetRef.current.y + deltaY;
    imageOffsetRef.current = { x: newX, y: newY };
    // Pan with natural direction: drag right = pan right
    imageContainerRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
  };

  const handleImageMouseUp = () => {
    setIsDraggingImage(false);
  };

  const handleImageModeChange = () => {
    // Reset image position and offset when switching modes
    imageOffsetRef.current = { x: 0, y: 0 };
    setImageZoom(100);
  };

  // Update container transform when zoom changes to maintain panning
  useEffect(() => {
    if (imageContainerRef.current && viewMode === "image") {
      imageContainerRef.current.style.transform = `translate(${imageOffsetRef.current.x}px, ${imageOffsetRef.current.y}px)`;
    }
  }, [imageZoom, viewMode]);

  return (
    <div className="w-full cursor-grab h-full bg-black">
      <div className="fixed inset-0 flex items-center justify-center text-gray-700 backdrop-blur-xl z-100 bg-white">
        {/* Instructions - Dynamic based on view mode */}
        <div className="absolute top-4 left-4 z-10 bg-black/30 bg-opacity-75 text-white px-4 py-2 rounded-lg backdrop-blur-xl">
          <p className="text-sm">
            {viewMode === "pano" ? (
              <>
                <span className="font-medium">Click &amp; Drag:</span> Rotate view •{" "}
                <span className="font-medium">Scroll:</span> Zoom
              </>
            ) : (
              <>
                <span className="font-medium">Click &amp; Drag:</span> Move image •{" "}
                <span className="font-medium">Scroll:</span> Zoom • <span className="font-medium">Current:</span> {imageZoom}%
              </>
            )}
          </p>
        </div>

        {/* Settings Button - Bottom Right with SVG Icon */}
        <button
          onClick={toggleSettings}
          className="absolute bottom-4 right-4 z-[200] bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full font-medium transition-all shadow-lg flex items-center justify-center w-12 h-12"
          title="Toggle Settings"
          style={{
            transform: `rotate(${gearRotation}deg)`,
            transition: "transform 0.4s ease-in-out",
          }}
        >
          <img
            src="/settings_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg"
            alt="Settings"
            className="w-6 h-6"
          />
        </button>

        {/* Settings Panel with Animation */}
        <div
          className={`absolute bottom-20 right-4 z-[200] bg-slate-900/95 backdrop-blur-sm text-white p-6 rounded-lg shadow-2xl w-72 border border-slate-700 transition-all duration-300 ${showSettings
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-[500px] pointer-events-none"
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-bold mb-5 text-white">Viewer Settings</h3>

          {/* View Mode Section */}
          <div className="mb-6 pb-5 border-b border-slate-700">
            <h4 className="text-sm font-semibold text-slate-300 mb-3">View Mode</h4>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setViewMode("image");
                  handleImageModeChange();
                }}
                className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-all ${viewMode === "image"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-slate-700 hover:bg-slate-600 text-slate-200"
                  }`}
              >
                📷 Image
              </button>
              <button
                onClick={() => {
                  setViewMode("pano");
                  handleImageModeChange();
                }}
                className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-all ${viewMode === "pano"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-slate-700 hover:bg-slate-600 text-slate-200"
                  }`}
              >
                360° Pano
              </button>
            </div>
          </div>

          {/* Cursor Speed Section - Only show for Pano mode */}
          {viewMode === "pano" && (
            <div className="mb-6 pb-5 border-b border-slate-700">
              <h4 className="text-sm font-semibold text-slate-300 mb-3">
                🖱️ Cursor Speed
              </h4>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.1"
                  value={cursorSpeed}
                  onChange={(e) => setCursorSpeed(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-sm font-medium bg-slate-800 px-2 py-1 rounded min-w-12 text-center">
                  {cursorSpeed.toFixed(1)}x
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Adjust drag sensitivity for panorama rotation</p>
            </div>
          )}

          {/* Zoom Speed Section - Only show for Pano mode */}
          {viewMode === "pano" && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-slate-300 mb-3">
                🔍 Zoom Speed
              </h4>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.1"
                  value={zoomSpeed}
                  onChange={(e) => setZoomSpeed(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-sm font-medium bg-slate-800 px-2 py-1 rounded min-w-12 text-center">
                  {zoomSpeed.toFixed(1)}x
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Adjust scroll wheel zoom sensitivity</p>
            </div>
          )}

          {/* Image Zoom Section - Only show for Image mode */}
          {viewMode === "image" && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-slate-300 mb-3">
                🔍 Image Zoom
              </h4>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="50"
                  max="300"
                  step="10"
                  value={imageZoom}
                  onChange={(e) => {
                    const newZoom = parseFloat(e.target.value);
                    setImageZoom(newZoom);
                    // Update image transform with new zoom while maintaining position
                    if (imgRef.current) {
                      imgRef.current.style.transform = `translate(${imageOffsetRef.current.x}px, ${imageOffsetRef.current.y}px) scale(${newZoom / 100})`;
                    }
                  }}
                  className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-sm font-medium bg-slate-800 px-2 py-1 rounded min-w-16 text-center">
                  {imageZoom}%
                </span>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleImageZoomOut}
                  className="flex-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded transition-all"
                >
                  🔍 Zoom Out
                </button>
                <button
                  onClick={handleImageZoomReset}
                  className="flex-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded transition-all"
                >
                  ↺ Reset
                </button>
                <button
                  onClick={handleImageZoomIn}
                  className="flex-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded transition-all"
                >
                  🔍 Zoom In
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Overlay to close settings on click outside */}
        {showSettings && (
          <div
            className="absolute inset-0 z-[190]"
            onClick={closeSettings}
          />
        )}

        {imageUrl ? (
          <div className="relative w-[100%] h-[100%] bg-black shadow-lg overflow-hidden z-100">
            {/* Close button */}
            <button
              onClick={onClose}
              className="fixed top-4 right-4 rounded-full p-3 transition-all z-20 bg-gray-900/85 hover:bg-gray-800/95 border-2 border-white shadow-lg hover:shadow-xl"
              title="Close viewer"
              aria-label="Close viewer"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image View */}
            {viewMode === "image" && (
              <div
                ref={imageContainerRef}
                className={`w-full h-full flex items-center justify-center bg-black overflow-hidden ${isDraggingImage ? "cursor-grabbing" : "cursor-grab"
                  }`}
                onWheel={handleImageContainerWheel}
                onMouseDown={handleImageMouseDown}
                onMouseMove={handleImageMouseMove}
                onMouseUp={handleImageMouseUp}
                onMouseLeave={handleImageMouseUp}
                style={{
                  transformOrigin: "center center",
                }}
              >
                <img
                  ref={imgRef}
                  src={imageUrl}
                  alt="Full view"
                  className="max-w-full max-h-full object-contain select-none pointer-events-none"
                  style={{
                    transform: `scale(${imageZoom / 100})`,
                  }}
                  onError={() => setViewMode("pano")}
                  draggable="false"
                />
              </div>
            )}

            {/* Panorama View */}
            {viewMode === "pano" && (
              <PanoramaContent
                imageUrl={imageUrl}
                containerRef={panoContainerRef}
                isActive={viewMode === "pano"}
                cursorSpeed={cursorSpeed}
                zoomSpeed={zoomSpeed}
              />
            )}
          </div>
        ) : (
          <p className="text-center mt-10 text-white">No image provided</p>
        )}
      </div>
    </div>
  );
}
