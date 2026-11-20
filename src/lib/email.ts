import { Resend } from "resend";
import { BookingInput, ContactInput } from "./validation";
import { PriceBreakdown } from "./pricing";

const OWNER_EMAIL = process.env.OWNER_EMAIL || "dhilshanmohamed2002@gmail.com";
const RESEND_API_KEY = process.env.RESEND_API_KEY;

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

export async function sendBookingEmail(booking: BookingInput, pricing: PriceBreakdown) {
  const colomboTime = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "medium",
    timeZone: "Asia/Colombo",
  }).format(new Date());

  const cleanPhone = booking.phone.replace(/[^0-9]/g, "");
  const waLink = `https://wa.me/${cleanPhone}`;
  const callLink = `tel:${booking.phone}`;

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0d1117; color: #f0f6fc; border-radius: 12px; overflow: hidden; border: 1px solid #30363d;">
      <div style="background: linear-gradient(135deg, #00e599 0%, #059669 100%); padding: 24px; text-align: center;">
        <h1 style="margin: 0; color: #080a0f; font-size: 24px; font-weight: 800;">TRINCO PRIME RENTALS</h1>
        <p style="margin: 4px 0 0 0; color: #080a0f; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">New Booking Request</p>
      </div>
      
      <div style="padding: 24px;">
        <div style="background-color: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <h2 style="margin: 0 0 12px 0; color: #00e599; font-size: 18px;">Vehicle & Trip Details</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="color: #8b949e; padding: 6px 0;">Vehicle:</td><td style="font-weight: 700; color: #ffffff;">${pricing.vehicleName}</td></tr>
            <tr><td style="color: #8b949e; padding: 6px 0;">Driver Option:</td><td style="color: #ffffff;">${booking.driverOption === "with_driver" ? "With Professional Chauffeur" : "Self Drive"}</td></tr>
            <tr><td style="color: #8b949e; padding: 6px 0;">Pickup Location:</td><td style="color: #ffffff;">${booking.pickupLocation}</td></tr>
            <tr><td style="color: #8b949e; padding: 6px 0;">Drop-off Location:</td><td style="color: #ffffff;">${booking.dropoffLocation}</td></tr>
            <tr><td style="color: #8b949e; padding: 6px 0;">Pickup Date & Time:</td><td style="color: #ffffff;">${booking.pickupDate} at ${booking.pickupTime}</td></tr>
            <tr><td style="color: #8b949e; padding: 6px 0;">Return Date & Time:</td><td style="color: #ffffff;">${booking.returnDate} at ${booking.returnTime}</td></tr>
            <tr><td style="color: #8b949e; padding: 6px 0;">Duration:</td><td style="color: #ffffff;">${pricing.days} Day(s)</td></tr>
            <tr><td style="color: #8b949e; padding: 6px 0;">Passengers:</td><td style="color: #ffffff;">${booking.passengers}</td></tr>
            <tr><td style="color: #8b949e; padding: 6px 0;">Airport Delivery:</td><td style="color: #ffffff;">${booking.airportPickup ? "Yes (Airport Delivery Included)" : "Standard Handover"}</td></tr>
          </table>
        </div>

        <div style="background-color: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <h2 style="margin: 0 0 12px 0; color: #00e599; font-size: 18px;">Customer Information</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="color: #8b949e; padding: 6px 0;">Full Name:</td><td style="font-weight: 700; color: #ffffff;">${booking.fullName}</td></tr>
            <tr><td style="color: #8b949e; padding: 6px 0;">Phone:</td><td><a href="${callLink}" style="color: #58a6ff; text-decoration: none; font-weight: bold;">${booking.phone}</a> (<a href="${waLink}" style="color: #00e599; text-decoration: none;">WhatsApp Chat</a>)</td></tr>
            <tr><td style="color: #8b949e; padding: 6px 0;">Email:</td><td style="color: #ffffff;">${booking.email || "Not provided"}</td></tr>
            ${booking.notes ? `<tr><td style="color: #8b949e; padding: 6px 0;">Special Notes:</td><td style="color: #e6edf3;">${booking.notes}</td></tr>` : ""}
          </table>
        </div>

        <div style="background-color: #161b22; border: 1px solid #00e599; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 16px; font-weight: bold; color: #ffffff;">Estimated Total (${pricing.days} Days):</span>
            <span style="font-size: 22px; font-weight: 800; color: #00e599;">LKR ${pricing.total.toLocaleString()}</span>
          </div>
          <p style="margin: 6px 0 0 0; font-size: 12px; color: #8b949e;">Includes comprehensive insurance and standard local mileage.</p>
        </div>

        <div style="text-align: center; margin-top: 24px;">
          <a href="${waLink}" style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; font-weight: bold; padding: 12px 24px; border-radius: 8px; margin-right: 10px;">Reply on WhatsApp</a>
          <a href="${callLink}" style="display: inline-block; background-color: #21262d; border: 1px solid #30363d; color: #ffffff; text-decoration: none; font-weight: bold; padding: 12px 24px; border-radius: 8px;">Call Customer</a>
        </div>
      </div>

      <div style="background-color: #161b22; padding: 16px; text-align: center; font-size: 12px; color: #8b949e; border-top: 1px solid #30363d;">
        Submitted at ${colomboTime} (Sri Lanka Time) • Trinco Prime Rentals Automated Booking
      </div>
    </div>
  `;

  if (resend) {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "Trinco Prime Rentals <onboarding@resend.dev>",
      to: [OWNER_EMAIL],
      subject: `New booking request: ${pricing.vehicleName} - ${booking.fullName} (${booking.pickupDate})`,
      html: htmlContent,
      replyTo: booking.email || undefined,
    });

    // Optional confirmation email to customer
    if (booking.email) {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || "Trinco Prime Rentals <onboarding@resend.dev>",
        to: [booking.email],
        subject: `Your Booking Request: Trinco Prime Rentals (${pricing.vehicleName})`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #080a0f; color: #fff; border-radius: 8px;">
            <h2 style="color: #00e599;">Thank you for your booking request, ${booking.fullName}!</h2>
            <p>We have received your reservation request for the <strong>${pricing.vehicleName}</strong> on <strong>${booking.pickupDate}</strong>.</p>
            <p>Our team will contact you shortly via WhatsApp or phone (${booking.phone}) to confirm handover details.</p>
            <p>Urgent inquiries? Reach us directly at <strong>+94 75 518 9759</strong>.</p>
            <p style="color: #888; font-size: 12px; margin-top: 30px;">Trinco Prime Rentals • Trincomalee, Sri Lanka</p>
          </div>
        `,
      });
    }
  } else {
    console.log("[EMAIL SIMULATION - NO RESEND API KEY SET]");
    console.log(`Booking for ${booking.fullName}: ${pricing.vehicleName}, total LKR ${pricing.total}`);
  }
}

