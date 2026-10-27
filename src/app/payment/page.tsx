"use client";
import Script from "next/script";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { CheckCircle, Zap, Star, Crown, ArrowLeft, ShieldCheck, Lock, Sparkles } from "lucide-react";
import { useStore } from "@/lib/store";
import { TEMPLATES, PRICING_TIERS, PricingTierId } from "@/lib/templates";
import toast from "react-hot-toast";

type RazorpaySuccess = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayCheckout = new (options: Record<string, unknown>) => { open: () => void };

declare global {
  interface Window {
    Razorpay?: RazorpayCheckout;
  }
}

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateId = searchParams.get("template") || "";
  const { invitation, setPricingTier, markPaid } = useStore();
  const [selectedTierId, setSelectedTierId] = useState<PricingTierId>(invitation.pricingTier || "combo");
  const [loading, setLoading] = useState(false);
  const [gatewayReady, setGatewayReady] = useState(false);

  const template = TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[0];
  const selectedTier = PRICING_TIERS.find((t) => t.id === selectedTierId) || PRICING_TIERS[3];

  const handlePay = async () => {
    // If free tier is selected, instantly approve
    if (selectedTier.price === 0) {
      setPricingTier(selectedTier.id);
      toast.success("Free preview tier active!");
      router.push("/dashboard");
      return;
    }

    if (!window.Razorpay) {
      toast.error("Payment gateway is initializing. Please try in a moment.");
      return;
    }

    setLoading(true);
    try {
      const orderResponse = await fetch("/api/payments/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pricingTier: selectedTierId }),
      });

      const orderPayload = (await orderResponse.json()) as {
        error?: string;
        keyId?: string;
        order?: { id: string; amount: number; currency: string };
      };

      if (!orderResponse.ok || !orderPayload.keyId || !orderPayload.order) {
        throw new Error(orderPayload.error || "Could not initialize order.");
      }

      const checkout = new window.Razorpay({
        key: orderPayload.keyId,
        amount: orderPayload.order.amount,
        currency: orderPayload.order.currency,
        order_id: orderPayload.order.id,
        name: "Invito Studio",
        description: `${selectedTier.name} — ${template.name}`,
        prefill: {
          name: `${invitation.brideName} & ${invitation.groomName}`,
          contact: invitation.rsvpPhone || "+919876543210",
        },
        theme: { color: "#321C32" },
        modal: { ondismiss: () => setLoading(false) },
        handler: async (response: RazorpaySuccess) => {
          try {
            const verifyResponse = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });

            const verification = (await verifyResponse.json()) as {
              error?: string;
              pricingTier?: PricingTierId;
            };

            if (!verifyResponse.ok || !verification.pricingTier) {
              toast.error(verification.error || "Could not verify payment signature.");
              return;
            }

            setPricingTier(verification.pricingTier);
            markPaid();
            toast.success("Payment verified! Your luxury invitation is unlocked.");
            router.push("/dashboard");
          } catch {
            toast.error("Payment verification encountered an issue. Please contact support if debited.");
          } finally {
            setLoading(false);
          }
        },
      });

      checkout.open();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error instanceof Error ? error.message : "Payment error occurred.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-xs text-[#756C67] hover:text-[#321C32] mb-8 font-medium"
      >
        <ArrowLeft size={14} /> Back to Studio Customizer
      </button>

      {/* Header */}
      <div className="text-center mb-12">
        <span className="badge-gold text-[10px] mb-2 bg-[#FFFDF8] border-[#C6A15B]/30 shadow-sm">
          Secure Studio Checkout
        </span>
        <h1
          className="text-3xl sm:text-4xl font-bold text-[#321C32] mt-1 mb-2 tracking-tight"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Unlock Your Invitation <span className="text-[#C6A15B] italic font-cormorant font-normal">Package</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#756C67]">
          Selected Design: <strong>{template.name}</strong> ({template.category})
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {PRICING_TIERS.filter((t) => t.id !== "free-preview").map((tier) => {
          const isSelected = selectedTierId === tier.id;
          return (
            <div
              key={tier.id}
              onClick={() => setSelectedTierId(tier.id)}
              className={`stationery-card p-6 cursor-pointer bg-[#FFFDF8] border transition-all ${
                isSelected
                  ? "border-[#321C32] shadow-hover ring-2 ring-[#321C32]/20"
                  : "border-[#E7DDD0] opacity-85 hover:opacity-100"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-base text-[#321C32]">{tier.name}</span>
                <span
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? "border-[#321C32] bg-[#321C32]" : "border-[#E7DDD0]"
                  }`}
                >
                  {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                </span>
              </div>

              <div className="text-2xl font-bold text-[#321C32] mb-3">
                {tier.currency}{tier.price}
                <span className="text-[10px] text-[#756C67] font-normal ml-1">one-time</span>
              </div>

              <ul className="space-y-2 text-xs text-[#756C67] pt-3 border-t border-[#E7DDD0]">
                {tier.features.slice(0, 4).map((f, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <CheckCircle size={13} className="text-[#C6A15B] shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Summary Box & Pay Trigger */}
      <div className="stationery-card p-6 sm:p-8 bg-[#FFFDF8] border border-[#E7DDD0] max-w-xl mx-auto text-center space-y-5 shadow-lg">
        <div className="flex items-center justify-between pb-4 border-b border-[#E7DDD0] text-sm">
          <div>
            <strong className="text-[#321C32] block text-left font-serif text-base">
              {selectedTier.name} Package
            </strong>
            <span className="text-xs text-[#756C67] block text-left">
              {invitation.groomName} &amp; {invitation.brideName} Celebration
            </span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-[#321C32]">
              {selectedTier.currency}{selectedTier.price}
            </span>
            <span className="text-[10px] text-[#527A61] block font-semibold">Taxes Included</span>
          </div>
        </div>

        <button
          onClick={handlePay}
          disabled={loading}
          className="btn-primary w-full py-3.5 text-sm justify-center shadow-md hover:shadow-xl font-semibold flex items-center gap-2"
        >
          {loading ? (
            <span>Processing Gateway...</span>
          ) : (
            <>
              <Lock size={14} /> Pay {selectedTier.currency}{selectedTier.price} &amp; Unlock Download
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-2 text-xs text-[#756C67]">
          <ShieldCheck size={14} className="text-[#527A61]" />
          <span>Secured by Razorpay · 256-Bit SSL Encrypted</span>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 min-h-screen bg-[#F8F3EA]">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
      <Suspense fallback={<div className="text-center py-20 text-xs text-[#756C67]">Loading checkout...</div>}>
        <PaymentContent />
      </Suspense>
    </div>
  );
}
