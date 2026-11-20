"use client";

import React, { forwardRef } from "react";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

interface HeroTextProps {
  onBookClick?: () => void;
  onFleetClick?: () => void;
}

const HeroText = forwardRef<HTMLDivElement, HeroTextProps>(
  ({ onBookClick, onFleetClick }, ref) => {
    return (
      <div ref={ref} className="flex flex-col z-20 max-w-xl">
        {/* Top badge */}
        <div className="mb-4 inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00e599] animate-pulse"></span>
          <span>Trincomalee Premier Vehicle Rental</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08] mb-5">
          Drive Trincomalee <br />
          in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e599] to-emerald-400">Prime Style</span>
        </h1>

        {/* Short description */}
        <p className="text-base sm:text-lg text-zinc-300 font-medium leading-relaxed mb-4">
          Cars, vans, tuk-tuks and bikes for one-day rental.
        </p>

        {/* Value props list */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-3 text-xs sm:text-sm text-zinc-400 mb-8 font-medium">
          <div className="flex items-center gap-1.5 text-zinc-300">
            <ShieldCheck className="w-4 h-4 text-[#00e599]" />
            <span>Full insurance included</span>
          </div>
          <span className="text-zinc-600 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5 text-zinc-300">
            <Sparkles className="w-4 h-4 text-[#00e599]" />
            <span>Free door-step delivery in Nilaveli & Trinco</span>
          </div>
          <span className="text-zinc-600 hidden sm:inline">•</span>
          <span className="text-emerald-400 font-semibold">No hidden fees</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 hero-buttons">
          <a
            href="#booking"
            onClick={onBookClick}
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#00e599] hover:bg-[#00ffaa] text-black font-black text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(0,229,153,0.35)] hover:shadow-[0_0_35px_rgba(0,229,153,0.55)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>BOOK NOW</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </a>
          <a
            href="#fleet"
            onClick={onFleetClick}
            className="px-7 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-extrabold text-xs uppercase tracking-wider transition-all"
          >
            VIEW FLEET
          </a>
        </div>
      </div>
    );
  }
);

HeroText.displayName = "HeroText";
export default HeroText;
