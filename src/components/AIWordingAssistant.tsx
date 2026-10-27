"use client";
import { useState } from "react";
import { Sparkles, X, Check, Copy, RefreshCw, Wand2, BookOpen, Heart, Calendar, MessageSquare, Compass } from "lucide-react";
import toast from "react-hot-toast";

interface AIWordingAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyText: (field: string, text: string) => void;
  brideName: string;
  groomName: string;
}

type WordingCategory = "invitation" | "story" | "events" | "dressCode" | "rsvp";
type ToneStyle = "romantic" | "traditional" | "elegant" | "minimal";

const WORDING_DATABASE: Record<WordingCategory, Record<ToneStyle, string[]>> = {
  invitation: {
    traditional: [
      "Together with their parents and seeking the blessings of the Almighty and our respected elders, we joyfully invite you to grace the sacred wedding ceremony of our beloved children and witness their holy union.",
      "With the grace of God and the loving blessings of our ancestors, we request the pleasure of your auspicious presence and blessings at the marriage ceremony of our children.",
    ],
    romantic: [
      "Two souls, two stories, and one destined journey. We found in each other a home, a best friend, and an endless adventure. We joyfully invite you to celebrate the day we promise forever.",
      "Because you have shared in our lives with your love and friendship, we invite you to share in our joy as we celebrate the beginning of our forever together.",
    ],
    elegant: [
      "Together with our families, we request the honor of your presence at our wedding celebration as we exchange vows and begin our new life together.",
      "We invite you to celebrate love, friendship, and the union of two families at the marriage of our children.",
    ],
    minimal: [
      "We're getting married! Please join us for an evening of love, laughter, and lifelong promises.",
      "Two hearts. One celebration. Join us as we tie the knot and celebrate with those who mean the most to us.",
    ],
  },
  story: {
    traditional: [
      "Rooted in tradition and guided by the warmth of family blessings, our paths crossed in divine timing. What began with gentle conversations and mutual respect has blossomed into an eternal bond forged in trust and enduring love.",
      "Guided by the stars and united by our shared values, our journey together is a testament to the beauty of destiny and the sanctity of marriage.",
    ],
    romantic: [
      "It started with an unexpected conversation over coffee, and somewhere between shared smiles and midnight conversations, we realized we had found our forever. Every chapter since has been our favorite page.",
      "From college hallways to thousands of shared sunsets, our love grew in the quiet moments just as much as the grand milestones. Now, we are ready for the adventure of a lifetime.",
    ],
    elegant: [
      "Two paths converged into one beautiful journey. Across time and distance, our mutual admiration blossomed into a profound partnership founded on laughter, shared dreams, and deep devotion.",
      "A chance encounter, a timeless bond. We grew together through life's seasons, discovering that home isn't a place, but a person.",
    ],
    minimal: [
      "We met, we laughed, we fell in love. And today, we choose each other for every tomorrow.",
      "Best friends first, partners for life. Our journey is simple, true, and just beginning.",
    ],
  },
  events: {
    traditional: [
      "Muhurtham Ceremony: The auspicious moment when sacred mantras seal our eternal vows, surrounded by fragrant jasmine and the sacred fire.",
      "Haldi & Pithi: A morning of joyous laughter, sacred turmeric paste, and yellow marigold showers to bless the bride and groom with radiance.",
    ],
    romantic: [
      "Sangeet Night: An evening under the stars filled with music, spontaneous dances, and sweet memories with our favorite people.",
      "Sunset Reception: Celebrate our new beginning with heartfelt toasts, decadent feast, and endless dancing under golden chandeliers.",
    ],
    elegant: [
      "Holy Matrimony: A reverent church service celebrating sacred vows, musical anthems, and the blessings of holy union.",
      "Grand Ballroom Gala: An evening of fine dining, celebratory champagne, and memorable conversations.",
    ],
    minimal: [
      "Ceremony & Vows: The moment we officially say 'I do' surrounded by our dearest circle.",
      "Celebration Dinner: Great food, live acoustic tunes, and celebration with family and friends.",
    ],
  },
  dressCode: {
    traditional: [
      "Traditional Indian Attire: Kanjeevaram silks, Pattu pavadais, Kurta pyjamas & Veshti.",
      "Royal Heritage: Regal Banarasi, Bandhgalas, and festive celebratory weaves.",
    ],
    romantic: [
      "Pastel Elegance: Soft florals, pastel lehengas, blush pinks, and daytime garden tones.",
      "Sundowner Chic: Warm sunset hues, flowing silhouettes, and cocktail festive attire.",
    ],
    elegant: [
      "Formal Black-Tie or Royal Traditional: Tuxedos, dark suits, or ornate heritage sherwanis & sarees.",
      "Cocktail Formal: Sophisticated evening gowns and tailored suits.",
    ],
    minimal: [
      "Smart Festive / Semi-Formal: Wear whatever makes you feel joyous, comfortable, and ready to dance!",
      "Monochrome or Earth Tones: Understated neutrals, ivory, and champagne.",
    ],
  },
  rsvp: {
    traditional: [
      "Kindly convey your blessings and attendance by November 10th to help us welcome you with warmth.",
      "We warmly await your gracious presence. Please confirm your attendance at your earliest convenience.",
    ],
    romantic: [
      "We can't celebrate properly without you! Kindly RSVP by the deadline so we can save you a seat at our table.",
      "Please let us know if you'll be joining us in this celebration of love and laughter.",
    ],
    elegant: [
      "Your presence would mean the world to us. Please RSVP before the requested date.",
      "The favor of a reply is requested on or before the deadline indicated.",
    ],
    minimal: [
      "Let us know if you can make it! Joyfully accept or regretfully decline above.",
      "Quick RSVP: Kindly let us know your head count before the date.",
    ],
  },
};

