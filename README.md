# Trinco Prime Rentals

> Premier one-day vehicle rental platform for Trincomalee, Sri Lanka. Features a cinematic 3D React Three Fiber hero (Honda Vezel), 3-step live booking engine with direct email dispatch to the owner, dark luxury aesthetic with emerald accents, and responsive mobile-first design.

---

## 🚀 Live Demo & Tech Stack

- **Framework**: [Next.js 15+ (App Router)](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js + [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) + [@react-three/drei](https://github.com/pmndrs/drei)
- **Animation**: [GSAP](https://greensock.com/gsap/) (synchronized text + 3D timeline)
- **Validation**: [Zod](https://zod.dev/)
- **Email Delivery**: [Resend](https://resend.com/) API (direct to owner, zero database needed)
- **Icons**: Lucide React

---

## 📋 Features Implemented

1. **Fixed Navigation Bar**:
   - Supplied white car silhouette logo (`public/logo.jpg`) + "Trinco Prime Rentals" + "Trincomalee, LK" live indicator.
   - Anchor links: Home, Fleet, Why Us, Booking, Reviews, Contact.
   - Language selector pill + "Book Now" CTA with mobile responsive drawer.

2. **Cinematic 3D Hero Section** (`HERO_ANIMATION_SPEC.md`):
   - Left: Headline ("Drive Trincomalee in Prime Style"), short description, value props, "Book Now" & "View Fleet" buttons.
   - Right: 3D Honda Vezel (`public/models/vezel.glb`) rendered via React Three Fiber.
   - **Intro Animation**: Car slides in from offscreen right, text slides in from offscreen left, meeting at `t = 1.6s` to form a cohesive composition with subtle bounce and idle mouse parallax.
   - **Fail-safe**: WebGL ErrorBoundary + poster fallback + reduced-motion support.
   - **Quick Search Bar**: Vehicle type, pickup location, date, time with instant search trigger.

3. **Fleet Showcase**:
   - Filterable categories: All (10), Cars (5), Vans (1), Tuk-Tuks (1), Bikes & Scooters (3).
   - High-fidelity vehicle cards extracted from the official design mockup:
     - Toyota C-HR (LKR 18,500/day)
     - Honda Vezel (LKR 17,000/day)
     - Toyota Prius (LKR 15,500/day)
     - Honda Fit (LKR 12,000/day)
     - Suzuki Wagon R (LKR 9,500/day)
     - Passenger Van - Toyota Dolphin (LKR 24,000/day)
     - Bajaj Tuk-Tuk RE (LKR 4,500/day)
     - Bajaj Pulsar 160 (LKR 4,500/day)
     - Honda Dio 110 (LKR 3,500/day)
     - Honda CBR 150R (LKR 5,500/day)

4. **Why Choose Trinco Prime**:
   - 4 Advantage cards: Airport & Doorstep Delivery, 24/7 Roadside & Chauffeur Support, Transparent & Affordable Rates, Pristine & Fully Insured Fleet.

5. **3-Step Booking Engine (`/api/booking`)**:
   - **Step 1: Trip & Vehicle Selection**: Vehicle type, vehicle dropdown, driver option ("With Driver / Chauffeur" vs "Self Drive"), pickup & drop-off locations, dates, times, airport pickup add-on.
   - **Step 2: Customer Details**: Full name, phone/WhatsApp number, optional email, flight/hotel notes, hidden anti-spam honeypot.
   - **Step 3: Review & Live Summary**: Dynamic duration and live price computation, direct email submission.
   - **Post-Submission**: Success state with instant "Confirm via WhatsApp" shortcut.

6. **Customer Reviews**:
   - Verified 4.9/5 star ratings from global travelers (Switzerland, India, Australia).

7. **Contact Desk & Direct Communication (`/api/contact`)**:
   - Direct inquiry form + Trincomalee dispatch desk panel.
   - Direct phone & WhatsApp hotline: `+94 75 518 9759`
   - Owner email: `dhilshanmohamed2002@gmail.com`
   - Handover location: Main Street & Nilaveli Beach Road, Trincomalee.

8. **Floating WhatsApp Button**:
   - Always-accessible emerald pill button linking directly to WhatsApp chat (`+94 75 518 9759`).

---

## 🛠️ Getting Started

### 1. Clone & Install
```bash
npm install --legacy-peer-deps
```

### 2. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your `RESEND_API_KEY` (get free at [resend.com](https://resend.com)).

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the site.

---

## 🔒 Spam Protection & Security

- **Server-side validation**: All inputs strictly validated using Zod.
- **Honeypot protection**: Hidden form fields fool automated scrapers/bots.
- **Rate limiting**: In-memory IP-based rate limiting (max 5 submissions per 10 minutes).
- **Owner-only emails**: All bookings and inquiries land directly in `dhilshanmohamed2002@gmail.com`.

---

## 📜 Credits & License

- 3D Model: "Honda Vezel e:HEV RS (HR-V)" from Sketchfab (Creative Commons Attribution).
- Designed for **Trinco Prime Rentals (Pvt) Ltd**, Trincomalee, Sri Lanka.
