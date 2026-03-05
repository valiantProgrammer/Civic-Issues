'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { compressImage } from '@/utils/image-processing'

// ==================================================================
// UPDATED COMPONENT: PanoramicViewer3D
// ==================================================================
function PanoramicViewer3D({ imageSrc, containerRef, setIsViewerReady, cursorSpeed = 1, zoomSpeed = 1 }) {
  const viewerRef = useRef(null);
  const cursorSpeedRef = useRef(cursorSpeed);
  const zoomSpeedRef = useRef(zoomSpeed);

  // Update speed refs when props change
  useEffect(() => {
    cursorSpeedRef.current = cursorSpeed;
    zoomSpeedRef.current = zoomSpeed;
  }, [cursorSpeed, zoomSpeed]);

  useEffect(() => {
    if (!containerRef.current || !imageSrc) return;

    setIsViewerReady(false);
    const container = containerRef.current;

    // --- Setup Scene ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 0.1);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(container.clientWidth, container.clientHeight);
    if ('outputColorSpace' in renderer) {
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    }

    container.appendChild(renderer.domElement);

    // --- Geometry and Material ---
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('');

    // --- Controls and Animation ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.rotateSpeed = -1.5 * cursorSpeedRef.current;
    controls.zoomSpeed = 1 * zoomSpeedRef.current;

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    let rafId;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Store all objects that need cleanup in the ref
    viewerRef.current = {
      renderer,
      scene,
      camera,
      controls,
      geometry,
      mesh: null, // Will be added after texture loads
      material: null,
      texture: null,
    };

    textureLoader.load(
      imageSrc,
      (texture) => {
        if ('colorSpace' in texture) {
          texture.colorSpace = THREE.SRGBColorSpace;
        }
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Add the loaded assets to the ref for cleanup
        if (viewerRef.current) {
          viewerRef.current.mesh = mesh;
          viewerRef.current.material = material;
          viewerRef.current.texture = texture;
        }
        setIsViewerReady(true);
      },
      undefined,
      (err) => {
        console.error('Texture load error', err);
      }
    );

    // --- THE ROBUST CLEANUP FUNCTION ---
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      const {
        renderer: currentRenderer,
        controls: currentControls,
        geometry: currentGeometry,
        material: currentMaterial,
        texture: currentTexture
      } = viewerRef.current || {};

      // THE CORE FIX: Safely remove the canvas from the DOM
      if (container && currentRenderer?.domElement && container.contains(currentRenderer.domElement)) {
        container.removeChild(currentRenderer.domElement);
      }

      // Dispose of all three.js objects to free up GPU memory
      currentControls?.dispose();
      currentRenderer?.dispose();
      currentGeometry?.dispose();
      currentMaterial?.dispose();
      currentTexture?.dispose();

      setIsViewerReady(false);
    };
  }, [imageSrc, containerRef, setIsViewerReady]);

  return null;
}

// ==================================================================
// NO CHANGES NEEDED FOR THE COMPONENTS BELOW
// ==================================================================

// A new component for the camera UI
function CameraCapture({ onCapture, onCancel, setMessage }) {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    let activeStream;
    const openCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setMessage('Camera is not available on this device');
          return;
        }
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
        });
        activeStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setMessage('Unable to access camera. Please check permissions.');
        onCancel();
      }
    };
    openCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onCancel, setMessage]);

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
        onCapture(file);
      }, "image/jpeg", 0.8);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black">
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
      <div className="fixed bottom-0 left-0 right-0 flex justify-center p-4">
        <button
          onClick={handleCapture}
          className="px-6 py-3 bg-purple-500 text-white rounded-full shadow-lg"
        >
          📸 Capture
        </button>
      </div>
      <div className="fixed top-4 right-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-red-500 text-white rounded-md shadow-lg"
        >
          ❌ Cancel
        </button>
      </div>
    </div>
  );
}

