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
  const mouseRef = useRef({ x: 0, y: 0 });
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect reduced motion preference
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

    // 3. Ultra-smooth WebGL Renderer with High Performance & Antialiasing
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true, // Smooth edges without jagged pixelation
        alpha: true,
        powerPreference: "high-performance",
        precision: "highp",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
      renderer.shadowMap.enabled = false;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;

      // Ensure canvas fills container properly
      renderer.domElement.style.position = "absolute";
      renderer.domElement.style.top = "0";
      renderer.domElement.style.left = "0";
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.pointerEvents = "auto";

      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn("WebGL not supported or failed to initialize:", e);
      setHasError(true);
      return;
    }

    // 4. Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight.position.set(10, 15, 8);
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x00e599, 1.4);
    rimLight.position.set(-8, 6, -5);
    scene.add(rimLight);

    const softFill = new THREE.DirectionalLight(0xdcfce7, 0.8);
    softFill.position.set(0, -2, 5);
    scene.add(softFill);

    // 5. Contact Shadow Plane (Attached to carRootGroup so shadow moves with car!)
    const shadowGeo = new THREE.PlaneGeometry(8.5, 8.5);
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(64, 64, 10, 64, 64, 60);
      grad.addColorStop(0, "rgba(0, 0, 0, 0.85)");
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

    // 6. Car Root Group
    const carRootGroup = new THREE.Group();
    carRootGroup.add(shadowPlane);
    scene.add(carRootGroup);

    // Initial position: straight alignment along the driving lane (NO rotating/spinning!)
    if (prefersReducedMotion) {
      carRootGroup.position.set(0, 0, 0);
      carRootGroup.rotation.set(0, -0.35, 0);
    } else {
      carRootGroup.position.set(6.2, 0, -4.2);
      carRootGroup.rotation.set(0, -0.35, 0);
    }

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

        // Collect all 4 wheel objects so tires spin as the car drives in
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
            m.castShadow = false;
            m.receiveShadow = false;
            if (m.material) {
              const mats = Array.isArray(m.material) ? m.material : [m.material];
              mats.forEach((mat) => {
                if ((mat as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
                  const sm = mat as THREE.MeshStandardMaterial;
                  sm.roughness = Math.max(sm.roughness * 0.8, 0.2);
                  sm.metalness = Math.min(sm.metalness * 1.15, 0.9);
                }
              });
            }
          }
        });

        carRootGroup.add(model);
        setLoaded(true);

        // Drive-in Straight Animation with Spinning Wheels (No body twisting/spinning!)
        if (!prefersReducedMotion) {
          // 1. Position car straight along its driving track, facing its destination
          carRootGroup.position.set(6.2, 0, -4.2);
          carRootGroup.rotation.set(0, -0.35, 0); // Steady fixed angle!

          // 2. Drive straight into hero spot (3.0 seconds straight drive)
          gsap.to(carRootGroup.position, {
            x: 0,
            y: 0,
            z: 0,
            duration: 3.0,
            ease: "power2.out",
          });

          // 3. Spin all tires continuously while driving forward, smoothly decelerating to a stop
          const wheelMotion = { rotation: 0 };
          gsap.to(wheelMotion, {
            rotation: Math.PI * 12, // 6 full rotations of wheels
            duration: 3.0,
            ease: "power2.out",
            onUpdate: () => {
              wheelNodes.forEach((wheel) => {
                wheel.rotation.x = wheelMotion.rotation;
              });
            },
          });
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

    camera.lookAt(0, 0.8, 0);

    // 8. Zero-lag mouse tracker for responsive cursor interaction
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
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

    // 10. Pause rendering when out of viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // 11. Full 60+ FPS unthrottled smooth animation loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isVisibleRef.current) return;

      const elapsedTime = clock.getElapsedTime();

      // Only apply subtle idle floating & responsive mouse parallax when car has parked in hero spot
      if (!prefersReducedMotion && carRootGroup.children.length > 1) {
        if (Math.abs(carRootGroup.position.x) < 0.25) {
          const idleFloat = Math.sin(elapsedTime * 2.0) * 0.04;
          carRootGroup.position.y = THREE.MathUtils.lerp(
            carRootGroup.position.y,
            idleFloat,
            0.12
          );

          // Fast, silky smooth mouse reaction (0.12 lerp factor)
          const targetRotY = -0.35 + mouseRef.current.x * 0.22;
          const targetRotX = mouseRef.current.y * 0.07;
          carRootGroup.rotation.y = THREE.MathUtils.lerp(
            carRootGroup.rotation.y,
            targetRotY,
            0.12
          );
          carRootGroup.rotation.x = THREE.MathUtils.lerp(
            carRootGroup.rotation.x,
            targetRotX,
            0.12
          );
        }
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
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[360px] sm:h-[450px] lg:h-[560px] flex items-center justify-center overflow-visible pointer-events-none select-none"
    >
      {/* Sleek Minimal Loading Badge: NO STATIC IMAGE - Only badge until 3D car drives in */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none transition-opacity duration-300">
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-black/75 border border-emerald-500/30 text-xs text-emerald-400 font-semibold backdrop-blur-md shadow-lg shadow-emerald-950/40">
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
