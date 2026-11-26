"use client";

import React, { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";
import gsap from "gsap";
import HeroText from "./HeroText";
import { Search, Calendar, MapPin, Clock, Car } from "lucide-react";

const CarScene = dynamic(() => import("./CarScene"), {
  ssr: false,
  loading: () => (
    <div className="relative w-full h-[360px] sm:h-[450px] lg:h-[560px] flex items-center justify-center">
      <img
        src="/fleet/hero-poster.jpg"
        alt="Honda Vezel Showcase"
        className="max-h-[85%] object-contain opacity-80"
      />
    </div>
  ),
});

interface HeroProps {
  onSearch?: (criteria: {
    vehicleType: string;
    location: string;
    rentalDate: string;
    pickupTime: string;
  }) => void;
}

export default function Hero({ onSearch }: HeroProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const carGroupRef = useRef<THREE.Group | null>(null);
  const [animationStarted, setAnimationStarted] = useState(false);

  // Dynamic tomorrow date helper
  const getTomorrowDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  // Quick search form state
  const [vehicleType, setVehicleType] = useState("Cars");
  const [location, setLocation] = useState("Nilaveli Beach Resort Area");
  const [rentalDate, setRentalDate] = useState(getTomorrowDate());
  const [pickupTime, setPickupTime] = useState("09:00");

  const startIntroTimeline = () => {
    if (animationStarted) return;
    setAnimationStarted(true);

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      if (textRef.current) gsap.set(textRef.current, { opacity: 1, x: 0 });
      if (carGroupRef.current) {
        carGroupRef.current.position.x = 0;
        carGroupRef.current.rotation.y = -0.35;
      }
      return;
    }

    // Set initial positions per spec:
    // Text: offscreen left (translateX: -120), opacity: 0
    // Car: offscreen right (x: +8 to +10 in 3D scene)
    if (textRef.current) {
      gsap.set(textRef.current, { opacity: 0, x: -120 });
    }
    if (carGroupRef.current) {
      carGroupRef.current.position.x = 10;
      carGroupRef.current.rotation.y = 0.61; // ~35 deg yaw
    }

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      delay: 0.1,
    });

    // 0.0 - 1.6s: Car moves right -> left, Text moves left -> right
    tl.to(
      textRef.current,
      {
        opacity: 1,
        x: 0,
        duration: 1.6,
      },
      0
    );

    if (carGroupRef.current) {
      tl.to(
        carGroupRef.current.position,
        {
          x: 0,
          duration: 1.6,
        },
        0
      );
      tl.to(
        carGroupRef.current.rotation,
        {
          y: -0.35, // side-3/4 view (~ -20 deg)
          duration: 1.6,
        },
        0
      );
    }

    // 1.6 - 2.2s: Meet & subtle bounce + buttons fade up
    tl.to(
      textRef.current,
      {
        x: 0,
        duration: 0.6,
        ease: "back.out(1.4)",
      },
      1.6
    );

    if (carGroupRef.current) {
      tl.to(
        carGroupRef.current.position,
        {
          y: 0,
          duration: 0.6,
          ease: "back.out(1.2)",
        },
        1.6
      );
    }
  };

  useEffect(() => {
    // Fallback trigger in case 3D model takes longer or errors out
    const timer = setTimeout(() => {
      startIntroTimeline();
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ vehicleType, location, rentalDate, pickupTime });
    } else {
      const target = document.getElementById("fleet");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section id="hero" className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-grid">
      {/* Background ambient radial glow (GPU-friendly, zero blur lag) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          background:
            "radial-gradient(circle at 25% 30%, rgba(0, 229, 153, 0.12) 0%, transparent 55%), radial-gradient(circle at 75% 35%, rgba(0, 229, 153, 0.07) 0%, transparent 50%)",
        }}
      />

      {/* Main Composition: Desktop Left ~45% (Text), Right ~55% (3D Car) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[460px] lg:min-h-[560px]">
          {/* Left ~45% */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <HeroText ref={textRef} />
          </div>

          {/* Right ~55% (3D Car overlaps slightly) */}
          <div className="lg:col-span-7 relative w-full lg:-ml-6">
            <CarScene
              onModelReady={startIntroTimeline}
              carGroupRef={carGroupRef}
            />
          </div>
        </div>

        {/* Quick Search Bar (from the design) */}
        <div className="mt-8 lg:mt-12 max-w-5xl mx-auto">
          <form
            onSubmit={handleSearchSubmit}
            className="p-3 sm:p-4 rounded-2xl bg-[#0f141c]/90 border border-white/10 backdrop-blur-xl shadow-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center"
          >
            {/* Vehicle Type */}
            <div className="flex flex-col px-3 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 transition-colors">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 mb-1">
                <Car className="w-3.5 h-3.5 text-emerald-400" />
                <span>Vehicle Type</span>
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
              >
                <option value="Cars" className="bg-[#0f141c] text-white">Cars (SUV / Hatch)</option>
                <option value="Vans" className="bg-[#0f141c] text-white">Touring Vans</option>
                <option value="Tuk-Tuks" className="bg-[#0f141c] text-white">Bajaj Tuk-Tuks</option>
                <option value="Bikes" className="bg-[#0f141c] text-white">Bikes & Scooters</option>
              </select>
            </div>

            {/* Pickup Location */}
            <div className="flex flex-col px-3 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 transition-colors">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pickup Location</span>
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer truncate"
              >
                <option value="Nilaveli Beach Resort Area" className="bg-[#0f141c] text-white">Nilaveli Beach Resort</option>
                <option value="Uppuveli Beach" className="bg-[#0f141c] text-white">Uppuveli Beach</option>
                <option value="Trincomalee Town / Railway" className="bg-[#0f141c] text-white">Trinco Railway Station</option>
                <option value="China Bay Airport (TRR)" className="bg-[#0f141c] text-white">China Bay Airport (TRR)</option>
              </select>
            </div>

            {/* Rental Date */}
            <div className="flex flex-col px-3 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 transition-colors">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>Rental Date</span>
              </label>
              <input
                type="date"
                value={rentalDate}
                onChange={(e) => setRentalDate(e.target.value)}
                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
              />
            </div>

            {/* Pickup Time */}
            <div className="flex flex-col px-3 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 transition-colors">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pickup Time</span>
              </label>
              <input
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
              />
            </div>

            {/* Search CTA */}
            <button
              type="submit"
              className="w-full h-full min-h-[48px] rounded-xl bg-[#00e599] hover:bg-[#00ffaa] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,229,153,0.3)] hover:shadow-[0_0_25px_rgba(0,229,153,0.5)] transition-all sm:col-span-2 lg:col-span-1"
            >
              <span>SEARCH VEHICLES</span>
              <Search className="w-4 h-4 stroke-[3]" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
