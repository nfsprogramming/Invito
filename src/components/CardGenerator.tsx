"use client";
import { useRef } from "react";
import { CardTemplate } from "@/lib/cardTemplates";
import { InvitationData } from "@/lib/store";
import { TEMPLATES } from "@/lib/templates";

interface CardGeneratorProps {
  template: CardTemplate;
  data: InvitationData;
  scale?: number;
}

export function CardGenerator({ template, data, scale = 0.4 }: CardGeneratorProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getBaseDimensions = () => {
    switch (template.aspectRatio) {
      case "1:1":
        return { width: 1080, height: 1080 };
      case "9:16":
        return { width: 1080, height: 1920 };
      case "4:5":
        return { width: 1080, height: 1350 };
      default:
        return { width: 1080, height: 1080 };
    }
  };

  const baseDim = getBaseDimensions();

  // Category Celebratory Icons
  const getCategoryIcon = () => {
    switch (template.category) {
      case "Haldi":
        return "🌼";
      case "Mehendi":
        return "🌿";
      case "Sangeet":
        return "🪩";
      case "Reception":
        return "🥂";
      case "Nikah":
        return "🕌";
      case "Christian":
        return "⛪";
      case "Engagement":
        return "💍";
      case "Baby Shower":
        return "🌙";
      case "Bridal Shower":
        return "💐";
      case "Beach":
        return "🌊";
      default:
        if (template.id.includes("south-indian") || template.id.includes("tamil")) return "🪔";
        if (template.id.includes("rajasthani") || template.style === "Royal") return "🦚";
        if (template.style === "Minimal") return "✨";
        if (template.style === "Vintage") return "⚜️";
        return "🪔";
    }
  };

  // Premium Background Patterns
  const getBackgroundPattern = () => {
    const websiteTemplate = TEMPLATES.find(t => t.id === template.websiteTemplateId);
    if (websiteTemplate?.image) {
      // Return just the image URL without any gradient overlay so it remains fully vibrant
      return `url('${websiteTemplate.image}')`;
    }

    switch (template.id) {
      case "south-indian-card":
        return `radial-gradient(circle at 50% 0%, rgba(201,148,42,0.15) 0%, transparent 60%), radial-gradient(circle at 50% 100%, rgba(192,57,43,0.15) 0%, transparent 60%), linear-gradient(135deg, ${template.colors.bg} 0%, #fff8e7 100%)`;
      case "tamil-card":
        return `radial-gradient(circle at 50% 10%, rgba(212,139,40,0.2) 0%, transparent 50%), linear-gradient(180deg, ${template.colors.bg} 0%, #fff9e6 100%)`;
      case "christian-card":
      case "christian-grace-card":
      case "christian-arch-card":
        return `radial-gradient(ellipse at 50% 100%, rgba(201,168,76,0.15) 0%, transparent 60%), linear-gradient(180deg, ${template.colors.bg} 0%, #0a1420 100%)`;
      case "nikah-card":
      case "nikah-qubool-card":
      case "nikah-walima-card":
        return `radial-gradient(circle at 80% 20%, rgba(201,148,42,0.15) 0%, transparent 40%), linear-gradient(180deg, ${template.colors.bg} 0%, #0d3030 100%)`;
      case "beach-card":
        return "linear-gradient(180deg, #E0F2F1 0%, #B2EBF2 40%, #80DEEA 100%)";
      case "rajasthani-card":
        return `linear-gradient(180deg, ${template.colors.bg} 0%, #3D1A5C 40%, #4A0010 100%)`;
      case "vintage-card":
        return `linear-gradient(180deg, ${template.colors.bg} 0%, #1a1a1a 100%)`;
      case "engagement-card":
      case "engagement-solitaire-card":
      case "engagement-royal-card":
        return "radial-gradient(ellipse at center, #fff5ee 0%, #fce4e1 50%, #f8bbd0 100%)";
      case "haldi-sunshine-card":
      case "haldi-royal-card":
        return `radial-gradient(circle at 50% 0%, rgba(245,158,11,0.25) 0%, transparent 60%), linear-gradient(180deg, ${template.colors.bg} 0%, #fef3c7 100%)`;
      case "mehendi-henna-card":
      case "mehendi-boho-card":
        return `radial-gradient(circle at 50% 100%, rgba(106,168,79,0.2) 0%, transparent 60%), linear-gradient(180deg, ${template.colors.bg} 0%, #e8f5e9 100%)`;
      case "sangeet-glitz-card":
      case "sangeet-disco-card":
        return `radial-gradient(circle at 20% 20%, rgba(217,70,239,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(230,161,92,0.3) 0%, transparent 50%), linear-gradient(180deg, ${template.colors.bg} 0%, #0d001a 100%)`;
      case "reception-ballroom-card":
      case "reception-luxury-card":
        return `radial-gradient(circle at 50% 20%, rgba(232,215,174,0.2) 0%, transparent 60%), linear-gradient(180deg, ${template.colors.bg} 0%, #000000 100%)`;
      case "babyshower-cradle-card":
      case "babyshower-traditional-card":
        return `radial-gradient(circle at 50% 30%, rgba(224,152,122,0.2) 0%, transparent 50%), linear-gradient(180deg, ${template.colors.bg} 0%, #edf7f6 100%)`;
      case "bridalshower-botanical-card":
      case "bridalshower-bachelorette-card":
        return `radial-gradient(circle at 50% 50%, rgba(251,113,133,0.15) 0%, transparent 60%), linear-gradient(180deg, ${template.colors.bg} 0%, #fce7f3 100%)`;
      case "fairytale-card":
        return `radial-gradient(circle at 50% 20%, rgba(185,120,120,0.25) 0%, transparent 50%), linear-gradient(180deg, ${template.colors.bg} 0%, #f3e8ff 100%)`;
      case "bollywood-card":
        return `radial-gradient(circle at 50% 50%, rgba(229,152,37,0.25) 0%, transparent 60%), linear-gradient(180deg, ${template.colors.bg} 0%, #4a0008 100%)`;
      case "minimal-card":
        return "linear-gradient(135deg, #FAFAF8 0%, #F0F0F0 100%)";
      default:
        return `linear-gradient(135deg, ${template.colors.bg} 0%, #FAF7F2 100%)`;
    }
  };

  // Luxury Typography by Aesthetic Style
  const getCardFontFamily = () => {
    switch (template.style) {
      case "Royal":
      case "Traditional":
        return "'Cinzel', 'Playfair Display', Georgia, serif";
      case "Vintage":
        return "'Playfair Display', Georgia, serif";
      case "Floral":
        return "'Cormorant Garamond', Georgia, serif";
      case "Minimal":
        return "'Plus Jakarta Sans', 'Inter', sans-serif";
      case "Modern":
        return "'Plus Jakarta Sans', sans-serif";
      default:
        if (template.category === "Haldi" || template.category === "Sangeet") {
          return "'Playfair Display', Georgia, serif";
        }
        return "'Cormorant Garamond', Georgia, serif";
    }
  };

  const getNameFontFamily = () => {
    if (template.style === "Royal" || template.category === "Wedding" || template.category === "Nikah") {
      return "'Cinzel', 'Playfair Display', Georgia, serif";
    }
    if (template.style === "Minimal") {
      return "'Plus Jakarta Sans', 'Inter', sans-serif";
    }
    if (template.style === "Vintage") {
      return "'Playfair Display', Georgia, serif";
    }
    return "'Playfair Display', 'Cormorant Garamond', Georgia, serif";
  };

  // The wrapper takes up the scaled dimensions in the layout
  return (
    <div
      className="shadow-2xl rounded-2xl overflow-hidden relative group"
      style={{
        width: baseDim.width * scale,
        height: baseDim.height * scale,
        backgroundColor: "#fff",
      }}
    >
      <div
        ref={cardRef}
        id="card-capture-area"
        className="card-content-area absolute top-0 left-0"
        style={{
          width: baseDim.width,
          height: baseDim.height,
          background: getBackgroundPattern(),
          color: template.colors.text,
          fontFamily: getCardFontFamily(),
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          overflow: "hidden",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Main Content Box using Glassmorphism */}
        <div 
          className="relative z-10 flex flex-col items-center justify-between px-12 py-16 text-center shadow-2xl overflow-hidden"
          style={{
            position: "absolute",
            inset: "80px",
            backgroundColor: template.colors.text !== "#ffffff" && template.colors.text !== "#f7f8f8" ? "rgba(255, 255, 255, 0.85)" : "rgba(10, 10, 15, 0.85)",
            backdropFilter: "blur(16px)",
            borderRadius: "2.5rem",
            border: "1px solid rgba(255,255,255,0.4)"
          }}
        >
          {/* Subtle texture overlay inside the glass card */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay"
            style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')" }}
          />

          {/* Elegant Frame INSIDE the glass card */}
          <div className="absolute inset-6 border-[3px] pointer-events-none" style={{ borderColor: template.colors.primary, opacity: 0.8, borderRadius: "1.5rem" }} />
          <div className="absolute inset-8 border pointer-events-none" style={{ borderColor: template.colors.secondary, opacity: 0.5, borderRadius: "1.2rem" }} />

          {/* Corner Ornaments INSIDE the glass card */}
          <div className="absolute top-8 left-8 w-12 h-12 border-t-[3px] border-l-[3px] rounded-tl-xl pointer-events-none" style={{ borderColor: template.colors.accent, opacity: 0.8 }} />
          <div className="absolute top-8 right-8 w-12 h-12 border-t-[3px] border-r-[3px] rounded-tr-xl pointer-events-none" style={{ borderColor: template.colors.accent, opacity: 0.8 }} />
          <div className="absolute bottom-8 left-8 w-12 h-12 border-b-[3px] border-l-[3px] rounded-bl-xl pointer-events-none" style={{ borderColor: template.colors.accent, opacity: 0.8 }} />
          <div className="absolute bottom-8 right-8 w-12 h-12 border-b-[3px] border-r-[3px] rounded-br-xl pointer-events-none" style={{ borderColor: template.colors.accent, opacity: 0.8 }} />
          
          {/* Content Wrapper */}
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-between py-4">
            
            {/* Header */}
            <div className="flex flex-col items-center shrink-0">
              <div className="text-[44px] opacity-40 mb-1 leading-none select-none">
                {getCategoryIcon()}
              </div>
              
              <p className="text-xl tracking-[0.4em] uppercase opacity-80" style={{ color: template.colors.secondary, fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", fontWeight: 600 }}>
                {data.eventName || "Join Us"}
              </p>
            </div>

            {/* Body */}
            <div className="flex flex-col items-center flex-1 justify-center w-full min-h-0 py-2">
              <div className="flex flex-col items-center justify-center mb-4 shrink-0">
                <h1 
                  className="text-[72px] font-bold leading-[1.08]" 
                  style={{ 
                    color: template.colors.primary,
                    fontFamily: getNameFontFamily(),
                    letterSpacing: template.style === "Minimal" ? "-0.01em" : "0.02em"
                  }}
                >
                  {data.brideName || "Bride"}
                </h1>
                <div 
                  className="text-[34px] italic font-light my-1" 
                  style={{ 
                    color: template.colors.accent,
                    fontFamily: "'Cormorant Garamond', Georgia, serif"
                  }}
                >
                  &
                </div>
                <h1 
                  className="text-[72px] font-bold leading-[1.08]" 
                  style={{ 
                    color: template.colors.primary,
                    fontFamily: getNameFontFamily(),
                    letterSpacing: template.style === "Minimal" ? "-0.01em" : "0.02em"
                  }}
                >
                  {data.groomName || "Groom"}
                </h1>
              </div>

              <div className="w-24 h-px mb-6 shrink-0" style={{ background: `linear-gradient(90deg, transparent, ${template.colors.primary}, transparent)` }} />

              <div className="mb-4 flex flex-col items-center shrink-0">
                <p className="text-[24px] font-semibold mb-1 tracking-wide" style={{ color: template.colors.primary }}>
                  {formatDate(data.eventDate || "2025-01-01")}
                </p>
                <p className="text-[20px] opacity-80" style={{ color: template.colors.text }}>
                  {data.eventTime || "10:00 AM"}
                </p>
              </div>

              <div className="flex flex-col items-center px-4 shrink-0">
                <p className="text-[24px] font-semibold mb-1" style={{ color: template.colors.primary }}>
                  {data.venue || "Venue Name"}
                </p>
                <p className="text-[18px] leading-relaxed max-w-[600px] mx-auto opacity-80" style={{ color: template.colors.text }}>
                  {data.venueAddress || "123 Event Address, City"}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col items-center w-full shrink-0">
              {data.customMessage && (
                <p className="text-[18px] italic mb-4 max-w-[700px] leading-snug opacity-90 line-clamp-3 px-8" style={{ color: template.colors.secondary }}>
                  &quot;{data.customMessage}&quot;
                </p>
              )}

              <p className="text-sm uppercase tracking-[0.3em] mb-1 opacity-60" style={{ color: template.colors.text, fontFamily: "'Inter', sans-serif" }}>
                Hosted With Love
              </p>
              <p className="text-xl font-medium" style={{ color: template.colors.primary }}>
                {data.hostNames || "Families"}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay for editor purely to block interaction if needed */}
      <div className="absolute inset-0 z-50 pointer-events-none border border-black/10 rounded-2xl shadow-inner" />
    </div>
  );
}
