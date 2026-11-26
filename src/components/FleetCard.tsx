"use client";

import React from "react";
import Image from "next/image";
import { Vehicle } from "@/lib/fleet";
import { Users, Fuel, Shield, ArrowUpRight } from "lucide-react";

interface FleetCardProps {
  vehicle: Vehicle;
  onBook: (vehicleId: string) => void;
}

export default function FleetCard({ vehicle, onBook }: FleetCardProps) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col group border border-white/10 hover:border-emerald-500/40 transition-all duration-300">
      {/* Image container */}
      <div className="relative w-full h-52 bg-[#131924] overflow-hidden">
        <Image
          src={vehicle.image}
          alt={vehicle.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Title & Transmission */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="text-lg font-black text-white group-hover:text-emerald-400 transition-colors">
              {vehicle.name}
            </h3>
            <span className="text-xs font-semibold text-zinc-400">
              {vehicle.transmission}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
            {vehicle.description}
          </p>

          {/* Feature Badges */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-[11px] font-semibold text-zinc-300">
              {vehicle.seats}
            </span>
            {vehicle.features.map((feature, idx) => {
              const isDriver = feature.toLowerCase().includes("driver");
              return (
                <span
                  key={idx}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                    isDriver
                      ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/20"
                      : "bg-white/5 border border-white/5 text-zinc-300"
                  }`}
                >
                  {feature}
                </span>
              );
            })}
          </div>
        </div>

        {/* Footer: Daily Rate & Book Button */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Daily rate
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-base sm:text-lg font-black text-white">
                LKR {vehicle.dailyRate.toLocaleString()}
              </span>
              <span className="text-xs text-zinc-400">/day</span>
            </div>
          </div>

          <button
            onClick={() => onBook(vehicle.id)}
            className="px-4 py-2 rounded-xl bg-[#00e599] hover:bg-[#00ffaa] text-black font-extrabold text-xs uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-[0_0_15px_rgba(0,229,153,0.4)] flex items-center gap-1 active:scale-95"
          >
            <span>BOOK NOW</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
}
