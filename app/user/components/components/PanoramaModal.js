"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// Panorama viewer built with Three.js - no external dependencies
const PanoramaContent = ({ imageUrl, containerRef }) => {
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!imageUrl || !containerRef.current) return;

    let scene, camera, renderer, sphere;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotation = { x: 0, y: 0 };
    let targetRotation = { x: 0, y: 0 };

    const initPanorama = async () => {
      try {
        const container = containerRef.current;
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
        const texture = await new Promise((resolve, reject) => {
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
        const geometry = new THREE.SphereGeometry(100, 128, 128);
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.BackSide, // Render inside of sphere
        });
        sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        // Mouse drag controls
        const onMouseDown = (event) => {
          isDragging = true;
          previousMousePosition = { x: event.clientX, y: event.clientY };
        };

        const onMouseMove = (event) => {
          if (!isDragging) return;

          const deltaX = event.clientX - previousMousePosition.x;
          const deltaY = event.clientY - previousMousePosition.y;

          // Adjust rotation based on mouse movement
          // Drag right = look right, drag down = look down
          targetRotation.y += (deltaX * Math.PI) / width;
          targetRotation.x += (deltaY * Math.PI) / height;

          // Clamp vertical rotation to prevent flipping
          targetRotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRotation.x));

          previousMousePosition = { x: event.clientX, y: event.clientY };
        };

        const onMouseUp = () => {
          isDragging = false;
        };

        // Wheel zoom
        let zoomLevel = 1;
        const onMouseWheel = (event) => {
          event.preventDefault();
          // Scroll up (deltaY < 0) = zoom in, Scroll down (deltaY > 0) = zoom out
          zoomLevel += event.deltaY < 0 ? 0.1 : -0.1;
          zoomLevel = Math.max(0.5, Math.min(3, zoomLevel));
          camera.fov = 75 / zoomLevel;
          camera.updateProjectionMatrix();
        };

        container.addEventListener("mousedown", onMouseDown);
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
        container.addEventListener("wheel", onMouseWheel, { passive: false });

        // Animation loop with smooth rotation interpolation
        const animate = () => {
          requestAnimationFrame(animate);

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

        // Handle resize
        const handleResize = () => {
          const newWidth = container.clientWidth;
          const newHeight = container.clientHeight;
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        };

        window.addEventListener("resize", handleResize);

        // Cleanup
        return () => {
          window.removeEventListener("resize", handleResize);
          container.removeEventListener("mousedown", onMouseDown);
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);
          container.removeEventListener("wheel", onMouseWheel);
          if (renderer && container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
          geometry.dispose();
          material.dispose();
          renderer.dispose();
          texture.dispose();
        };
      } catch (err) {
        console.error("Failed to load panorama:", err);
        setError(err.message || "Failed to load panorama image");
      }
    };

    const cleanup = initPanorama();
    
    return () => {
      if (cleanup instanceof Promise) {
        cleanup.then((c) => c?.());
      } else if (cleanup) {
        cleanup();
      }
    };
  }, [imageUrl, containerRef]);

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


  return (
    <div className="w-full cursor-grab h-full bg-black">
      <div className="fixed inset-0 flex items-center justify-center text-gray-700 backdrop-blur-xl z-100 bg-white">
        {/* Instructions */}
        <div className="absolute top-4 left-4 z-10 bg-black/30 bg-opacity-75 text-white px-4 py-2 rounded-lg backdrop-blur-xl">
          <p className="text-sm">
            <span className="font-medium">Click &amp; Drag:</span> Rotate view •{" "}
            <span className="font-medium">Scroll:</span> Zoom
          </p>
        </div>

        {imageUrl ? (
          <div className="relative w-[100%] h-[100%] bg-black shadow-lg overflow-hidden z-100">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-150 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
            >
              ✕
            </button>

            {/* Panorama container */}
            <PanoramaContent imageUrl={imageUrl} containerRef={panoContainerRef} />
          </div>
        ) : (
          <p className="text-center mt-10 text-white">No pano image provided</p>
        )}
      </div>
    </div>
  );
}
