import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { PRICING_TIERS, type PricingTierId } from "@/lib/templates";

export const runtime = "nodejs";

type VerificationRequest = {
  razorpay_payment_id?: unknown;
  razorpay_order_id?: unknown;
  razorpay_signature?: unknown;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && value.length <= 256;
}

function razorpayAuthorization(): string | null {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  return keyId && keySecret ? `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}` : null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as VerificationRequest;
    const { razorpay_payment_id: paymentId, razorpay_order_id: orderId, razorpay_signature: signature } = body;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const authorization = razorpayAuthorization();

    if (!isNonEmptyString(paymentId) || !isNonEmptyString(orderId) || !isNonEmptyString(signature) || !keySecret || !authorization) {
      return NextResponse.json({ error: "Invalid payment confirmation." }, { status: 400 });
    }

    const expected = createHmac("sha256", keySecret).update(`${orderId}|${paymentId}`).digest("hex");
    const signatureBuffer = Buffer.from(signature, "utf8");
    const expectedBuffer = Buffer.from(expected, "utf8");
    if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) {
      return NextResponse.json({ error: "Payment signature verification failed." }, { status: 400 });
    }

    const [orderResponse, paymentResponse] = await Promise.all([
      fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(orderId)}`, { headers: { Authorization: authorization }, cache: "no-store" }),
      fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`, { headers: { Authorization: authorization }, cache: "no-store" }),
    ]);
    if (!orderResponse.ok || !paymentResponse.ok) {
      return NextResponse.json({ error: "Could not confirm payment status." }, { status: 502 });
    }

    const order = await orderResponse.json() as { amount?: unknown; currency?: unknown; status?: unknown; notes?: { pricingTier?: unknown } };
    const payment = await paymentResponse.json() as { order_id?: unknown; status?: unknown };
    const tier = typeof order.notes?.pricingTier === "string"
      ? PRICING_TIERS.find((item) => item.id === order.notes?.pricingTier)
      : undefined;

    if (!tier || payment.order_id !== orderId || order.status !== "paid" || payment.status !== "captured" || order.currency !== "INR" || order.amount !== tier.price * 100) {
      return NextResponse.json({ error: "Payment has not been captured yet." }, { status: 409 });
    }

    return NextResponse.json({ verified: true, pricingTier: tier.id as PricingTierId });
  } catch (error) {
    console.error("Payment verification error", error);
    return NextResponse.json({ error: "Could not confirm payment. Please contact support if you were charged." }, { status: 500 });
  }
}
