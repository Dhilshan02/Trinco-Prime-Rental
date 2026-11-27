"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import gsap from "gsap";

interface CarSceneProps {
  onModelReady?: (startCarAnimation: () => void) => void;
}

export default function CarScene({ onModelReady }: CarSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [loadPercent, setLoadPercent] = useState<number>(0);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isDisposed = false;
    let tween: gsap.core.Tween | null = null;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup - framed close and bold for prominent car size
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 80);
    camera.position.set(4.8, 1.7, 5.0);
    camera.lookAt(0, 0.45, 0);

    // 3. Ultra-smooth WebGL Renderer
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
      canvasEl.style.pointerEvents = "none";
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

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(8, 12, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00e599, 1.0);
    rimLight.position.set(-6, 5, -4);
    scene.add(rimLight);

    // 5. Contact Shadow Plane (Attached under the car)
    const shadowGeo = new THREE.PlaneGeometry(12, 12);
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 6, 32, 32, 30);
      grad.addColorStop(0, "rgba(0, 0, 0, 0.85)");
      grad.addColorStop(0.5, "rgba(0, 0, 0, 0.35)");
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

    // 6. Car Root Group - Oriented in sleek side profile
    const carRootGroup = new THREE.Group();
    carRootGroup.add(shadowPlane);
    scene.add(carRootGroup);

    // Side shape orientation: clean side profile facing leftwards into center
    carRootGroup.rotation.set(0, -0.22, 0);

    if (prefersReducedMotion) {
      carRootGroup.position.set(0, 0, 0);
    } else {
      // Start offscreen to the right
      carRootGroup.position.set(9.0, 0, 0);
    }

    const safeRender = () => {
      if (!isDisposed && renderer) {
        renderer.render(scene, camera);
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
        if (isDisposed) return;

        const model = gltf.scene;

        // Enlarged car size per user request (7.5 scale factor, ~45% larger)
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxAxis = Math.max(size.x, size.y, size.z);
        const targetScale = maxAxis > 0 ? 7.5 / maxAxis : 1;
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
          // Direct side shape drive-in straight from right edge into center
          const startCarAnimation = () => {
            if (isDisposed) return;
            const animObj = {
              x: 9.0,
              wheelRot: 0,
            };

            carRootGroup.position.set(animObj.x, 0, 0);
            safeRender();

            tween = gsap.to(animObj, {
              x: 0,
              wheelRot: Math.PI * 10, // Wheels rotate with forward drive
              duration: 1.5,
              ease: "power2.out",
              onUpdate: () => {
                if (isDisposed) return;
                carRootGroup.position.x = animObj.x;
                for (let i = 0; i < wheelNodes.length; i++) {
                  wheelNodes[i].rotation.x = animObj.wheelRot;
                }
                safeRender();
              },
              onComplete: () => {
                safeRender();
              },
            });
          };

          // Synchronize with hero text if callback provided, else auto-start
          if (onModelReady) {
            onModelReady(startCarAnimation);
          } else {
            startCarAnimation();
          }
        } else {
          carRootGroup.position.set(0, 0, 0);
          safeRender();
        }
      },
      (xhr) => {
        if (!isDisposed && xhr.lengthComputable && xhr.total > 0) {
          const pct = Math.round((xhr.loaded / xhr.total) * 100);
          setLoadPercent(pct);
        }
      },
      (err) => {
        if (!isDisposed) {
          console.warn("Could not load /models/vezel_compressed.glb:", err);
          setHasError(true);
        }
      }
    );

    // 8. Resize handler
    const onResize = () => {
      if (isDisposed || !container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      safeRender();
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      isDisposed = true;
      if (tween) {
        tween.kill();
      }
      window.removeEventListener("resize", onResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      try {
        dracoLoader.dispose();
        renderer.dispose();
      } catch {}
    };
  }, [onModelReady]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[400px] sm:h-[480px] lg:h-[620px] flex items-center justify-center overflow-visible pointer-events-none select-none"
    >
      {/* Minimal Loading Badge */}
      {!loaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none transition-opacity duration-300">
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#0f141c]/95 border border-emerald-500/30 text-xs text-emerald-400 font-semibold shadow-lg shadow-black/50">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>
              {loadPercent > 0
                ? `Loading 3D Car... ${loadPercent}%`
                : "Loading 3D Experience..."}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
