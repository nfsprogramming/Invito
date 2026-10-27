import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MusicToggle } from "@/components/MusicToggle";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Invito — Luxury Digital Invitation Studio",
  description:
    "Handcrafted digital invitations for life's most cherished celebrations. Experience bespoke wedding, engagement, nikah, and festive invitations with real-time preview and luxury envelope experience.",
  keywords: [
    "luxury digital invitation",
    "wedding invitation website",
    "indian wedding invitation",
    "south indian wedding",
    "nikah invitation",
    "christian wedding invitation",
    "invito studio",
    "animated wedding card",
  ],
  openGraph: {
    title: "Invito — Luxury Digital Invitation Studio",
    description: "Your story. Your celebration. Beautifully invited.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Great+Vibes&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-canvas text-ink antialiased selection:bg-gold-light selection:text-plum-dark" suppressHydrationWarning>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3500,
            style: {
              background: "#FFFDF8",
              color: "#2A2423",
              border: "1px solid #E7DDD0",
              boxShadow: "0 10px 25px -5px rgba(50, 28, 50, 0.12), 0 0 1px rgba(198, 161, 91, 0.4)",
              fontFamily: "Inter, sans-serif",
              fontSize: "0.875rem",
              borderRadius: "12px",
              padding: "12px 18px",
            },
          }}
        />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <MusicToggle />
      </body>
    </html>
  );
}
