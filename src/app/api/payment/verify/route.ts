import { NextResponse } from "next/server";
import { verifyPayment, PLANS } from "@/lib/portone";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const { paymentId, userId, planKey } = await request.json();

    if (!paymentId || !userId || !planKey) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify payment with PortOne API
    const payment = await verifyPayment(paymentId);

    // Check payment status
    if (payment.status !== "PAID") {
      return NextResponse.json({ error: "Payment not completed", status: payment.status }, { status: 400 });
    }

    // Verify amount matches the plan
    const plan = PLANS[planKey as keyof typeof PLANS];
    if (!plan || plan.priceKRW === 0) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    if (payment.amount?.total !== plan.priceKRW) {
      return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
    }

    // Update user profile in Supabase
    const { error: updateError } = await getSupabaseAdmin()
      .from("profiles")
      .update({
        plan: planKey,
        portone_payment_id: paymentId,
      })
      .eq("id", userId);

    if (updateError) {
      console.error("Profile update error:", updateError);
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }

    return NextResponse.json({ success: true, plan: planKey });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 });
  }
}
