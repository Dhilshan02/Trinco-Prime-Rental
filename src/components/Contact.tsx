"use client";

import React, { useState } from "react";
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export default function Contact() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // Honeypot

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, phone, email, message, website }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setSuccess(true);
      setMessage("");
    } catch (err: any) {
      setError(
        err.message || "Unable to send message. Please reach us directly on WhatsApp."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/25 text-emerald-400 text-[11px] font-bold tracking-widest uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e599]"></span>
            <span>GET IN TOUCH</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            We are Here to Guide Your Journey
          </h2>
          <p className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed">
            Have a special request, vehicle preference, or need instant doorstep delivery? Reach out to our 24/7 Trincomalee dispatch desk.
          </p>
        </div>

        {/* 2 Columns: Inquiry Form + Direct Communication */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form (7 Cols) */}
          <div className="lg:col-span-7 glass-panel rounded-2xl p-6 sm:p-8">
            <div className="mb-6">
              <h3 className="text-xl font-black text-white mb-1">
                Send a Direct Inquiry
              </h3>
              <p className="text-xs text-zinc-400">
                Our local team will review your message and reach out in under 15 minutes.
              </p>
            </div>

            {success ? (
              <div className="py-10 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-[#00e599] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white">
                  Message Sent Successfully!
                </h4>
                <p className="text-xs text-zinc-300 max-w-sm mx-auto">
                  Thank you! We will reply via WhatsApp or phone shortly.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-5 py-2.5 rounded-full bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot */}
                <input
                  type="text"
                  name="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                {error && (
                  <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+94 75 518 9759"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Your message, arrival date, vehicle preference, or hotel location... *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you need and our local dispatch team will arrange everything..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#00e599] hover:bg-[#00ffaa] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span>SENDING...</span>
                  ) : (
                    <>
                      <span>SEND MESSAGE</span>
                      <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Direct Info (5 Cols) */}
          <div className="lg:col-span-5 glass-card rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block mb-1">
                TRINCOMALEE DISPATCH DESK
              </span>
              <h3 className="text-2xl font-black text-white">
                Direct Communication
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              {/* Phone */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/5 border border-white/5">
                <Phone className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    24/7 HOTLINE
                  </span>
                  <a
                    href="tel:+94755189759"
                    className="text-base font-black text-white hover:text-emerald-400 transition-colors"
                  >
                    +94 75 518 9759
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/5 border border-white/5">
                <MessageCircle className="w-4 h-4 text-[#00e599] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    WHATSAPP DISPATCH
                  </span>
                  <a
                    href="https://wa.me/94755189759"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-white hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                  >
                    <span>+94 75 518 9759</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">
                      Instant Chat
                    </span>
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/5 border border-white/5">
                <Mail className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    EMAIL DISPATCH
                  </span>
                  <a
                    href="mailto:dhilshanmohamed2002@gmail.com"
                    className="text-xs font-semibold text-white hover:text-emerald-400 transition-colors"
                  >
                    dhilshanmohamed2002@gmail.com
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/5 border border-white/5">
                <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    HANDOVER LOCATION
                  </span>
                  <p className="text-xs font-medium text-white">
                    Main Street & Nilaveli Beach Road, Trincomalee
                  </p>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/5 border border-white/5">
                <Clock className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    OPERATING HOURS
                  </span>
                  <p className="text-xs font-medium text-white">
                    Daily 06:00 AM - 10:00 PM (24/7 Roadside Hotline)
                  </p>
                </div>
              </div>
            </div>

            {/* Coverage Box */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs">
              <div className="flex items-center justify-between text-emerald-400 font-bold mb-1">
                <span>Trincomalee Coastal Zone</span>
                <span className="text-[10px] underline">Open Map</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Covers Nilaveli, Uppuveli, China Bay Airport (TRR), Marble Beach, and Koneswaram.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