// The main component
export default function PanoramicViewer({ imageSrc, onImageCaptured, hideInfoBox = false }) {
  const containerRef = useRef(null);
  const [isViewerReady, setIsViewerReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isChoosing, setIsChoosing] = useState(false);
  const [actionType, setActionType] = useState(null); // 'capture' or 'upload'
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // --- NEW STATE: To control the 3D viewer modal visibility ---
  const [showViewerModal, setShowViewerModal] = useState(false);
  const [viewerMode, setViewerMode] = useState("pano"); // "pano" or "image"
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [imageZoom, setImageZoom] = useState(100);
  // Use refs for smooth dragging without state updates on every mousemove
  const imageRefView = useRef(null);
  const imageRefModal = useRef(null);
  const imageOffsetRef = useRef({ x: 0, y: 0 });
  const dragStartRef = useRef({ x: 0, y: 0 });
  const dragStartOffsetRef = useRef({ x: 0, y: 0 });
  // Settings states
  const [showSettings, setShowSettings] = useState(false);
  const [cursorSpeed, setCursorSpeed] = useState(1);
  const [zoomSpeed, setZoomSpeed] = useState(1);
  const [gearRotation, setGearRotation] = useState(0);

  // Detect if we're in view-only mode (imageSrc provided, no onImageCaptured callback)
  const isViewOnly = imageSrc && !onImageCaptured;

  const uploadToCloudinary = (file, onProgress) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload", true);
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          onProgress(percentComplete);
        }
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.responseText);
          resolve(data.url);
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      };
      xhr.onerror = () => reject(new Error("Upload failed due to a network error."));
      xhr.send(formData);
    });
  };
  const handleInitialActionClick = (type) => {
    setActionType(type);
    setIsChoosing(true);
  };

  const handleImageMouseDown = (e) => {
    if (viewerMode !== "image") return;
    setIsDraggingImage(true);
    // Store raw cursor position and current offset at drag start
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    dragStartOffsetRef.current = { x: imageOffsetRef.current.x, y: imageOffsetRef.current.y };
  };

  const handleImageMouseMove = (e) => {
    if (!isDraggingImage || viewerMode !== "image") return;
    const currentContainer = imageRefView.current?.parentElement || imageRefModal.current?.parentElement;
    if (!currentContainer) return;
    // Calculate how far cursor moved since drag started
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    // Apply delta to the starting offset to get new offset
    const newX = dragStartOffsetRef.current.x + deltaX;
    const newY = dragStartOffsetRef.current.y + deltaY;
    imageOffsetRef.current = { x: newX, y: newY };
    // Pan with natural direction: drag right = pan right
    currentContainer.style.transform = `translate(${newX}px, ${newY}px)`;
  };

  const handleImageMouseUp = () => {
    setIsDraggingImage(false);
  };

  const handleImageModeChange = () => {
    // Reset image position and offset when switching modes
    imageOffsetRef.current = { x: 0, y: 0 };
    setImageZoom(100);
  };

  const handleImageWheel = (e) => {
    if (viewerMode !== "image") return;
    e.preventDefault();
    const zoomChange = e.deltaY < 0 ? 10 : -10;
    setImageZoom((prev) => Math.max(50, Math.min(prev + zoomChange, 300)));
  };

  // Update container transform when zoom changes to maintain panning
  useEffect(() => {
    const currentContainer = imageRefView.current?.parentElement || imageRefModal.current?.parentElement;
    if (currentContainer && viewerMode === "image") {
      currentContainer.style.transform = `translate(${imageOffsetRef.current.x}px, ${imageOffsetRef.current.y}px)`;
    }
  }, [imageZoom, viewerMode]);

  const handleOptionClick = (mediaType) => {
    const input = fileInputRef.current;
    if (!input) return;

    if (actionType === 'capture') {
      input.capture = 'environment';
      input.accept = mediaType === 'panorama' ? 'image/*' : 'video/*';
    } else { // 'upload'
      input.removeAttribute('capture');
      input.accept = mediaType === 'panorama' ? 'image/*' : 'video/*';
    }

    input.click();
    setIsChoosing(false);
  };

  const handleFileSelected = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const requiredType = fileInputRef.current.accept.includes('image') ? 'image' : 'video';
    const selectedType = file.type.split('/')[0];

    if (requiredType !== selectedType) {
      alert(`Invalid File Type. Please select a ${requiredType} as requested.`);
      if (event.target) event.target.value = null;
      return;
    }

    setSelectedFile(file); // Keep track of the file object
    handleUpload(file); // Pass the file to your existing upload handler

    if (event.target) event.target.value = null;
  };

  const handleUpload = async (file) => {
    if (!file) return;
    setIsCapturing(false);
    setIsUploading(true);
    setUploadProgress(0);
    setMessage('Compressing image...');
    try {
      const compressedFile = await compressImage(file);
      setMessage('Uploading...');
      const uploadedUrl = await uploadToCloudinary(compressedFile, (progress) => {
        setUploadProgress(progress);
      });
      onImageCaptured(uploadedUrl);
      setMessage('Upload successful!');
    } catch (error) {
      console.error('Upload failed:', error);
      setMessage('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCaptureComplete = (file) => handleUpload(file);
  const handleFileUpload = (event) => handleUpload(event.target.files[0]);

  // --- NEW HANDLER: To remove the image and show capture options again ---
  const handleRemoveImage = () => {
    onImageCaptured(''); // Clear the image URL in the parent component
  };

  return (
    <div className="w-full h-full">
      {/* View-only mode: display viewer directly without any UI */}
      {isViewOnly ? (
        <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden relative">
          {/* View Mode Toggle Buttons */}
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <button
              onClick={() => {
                setViewerMode("image");
                handleImageModeChange();
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewerMode === "image"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-600 hover:bg-gray-700 text-white"
              }`}
            >
              📷 Image
            </button>
            <button
              onClick={() => {
                setViewerMode("pano");
                handleImageModeChange();
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewerMode === "pano"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-600 hover:bg-gray-700 text-white"
              }`}
            >
              360° Pano
            </button>
          </div>

          {/* Settings Button - Bottom Right with SVG Icon */}
          <button
            onClick={() => {
              setShowSettings(!showSettings);
              setGearRotation(gearRotation + (showSettings ? -35 : 35));
            }}
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
            className={`absolute bottom-20 right-4 z-[200] bg-slate-900/95 backdrop-blur-sm text-white p-6 rounded-lg shadow-2xl w-72 border border-slate-700 transition-all duration-300 ${
              showSettings
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
                    setViewerMode("image");
                    handleImageModeChange();
                    setShowSettings(false);
                    setGearRotation(gearRotation - 35);
                  }}
                  className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-all ${
                    viewerMode === "image"
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-slate-700 hover:bg-slate-600 text-slate-200"
                  }`}
                >
                  📷 Image
                </button>
                <button
                  onClick={() => {
                    setViewerMode("pano");
                    handleImageModeChange();
                    setShowSettings(false);
                    setGearRotation(gearRotation - 35);
                  }}
                  className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-all ${
                    viewerMode === "pano"
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-slate-700 hover:bg-slate-600 text-slate-200"
                  }`}
                >
                  360° Pano
                </button>
              </div>
            </div>

            {/* Cursor Speed Section - Only show for Pano mode */}
            {viewerMode === "pano" && (
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
            {viewerMode === "pano" && (
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
            {viewerMode === "image" && (
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
                      if (imageRefView.current) {
                        imageRefView.current.parentElement.style.transform = `translate(${imageOffsetRef.current.x}px, ${imageOffsetRef.current.y}px)`;
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
                    onClick={() => setImageZoom((prev) => Math.max(prev - 10, 50))}
                    className="flex-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded transition-all"
                  >
                    🔍 Zoom Out
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
              onClick={() => {
                setShowSettings(false);
                setGearRotation(gearRotation - 35);
              }}
            />
          )}

          {/* Image View */}
          {viewerMode === "image" && (
            <div className={`w-full h-full flex items-center justify-center bg-black overflow-hidden ${
              isDraggingImage ? "cursor-grabbing" : "cursor-grab"
            }`}
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
                ref={imageRefView}
                src={imageSrc}
                alt="Full view"
                className="max-w-full max-h-full object-contain select-none pointer-events-none"
                style={{
                  transform: `scale(${imageZoom / 100})`,
                }}
                onError={() => setViewerMode("pano")}
                draggable="false"
              />
            </div>
          )}

          {/* Panorama View */}
          {viewerMode === "pano" && (
            <>
              {!isViewerReady && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">Loading panorama...</p>
                  </div>
                </div>
              )}
              <div ref={containerRef} className="w-full h-full rounded-lg overflow-hidden">
                <PanoramicViewer3D imageSrc={imageSrc} containerRef={containerRef} setIsViewerReady={setIsViewerReady} cursorSpeed={cursorSpeed} zoomSpeed={zoomSpeed} />
              </div>
            </>
          )}
        </div>
      ) : (
        <>
          {/* Upload mode: original UI */}
          <input type="file" ref={fileInputRef} onChange={handleFileSelected} className="hidden" />
      {message && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-gray-800 text-white text-sm shadow-lg z-[10000]">
          {message}
        </div>
      )}

      <div className="mb-4 space-y-3">
        {isUploading ? (
          <div className="w-full flex flex-col items-center justify-center p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-600 mb-3">{message}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-purple-600 h-2.5 rounded-full transition-all duration-150 ease-linear" style={{ width: `${uploadProgress}%` }}></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">{Math.round(uploadProgress)}%</p>
          </div>
        ) : !imageSrc ? (
          <>
            <button
              type="button"
              onClick={() => handleInitialActionClick('capture')}
              className="w-full flex flex-col items-center justify-center p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.07-.894l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.93 1.486l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <p className="text-gray-600 font-medium mb-1">Capture Media Evidence</p>
              <p className="text-sm text-gray-500">Use your device&apos;s camera</p>
            </button>

            <div className="relative flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <button
              type="button"
              onClick={() => handleInitialActionClick('upload')}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              <span>Upload Media Evidence</span>
            </button>
          </>
        ) : (
          <div className="w-full p-3 border-2 border-green-500 bg-green-50 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              <svg className="w-6 h-6 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              <span className="text-sm font-medium text-gray-800 truncate">{selectedFile ? selectedFile.name : imageSrc.split('/').pop()}</span>
            </div>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="p-1 text-gray-500 hover:text-red-600 flex-shrink-0"
              title="Remove media"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        )}
      </div>

      {/* --- NEW: Uploaded Image URL Box --- Only show if hideInfoBox is false */}
      {imageSrc && !isUploading && !hideInfoBox && (
        <div className="w-full p-4 border border-gray-300 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Panoramic Image Uploaded</h3>
          <div className="flex items-center justify-between bg-white p-3 border rounded-md">
            <p
              onClick={() => setShowViewerModal(true)}
              className="text-purple-600 truncate hover:underline cursor-pointer"
              title="Click to view panorama"
            >
              {imageSrc}
            </p>
            <button onClick={handleRemoveImage} className="ml-4 p-1 text-gray-500 hover:text-red-600" title="Remove image">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      )}

      {!imageSrc && !isUploading && (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-2">Capture or upload a panoramic image</p>
          <p className="text-sm text-gray-500">Click the camera icon to capture a 360° view or upload an existing panorama</p>
        </div>
      )}

      {isCapturing && <CameraCapture onCapture={handleCaptureComplete} onCancel={() => setIsCapturing(false)} setMessage={setMessage} />}
      {/* --- ADD THIS NEW MODAL FOR CHOOSING MEDIA TYPE --- */}
      {isChoosing && (
        <div className="fixed inset-0 z-75 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsChoosing(false)} />
          <div className="relative bg-white rounded-lg shadow-xl max-w-sm w-full p-6 text-center">
            <h3 className="text-lg font-semibold mb-1">Choose Media Type</h3>
            <p className="text-sm text-gray-500 mb-4">
              {actionType === 'capture' ? "What will you capture?" : "What will you upload?"}
            </p>
            <div className="space-y-3">
              <button onClick={() => handleOptionClick('panorama')} className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Panorama Photo</button>
              <button onClick={() => handleOptionClick('video')} className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Video</button>
              <button onClick={() => setIsChoosing(false)} className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 mt-2">Cancel</button>
            </div>
            {actionType === 'capture' && <p className="text-xs text-gray-400 mt-3">Note: Panorama mode depends on your device&apos;s camera app.</p>}
          </div>
        </div>
      )}
      {/* --- NEW: 3D Viewer Modal with Toggle --- */}
      {showViewerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50 backdrop-blur-sm">
          <div className="relative w-full h-full max-w-4xl max-h-[80vh] bg-gray-100 rounded-lg shadow-xl m-4">
            <button onClick={() => setShowViewerModal(false)} className="absolute -top-3 -right-3 z-10 p-1.5 bg-white rounded-full shadow-lg hover:bg-gray-200 transition-colors" title="Close viewer">
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {/* View Mode Toggle Buttons */}
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <button
                onClick={() => {
                  setViewerMode("image");
                  handleImageModeChange();
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  viewerMode === "image"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-600 hover:bg-gray-700 text-white"
                }`}
              >
                📷 Image
              </button>
              <button
                onClick={() => {
                  setViewerMode("pano");
                  handleImageModeChange();
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  viewerMode === "pano"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-600 hover:bg-gray-700 text-white"
                }`}
              >
                360° Pano
              </button>
            </div>

            {/* Image View */}
            {viewerMode === "image" && (
              <div className={`w-full h-full rounded-lg overflow-hidden bg-black flex items-center justify-center ${
                isDraggingImage ? "cursor-grabbing" : "cursor-grab"
              }`}
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
                  ref={imageRefModal}
                  src={imageSrc}
                  alt="Full view"
                  className="max-w-full max-h-full object-contain select-none pointer-events-none"
                  style={{
                    transform: `scale(${imageZoom / 100})`,
                  }}
                  draggable="false"
                />
              </div>
            )}

            {/* Panorama View */}
            {viewerMode === "pano" && (
              <div className="w-full h-full rounded-lg overflow-hidden">
                {!isViewerReady && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
                      <p className="text-gray-600">Loading panorama...</p>
                    </div>
                  </div>
                )}
                <div ref={containerRef} className="w-full h-full rounded-lg overflow-hidden">
                  <PanoramicViewer3D imageSrc={imageSrc} containerRef={containerRef} setIsViewerReady={setIsViewerReady} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}
