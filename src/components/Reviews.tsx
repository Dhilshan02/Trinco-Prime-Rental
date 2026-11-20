"use client";

import React from "react";
import { Star } from "lucide-react";

export default function Reviews() {
  const reviews = [
    {
      name: "Marc & Sophie",
      location: "Zurich, Switzerland",
      initial: "M",
      text: "Rented a tuk-tuk for 4 days to cruise between Uppuveli and Nilaveli. The vehicle was spotless, they gave us a 30-min driving lesson and handled our Sri Lanka permit paperwork effortlessly.",
    },
    {
      name: "Ananya Sharma",
      location: "Bangalore, India",
      initial: "A",
      text: "Outstanding service! We ordered a Toyota KDH van with driver Ramesh for our family of 7. Punctual, professional, cold AC, and he knew all the best seafood spots in Trinco.",
    },
    {
      name: "David Miller",
      location: "Melbourne, Australia",
      initial: "D",
      text: "They delivered two scooters directly to our resort reception in Nilaveli within 40 minutes of our message. Pristine bikes, good helmets, zero hidden deposit traps. 10/10 recommend.",
    },
  ];

  return (
    <section id="reviews" className="py-20 lg:py-28 relative bg-[#090c12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/25 text-emerald-400 text-[11px] font-bold tracking-widest uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e599]"></span>
            <span>GUEST EXPERIENCES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Loved by Global Travelers
          </h2>
          <p className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed">
            Rated <span className="text-[#00e599] font-bold">4.9/5 stars</span> across 450+ verified vehicle rentals in Trincomalee.
          </p>
        </div>

        {/* 3 Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="glass-card rounded-2xl p-7 flex flex-col justify-between border border-white/5 hover:border-emerald-500/30 transition-all duration-300"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(5)].map((_, starIdx) => (
                    <Star
                      key={starIdx}
                      className="w-4 h-4 fill-[#00e599] text-[#00e599]"
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-sm text-zinc-300 leading-relaxed italic mb-6">
                  &ldquo;{r.text}&rdquo;
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-5 border-t border-white/5">
                <div className="w-9 h-9 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-[#00e599] font-black text-sm flex items-center justify-center">
                  {r.initial}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{r.name}</h4>
                  <span className="text-[11px] text-zinc-500">{r.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
