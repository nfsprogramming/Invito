"use client";
import { useState } from "react";
import { X, CheckCircle2, Heart, Sparkles, Send } from "lucide-react";
import Confetti from "react-confetti";
import { useStore } from "@/lib/store";
import toast from "react-hot-toast";

interface GuestRSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
  brideName: string;
  groomName: string;
  eventName: string;
}

export function GuestRSVPModal({
  isOpen,
  onClose,
  brideName,
  groomName,
  eventName,
}: GuestRSVPModalProps) {
  const { addRSVP } = useStore();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [attendance, setAttendance] = useState<"accept" | "decline" | "maybe">("accept");
  const [guestsCount, setGuestsCount] = useState(2);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    addRSVP({
      name,
      contact,
      attendance,
      guestsCount: attendance === "decline" ? 0 : Number(guestsCount),
      message,
    });

    setSubmitted(true);
    if (attendance === "accept") {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
    toast.success("Thank you for your RSVP!");
  };

  const handleReset = () => {
    setSubmitted(false);
    setName("");
    setContact("");
    setMessage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      {showConfetti && (
        <Confetti
          numberOfPieces={160}
          recycle={false}
          colors={["#C6A15B", "#E8D7AE", "#321C32", "#B97878", "#527A61"]}
        />
      )}

      <div className="bg-[#FFFDF8] border border-[#E7DDD0] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E7DDD0] flex items-center justify-between bg-[#F8F3EA]/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#321C32] flex items-center justify-center text-[#C6A15B] shadow-sm">
              <Heart size={15} fill="#C6A15B" />
            </div>
            <div>
              <h3
                className="font-bold text-base text-[#321C32]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                RSVP Confirmation
              </h3>
              <p className="text-[11px] text-[#756C67]">
                {groomName} &amp; {brideName} · {eventName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#756C67] hover:text-[#321C32] rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form or Submitted State */}
        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#527A61]/15 text-[#527A61] border border-[#527A61]/30 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 size={30} />
            </div>
            <h4
              className="text-xl font-bold text-[#321C32]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {attendance === "accept"
                ? "We Can't Wait to Celebrate Together!"
                : "Thank You for Letting Us Know"}
            </h4>
            <p className="text-xs text-[#756C67] max-w-xs mx-auto leading-relaxed">
              Your response has been privately delivered to the couple. Your heartfelt blessing means the world to them.
            </p>
            <div className="pt-2">
              <button
                onClick={handleReset}
                className="btn-primary text-xs py-2 px-6 shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Attendance Choice */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#2A2423] block">
                Will you be attending?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "accept" as const, label: "Joyfully Accept", emoji: "✨" },
                  { id: "decline" as const, label: "Regretfully Decline", emoji: "💌" },
                  { id: "maybe" as const, label: "Tentative / Maybe", emoji: "⏳" },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setAttendance(option.id)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all ${
                      attendance === option.id
                        ? "bg-[#321C32] text-[#FFFDF8] border-[#321C32] shadow-sm"
                        : "bg-[#FFFDF8] text-[#756C67] border-[#E7DDD0] hover:border-[#C6A15B]"
                    }`}
                  >
                    <span className="text-sm mb-0.5">{option.emoji}</span>
                    <span className="text-[10px] text-center leading-tight">
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="text-xs font-semibold text-[#2A2423] block mb-1">
                Your Full Name *
              </label>
              <input
                required
                className="input-editorial text-xs py-2.5"
                placeholder="e.g. Meera & Arjun Iyer"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Contact */}
            <div>
              <label className="text-xs font-semibold text-[#2A2423] block mb-1">
                Mobile Number or Email
              </label>
              <input
                className="input-editorial text-xs py-2.5"
                placeholder="+91 98765 43210"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>

            {/* Number of Guests */}
            {attendance !== "decline" && (
              <div>
                <label className="text-xs font-semibold text-[#2A2423] block mb-1">
                  Total Guests Attending
                </label>
                <select
                  aria-label="Number of guests attending"
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className="input-editorial text-xs py-2.5 bg-[#FFFDF8]"
                >
                  <option value={1}>1 Guest (Just me)</option>
                  <option value={2}>2 Guests (Me &amp; Partner)</option>
                  <option value={3}>3 Guests (Family)</option>
                  <option value={4}>4 Guests (Family)</option>
                  <option value={5}>5+ Guests</option>
                </select>
              </div>
            )}

            {/* Message */}
            <div>
              <label className="text-xs font-semibold text-[#2A2423] block mb-1">
                Warm Wishes &amp; Blessing Message
              </label>
              <textarea
                rows={2}
                className="input-editorial text-xs resize-none"
                placeholder="Wishing you a lifetime of love and happiness..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="btn-outline text-xs py-2 px-4"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary text-xs py-2 px-5 shadow-sm flex items-center gap-1.5"
              >
                <Send size={12} /> Submit RSVP
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
