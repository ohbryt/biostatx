// PortOne V2 server-side utilities

export const PORTONE_API_SECRET = process.env.PORTONE_API_SECRET || "";
export const PORTONE_API_BASE = "https://api.portone.io";

export async function verifyPayment(paymentId: string) {
  const res = await fetch(
    `${PORTONE_API_BASE}/payments/${encodeURIComponent(paymentId)}`,
    {
      headers: {
        Authorization: `PortOne ${PORTONE_API_SECRET}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error(`Payment verification failed: ${res.status}`);
  }
  return res.json();
}

export async function issueBillingKey(billingKeyPaymentMethodId: string) {
  // Used for subscription billing key verification
  const res = await fetch(
    `${PORTONE_API_BASE}/billing-keys/${encodeURIComponent(billingKeyPaymentMethodId)}`,
    {
      headers: {
        Authorization: `PortOne ${PORTONE_API_SECRET}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error(`Billing key verification failed: ${res.status}`);
  }
  return res.json();
}

export async function payWithBillingKey(params: {
  billingKey: string;
  paymentId: string;
  orderName: string;
  amount: number;
  currency?: string;
  customerName?: string;
  customerEmail?: string;
}) {
  const res = await fetch(`${PORTONE_API_BASE}/payments/${encodeURIComponent(params.paymentId)}/billing-key`, {
    method: "POST",
    headers: {
      Authorization: `PortOne ${PORTONE_API_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      billingKey: params.billingKey,
      orderName: params.orderName,
      amount: {
        total: params.amount,
      },
      currency: params.currency || "KRW",
      customer: {
        name: { full: params.customerName },
        email: params.customerEmail,
      },
    }),
  });
  if (!res.ok) {
    throw new Error(`Billing key payment failed: ${res.status}`);
  }
  return res.json();
}

// Plan configuration (KRW pricing)
export const PLANS = {
  free: {
    name: "Free",
    priceKRW: 0,
    priceUSD: "$0",
    period: "forever",
  },
  pro: {
    name: "Pro",
    priceKRW: 12900,
    priceUSD: "$9.99",
    period: "/month",
  },
  team: {
    name: "Team",
    priceKRW: 39900,
    priceUSD: "$29.99",
    period: "/month",
  },
} as const;
