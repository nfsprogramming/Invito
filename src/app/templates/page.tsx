"use client";
import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X, Globe, Image as ImageIcon, Sparkles, Filter } from "lucide-react";
import { TemplateCard } from "@/components/TemplateCard";
import { TemplateDetailModal } from "@/components/TemplateDetailModal";
import { TEMPLATES, CATEGORIES_OCCASION, CATEGORIES_CULTURE, Template } from "@/lib/templates";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function TemplatesPage() {
  const [search, setSearch] = useState("");
  const [selectedOccasion, setSelectedOccasion] = useState("All");
  const [selectedCulture, setSelectedCulture] = useState("All");
  const [selectedBadgeFilter, setSelectedBadgeFilter] = useState<"all" | "new" | "popular">("all");
  const [selectedSort, setSelectedSort] = useState<"featured" | "popular" | "new" | "name">("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [activeModalTemplate, setActiveModalTemplate] = useState<Template | null>(null);

  const filtered = useMemo(() => {
    return TEMPLATES.filter((t) => {
      const matchSearch =
        search === "" ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())) ||
        t.culture.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase());

      const matchOccasion = selectedOccasion === "All" || t.category.toLowerCase() === selectedOccasion.toLowerCase();
      const matchCulture = selectedCulture === "All" || t.culture.toLowerCase() === selectedCulture.toLowerCase() || t.tags.includes(selectedCulture.toLowerCase());
      const matchBadge =
        selectedBadgeFilter === "all" ||
        (selectedBadgeFilter === "new" && t.badge?.toLowerCase().includes("new")) ||
        (selectedBadgeFilter === "popular" && t.badge?.toLowerCase().includes("popular"));

      return matchSearch && matchOccasion && matchCulture && matchBadge;
    }).sort((a, b) => {
      if (selectedSort === "featured") return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      if (selectedSort === "popular") {
        const scoreA = a.badge?.toLowerCase().includes("popular") ? 2 : a.badge ? 1 : 0;
        const scoreB = b.badge?.toLowerCase().includes("popular") ? 2 : b.badge ? 1 : 0;
        return scoreB - scoreA;
      }
      if (selectedSort === "new") {
        const scoreA = a.badge?.toLowerCase().includes("new") ? 2 : 0;
        const scoreB = b.badge?.toLowerCase().includes("new") ? 2 : 0;
        return scoreB - scoreA;
      }
      return a.name.localeCompare(b.name);
    });
  }, [search, selectedOccasion, selectedCulture, selectedBadgeFilter, selectedSort]);

  const clearFilters = () => {
    setSearch("");
    setSelectedOccasion("All");
    setSelectedCulture("All");
    setSelectedBadgeFilter("all");
  };

  const hasActiveFilters = search || selectedOccasion !== "All" || selectedCulture !== "All" || selectedBadgeFilter !== "all";

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 min-h-screen bg-[#F8F3EA]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="badge-gold text-[11px] mb-3 bg-[#FFFDF8] border-[#C6A15B]/30 shadow-sm">
            The Bespoke Collection
          </span>
          <h1
            className="text-4xl sm:text-5xl font-bold text-[#321C32] mt-2 mb-3 tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Digital Invitation <span className="text-[#C6A15B] italic font-cormorant font-normal">Templates</span>
          </h1>
          <p className="text-sm text-[#756C67]">
            {TEMPLATES.length} handcrafted cultural &amp; contemporary wedding invitations.
            Preview each design with your names and enjoy a live interactive preview.
          </p>

          {/* Website vs Card Switcher */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <span className="px-4 py-2 rounded-full text-xs font-semibold bg-[#321C32] text-[#FFFDF8] shadow-sm flex items-center gap-1.5">
              <Globe size={13} />
              Interactive Websites ({TEMPLATES.length})
            </span>
            <Link href="/cards">
              <button className="px-4 py-2 rounded-full text-xs font-medium bg-[#FFFDF8] text-[#756C67] border border-[#E7DDD0] hover:border-[#C6A15B] hover:text-[#321C32] transition-colors flex items-center gap-1.5">
                <ImageIcon size={13} />
                Stationery Cards
              </button>
            </Link>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="max-w-3xl mx-auto mb-6">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9B918A]" />
              <input
                className="input-editorial pl-11 pr-4 py-3 bg-[#FFFDF8] shadow-sm"
                placeholder="Search by tradition (e.g. South Indian, Nikah, Haldi, Minimal)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9B918A] hover:text-[#2A2423]"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`btn-outline px-4 py-3 text-xs flex items-center gap-2 whitespace-nowrap bg-[#FFFDF8] shadow-sm ${
                  showFilters || hasActiveFilters ? "border-[#C6A15B] text-[#8E6B24]" : ""
                }`}
              >
                <SlidersHorizontal size={14} />
                <span>Filters</span>
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-[#C6A15B]" />
                )}
              </button>

              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value as "featured" | "popular" | "new" | "name")}
                aria-label="Sort templates"
                className="input-editorial text-xs px-3 py-3 w-auto bg-[#FFFDF8] cursor-pointer shadow-sm font-medium"
              >
                <option value="featured">Featured First</option>
                <option value="popular">🔥 Most Popular</option>
                <option value="new">✨ New Additions</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Occasion & Badge Horizontal Pill Strip */}
        <div className="flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto pb-4 mb-6 no-scrollbar">
          <button
            onClick={() => {
              setSelectedOccasion("All");
              setSelectedBadgeFilter("all");
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedOccasion === "All" && selectedBadgeFilter === "all"
                ? "bg-[#321C32] text-[#FFFDF8] shadow-sm font-semibold"
                : "bg-[#FFFDF8] text-[#756C67] border border-[#E7DDD0] hover:border-[#C6A15B]"
            }`}
          >
            All ({TEMPLATES.length})
          </button>
          <button
            onClick={() => {
              setSelectedBadgeFilter(selectedBadgeFilter === "popular" ? "all" : "popular");
              setSelectedOccasion("All");
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
              selectedBadgeFilter === "popular"
                ? "bg-gradient-to-r from-[#321C32] to-[#451B3D] text-[#F5E5C9] shadow-sm font-semibold border border-[#C6A15B]"
                : "bg-[#FFFDF8] text-[#8E6B24] border border-[#C6A15B]/40 hover:border-[#C6A15B]"
            }`}
          >
            <span>🔥</span> Popular
          </button>
          {TEMPLATES.some((t) => t.badge?.toLowerCase().includes("new")) && (
            <button
              onClick={() => {
                setSelectedBadgeFilter(selectedBadgeFilter === "new" ? "all" : "new");
                setSelectedOccasion("All");
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
                selectedBadgeFilter === "new"
                  ? "bg-gradient-to-r from-[#0E3820] to-[#1B4D35] text-[#A7F3D0] shadow-sm font-semibold border border-[#2D6A4F]"
                  : "bg-[#FFFDF8] text-[#1E5E3A] border border-[#2D6A4F]/40 hover:border-[#2D6A4F]"
              }`}
            >
              <span>✨</span> New ({TEMPLATES.filter((t) => t.badge?.toLowerCase().includes("new")).length})
            </button>
          )}
          {CATEGORIES_OCCASION.filter((c) => c !== "All").map((occasion) => (
            <button
              key={occasion}
              onClick={() => {
                setSelectedOccasion(occasion);
                setSelectedBadgeFilter("all");
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedOccasion === occasion && selectedBadgeFilter === "all"
                  ? "bg-[#321C32] text-[#FFFDF8] shadow-sm font-semibold"
                  : "bg-[#FFFDF8] text-[#756C67] border border-[#E7DDD0] hover:border-[#C6A15B]"
              }`}
            >
              {occasion}
            </button>
          ))}
        </div>

        {/* Expandable Cultural Filters Drawer */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8 max-w-3xl mx-auto"
            >
              <div className="stationery-card p-6 bg-[#FFFDF8] border border-[#E7DDD0]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-widest font-semibold text-[#321C32]">
                    Filter by Cultural Tradition
                  </span>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-[#B97878] hover:underline flex items-center gap-1"
                    >
                      <X size={12} /> Clear all filters
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {CATEGORIES_CULTURE.map((culture) => (
                    <button
                      key={culture}
                      onClick={() => setSelectedCulture(culture)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                        selectedCulture === culture
                          ? "bg-[#C6A15B] text-[#241323] font-semibold shadow-sm"
                          : "bg-[#F8F3EA] text-[#756C67] border border-[#E7DDD0] hover:border-[#C6A15B]"
                      }`}
                    >
                      {culture}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-[#756C67] px-1">
          <span>
            Showing <strong className="text-[#321C32]">{filtered.length}</strong> bespoke template{filtered.length !== 1 ? "s" : ""}
          </span>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-[#C6A15B] hover:underline">
              Reset search
            </button>
          )}
        </div>

        {/* Templates Grid */}
        {filtered.length > 0 ? (
          <div className="templates-grid">
            {filtered.map((template, idx) => (
              <TemplateCard
                key={template.id}
                template={template}
                index={idx}
                onPreviewClick={(t) => setActiveModalTemplate(t)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-[#FFFDF8] rounded-2xl border border-[#E7DDD0] p-8 max-w-xl mx-auto shadow-sm">
            <span className="text-4xl block mb-3">💌</span>
            <h3
              className="text-xl font-bold text-[#321C32] mb-2"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              No Invitations Match Your Search
            </h3>
            <p className="text-xs text-[#756C67] mb-6">
              We couldn&apos;t find any designs matching &ldquo;{search}&rdquo;. Try clearing filters to view the full collection.
            </p>
            <button onClick={clearFilters} className="btn-primary text-xs py-2.5 px-6">
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Interactive Detail Modal */}
      <TemplateDetailModal
        template={activeModalTemplate}
        onClose={() => setActiveModalTemplate(null)}
      />
    </div>
  );
}
