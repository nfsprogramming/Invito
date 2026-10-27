"use client";
import { CountdownTimer } from "@/components/CountdownTimer";
import { InvitationData } from "@/lib/store";
import { motion } from "framer-motion";

interface IslamicTemplateProps {
  data: InvitationData;
  preview?: boolean;
}

export function IslamicTemplate({ data, preview = false }: IslamicTemplateProps) {
  const eventDate = data.eventDate || "2025-02-14";

  return (
    <div
      className="no-select relative min-h-screen flex flex-col items-center"
      style={{
        background: "linear-gradient(180deg, #0a1f12 0%, #1a4a2e 40%, #0a1f12 100%)",
        fontFamily: "'Cormorant Garamond', serif",
        color: "#e8f0e8",
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Top border */}
      <div className="w-full h-2" style={{ background: "linear-gradient(90deg, #1a4a2e, #c9a84c, #1a4a2e)" }} />

      {/* Geometric pattern overlay */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Crect fill='none' stroke='%23c9a84c' stroke-width='1' x='0' y='0' width='56' height='100'/%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100' fill='none' stroke='%23c9a84c' stroke-width='1'/%3E%3Cpath d='M28 0L28 34L0 50' fill='none' stroke='%23c9a84c' stroke-width='1'/%3E%3Cpath d='M56 50L28 34L28 66' fill='none' stroke='%23c9a84c' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: "56px 100px",
        }}
      />

      {/* Floating lanterns */}
      <div className="relative w-full flex justify-between px-8 pt-8 z-10">
        {["🏮", "✨", "🕌", "✨", "🏮"].map((e, i) => (
          <motion.span
            key={i}
            className="text-3xl"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
          >
            {e}
          </motion.span>
        ))}
      </div>

      {/* Bismillah header */}
      <motion.div
        className="text-center mt-4 px-6 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <p className="text-2xl mb-2" style={{ color: "#c9a84c", direction: "rtl" }}>
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
        </p>
        <p className="text-xs tracking-[0.3em] uppercase" style={{ color: "#4a9e6b" }}>
          In the name of Allah, the Most Gracious
        </p>
        <div className="divider-gold my-4" />
        <p className="text-sm tracking-[0.25em] uppercase" style={{ color: "#c9a84c" }}>
          ☽ — Nikah Ceremony — ☽
        </p>
      </motion.div>

      {/* Names */}
      <motion.div
        className="text-center px-6 mt-4 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h1 className="text-5xl sm:text-6xl font-bold" style={{ color: "#e8f0e8", textShadow: "0 0 30px rgba(201,168,76,0.4)" }}>
          {data.brideName}
        </h1>
        <div className="my-3 flex items-center justify-center gap-4">
          <div className="h-px w-16" style={{ background: "#c9a84c" }} />
          <span className="text-2xl" style={{ color: "#c9a84c" }}>☽ ✦ ☾</span>
          <div className="h-px w-16" style={{ background: "#c9a84c" }} />
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold" style={{ color: "#e8f0e8", textShadow: "0 0 30px rgba(201,168,76,0.4)" }}>
          {data.groomName}
        </h1>
        <p className="text-lg mt-4 italic" style={{ color: "#c9a84c" }}>
          {data.eventName}
        </p>
      </motion.div>

      {/* Couple photo */}
      <motion.div
        className="relative w-44 h-44 mt-8 mx-auto z-10"
        style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
      >
        <motion.div
          className="w-full h-full"
          style={{ border: "4px solid #c9a84c", boxShadow: "0 0 40px rgba(201,168,76,0.4)" }}
          animate={{ boxShadow: ["0 0 20px rgba(201,168,76,0.3)", "0 0 50px rgba(201,168,76,0.6)", "0 0 20px rgba(201,168,76,0.3)"] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {data.couplePhoto ? (
            <img src={data.couplePhoto} alt="Couple" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center" style={{ background: "linear-gradient(135deg, #1a4a2e, #2a6a3e)" }}>
              <span className="text-5xl">🌙</span>
              <p className="text-xs mt-2" style={{ color: "#c9a84c" }}>Add Your Photo</p>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Event details */}
      <motion.div
        className="mt-8 w-full max-w-md px-6 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <div className="rounded-2xl p-6 text-center" style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.3)" }}>
          <p className="text-sm uppercase tracking-widest mb-2" style={{ color: "#c9a84c" }}>🕌 Date &amp; Time</p>
          <p className="text-xl font-semibold" style={{ color: "#e8f0e8" }}>
            {new Date(eventDate).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
          <p className="text-lg mt-1" style={{ color: "#c9a84c" }}>{data.eventTime}</p>
          <div className="my-4" style={{ borderTop: "1px solid rgba(201,168,76,0.25)" }} />
          <p className="text-sm uppercase tracking-widest mb-2" style={{ color: "#c9a84c" }}>📍 Venue</p>
          <p className="text-lg font-semibold">{data.venue}</p>
          <p className="text-sm mt-1" style={{ color: "#4a9e6b" }}>{data.venueAddress}</p>
        </div>
      </motion.div>

      {/* Message */}
      <div className="mt-6 px-8 max-w-md text-center z-10">
        <p className="italic text-base leading-relaxed" style={{ color: "#90a090" }}>
          &ldquo;{data.customMessage}&rdquo;
        </p>
      </div>

      {/* Countdown */}
      {!preview && (
        <div className="mt-8 w-full max-w-md px-6 z-10">
          <p className="text-center text-sm uppercase tracking-widest mb-4" style={{ color: "#c9a84c" }}>
            Counting down to the blessed day
          </p>
          <CountdownTimer targetDate={eventDate} />
        </div>
      )}

      {/* Hosts & RSVP */}
      <div className="mt-8 text-center px-6 pb-8 z-10">
        <p className="text-sm" style={{ color: "#4a9e6b" }}>With blessings from</p>
        <p className="text-base font-semibold mt-1" style={{ color: "#c9a84c" }}>{data.hostNames}</p>
        <p className="mt-3 text-sm" style={{ color: "#4a9e6b" }}>
          RSVP: <a href={`tel:${data.rsvpPhone}`} style={{ color: "#c9a84c" }}>{data.rsvpPhone}</a>
        </p>
        <div className="flex justify-center gap-4 mt-6">
          {["🏮", "🌙", "⭐", "🌙", "🏮"].map((e, i) => (
            <span key={i} className="text-xl animate-float" style={{ animationDelay: `${i * 0.3}s` }}>{e}</span>
          ))}
        </div>
      </div>

      {/* Bottom border */}
      <div className="w-full h-2" style={{ background: "linear-gradient(90deg, #1a4a2e, #c9a84c, #1a4a2e)" }} />
    </div>
  );
}
