"use client";

import React from "react";
import Image from "next/image";
import { Vehicle } from "@/lib/fleet";
import { PriceBreakdown } from "@/lib/pricing";
import { ShieldCheck, PhoneCall } from "lucide-react";

interface SummaryProps {
  vehicle: Vehicle;
  pricing: PriceBreakdown;
  driverOption: "with_driver" | "self_drive";
  pickupLocation: string;
}

export default function Summary({
  vehicle,
  pricing,
  driverOption,
  pickupLocation,
}: SummaryProps) {
  return (
    <div className="glass-card rounded-2xl p-6 sm:p-7 border border-white/10 flex flex-col justify-between sticky top-28">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-400 tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e599]"></span>
            <span>RESERVATION SUMMARY</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-zinc-400">
            {vehicle.categoryLabel}
          </span>
        </div>

        {/* Vehicle Preview */}
        <div className="relative w-full h-36 rounded-xl overflow-hidden bg-[#131924] mb-4 border border-white/5">
          <Image
            src={vehicle.image}
            alt={vehicle.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Vehicle Info */}
        <div className="text-center mb-6">
          <h4 className="text-xl font-black text-white">{vehicle.name}</h4>
          <p className="text-xs text-zinc-400 mt-0.5">
            {vehicle.seats} • {vehicle.features[0] || "Dual AC"} • {vehicle.transmission}
          </p>
        </div>

        {/* Breakdown table */}
        <div className="space-y-3 py-4 border-t border-b border-white/10 text-xs">
          <div className="flex justify-between items-center text-zinc-400">
            <span>Duration</span>
            <span className="font-bold text-white">{pricing.days} Day(s)</span>
          </div>
          <div className="flex justify-between items-center text-zinc-400">
            <span>Driver Mode</span>
            <span className={`font-bold ${driverOption === "with_driver" ? "text-emerald-400" : "text-white"}`}>
              {driverOption === "with_driver" ? "Chauffeur Included" : "Self Drive"}
            </span>
          </div>
          {pricing.driverFee > 0 && (
            <div className="flex justify-between items-center text-zinc-400">
              <span>Chauffeur Fee ({pricing.days}d)</span>
              <span className="font-semibold text-zinc-300">
                +LKR {pricing.driverFee.toLocaleString()}
              </span>
            </div>
          )}
          {pricing.airportFee > 0 && (
            <div className="flex justify-between items-center text-zinc-400">
              <span>Airport Delivery</span>
              <span className="font-semibold text-zinc-300">
                +LKR {pricing.airportFee.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Estimated Total */}
        <div className="mt-5 mb-4">
          <div className="flex justify-between items-baseline">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              ESTIMATED TOTAL
            </span>
            <div className="text-right">
              <div className="text-2xl font-black text-[#00e599]">
                LKR {pricing.total.toLocaleString()}
              </div>
              <span className="text-[10px] text-zinc-400 block -mt-1">
                All taxes included
              </span>
            </div>
          </div>
        </div>

        {/* Guarantee Pill */}
        <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 flex items-center justify-center gap-2 text-emerald-400 text-[11px] font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>Best Rate Guaranteed & Free Cancellation</span>
        </div>
      </div>

      {/* Immediate Help */}
      <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-xs">
        <span className="text-zinc-400">Need immediate help?</span>
        <a
          href="tel:+94755189759"
          className="font-bold text-white hover:text-emerald-400 transition-colors flex items-center gap-1.5"
        >
          <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
          <span>+94 75 518 9759</span>
        </a>
      </div>
    </div>
  );
}
