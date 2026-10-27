"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Heart, Eye, Pencil, ShieldCheck, Download, Music2, Calendar, Check, ChevronRight } from "lucide-react";
import { TEMPLATES, CATEGORIES_FUNCTION, CATEGORIES_CULTURE, Template } from "@/lib/templates";
import { TemplateCard } from "@/components/TemplateCard";
import { TemplateDetailModal } from "@/components/TemplateDetailModal";
import { useStore } from "@/lib/store";

export default function HomePage() {
  const [activePreviewTemplate, setActivePreviewTemplate] = useState<Template | null>(null);
  const [selectedCulture, setSelectedCulture] = useState("All");
  const { setTemplate } = useStore();

  const featuredTemplates = TEMPLATES.filter((t) => t.featured).slice(0, 6);
  const filteredTemplates = selectedCulture === "All"
    ? featuredTemplates
    : TEMPLATES.filter((t) => t.culture === selectedCulture || t.tags.includes(selectedCulture.toLowerCase())).slice(0, 6);

  return (
    <div className="pt-16 overflow-hidden">
      {/* ─── HERO: BESPOKE INVITATION COMPOSITION ─── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 sm:px-6 pt-12 pb-20 bg-gradient-to-b from-[#F8F3EA] via-[#FFFDF8] to-[#F8F3EA]">
        {/* Subtle Decorative Floral/Gold Flourishes */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-[radial-gradient(ellipse_at_top,_rgba(198,161,91,0.12),_transparent_70%)] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Subtle Editorial Monogram Crest */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 badge-gold mb-6 bg-[#FFFDF8] shadow-sm border-[#C6A15B]/30"
          >
            <Sparkles size={12} className="text-[#C6A15B]" />
            <span>Luxury Digital Invitation Studio</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#321C32] mb-6 leading-[1.12]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Create an Invitation{" "}
            <br className="hidden sm:inline" />
            <span className="italic font-normal font-cormorant text-[#C6A15B]">
              Worth Remembering.
            </span>
          </motion.h1>

          {/* Supporting Copy */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-base sm:text-lg md:text-xl text-[#756C67] max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
          >
            Beautiful digital invitations, crafted for life&apos;s most beautiful moments.
            Immersive envelope reveals, ambient celebration music, real-time live preview, and guest RSVP management.
          </motion.p>

          {/* Primary & Secondary CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap gap-3.5 justify-center mb-16"
          >
            <Link href="/templates">
              <button className="btn-primary text-sm sm:text-base py-3.5 px-8 shadow-md hover:shadow-xl group">
                Explore Invitations
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
            <Link href="/editor/south-indian" onClick={() => setTemplate("south-indian")}>
              <button className="btn-outline text-sm sm:text-base py-3.5 px-8 border-[#C6A15B]/50 hover:border-[#C6A15B]">
                Create Yours
              </button>
            </Link>
          </motion.div>

          {/* ── TACTILE INVITATION SHOWCASE COMPOSITION ── */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-w-3xl mx-auto"
          >
            {/* Ambient Shadow Layer */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[#C6A15B]/10 via-[#321C32]/5 to-[#B97878]/10 rounded-[32px] blur-2xl -z-10" />

            {/* Tactile Stationery Envelope & Invitation Card */}
            <div className="stationery-card p-6 sm:p-10 border-2 border-[#E7DDD0] relative bg-[#FFFDF8] shadow-2xl">
              {/* Gold Foil Border Inset */}
              <div className="border border-[#C6A15B]/35 p-6 sm:p-8 rounded-xl relative overflow-hidden bg-gradient-to-b from-[#FFFDF8] via-[#FAF6ED] to-[#FFFDF8]">
                {/* Cultural Crest Emblem */}
                <div className="w-12 h-12 mx-auto rounded-full bg-[#321C32] flex items-center justify-center text-[#C6A15B] mb-4 border border-[#C6A15B]/50 shadow-md">
                  <Sparkles size={20} />
                </div>

                <p className="text-[11px] tracking-[0.3em] uppercase text-[#756C67] font-semibold mb-2">
                  Together With Their Families
                </p>

                <h2
                  className="text-3xl sm:text-5xl font-bold text-[#321C32] mb-3 tracking-tight"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Deepika <span className="text-[#C6A15B] font-light">&amp;</span> Karthik
                </h2>

                <p className="text-xs sm:text-sm text-[#756C67] italic font-serif max-w-md mx-auto mb-6">
                  Joyfully invite you to share in the celebration of their auspicious marriage ceremony
                </p>

                {/* Event Details Ribbon */}
                <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-2.5 px-6 rounded-full bg-[#FFFDF8] border border-[#E7DDD0] text-xs font-medium text-[#2A2423] shadow-sm mb-6">
                  <span>Saturday, November 28, 2026</span>
                  <span className="w-1 h-1 rounded-full bg-[#C6A15B]" />
                  <span>The Leela Palace, Chennai</span>
                  <span className="w-1 h-1 rounded-full bg-[#C6A15B]" />
                  <span>09:30 AM Muhurtham</span>
                </div>

                {/* Quick Live Preview Trigger */}
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setActivePreviewTemplate(TEMPLATES[0])}
                    className="btn-gold text-xs py-2.5 px-5 shadow-sm"
                  >
                    <Eye size={14} />
                    Preview Animated Experience
                  </button>
                  <Link href="/editor/south-indian" onClick={() => setTemplate("south-indian")}>
                    <button className="btn-primary text-xs py-2.5 px-5 shadow-sm">
                      <Pencil size={13} />
                      Personalize This Design
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── OCCASION & CULTURAL GALLERY ─── */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="badge-plum text-[11px] mb-3">
            Handcrafted For Every Sacred Moment
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#321C32] mt-2 mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Explore by <span className="text-[#C6A15B] italic font-cormorant font-normal">Cultural Tradition</span>
          </h2>
          <p className="text-sm sm:text-base text-[#756C67] leading-relaxed">
            From auspicious Vedic Muhurthams and cathedral vows to geometric emerald Nikahs and royal palace galas,
            every Invito template is handcrafted with deep cultural authenticity.
          </p>

          {/* Cultural Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {CATEGORIES_CULTURE.slice(0, 8).map((culture) => (
              <button
                key={culture}
                onClick={() => setSelectedCulture(culture)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  selectedCulture === culture
                    ? "bg-[#321C32] text-[#FFFDF8] shadow-sm"
                    : "bg-[#FFFDF8] text-[#756C67] border border-[#E7DDD0] hover:border-[#C6A15B] hover:text-[#321C32]"
                }`}
              >
                {culture}
              </button>
            ))}
          </div>
        </div>

        {/* Template Showcase Grid */}
        <div className="templates-grid mb-12">
          {filteredTemplates.map((template, idx) => (
            <TemplateCard
              key={template.id}
              template={template}
              index={idx}
              onPreviewClick={(t) => setActivePreviewTemplate(t)}
            />
          ))}
        </div>

        <div className="text-center">
          <Link href="/templates">
            <button className="btn-primary text-sm py-3 px-8 shadow-sm">
              View All {TEMPLATES.length} Wedding &amp; Event Templates
              <ArrowRight size={15} />
            </button>
          </Link>
        </div>
      </section>

      {/* ─── WHY INVITO LUXURY STUDIO ─── */}
      <section className="py-20 px-4 sm:px-6 bg-[#FFFDF8] border-y border-[#E7DDD0]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="badge-gold text-[11px] mb-3">
              The Digital Stationery Studio
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold text-[#321C32] mt-2 mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Everything Your Special Day Deserves
            </h2>
            <p className="text-sm text-[#756C67]">
              Designed to feel like opening an heirloom invitation — with the modern power of real-time RSVPs and effortless guest sharing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Bespoke Envelope Opening",
                description:
                  "Guests tap an exquisite royal wax seal or ribbon envelope that gently unfolds to reveal your invitation with ambient celebration music.",
              },
              {
                icon: Calendar,
                title: "Multi-Event Itineraries",
                description:
                  "Effortlessly coordinate Haldi, Mehendi, Sangeet, Muhurtham, and Reception with individual timings, dress codes, and Google Maps links.",
              },
              {
                icon: ShieldCheck,
                title: "Private RSVP Concierge",
                description:
                  "Receive joyful guest confirmations directly into your private dashboard with guest count tracking and instant CSV export.",
              },
              {
                icon: Music2,
                title: "Curated Celebration Audio",
                description:
                  "Choose from soulful Shehnai, sacred Carnatic Nadaswaram, romantic acoustic strings, or hymnal chimes that respect guest audio preferences.",
              },
              {
                icon: Download,
                title: "Self-Contained HTML Download",
                description:
                  "Own your invitation forever. Download an offline-ready, beautifully packaged HTML file and high-res matching WhatsApp card.",
              },
              {
                icon: Sparkles,
                title: "AI Wording Assistant",
                description:
                  "Never struggle with words. Let our literary AI assistant craft heartfelt love stories, poetic vows, and elegant dress-code notes.",
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="stationery-card p-7 flex flex-col justify-between border border-[#E7DDD0] hover:border-[#C6A15B]/50"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#F8F3EA] border border-[#E7DDD0] flex items-center justify-center text-[#C6A15B] mb-5 shadow-sm">
                      <Icon size={22} />
                    </div>
                    <h3
                      className="text-lg font-bold text-[#321C32] mb-2"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#756C67] leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CALL TO ACTION BANNER ─── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="stationery-card p-10 sm:p-14 text-center relative overflow-hidden bg-gradient-to-br from-[#321C32] to-[#241323] text-[#FFFDF8] border border-[#C6A15B]/30 shadow-2xl">
            {/* Gold foil decorative line */}
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#C6A15B] to-transparent mx-auto mb-6" />

            <h2
              className="text-3xl sm:text-5xl font-bold mb-4 tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Begin Your Celebration Story
            </h2>
            <p className="text-sm sm:text-base text-[#E8D7AE] max-w-xl mx-auto mb-8 font-light leading-relaxed">
              Experience the studio difference. Preview any design for free with your names and details, and pay only when your invitation feels perfect.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/templates">
                <button className="btn-gold text-sm sm:text-base py-3.5 px-8 shadow-lg">
                  Browse Full Collection
                  <ChevronRight size={16} />
                </button>
              </Link>
              <Link href="/pricing">
                <button className="btn-outline text-sm sm:text-base py-3.5 px-8 bg-transparent text-[#FFFDF8] border-white/30 hover:bg-white/10 hover:border-white">
                  View Transparent Pricing
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dedicated Preview Modal with Desktop/Mobile Switcher */}
      <TemplateDetailModal
        template={activePreviewTemplate}
        onClose={() => setActivePreviewTemplate(null)}
      />
    </div>
  );
}
