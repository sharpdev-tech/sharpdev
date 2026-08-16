import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["italic", "normal"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${site.domain}`),
  title: {
    default: "SharpDev — Web design & development studio",
    template: "%s — SharpDev",
  },
  description: site.description,
  keywords: [
    "web design studio",
    "Next.js development",
    "Figma web design",
    "SaaS website",
    "e-commerce website",
    "3D website",
    "WebGL",
    "cinematic website",
  ],
  openGraph: {
    title: "SharpDev — Web design & development studio",
    description: site.description,
    url: `https://${site.domain}`,
    siteName: "SharpDev",
    type: "website",
    locale: "en",
  },
  twitter: {
    card: "summary_large_image",
    title: "SharpDev — Web design & development studio",
    description: site.description,
  },
  // Favicons come from the src/app/icon.* file convention.
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#06070a",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "SharpDev",
  description: site.description,
  email: site.email,
  url: `https://${site.domain}`,
  serviceType: [
    "Web design",
    "Web development",
    "SaaS websites",
    "E-commerce websites",
    "3D & WebGL websites",
  ],
  sameAs: site.socials.map((s) => s.href),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${instrument.variable}`}>
      <body className="grain antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Preloader />
        <SmoothScroll />
        <Cursor />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
