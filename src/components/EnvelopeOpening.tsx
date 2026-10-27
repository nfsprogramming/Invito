"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, ChevronDown } from "lucide-react";

interface EnvelopeOpeningProps {
  brideName: string;
  groomName: string;
  eventName: string;
  onOpen: () => void;
}

export function EnvelopeOpening({
  brideName,
  groomName,
  eventName,
  onOpen,
}: EnvelopeOpeningProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => {
      onOpen();
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-[#241323] text-[#FFFDF8] overflow-hidden select-none"
      style={{
        backgroundImage: "radial-gradient(ellipse at center, rgba(198,161,91,0.15) 0%, rgba(36,19,35,0.95) 75%)",
      }}
    >
      {/* Subtle floating gold particle dust */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-[#E8D7AE]"
            style={{
              top: `${(i * 19) % 90}%`,
              left: `${(i * 27) % 90}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + (i % 3),
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-lg w-full text-center">
        {/* Subtle greeting header */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xs uppercase tracking-[0.3em] text-[#C6A15B] mb-6 font-semibold"
        >
          Special Delivery · You Are Cordially Invited
        </motion.p>

        {/* ── 3D Stationery Envelope Composition ── */}
        <div className="relative w-full max-w-[420px] h-[280px] sm:h-[300px] perspective-[1000px] cursor-pointer" onClick={handleOpen}>
          {/* Envelope Back Body */}
          <div className="absolute inset-0 bg-[#321C32] rounded-2xl border border-[#C6A15B]/40 shadow-2xl overflow-hidden envelope-shadow">
            {/* Inner Silk Lining Pattern */}
            <div className="absolute inset-2 rounded-xl bg-gradient-to-b from-[#241323] via-[#321C32] to-[#241323] border border-[#C6A15B]/20 flex flex-col items-center justify-center p-6 text-center">
              <span className="text-[10px] uppercase tracking-widest text-[#C6A15B] font-semibold mb-1">
                {eventName || "Wedding Celebration"}
              </span>
              <h2
                className="text-2xl sm:text-3xl font-bold text-[#FFFDF8] tracking-tight mb-2"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {groomName || "Groom"} &amp; {brideName || "Bride"}
              </h2>
              <div className="w-12 h-0.5 bg-[#C6A15B]/50 mx-auto mt-2" />
            </div>
          </div>

          {/* Invitation Card Inside that rises up when clicked */}
          <motion.div
            initial={{ y: 0 }}
            animate={isOpen ? { y: -140, scale: 1.02 } : { y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-4 bottom-3 h-[250px] bg-[#FFFDF8] rounded-xl border border-[#C6A15B]/60 p-6 shadow-xl flex flex-col items-center justify-center text-center text-[#2A2423] z-20"
          >
            <div className="w-8 h-8 rounded-full bg-[#321C32] flex items-center justify-center text-[#C6A15B] mb-2 shadow-sm">
              <Sparkles size={14} />
            </div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#756C67] font-semibold mb-1">
              Celebration of Marriage
            </p>
            <h3
              className="text-xl sm:text-2xl font-bold text-[#321C32]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {groomName} &amp; {brideName}
            </h3>
            <span className="text-[11px] text-[#756C67] italic font-serif mt-1">
              Tap to enter ceremony website
            </span>
          </motion.div>

          {/* Envelope Front Flap & Wax Seal (flips open) */}
          <motion.div
            initial={{ rotateX: 0 }}
            animate={isOpen ? { rotateX: -175 } : { rotateX: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            style={{ transformOrigin: "top" }}
            className="absolute top-0 inset-x-0 h-36 bg-[#382038] border-t border-x border-[#C6A15B]/50 rounded-t-2xl z-30 flex flex-col items-center justify-end pb-3 shadow-md"
          >
            {/* Wax Seal Emblem */}
            <motion.div
              animate={isOpen ? { scale: 0.8, opacity: 0 } : { scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-[#D8B772] via-[#C6A15B] to-[#9E7832] border-2 border-[#E8D7AE] shadow-xl flex items-center justify-center text-[#241323] cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            >
              <Heart size={20} fill="#241323" />
            </motion.div>
          </motion.div>
        </div>

        {/* Action Prompt */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 space-y-3"
        >
          <button
            onClick={handleOpen}
            className="btn-gold text-sm py-3 px-8 shadow-xl hover:shadow-2xl"
          >
            Open Invitation
          </button>
          <div>
            <button
              onClick={onOpen}
              className="text-xs text-[#E8D7AE]/70 hover:text-[#E8D7AE] underline underline-offset-4 transition-colors"
            >
              Skip directly to celebration site
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
