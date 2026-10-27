"use client";
import { motion } from "framer-motion";
import { CheckCircle, Zap, Star, Crown, GraduationCap, LucideIcon, Sparkles } from "lucide-react";
import { PRICING_TIERS, PricingTierId } from "@/lib/templates";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import Link from "next/link";

const TIER_ICONS: Record<string, LucideIcon> = {
  "free-preview": Sparkles,
  "card-basic": Zap,
  "website-basic": Star,
  combo: Crown,
  premium: Crown,
};

const FAQ = [
  {
    q: "Can I preview my custom wedding details before paying?",
    a: "Yes, absolutely! Every single template can be customized with your names, photos, date, and venue for free in our real-time studio.",
  },
  {
    q: "What is included in the Studio Suite (Combo)?",
    a: "The Studio Suite includes the complete interactive website (with wax seal envelope opening, ceremony countdown, and RSVP management) plus matching high-resolution WhatsApp and Instagram story cards.",
  },
  {
    q: "Can I make edits after purchasing?",
    a: "Yes! You have unlimited editing privileges for a full year from your purchase date, allowing you to update timings, venues, or messages whenever needed.",
  },
  {
    q: "How does the guest RSVP system work?",
    a: "Guests can respond with acceptance, decline, or tentative status, specify headcount, and write personal blessings. All responses appear privately in your Creator Dashboard and can be exported as a CSV spreadsheet.",
  },
  {
    q: "Is Razorpay payment secure?",
    a: "Yes. All payments are processed via Razorpay's 256-bit SSL encrypted PCI-DSS compliant payment gateway with instant server verification.",
  },
];

