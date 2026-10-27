"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Calendar,
  Volume2,
  VolumeX,
  Share2,
  Sparkles,
  Download,
  MapPin,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { TEMPLATES } from "@/lib/templates";
import { TemplateRenderer } from "@/components/templates/TemplateRenderer";
import { EnvelopeOpening } from "@/components/EnvelopeOpening";
import { GuestRSVPModal } from "@/components/GuestRSVPModal";
import { ShareSheetModal } from "@/components/ShareSheetModal";
import { getGoogleCalendarUrl, downloadICSFile } from "@/lib/calendar";
import toast from "react-hot-toast";

export default function GuestInvitationPage() {
  const { slug } = useParams<{ slug: string }>();
  const { invitation, setTemplate } = useStore();

  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [calendarMenuOpen, setCalendarMenuOpen] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Match slug to template or use current invitation
  const matchedTemplate = TEMPLATES.find((t) => t.id === slug) ||
    TEMPLATES.find((t) => t.id === invitation.templateId) ||
    TEMPLATES[0];

  const templateId = matchedTemplate.id;

  useEffect(() => {
    if (matchedTemplate && invitation.templateId !== matchedTemplate.id) {
      setTemplate(matchedTemplate.id);
    }
  }, [matchedTemplate, invitation.templateId, setTemplate]);

  const toggleSound = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(
        "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=ambient-wedding-music-112191.mp3"
      );
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }

    if (audioPlaying) {
      audioRef.current.pause();
      setAudioPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setAudioPlaying(true);
    }
  };

  const handleEnvelopeOpen = () => {
    setEnvelopeOpened(true);
    toggleSound();
  };

  const calendarParams = {
    title: `${invitation.groomName} & ${invitation.brideName} — ${invitation.eventName}`,
    description: `${invitation.customMessage}\n\nVenue: ${invitation.venue}\nAddress: ${invitation.venueAddress}`,
    location: `${invitation.venue}, ${invitation.venueAddress}`,
    startDate: invitation.eventDate || "2026-11-28",
    startTime: invitation.eventTime || "09:30 AM",
  };

  const currentUrl = typeof window !== "undefined" ? window.location.href : `https://invito.app/i/${slug}`;

  return (
    <div className="relative min-h-screen bg-black text-[#FFFDF8] overflow-x-hidden">
      {/* ── 1. Luxury Envelope Opening Overlay ── */}
      <AnimatePresence>
        {!envelopeOpened && (
          <EnvelopeOpening
            brideName={invitation.brideName}
            groomName={invitation.groomName}
            eventName={invitation.eventName}
            onOpen={handleEnvelopeOpen}
          />
        )}
      </AnimatePresence>

      {/* ── 2. Full Standalone Template Viewport ── */}
      <main className="w-full min-h-screen">
        <TemplateRenderer templateId={templateId} previewMode={false} />
      </main>

      {/* ── 3. Floating Luxury Guest Concierge Bar ── */}
      {envelopeOpened && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 sm:gap-3 bg-[#FFFDF8]/95 backdrop-blur-xl px-4 sm:px-5 py-2.5 rounded-full border border-[#E7DDD0] shadow-2xl text-[#2A2423]"
        >
          {/* RSVP Button */}
          <button
            onClick={() => setRsvpOpen(true)}
            className="btn-primary text-xs py-2 px-4 shadow-sm flex items-center gap-1.5"
          >
            <Heart size={13} fill="#FFFDF8" />
            <span>RSVP Now</span>
          </button>

          {/* Calendar Button & Menu */}
          <div className="relative">
            <button
              onClick={() => setCalendarMenuOpen(!calendarMenuOpen)}
              className="p-2 rounded-full border border-[#E7DDD0] hover:bg-[#F2EBDC] transition-colors text-[#756C67] hover:text-[#321C32]"
              title="Add to Calendar"
            >
              <Calendar size={15} />
            </button>

            {calendarMenuOpen && (
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 bg-[#FFFDF8] border border-[#E7DDD0] rounded-xl shadow-xl p-1.5 space-y-1 text-xs">
                <a
                  href={getGoogleCalendarUrl(calendarParams)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setCalendarMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg hover:bg-[#F8F3EA] text-[#2A2423] transition-colors"
                >
                  📅 Google Calendar
                </a>
                <button
                  onClick={() => {
                    downloadICSFile(calendarParams);
                    setCalendarMenuOpen(false);
                    toast.success("Calendar invite downloaded!");
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#F8F3EA] text-[#2A2423] transition-colors"
                >
                  🍏 Apple / Outlook (.ics)
                </button>
              </div>
            )}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-full border transition-colors ${
              audioPlaying
                ? "bg-[#C6A15B]/20 border-[#C6A15B] text-[#8E6B24]"
                : "border-[#E7DDD0] text-[#756C67] hover:bg-[#F2EBDC]"
            }`}
            title={audioPlaying ? "Mute music" : "Play ceremony ambience"}
          >
            {audioPlaying ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>

          {/* Share Button */}
          <button
            onClick={() => setShareOpen(true)}
            className="p-2 rounded-full border border-[#E7DDD0] hover:bg-[#F2EBDC] transition-colors text-[#756C67] hover:text-[#321C32]"
            title="Share with Family"
          >
            <Share2 size={15} />
          </button>
        </motion.div>
      )}

      {/* ── 4. Interactive Modals ── */}
      <GuestRSVPModal
        isOpen={rsvpOpen}
        onClose={() => setRsvpOpen(false)}
        brideName={invitation.brideName}
        groomName={invitation.groomName}
        eventName={invitation.eventName}
      />

      <ShareSheetModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        brideName={invitation.brideName}
        groomName={invitation.groomName}
        eventName={invitation.eventName}
        shareUrl={currentUrl}
      />
    </div>
  );
}
