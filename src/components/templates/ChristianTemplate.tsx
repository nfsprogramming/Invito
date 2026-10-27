"use client";
import { CountdownTimer } from "@/components/CountdownTimer";
import { InvitationData } from "@/lib/store";
import { motion } from "framer-motion";

interface ChristianTemplateProps {
  data: InvitationData;
  preview?: boolean;
}

export function ChristianTemplate({ data, preview = false }: ChristianTemplateProps) {
  const eventDate = data.eventDate || "2025-02-14";

  return (
    <div
      className="no-select relative min-h-screen flex flex-col items-center"
      style={{
        background: "linear-gradient(180deg, #0d1b3e 0%, #1a2f5a 40%, #0d1b3e 100%)",
        fontFamily: "'Cormorant Garamond', serif",
        color: "#e8e4f0",
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Top border */}
      <div className="w-full h-2" style={{ background: "linear-gradient(90deg, #1a3a6b, #c9a84c, #1a3a6b)" }} />

      {/* Star field background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: "#c9a84c",
              left: `${((i * 19) % 100)}%`,
              top: `${((i * 29) % 60)}%`,
            }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{
              duration: 2 + (i % 3),
              repeat: Infinity,
              delay: (i % 4),
            }}
          />
        ))}
      </div>

      {/* Cathedral arch decoration */}
      <motion.div
        className="mt-10 text-center relative z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2 }}
      >
        {/* Cross */}
        <div className="flex justify-center mb-4">
          <div className="relative w-12 h-16">
            <div
              className="absolute left-1/2 -translate-x-1/2 w-2 h-full rounded-full"
              style={{ background: "#c9a84c" }}
            />
            <div
              className="absolute top-4 left-0 w-full h-2 rounded-full"
              style={{ background: "#c9a84c" }}
            />
          </div>
        </div>
        <p className="text-sm tracking-[0.3em] uppercase" style={{ color: "#c9a84c" }}>
          ✝ — Holy Matrimony — ✝
        </p>
        <div className="divider-gold my-4" />
      </motion.div>

      {/* Names */}
      <motion.div
        className="text-center px-6 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <h1
          className="text-5xl sm:text-6xl font-bold"
          style={{ color: "#e8e4f0", textShadow: "0 0 30px rgba(201,168,76,0.4)" }}
        >
          {data.brideName}
        </h1>
        <div className="my-3 flex items-center justify-center gap-4">
          <div className="h-px w-16" style={{ background: "#c9a84c" }} />
          <span className="text-2xl" style={{ color: "#c9a84c" }}>♡</span>
          <div className="h-px w-16" style={{ background: "#c9a84c" }} />
        </div>
        <h1
          className="text-5xl sm:text-6xl font-bold"
          style={{ color: "#e8e4f0", textShadow: "0 0 30px rgba(201,168,76,0.4)" }}
        >
          {data.groomName}
        </h1>
        <p className="text-lg mt-4 italic" style={{ color: "#c9a84c" }}>
          {data.eventName}
        </p>
      </motion.div>

      {/* Couple photo */}
      <motion.div
        className="relative w-44 h-44 rounded-full overflow-hidden border-4 mt-8 mx-auto z-10"
        style={{ borderColor: "#c9a84c", boxShadow: "0 0 40px rgba(201,168,76,0.35)" }}
        animate={{ boxShadow: ["0 0 20px rgba(201,168,76,0.2)", "0 0 50px rgba(201,168,76,0.5)", "0 0 20px rgba(201,168,76,0.2)"] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        {data.couplePhoto ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={data.couplePhoto} alt="Couple" className="w-full h-full object-cover" />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center"
            style={{ background: "linear-gradient(135deg, #1a2f5a, #2a4a8b)" }}
          >
            <span className="text-5xl">💒</span>
            <p className="text-xs mt-2" style={{ color: "#c9a84c" }}>
              Add Your Photo
            </p>
          </div>
        )}
      </motion.div>

      {/* Petals decoration */}
      <div className="flex justify-center gap-2 mt-4 z-10">
        {["🌸", "🌷", "🌸", "🌷", "🌸"].map((p, i) => (
          <motion.span
            key={i}
            className="text-xl"
            animate={{ y: [0, -6, 0], rotate: [-5, 5, -5] }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
          >
            {p}
          </motion.span>
        ))}
      </div>

      {/* Event details */}
      <motion.div
        className="mt-8 w-full max-w-md px-6 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <div
          className="rounded-2xl p-6 text-center"
          style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.3)" }}
        >
          <p className="text-sm uppercase tracking-widest mb-2" style={{ color: "#c9a84c" }}>
            ⛪ Date &amp; Time
          </p>
          <p className="text-xl font-semibold" style={{ color: "#e8e4f0" }}>
            {new Date(eventDate).toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-lg mt-1" style={{ color: "#c9a84c" }}>
            {data.eventTime}
          </p>

          <div className="my-4" style={{ borderTop: "1px solid rgba(201,168,76,0.25)" }} />

          <p className="text-sm uppercase tracking-widest mb-2" style={{ color: "#c9a84c" }}>
            📍 Venue
          </p>
          <p className="text-lg font-semibold">{data.venue}</p>
          <p className="text-sm mt-1" style={{ color: "#8b9dc3" }}>
            {data.venueAddress}
          </p>
        </div>
      </motion.div>

      {/* Scripture / custom message */}
      <div className="mt-6 px-8 max-w-md text-center z-10">
        <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#c9a84c" }}>
          — A Message —
        </p>
        <p className="italic text-base leading-relaxed" style={{ color: "#b0aac0" }}>
          &ldquo;{data.customMessage}&rdquo;
        </p>
      </div>

      {/* Countdown */}
      {!preview && (
        <div className="mt-8 w-full max-w-md px-6 z-10">
          <p className="text-center text-sm uppercase tracking-widest mb-4" style={{ color: "#c9a84c" }}>
            Awaiting the sacred day
          </p>
          <CountdownTimer targetDate={eventDate} />
        </div>
      )}

      {/* Hosts & RSVP */}
      <div className="mt-8 text-center px-6 pb-8 z-10">
        <p className="text-sm" style={{ color: "#8b9dc3" }}>Blessed by the families of</p>
        <p className="text-base font-semibold mt-1" style={{ color: "#c9a84c" }}>
          {data.hostNames}
        </p>
        <p className="mt-3 text-sm" style={{ color: "#8b9dc3" }}>
          RSVP:{" "}
          <a href={`tel:${data.rsvpPhone}`} style={{ color: "#c9a84c" }}>
            {data.rsvpPhone}
          </a>
        </p>
      </div>

      {/* Bottom border */}
      <div className="w-full h-2" style={{ background: "linear-gradient(90deg, #1a3a6b, #c9a84c, #1a3a6b)" }} />
    </div>
  );
}
