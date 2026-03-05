'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Icon Component ---
const CloseIcon = ({ size = 24, strokeWidth = 2.5 }) => ( <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> );

/**
 * A self-contained 360-degree panoramic image viewer component with image view mode.
 * It dynamically loads the Pannellum library and its CSS from a CDN.
 * Supports both panorama and image viewing with settings panel.
 * @param {object} props - Component props.
 * @param {boolean} props.isOpen - Whether the viewer modal is open.
 * @param {string} props.imageUrl - The URL of the 360-degree panoramic image.
 * @param {function} props.onClose - Function to call when the modal should be closed.
 */
const PanoramicViewer = ({ isOpen, imageUrl, onClose }) => {
    const panoramaRef = useRef(null);
    const imageContainerRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPannellumLoaded, setIsPannellumLoaded] = useState(false);
    const [viewMode, setViewMode] = useState("pano");
    const [imageZoom, setImageZoom] = useState(100);
    const [isDraggingImage, setIsDraggingImage] = useState(false);
    const imageOffsetRef = useRef({ x: 0, y: 0 });
    const dragStartRef = useRef({ x: 0, y: 0 });
    const dragStartOffsetRef = useRef({ x: 0, y: 0 });
    const [showSettings, setShowSettings] = useState(false);
    const [cursorSpeed, setCursorSpeed] = useState(1);
    const [zoomSpeed, setZoomSpeed] = useState(1);
    const [gearRotation, setGearRotation] = useState(0);

    // Effect to load Pannellum JS and CSS from CDN.
    // This avoids needing to install the library as a package.
    useEffect(() => {
        if (window.pannellum) {
            setIsPannellumLoaded(true);
            return;
        }

        const pannellumCss = document.createElement('link');
        pannellumCss.rel = "stylesheet";
        pannellumCss.href = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css";
        document.head.appendChild(pannellumCss);

        const pannellumScript = document.createElement('script');
        pannellumScript.src = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js";
        pannellumScript.async = true;
        pannellumScript.onload = () => setIsPannellumLoaded(true);
        document.body.appendChild(pannellumScript);

        return () => {
            if (document.head.contains(pannellumCss)) {
                document.head.removeChild(pannellumCss);
            }
            if (document.body.contains(pannellumScript)) {
                document.body.removeChild(pannellumScript);
            }
        };
    }, []);

    const handleImageMouseDown = (e) => {
        if (viewMode !== "image") return;
        setIsDraggingImage(true);
        dragStartRef.current = { x: e.clientX, y: e.clientY };
        dragStartOffsetRef.current = { x: imageOffsetRef.current.x, y: imageOffsetRef.current.y };
    };

    const handleImageMouseMove = (e) => {
        if (!isDraggingImage || viewMode !== "image" || !imageContainerRef.current) return;
        const deltaX = e.clientX - dragStartRef.current.x;
        const deltaY = e.clientY - dragStartRef.current.y;
        const newX = dragStartOffsetRef.current.x + deltaX;
        const newY = dragStartOffsetRef.current.y + deltaY;
        imageOffsetRef.current = { x: newX, y: newY };
        imageContainerRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
    };

    const handleImageMouseUp = () => {
        setIsDraggingImage(false);
    };

    const handleImageWheel = (e) => {
        if (viewMode !== "image") return;
        e.preventDefault();
        const zoomChange = e.deltaY < 0 ? 10 : -10;
        setImageZoom((prev) => Math.max(50, Math.min(prev + zoomChange, 300)));
    };

    useEffect(() => {
        if (imageContainerRef.current && viewMode === "image") {
            imageContainerRef.current.style.transform = `translate(${imageOffsetRef.current.x}px, ${imageOffsetRef.current.y}px)`;
        }
    }, [imageZoom, viewMode]);

    // Effect to initialize the Pannellum viewer once the library is loaded and the modal is open.
    useEffect(() => {
        if (isOpen && isPannellumLoaded && imageUrl && panoramaRef.current && viewMode === "pano") {
            setIsLoading(true);
            const viewer = window.pannellum.viewer(panoramaRef.current, {
                type: "equirectangular",
                panorama: imageUrl,
                autoLoad: true,
                showZoomCtrl: true,
                showFullscreenCtrl: false,
                mouseZoom: true,
                compass: true,
            });

            // Hide loading spinner once the image is actually loaded by Pannellum
            viewer.on('load', () => {
                setIsLoading(false);
            });
            
            // Clean up the viewer instance when the component unmounts or props change
            return () => {
                viewer.destroy();
            };
        }
    }, [isOpen, imageUrl, isPannellumLoaded, viewMode]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
                    onClick={onClose}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-20 bg-gray-900/85 hover:bg-gray-800/95 border-2 border-white rounded-full p-3 transition-all shadow-lg hover:shadow-xl"
                        aria-label="Close viewer"
                        title="Close viewer"
                    >
                       <CloseIcon size={24} strokeWidth={2.5} />
                    </button>

                    {/* Settings Button - Bottom Right with SVG Icon */}
                    <button
                        onClick={() => {
                            setShowSettings(!showSettings);
                            setGearRotation(gearRotation + (showSettings ? -35 : 35));
                        }}
                        className="absolute bottom-6 right-6 z-[200] bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full font-medium transition-all shadow-lg flex items-center justify-center w-12 h-12"
                        title="Toggle Settings"
                    >
                        <img
                            src="/settings_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg"
                            alt="Settings"
                            className="w-6 h-6"
                            style={{
                                transform: `rotate(${gearRotation}deg)`,
                                transition: "transform 0.4s ease-in-out",
                            }}
                        />
                    </button>

                    {/* Settings Panel with Animation */}
                    <div
                        className={`absolute bottom-20 right-6 z-[200] bg-slate-900/95 backdrop-blur-sm text-white p-6 rounded-lg shadow-2xl w-72 border border-slate-700 transition-all duration-300 ${showSettings ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-[500px] pointer-events-none"}`}
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
                                        imageOffsetRef.current = { x: 0, y: 0 };
                                        setImageZoom(100);
                                        setShowSettings(false);
                                        setGearRotation(gearRotation - 35);
                                    }}
                                    className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-all ${viewMode === "image" ? "bg-blue-600 text-white shadow-lg" : "bg-slate-700 hover:bg-slate-600 text-slate-200"}`}
                                >
                                    📷 Image
                                </button>
                                <button
                                    onClick={() => {
                                        setViewMode("pano");
                                        imageOffsetRef.current = { x: 0, y: 0 };
                                        setImageZoom(100);
                                        setShowSettings(false);
                                        setGearRotation(gearRotation - 35);
                                    }}
                                    className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-all ${viewMode === "pano" ? "bg-blue-600 text-white shadow-lg" : "bg-slate-700 hover:bg-slate-600 text-slate-200"}`}
                                >
                                    360° Pano
                                </button>
                            </div>
                        </div>

                        {/* Cursor Speed Section - Only show for Pano mode */}
                        {viewMode === "pano" && (
                            <div className="mb-6 pb-5 border-b border-slate-700">
                                <h4 className="text-sm font-semibold text-slate-300 mb-3">🖱️ Cursor Speed</h4>
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
                                <h4 className="text-sm font-semibold text-slate-300 mb-3">🔍 Zoom Speed</h4>
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
                                <h4 className="text-sm font-semibold text-slate-300 mb-3">🔍 Image Zoom</h4>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="range"
                                        min="50"
                                        max="300"
                                        step="10"
                                        value={imageZoom}
                                        onChange={(e) => setImageZoom(parseFloat(e.target.value))}
                                        className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                    <span className="text-sm font-medium bg-slate-800 px-2 py-1 rounded min-w-16 text-center">
                                        {imageZoom}%
                                    </span>
                                </div>
                                <div className="flex gap-2 mt-3">
                                    <button
                                        onClick={() => setImageZoom((prev) => Math.max(prev - 10, 50))}
                                        className="flex-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded transition-all"
                                    >
                                        🔍 Out
                                    </button>
                                    <button
                                        onClick={() => setImageZoom(100)}
                                        className="flex-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded transition-all"
                                    >
                                        ↺ Reset
                                    </button>
                                    <button
                                        onClick={() => setImageZoom((prev) => Math.min(prev + 10, 300))}
                                        className="flex-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded transition-all"
                                    >
                                        🔍 In
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Overlay to close settings on click outside */}
                    {showSettings && (
                        <div
                            className="absolute inset-0 z-[190]"
                            onClick={() => {
                                setShowSettings(false);
                                setGearRotation(gearRotation - 35);
                            }}
                        />
                    )}

                    {/* Loading Indicator */}
                    {isLoading && viewMode === "pano" && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <div className="text-white text-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mx-auto mb-3"></div>
                                <p>Loading 360° View...</p>
                            </div>
                        </div>
                    )}

                    {/* Image View */}
                    {viewMode === "image" && (
                        <div
                            ref={imageContainerRef}
                            className={`max-w-full max-h-full flex items-center justify-center overflow-hidden ${isDraggingImage ? "cursor-grabbing" : "cursor-grab"}`}
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={handleImageMouseDown}
                            onMouseMove={handleImageMouseMove}
                            onMouseUp={handleImageMouseUp}
                            onMouseLeave={handleImageMouseUp}
                            onWheel={handleImageWheel}
                            style={{
                                transformOrigin: "center center",
                            }}
                        >
                            <img
                                src={imageUrl}
                                alt="Full view"
                                className="max-w-full max-h-full object-contain select-none pointer-events-none"
                                style={{
                                    transform: `scale(${imageZoom / 100})`,
                                }}
                                draggable="false"
                            />
                        </div>
                    )}

                    {/* Panorama Container */}
                    {viewMode === "pano" && (
                        <div
                            ref={panoramaRef}
                            style={{ width: '100vw', height: '100vh', visibility: isLoading ? 'hidden' : 'visible' }}
                            onClick={(e) => e.stopPropagation()}
                        />
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PanoramicViewer;