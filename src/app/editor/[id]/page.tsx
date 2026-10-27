"use client";
import { useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Eye,
  ShoppingCart,
  Upload,
  Sparkles,
  Smartphone,
  Monitor,
  Heart,
  Calendar,
  Clock,
  MapPin,
  Music2,
  Users,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Check,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useStore, EventScheduleItem } from "@/lib/store";
import { TEMPLATES } from "@/lib/templates";
import { CARD_TEMPLATES } from "@/lib/cardTemplates";
import { TemplateRenderer } from "@/components/templates/TemplateRenderer";
import { CardGenerator } from "@/components/CardGenerator";
import { AIWordingAssistant } from "@/components/AIWordingAssistant";
import toast from "react-hot-toast";

type EditorTab = "couple" | "details" | "events" | "story" | "family" | "rsvp" | "timer";

export default function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const {
    invitation,
    setField,
    setTemplate,
    addEvent,
    updateEvent,
    removeEvent,
  } = useStore();

  const fileRef = useRef<HTMLInputElement>(null);
  const groomFileRef = useRef<HTMLInputElement>(null);
  const brideFileRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<EditorTab>("couple");
  const [devicePreview, setDevicePreview] = useState<"desktop" | "mobile">("mobile");
  const [mobileViewMode, setMobileViewMode] = useState<"edit" | "preview">("edit");
  const [zoom, setZoom] = useState(1);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [newEventOpen, setNewEventOpen] = useState(false);
  const [newEventData, setNewEventData] = useState({
    name: "",
    date: "",
    time: "",
    venue: "",
    dressCode: "",
    description: "",
  });

  if (!id) {
    return <div className="min-h-screen bg-[#F8F3EA]" />;
  }

  const template = TEMPLATES.find((t) => t.id === id);
  if (invitation.templateId !== id) {
    setTemplate(id as string);
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, field: "couplePhoto" | "groomPhoto" | "bridePhoto" = "couplePhoto") => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Photo must be under 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setField(field, ev.target?.result as string);
      const label = field === "groomPhoto" ? "Groom" : field === "bridePhoto" ? "Bride" : "Couple";
      toast.success(`${label} photo uploaded!`);
    };
    reader.readAsDataURL(file);
  };

  const handleAddCustomEvent = () => {
    if (!newEventData.name || !newEventData.date) {
      toast.error("Please enter event name and date");
      return;
    }
    addEvent(newEventData);
    setNewEventData({ name: "", date: "", time: "", venue: "", dressCode: "", description: "" });
    setNewEventOpen(false);
    toast.success("Event ceremony added!");
  };

  const handleApplyAIText = (field: string, text: string) => {
    setField(field as keyof typeof invitation, text);
  };

  const handleCheckout = () => {
    if (!invitation.brideName || !invitation.groomName) {
      toast.error("Please provide both Bride & Groom names.");
      return;
    }
    router.push(`/payment?template=${id}`);
  };

  if (!template) {
    return (
      <div className="pt-24 text-center min-h-screen flex items-center justify-center bg-[#F8F3EA]">
        <div className="stationery-card p-8 max-w-md mx-auto">
          <p className="mb-4 text-[#756C67]">Template not found.</p>
          <Link href="/templates">
            <button className="btn-primary text-xs py-2.5 px-5">Browse Templates</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen flex flex-col bg-[#F8F3EA] text-[#2A2423]">
      {/* ── Top Bar ── */}
      <div className="sticky top-16 z-40 px-4 sm:px-6 py-3 bg-[#FFFDF8]/95 backdrop-blur-md border-b border-[#E7DDD0] shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/templates")}
            className="flex items-center gap-1.5 text-xs font-medium text-[#756C67] hover:text-[#321C32] px-2.5 py-1.5 rounded-lg hover:bg-[#F2EBDC] transition-colors"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Templates</span>
          </button>
          <div className="h-4 w-px bg-[#E7DDD0]" />
          <div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#C6A15B] block sm:inline mr-2">
              {template.category}
            </span>
            <span
              className="text-sm font-bold text-[#321C32]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {template.name}
            </span>
          </div>
        </div>

        {/* Center/Right action items */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Copywriting shortcut */}
          <button
            onClick={() => setAiAssistantOpen(true)}
            className="btn-gold text-xs py-1.5 px-3 shadow-sm flex items-center gap-1.5"
          >
            <Sparkles size={13} />
            <span className="hidden sm:inline">AI Copywriting</span>
          </button>

          {/* Device toggle (desktop only) */}
          <div className="hidden lg:flex items-center bg-[#F2EBDC] p-1 rounded-xl border border-[#E7DDD0]">
            <button
              onClick={() => setDevicePreview("mobile")}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                devicePreview === "mobile"
                  ? "bg-[#FFFDF8] text-[#321C32] shadow-sm"
                  : "text-[#756C67]"
              }`}
              title="Phone simulator"
            >
              <Smartphone size={14} />
            </button>
            <button
              onClick={() => setDevicePreview("desktop")}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                devicePreview === "desktop"
                  ? "bg-[#FFFDF8] text-[#321C32] shadow-sm"
                  : "text-[#756C67]"
              }`}
              title="Full canvas view"
            >
              <Monitor size={14} />
            </button>
          </div>

          {/* Fullscreen Preview Link */}
          <Link href={`/preview/${id}`}>
            <button className="btn-outline text-xs py-1.5 px-3 hidden sm:flex items-center gap-1.5 bg-[#FFFDF8]">
              <Eye size={13} /> Fullscreen
            </button>
          </Link>

          {/* Checkout CTA */}
          <button
            onClick={handleCheckout}
            className="btn-primary text-xs py-1.5 px-4 shadow-sm flex items-center gap-1.5"
          >
            <ShoppingCart size={13} /> Checkout
          </button>
        </div>
      </div>

      {/* ── Mobile View Switcher (Visible only on < lg) ── */}
      <div className="lg:hidden flex border-b border-[#E7DDD0] bg-[#FFFDF8]">
        <button
          onClick={() => setMobileViewMode("edit")}
          className={`flex-1 py-3 text-xs font-semibold text-center border-b-2 transition-colors ${
            mobileViewMode === "edit"
              ? "border-[#321C32] text-[#321C32] bg-[#F8F3EA]/50"
              : "border-transparent text-[#756C67]"
          }`}
        >
          Customize Details
        </button>
        <button
          onClick={() => setMobileViewMode("preview")}
          className={`flex-1 py-3 text-xs font-semibold text-center border-b-2 transition-colors ${
            mobileViewMode === "preview"
              ? "border-[#321C32] text-[#321C32] bg-[#F8F3EA]/50"
              : "border-transparent text-[#756C67]"
          }`}
        >
          Live Preview
        </button>
      </div>

      {/* ── Studio Workspace Body ── */}
      <div className="flex-1 flex overflow-hidden h-[calc(100vh-7rem)]">
        {/* ── Left: Guided Form Studio (Hidden on mobile when preview is active) ── */}
        <div
          className={`w-full lg:w-[460px] bg-[#FFFDF8] border-r border-[#E7DDD0] flex flex-col shrink-0 overflow-y-auto ${
            mobileViewMode === "preview" ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Form Step Nav Tabs */}
          <div className="p-4 border-b border-[#E7DDD0] bg-[#F8F3EA]/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: "couple" as const, label: "Couple", icon: Heart },
              { id: "details" as const, label: "Event", icon: Calendar },
              { id: "events" as const, label: "Multi-Events", icon: Clock },
              { id: "story" as const, label: "Our Story", icon: Sparkles },
              { id: "family" as const, label: "Family", icon: Users },
              { id: "rsvp" as const, label: "RSVP & Audio", icon: Music2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    active
                      ? "bg-[#321C32] text-[#FFFDF8] shadow-sm font-semibold"
                      : "bg-[#FFFDF8] text-[#756C67] border border-[#E7DDD0] hover:border-[#C6A15B]"
                  }`}
                >
                  <Icon size={12} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Form Content Panes */}
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            {/* 1. COUPLE PROFILE */}
            {activeTab === "couple" && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-[#E7DDD0] pb-2">
                  <h3 className="font-bold text-sm text-[#321C32]">Couple Profiles &amp; Names</h3>
                  <p className="text-xs text-[#756C67]">
                    The focal point of your invitation.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#2A2423] block mb-1.5">
                      Bride&apos;s Full Name
                    </label>
                    <input
                      className="input-editorial"
                      value={invitation.brideName}
                      onChange={(e) => setField("brideName", e.target.value)}
                      placeholder="e.g. Deepika"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#2A2423] block mb-1.5">
                      Groom&apos;s Full Name
                    </label>
                    <input
                      className="input-editorial"
                      value={invitation.groomName}
                      onChange={(e) => setField("groomName", e.target.value)}
                      placeholder="e.g. Karthik"
                    />
                  </div>
                </div>

                {/* Photo Management: Separate (Groom & Bride) vs Joint Couple Photo */}
                <div className="pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2.5">
                    <label className="text-xs font-semibold text-[#2A2423]">
                      Portrait Photos
                    </label>
                    <div className="inline-flex bg-[#F2EBDC] p-0.5 rounded-lg text-[11px] font-medium border border-[#E7DDD0] self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => setField("photoMode", "separate")}
                        className={`px-2.5 py-1 rounded-md transition-all ${
                          (invitation.photoMode ?? "separate") === "separate"
                            ? "bg-[#FFFDF8] text-[#321C32] shadow-sm font-semibold"
                            : "text-[#756C67] hover:text-[#321C32]"
                        }`}
                      >
                        Separate (Groom & Bride)
                      </button>
                      <button
                        type="button"
                        onClick={() => setField("photoMode", "couple")}
                        className={`px-2.5 py-1 rounded-md transition-all ${
                          invitation.photoMode === "couple"
                            ? "bg-[#FFFDF8] text-[#321C32] shadow-sm font-semibold"
                            : "text-[#756C67] hover:text-[#321C32]"
                        }`}
                      >
                        Joint Couple Photo
                      </button>
                    </div>
                  </div>

                  {(invitation.photoMode ?? "separate") === "separate" ? (
                    /* SEPARATE GROOM & BRIDE UPLOAD CARDS */
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Groom Card */}
                      <div className="stationery-card p-3.5 border border-[#E7DDD0] bg-[#F8F3EA]/50 text-center rounded-xl">
                        <div className="text-[11px] font-bold text-[#321C32] mb-2 flex items-center justify-center gap-1.5">
                          <span>🤵</span>
                          <span className="truncate">{invitation.groomName || "Groom"}&apos;s Portrait</span>
                        </div>
                        {invitation.groomPhoto ? (
                          <div className="space-y-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={invitation.groomPhoto}
                              alt={invitation.groomName || "Groom"}
                              className="w-24 h-24 object-cover rounded-full mx-auto border-2 border-[#C6A15B] shadow-md"
                            />
                            <div className="flex justify-center gap-1.5 pt-1">
                              <button
                                type="button"
                                onClick={() => groomFileRef.current?.click()}
                                className="btn-outline text-[10px] py-1 px-2.5"
                              >
                                Replace
                              </button>
                              <button
                                type="button"
                                onClick={() => setField("groomPhoto", "")}
                                className="text-[10px] text-[#B65C5C] hover:underline px-1.5"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => groomFileRef.current?.click()}
                            className="cursor-pointer py-4 px-2 flex flex-col items-center justify-center gap-1.5 border-2 border-dashed border-[#C6A15B]/40 rounded-xl hover:bg-[#F2EBDC] transition-colors"
                          >
                            <div className="w-8 h-8 rounded-full bg-[#FFFDF8] flex items-center justify-center text-[#C6A15B] shadow-sm">
                              <Upload size={14} />
                            </div>
                            <span className="text-[11px] font-semibold text-[#321C32]">
                              Upload {invitation.groomName || "Groom"}
                            </span>
                            <span className="text-[9px] text-[#9B918A]">JPG or PNG</span>
                          </div>
                        )}
                        <input
                          ref={groomFileRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePhotoUpload(e, "groomPhoto")}
                          className="hidden"
                        />
                      </div>

                      {/* Bride Card */}
                      <div className="stationery-card p-3.5 border border-[#E7DDD0] bg-[#F8F3EA]/50 text-center rounded-xl">
                        <div className="text-[11px] font-bold text-[#321C32] mb-2 flex items-center justify-center gap-1.5">
                          <span>👰</span>
                          <span className="truncate">{invitation.brideName || "Bride"}&apos;s Portrait</span>
                        </div>
                        {invitation.bridePhoto ? (
                          <div className="space-y-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={invitation.bridePhoto}
                              alt={invitation.brideName || "Bride"}
                              className="w-24 h-24 object-cover rounded-full mx-auto border-2 border-[#C6A15B] shadow-md"
                            />
                            <div className="flex justify-center gap-1.5 pt-1">
                              <button
                                type="button"
                                onClick={() => brideFileRef.current?.click()}
                                className="btn-outline text-[10px] py-1 px-2.5"
                              >
                                Replace
                              </button>
                              <button
                                type="button"
                                onClick={() => setField("bridePhoto", "")}
                                className="text-[10px] text-[#B65C5C] hover:underline px-1.5"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => brideFileRef.current?.click()}
                            className="cursor-pointer py-4 px-2 flex flex-col items-center justify-center gap-1.5 border-2 border-dashed border-[#C6A15B]/40 rounded-xl hover:bg-[#F2EBDC] transition-colors"
                          >
                            <div className="w-8 h-8 rounded-full bg-[#FFFDF8] flex items-center justify-center text-[#C6A15B] shadow-sm">
                              <Upload size={14} />
                            </div>
                            <span className="text-[11px] font-semibold text-[#321C32]">
                              Upload {invitation.brideName || "Bride"}
                            </span>
                            <span className="text-[9px] text-[#9B918A]">JPG or PNG</span>
                          </div>
                        )}
                        <input
                          ref={brideFileRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePhotoUpload(e, "bridePhoto")}
                          className="hidden"
                        />
                      </div>
                    </div>
                  ) : (
                    /* SINGLE COUPLE PHOTO UPLOAD */
                    <div className="stationery-card p-4 border border-[#E7DDD0] bg-[#F8F3EA]/50 text-center rounded-xl">
                      {invitation.couplePhoto ? (
                        <div className="space-y-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={invitation.couplePhoto}
                            alt="Couple"
                            className="w-32 h-32 object-cover rounded-full mx-auto border-2 border-[#C6A15B] shadow-md"
                          />
                          <div className="flex justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => fileRef.current?.click()}
                              className="btn-outline text-xs py-1.5 px-3"
                            >
                              Replace Photo
                            </button>
                            <button
                              type="button"
                              onClick={() => setField("couplePhoto", "")}
                              className="text-xs text-[#B65C5C] hover:underline px-2"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => fileRef.current?.click()}
                          className="cursor-pointer py-6 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#C6A15B]/40 rounded-xl hover:bg-[#F2EBDC] transition-colors"
                        >
                          <div className="w-10 h-10 rounded-full bg-[#FFFDF8] flex items-center justify-center text-[#C6A15B] shadow-sm">
                            <Upload size={16} />
                          </div>
                          <span className="text-xs font-semibold text-[#321C32]">
                            Upload Joint Portrait (Optional)
                          </span>
                          <span className="text-[10px] text-[#9B918A]">
                            JPG or PNG up to 5MB
                          </span>
                        </div>
                      )}
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(e, "couplePhoto")}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. EVENT DETAILS */}
            {activeTab === "details" && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-[#E7DDD0] pb-2">
                  <h3 className="font-bold text-sm text-[#321C32]">Primary Event Details</h3>
                  <p className="text-xs text-[#756C67]">Date, timings, and location venue</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2A2423] block mb-1.5">
                    Ceremony / Event Name
                  </label>
                  <input
                    className="input-editorial"
                    value={invitation.eventName}
                    onChange={(e) => setField("eventName", e.target.value)}
                    placeholder="e.g. Sacred Wedding Ceremony"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#2A2423] block mb-1.5">
                      Event Date
                    </label>
                    <input
                      type="date"
                      className="input-editorial"
                      value={invitation.eventDate}
                      onChange={(e) => setField("eventDate", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#2A2423] block mb-1.5">
                      Auspicious Time / Muhurtham
                    </label>
                    <input
                      className="input-editorial"
                      value={invitation.eventTime}
                      onChange={(e) => setField("eventTime", e.target.value)}
                      placeholder="e.g. 09:30 AM onwards"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2A2423] block mb-1.5">
                    Venue Name
                  </label>
                  <input
                    className="input-editorial"
                    value={invitation.venue}
                    onChange={(e) => setField("venue", e.target.value)}
                    placeholder="e.g. The Leela Palace Kalyanamandapam"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2A2423] block mb-1.5">
                    Full Venue Address
                  </label>
                  <input
                    className="input-editorial"
                    value={invitation.venueAddress}
                    onChange={(e) => setField("venueAddress", e.target.value)}
                    placeholder="e.g. Adyar Seaface, MRC Nagar, Chennai - 600028"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2A2423] block mb-1.5">
                    Google Maps Link
                  </label>
                  <input
                    className="input-editorial"
                    value={invitation.googleMapsUrl || ""}
                    onChange={(e) => setField("googleMapsUrl", e.target.value)}
                    placeholder="https://maps.google.com/..."
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2A2423] block mb-1.5">
                    Dress Code Guidance
                  </label>
                  <input
                    className="input-editorial"
                    value={invitation.dressCode || ""}
                    onChange={(e) => setField("dressCode", e.target.value)}
                    placeholder="e.g. Traditional Silk Sarees & Dhoti / Black Tie"
                  />
                </div>
              </div>
            )}

            {/* 3. MULTI-EVENT ITINERARY */}
            {activeTab === "events" && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-[#E7DDD0] pb-2 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-[#321C32]">Multi-Event Itinerary</h3>
                    <p className="text-xs text-[#756C67]">Engagement, Haldi, Sangeet, Muhurtham</p>
                  </div>
                  <button
                    onClick={() => setNewEventOpen(!newEventOpen)}
                    className="btn-gold text-xs py-1.5 px-3 flex items-center gap-1"
                  >
                    <Plus size={13} /> Add Function
                  </button>
                </div>

                {/* Add Event Form Modal / Accordion */}
                <AnimatePresence>
                  {newEventOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="stationery-card p-4 border border-[#C6A15B]/40 bg-[#FFFDF8] space-y-3"
                    >
                      <span className="text-xs font-bold text-[#321C32] block">
                        New Function Ceremony
                      </span>
                      <input
                        className="input-editorial text-xs py-2"
                        placeholder="Function Name (e.g. Haldi / Sangeet / Nikah)"
                        value={newEventData.name}
                        onChange={(e) => setNewEventData({ ...newEventData, name: e.target.value })}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          className="input-editorial text-xs py-2"
                          placeholder="Date (e.g. Friday, 27 Nov)"
                          value={newEventData.date}
                          onChange={(e) => setNewEventData({ ...newEventData, date: e.target.value })}
                        />
                        <input
                          className="input-editorial text-xs py-2"
                          placeholder="Time (e.g. 05:00 PM)"
                          value={newEventData.time}
                          onChange={(e) => setNewEventData({ ...newEventData, time: e.target.value })}
                        />
                      </div>
                      <input
                        className="input-editorial text-xs py-2"
                        placeholder="Venue / Hall Name"
                        value={newEventData.venue}
                        onChange={(e) => setNewEventData({ ...newEventData, venue: e.target.value })}
                      />
                      <input
                        className="input-editorial text-xs py-2"
                        placeholder="Dress Code (e.g. Sunshine Yellow)"
                        value={newEventData.dressCode}
                        onChange={(e) => setNewEventData({ ...newEventData, dressCode: e.target.value })}
                      />
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={() => setNewEventOpen(false)}
                          className="btn-outline text-xs py-1 px-3"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAddCustomEvent}
                          className="btn-primary text-xs py-1 px-3"
                        >
                          Save Function
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Event Items List */}
                <div className="space-y-3">
                  {invitation.events.map((ev, index) => (
                    <div
                      key={ev.id}
                      className="p-3.5 rounded-xl border border-[#E7DDD0] bg-[#F8F3EA]/40 space-y-1.5 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#321C32]">
                          Day {index + 1}: {ev.name}
                        </span>
                        <button
                          onClick={() => removeEvent(ev.id)}
                          className="text-[#9B918A] hover:text-[#B65C5C] p-1 transition-colors"
                          title="Remove function"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <div className="text-[11px] text-[#756C67] flex flex-wrap gap-x-3">
                        <span>📅 {ev.date}</span>
                        <span>⏰ {ev.time}</span>
                      </div>
                      {ev.venue && (
                        <div className="text-[11px] text-[#756C67]">
                          📍 {ev.venue}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. OUR LOVE STORY */}
            {activeTab === "story" && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-[#E7DDD0] pb-2 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-[#321C32]">Our Story &amp; Message</h3>
                    <p className="text-xs text-[#756C67]">Personal narrative and love story</p>
                  </div>
                  <button
                    onClick={() => setAiAssistantOpen(true)}
                    className="text-xs text-[#8E6B24] font-semibold flex items-center gap-1 hover:underline"
                  >
                    <Sparkles size={12} /> AI Help
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2A2423] block mb-1.5">
                    Invitation Greeting &amp; Opening Message
                  </label>
                  <textarea
                    rows={3}
                    className="input-editorial resize-none"
                    value={invitation.customMessage}
                    onChange={(e) => setField("customMessage", e.target.value)}
                    placeholder="Together with our families..."
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2A2423] block mb-1.5">
                    Our Story (How We Met)
                  </label>
                  <textarea
                    rows={4}
                    className="input-editorial resize-none"
                    value={invitation.story}
                    onChange={(e) => setField("story", e.target.value)}
                    placeholder="Two paths. One beautiful journey..."
                  />
                </div>
              </div>
            )}

            {/* 5. FAMILY & HOSTS */}
            {activeTab === "family" && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-[#E7DDD0] pb-2">
                  <h3 className="font-bold text-sm text-[#321C32]">Family &amp; Host Honors</h3>
                  <p className="text-xs text-[#756C67]">Honoring parents, grandparents &amp; hosts</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2A2423] block mb-1.5">
                    Host Families / Parents
                  </label>
                  <input
                    className="input-editorial"
                    value={invitation.hostNames}
                    onChange={(e) => setField("hostNames", e.target.value)}
                    placeholder="e.g. Mr. & Mrs. Sundaram | Mr. & Mrs. Natarajan"
                  />
                  <p className="text-[10px] text-[#9B918A] mt-1">
                    Separate families with a pipe character (|) or ampersand (&amp;).
                  </p>
                </div>
              </div>
            )}

            {/* 6. RSVP & AUDIO */}
            {activeTab === "rsvp" && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-[#E7DDD0] pb-2">
                  <h3 className="font-bold text-sm text-[#321C32]">RSVP &amp; Celebration Music</h3>
                  <p className="text-xs text-[#756C67]">Guest responses and ceremony ambience</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2A2423] block mb-1.5">
                    RSVP Contact Phone / Email
                  </label>
                  <input
                    className="input-editorial"
                    value={invitation.rsvpPhone}
                    onChange={(e) => setField("rsvpPhone", e.target.value)}
                    placeholder="+91 98401 23456"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2A2423] block mb-1.5">
                    RSVP Confirmation Deadline
                  </label>
                  <input
                    type="date"
                    className="input-editorial"
                    value={invitation.rsvpDeadline}
                    onChange={(e) => setField("rsvpDeadline", e.target.value)}
                  />
                </div>

                {/* Celebration Countdown Timer */}
                <div className="pt-2 border-t border-[#E7DDD0]">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-[#2A2423]">
                      Auspicious Countdown Timer
                    </label>
                    <input
                      type="checkbox"
                      checked={invitation.timerEnabled}
                      onChange={(e) => setField("timerEnabled", e.target.checked)}
                      className="rounded text-[#C6A15B] focus:ring-[#C6A15B]"
                    />
                  </div>

                  {invitation.timerEnabled && (
                    <input
                      type="datetime-local"
                      className="input-editorial text-xs"
                      value={invitation.timerDate}
                      onChange={(e) => setField("timerDate", e.target.value)}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Live Canvas Viewport (Hidden on mobile when edit is active) ── */}
        <div
          className={`flex-1 bg-[#F2EBDC] overflow-hidden relative flex flex-col items-center justify-center p-4 sm:p-8 ${
            mobileViewMode === "edit" ? "hidden lg:flex" : "flex"
          }`}
          style={{
            backgroundImage: "radial-gradient(#D6CABA 0.75px, transparent 0.75px)",
            backgroundSize: "20px 20px",
          }}
        >
          {/* Zoom controls floating bar */}
          <div className="absolute bottom-6 right-6 z-30 flex items-center gap-1.5 bg-[#FFFDF8]/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#E7DDD0] shadow-lg">
            <button
              onClick={() => setZoom((z) => Math.max(0.6, z - 0.1))}
              className="p-1 text-[#756C67] hover:text-[#321C32]"
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <span className="text-[11px] font-semibold text-[#321C32] px-1">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))}
              className="p-1 text-[#756C67] hover:text-[#321C32]"
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-1 text-[#756C67] hover:text-[#321C32] ml-1"
              title="Reset Zoom"
            >
              <RotateCcw size={12} />
            </button>
          </div>

          {/* Rendered Canvas Simulator */}
          <div
            className="transition-transform duration-200 origin-center flex items-center justify-center"
            style={{ transform: `scale(${zoom})` }}
          >
            {devicePreview === "mobile" ? (
              /* Realistic iPhone Device Frame */
              <div className="relative w-[360px] h-[680px] bg-black rounded-[48px] p-3 shadow-2xl border-4 border-[#3D3734] ring-1 ring-black/30 shrink-0">
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-30 pointer-events-none" />
                <div className="w-full h-full rounded-[38px] overflow-hidden bg-black relative">
                  <TemplateRenderer templateId={id as string} previewMode={false} />
                </div>
              </div>
            ) : (
              /* Desktop Canvas Frame */
              <div
                className="bg-black rounded-2xl overflow-hidden shadow-2xl border border-[#E7DDD0]"
                style={{ width: 1040, height: 680 }}
              >
                <TemplateRenderer templateId={id as string} previewMode={false} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Copywriting Assistant Modal */}
      <AIWordingAssistant
        isOpen={aiAssistantOpen}
        onClose={() => setAiAssistantOpen(false)}
        onApplyText={handleApplyAIText}
        brideName={invitation.brideName}
        groomName={invitation.groomName}
      />
    </div>
  );
}
