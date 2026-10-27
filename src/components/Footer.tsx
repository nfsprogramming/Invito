"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Heart, ShieldCheck, Mail, MapPin } from "lucide-react";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/preview") || pathname.startsWith("/i/")) {
    return null;
  }

  return (
    <footer className="border-t border-[#E7DDD0] bg-[#F8F3EA] text-[#2A2423] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-14">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#321C32] flex items-center justify-center border border-[#C6A15B]/30 shadow-sm">
                <Sparkles size={16} className="text-[#C6A15B]" />
              </div>
              <span
                className="text-2xl font-bold tracking-tight text-[#321C32]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                INVITO
              </span>
            </Link>
            <p className="text-sm text-[#756C67] max-w-sm leading-relaxed">
              Bespoke digital invitations crafted for life&apos;s most meaningful celebrations.
              Designed with cultural reverence, emotional warmth, and timeless stationery elegance.
            </p>
            <div className="pt-2 text-xs text-[#9B918A] flex items-center gap-1.5">
              <MapPin size={13} className="text-[#C6A15B]" />
              Handcrafted with devotion in India.
            </div>
          </div>

          {/* Cultural Traditions */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold mb-4 text-[#321C32]">
              Cultural Traditions
            </h4>
            <ul className="space-y-2.5 text-xs text-[#756C67]">
              <li><Link href="/templates?culture=south-indian" className="hover:text-[#321C32] transition-colors">South Indian Hindu</Link></li>
              <li><Link href="/templates?culture=christian" className="hover:text-[#321C32] transition-colors">Christian Matrimony</Link></li>
              <li><Link href="/templates?culture=islamic" className="hover:text-[#321C32] transition-colors">Islamic Nikah &amp; Walima</Link></li>
              <li><Link href="/templates?culture=north-indian" className="hover:text-[#321C32] transition-colors">Rajasthani &amp; North Indian</Link></li>
              <li><Link href="/templates?culture=minimal" className="hover:text-[#321C32] transition-colors">Minimalist Contemporary</Link></li>
            </ul>
          </div>

          {/* Studio Experience */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold mb-4 text-[#321C32]">
              Studio Suite
            </h4>
            <ul className="space-y-2.5 text-xs text-[#756C67]">
              <li><Link href="/templates" className="hover:text-[#321C32] transition-colors">All Invitation Templates</Link></li>
              <li><Link href="/cards" className="hover:text-[#321C32] transition-colors">Stationery WhatsApp Cards</Link></li>
              <li><Link href="/pricing" className="hover:text-[#321C32] transition-colors">Pricing &amp; Packaging</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#321C32] transition-colors">Creator Studio &amp; RSVPs</Link></li>
              <li><Link href="/editor/south-indian" className="hover:text-[#321C32] transition-colors">Customization Studio</Link></li>
            </ul>
          </div>

          {/* Concierge & Legal */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold mb-4 text-[#321C32]">
              Concierge &amp; Legal
            </h4>
            <ul className="space-y-2.5 text-xs text-[#756C67]">
              <li><a href="mailto:concierge@invito.app" className="hover:text-[#321C32] transition-colors flex items-center gap-1.5"><Mail size={12} /> Support Concierge</a></li>
              <li><span className="hover:text-[#321C32] cursor-pointer">Privacy &amp; Guest Protection</span></li>
              <li><span className="hover:text-[#321C32] cursor-pointer">Terms of Service</span></li>
              <li><span className="hover:text-[#321C32] cursor-pointer">Refund Guarantee</span></li>
              <li><span className="hover:text-[#321C32] cursor-pointer">Cookie Settings</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#E7DDD0] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#756C67]">
          <p className="flex items-center gap-1.5">
            © {new Date().getFullYear()} Invito Studio. Made with{" "}
            <Heart size={13} className="text-[#B97878]" fill="currentColor" /> in India.
          </p>
          <div className="flex items-center gap-4 text-[#756C67]">
            <span className="flex items-center gap-1 text-[#527A61]">
              <ShieldCheck size={14} /> 256-Bit SSL Encrypted
            </span>
            <span>·</span>
            <span>Secured by Razorpay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
