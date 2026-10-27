"use client";
import { CountdownTimer } from "@/components/CountdownTimer";
import { InvitationData } from "@/lib/store";
import { motion } from "framer-motion";

interface SouthIndianTemplateProps {
  data: InvitationData;
  preview?: boolean;
}

export function SouthIndianTemplate({ data, preview = false }: SouthIndianTemplateProps) {
  const eventDate = data.eventDate || "2025-02-14";

  return (
    <div
      className="no-select relative min-h-screen flex flex-col items-center"
      style={{
        background: "linear-gradient(180deg, #1a0500 0%, #3d0f00 30%, #1a0500 70%, #0d0300 100%)",
        fontFamily: "'Cormorant Garamond', serif",
        color: "#f5e6c8",
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Decorative top border */}
      <div className="w-full h-2" style={{ background: "linear-gradient(90deg, #8B0000, #D4A017, #8B0000)" }} />

      {/* Kolam pattern overlay */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4A017' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Animated lamp decorations */}
      <div className="relative w-full flex justify-between px-8 pt-8">
        {["🪔", "🌺", "🪔"].map((e, i) => (
          <motion.span
            key={i}
            className="text-4xl"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
          >
            {e}
          </motion.span>
        ))}
      </div>

      {/* Header */}
      <motion.div
        className="text-center mt-4 px-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <p className="text-sm tracking-[0.3em] uppercase" style={{ color: "#D4A017" }}>
          ॐ — Shubh Vivah — ॐ
        </p>
        <div className="divider-gold my-4" />
        <h1
          className="text-5xl sm:text-6xl font-bold leading-tight"
          style={{ color: "#f5e6c8", textShadow: "0 0 30px rgba(212,160,23,0.5)" }}
        >
          {data.brideName}
          <span className="block text-3xl my-2" style={{ color: "#D4A017" }}>
            &amp;
          </span>
          {data.groomName}
        </h1>
        <p className="text-lg mt-3 italic" style={{ color: "#D4A017" }}>
          {data.eventName}
        </p>
      </motion.div>

      {/* Floral divider */}
      <div className="ornament-line w-full max-w-sm px-6 my-6">
        <span style={{ color: "#D4A017", fontSize: "1.5rem" }}>❋</span>
      </div>

      {/* Couple photo / placeholder */}
      <motion.div
        className="relative w-44 h-44 rounded-full overflow-hidden border-4 mx-auto"
        style={{ borderColor: "#D4A017", boxShadow: "0 0 40px rgba(212,160,23,0.4)" }}
        animate={{ boxShadow: ["0 0 20px rgba(212,160,23,0.3)", "0 0 50px rgba(212,160,23,0.6)", "0 0 20px rgba(212,160,23,0.3)"] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        {data.couplePhoto ? (
          <img src={data.couplePhoto} alt="Couple" className="w-full h-full object-cover" />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center"
            style={{ background: "linear-gradient(135deg, #3d0f00, #8B0000)" }}
          >
            <span className="text-5xl">👫</span>
            <p className="text-xs mt-2 text-center px-2" style={{ color: "#D4A017" }}>
              Add Your Photo
            </p>
          </div>
        )}
      </motion.div>

      {/* Event details */}
      <motion.div
        className="mt-8 text-center px-6 w-full max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div
          className="rounded-2xl p-6"
          style={{
            background: "rgba(212,160,23,0.08)",
            border: "1px solid rgba(212,160,23,0.3)",
          }}
        >
          <p className="text-sm uppercase tracking-widest mb-2" style={{ color: "#D4A017" }}>
            📅 Date &amp; Time
          </p>
          <p className="text-xl font-semibold" style={{ color: "#f5e6c8" }}>
            {new Date(eventDate).toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-lg mt-1" style={{ color: "#D4A017" }}>
            {data.eventTime}
          </p>

          <div className="my-4" style={{ borderTop: "1px solid rgba(212,160,23,0.3)" }} />

          <p className="text-sm uppercase tracking-widest mb-2" style={{ color: "#D4A017" }}>
            📍 Venue
          </p>
          <p className="text-lg font-semibold">{data.venue}</p>
          <p className="text-sm mt-1" style={{ color: "#a09a94" }}>
            {data.venueAddress}
          </p>
        </div>
      </motion.div>

      {/* Custom message */}
      <div className="mt-6 px-8 max-w-md text-center">
        <p className="italic text-base leading-relaxed" style={{ color: "#c8b99a" }}>
          &ldquo;{data.customMessage}&rdquo;
        </p>
      </div>

      {/* Countdown */}
      {!preview && (
        <div className="mt-8 w-full max-w-md px-6">
          <p className="text-center text-sm uppercase tracking-widest mb-4" style={{ color: "#D4A017" }}>
            Counting down to the big day
          </p>
          <CountdownTimer targetDate={eventDate} />
        </div>
      )}

      {/* Hosts & RSVP */}
      <div className="mt-8 text-center px-6 pb-8 max-w-md">
        <p className="text-sm" style={{ color: "#a09a94" }}>
          Hosted by
        </p>
        <p className="text-base font-semibold mt-1" style={{ color: "#D4A017" }}>
          {data.hostNames}
        </p>
        <p className="mt-3 text-sm" style={{ color: "#a09a94" }}>
          RSVP:{" "}
          <a href={`tel:${data.rsvpPhone}`} style={{ color: "#D4A017" }}>
            {data.rsvpPhone}
          </a>
        </p>

        {/* Bottom lamp row */}
        <div className="flex justify-center gap-4 mt-6">
          {["🌺", "🪔", "🌸", "🪔", "🌺"].map((e, i) => (
            <span key={i} className="text-xl animate-float" style={{ animationDelay: `${i * 0.3}s` }}>
              {e}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom border */}
      <div className="w-full h-2" style={{ background: "linear-gradient(90deg, #8B0000, #D4A017, #8B0000)" }} />
    </div>
  );
}
