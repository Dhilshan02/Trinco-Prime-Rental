"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#05070a] border-t border-white/10 pt-16 pb-12 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Info (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-6 overflow-hidden rounded bg-black flex items-center justify-center border border-white/10">
                <Image
                  src="/logo.jpg"
                  alt="Trinco Prime Rentals"
                  fill
                  className="object-contain p-0.5 filter brightness-110"
                />
              </div>
              <span className="text-base font-black text-white tracking-tight">
                Trinco Prime Rentals
              </span>
            </div>
            <p className="text-zinc-400 text-xs max-w-sm leading-relaxed">
              Premium cars, vans, tuk-tuks, and motorcycles across Trincomalee, Nilaveli, and Uppuveli. Fully insured, transparent rates, doorstep delivery.
            </p>
            <div className="text-[11px] text-zinc-500">
              Licensed by Sri Lanka Tourism Development Authority (Local Tourism Desk Partner).
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4">
              QUICK LINKS
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#hero" className="hover:text-emerald-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#fleet" className="hover:text-emerald-400 transition-colors">
                  The 10 Vehicle Fleet
                </a>
              </li>
              <li>
                <a href="#why-choose" className="hover:text-emerald-400 transition-colors">
                  Why Choose Us
                </a>
              </li>
              <li>
                <a href="#booking" className="hover:text-emerald-400 transition-colors">
                  Instant Booking
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-emerald-400 transition-colors">
                  Guest Reviews
                </a>
              </li>
            </ul>
          </div>

          {/* Vehicles List */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4">
              VEHICLES
            </h4>
            <ul className="space-y-2.5">
              <li>Toyota C-HR & Vezel SUVs</li>
              <li>Suzuki Wagon R & Fit Hatchbacks</li>
              <li>Toyota Prius Hybrid Sedan</li>
              <li>Toyota Dolphin Touring Van</li>
              <li>Bajaj Tuk-Tuks, Pulsar & CBR</li>
            </ul>
          </div>

          {/* Assistance */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4">
              ASSISTANCE
            </h4>
            <div className="space-y-2.5">
              <div>
                <span className="block text-[10px] text-zinc-500 uppercase">24/7 Roadside Hotline</span>
                <a
                  href="tel:+94755189759"
                  className="text-sm font-black text-[#00e599] hover:underline"
                >
                  +94 75 518 9759
                </a>
              </div>
              <div>
                <span className="block text-[10px] text-zinc-500 uppercase">Owner Email</span>
                <a
                  href="mailto:dhilshanmohamed2002@gmail.com"
                  className="text-xs text-zinc-300 hover:text-white break-all"
                >
                  dhilshanmohamed2002@gmail.com
                </a>
              </div>
              <p className="text-[11px] text-zinc-500">
                Nilaveli & Trincomalee Direct Doorstep Handover
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div>
            © {new Date().getFullYear()} Trinco Prime Rentals (Pvt) Ltd. All rights reserved. Daily vehicle rentals in Trincomalee.
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <span className="hover:text-zinc-400 cursor-pointer">Terms & Conditions</span>
            <span>•</span>
            <span className="hover:text-zinc-400 cursor-pointer">Insurance Policy</span>
            <span>•</span>
            <span className="hover:text-zinc-400 cursor-pointer">Self-Drive Guidelines</span>
          </div>
        </div>

        {/* 3D Model Credit */}
        <div className="mt-4 text-center text-[10px] text-zinc-600">
          3D Model: &ldquo;Honda Vezel e:HEV RS (HR-V)&rdquo; from Sketchfab, rendered with React Three Fiber.
        </div>
      </div>
    </footer>
  );
}
