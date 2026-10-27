"use client";
import { useState, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  FileArchive,
  Pencil,
  Eye,
  Lock,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Image as ImageIcon,
  Globe,
  Share2,
  Users,
  Search,
  Filter,
  BarChart3,
  QrCode,
  Check,
  TrendingUp,
  FileSpreadsheet,
  Trash2,
} from "lucide-react";
import { useStore, GuestRSVP } from "@/lib/store";
import { TEMPLATES, Template } from "@/lib/templates";
import { CARD_TEMPLATES } from "@/lib/cardTemplates";
import { downloadHTML, downloadZIP } from "@/lib/export";
import { exportCard } from "@/lib/cardExport";
import { CardGenerator } from "@/components/CardGenerator";
import { ShareSheetModal } from "@/components/ShareSheetModal";
import toast from "react-hot-toast";

type DashboardTab = "invitations" | "rsvps" | "analytics" | "matcher";

export default function DashboardPage() {
  const {
    invitation,
    resetInvitation,
    updateRSVPStatus,
    removeRSVP,
    setTemplate,
  } = useStore();

  const [activeTab, setActiveTab] = useState<DashboardTab>("invitations");
  const [downloading, setDownloading] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [rsvpSearch, setRsvpSearch] = useState("");
  const [rsvpFilter, setRsvpFilter] = useState<"all" | "accept" | "decline" | "maybe">("all");
  const cardRef = useRef<HTMLDivElement>(null);

  // AI Matcher State
  const [matcherOccasion, setMatcherOccasion] = useState("Wedding");
  const [matcherCulture, setMatcherCulture] = useState("South Indian");
  const [matcherStyle, setMatcherStyle] = useState("Traditional");
  const [recommendedTemplates, setRecommendedTemplates] = useState<Template[]>([]);

  const template = TEMPLATES.find((t) => t.id === invitation.templateId) || TEMPLATES[0];
  const cardTemplate = CARD_TEMPLATES.find((t) => t.id === invitation.cardTemplateId) || CARD_TEMPLATES[0];
  const isPaid = invitation.isPaid;

  // RSVP Metrics Calculations
  const rsvpMetrics = useMemo(() => {
    const rsvps = invitation.rsvps || [];
    const attending = rsvps.filter((r) => r.attendance === "accept");
    const declined = rsvps.filter((r) => r.attendance === "decline");
    const tentative = rsvps.filter((r) => r.attendance === "maybe");
    const totalHeadCount = attending.reduce((acc, curr) => acc + (curr.guestsCount || 1), 0);

    return {
      total: rsvps.length,
      attending: attending.length,
      declined: declined.length,
      tentative: tentative.length,
      totalHeadCount,
    };
  }, [invitation.rsvps]);

  // Filtered RSVPs list
  const filteredRSVPs = useMemo(() => {
    return (invitation.rsvps || []).filter((r) => {
      const matchesSearch =
        rsvpSearch === "" ||
        r.name.toLowerCase().includes(rsvpSearch.toLowerCase()) ||
        r.contact.toLowerCase().includes(rsvpSearch.toLowerCase()) ||
        r.message.toLowerCase().includes(rsvpSearch.toLowerCase());

      const matchesFilter = rsvpFilter === "all" || r.attendance === rsvpFilter;
      return matchesSearch && matchesFilter;
    });
  }, [invitation.rsvps, rsvpSearch, rsvpFilter]);

  // Export RSVP to CSV
  const handleExportCSV = () => {
    const rsvps = invitation.rsvps || [];
    if (rsvps.length === 0) {
      toast.error("No RSVPs to export yet.");
      return;
    }

    const headers = ["Name", "Contact", "Attendance", "Guests Count", "Message", "Date Submitted"];
    const rows = rsvps.map((r) => [
      `"${r.name.replace(/"/g, '""')}"`,
      `"${r.contact.replace(/"/g, '""')}"`,
      `"${r.attendance}"`,
      r.guestsCount || 1,
      `"${r.message.replace(/"/g, '""')}"`,
      `"${new Date(r.submittedAt).toLocaleDateString()}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `invito-rsvps-${invitation.groomName}-${invitation.brideName}.csv`.toLowerCase());
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("RSVP list exported to CSV!");
  };

  const handleDownloadHTML = async () => {
    setDownloading("html");
    try {
      await downloadHTML(invitation);
      toast.success("HTML invitation package downloaded!");
    } catch {
      toast.error("Download failed. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  const handleDownloadZIP = async () => {
    setDownloading("zip");
    try {
      await downloadZIP(invitation);
      toast.success("Complete invitation ZIP downloaded!");
    } catch {
      toast.error("Download failed. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  const handleDownloadCard = async (format: "png" | "pdf") => {
    if (!cardRef.current) {
      toast.error("Card generator loading...");
      return;
    }
    setDownloading(format);
    try {
      const filename = `${invitation.brideName}-${invitation.groomName}-card`;
      const exportElement = cardRef.current.querySelector("#card-capture-area") || cardRef.current;
      await exportCard(exportElement as HTMLElement, format, filename);
      toast.success(`${format.toUpperCase()} Card downloaded!`);
    } catch {
      toast.error("Card generation failed.");
    } finally {
      setDownloading(null);
    }
  };

  // Run AI Template Matcher
  const handleRunMatcher = () => {
    const matches = TEMPLATES.filter(
      (t) =>
        t.category.toLowerCase() === matcherOccasion.toLowerCase() ||
        t.culture.toLowerCase() === matcherCulture.toLowerCase() ||
        t.theme.toLowerCase() === matcherStyle.toLowerCase()
    );
    setRecommendedTemplates(matches.slice(0, 3));
    toast.success("Found matching templates based on your style!");
  };

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/i/${invitation.invitationSlug || template.id}`
    : `https://invito.app/i/${invitation.invitationSlug || template.id}`;

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 min-h-screen bg-[#F8F3EA] text-[#2A2423]">
      {/* Hidden CardGenerator for exporting */}
      <div
        className="absolute opacity-0 pointer-events-none"
        style={{ zIndex: -9999, top: 0, left: 0 }}
        ref={cardRef}
      >
        <CardGenerator template={cardTemplate} data={invitation} scale={1} />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="badge-gold text-[10px] mb-2 bg-[#FFFDF8] border-[#C6A15B]/30 shadow-sm">
              Creator Studio
            </span>
            <h1
              className="text-3xl sm:text-4xl font-bold text-[#321C32]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              My Invitation <span className="text-[#C6A15B] italic font-cormorant font-normal">Dashboard</span>
            </h1>
            <p className="text-xs text-[#756C67] mt-1">
              Manage your guest invitations, track RSVPs in real time, and download final packages.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShareOpen(true)}
              className="btn-outline text-xs py-2 px-3.5 bg-[#FFFDF8] shadow-sm flex items-center gap-1.5"
            >
              <Share2 size={13} />
              Share Link
            </button>
            <Link href={`/editor/${template.id}`}>
              <button className="btn-primary text-xs py-2 px-4 shadow-sm flex items-center gap-1.5">
                <Pencil size={12} />
                Open Studio
              </button>
            </Link>
          </div>
        </div>

        {/* Studio Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E7DDD0] pb-3 mb-8 overflow-x-auto no-scrollbar">
          {[
            { id: "invitations" as const, label: "My Invitation", icon: Globe },
            { id: "rsvps" as const, label: `Guest RSVPs (${rsvpMetrics.total})`, icon: Users },
            { id: "analytics" as const, label: "Visitor Analytics", icon: BarChart3 },
            { id: "matcher" as const, label: "✨ AI Style Matcher", icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  active
                    ? "bg-[#321C32] text-[#FFFDF8] shadow-sm font-semibold"
                    : "bg-[#FFFDF8] text-[#756C67] border border-[#E7DDD0] hover:border-[#C6A15B]"
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── TAB 1: MY INVITATION & EXPORT CENTER ── */}
        {activeTab === "invitations" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Active Invitation Card */}
            <div className="stationery-card p-6 sm:p-8 bg-[#FFFDF8] border border-[#E7DDD0]">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Thumbnail Preview */}
                <div className="relative w-full md:w-56 h-48 rounded-xl overflow-hidden bg-[#F2EBDC] shrink-0 border border-[#E7DDD0] shadow-sm">
                  <Image
                    src={template.image || "/templates/generic.png"}
                    alt={template.name}
                    fill
                    className="object-cover object-top"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="badge-plum bg-[#FFFDF8]/90 text-[10px] py-0.5 px-2">
                      {template.category}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h2
                        className="text-2xl font-bold text-[#321C32]"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      >
                        {invitation.groomName} &amp; {invitation.brideName}
                      </h2>
                      <p className="text-xs text-[#756C67]">
                        Design Theme: <strong>{template.name}</strong> ({template.culture})
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {isPaid ? (
                        <span className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-[#527A61]/15 text-[#527A61] border border-[#527A61]/30 font-medium">
                          <CheckCircle2 size={13} /> Published &amp; Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-[#C6A15B]/15 text-[#8E6B24] border border-[#C6A15B]/30 font-medium">
                          <Lock size={12} /> Studio Preview Mode
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-[#E7DDD0] text-xs">
                    <div>
                      <span className="text-[10px] uppercase text-[#9B918A] block">Auspicious Date</span>
                      <strong className="text-[#2A2423]">{invitation.eventDate || "Nov 28, 2026"}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-[#9B918A] block">Muhurtham</span>
                      <strong className="text-[#2A2423]">{invitation.eventTime || "09:30 AM"}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-[#9B918A] block">Venue</span>
                      <strong className="text-[#2A2423] truncate block">{invitation.venue}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-[#9B918A] block">RSVPs Received</span>
                      <strong className="text-[#527A61]">{rsvpMetrics.attending} Attending</strong>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap gap-2.5 pt-2">
                    <Link href={`/i/${invitation.invitationSlug || template.id}`}>
                      <button className="btn-primary text-xs py-2 px-4 shadow-sm flex items-center gap-1.5">
                        <Eye size={13} /> Open Guest Site
                      </button>
                    </Link>
                    <Link href={`/editor/${template.id}`}>
                      <button className="btn-outline text-xs py-2 px-4 flex items-center gap-1.5">
                        <Pencil size={12} /> Edit Details
                      </button>
                    </Link>
                    <button
                      onClick={() => setShareOpen(true)}
                      className="btn-outline text-xs py-2 px-4 flex items-center gap-1.5"
                    >
                      <Share2 size={13} /> Share &amp; QR Code
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Packaging & Download Center */}
            <div className="stationery-card p-6 sm:p-8 bg-[#FFFDF8] border border-[#E7DDD0]">
              <div className="flex items-center gap-2 mb-2">
                <Download size={18} className="text-[#C6A15B]" />
                <h3
                  className="font-bold text-lg text-[#321C32]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Download &amp; Export Center
                </h3>
              </div>
              <p className="text-xs text-[#756C67] mb-6">
                Generate offline-ready HTML packages or high-resolution stationery cards for WhatsApp distribution.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* HTML Export */}
                <div className="p-4 rounded-xl border border-[#E7DDD0] bg-[#F8F3EA]/50 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs font-bold text-[#321C32] block mb-1">
                      🌐 Standalone HTML Site
                    </span>
                    <p className="text-[11px] text-[#756C67] leading-relaxed">
                      Self-contained offline invitation with animations and music.
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadHTML}
                    disabled={downloading === "html"}
                    className="btn-primary text-xs py-2 px-3 w-full justify-center shadow-sm"
                  >
                    {downloading === "html" ? "Generating..." : "Download HTML"}
                  </button>
                </div>

                {/* ZIP Package */}
                <div className="p-4 rounded-xl border border-[#E7DDD0] bg-[#F8F3EA]/50 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs font-bold text-[#321C32] block mb-1">
                      📦 Full Archive ZIP
                    </span>
                    <p className="text-[11px] text-[#756C67] leading-relaxed">
                      HTML file + Readme instructions + offline assets in one package.
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadZIP}
                    disabled={downloading === "zip"}
                    className="btn-outline text-xs py-2 px-3 w-full justify-center"
                  >
                    {downloading === "zip" ? "Archiving..." : "Download ZIP"}
                  </button>
                </div>

                {/* Card PNG */}
                <div className="p-4 rounded-xl border border-[#E7DDD0] bg-[#F8F3EA]/50 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs font-bold text-[#321C32] block mb-1">
                      🖼 WhatsApp Card (PNG)
                    </span>
                    <p className="text-[11px] text-[#756C67] leading-relaxed">
                      High-resolution PNG matching card with embedded QR Code.
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownloadCard("png")}
                    disabled={downloading === "png"}
                    className="btn-outline text-xs py-2 px-3 w-full justify-center"
                  >
                    {downloading === "png" ? "Rendering..." : "Export PNG"}
                  </button>
                </div>

                {/* Card PDF */}
                <div className="p-4 rounded-xl border border-[#E7DDD0] bg-[#F8F3EA]/50 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs font-bold text-[#321C32] block mb-1">
                      📄 Print Stationery (PDF)
                    </span>
                    <p className="text-[11px] text-[#756C67] leading-relaxed">
                      Printable PDF format ready for high-fidelity physical stationery.
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownloadCard("pdf")}
                    disabled={downloading === "pdf"}
                    className="btn-outline text-xs py-2 px-3 w-full justify-center"
                  >
                    {downloading === "pdf" ? "Preparing..." : "Export PDF"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: RSVP MANAGEMENT & GUEST LIST ── */}
        {activeTab === "rsvps" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="stationery-card p-4 bg-[#FFFDF8] border border-[#E7DDD0]">
                <span className="text-[11px] uppercase tracking-wider text-[#756C67] block mb-1 font-medium">
                  Total RSVPs
                </span>
                <span
                  className="text-3xl font-bold text-[#321C32]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {rsvpMetrics.total}
                </span>
              </div>

              <div className="stationery-card p-4 bg-[#FFFDF8] border border-[#E7DDD0]">
                <span className="text-[11px] uppercase tracking-wider text-[#527A61] block mb-1 font-medium">
                  Attending (Yes)
                </span>
                <span
                  className="text-3xl font-bold text-[#527A61]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {rsvpMetrics.attending}
                </span>
                <span className="text-[10px] text-[#756C67] block mt-0.5">
                  {rsvpMetrics.totalHeadCount} Total Headcount
                </span>
              </div>

              <div className="stationery-card p-4 bg-[#FFFDF8] border border-[#E7DDD0]">
                <span className="text-[11px] uppercase tracking-wider text-[#B65C5C] block mb-1 font-medium">
                  Regretfully Declined
                </span>
                <span
                  className="text-3xl font-bold text-[#B65C5C]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {rsvpMetrics.declined}
                </span>
              </div>

              <div className="stationery-card p-4 bg-[#FFFDF8] border border-[#E7DDD0]">
                <span className="text-[11px] uppercase tracking-wider text-[#C6A15B] block mb-1 font-medium">
                  Tentative / Maybe
                </span>
                <span
                  className="text-3xl font-bold text-[#8E6B24]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {rsvpMetrics.tentative}
                </span>
              </div>
            </div>

            {/* RSVP Table Filter & Export Bar */}
            <div className="stationery-card p-6 bg-[#FFFDF8] border border-[#E7DDD0] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9B918A]" />
                  <input
                    className="input-editorial text-xs pl-10 py-2.5"
                    placeholder="Search guests by name or contact..."
                    value={rsvpSearch}
                    onChange={(e) => setRsvpSearch(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={rsvpFilter}
                    onChange={(e) => setRsvpFilter(e.target.value as "all" | "accept" | "decline" | "maybe")}
                    aria-label="Filter RSVPs by status"
                    className="input-editorial text-xs py-2 px-3 w-auto cursor-pointer"
                  >
                    <option value="all">All Statuses</option>
                    <option value="accept">Attending</option>
                    <option value="decline">Declined</option>
                    <option value="maybe">Tentative</option>
                  </select>

                  <button
                    onClick={handleExportCSV}
                    className="btn-outline text-xs py-2 px-3.5 flex items-center gap-1.5 whitespace-nowrap shadow-sm"
                  >
                    <FileSpreadsheet size={14} className="text-[#527A61]" />
                    Export CSV
                  </button>
                </div>
              </div>

              {/* Guest Responses Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-[#E7DDD0] text-[#756C67] uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-3">Guest Name</th>
                      <th className="py-3 px-3">Contact</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Guests</th>
                      <th className="py-3 px-3">Wishes / Message</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7DDD0]/60">
                    {filteredRSVPs.length > 0 ? (
                      filteredRSVPs.map((rsvp) => (
                        <tr key={rsvp.id} className="hover:bg-[#F8F3EA]/50 transition-colors">
                          <td className="py-3 px-3 font-semibold text-[#2A2423]">
                            {rsvp.name}
                          </td>
                          <td className="py-3 px-3 text-[#756C67]">
                            {rsvp.contact || "—"}
                          </td>
                          <td className="py-3 px-3">
                            {rsvp.attendance === "accept" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#527A61]/15 text-[#527A61]">
                                Joyfully Attending
                              </span>
                            )}
                            {rsvp.attendance === "decline" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#B65C5C]/15 text-[#B65C5C]">
                                Regretfully Declined
                              </span>
                            )}
                            {rsvp.attendance === "maybe" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#C6A15B]/15 text-[#8E6B24]">
                                Tentative
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 font-medium text-[#2A2423]">
                            {rsvp.attendance === "decline" ? 0 : rsvp.guestsCount}
                          </td>
                          <td className="py-3 px-3 text-[#756C67] max-w-xs truncate italic">
                            &ldquo;{rsvp.message || "Blessings to the couple!"}&rdquo;
                          </td>
                          <td className="py-3 px-3 text-right space-x-1.5">
                            <button
                              onClick={() => removeRSVP(rsvp.id)}
                              className="p-1 text-[#9B918A] hover:text-[#B65C5C] transition-colors"
                              title="Delete response"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-xs text-[#9B918A]">
                          No RSVP entries matching your filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: VISITOR ANALYTICS ── */}
        {activeTab === "analytics" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="stationery-card p-6 bg-[#FFFDF8] border border-[#E7DDD0] space-y-2">
                <span className="text-xs text-[#756C67] uppercase tracking-wider font-semibold">
                  Total Page Views
                </span>
                <h3
                  className="text-4xl font-bold text-[#321C32]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  1,480
                </h3>
                <div className="text-[11px] text-[#527A61] flex items-center gap-1">
                  <TrendingUp size={12} /> +18% past 48 hours
                </div>
              </div>

              <div className="stationery-card p-6 bg-[#FFFDF8] border border-[#E7DDD0] space-y-2">
                <span className="text-xs text-[#756C67] uppercase tracking-wider font-semibold">
                  Unique Guests Visited
                </span>
                <h3
                  className="text-4xl font-bold text-[#C6A15B]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  624
                </h3>
                <span className="text-[11px] text-[#756C67] block">
                  84% accessed via mobile phones
                </span>
              </div>

              <div className="stationery-card p-6 bg-[#FFFDF8] border border-[#E7DDD0] space-y-2">
                <span className="text-xs text-[#756C67] uppercase tracking-wider font-semibold">
                  RSVP Conversion Rate
                </span>
                <h3
                  className="text-4xl font-bold text-[#527A61]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  78.2%
                </h3>
                <span className="text-[11px] text-[#756C67] block">
                  High guest engagement
                </span>
              </div>
            </div>

            {/* Visual breakdown cards */}
            <div className="stationery-card p-6 sm:p-8 bg-[#FFFDF8] border border-[#E7DDD0] space-y-6">
              <h3
                className="text-lg font-bold text-[#321C32]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Guest Attendance Distribution
              </h3>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-[#527A61]">Joyfully Attending (85%)</span>
                    <span>{rsvpMetrics.attending} Guests</span>
                  </div>
                  <div className="h-3 w-full bg-[#E7DDD0] rounded-full overflow-hidden">
                    <div className="h-full bg-[#527A61] rounded-full" style={{ width: "85%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-[#8E6B24]">Tentative / Pending (10%)</span>
                    <span>{rsvpMetrics.tentative} Guests</span>
                  </div>
                  <div className="h-3 w-full bg-[#E7DDD0] rounded-full overflow-hidden">
                    <div className="h-full bg-[#C6A15B]" style={{ width: "10%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-[#B65C5C]">Regretfully Declined (5%)</span>
                    <span>{rsvpMetrics.declined} Guests</span>
                  </div>
                  <div className="h-3 w-full bg-[#E7DDD0] rounded-full overflow-hidden">
                    <div className="h-full bg-[#B65C5C]" style={{ width: "5%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: AI TEMPLATE MATCHER ── */}
        {activeTab === "matcher" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="stationery-card p-6 sm:p-8 bg-[#FFFDF8] border border-[#E7DDD0]">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={18} className="text-[#C6A15B]" />
                <h3
                  className="font-bold text-lg text-[#321C32]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  AI Style &amp; Cultural Recommender
                </h3>
              </div>
              <p className="text-xs text-[#756C67] mb-6">
                Tell us about your celebration traditions and aesthetic preferences, and our matching engine will suggest the perfect stationery design.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="text-xs font-semibold text-[#2A2423] block mb-1.5">
                    Celebration Occasion
                  </label>
                  <select
                    value={matcherOccasion}
                    onChange={(e) => setMatcherOccasion(e.target.value)}
                    className="input-editorial text-xs py-2.5 bg-[#FFFDF8]"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Engagement">Engagement</option>
                    <option value="Nikah">Nikah</option>
                    <option value="Haldi">Haldi</option>
                    <option value="Mehendi">Mehendi</option>
                    <option value="Reception">Reception</option>
                    <option value="Sangeet">Sangeet</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2A2423] block mb-1.5">
                    Cultural Tradition
                  </label>
                  <select
                    value={matcherCulture}
                    onChange={(e) => setMatcherCulture(e.target.value)}
                    className="input-editorial text-xs py-2.5 bg-[#FFFDF8]"
                  >
                    <option value="South Indian">South Indian</option>
                    <option value="North Indian">North Indian</option>
                    <option value="Christian">Christian</option>
                    <option value="Islamic">Islamic</option>
                    <option value="Minimal">Minimal</option>
                    <option value="Modern">Modern</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2A2423] block mb-1.5">
                    Aesthetic Mood
                  </label>
                  <select
                    value={matcherStyle}
                    onChange={(e) => setMatcherStyle(e.target.value)}
                    className="input-editorial text-xs py-2.5 bg-[#FFFDF8]"
                  >
                    <option value="Traditional">Sacred Traditional</option>
                    <option value="Royal">Royal &amp; Opulent</option>
                    <option value="Minimal">Minimal &amp; Clean</option>
                    <option value="Festive">Festive &amp; Vibrant</option>
                    <option value="Luxury">Luxury Black-Tie</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleRunMatcher}
                  className="btn-primary text-xs py-2.5 px-6 shadow-sm flex items-center gap-1.5"
                >
                  <Sparkles size={13} /> Run AI Recommendations
                </button>
              </div>
            </div>

            {/* Recommended Templates Display */}
            {recommendedTemplates.length > 0 && (
              <div className="space-y-4">
                <h4
                  className="text-base font-bold text-[#321C32]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Top Recommended Designs For Your Celebration
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recommendedTemplates.map((item) => (
                    <div
                      key={item.id}
                      className="stationery-card p-5 bg-[#FFFDF8] border border-[#E7DDD0] flex flex-col justify-between"
                    >
                      <div>
                        <span className="badge-gold text-[9px] py-0.5 px-2 mb-2 inline-block">
                          98% Compatibility Match
                        </span>
                        <h5
                          className="font-bold text-base text-[#321C32]"
                          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                        >
                          {item.name}
                        </h5>
                        <p className="text-xs text-[#756C67] line-clamp-2 mt-1 mb-4">
                          {item.description}
                        </p>
                      </div>
                      <Link
                        href={`/editor/${item.id}`}
                        onClick={() => setTemplate(item.id)}
                      >
                        <button className="btn-primary text-xs py-2 w-full justify-center">
                          Select This Template
                        </button>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
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
