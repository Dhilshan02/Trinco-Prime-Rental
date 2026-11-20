"use client";

import React, { useState, useEffect } from "react";
import { FLEET, Vehicle } from "@/lib/fleet";
import { calculateBookingPrice } from "@/lib/pricing";
import Summary from "./Summary";
import {
  Car,
  Truck,
  Bike,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Plane,
  User,
  Phone,
  Mail,
  FileText,
  MessageCircle,
} from "lucide-react";

interface BookingFormProps {
  selectedVehicleId: string;
  onVehicleChange: (id: string) => void;
}

export default function BookingForm({
  selectedVehicleId,
  onVehicleChange,
}: BookingFormProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [vehicleType, setVehicleType] = useState<"cars" | "vans" | "tuktuks" | "bikes">("cars");
  const [vehicleId, setVehicleId] = useState(selectedVehicleId || FLEET[0].id);
  const [driverOption, setDriverOption] = useState<"with_driver" | "self_drive">("with_driver");
  const [pickupLocation, setPickupLocation] = useState("Nilaveli Beach Resort Area");
  const [dropoffLocation, setDropoffLocation] = useState("Nilaveli Beach Resort Area");
  const [pickupDate, setPickupDate] = useState("2025-03-01");
  const [pickupTime, setPickupTime] = useState("09:00");
  const [returnDate, setReturnDate] = useState("2025-03-05");
  const [returnTime, setReturnTime] = useState("09:00");
  const [passengers, setPassengers] = useState("2 Passengers");
  const [airportPickup, setAirportPickup] = useState(false);

  // Step 2 Customer fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [website, setWebsite] = useState(""); // Honeypot

  // Form status
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Sync when prop changes
  useEffect(() => {
    if (selectedVehicleId) {
      setVehicleId(selectedVehicleId);
      const vehicle = FLEET.find((v) => v.id === selectedVehicleId);
      if (vehicle) setVehicleType(vehicle.category);
    }
  }, [selectedVehicleId]);

  const currentVehicle = FLEET.find((v) => v.id === vehicleId) || FLEET[0];

  // Vehicles matching selected type
  const availableVehicles = FLEET.filter((v) => v.category === vehicleType);

  // Calculate pricing live
  const pricing = calculateBookingPrice({
    vehicleId,
    driverOption,
    pickupDate,
    returnDate,
    airportPickup,
  });

  const handleTypeSelect = (type: "cars" | "vans" | "tuktuks" | "bikes") => {
    setVehicleType(type);
    const firstOfCategory = FLEET.find((v) => v.category === type);
    if (firstOfCategory) {
      setVehicleId(firstOfCategory.id);
      onVehicleChange(firstOfCategory.id);
      if (type === "bikes") {
        setDriverOption("self_drive");
      }
    }
  };

  const handleVehicleSelect = (id: string) => {
    setVehicleId(id);
    onVehicleChange(id);
  };

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupDate || !returnDate) {
      setErrorMessage("Please select valid pickup and return dates.");
      return;
    }
    setErrorMessage("");
    setStep(2);
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      setErrorMessage("Full Name and Phone/WhatsApp number are required.");
      return;
    }
    setErrorMessage("");
    setStep(3);
  };

  const handleSubmitBooking = async () => {
    setSubmitting(true);
    setErrorMessage("");

    try {
      const payload = {
        vehicleType,
        vehicleId,
        driverOption,
        pickupLocation,
        dropoffLocation,
        pickupDate,
        pickupTime,
        returnDate,
        returnTime,
        passengers,
        airportPickup,
        fullName,
        phone,
        email,
        notes,
        website,
      };

      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(
        err.message || "Failed to submit booking. Please contact our WhatsApp hotline directly."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const locationOptions = [
    "Nilaveli Beach Resort Area",
    "Uppuveli Beach Hotel Strip",
    "Trincomalee Town / Railway Station",
    "China Bay Airport (TRR)",
    "Marble Beach Resort",
    "Koneswaram Temple Area",
    "Custom Hotel / Villa Delivery",
  ];

  return (
    <section id="booking" className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/25 text-emerald-400 text-[11px] font-bold tracking-widest uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e599]"></span>
            <span>SEAMLESS RESERVATIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Book Your Ride
          </h2>
          <p className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed">
            Fill in the details and we will confirm via WhatsApp or email shortly.
          </p>
        </div>

        {/* Stepper Tabs */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
            {[
              { num: 1, label: "Trip" },
              { num: 2, label: "Your Details" },
              { num: 3, label: "Review" },
            ].map((s) => {
              const active = step === s.num;
              const completed = step > s.num;
              return (
                <div
                  key={s.num}
                  className={`flex items-center justify-center gap-2 py-3 px-2 rounded-xl border transition-all ${
                    active
                      ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-400"
                      : completed
                      ? "bg-white/5 border-white/10 text-zinc-300"
                      : "bg-white/5 border-transparent text-zinc-500"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                      active
                        ? "bg-[#00e599] text-black"
                        : completed
                        ? "bg-white/20 text-white"
                        : "bg-white/10 text-zinc-500"
                    }`}
                  >
                    {completed ? "✓" : s.num}
                  </span>
                  <span className="text-xs sm:text-sm font-bold truncate">
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form & Summary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive Form (7 Cols) */}
          <div className="lg:col-span-7 glass-panel rounded-2xl p-6 sm:p-8">
            {submitted ? (
              /* Success State */
              <div className="py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-[#00e599] flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">
                  Reservation Request Received!
                </h3>
                <p className="text-sm text-zinc-300 max-w-md mx-auto mb-6 leading-relaxed">
                  Thank you, <span className="text-white font-bold">{fullName}</span>! We have emailed your reservation for the{" "}
                  <span className="text-[#00e599] font-bold">{currentVehicle.name}</span> to our dispatch desk.
                </p>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 max-w-md mx-auto mb-8 text-left text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Booking Vehicle:</span>
                    <span className="text-white font-bold">{currentVehicle.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Pickup Date:</span>
                    <span className="text-white">{pickupDate} ({pickupTime})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Estimated Total:</span>
                    <span className="text-[#00e599] font-bold">LKR {pricing.total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={`https://wa.me/94755189759?text=Hi%20Trinco%20Prime%20Rentals,%20I%20just%20submitted%20a%20booking%20request%20for%20${encodeURIComponent(currentVehicle.name)}%20(${pickupDate}).%20My%20name%20is%20${encodeURIComponent(fullName)}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#00e599] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                  >
                    <MessageCircle className="w-4 h-4 fill-black" />
                    <span>Confirm Instantly via WhatsApp</span>
                  </a>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setStep(1);
                    }}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-colors"
                  >
                    Book Another Vehicle
                  </button>
                </div>
              </div>
            ) : (
              <>
                {errorMessage && (
                  <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Step 1: Trip & Vehicle Selection */}
                {step === 1 && (
                  <form onSubmit={handleNextStep1} className="space-y-6">
                    <div>
                      <h3 className="text-lg font-black text-white mb-1">
                        Trip & Vehicle Selection
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Select from our 10 vehicles and set your rental details.
                      </p>
                    </div>

                    {/* Vehicle Type Filter */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                        VEHICLE TYPE
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { id: "cars", label: "Car" },
                          { id: "vans", label: "Van" },
                          { id: "tuktuks", label: "Tuk-Tuk" },
                          { id: "bikes", label: "Bike / Scooter" },
                        ].map((t) => (
                          <button
                            type="button"
                            key={t.id}
                            onClick={() => handleTypeSelect(t.id as any)}
                            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                              vehicleType === t.id
                                ? "bg-emerald-950/50 border-emerald-500 text-emerald-400 shadow-sm"
                                : "bg-white/5 border-white/5 text-zinc-400 hover:text-white"
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Selected Vehicle Dropdown */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                        SELECTED VEHICLE
                      </label>
                      <select
                        value={vehicleId}
                        onChange={(e) => handleVehicleSelect(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        {availableVehicles.map((v) => (
                          <option key={v.id} value={v.id} className="bg-[#0f141c] text-white">
                            {v.name} ({v.categoryLabel}) — LKR {v.dailyRate.toLocaleString()} / day
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Driver Option */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                        DRIVER OPTION
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div
                          onClick={() => setDriverOption("with_driver")}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                            driverOption === "with_driver"
                              ? "bg-emerald-950/40 border-emerald-500 text-white"
                              : "bg-white/5 border-white/5 text-zinc-400 hover:border-white/15"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs">With Driver / Chauffeur</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-400">
                              Popular
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400">
                            English/Tamil guide • +LKR 3,500/day
                          </p>
                        </div>

                        <div
                          onClick={() => setDriverOption("self_drive")}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                            driverOption === "self_drive"
                              ? "bg-emerald-950/40 border-emerald-500 text-white"
                              : "bg-white/5 border-white/5 text-zinc-400 hover:border-white/15"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs">Self Drive</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-zinc-300">
                              Freedom
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400">
                            Requires valid IDP or SL Permit
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Pickup & Drop-off Locations */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                          PICK-UP LOCATION
                        </label>
                        <select
                          value={pickupLocation}
                          onChange={(e) => setPickupLocation(e.target.value)}
                          className="w-full px-3.5 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
                        >
                          {locationOptions.map((loc) => (
                            <option key={loc} value={loc} className="bg-[#0f141c]">
                              {loc}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                          DROP-OFF LOCATION
                        </label>
                        <select
                          value={dropoffLocation}
                          onChange={(e) => setDropoffLocation(e.target.value)}
                          className="w-full px-3.5 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
                        >
                          {locationOptions.map((loc) => (
                            <option key={loc} value={loc} className="bg-[#0f141c]">
                              {loc}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Dates & Times */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                          PICKUP DATE & TIME
                        </label>
                        <div className="flex gap-1.5">
                          <input
                            type="date"
                            value={pickupDate}
                            onChange={(e) => setPickupDate(e.target.value)}
                            required
                            className="w-2/3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-medium"
                          />
                          <input
                            type="time"
                            value={pickupTime}
                            onChange={(e) => setPickupTime(e.target.value)}
                            required
                            className="w-1/3 px-2 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                          RETURN DATE & TIME
                        </label>
                        <div className="flex gap-1.5">
                          <input
                            type="date"
                            value={returnDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                            required
                            className="w-2/3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-medium"
                          />
                          <input
                            type="time"
                            value={returnTime}
                            onChange={(e) => setReturnTime(e.target.value)}
                            required
                            className="w-1/3 px-2 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                          PASSENGERS
                        </label>
                        <select
                          value={passengers}
                          onChange={(e) => setPassengers(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-medium"
                        >
                          <option className="bg-[#0f141c]">1-2 Passengers</option>
                          <option className="bg-[#0f141c]">3-4 Passengers</option>
                          <option className="bg-[#0f141c]">5-7 Passengers</option>
                          <option className="bg-[#0f141c]">8-14 Passengers</option>
                        </select>
                      </div>
                    </div>

                    {/* Airport delivery checkbox */}
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="airportPickup"
                        checked={airportPickup}
                        onChange={(e) => setAirportPickup(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded accent-emerald-500 cursor-pointer"
                      />
                      <label htmlFor="airportPickup" className="text-xs text-zinc-300 cursor-pointer">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <Plane className="w-3.5 h-3.5 text-emerald-400" />
                          Flight arrival pickup at China Bay Airport / Bandaranaike International
                        </span>
                        <span className="block text-[11px] text-zinc-400 mt-0.5">
                          Complimentary placard greeting and flight delay tracking included.
                        </span>
                      </label>
                    </div>

                    {/* Step 1 Next Button */}
                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-[#00e599] hover:bg-[#00ffaa] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
                    >
                      <span>NEXT: CUSTOMER DETAILS</span>
                      <ArrowRight className="w-4 h-4 stroke-[3]" />
                    </button>
                  </form>
                )}

                {/* Step 2: Customer Details */}
                {step === 2 && (
                  <form onSubmit={handleNextStep2} className="space-y-6">
                    <div>
                      <h3 className="text-lg font-black text-white mb-1">
                        Customer & Contact Information
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Where should we send your booking confirmation and driver handover pin?
                      </p>
                    </div>

                    {/* Hidden Honeypot */}
                    <input
                      type="text"
                      name="website"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="hidden"
                      tabIndex={-1}
                      autoComplete="off"
                    />

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                        FULL NAME *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. John Doe / Mohamed Dhilshan"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                          PHONE / WHATSAPP NUMBER *
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+94 7X XXX XXXX"
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                          EMAIL ADDRESS (OPTIONAL)
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                        SPECIAL REQUESTS / HOTEL OR FLIGHT DETAILS
                      </label>
                      <div className="relative">
                        <FileText className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                        <textarea
                          rows={3}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Let us know your hotel name, child seat requirements, or arrival flight number..."
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-emerald-500 resize-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="w-1/3 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-white/10 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>BACK</span>
                      </button>
                      <button
                        type="submit"
                        className="w-2/3 py-3.5 rounded-xl bg-[#00e599] hover:bg-[#00ffaa] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
                      >
                        <span>NEXT: REVIEW & SUBMIT</span>
                        <ArrowRight className="w-4 h-4 stroke-[3]" />
                      </button>
                    </div>
                  </form>
                )}

                {/* Step 3: Review & Final Submit */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-black text-white mb-1">
                        Review Reservation Request
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Please verify your details before sending the request to our dispatch team.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-zinc-400">Vehicle:</span>
                        <span className="font-bold text-white">{currentVehicle.name}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-zinc-400">Rental Period:</span>
                        <span className="text-white">
                          {pickupDate} ({pickupTime}) to {returnDate} ({returnTime}) • {pricing.days} Days
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-zinc-400">Driver Option:</span>
                        <span className="text-emerald-400 font-bold">
                          {driverOption === "with_driver" ? "Chauffeur Service Included" : "Self Drive"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-zinc-400">Pickup Location:</span>
                        <span className="text-white">{pickupLocation}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-zinc-400">Customer Name:</span>
                        <span className="text-white font-bold">{fullName}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-zinc-400">Phone / WhatsApp:</span>
                        <span className="text-white font-bold">{phone}</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-zinc-300">
                      💡 No payment required now. Our team will verify availability and send you the vehicle handover confirmation via WhatsApp immediately.
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        disabled={submitting}
                        className="w-1/3 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-white/10 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>BACK</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmitBooking}
                        disabled={submitting}
                        className="w-2/3 py-3.5 rounded-xl bg-[#00e599] hover:bg-[#00ffaa] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,229,153,0.4)] transition-all disabled:opacity-50"
                      >
                        {submitting ? (
                          <span>SENDING REQUEST...</span>
                        ) : (
                          <>
                            <span>CONFIRM & SUBMIT REQUEST</span>
                            <ArrowRight className="w-4 h-4 stroke-[3]" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right: Live Reservation Summary (5 Cols) */}
          <div className="lg:col-span-5">
            <Summary
              vehicle={currentVehicle}
              pricing={pricing}
              driverOption={driverOption}
              pickupLocation={pickupLocation}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
