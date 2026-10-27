"use client";
import { InvitationData } from "@/lib/store";
import { CountdownTimer } from "@/components/CountdownTimer";
import { motion } from "framer-motion";

// Generic fallback template for Engagement, Haldi, Mehendi, Reception, Sangeet
export function GenericTemplate({ data, preview = false }: { data: InvitationData; preview?: boolean }) {
  const eventDate = data.eventDate || "2025-02-14";

  const themeMap: Record<string, { bg: string; accent: string; icon: string; label: string }> = {
    "royal-engagement": { bg: "linear-gradient(180deg,#1a0a2e,#4a0a72,#1a0a2e)", accent: "#c9a84c", icon: "💍", label: "Engagement" },
    "haldi-vibes": { bg: "linear-gradient(180deg,#7c3400,#d97706,#7c3400)", accent: "#fbbf24", icon: "💛", label: "Haldi Ceremony" },
    "mehendi-magic": { bg: "linear-gradient(180deg,#052e16,#166534,#052e16)", accent: "#84cc16", icon: "🌿", label: "Mehendi Night" },
    "grand-reception": { bg: "linear-gradient(180deg,#0a0a0f,#1a1a26,#0a0a0f)", accent: "#d4a853", icon: "✨", label: "Reception" },
    "sangeet-night": { bg: "linear-gradient(180deg,#1a0a2e,#7c3aed,#1a0a2e)", accent: "#ec4899", icon: "🎶", label: "Sangeet Night" },
  };

  const theme = themeMap[data.templateId] || themeMap["grand-reception"];

  return (
    <div
      className="no-select relative min-h-screen flex flex-col items-center"
      style={{ background: theme.bg, fontFamily: "'Cormorant Garamond', serif", color: "#f0ede8" }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="w-full h-2" style={{ background: `linear-gradient(90deg,${theme.accent},rgba(255,255,255,0.3),${theme.accent})` }} />

      {/* Floating icons */}
      <div className="flex gap-6 pt-10 z-10">
        {[theme.icon, "✦", theme.icon].map((e, i) => (
          <motion.span key={i} className="text-4xl" animate={{ y: [0, -10, 0] }} transition={{ duration: 2.5 + i * 0.5, repeat: Infinity }}>
            {e}
          </motion.span>
        ))}
      </div>

      <motion.div className="text-center px-6 mt-6 z-10" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
        <p className="text-sm tracking-[0.3em] uppercase mb-3" style={{ color: theme.accent }}>— {theme.label} —</p>
        <div className="divider-gold mb-6" />
        <h1 className="text-5xl sm:text-6xl font-bold" style={{ color: "#f0ede8", textShadow: `0 0 30px ${theme.accent}66` }}>
          {data.brideName}
        </h1>
        <div className="my-3 flex items-center justify-center gap-4">
          <div className="h-px w-16" style={{ background: theme.accent }} />
          <span className="text-2xl" style={{ color: theme.accent }}>&amp;</span>
          <div className="h-px w-16" style={{ background: theme.accent }} />
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold" style={{ color: "#f0ede8", textShadow: `0 0 30px ${theme.accent}66` }}>
          {data.groomName}
        </h1>
        <p className="text-lg mt-4 italic" style={{ color: theme.accent }}>{data.eventName}</p>
      </motion.div>

      {/* Photo */}
      <motion.div
        className="relative w-44 h-44 rounded-full overflow-hidden border-4 mt-8 mx-auto z-10"
        style={{ borderColor: theme.accent, boxShadow: `0 0 40px ${theme.accent}66` }}
        animate={{ boxShadow: [`0 0 20px ${theme.accent}33`, `0 0 50px ${theme.accent}77`, `0 0 20px ${theme.accent}33`] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        {data.couplePhoto ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={data.couplePhoto} alt="Couple" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
            <span className="text-5xl">{theme.icon}</span>
            <p className="text-xs mt-2" style={{ color: theme.accent }}>Add Your Photo</p>
          </div>
        )}
      </motion.div>

      {/* Event info */}
      <motion.div className="mt-8 w-full max-w-md px-6 z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <div className="rounded-2xl p-6 text-center" style={{ background: `${theme.accent}14`, border: `1px solid ${theme.accent}44` }}>
          <p className="text-sm uppercase tracking-widest mb-2" style={{ color: theme.accent }}>📅 Date &amp; Time</p>
          <p className="text-xl font-semibold">
            {new Date(eventDate).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
          <p className="text-lg mt-1" style={{ color: theme.accent }}>{data.eventTime}</p>
          <div className="my-4" style={{ borderTop: `1px solid ${theme.accent}33` }} />
          <p className="text-sm uppercase tracking-widest mb-2" style={{ color: theme.accent }}>📍 Venue</p>
          <p className="text-lg font-semibold">{data.venue}</p>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>{data.venueAddress}</p>
        </div>
      </motion.div>

      <div className="mt-6 px-8 max-w-md text-center z-10">
        <p className="italic text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          &ldquo;{data.customMessage}&rdquo;
        </p>
      </div>

      {!preview && (
        <div className="mt-8 w-full max-w-md px-6 z-10">
          <p className="text-center text-sm uppercase tracking-widest mb-4" style={{ color: theme.accent }}>Counting down…</p>
          <CountdownTimer targetDate={eventDate} />
        </div>
      )}

      <div className="mt-8 text-center px-6 pb-10 z-10">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Hosted by</p>
        <p className="text-base font-semibold mt-1" style={{ color: theme.accent }}>{data.hostNames}</p>
        <p className="mt-3 text-sm" style={{ color: "var(--text-muted)" }}>
          RSVP: <a href={`tel:${data.rsvpPhone}`} style={{ color: theme.accent }}>{data.rsvpPhone}</a>
        </p>
      </div>
      <div className="w-full h-2" style={{ background: `linear-gradient(90deg,${theme.accent},rgba(255,255,255,0.3),${theme.accent})` }} />
    </div>
  );
}
