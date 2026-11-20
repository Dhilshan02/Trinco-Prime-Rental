import { NextRequest, NextResponse } from "next/server";
import { bookingSchema } from "@/lib/validation";
import { calculateBookingPrice } from "@/lib/pricing";
import { sendBookingEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
    const { allowed } = checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { ok: false, error: "Too many requests. Please try again in 10 minutes or message us on WhatsApp." },
        { status: 429 }
      );
    }

    // 2. Parse body
    const body = await req.json();

    // 3. Honeypot check (bots fill out the hidden website field)
    if (body.website) {
      // Silently succeed to fool spam bots
      return NextResponse.json({ ok: true });
    }

    // 4. Validate with Zod
    const result = bookingSchema.safeParse(body);
    if (!result.success) {
      const errorMsg = result.error.errors.map((e) => e.message).join(", ");
      return NextResponse.json({ ok: false, error: errorMsg }, { status: 400 });
    }

    const bookingData = result.data;

    // 5. Calculate live price server-side
    const pricing = calculateBookingPrice({
      vehicleId: bookingData.vehicleId,
      driverOption: bookingData.driverOption,
      pickupDate: bookingData.pickupDate,
      returnDate: bookingData.returnDate,
      airportPickup: bookingData.airportPickup,
    });

    // 6. Send email directly to owner
    await sendBookingEmail(bookingData, pricing);

    return NextResponse.json({ ok: true, pricing });
  } catch (error) {
    console.error("Booking API error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to process booking request. Please message our WhatsApp hotline directly." },
      { status: 500 }
    );
  }
}
