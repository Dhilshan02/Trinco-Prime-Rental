# Trinco Prime Rentals

Single-page, one-day vehicle rental website for **Trinco Prime Rentals**, Trincomalee, Sri Lanka.
Cars, vans, tuk-tuks and bikes. Cinematic 3D hero (Honda Vezel), booking form that emails the owner directly, no database.

## Highlights
- Next.js (App Router) + TypeScript + Tailwind CSS
- 3D hero with React Three Fiber: the car slides in from the **right**, the headline slides in from the **left**, and they meet to form the final hero composition
- Top navigation bar only (fixed, with anchor links to each section)
- Booking form sends the details straight to the business owner's email (server-side, no SQL)
- Dark premium UI with green accent, matching the Stitch design

## Contact (business)
| | |
|---|---|
| Business | Trinco Prime Rentals |
| Email | dhilshanmohamed2002@gmail.com |
| Phone / WhatsApp | +94 75 518 9759 |
| Location | Trincomalee, Sri Lanka |

## Quick start
```bash
npx create-next-app@latest trinco-prime-rentals --ts --tailwind --app --eslint --src-dir
cd trinco-prime-rentals
npm i three @react-three/fiber @react-three/drei gsap zod resend lucide-react
npm i -D @types/three @gltf-transform/cli
cp .env.example .env.local     # fill in the values
npm run dev
```

## Project structure
```
public/
  logo.jpg                      # supplied car silhouette logo
  models/vezel.glb              # OPTIMIZED model (see TECH_STACK.md section 5)
  fleet/*.webp                  # vehicle photos
src/
  app/
    layout.tsx  page.tsx  globals.css
    api/booking/route.ts        # POST: validate + send email
    api/contact/route.ts        # POST: contact inquiry email
  components/
    Navbar.tsx
    hero/Hero.tsx  hero/CarScene.tsx  hero/HeroText.tsx
    Fleet.tsx  FleetCard.tsx  WhyChoose.tsx
    Booking/BookingForm.tsx  Booking/Summary.tsx
    Reviews.tsx  Contact.tsx  Footer.tsx  WhatsAppButton.tsx
  lib/
    fleet.ts                    # vehicle data (single source of truth)
    pricing.ts                  # price = days x daily rate
    email.ts                    # Resend / Nodemailer wrapper
    validation.ts               # zod schemas
```

## Environment variables
See `.env.example`.

## Deploy
Vercel (recommended). Add env vars in the project settings. Booking emails work only if `RESEND_API_KEY` (or SMTP vars) are set.

## Documents
- `PRD.md` product requirements
- `TECH_STACK.md` stack, architecture, 3D optimization, email flow
- `HERO_ANIMATION_SPEC.md` exact hero animation behaviour
- `ANTIGRAVITY_PROMPT.md` ready-to-paste prompt for the Antigravity agent

## Credits
3D model: "Honda Vezel e:HEV RS (HR-V)" from Sketchfab. **Check the model's license and add the required attribution in the footer before launch.**