export function AIWordingAssistant({
  isOpen,
  onClose,
  onApplyText,
  brideName,
  groomName,
}: AIWordingAssistantProps) {
  const [activeCategory, setActiveCategory] = useState<WordingCategory>("invitation");
  const [activeTone, setActiveTone] = useState<ToneStyle>("romantic");
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!isOpen) return null;

  const currentOptions = WORDING_DATABASE[activeCategory][activeTone];
  const personalizedText = currentOptions[selectedIndex % currentOptions.length]
    .replace(/Bride/g, brideName || "Bride")
    .replace(/Groom/g, groomName || "Groom");

  const handleCopy = () => {
    navigator.clipboard.writeText(personalizedText);
    toast.success("Copied to clipboard!");
  };

  const handleApply = () => {
    let targetField = "customMessage";
    if (activeCategory === "story") targetField = "story";
    if (activeCategory === "dressCode") targetField = "dressCode";
    onApplyText(targetField, personalizedText);
    toast.success("Applied to invitation!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#FFFDF8] border border-[#E7DDD0] rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E7DDD0] flex items-center justify-between bg-[#F8F3EA]/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#321C32] flex items-center justify-center text-[#C6A15B] shadow-sm">
              <Wand2 size={16} />
            </div>
            <div>
              <h3
                className="font-bold text-base text-[#321C32]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                AI Copywriting Assistant
              </h3>
              <p className="text-[11px] text-[#756C67]">
                Craft elegant vows, heartfelt stories, and invitation wording
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#756C67] hover:text-[#321C32] hover:bg-[#F2EBDC] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Categories Tabs */}
        <div className="px-6 pt-4 border-b border-[#E7DDD0] flex items-center gap-2 overflow-x-auto pb-3">
          {[
            { id: "invitation" as const, label: "Invitation Wording", icon: BookOpen },
            { id: "story" as const, label: "Our Story", icon: Heart },
            { id: "events" as const, label: "Event Descriptions", icon: Calendar },
            { id: "dressCode" as const, label: "Dress Code", icon: Compass },
            { id: "rsvp" as const, label: "RSVP Notes", icon: MessageSquare },
          ].map((cat) => {
            const Icon = cat.icon;
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSelectedIndex(0);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  active
                    ? "bg-[#321C32] text-[#FFFDF8] shadow-sm"
                    : "bg-[#F8F3EA] text-[#756C67] hover:text-[#321C32]"
                }`}
              >
                <Icon size={12} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Tone Selector */}
        <div className="px-6 py-3 bg-[#F8F3EA]/50 border-b border-[#E7DDD0] flex items-center justify-between">
          <span className="text-[11px] font-semibold text-[#756C67] uppercase tracking-wider">
            Writing Tone:
          </span>
          <div className="flex gap-1.5">
            {[
              { id: "romantic" as const, label: "Romantic" },
              { id: "traditional" as const, label: "Traditional" },
              { id: "elegant" as const, label: "Elegant" },
              { id: "minimal" as const, label: "Minimal" },
            ].map((tone) => (
              <button
                key={tone.id}
                onClick={() => {
                  setActiveTone(tone.id);
                  setSelectedIndex(0);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  activeTone === tone.id
                    ? "bg-[#C6A15B] text-[#241323] font-semibold"
                    : "text-[#756C67] hover:text-[#321C32]"
                }`}
              >
                {tone.label}
              </button>
            ))}
          </div>
        </div>

        {/* Result Area */}
        <div className="p-6">
          <div className="stationery-card p-5 bg-[#FFFDF8] border border-[#E7DDD0] relative mb-4">
            <p className="text-sm text-[#2A2423] leading-relaxed font-serif italic mb-2">
              &ldquo;{personalizedText}&rdquo;
            </p>
            <div className="flex justify-between items-center text-[10px] text-[#9B918A] pt-3 border-t border-[#E7DDD0]">
              <span>Variation {selectedIndex + 1} of {currentOptions.length}</span>
              <button
                onClick={() => setSelectedIndex((i) => (i + 1) % currentOptions.length)}
                className="flex items-center gap-1 text-[#8E6B24] hover:underline font-semibold"
              >
                <RefreshCw size={11} /> Next Suggestion
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5">
            <button
              onClick={handleCopy}
              className="btn-outline text-xs py-2 px-3.5"
            >
              <Copy size={13} /> Copy Text
            </button>
            <button
              onClick={handleApply}
              className="btn-primary text-xs py-2 px-4 shadow-sm"
            >
              <Check size={13} /> Apply to Invitation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
