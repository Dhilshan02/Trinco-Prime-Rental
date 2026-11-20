# Prompt for Antigravity agent

Paste this into Antigravity, with the files `PRD.md`, `TECH_STACK.md`, `HERO_ANIMATION_SPEC.md`, the design screenshot (`Html___Body.png`), `logo.jpg` and the optimized `vezel.glb` attached in the workspace.

---
Build the website described in PRD.md using the stack in TECH_STACK.md.

Requirements:
1. Next.js (App Router, TypeScript, Tailwind). Single page with anchor sections matching the design screenshot exactly: Hero, Fleet, Why Choose, Booking, Reviews, Contact, Footer, floating WhatsApp button. Dark premium theme with green accent.
2. Top navigation bar only (fixed). Logo = the supplied logo.jpg, site name "Trinco Prime Rentals".
3. Hero: left = headline + short description + buttons, right = 3D Honda Vezel from public/models/vezel.glb via React Three Fiber. Implement the intro exactly as in HERO_ANIMATION_SPEC.md: the car comes from the right to the left, the text comes from the left to the right, and they meet and join into the final composition.
4. Fleet data in src/lib/fleet.ts with the prices from PRD.md; filters All / Cars / Vans / Tuk-Tuks / Bikes.
5. Booking form (3 steps, live total) posting to /api/booking, which validates with zod and emails the owner (dhilshanmohamed2002@gmail.com) directly. No database. Add honeypot and rate limiting.
6. Contact form posting to /api/contact (same email flow).
7. Contact details: dhilshanmohamed2002@gmail.com, +94 75 518 9759 (WhatsApp 94755189759).
8. Responsive, accessible, reduced-motion friendly, with a poster fallback if WebGL fails.
9. Create .env.example, README.md, and make sure `npm run build` passes.

Do not invent extra sections. Ask before changing anything not covered by the docs.
---
