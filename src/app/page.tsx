"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/hero/Hero";
import Fleet from "@/components/Fleet";
import WhyChoose from "@/components/WhyChoose";
import BookingForm from "@/components/booking/BookingForm";
import Reviews from "@/components/Reviews";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { FLEET } from "@/lib/fleet";

export default function Home() {
  const [selectedVehicleId, setSelectedVehicleId] = useState(FLEET[0].id);
  const [searchCriteria, setSearchCriteria] = useState<{
    vehicleType?: string;
    location?: string;
    rentalDate?: string;
    pickupTime?: string;
  } | null>(null);

  const handleSelectVehicle = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    const bookingSection = document.getElementById("booking");
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleHeroSearch = (criteria: {
    vehicleType: string;
    location: string;
    rentalDate: string;
    pickupTime: string;
  }) => {
    setSearchCriteria(criteria);
    const bookingSection = document.getElementById("booking");
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-[#080a0f] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-black">
      {/* Fixed Navbar */}
      <Navbar />

      {/* 1. Hero Section with 3D Vezel intro */}
      <Hero onSearch={handleHeroSearch} />

      {/* 2. Fleet Section with filters */}
      <Fleet onSelectVehicle={handleSelectVehicle} />

      {/* 3. Why Choose Trinco Prime */}
      <WhyChoose />

      {/* 4. 3-Step Booking Form with live calculation */}
      <BookingForm
        selectedVehicleId={selectedVehicleId}
        onVehicleChange={setSelectedVehicleId}
        searchCriteria={searchCriteria}
      />

      {/* 5. Guest Reviews */}
      <Reviews />

      {/* 6. Contact & Dispatch Desk */}
      <Contact />

      {/* 7. Footer */}
      <Footer />
    </main>
  );
}
