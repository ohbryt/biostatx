"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import * as PortOne from "@portone/browser-sdk/v2";

const plans = [
  {
    name: "Free",
    price: "₩0",
    priceUSD: "$0",
    period: "forever",
    amountKRW: 0,
    description: "Perfect for students and occasional use",
    features: [
      "T-Test (Independent & Paired)",
      "One-Way ANOVA",
      "Chi-Square Test",
      "Pearson Correlation",
      "Mann-Whitney U Test",
      "Sample Size Calculator",
      "Basic result export",
      "Community support",
    ],
    cta: "Start Free",
    planKey: "free" as const,
    highlight: false,
  },
  {
    name: "Pro",
    price: "₩12,900",
    priceUSD: "$9.99",
    period: "/month",
    amountKRW: 12900,
    description: "For active researchers and labs",
    features: [
      "Everything in Free, plus:",
      "Kaplan-Meier Survival Analysis",
      "Logistic Regression & ROC Curve",
      "Multiple Comparisons (Tukey, Bonferroni)",
      "Publication-ready charts (PNG/SVG)",
      "Curve Fitting (9 models)",
      "AI-powered interpretation",
      "Data history & saved analyses",
      "Priority email support",
    ],
    cta: "Subscribe Pro",
    planKey: "pro" as const,
    highlight: true,
  },
  {
    name: "Team",
    price: "₩39,900",
    priceUSD: "$29.99",
    period: "/month",
    amountKRW: 39900,
    description: "For research labs and institutions",
    features: [
      "Everything in Pro, plus:",
      "Up to 10 team members",
      "Shared analysis workspace",
      "Custom branding & API access",
      "Batch analysis",
      "Dedicated support & SSO",
      "Data compliance (HIPAA-ready)",
    ],
    cta: "Subscribe Team",
    planKey: "team" as const,
    highlight: false,
  },
];

const faqs = [
  {
    q: "Is BioStatX accurate enough for publication?",
    a: "Yes. BioStatX uses the same mathematical formulas as SPSS and R. All tests are validated against known reference datasets. Results include all values needed for APA-style reporting.",
  },
  {
    q: "Can I use BioStatX for my thesis/dissertation?",
    a: "Absolutely. Many graduate students use BioStatX for their research. You can cite it in your methods section: 'Statistical analyses were performed using BioStatX (biostatx.com).'",
  },
  {
    q: "How does BioStatX compare to SPSS?",
    a: "BioStatX covers the most commonly used biomedical statistical tests at a fraction of the cost. While SPSS offers more advanced features, 90% of researchers only need the tests we provide.",
  },
  {
    q: "Is my data secure?",
    a: "All calculations run directly in your browser. Your data never leaves your device. For Pro users, saved analyses are encrypted at rest and in transit.",
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Yes. You can cancel your Pro or Team subscription at any time. You'll continue to have access until the end of your billing period.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept all major Korean payment methods including credit/debit cards, bank transfer, and KakaoPay through our secure payment partner PortOne.",
  },
];

export default function PricingPage() {
  const { user, profile } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleCheckout = async (planKey: string, amountKRW: number, planName: string) => {
    if (!user) {
      window.location.href = "/auth/signup";
      return;
    }

    if (planKey === "free") {
      window.location.href = "/dashboard";
      return;
    }

    setLoadingPlan(planKey);
    try {
      const paymentId = `payment-${crypto.randomUUID()}`;

      const response = await PortOne.requestPayment({
        storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID || "",
        channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY || "",
        paymentId,
        orderName: `BioStatX ${planName} Plan (Monthly)`,
        totalAmount: amountKRW,
        currency: "CURRENCY_KRW",
        payMethod: "CARD",
        customData: {
          userId: user.id,
          planKey,
        },
        redirectUrl: `${window.location.origin}/dashboard?checkout=success&planKey=${planKey}&paymentId=${paymentId}`,
      });

      if (response && response.code !== undefined) {
        // Payment failed or cancelled
        if (response.code === "FAILURE_TYPE_PG") {
          alert("결제가 실패했습니다. 다시 시도해 주세요.");
        }
        // User cancelled — do nothing
      } else {
        // Payment succeeded on PC (non-redirect)
        const verifyRes = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId, userId: user.id, planKey }),
        });
        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          window.location.href = "/dashboard?checkout=success";
        } else {
          alert("결제 확인에 실패했습니다. 고객지원에 문의해 주세요.");
        }
      }
    } catch {
      alert("결제 처리 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const isCurrentPlan = (planKey: string) => {
    if (!user) return false;
    return profile?.plan === planKey || (!profile?.plan && planKey === "free");
  };

  const getButtonLabel = (plan: typeof plans[0]) => {
    if (loadingPlan === plan.planKey) return "처리 중...";
    if (isCurrentPlan(plan.planKey)) return "Current Plan";
    return plan.cta;
  };

  return (
    <>
      <Header />
      <main className="pt-28 pb-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-stone-800">
              Simple, <span className="gradient-text">Honest</span> Pricing
            </h1>
            <p className="text-lg text-stone-500 max-w-xl mx-auto">
              No hidden fees. No per-analysis charges. Start free, upgrade when you need more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`glass-card p-8 flex flex-col ${
                  plan.highlight ? "!border-orange-400/50 relative ring-2 ring-orange-200" : ""
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-xs font-bold text-white">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-stone-800">{plan.name}</h3>
                <div className="mt-3 mb-2">
                  <span className="text-4xl font-extrabold text-stone-900">{plan.price}</span>
                  <span className="text-stone-500 text-sm">{plan.period}</span>
                </div>
                <p className="text-xs text-stone-400 mb-1">{plan.priceUSD} USD equivalent</p>
                <p className="text-sm text-stone-500 mb-6">{plan.description}</p>

                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-green-600 mt-0.5 shrink-0">✓</span>
                      <span className="text-stone-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                {isCurrentPlan(plan.planKey) ? (
                  <div className="text-center py-3 rounded-xl bg-stone-100 text-stone-500 font-medium text-sm">
                    Current Plan
                  </div>
                ) : (
                  <button
                    onClick={() => handleCheckout(plan.planKey, plan.amountKRW, plan.name)}
                    disabled={!!loadingPlan}
                    className={`text-center w-full ${plan.highlight ? "btn-primary" : "btn-secondary"} disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {getButtonLabel(plan)}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Payment Methods */}
          <div className="text-center mb-16">
            <p className="text-sm text-stone-400 mb-3">Secure payments powered by</p>
            <div className="flex items-center justify-center gap-4 text-stone-500">
              <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-stone-100">💳 Credit Card</span>
              <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-stone-100">🏦 Bank Transfer</span>
              <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-stone-100">📱 KakaoPay</span>
              <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-stone-100">🔒 PortOne</span>
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10 text-stone-800">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="glass-card p-6">
                  <h3 className="font-semibold mb-2 text-stone-800">{faq.q}</h3>
                  <p className="text-sm text-stone-500">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-16">
            <h2 className="text-2xl font-bold mb-4 text-stone-800">Ready to simplify your research?</h2>
            {user ? (
              <Link href="/dashboard" className="btn-primary text-lg">
                Go to Dashboard
              </Link>
            ) : (
              <Link href="/auth/signup" className="btn-primary text-lg">
                Create Free Account
              </Link>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
