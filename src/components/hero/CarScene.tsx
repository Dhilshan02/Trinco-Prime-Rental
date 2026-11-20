"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

interface CarSceneProps {
  onModelReady?: () => void;
  carGroupRef: React.MutableRefObject<THREE.Group | null>;
}

export default function CarScene({ onModelReady, carGroupRef }: CarSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0 });

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

    // 3. Renderer setup
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn("WebGL not supported or failed to initialize:", e);
      setHasError(true);
      return;
    }

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight.position.set(10, 15, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    // Green coastal rim light
    const rimLight = new THREE.DirectionalLight(0x00e599, 1.2);
    rimLight.position.set(-8, 6, -5);
    scene.add(rimLight);

    const softFill = new THREE.DirectionalLight(0xdcfce7, 0.8);
    softFill.position.set(0, -2, 5);
    scene.add(softFill);

    // 5. Contact Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(8, 8);
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(128, 128, 20, 128, 128, 120);
      grad.addColorStop(0, "rgba(0, 0, 0, 0.7)");
      grad.addColorStop(0.5, "rgba(0, 0, 0, 0.3)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);
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

    // 6. Root group for GSAP animations
    const carRootGroup = new THREE.Group();
    scene.add(carRootGroup);
    carGroupRef.current = carRootGroup;

    // Initially position per spec if not reduced motion
    if (!prefersReducedMotion) {
      carRootGroup.position.set(10, 0, 0);
      carRootGroup.rotation.y = 0.61; // ~35 deg yaw
    } else {
      carRootGroup.position.set(0, 0, 0);
      carRootGroup.rotation.y = -0.35;
    }

    // 7. Load GLTF model
    const loader = new GLTFLoader();
    loader.load(
      "/models/vezel.glb",
      (gltf) => {
        const model = gltf.scene;

        // Auto-center and normalize size
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxAxis = Math.max(size.x, size.y, size.z);
        const targetScale = maxAxis > 0 ? 5.2 / maxAxis : 1;
        model.scale.set(targetScale, targetScale, targetScale);

        // Re-center model
        const updatedBox = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        updatedBox.getCenter(center);
        model.position.x = -center.x;
        model.position.y = -updatedBox.min.y; // Sit on ground
        model.position.z = -center.z;

        // Enable shadows & material enhancement
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const m = child as THREE.Mesh;
            m.castShadow = true;
            m.receiveShadow = true;
            if (m.material) {
              const mats = Array.isArray(m.material) ? m.material : [m.material];
              mats.forEach((mat) => {
                if ((mat as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
                  const sm = mat as THREE.MeshStandardMaterial;
                  sm.roughness = Math.max(sm.roughness * 0.85, 0.2);
                  sm.metalness = Math.min(sm.metalness * 1.15, 0.9);
                  sm.needsUpdate = true;
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
        console.warn("Could not load /models/vezel.glb, using poster fallback:", err);
        setHasError(true);
      }
    );

    camera.lookAt(0, 0.8, 0);

    // 8. Mouse parallax listener
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMouseMove);

    // 9. Resize handler
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // 10. Animation render loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Only perform subtle idle motion if loaded and not reduced motion
      if (!prefersReducedMotion && carRootGroup.children.length > 0) {
        // Idle breathing +/- 0.04 units
        const idleFloat = Math.sin(elapsedTime * 1.5) * 0.04;
        carRootGroup.position.y = idleFloat;

        // Target mouse parallax (+/- 0.08 rad)
        const targetRotY = -0.35 + mouseRef.current.x * 0.12;
        const targetRotX = mouseRef.current.y * 0.04;
        carRootGroup.rotation.y = THREE.MathUtils.lerp(
          carRootGroup.rotation.y,
          targetRotY,
          0.05
        );
        carRootGroup.rotation.x = THREE.MathUtils.lerp(
          carRootGroup.rotation.x,
          targetRotX,
          0.05
        );
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [onModelReady, carGroupRef]);

  if (hasError) {
    return (
      <div className="relative w-full h-[360px] sm:h-[450px] lg:h-[560px] flex items-center justify-center">
        <img
          src="/fleet/hero-poster.jpg"
          alt="Honda Vezel Showcase"
          className="max-h-[85%] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] filter brightness-105"
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[360px] sm:h-[450px] lg:h-[560px] flex items-center justify-center overflow-hidden"
    >
      {/* Loading Progress Poster */}
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 transition-opacity duration-500">
          <img
            src="/fleet/hero-poster.jpg"
            alt="Loading Vezel 3D Preview"
            className="w-full h-full object-contain opacity-40 blur-[2px]"
          />
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 rounded-full bg-black/80 border border-emerald-500/30 text-xs text-emerald-400 font-semibold backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Loading 3D Experience...
          </div>
        </div>
      )}
    </div>
  );
}
