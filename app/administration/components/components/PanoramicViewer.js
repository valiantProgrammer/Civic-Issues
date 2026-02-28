'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Icon Component ---
const CloseIcon = ({ size = 24, strokeWidth = 2.5 }) => ( <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> );

/**
 * A self-contained 360-degree panoramic image viewer component.
 * It dynamically loads the Pannellum library and its CSS from a CDN.
 * @param {object} props - Component props.
 * @param {boolean} props.isOpen - Whether the viewer modal is open.
 * @param {string} props.imageUrl - The URL of the 360-degree panoramic image.
 * @param {function} props.onClose - Function to call when the modal should be closed.
 */
const PanoramicViewer = ({ isOpen, imageUrl, onClose }) => {
    const panoramaRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPannellumLoaded, setIsPannellumLoaded] = useState(false);

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

    // Effect to initialize the Pannellum viewer once the library is loaded and the modal is open.
    useEffect(() => {
        if (isOpen && isPannellumLoaded && imageUrl && panoramaRef.current) {
            setIsLoading(true);
            const viewer = window.pannellum.viewer(panoramaRef.current, {
                type: "equirectangular",
                panorama: imageUrl,
                autoLoad: true,
                showZoomCtrl: true,
                showFullscreenCtrl: false, // Hiding this to use our own modal fullscreen
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
    }, [isOpen, imageUrl, isPannellumLoaded]);

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
                        className="absolute top-4 right-4 z-20 bg-white/20 text-white rounded-full p-2 hover:bg-white/30 transition-colors"
                        aria-label="Close viewer"
                    >
                       <CloseIcon size={24} strokeWidth={2.5} />
                    </button>

                    {/* Loading Indicator */}
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <div className="text-white text-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mx-auto mb-3"></div>
                                <p>Loading 360° View...</p>
                            </div>
                        </div>
                    )}

                    {/* Pannellum Container */}
                    <div
                        ref={panoramaRef}
                        style={{ width: '100vw', height: '100vh', visibility: isLoading ? 'hidden' : 'visible' }}
                        onClick={(e) => e.stopPropagation()}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PanoramicViewer;