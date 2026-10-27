"use client";
import { useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { Music, VolumeX } from "lucide-react";
import { useStore } from "@/lib/store";
import { motion } from "framer-motion";

export function MusicToggle() {
  const pathname = usePathname();
  const { musicPlaying, toggleMusic } = useStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [started, setStarted] = useState(false);

  // Standalone invitation pages and previews have their own audio controls
  if (pathname.startsWith("/preview") || pathname.startsWith("/i/")) {
    return null;
  }

  const handleToggle = () => {
    if (!started) {
      audioRef.current = new Audio(
        "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=ambient-wedding-music-112191.mp3"
      );
      audioRef.current.loop = true;
      audioRef.current.volume = 0.25;
      setStarted(true);
    }
    if (musicPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(() => {});
    }
    toggleMusic();
  };

  return (
    <motion.button
      className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-[#321C32] text-[#C6A15B] border border-[#C6A15B]/40 shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
      onClick={handleToggle}
      whileTap={{ scale: 0.92 }}
      title={musicPlaying ? "Pause ambient studio music" : "Play ambient studio music"}
      aria-label="Music toggle"
    >
      {musicPlaying ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          <Music size={18} />
        </motion.div>
      ) : (
        <VolumeX size={18} />
      )}
    </motion.button>
  );
}
