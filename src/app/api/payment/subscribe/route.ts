import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

// Store billing key for recurring payments
export async function POST(request: Request) {
  try {
    const { billingKey, userId, planKey } = await request.json();

    if (!billingKey || !userId || !planKey) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Store billing key in Supabase for scheduled payments
    const { error: updateError } = await getSupabaseAdmin()
      .from("profiles")
      .update({
        plan: planKey,
        billing_key: billingKey,
        subscription_started_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (updateError) {
      console.error("Profile update error:", updateError);
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }

    return NextResponse.json({ success: true, plan: planKey });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json({ error: "Subscription setup failed" }, { status: 500 });
  }
}
