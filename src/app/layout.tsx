import type { Metadata } from "next";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  metadataBase: new URL("https://trincoprimerental.lk"),
  title: "Trinco Prime Rentals | Premier Vehicle & Scooter Rental Trincomalee",
  description:
    "Pristine cars, vans, tuk-tuks, and bikes for one-day rental in Trincomalee, Sri Lanka. Full insurance included, free doorstep delivery in Nilaveli & Trinco, transparent daily rates, no hidden fees.",
  keywords: [
    "Trincomalee car rental",
    "Trinco scooter rental",
    "tuk tuk rental Trincomalee",
    "Nilaveli vehicle hire",
    "Sri Lanka vehicle rental",
    "Honda Vezel rental Trincomalee",
  ],
  authors: [{ name: "Trinco Prime Rentals" }],
  openGraph: {
    title: "Trinco Prime Rentals | Drive Trincomalee in Prime Style",
    description:
      "One-day vehicle rentals in Trincomalee. Cars, vans, tuk-tuks & bikes. Free doorstep delivery in Nilaveli & Trinco.",
    url: "https://trincoprimerental.lk",
    siteName: "Trinco Prime Rentals",
    images: [
      {
        url: "/fleet/toyota-c-hr.jpg",
        width: 1200,
        height: 630,
        alt: "Trinco Prime Rentals Fleet",
      },
    ],
    locale: "en_LK",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoRental",
    name: "Trinco Prime Rentals",
    image: "https://trincoprimerental.lk/logo.jpg",
    telephone: "+94755189759",
    email: "dhilshanmohamed2002@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Main Street & Nilaveli Beach Road",
      addressLocality: "Trincomalee",
      addressRegion: "Eastern Province",
      addressCountry: "LK",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 8.5874,
      longitude: 81.2152,
    },
    url: "https://trincoprimerental.lk",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "06:00",
        closes: "22:00",
      },
    ],
    priceRange: "LKR 3,500 - LKR 24,000",
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-[#080a0f] text-slate-100 min-h-screen selection:bg-emerald-500 selection:text-black">
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
