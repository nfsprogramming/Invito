"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, Sparkles, Pencil, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { Template } from "@/lib/templates";
import { useStore } from "@/lib/store";

interface TemplateCardProps {
  template: Template;
  index?: number;
  onPreviewClick?: (template: Template) => void;
}

export function TemplateCard({ template, index = 0, onPreviewClick }: TemplateCardProps) {
  const { setTemplate } = useStore();

  const handlePreview = (e: React.MouseEvent) => {
    if (onPreviewClick) {
      e.preventDefault();
      onPreviewClick(template);
    }
  };

  return (
    <motion.div
      className="group relative bg-[#FFFDF8] border border-[#E7DDD0] rounded-2xl overflow-hidden shadow-stationery hover:shadow-hover hover:border-[#C6A15B]/50 transition-all duration-300 flex flex-col h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
    >
      {/* Stationery Frame & Image Preview */}
      <div 
        className="relative h-72 sm:h-80 w-full overflow-hidden bg-[#F2EBDC] cursor-pointer"
        onClick={handlePreview}
      >
        <Image
          src={template.image || "/templates/generic.png"}
          alt={template.name}
          fill
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Soft Stationery Grain & Ambient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#241323]/80 via-transparent to-black/10 opacity-70 group-hover:opacity-60 transition-opacity" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {template.badge && (
            <span
              className={`text-[10px] font-semibold tracking-wider uppercase py-1 px-2.5 rounded-full backdrop-blur-md shadow-sm flex items-center gap-1 border transition-all ${
                template.badge.toLowerCase().includes("new")
                  ? "bg-gradient-to-r from-[#0E3820]/95 to-[#1B4D35]/95 text-[#A7F3D0] border-[#2D6A4F]/80 shadow-[0_0_12px_rgba(45,106,79,0.35)]"
                  : template.badge.toLowerCase().includes("popular")
                  ? "bg-gradient-to-r from-[#321C32]/95 to-[#451B3D]/95 text-[#F5E5C9] border-[#C6A15B]/70 shadow-[0_0_12px_rgba(198,161,91,0.3)]"
                  : "bg-[#FFFDF8]/95 text-[#8E6B24] border-[#C6A15B]/40 shadow-xs"
              }`}
            >
              <Sparkles
                size={10}
                className={
                  template.badge.toLowerCase().includes("new")
                    ? "text-[#6EE7B7]"
                    : "text-[#C6A15B]"
                }
              />
              {template.badge}
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 z-10">
          <span className="text-[10px] font-medium tracking-wider uppercase px-2.5 py-1 rounded-full bg-[#321C32]/85 text-[#FFFDF8] backdrop-blur-md border border-[#C6A15B]/30 shadow-sm">
            {template.culture}
          </span>
        </div>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
          <button
            onClick={handlePreview}
            className="btn-gold text-xs py-2 px-4 shadow-xl flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
          >
            <Eye size={13} />
            Quick Preview
          </button>
        </div>

        {/* Bottom preview label */}
        <div className="absolute bottom-3 left-3 right-3 z-10">
          <p className="text-[11px] font-medium text-[#FFFDF8]/90 tracking-wider uppercase">
            {template.category} Ceremony
          </p>
        </div>
      </div>

      {/* Card Content & Actions */}
      <div className="p-5 flex flex-col flex-1 justify-between bg-[#FFFDF8]">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3
              className="text-lg font-bold text-[#321C32] group-hover:text-[#241323] transition-colors"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {template.name}
            </h3>
            <span className="text-[11px] font-medium text-[#756C67] shrink-0 mt-0.5">
              {template.style}
            </span>
          </div>

          <p className="text-xs text-[#756C67] line-clamp-2 leading-relaxed mb-4">
            {template.description}
          </p>
        </div>

        {/* Action Controls */}
        <div className="pt-3 border-t border-[#E7DDD0] flex items-center gap-2">
          <button
            onClick={handlePreview}
            className="flex-1 btn-outline text-xs py-2 px-3 justify-center gap-1.5"
          >
            <Eye size={13} className="text-[#C6A15B]" />
            Live Preview
          </button>

          <Link
            href={`/editor/${template.id}`}
            className="flex-1"
            onClick={() => setTemplate(template.id)}
          >
            <button className="w-full btn-primary text-xs py-2 px-3 justify-center gap-1.5 shadow-sm">
              <Pencil size={12} />
              Customize
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
