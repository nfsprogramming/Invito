"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { Search, SlidersHorizontal, X, Globe, Image as ImageIcon, Sparkles, Check, ArrowRight } from "lucide-react";
import { CARD_TEMPLATES, CARD_CATEGORIES, CARD_STYLES, CardTemplate } from "@/lib/cardTemplates";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useStore, InvitationData } from "@/lib/store";
import { CardGenerator } from "@/components/CardGenerator";
import { useRouter } from "next/navigation";

function ResponsiveCardPreview({
  card,
  data,
}: {
  card: CardTemplate;
  data: InvitationData;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(0.28);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      const width = el.clientWidth;
      if (width > 0) {
        setScale(width / 1080);
      }
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(el);
    return () => ro.disconnect();
  }, [card.id]);

  return (
    <div
      ref={containerRef}
      className="w-full rounded-xl overflow-hidden mb-4 border border-[#E7DDD0] shadow-sm flex items-center justify-center bg-[#F8F3EA]/60 relative transition-all"
    >
      <div className="pointer-events-none w-full flex items-center justify-center">
        <CardGenerator template={card} data={data} scale={scale} />
      </div>
    </div>
  );
}

export default function CardsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStyle, setSelectedStyle] = useState("All");
  const [selectedBadgeFilter, setSelectedBadgeFilter] = useState<"all" | "new" | "popular">("all");
  const [showFilters, setShowFilters] = useState(false);
  const { invitation, setCardTemplate, setOutputFormat } = useStore();
  const router = useRouter();

  const filtered = useMemo(() => {
    return CARD_TEMPLATES.filter((t) => {
      const matchSearch =
        search === "" ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
      const matchCategory = selectedCategory === "All" || t.category === selectedCategory;
      const matchStyle = selectedStyle === "All" || t.style === selectedStyle;
      const matchBadge =
        selectedBadgeFilter === "all" ||
        (selectedBadgeFilter === "new" && t.badge?.toLowerCase().includes("new")) ||
        (selectedBadgeFilter === "popular" && t.badge?.toLowerCase().includes("popular"));
      return matchSearch && matchCategory && matchStyle && matchBadge;
    });
  }, [search, selectedCategory, selectedStyle, selectedBadgeFilter]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSelectedStyle("All");
    setSelectedBadgeFilter("all");
  };

  const hasActiveFilters = search || selectedCategory !== "All" || selectedStyle !== "All" || selectedBadgeFilter !== "all";

  const handleSelectCard = (cardId: string) => {
    const card = CARD_TEMPLATES.find((c) => c.id === cardId);
    if (card) {
      setCardTemplate(cardId);
      setOutputFormat("card");
      router.push(`/editor/${card.websiteTemplateId}`);
    }
  };

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 min-h-screen bg-[#F8F3EA] text-[#2A2423]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="badge-gold text-[10px] mb-3 bg-[#FFFDF8] border-[#C6A15B]/30 shadow-sm">
            Digital Stationery Cards
          </span>
          <h1
            className="text-4xl sm:text-5xl font-bold text-[#321C32] mt-1 mb-3 tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Invitation <span className="text-[#C6A15B] italic font-cormorant font-normal">Cards</span>
          </h1>
          <p className="text-sm text-[#756C67]">
            {CARD_TEMPLATES.length} stationery card designs · Tailored for WhatsApp sharing, Instagram Stories, and high-res print.
          </p>

          {/* Toggle switcher */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <Link href="/templates">
              <button className="px-4 py-2 rounded-full text-xs font-medium bg-[#FFFDF8] text-[#756C67] border border-[#E7DDD0] hover:border-[#C6A15B] transition-colors flex items-center gap-1.5">
                <Globe size={13} />
                Interactive Websites
              </button>
            </Link>
            <span className="px-4 py-2 rounded-full text-xs font-semibold bg-[#321C32] text-[#FFFDF8] shadow-sm flex items-center gap-1.5">
              <ImageIcon size={13} />
              Stationery Cards ({CARD_TEMPLATES.length})
            </span>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="max-w-2xl mx-auto mb-8 flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9B918A]" />
            <input
              className="input-editorial pl-11 py-2.5 bg-[#FFFDF8]"
              placeholder="Search cards, styles, or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-outline text-xs py-2.5 px-4 bg-[#FFFDF8] flex items-center gap-1.5 ${
              showFilters || hasActiveFilters ? "border-[#C6A15B] text-[#8E6B24]" : ""
            }`}
          >
            <SlidersHorizontal size={14} /> Filters
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="btn-outline text-xs py-2.5 px-3 bg-[#FFFDF8]"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Drawer */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="stationery-card p-6 bg-[#FFFDF8] border border-[#E7DDD0] max-w-2xl mx-auto mb-8 overflow-hidden"
            >
              <div className="space-y-4">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#C6A15B] font-bold block mb-2">
                    Category
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {["All", ...CARD_CATEGORIES].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          selectedCategory === cat
                            ? "bg-[#321C32] text-[#FFFDF8]"
                            : "bg-[#F8F3EA] text-[#756C67] border border-[#E7DDD0]"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs uppercase tracking-wider text-[#C6A15B] font-bold block mb-2">
                    Aesthetic Style
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {["All", ...CARD_STYLES].map((st) => (
                      <button
                        key={st}
                        onClick={() => setSelectedStyle(st)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          selectedStyle === st
                            ? "bg-[#321C32] text-[#FFFDF8]"
                            : "bg-[#F8F3EA] text-[#756C67] border border-[#E7DDD0]"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Category & Badge Filter Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto pb-4 mb-8 no-scrollbar">
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSelectedBadgeFilter("all");
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === "All" && selectedBadgeFilter === "all"
                ? "bg-[#321C32] text-[#FFFDF8] shadow-sm font-semibold"
                : "bg-[#FFFDF8] text-[#756C67] border border-[#E7DDD0] hover:border-[#C6A15B]"
            }`}
          >
            All ({CARD_TEMPLATES.length})
          </button>
          <button
            onClick={() => {
              setSelectedBadgeFilter(selectedBadgeFilter === "popular" ? "all" : "popular");
              setSelectedCategory("All");
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
              selectedBadgeFilter === "popular"
                ? "bg-gradient-to-r from-[#321C32] to-[#451B3D] text-[#F5E5C9] shadow-sm font-semibold border border-[#C6A15B]"
                : "bg-[#FFFDF8] text-[#8E6B24] border border-[#C6A15B]/40 hover:border-[#C6A15B]"
            }`}
          >
            <span>🔥</span> Popular
          </button>
          <button
            onClick={() => {
              setSelectedBadgeFilter(selectedBadgeFilter === "new" ? "all" : "new");
              setSelectedCategory("All");
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
              selectedBadgeFilter === "new"
                ? "bg-gradient-to-r from-[#0E3820] to-[#1B4D35] text-[#A7F3D0] shadow-sm font-semibold border border-[#2D6A4F]"
                : "bg-[#FFFDF8] text-[#1E5E3A] border border-[#2D6A4F]/40 hover:border-[#2D6A4F]"
            }`}
          >
            <span>✨</span> New ({CARD_TEMPLATES.filter((c) => c.badge?.toLowerCase().includes("new")).length})
          </button>
          {CARD_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedBadgeFilter("all");
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat && selectedBadgeFilter === "all"
                  ? "bg-[#321C32] text-[#FFFDF8] shadow-sm font-semibold"
                  : "bg-[#FFFDF8] text-[#756C67] border border-[#E7DDD0] hover:border-[#C6A15B]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((card) => (
            <div
              key={card.id}
              className="stationery-card p-5 bg-[#FFFDF8] border border-[#E7DDD0] flex flex-col justify-between"
            >
              <div>
                {/* Live Card Generator Full Width Auto Scaling Preview */}
                <ResponsiveCardPreview card={card} data={invitation} />

                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h3
                    className="font-bold text-base text-[#321C32]"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {card.name}
                  </h3>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {card.badge && (
                      <span
                        className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border shadow-xs flex items-center gap-1 ${
                          card.badge.toLowerCase().includes("new")
                            ? "bg-gradient-to-r from-[#0E3820] to-[#1B4D35] text-[#A7F3D0] border-[#2D6A4F]"
                            : card.badge.toLowerCase().includes("popular")
                            ? "bg-gradient-to-r from-[#321C32] to-[#451B3D] text-[#F5E5C9] border-[#C6A15B]/70"
                            : "bg-[#FFFDF8] text-[#8E6B24] border-[#C6A15B]/40"
                        }`}
                      >
                        <Sparkles
                          size={9}
                          className={
                            card.badge.toLowerCase().includes("new")
                              ? "text-[#6EE7B7]"
                              : "text-[#C6A15B]"
                          }
                        />
                        {card.badge}
                      </span>
                    )}
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#F8F3EA] border border-[#E7DDD0] text-[#756C67]">
                      {card.category}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#756C67] line-clamp-2 mb-4">
                  {card.description}
                </p>
              </div>

              <button
                onClick={() => handleSelectCard(card.id)}
                className="btn-primary text-xs py-2 w-full justify-center shadow-sm flex items-center gap-1.5"
              >
                Customize Matching Suite <ArrowRight size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
