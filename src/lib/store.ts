import { create } from "zustand";
import { persist } from "zustand/middleware";
import { OutputFormat } from "./cardTemplates";
import type { PricingTierId } from "./templates";
import { getTemplateDefaultNames } from "./templates";

export interface EventScheduleItem {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  address?: string;
  dressCode?: string;
  description?: string;
  mapUrl?: string;
}

export interface GuestRSVP {
  id: string;
  name: string;
  contact: string; // phone or email
  attendance: "accept" | "decline" | "maybe";
  guestsCount: number;
  message: string;
  submittedAt: string;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption?: string;
}

export interface InvitationData {
  templateId: string;
  cardTemplateId: string;
  outputFormat: OutputFormat;
  brideName: string;
  groomName: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  venueAddress: string;
  googleMapsUrl?: string;
  dressCode?: string;
  customMessage: string;
  story: string;
  couplePhoto: string; // base64 or URL
  groomPhoto?: string; // base64 or URL
  bridePhoto?: string; // base64 or URL
  photoMode?: "couple" | "separate";
  hostNames: string;
  rsvpPhone: string;
  rsvpDeadline: string;
  musicEnabled: boolean;
  musicTrack?: string;
  pricingTier: PricingTierId | null;
  isPaid: boolean;
  qrCodeUrl: string;
  invitationSlug: string;
  events: EventScheduleItem[];
  timerEnabled: boolean;
  timerDate: string;
  gallery: GalleryPhoto[];
  rsvps: GuestRSVP[];
  envelopeStyle: "luxury-plum" | "royal-gold" | "warm-ivory";
}

export interface StoreState {
  invitation: InvitationData;
  setField: (field: keyof InvitationData, value: unknown) => void;
  setTemplate: (templateId: string) => void;
  setCardTemplate: (cardTemplateId: string) => void;
  setOutputFormat: (format: OutputFormat) => void;
  setPricingTier: (tier: PricingTierId) => void;
  markPaid: () => void;
  resetInvitation: () => void;
  musicPlaying: boolean;
  toggleMusic: () => void;
  
  // Advanced Event & RSVP actions
  addEvent: (event: Omit<EventScheduleItem, "id">) => void;
  updateEvent: (id: string, updated: Partial<EventScheduleItem>) => void;
  removeEvent: (id: string) => void;
  reorderEvents: (events: EventScheduleItem[]) => void;
  
  addRSVP: (rsvp: Omit<GuestRSVP, "id" | "submittedAt">) => void;
  updateRSVPStatus: (id: string, attendance: GuestRSVP["attendance"]) => void;
  removeRSVP: (id: string) => void;

  addGalleryPhoto: (photo: { url: string; caption?: string }) => void;
  removeGalleryPhoto: (id: string) => void;
}

