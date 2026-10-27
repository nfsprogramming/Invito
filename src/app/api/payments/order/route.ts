import { NextResponse } from "next/server";
import { PRICING_TIERS, type PricingTierId } from "@/lib/templates";

export const runtime = "nodejs";

function isPricingTierId(value: unknown): value is PricingTierId {
  return typeof value === "string" && PRICING_TIERS.some((tier) => tier.id === value);
}

function razorpayAuthorization(): string | null {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  return keyId && keySecret ? `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}` : null;
}

export async function POST(request: Request) {
  try {
    const { pricingTier } = await request.json() as { pricingTier?: unknown };
    if (!isPricingTierId(pricingTier)) {
      return NextResponse.json({ error: "Invalid pricing tier." }, { status: 400 });
    }

    const authorization = razorpayAuthorization();
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!authorization || !keyId) {
      return NextResponse.json({ error: "Payments have not been configured." }, { status: 503 });
    }

    const tier = PRICING_TIERS.find((item) => item.id === pricingTier)!;
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: { Authorization: authorization, "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: tier.price * 100,
        currency: "INR",
        receipt: `invito_${Date.now()}`,
        notes: { pricingTier },
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Razorpay order creation failed", await response.text());
      return NextResponse.json({ error: "Could not start payment. Please try again." }, { status: 502 });
    }

    const order = await response.json() as { id?: unknown; amount?: unknown; currency?: unknown };
    if (typeof order.id !== "string" || order.amount !== tier.price * 100 || order.currency !== "INR") {
      return NextResponse.json({ error: "Payment provider returned an invalid order." }, { status: 502 });
    }

    return NextResponse.json({ order: { id: order.id, amount: order.amount, currency: order.currency }, keyId });
  } catch (error) {
    console.error("Payment order error", error);
    return NextResponse.json({ error: "Could not start payment. Please try again." }, { status: 500 });
  }
}
