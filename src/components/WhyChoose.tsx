"use client";

import React from "react";
import { Plane, Wrench, Gem, ShieldCheck, Check } from "lucide-react";

export default function WhyChoose() {
  const features = [
    {
      icon: Plane,
      title: "Airport & Doorstep Delivery",
      description:
        "Dedicated pickup/drop-off at China Bay Airport (TRR), Bandaranaike International (CMB), or straight to your Nilaveli/Uppuveli resort with flight tracking.",
      badge: "Flight delay guarantee",
    },
    {
      icon: Wrench,
      title: "24/7 Roadside & Chauffeur Support",
      description:
        "Round-the-clock roadside assistance across Trincomalee district with quick replacement guarantee and bilingual local dispatchers.",
      badge: "Trinco garage dispatch",
    },
    {
      icon: Gem,
      title: "Transparent & Affordable Rates",
      description:
        "Zero hidden fees, fair transparent daily pricing, all taxes and tourist permits included with flexible refundable deposit policies.",
      badge: "No surprise charges",
    },
    {
      icon: ShieldCheck,
      title: "Pristine & Fully Insured Fleet",
      description:
        "Comprehensive rental insurance coverage, rigorous 40-point safety check, spotless sanitized interiors, and fresh cold bottled water.",
      badge: "Fully insured & sanitised",
    },
  ];

  return (
    <section id="why-choose" className="py-20 lg:py-28 relative bg-[#090c12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/25 text-emerald-400 text-[11px] font-bold tracking-widest uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e599]"></span>
            <span>THE TRINCO PRIME ADVANTAGE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Why Choose Trinco Prime
          </h2>
          <p className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed">
            Experience seamless luxury, absolute reliability, and genuine Eastern Province hospitality from booking to return.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="glass-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between border border-white/5 hover:border-emerald-500/30 transition-all duration-300 group"
              >
                <div>
                  {/* Icon Box */}
                  <div className="w-12 h-12 rounded-xl bg-emerald-950/50 border border-emerald-500/25 flex items-center justify-center text-[#00e599] mb-5 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-black text-white mb-3">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                {/* Sub badge */}
                <div className="pt-4 border-t border-white/5 flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                  <span>{item.badge}</span>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