const defaultInvitation: InvitationData = {
  templateId: "south-indian",
  cardTemplateId: "south-indian-card",
  outputFormat: "website",
  brideName: "Deepika",
  groomName: "Karthik",
  eventName: "Auspicious Wedding Ceremony",
  eventDate: "2026-11-28",
  eventTime: "09:30 AM",
  venue: "The Leela Palace Kalyanamandapam",
  venueAddress: "Adyar Seaface, MRC Nagar, Chennai, Tamil Nadu 600028",
  googleMapsUrl: "https://maps.google.com/?q=The+Leela+Palace+Chennai",
  dressCode: "Traditional Kanjeevaram & Silk Dhoti / Festive Elegance",
  customMessage: "Together with our families, we joyfully invite you to celebrate our sacred union and share in the blessing of our new beginning.",
  story: "Two paths. One beautiful journey. Across seasons and serendipity, our story brought our hearts together. Now, hand in hand, we step into a lifetime of laughter, celebration, and unwavering love.",
  couplePhoto: "",
  groomPhoto: "",
  bridePhoto: "",
  photoMode: "separate",
  hostNames: "Mr. & Mrs. Sundaram | Mr. & Mrs. Natarajan",
  rsvpPhone: "+91 98401 23456",
  rsvpDeadline: "2026-11-10",
  musicEnabled: true,
  musicTrack: "traditional-carnatic",
  pricingTier: null,
  isPaid: false,
  qrCodeUrl: "",
  invitationSlug: "karthik-and-deepika",
  envelopeStyle: "luxury-plum",
  events: [
    {
      id: "ev-1",
      name: "Muhurtham Ceremony",
      date: "Saturday, 28th November 2026",
      time: "09:30 AM - 11:30 AM",
      venue: "Grand Ballroom, The Leela Palace",
      address: "Adyar Seaface, Chennai",
      dressCode: "Traditional South Indian Silk",
      description: "Sacred Vedic rituals, Kanyadanam, and Mangalyadharanam.",
    },
    {
      id: "ev-2",
      name: "Grand Reception",
      date: "Saturday, 28th November 2026",
      time: "07:00 PM onwards",
      venue: "Sea Breeze Lawns, The Leela Palace",
      address: "Adyar Seaface, Chennai",
      dressCode: "Evening Formal / Festive Indian",
      description: "Dinner, live music, and celebratory toasts under the stars.",
    },
  ],
  timerEnabled: true,
  timerDate: "2026-11-28T09:30",
  gallery: [],
  rsvps: [
    {
      id: "rsvp-demo-1",
      name: "Raghav & Family",
      contact: "+91 98765 43210",
      attendance: "accept",
      guestsCount: 4,
      message: "Sending our warmest congratulations and blessings to the wonderful couple!",
      submittedAt: "2026-09-12T14:30:00Z",
    },
    {
      id: "rsvp-demo-2",
      name: "Dr. Ananya Sharma",
      contact: "ananya.sharma@example.com",
      attendance: "accept",
      guestsCount: 2,
      message: "Thrilled to witness your special day! Can't wait to celebrate with you both.",
      submittedAt: "2026-09-13T10:15:00Z",
    },
    {
      id: "rsvp-demo-3",
      name: "Vikram Malhotra",
      contact: "+91 91234 56789",
      attendance: "maybe",
      guestsCount: 1,
      message: "Will try my best to attend the reception in person!",
      submittedAt: "2026-09-14T18:45:00Z",
    },
  ],
};

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      invitation: { ...defaultInvitation },
      musicPlaying: false,

      setField: (field, value) =>
        set((state) => ({
          invitation: { ...state.invitation, [field]: value },
        })),

      setTemplate: (templateId) =>
        set((state) => {
          const defaults = getTemplateDefaultNames(templateId);
          return {
            invitation: {
              ...state.invitation,
              templateId,
              groomName: state.invitation.groomName || defaults.groomName,
              brideName: state.invitation.brideName || defaults.brideName,
            },
          };
        }),

      setCardTemplate: (cardTemplateId) =>
        set((state) => ({
          invitation: { ...state.invitation, cardTemplateId },
        })),

      setOutputFormat: (format) =>
        set((state) => ({
          invitation: { ...state.invitation, outputFormat: format },
        })),

      setPricingTier: (tier) =>
        set((state) => ({
          invitation: { ...state.invitation, pricingTier: tier },
        })),

      markPaid: () =>
        set((state) => ({
          invitation: { ...state.invitation, isPaid: true },
        })),

      resetInvitation: () =>
        set(() => ({ invitation: { ...defaultInvitation } })),

      toggleMusic: () =>
        set((state) => ({ musicPlaying: !state.musicPlaying })),

      addEvent: (eventData) =>
        set((state) => ({
          invitation: {
            ...state.invitation,
            events: [
              ...state.invitation.events,
              { ...eventData, id: `ev-${Date.now()}` },
            ],
          },
        })),

      updateEvent: (id, updated) =>
        set((state) => ({
          invitation: {
            ...state.invitation,
            events: state.invitation.events.map((ev) =>
              ev.id === id ? { ...ev, ...updated } : ev
            ),
          },
        })),

      removeEvent: (id) =>
        set((state) => ({
          invitation: {
            ...state.invitation,
            events: state.invitation.events.filter((ev) => ev.id !== id),
          },
        })),

      reorderEvents: (events) =>
        set((state) => ({
          invitation: { ...state.invitation, events },
        })),

      addRSVP: (rsvpData) =>
        set((state) => ({
          invitation: {
            ...state.invitation,
            rsvps: [
              {
                ...rsvpData,
                id: `rsvp-${Date.now()}`,
                submittedAt: new Date().toISOString(),
              },
              ...state.invitation.rsvps,
            ],
          },
        })),

      updateRSVPStatus: (id, attendance) =>
        set((state) => ({
          invitation: {
            ...state.invitation,
            rsvps: state.invitation.rsvps.map((r) =>
              r.id === id ? { ...r, attendance } : r
            ),
          },
        })),

      removeRSVP: (id) =>
        set((state) => ({
          invitation: {
            ...state.invitation,
            rsvps: state.invitation.rsvps.filter((r) => r.id !== id),
          },
        })),

      addGalleryPhoto: (photo) =>
        set((state) => ({
          invitation: {
            ...state.invitation,
            gallery: [
              ...state.invitation.gallery,
              { id: `photo-${Date.now()}`, ...photo },
            ],
          },
        })),

      removeGalleryPhoto: (id) =>
        set((state) => ({
          invitation: {
            ...state.invitation,
            gallery: state.invitation.gallery.filter((p) => p.id !== id),
          },
        })),
    }),
    { name: "invito-luxury-store" }
  )
);
