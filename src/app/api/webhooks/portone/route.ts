import { NextResponse } from "next/server";
import { verifyPayment } from "@/lib/portone";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

// PortOne webhook handler
// Set this URL in PortOne admin console: https://biostatx.vercel.app/api/webhooks/portone
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (type === "Transaction.Paid") {
      const paymentId = data?.paymentId;
      if (!paymentId) {
        return NextResponse.json({ error: "No paymentId" }, { status: 400 });
      }

      // Verify with PortOne
      const payment = await verifyPayment(paymentId);

      if (payment.status === "PAID" && payment.customData) {
        try {
          const customData = JSON.parse(payment.customData);
          const { userId, planKey } = customData;

          if (userId && planKey) {
            await getSupabaseAdmin()
              .from("profiles")
              .update({ plan: planKey, portone_payment_id: paymentId })
              .eq("id", userId);
          }
        } catch {
          // customData parsing failed, skip
        }
      }
    }

    if (type === "Transaction.Cancelled" || type === "Transaction.Failed") {
      const paymentId = data?.paymentId;
      if (paymentId) {
        // Downgrade user if subscription payment failed
        const payment = await verifyPayment(paymentId);
        if (payment.customData) {
          try {
            const customData = JSON.parse(payment.customData);
            if (customData.userId) {
              await getSupabaseAdmin()
                .from("profiles")
                .update({ plan: "free" })
                .eq("id", customData.userId);
            }
          } catch {
            // skip
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
