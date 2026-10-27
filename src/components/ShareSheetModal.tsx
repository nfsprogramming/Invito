"use client";
import { useState, useEffect } from "react";
import { X, Copy, Check, Share2, Download, MessageCircle, QrCode } from "lucide-react";
import QRCode from "qrcode";
import toast from "react-hot-toast";

interface ShareSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  brideName: string;
  groomName: string;
  eventName: string;
  shareUrl: string;
}

export function ShareSheetModal({
  isOpen,
  onClose,
  brideName,
  groomName,
  eventName,
  shareUrl,
}: ShareSheetModalProps) {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    if (shareUrl) {
      QRCode.toDataURL(shareUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: "#321C32",
          light: "#FFFDF8",
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error("QR Code generation error:", err));
    }
  }, [shareUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Invitation link copied!");
    setTimeout(() => setCopied(false), 3000);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `✨ You're cordially invited to celebrate the marriage of ${groomName} & ${brideName}!\n\nOpen our interactive digital invitation here:\n${shareUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${groomName} & ${brideName} Wedding Invitation`,
          text: `You're invited to celebrate the ${eventName} of ${groomName} & ${brideName}!`,
          url: shareUrl,
        });
      } catch (err) {
        // User dismissed share dialog
      }
    } else {
      handleCopy();
    }
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `invito-${groomName}-${brideName}-qr.png`.toLowerCase();
    a.click();
    toast.success("QR Code downloaded!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-[#FFFDF8] border border-[#E7DDD0] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E7DDD0] flex items-center justify-between bg-[#F8F3EA]/70">
          <div className="flex items-center gap-2">
            <Share2 size={16} className="text-[#C6A15B]" />
            <h3
              className="font-bold text-base text-[#321C32]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Share Your Invitation
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#756C67] hover:text-[#321C32] rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Quick Copy Link Box */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#2A2423] block">
              Direct Invitation URL
            </label>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={shareUrl}
                className="input-editorial text-xs py-2 bg-[#F8F3EA] text-[#756C67] truncate"
              />
              <button
                onClick={handleCopy}
                className="btn-primary text-xs py-2 px-3.5 shrink-0 flex items-center gap-1"
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>

          {/* Social Share Shortcuts */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleWhatsApp}
              className="p-3 rounded-xl border border-[#25D366]/30 bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 transition-all text-xs font-semibold flex items-center justify-center gap-2"
            >
              <MessageCircle size={16} className="text-[#25D366]" />
              Share on WhatsApp
            </button>

            <button
              onClick={handleNativeShare}
              className="p-3 rounded-xl border border-[#E7DDD0] bg-[#FFFDF8] hover:bg-[#F2EBDC] transition-all text-xs font-semibold text-[#321C32] flex items-center justify-center gap-2"
            >
              <Share2 size={15} />
              Share via Phone
            </button>
          </div>

          {/* QR Code Section */}
          <div className="pt-3 border-t border-[#E7DDD0] text-center space-y-3">
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#321C32]">
              <QrCode size={14} className="text-[#C6A15B]" />
              Scan QR to View Invitation
            </div>

            {qrDataUrl && (
              <div className="inline-block p-3 rounded-xl bg-white border border-[#E7DDD0] shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrDataUrl} alt="Invitation QR Code" className="w-36 h-36 mx-auto" />
              </div>
            )}

            <div>
              <button
                onClick={handleDownloadQR}
                className="btn-outline text-xs py-1.5 px-4 inline-flex items-center gap-1.5"
              >
                <Download size={13} /> Download QR Image (PNG)
              </button>
              <p className="text-[10px] text-[#9B918A] mt-1.5">
                Print this QR code on your physical stationery boxes or cards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