export async function sendContactEmail(contact: ContactInput) {
  const colomboTime = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "medium",
    timeZone: "Asia/Colombo",
  }).format(new Date());

  const cleanPhone = contact.phone.replace(/[^0-9]/g, "");
  const waLink = `https://wa.me/${cleanPhone}`;
  const callLink = `tel:${contact.phone}`;

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0d1117; color: #f0f6fc; border-radius: 12px; overflow: hidden; border: 1px solid #30363d;">
      <div style="background: linear-gradient(135deg, #00e599 0%, #059669 100%); padding: 20px; text-align: center;">
        <h1 style="margin: 0; color: #080a0f; font-size: 22px; font-weight: 800;">TRINCO PRIME RENTALS</h1>
        <p style="margin: 4px 0 0 0; color: #080a0f; font-size: 13px; font-weight: 600;">Direct Contact Inquiry</p>
      </div>
      
      <div style="padding: 24px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
          <tr><td style="color: #8b949e; padding: 6px 0; width: 120px;">Sender Name:</td><td style="font-weight: 700; color: #ffffff;">${contact.fullName}</td></tr>
          <tr><td style="color: #8b949e; padding: 6px 0;">Phone:</td><td><a href="${callLink}" style="color: #58a6ff; font-weight: bold;">${contact.phone}</a> (<a href="${waLink}" style="color: #00e599;">WhatsApp</a>)</td></tr>
          <tr><td style="color: #8b949e; padding: 6px 0;">Email:</td><td style="color: #ffffff;">${contact.email || "Not provided"}</td></tr>
        </table>

        <div style="background-color: #161b22; border-left: 4px solid #00e599; padding: 14px 18px; border-radius: 4px; font-size: 15px; line-height: 1.6; color: #e6edf3;">
          ${contact.message.replace(/\n/g, "<br/>")}
        </div>

        <div style="text-align: center; margin-top: 24px;">
          <a href="${waLink}" style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; font-weight: bold; padding: 10px 20px; border-radius: 6px; margin-right: 10px;">Reply on WhatsApp</a>
          <a href="${callLink}" style="display: inline-block; background-color: #21262d; border: 1px solid #30363d; color: #ffffff; text-decoration: none; font-weight: bold; padding: 10px 20px; border-radius: 6px;">Call ${contact.phone}</a>
        </div>
      </div>

      <div style="background-color: #161b22; padding: 14px; text-align: center; font-size: 12px; color: #8b949e; border-top: 1px solid #30363d;">
        Received at ${colomboTime} (Asia/Colombo)
      </div>
    </div>
  `;

  if (resend) {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "Trinco Prime Rentals <onboarding@resend.dev>",
      to: [OWNER_EMAIL],
      subject: `New inquiry from ${contact.fullName} (${contact.phone})`,
      html: htmlContent,
      replyTo: contact.email || undefined,
    });
  } else {
    console.log("[EMAIL SIMULATION - NO RESEND API KEY SET]");
    console.log(`Inquiry from ${contact.fullName}: ${contact.message}`);
  }
}
