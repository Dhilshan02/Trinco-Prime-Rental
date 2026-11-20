import { z } from "zod";

export const bookingSchema = z.object({
  vehicleType: z.string().min(1, "Vehicle type is required"),
  vehicleId: z.string().min(1, "Please select a vehicle"),
  driverOption: z.enum(["with_driver", "self_drive"]),
  pickupLocation: z.string().min(2, "Pickup location is required"),
  dropoffLocation: z.string().min(2, "Drop-off location is required"),
  pickupDate: z.string().min(1, "Pickup date is required"),
  pickupTime: z.string().min(1, "Pickup time is required"),
  returnDate: z.string().min(1, "Return date is required"),
  returnTime: z.string().min(1, "Return time is required"),
  passengers: z.string().default("2 Passengers"),
  airportPickup: z.boolean().default(false),
  // Step 2: Contact
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().min(8, "Valid phone or WhatsApp number is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  notes: z.string().optional(),
  // Honeypot field for anti-spam
  website: z.string().optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const contactSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(8, "Valid phone or WhatsApp number is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  message: z.string().min(5, "Message must be at least 5 characters"),
  website: z.string().optional(), // Honeypot
});

export type ContactInput = z.infer<typeof contactSchema>;