export default function PricingPage() {
  const { setPricingTier } = useStore();
  const router = useRouter();

  const handleSelectTier = (tierId: PricingTierId) => {
    setPricingTier(tierId);
    router.push("/templates");
  };

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 min-h-screen bg-[#F8F3EA] text-[#2A2423]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="badge-gold text-[10px] mb-3 bg-[#FFFDF8] border-[#C6A15B]/30 shadow-sm">
            Simple &amp; Transparent
          </span>
          <h1
            className="text-4xl sm:text-5xl font-bold text-[#321C32] mt-2 mb-3 tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Transparent Studio <span className="text-[#C6A15B] italic font-cormorant font-normal">Pricing</span>
          </h1>
          <p className="text-sm text-[#756C67]">
            Preview any design with your names completely free. Pay only when you are in love with your final invitation.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-20">
          {PRICING_TIERS.map((tier, i) => {
            const Icon = TIER_ICONS[tier.id] || Zap;
            return (
              <div
                key={tier.id}
                className={`stationery-card p-6 flex flex-col justify-between relative bg-[#FFFDF8] border transition-all duration-300 ${
                  tier.featured
                    ? "border-[#C6A15B] shadow-hover ring-1 ring-[#C6A15B]/50 -translate-y-1.5"
                    : "border-[#E7DDD0]"
                }`}
              >
                {tier.highlightBadge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#C6A15B] text-[#241323] shadow-sm">
                    {tier.highlightBadge}
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-[#321C32] flex items-center justify-center text-[#C6A15B] shrink-0 shadow-sm">
                      <Icon size={16} />
                    </div>
                    <div>
                      <h3
                        className="font-bold text-base text-[#321C32]"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      >
                        {tier.name}
                      </h3>
                      <p className="text-[10px] text-[#756C67] line-clamp-1">
                        {tier.description}
                      </p>
                    </div>
                  </div>

                  <div className="mb-5 pb-4 border-b border-[#E7DDD0]">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-[#321C32]">
                        {tier.price === 0 ? "Free" : `${tier.currency}${tier.price}`}
                      </span>
                      {tier.price > 0 && (
                        <span className="text-[11px] text-[#756C67]">one-time</span>
                      )}
                    </div>
                  </div>

                  {/* Feature Bullets */}
                  <ul className="space-y-2.5 mb-6 text-xs text-[#756C67]">
                    {tier.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <CheckCircle size={14} className="text-[#C6A15B] shrink-0 mt-0.5" />
                        <span className="leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleSelectTier(tier.id)}
                  className={`w-full text-xs py-2.5 rounded-xl font-semibold transition-all ${
                    tier.featured
                      ? "btn-primary shadow-md"
                      : "btn-outline bg-[#F8F3EA] hover:bg-[#F2EBDC]"
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        <div className="stationery-card p-6 sm:p-10 bg-[#FFFDF8] border border-[#E7DDD0] mb-20 overflow-x-auto">
          <div className="text-center mb-8">
            <h3
              className="text-2xl font-bold text-[#321C32]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Comprehensive Plan Comparison
            </h3>
            <p className="text-xs text-[#756C67] mt-1">
              Select the perfect suite tailored for your wedding distribution
            </p>
          </div>

          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E7DDD0] text-[11px] uppercase tracking-wider text-[#756C67]">
                <th className="py-3 px-4">Feature Offering</th>
                <th className="py-3 px-3 text-center">Studio Preview</th>
                <th className="py-3 px-3 text-center">Card Only</th>
                <th className="py-3 px-3 text-center">Website Only</th>
                <th className="py-3 px-3 text-center font-bold text-[#321C32]">Studio Suite (Combo)</th>
                <th className="py-3 px-3 text-center">Atelier Concierge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7DDD0]/60">
              {[
                { feature: "Live Interactive Preview", free: true, card: true, web: true, combo: true, prem: true },
                { feature: "Multi-Event Ceremony Itinerary", free: true, card: false, web: true, combo: true, prem: true },
                { feature: "Offline-Ready HTML File Download", free: false, card: false, web: true, combo: true, prem: true },
                { feature: "Matching WhatsApp Card (PNG)", free: false, card: true, web: false, combo: true, prem: true },
                { feature: "Printable PDF Stationery Card", free: false, card: true, web: false, combo: true, prem: true },
                { feature: "Wax Seal Envelope Opening Animation", free: false, card: false, web: true, combo: true, prem: true },
                { feature: "Guest RSVP Collection & CSV Export", free: false, card: false, web: false, combo: true, prem: true },
                { feature: "Full Offline ZIP Archive", free: false, card: false, web: false, combo: true, prem: true },
                { feature: "AI Copywriting Assistant Unlocked", free: false, card: false, web: false, combo: false, prem: true },
                { feature: "1 Year Unlimited Re-Edits", free: false, card: false, web: true, combo: true, prem: true },
              ].map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-[#F8F3EA]/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-[#2A2423]">{row.feature}</td>
                  <td className="py-3 px-3 text-center">{row.free ? <CheckCircle size={14} className="text-[#C6A15B] mx-auto" /> : "—"}</td>
                  <td className="py-3 px-3 text-center">{row.card ? <CheckCircle size={14} className="text-[#C6A15B] mx-auto" /> : "—"}</td>
                  <td className="py-3 px-3 text-center">{row.web ? <CheckCircle size={14} className="text-[#C6A15B] mx-auto" /> : "—"}</td>
                  <td className="py-3 px-3 text-center bg-[#F8F3EA]/30 font-bold">{row.combo ? <CheckCircle size={14} className="text-[#527A61] mx-auto" /> : "—"}</td>
                  <td className="py-3 px-3 text-center">{row.prem ? <CheckCircle size={14} className="text-[#C6A15B] mx-auto" /> : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FAQs Section */}
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="text-center mb-8">
            <h3
              className="text-2xl font-bold text-[#321C32]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Frequently Asked Questions
            </h3>
          </div>

          {FAQ.map((item, idx) => (
            <div
              key={idx}
              className="stationery-card p-5 bg-[#FFFDF8] border border-[#E7DDD0] space-y-1.5"
            >
              <h4 className="text-sm font-bold text-[#321C32]">{item.q}</h4>
              <p className="text-xs text-[#756C67] leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
