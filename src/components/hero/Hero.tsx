"use client";

import React, { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import HeroText from "./HeroText";
import { Search, Calendar, MapPin, Clock, Car } from "lucide-react";

const CarScene = dynamic(() => import("./CarScene"), {
  ssr: false,
  loading: () => (
    <div className="relative w-full h-[360px] sm:h-[450px] lg:h-[560px] flex items-center justify-center">
      <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#0f141c]/95 border border-emerald-500/30 text-xs text-emerald-400 font-semibold shadow-lg shadow-black/50">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
        <span>Loading 3D Experience...</span>
      </div>
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

  // Animate headline words "Drive Trincomalee in Prime Style" from left side corner to center over 3 seconds
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      if (textRef.current) {
        gsap.set(textRef.current, { opacity: 1, x: 0, y: 0 });
      }
      return;
    }

    if (textRef.current) {
      // Main headline and left content travel 3 seconds from left corner to center
      gsap.fromTo(
        textRef.current,
        {
          opacity: 0,
          x: -200,
        },
        {
          opacity: 1,
          x: 0,
          duration: 3.0,
          ease: "power2.out",
        }
      );

      const headline = textRef.current.querySelector("h1");
      if (headline) {
        gsap.fromTo(
          headline,
          {
            opacity: 0,
            x: -250,
          },
          {
            opacity: 1,
            x: 0,
            duration: 3.0,
            ease: "power2.out",
          }
        );
      }
    }
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
      {/* Background ambient radial glow */}
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
          {/* Left ~45%: Hero Text & Headline arriving from left corner in 3 seconds */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <HeroText ref={textRef} />
          </div>

          {/* Right ~55%: 3D Car arriving from right corner in 3 seconds */}
          <div className="lg:col-span-7 relative w-full lg:-ml-6">
            <CarScene />
          </div>
        </div>

        {/* Quick Search Bar */}
        <div className="mt-8 lg:mt-12 max-w-5xl mx-auto">
          <form
            onSubmit={handleSearchSubmit}
            className="p-3 sm:p-4 rounded-2xl bg-[#0f141c]/95 border border-white/10 shadow-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center"
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
