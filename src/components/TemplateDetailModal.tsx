"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Smartphone, Monitor, Maximize2, Volume2, VolumeX, Pencil, CheckCircle2, Sparkles, Compass } from "lucide-react";
import Link from "next/link";
import { Template } from "@/lib/templates";
import { useStore } from "@/lib/store";
import { TemplateRenderer } from "@/components/templates/TemplateRenderer";

interface TemplateDetailModalProps {
  template: Template | null;
  onClose: () => void;
}

export function TemplateDetailModal({ template, onClose }: TemplateDetailModalProps) {
  const [deviceView, setDeviceView] = useState<"desktop" | "mobile">("mobile");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { setTemplate } = useStore();

  if (!template) return null;

  const toggleSound = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=ambient-wedding-music-112191.mp3");
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

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          className={`relative w-full bg-[#FFFDF8] border border-[#E7DDD0] rounded-2xl overflow-hidden shadow-2xl flex flex-col ${
            isFullscreen ? "fixed inset-0 rounded-none border-none" : "max-w-6xl max-h-[92vh]"
          }`}
        >
          {/* Top Control Bar */}
          <div className="px-5 py-3.5 border-b border-[#E7DDD0] flex items-center justify-between bg-[#F8F3EA]/90 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-3">
              <span className="badge-plum text-[10px] py-0.5 px-2.5">
                {template.category}
              </span>
              <div>
                <h3
                  className="font-bold text-base text-[#321C32]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {template.name}
                </h3>
                <span className="text-[11px] text-[#756C67]">
                  {template.culture} · {template.style}
                </span>
              </div>
            </div>

            {/* Viewport controls */}
            <div className="flex items-center gap-2">
              <div className="bg-[#E7DDD0]/50 p-1 rounded-xl flex items-center gap-1 border border-[#E7DDD0]">
                <button
                  onClick={() => setDeviceView("mobile")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    deviceView === "mobile"
                      ? "bg-[#FFFDF8] text-[#321C32] shadow-sm font-semibold"
                      : "text-[#756C67] hover:text-[#321C32]"
                  }`}
                  title="Mobile phone view"
                >
                  <Smartphone size={13} />
                  <span className="hidden sm:inline">Mobile Frame</span>
                </button>
                <button
                  onClick={() => setDeviceView("desktop")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    deviceView === "desktop"
                      ? "bg-[#FFFDF8] text-[#321C32] shadow-sm font-semibold"
                      : "text-[#756C67] hover:text-[#321C32]"
                  }`}
                  title="Desktop canvas view"
                >
                  <Monitor size={13} />
                  <span className="hidden sm:inline">Desktop</span>
                </button>
              </div>

              {/* Sound Toggle */}
              <button
                onClick={toggleSound}
                className={`p-2 rounded-xl border transition-all ${
                  audioPlaying
                    ? "bg-[#C6A15B]/20 text-[#8E6B24] border-[#C6A15B]"
                    : "bg-[#FFFDF8] text-[#756C67] border-[#E7DDD0] hover:text-[#321C32]"
                }`}
                title={audioPlaying ? "Mute music" : "Play ambient music"}
              >
                {audioPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>

              {/* Fullscreen Switch */}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 bg-[#FFFDF8] text-[#756C67] border border-[#E7DDD0] rounded-xl hover:text-[#321C32] transition-colors"
                title="Toggle fullscreen"
              >
                <Maximize2 size={15} />
              </button>

              {/* Close */}
              <button
                onClick={handleClose}
                className="p-2 bg-[#FFFDF8] text-[#756C67] border border-[#E7DDD0] rounded-xl hover:text-[#321C32] transition-colors ml-1"
                title="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Body: Preview Area */}
          <div className="flex-1 overflow-hidden flex flex-col md:flex-row bg-[#F2EBDC]">
            {/* Main Interactive Preview Frame */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-6 overflow-auto">
              {deviceView === "mobile" ? (
                /* Realistic iPhone Mobile Device Frame */
                <div className="relative w-[360px] h-[680px] bg-black rounded-[48px] p-3 shadow-2xl border-4 border-[#3D3734] ring-1 ring-white/20 shrink-0">
                  {/* Dynamic Island Notch */}
                  <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-30 pointer-events-none" />
                  
                  {/* Inner Screen */}
                  <div className="w-full h-full rounded-[38px] overflow-hidden bg-black relative">
                    <TemplateRenderer templateId={template.id} previewMode={false} />
                  </div>
                </div>
              ) : (
                /* Desktop Fullscreen Canvas Frame */
                <div className="w-full h-full max-h-[700px] bg-black rounded-xl overflow-hidden shadow-2xl border border-[#E7DDD0]">
                  <TemplateRenderer templateId={template.id} previewMode={false} />
                </div>
              )}
            </div>

            {/* Right Information & Action Drawer (visible on desktop or collapsible) */}
            <div className="w-full md:w-80 bg-[#FFFDF8] border-t md:border-t-0 md:border-l border-[#E7DDD0] p-6 overflow-y-auto shrink-0 flex flex-col justify-between">
              <div className="space-y-5">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#C6A15B] font-bold block mb-1">
                    About This Invitation
                  </span>
                  <p className="text-xs text-[#756C67] leading-relaxed">
                    {template.description}
                  </p>
                </div>

                {/* Cultural Highlights */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-widest text-[#321C32] font-semibold block">
                    Cultural Elements
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {template.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#F8F3EA] border border-[#E7DDD0] text-[#756C67]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* What's Included */}
                <div className="space-y-2 pt-2 border-t border-[#E7DDD0]">
                  <span className="text-[10px] uppercase tracking-widest text-[#321C32] font-semibold block">
                    What&apos;s Included
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#756C67]">
                    {(template.includes || [
                      "Interactive Guest RSVP",
                      "Ambient Music Toggle",
                      "Ceremony Countdown",
                      "Google Maps Directions",
                      "Self-contained HTML Export",
                    ]).map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 size={13} className="text-[#C6A15B] shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="pt-6 border-t border-[#E7DDD0] space-y-2.5 mt-6">
                <Link
                  href={`/editor/${template.id}`}
                  onClick={() => {
                    setTemplate(template.id);
                    handleClose();
                  }}
                  className="w-full block"
                >
                  <button className="w-full btn-primary text-sm py-3 justify-center shadow-md hover:shadow-lg">
                    <Pencil size={14} />
                    Customize in Studio
                  </button>
                </Link>
                <p className="text-[10px] text-center text-[#9B918A]">
                  Free instant preview · No account needed to design
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
