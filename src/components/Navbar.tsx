"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Globe } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "HOME", href: "#hero" },
    { name: "FLEET", href: "#fleet" },
    { name: "WHY US", href: "#why-choose" },
    { name: "BOOKING", href: "#booking" },
    { name: "REVIEWS", href: "#reviews" },
    { name: "CONTACT", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#080a0f]/90 backdrop-blur-md border-b border-white/10 shadow-lg py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo + Brand */}
          <Link href="#hero" className="flex items-center gap-3 group">
            <div className="relative w-12 h-6 sm:w-14 sm:h-7 overflow-hidden rounded bg-black flex items-center justify-center border border-white/10">
              <Image
                src="/logo.jpg"
                alt="Trinco Prime Rentals"
                fill
                className="object-contain p-0.5 filter brightness-110"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-[#00e599] transition-colors">
                Trinco Prime Rentals
              </span>
              <div className="flex items-center gap-1.5 -mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e599] animate-pulse"></span>
                <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                  Trincomalee, LK
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-bold tracking-wider text-zinc-300 hover:text-[#00e599] transition-colors relative py-1"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3.5">
            {/* Language Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-zinc-300">
              <Globe className="w-3.5 h-3.5 text-zinc-400" />
              <span>EN</span>
              <span className="text-zinc-600 text-[10px]">|</span>
              <span className="text-zinc-500 text-[11px]">LK</span>
            </div>

            {/* Book Now Button */}
            <a
              href="#booking"
              className="px-5 py-2 rounded-full bg-white text-black font-extrabold text-xs tracking-wider uppercase hover:bg-[#00e599] hover:text-black transition-all duration-200 shadow-md hover:shadow-[0_0_20px_rgba(0,229,153,0.4)]"
            >
              BOOK NOW
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href="#booking"
              className="px-3 py-1.5 rounded-full bg-[#00e599] text-black font-bold text-xs uppercase"
            >
              Book
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-300 hover:text-white"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0d14] border-b border-white/10 px-6 py-5 transition-all">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-bold tracking-wider text-zinc-300 hover:text-[#00e599] py-1 border-b border-white/5"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>Language: English (v1)</span>
              </div>
              <a
                href="#booking"
                onClick={() => setMobileMenuOpen(false)}
                className="px-5 py-2 rounded-full bg-[#00e599] text-black font-bold text-xs uppercase"
              >
                Book Now
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
