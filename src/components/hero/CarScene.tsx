"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

interface CarSceneProps {
  onModelReady?: () => void;
  carGroupRef: React.MutableRefObject<THREE.Group | null>;
}

export default function CarScene({ onModelReady, carGroupRef }: CarSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(5.5, 2.2, 5.5);

    // 3. Ultra-optimized WebGL Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false, // Disabling MSAA gives 3x FPS boost
        alpha: true,
        powerPreference: "high-performance",
        precision: "mediump",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.0)); // 1.0 DPR for super smooth cursor
      renderer.shadowMap.enabled = false; // Disable heavy PCF shadow map; contact plane handles shadow
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn("WebGL not supported or failed to initialize:", e);
      setHasError(true);
      return;
    }

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(10, 15, 8);
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x00e599, 1.2);
    rimLight.position.set(-8, 6, -5);
    scene.add(rimLight);

    const softFill = new THREE.DirectionalLight(0xdcfce7, 0.7);
    softFill.position.set(0, -2, 5);
    scene.add(softFill);

    // 5. Lightweight Contact Shadow Plane (Pre-baked smooth gradient)
    const shadowGeo = new THREE.PlaneGeometry(8, 8);
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(64, 64, 10, 64, 64, 60);
      grad.addColorStop(0, "rgba(0, 0, 0, 0.8)");
      grad.addColorStop(0.5, "rgba(0, 0, 0, 0.35)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
    }
    const shadowTex = new THREE.CanvasTexture(canvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.01;
    scene.add(shadowPlane);

    // 6. Root group for animations
    const carRootGroup = new THREE.Group();
    scene.add(carRootGroup);
    carGroupRef.current = carRootGroup;

    if (!prefersReducedMotion) {
      // Start in top-right corner for animation
      carRootGroup.position.set(12, 1.2, -3);
      carRootGroup.rotation.set(0.05, 0.75, -0.05);
    } else {
      carRootGroup.position.set(0, 0, 0);
      carRootGroup.rotation.set(0, -0.35, 0);
    }

    // 7. Load compressed Draco GLTF model
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/gltf/");
    dracoLoader.preload();

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      "/models/vezel_compressed.glb",
      (gltf) => {
        const model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxAxis = Math.max(size.x, size.y, size.z);
        const targetScale = maxAxis > 0 ? 5.2 / maxAxis : 1;
        model.scale.set(targetScale, targetScale, targetScale);

        const updatedBox = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        updatedBox.getCenter(center);
        model.position.x = -center.x;
        model.position.y = -updatedBox.min.y;
        model.position.z = -center.z;

        // Optimize materials
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const m = child as THREE.Mesh;
            m.castShadow = false;
            m.receiveShadow = false;
            if (m.material) {
              const mats = Array.isArray(m.material) ? m.material : [m.material];
              mats.forEach((mat) => {
                if ((mat as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
                  const sm = mat as THREE.MeshStandardMaterial;
                  sm.roughness = Math.max(sm.roughness * 0.85, 0.25);
                  sm.metalness = Math.min(sm.metalness * 1.1, 0.85);
                }
              });
            }
          }
        });

        carRootGroup.add(model);
        setLoaded(true);

        if (onModelReady) {
          onModelReady();
        }
      },
      undefined,
      (err) => {
        console.warn("Could not load /models/vezel_compressed.glb:", err);
        setHasError(true);
      }
    );

    camera.lookAt(0, 0.8, 0);

    // 8. Throttled Mouse parallax listener
    let mouseTicking = false;
    const onMouseMove = (e: MouseEvent) => {
      if (!mouseTicking) {
        requestAnimationFrame(() => {
          mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
          mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
          mouseTicking = false;
        });
        mouseTicking = true;
      }
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // 9. Resize handler
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize, { passive: true });

    // 10. Intersection Observer: Stop rendering completely when scrolled away!
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // 11. Throttled 35 FPS animation loop
    let animId: number;
    let lastRenderTime = 0;
    const targetInterval = 1000 / 35;
    const clock = new THREE.Clock();

    const animate = (currentTime: number) => {
      animId = requestAnimationFrame(animate);

      if (!isVisibleRef.current) return;

      const delta = currentTime - lastRenderTime;
      if (delta < targetInterval) return;
      lastRenderTime = currentTime - (delta % targetInterval);

      const elapsedTime = clock.getElapsedTime();

      // Only apply idle floating/parallax when model is loaded and in place
      if (!prefersReducedMotion && carRootGroup.children.length > 0 && Math.abs(carRootGroup.position.x) < 1.0) {
        const idleFloat = Math.sin(elapsedTime * 1.5) * 0.04;
        carRootGroup.position.y = idleFloat;

        const targetRotY = -0.35 + mouseRef.current.x * 0.1;
        const targetRotX = mouseRef.current.y * 0.03;
        carRootGroup.rotation.y = THREE.MathUtils.lerp(
          carRootGroup.rotation.y,
          targetRotY,
          0.06
        );
        carRootGroup.rotation.x = THREE.MathUtils.lerp(
          carRootGroup.rotation.x,
          targetRotX,
          0.06
        );
      }

      renderer.render(scene, camera);
    };
    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      dracoLoader.dispose();
      renderer.dispose();
    };
  }, [onModelReady, carGroupRef]);

  if (hasError) {
    return (
      <div className="relative w-full h-[360px] sm:h-[450px] lg:h-[560px] flex items-center justify-center pointer-events-none">
        <div className="text-zinc-600 text-xs tracking-wider uppercase font-semibold">
          3D Canvas Ready
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[360px] sm:h-[450px] lg:h-[560px] flex items-center justify-center overflow-hidden pointer-events-none select-none"
    >
      {/* Loading Indicator without any background image */}
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 transition-opacity duration-500">
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-black/60 border border-emerald-500/30 text-xs text-emerald-400 font-semibold backdrop-blur-md shadow-lg shadow-emerald-950/30">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Loading 3D Experience...</span>
          </div>
        </div>
      )}
    </div>
  );
}
