# Tech Stack and Architecture

## 1. Stack
| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15+ (App Router), TypeScript** | Requested; API routes for email, great Vercel deploy |
| Styling | Tailwind CSS | Fast, matches design tokens |
| 3D | three.js + **@react-three/fiber** + **@react-three/drei** | Declarative GLB loading, Environment, ContactShadows, useProgress |
| Animation | **GSAP** (hero timeline) | Precise sync between DOM text and 3D group |
| Forms | react-hook-form + **zod** | Same schema on client and server |
| Email | **Resend** (primary) or Nodemailer + Gmail SMTP | No database needed, direct to owner |
| Icons | lucide-react | |
| Fonts | `next/font` (e.g. Inter / Plus Jakarta Sans) | No layout shift |
| Hosting | Vercel | Free tier is enough |
| Optional | `@vercel/analytics` | Traffic stats |

## 2. Rendering strategy
- Page is mostly Server Components; interactive parts (`Hero`, `BookingForm`, filters) are Client Components.
- 3D scene loaded with `next/dynamic(() => import("./CarScene"), { ssr: false })` so it never blocks first paint.
- Fleet images via `next/image` (WebP/AVIF).

## 3. Booking flow (no database)
```
Browser form -> POST /api/booking -> zod validate -> honeypot + rate limit
   -> send email to OWNER_EMAIL (Resend / SMTP)
   -> (optional) confirmation email to customer
   -> 200 { ok: true } -> success screen
```
Pseudo-code for `src/app/api/booking/route.ts`:
```ts
import { NextResponse } from "next/server";
import { bookingSchema } from "@/lib/validation";
import { sendOwnerEmail } from "@/lib/email";

export async function POST(req: Request) {
  const data = bookingSchema.safeParse(await req.json());
  if (!data.success) return NextResponse.json({ ok: false }, { status: 400 });
  if (data.data.website) return NextResponse.json({ ok: true }); // honeypot
  await sendOwnerEmail(data.data);
  return NextResponse.json({ ok: true });
}
```
**Resend note:** with the default `onboarding@resend.dev` sender you can only send to the email you registered the Resend account with. Register Resend using `dhilshanmohamed2002@gmail.com`, or verify your own domain to send to anyone.
**Gmail SMTP alternative:** enable 2-step verification, create an App Password, put it in `SMTP_PASS`.

Because nothing is stored, the owner's inbox is the booking record. Later option: also append rows to a Google Sheet.

## 4. Data
All vehicle data lives in `src/lib/fleet.ts` as a typed array (id, name, type, seats, transmission, AC, driver options, dailyRate, image, badges). Prices and filters read from it; no CMS in v1.

## 5. 3D model pipeline (IMPORTANT)
The supplied `honda_vezel_ehev_rs_hr-v.glb` is **~185 MB** (521 nodes, 225 meshes, 27 materials, interior + wheel parts). It cannot be served to browsers as is. Optimize:

```bash
# 1) compress + dedupe + prune + resize textures
npx @gltf-transform/cli optimize honda_vezel_ehev_rs_hr-v.glb vezel.glb \
  --compress meshopt --texture-compress webp --texture-size 1024 \
  --simplify true --simplify-ratio 0.25 --simplify-error 0.001

# 2) check size
ls -lh vezel.glb      # target < 8 MB
```
If it is still too big:
- Remove interior and hidden parts in Blender (Decimate modifier, delete seats / dashboard), then export GLB.
- Use Draco instead: `--compress draco` (needs `useGLTF.setDecoderPath` in drei; Meshopt works out of the box).
- Merge meshes / materials (`gltf-transform join`) to cut draw calls.

Load it:
```tsx
const { scene } = useGLTF("/models/vezel.glb");
useGLTF.preload("/models/vezel.glb");
```
Name hints inside the file: `CAR_BODY`, `WHEEL_LF`, `HUB_LF`, `SUSP_LF`, so wheels can be spun during the intro (optional).
Also: the model uses `KHR_materials_transmission` (glass), which is costly; consider replacing with a simple transparent material on mobile.

## 6. Performance checklist
- GLB < 8 MB, lazy loaded, poster image shown first.
- `dpr={[1, 1.5]}`, `frameloop="demand"` after the intro (re-render only on interaction / idle animation).
- Fleet images WebP, widths via `next/image`.
- Fonts with `next/font`.

## 7. Security
- Env secrets server-side only.
- Zod validation on every API route; escape user content in the email HTML.
- Honeypot field + simple in-memory / Upstash rate limit (5 requests / 10 min / IP).

## 8. Testing
- Manual: booking and contact emails arrive, mobile Safari + Chrome Android, slow 4G throttling.
- Optional: Playwright smoke test for the booking form.

## 9. Deployment
1. Push to GitHub, import into Vercel.
2. Add env vars from `.env.example`.
3. Add custom domain later; verify it in Resend for production sending.
