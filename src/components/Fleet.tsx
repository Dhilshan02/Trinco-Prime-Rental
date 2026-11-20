"use client";

import React, { useState } from "react";
import { FLEET, Vehicle } from "@/lib/fleet";
import FleetCard from "./FleetCard";
import { Car, Truck, Bike, Sparkles } from "lucide-react";

interface FleetProps {
  onSelectVehicle: (vehicleId: string) => void;
}

type FilterCategory = "all" | "cars" | "vans" | "tuktuks" | "bikes";

export default function Fleet({ onSelectVehicle }: FleetProps) {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");

  const counts = {
    all: FLEET.length,
    cars: FLEET.filter((v) => v.category === "cars").length,
    vans: FLEET.filter((v) => v.category === "vans").length,
    tuktuks: FLEET.filter((v) => v.category === "tuktuks").length,
    bikes: FLEET.filter((v) => v.category === "bikes").length,
  };

  const filteredFleet =
    activeFilter === "all"
      ? FLEET
      : FLEET.filter((v) => v.category === activeFilter);

  const filterTabs: { id: FilterCategory; label: string; count: number }[] = [
    { id: "all", label: "All", count: counts.all },
    { id: "cars", label: "Cars", count: counts.cars },
    { id: "vans", label: "Vans", count: counts.vans },
    { id: "tuktuks", label: "Tuk-Tuks", count: counts.tuktuks },
    { id: "bikes", label: "Bikes & Scooters", count: counts.bikes },
  ];

  return (
    <section id="fleet" className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/25 text-emerald-400 text-[11px] font-bold tracking-widest uppercase mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e599]"></span>
              <span>HANDPICKED HIGH-STANDARD VEHICLES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              The Trinco Prime Fleet
            </h2>
            <p className="mt-3 text-zinc-400 text-sm sm:text-base max-w-2xl leading-relaxed">
              We specialize exclusively in pristine daily vehicle rentals. Discover our hand-inspected lineup with full insurance coverage, clear transparent daily rates, and flexible self-drive or professional chauffeur service.
            </p>
          </div>

          <div className="text-xs text-zinc-400 font-semibold md:text-right">
            Showing <span className="text-[#00e599] font-bold">{filteredFleet.length}</span> of{" "}
            {FLEET.length} premium vehicles
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#00e599] text-black shadow-[0_0_15px_rgba(0,229,153,0.35)]"
                    : "bg-[#111622] text-zinc-300 border border-white/5 hover:border-white/20 hover:text-white"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? "bg-black/20 text-black" : "bg-white/10 text-zinc-400"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredFleet.map((vehicle) => (
            <FleetCard
              key={vehicle.id}
              vehicle={vehicle}
              onBook={onSelectVehicle}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
