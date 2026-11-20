"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const whatsappUrl =
    "https://wa.me/94755189759?text=Hi%20Trinco%20Prime%20Rentals,%20I%20am%20interested%20in%20booking%20a%20vehicle.";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp with Trinco Prime Rentals"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#00e599] hover:bg-[#00ffaa] text-black font-bold text-xs uppercase tracking-wider rounded-full shadow-[0_4px_25px_rgba(0,229,153,0.4)] hover:shadow-[0_6px_35px_rgba(0,229,153,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 group"
    >
      <div className="w-5 h-5 flex items-center justify-center">
        <MessageCircle className="w-5 h-5 fill-black stroke-none group-hover:scale-110 transition-transform" />
      </div>
      <span className="hidden sm:inline font-black tracking-wide">CHAT ON WHATSAPP</span>
    </a>
  );
}
