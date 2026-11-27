"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import gsap from "gsap";

export default function CarScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [loadPercent, setLoadPercent] = useState<number>(0);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 80);
    camera.position.set(5.5, 2.2, 5.5);
    camera.lookAt(0, 0.8, 0);

    // 3. High-Performance WebGL Renderer (No mouse tracking, purely cinematic)
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
        precision: "mediump",
        depth: true,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.0));
      renderer.shadowMap.enabled = false;

      const canvasEl = renderer.domElement;
      canvasEl.style.position = "absolute";
      canvasEl.style.top = "0";
      canvasEl.style.left = "0";
      canvasEl.style.width = "100%";
      canvasEl.style.height = "100%";
      canvasEl.style.pointerEvents = "none"; // Clicks pass right through
      canvasEl.style.transform = "translateZ(0)";

      container.appendChild(canvasEl);
    } catch (e) {
      console.warn("WebGL not supported or failed to initialize:", e);
      setHasError(true);
      return;
    }

    // 4. Lightweight Studio Lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x111827, 2.0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(8, 12, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00e599, 0.8);
    rimLight.position.set(-6, 5, -4);
    scene.add(rimLight);

    // 5. Contact Shadow Plane (Attached under the car)
    const shadowGeo = new THREE.PlaneGeometry(8.5, 8.5);
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 6, 32, 32, 30);
      grad.addColorStop(0, "rgba(0, 0, 0, 0.8)");
      grad.addColorStop(0.5, "rgba(0, 0, 0, 0.3)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
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

    // 6. Car Root Group
    const carRootGroup = new THREE.Group();
    carRootGroup.add(shadowPlane);
    scene.add(carRootGroup);

    // Fixed Hero Parking Angle: NO rotating, NO cursor parallax!
    carRootGroup.rotation.set(0, -0.35, 0);

    if (prefersReducedMotion) {
      carRootGroup.position.set(0, 0, 0);
    } else {
      carRootGroup.position.set(6.2, 0, -4.2);
    }

    // Render loop controller: Only renders while driving in, then rests with 0% CPU!
    let animId: number | null = null;
    let isDriving = true;

    const renderScene = () => {
      renderer.render(scene, camera);
    };

    const animateLoop = () => {
      renderScene();
      if (isDriving) {
        animId = requestAnimationFrame(animateLoop);
      }
    };

    // 7. Load GLTF with Draco
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

        // Collect wheels for spinning animation
        const wheelNodes: THREE.Object3D[] = [];
        model.traverse((child) => {
          if (
            child.name === "WHEEL_LF" ||
            child.name === "WHEEL_RF" ||
            child.name === "WHEEL_LR" ||
            child.name === "WHEEL_RR"
          ) {
            wheelNodes.push(child);
          }

          if ((child as THREE.Mesh).isMesh) {
            const m = child as THREE.Mesh;
            m.frustumCulled = true;
            m.castShadow = false;
            m.receiveShadow = false;
          }
        });

        carRootGroup.add(model);
        setLoaded(true);

        if (!prefersReducedMotion) {
          // Start render loop during entrance drive
          isDriving = true;
          animateLoop();

          // 1. Drive straight into hero spot (3.0 seconds)
          carRootGroup.position.set(6.2, 0, -4.2);
          carRootGroup.rotation.set(0, -0.35, 0);

          gsap.to(carRootGroup.position, {
            x: 0,
            y: 0,
            z: 0,
            duration: 3.0,
            ease: "power2.out",
            onComplete: () => {
              // Car has parked! Stop render loop completely for 0% CPU usage!
              isDriving = false;
              renderScene();
            },
          });

          // 2. Spin all tires continuously while driving, then stop
          const wheelMotion = { rotation: 0 };
          gsap.to(wheelMotion, {
            rotation: Math.PI * 12, // 6 full wheel rotations
            duration: 3.0,
            ease: "power2.out",
            onUpdate: () => {
              for (let i = 0; i < wheelNodes.length; i++) {
                wheelNodes[i].rotation.x = wheelMotion.rotation;
              }
            },
          });
        } else {
          carRootGroup.position.set(0, 0, 0);
          carRootGroup.rotation.set(0, -0.35, 0);
          renderScene();
        }
      },
      (xhr) => {
        if (xhr.lengthComputable && xhr.total > 0) {
          const pct = Math.round((xhr.loaded / xhr.total) * 100);
          setLoadPercent(pct);
        }
      },
      (err) => {
        console.warn("Could not load /models/vezel_compressed.glb:", err);
        setHasError(true);
      }
    );

    // 8. Resize handler
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderScene();
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      if (animId !== null) {
        cancelAnimationFrame(animId);
      }
      window.removeEventListener("resize", onResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      dracoLoader.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[360px] sm:h-[450px] lg:h-[560px] flex items-center justify-center overflow-visible pointer-events-none select-none"
    >
      {/* Sleek Minimal Loading Badge */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none transition-opacity duration-300">
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#0f141c]/95 border border-emerald-500/30 text-xs text-emerald-400 font-semibold shadow-lg shadow-black/50">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>
              {hasError
                ? "3D Experience Ready"
                : loadPercent > 0
                ? `Loading 3D Car... ${loadPercent}%`
                : "Loading 3D Experience..."}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
