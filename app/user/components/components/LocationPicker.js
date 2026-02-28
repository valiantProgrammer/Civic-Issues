'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * A reusable map component for picking a location using the Mappls GL JS SDK.
 * @param {function} onLocationChange - A callback function that receives the updated location data.
 * @param {object} [initialCenter] - Optional. An object with {lat, lng} to set the initial map center.
 */
export default function LocationPicker({ onLocationChange, initialCenter }) {
    const mapInstanceRef = useRef(null);
    const markerInstanceRef = useRef(null);

    const [isMapLoading, setIsMapLoading] = useState(true);
    const [isAddressLoading, setIsAddressLoading] = useState(false);
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);

    // --- NEW: State for the search functionality ---
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Calls your local API to get address details from coordinates
    const reverseGeocodeMappls = async (lat, lng) => {
        setIsAddressLoading(true);
        const url = `/api/geocode?lat=${lat}&lng=${lng}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Reverse geocoding request failed");
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            return {
                house: data.house || '',
                street: data.street || '',
                locality: data.locality || '',
                propertyType: data.propertyType || 'Unknown'
            };
        } catch (error) {
            console.error('Local geocode fetch error:', error);
            return { house: 'Error', street: 'Could not fetch address', locality: '', propertyType: 'Error' };
        } finally {
            setIsAddressLoading(false);
        }
    };

    // --- NEW: useEffect for debounced search ---
    useEffect(() => {
        if (searchQuery.trim().length < 3) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        const handler = setTimeout(() => {
            const fetchResults = async () => {
                try {
                    const response = await fetch(`/api/search-location?query=${searchQuery}`);
                    if (!response.ok) throw new Error('Search request failed');
                    const data = await response.json();
                    setSearchResults(data);
                } catch (error) {
                    console.error("Search failed:", error);
                    setSearchResults([]);
                } finally {
                    setIsSearching(false);
                }
            };
            fetchResults();
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);


    // Initializes the map
    // Initializes the map
    useEffect(() => {
        const parseInitialCenter = (center) => {
            const defaultCenter = { lat: 22.5726, lng: 88.3639 }; // Default to Kolkata
            if (!center) return defaultCenter;

            if (typeof center === 'object' && typeof center.lat === 'number' && typeof center.lng === 'number') {
                return center;
            }
            if (typeof center === 'string') {
                const parts = center.split(',');
                if (parts.length === 2) {
                    const lat = parseFloat(parts[0].trim());
                    const lng = parseFloat(parts[1].trim());
                    if (!isNaN(lat) && !isNaN(lng)) {
                        return { lat, lng };
                    }
                }
            }
            console.warn("Invalid initialCenter prop format. Using default.", center);
            return defaultCenter;
        };

        const initialCoords = parseInitialCenter(initialCenter);

        const initInterval = setInterval(() => {
            if (window.mappls && window.mappls.Map && document.getElementById('map-container')) {
                clearInterval(initInterval);

                try {
                    window.mappls.key = process.env.NEXT_PUBLIC_MAPMYINDIA_MAP_KEY;

                    const map = new window.mappls.Map('map-container', {
                        // --- THIS LINE IS THE FIX ---
                        // The constructor specifically requires the [latitude, longitude] format.
                        center: [initialCoords.lat, initialCoords.lng],
                        zoomControl: true,
                        location: true,
                    });

                    mapInstanceRef.current = map;

                    map.addListener('load', function () {
                        setIsMapLoading(false);
                        const marker = new window.mappls.Marker({
                            map: map,
                            position: initialCoords,
                            draggable: true
                        });
                        markerInstanceRef.current = marker;

                        const updateLocation = async (lat, lng) => {
                            const newAddress = await reverseGeocodeMappls(lat, lng);
                            if (onLocationChange) {
                                onLocationChange({
                                    coordinates: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
                                    buildingName: newAddress.house,
                                    streetName: newAddress.street,
                                    locality: newAddress.locality,
                                    propertyType: newAddress.propertyType
                                });
                            }
                        };

                        marker.addListener('dragend', function () {
                            const pos = marker.getPosition();
                            updateLocation(pos.lat, pos.lng);
                        });

                        map.addListener('click', function (e) {
                            const { lat, lng } = e.lngLat;
                            if (markerInstanceRef.current) {
                                markerInstanceRef.current.setPosition({ lat, lng });
                            }
                            updateLocation(lat, lng);
                        });

                        updateLocation(initialCoords.lat, initialCoords.lng);
                    });
                } catch (error) {
                    console.error("CRITICAL MAP ERROR: Failed to initialize MapMyIndia SDK.", error);
                    alert("The map could not be loaded. This is likely due to an invalid API key. Please verify the key in your .env.local file and restart the server.");
                    setIsMapLoading(false);
                }
            }
        }, 100);

        return () => {
            clearInterval(initInterval);
            if (mapInstanceRef.current && typeof mapInstanceRef.current.remove === 'function') {
                mapInstanceRef.current.remove();
            }
        };
    }, [onLocationChange, initialCenter]);

    const iconVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 },
    };

    const loadingIconVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                scale: {
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'easeInOut',
                },
                rotate: {
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                },
            },
        },
        exit: { opacity: 0, scale: 0.8 },
    };


    // --- FUNCTION WITH CORRECTIONS ---
    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }
        setIsFetchingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                if (!latitude || !longitude) {
                    alert("Your browser returned an invalid location.");
                    setIsFetchingLocation(false);
                    return;
                }
                const map = mapInstanceRef.current;
                const marker = markerInstanceRef.current;
                if (map && marker) {
                    // FIX 1: Use [longitude, latitude] for map center
                    map.flyTo({ center: [longitude, latitude], zoom: 15 });

                    // FIX 2: Use the correct `setPosition` method for the marker
                    marker.setPosition({ lat: latitude, lng: longitude });

                    const newAddress = await reverseGeocodeMappls(latitude, longitude);
                    if (onLocationChange) {
                        onLocationChange({
                            coordinates: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
                            buildingName: newAddress.house,
                            streetName: newAddress.street,
                            locality: newAddress.locality,
                            propertyType: newAddress.propertyType
                        });
                    }
                }
                setIsFetchingLocation(false);
            },
            (error) => {
                setIsFetchingLocation(false);
                let errorMessage = "Could not get your location. Please try again.";
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = "Location access was denied. Please enable it in your browser settings.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "Your location information is unavailable at the moment.";
                        break;
                    case error.TIMEOUT:
                        errorMessage = "The request to get your location timed out.";
                        break;
                }
                console.error("Geolocation error:", error.message);
                alert(errorMessage);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };


    return (
        <div className="relative w-full h-[60vh] rounded-lg overflow-hidden border">
            <div id="map-container" className="w-full h-full" />

            {isMapLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20">
                    <div className="text-center">
                        <p className="text-lg font-semibold text-gray-700">Loading Map...</p>
                    </div>
                </div>
            )}

            <div className="absolute top-4 left-4 z-10 max-w-sm">
                <div>
                    <button
                        type="button"
                        onClick={handleGetCurrentLocation}
                        className="w-fit rounded-full bg-purple-600 text-white font-semibold py-2 px-4 hover:bg-purple-700 transition-colors mt-3 flex items-center justify-center disabled:bg-purple-400 shadow"
                        disabled={isFetchingLocation}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {isFetchingLocation ? (
                                <motion.svg
                                    key="loading"
                                    className="h-6 w-6 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    variants={loadingIconVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </motion.svg>
                            ) : (
                                <motion.svg
                                    // Renamed key for clarity
                                    key="default"
                                    className="h-6 w-6 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    variants={iconVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0 0 13 3.06V1h-2v2.06A8.994 8.994 0 0 0 3.06 11H1v2h2.06A8.994 8.994 0 0 0 11 20.94V23h2v-2.06A8.994 8.994 0 0 0 20.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
                                </motion.svg>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </div >
        </div >
    );
}