"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Sparkles, Compass, CreditCard, LayoutDashboard, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Collection", href: "/templates", icon: Compass },
  { label: "Stationery Cards", href: "/cards", icon: Sparkles },
  { label: "Pricing & Plans", href: "/pricing", icon: CreditCard },
  { label: "My Invitations", href: "/dashboard", icon: LayoutDashboard },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Keep standalone invitation and full-screen previews completely immersion-focused
  if (pathname.startsWith("/preview") || pathname.startsWith("/i/")) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FFFDF8]/90 backdrop-blur-md border-b border-[#E7DDD0]/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        {/* Brand Monogram */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#321C32] to-[#241323] flex items-center justify-center border border-[#C6A15B]/30 shadow-sm transition-transform duration-300 group-hover:scale-105">
            <Sparkles size={16} className="text-[#C6A15B]" />
          </div>
          <div className="flex flex-col">
            <span
              className="text-2xl font-bold tracking-tight text-[#321C32] transition-colors group-hover:text-[#241323]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              INVITO
            </span>
            <span className="text-[9px] tracking-[0.25em] uppercase text-[#756C67] -mt-1 font-medium">
              Digital Studio
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all duration-200 ${
                  active
                    ? "bg-[#321C32] text-[#FFFDF8] shadow-sm"
                    : "text-[#756C67] hover:text-[#321C32] hover:bg-[#F2EBDC]/60"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/templates">
            <button className="btn-primary text-xs py-2 px-4 shadow-sm hover:shadow">
              Explore Designs
            </button>
          </Link>
        </div>

        {/* Mobile menu hamburger */}
        <button
          className="md:hidden p-2 text-[#756C67] hover:text-[#321C32] rounded-lg transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle Navigation"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-[#E7DDD0] bg-[#FFFDF8] px-5 py-5 shadow-xl"
          >
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? "bg-[#321C32] text-[#FFFDF8]"
                        : "text-[#756C67] hover:text-[#321C32] hover:bg-[#F2EBDC]"
                    }`}
                  >
                    <Icon size={16} />
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-3 mt-1 border-t border-[#E7DDD0]">
                <Link href="/templates" onClick={() => setOpen(false)}>
                  <button className="btn-primary w-full text-sm py-3 justify-center">
                    Explore Invitations
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
