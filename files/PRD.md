# PRD: Trinco Prime Rentals Website

## 1. Overview
A single-page website where tourists and locals in Trincomalee can browse a fleet of vehicles for **one-day rental** and send a booking request. The owner receives every request directly by email. There is no database and no user accounts.

## 2. Goals
1. Make a strong first impression with a 3D animated hero.
2. Let a visitor pick a vehicle and send a booking request in under 2 minutes.
3. Deliver every request to the owner's inbox reliably.
4. Work well on mobile (most Sri Lankan and tourist traffic).

## 3. Non-goals (v1)
- Online payment, user login, admin dashboard
- Database / stored bookings
- Multi-day tour packages (one-day rental only)
- ID / licence file upload (v2, see section 9)

## 4. Users
| User | Need |
|---|---|
| Tourist | See vehicles and prices, book quickly, WhatsApp the owner |
| Local customer | Same, plus Tamil / Sinhala (v2) |
| Owner | Receive clean booking emails and reply via phone / WhatsApp |

## 5. Page structure (single page, anchor sections)
Top bar only: **fixed navbar** with logo + "Trinco Prime Rentals", links Home, Fleet, Why Us, Booking, Reviews, Contact, and a "Book Now" button. No sidebar, no extra bars.

1. **Hero** - 3D Honda Vezel, big headline, short description, "Book Now" + "View Fleet" buttons, quick search bar (vehicle type, pickup location, date, time).
2. **Fleet** - filter chips (All, Cars, Vans, Tuk-Tuks, Bikes) and cards.
3. **Why Choose Us** - 4 feature cards (airport and doorstep delivery, 24/7 roadside and chauffeur support, transparent and affordable rates, pristine and fully insured fleet).
4. **Booking** - 3-step form with live reservation summary.
5. **Reviews** - 3 testimonial cards, rating summary.
6. **Contact** - inquiry form + direct communication panel (phone, WhatsApp, email, hours, location).
7. **Footer** - quick links, vehicles list, assistance, copyright, model credit.
8. Floating **Chat on WhatsApp** button.

## 6. Content
- Name: **Trinco Prime Rentals**
- Logo: supplied white car silhouette on black (`logo.jpg`); use as-is, do not redraw.
- Hero headline (draft): "Drive Trincomalee in Prime Style" / short description: "Cars, vans, tuk-tuks and bikes for one-day rental. Full insurance, free doorstep delivery in Nilaveli and Trinco, no hidden fees."
- Contact: dhilshanmohamed2002@gmail.com, +94 75 518 9759 (replace the placeholder numbers in the design).

### Fleet and daily rates (from the design)
| Vehicle | Type | Rate (LKR/day) |
|---|---|---|
| Toyota C-HR | Compact SUV | 18,500 |
| Honda Vezel | Compact SUV | 17,000 |
| Toyota Prius | Hybrid sedan | 15,500 |
| Honda Fit | Hatchback | 12,000 |
| Suzuki Wagon R | Small hatchback | 9,500 |
| Passenger Van (Toyota Dolphin) | Touring van | 24,000 |
| Bajaj Tuk-Tuk (RE) | 3-wheeler | 4,500 |
| Bajaj Pulsar 160 | Motorcycle | 4,500 |

Driver option: with driver / self drive. Edit prices only in `lib/fleet.ts`.

## 7. Functional requirements
### 7.1 Hero 3D
- Loads `vezel.glb` (optimized), shows poster image while loading.
- Intro animation per `HERO_ANIMATION_SPEC.md`.
- After intro: gentle idle float and mouse / touch parallax rotation. Drag to rotate (optional).
- Fallback to static image if WebGL is unavailable or `prefers-reduced-motion` is set.

### 7.2 Booking form
Step 1 Trip: vehicle type, vehicle, driver option, pickup and drop-off location, pickup and return date-time, passengers, airport pickup checkbox.
Step 2 Details: full name, phone / WhatsApp, email (optional), notes.
Step 3 Review: summary, submit.
- Live summary: number of days, daily rate, estimated total.
- Validation (client and server): return after pickup, phone format, required fields.
- On submit: POST `/api/booking` -> email to owner (and optional confirmation email to the customer if an email was given).
- Success screen with WhatsApp shortcut; error state with retry and phone fallback.

### 7.3 Contact form
Name, phone, email (optional), message -> `/api/contact` -> owner email.

### 7.4 Email content (to owner)
Subject: `New booking request: {vehicle} - {name} ({pickupDate})`
Body: all fields, computed total, customer phone as a tap-to-call / WhatsApp link, submission time (Asia/Colombo).

## 8. Non-functional requirements
- Lighthouse performance >= 80 mobile, accessibility >= 90.
- Total initial JS and 3D payload reasonable: optimized GLB **under 8 MB**, lazy loaded after first paint.
- Spam protection: honeypot field + server rate limit.
- Secrets only in env vars, never in client code.
- SEO: title, meta description, Open Graph image, `LocalBusiness` JSON-LD.
- Responsive from 360 px up.

## 9. Roadmap
- v1: everything above in English.
- v1.1: Tamil and Sinhala (language switch in the navbar).
- v2: availability calendar, ID / licence upload (email attachment or Vercel Blob), 3D models for more vehicles, Google Maps pickup picker.

## 10. Risks
| Risk | Mitigation |
|---|---|
| Supplied GLB is ~185 MB | Compress with gltf-transform (Draco / Meshopt + WebP textures), target < 8 MB |
| Email lands in spam | Verified sender domain on Resend (or Gmail SMTP), plain clear subject |
| No DB means no booking history | Owner keeps emails; optionally add Google Sheet logging later |
| Model licence | Verify Sketchfab licence, credit author |

## 11. Open questions
1. Final hero position: after the two parts meet, should the car stay right of the text (as in the reference) or sit centered with the headline behind it? Spec assumes **text left, car right, slightly overlapping**.
2. Should the customer get an auto confirmation email when they provide one?
