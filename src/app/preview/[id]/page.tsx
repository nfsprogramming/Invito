"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Pencil, Lock, Eye, CheckCircle2, Share2, Sparkles } from "lucide-react";
import { TemplateRenderer } from "@/components/templates/TemplateRenderer";
import { ShareSheetModal } from "@/components/ShareSheetModal";
import { useStore } from "@/lib/store";
import { TEMPLATES } from "@/lib/templates";

export default function PreviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { invitation, setTemplate } = useStore();
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    if (id) setTemplate(id as string);
  }, [id, setTemplate]);

  if (!id) {
    return <div className="min-h-screen bg-[#F8F3EA]" />;
  }

  const template = TEMPLATES.find((t) => t.id === id);

  if (!template) {
    return (
      <div className="pt-24 text-center min-h-screen flex flex-col items-center justify-center bg-[#F8F3EA]">
        <div className="stationery-card p-8 max-w-sm mx-auto">
          <p className="text-base mb-4 text-[#756C67]">Template not found.</p>
          <Link href="/templates">
            <button className="btn-primary text-xs py-2 px-5">Browse Templates</button>
          </Link>
        </div>
      </div>
    );
  }

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/i/${id}`
    : `https://invito.app/i/${id}`;

  return (
    <div className="relative min-h-screen bg-black">
      {/* Floating Luxury Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4"
      >
        <div className="bg-[#FFFDF8]/95 backdrop-blur-xl rounded-full px-4 sm:px-5 py-2.5 flex items-center gap-2.5 sm:gap-3.5 pointer-events-auto shadow-2xl border border-[#E7DDD0] text-[#2A2423]">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs font-medium text-[#756C67] hover:text-[#321C32] px-2.5 py-1.5 rounded-full hover:bg-[#F2EBDC] transition-colors"
          >
            <ArrowLeft size={13} />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="h-4 w-px bg-[#E7DDD0]" />

          <div className="flex items-center gap-2">
            <span className="badge-gold text-[10px] py-0.5 px-2">
              {template.category}
            </span>
            <span
              className="text-xs font-bold text-[#321C32] hidden sm:inline"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {template.name}
            </span>
          </div>

          <div className="h-4 w-px bg-[#E7DDD0]" />

          <Link href={`/editor/${id}`}>
            <button className="btn-primary text-xs py-1.5 px-3.5 flex items-center gap-1.5 shadow-sm">
              <Pencil size={12} /> Customize
            </button>
          </Link>

          <button
            onClick={() => setShareOpen(true)}
            className="p-1.5 rounded-full border border-[#E7DDD0] text-[#756C67] hover:text-[#321C32] hover:bg-[#F2EBDC] transition-colors"
            title="Share preview link"
          >
            <Share2 size={13} />
          </button>

          {invitation.isPaid ? (
            <div className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-[#527A61]/15 text-[#527A61] border border-[#527A61]/30 font-medium">
              <CheckCircle2 size={12} /> Purchased
            </div>
          ) : (
            <Link href={`/payment?template=${id}`}>
              <div className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-[#C6A15B]/15 text-[#8E6B24] border border-[#C6A15B]/30 font-medium hover:bg-[#C6A15B]/25 transition-colors cursor-pointer">
                <Lock size={11} /> Unlock Download
              </div>
            </Link>
          )}
        </div>
      </motion.div>

      {/* Discrete Studio Watermark */}
      {!invitation.isPaid && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 text-[11px] px-3.5 py-1.5 rounded-full pointer-events-none bg-[#FFFDF8]/90 text-[#756C67] border border-[#E7DDD0] shadow-md backdrop-blur-md">
          ✦ Invito Studio Preview — Personalize &amp; Unlock for Guest Sharing
        </div>
      )}

      {/* Full-screen template viewport */}
      <div className="w-full h-screen">
        <TemplateRenderer templateId={id as string} previewMode={false} />
      </div>

      <ShareSheetModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        brideName={invitation.brideName}
        groomName={invitation.groomName}
        eventName={invitation.eventName}
        shareUrl={shareUrl}
      />
    </div>
  );
}
