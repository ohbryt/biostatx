import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
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
    href: "/#tools",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "/month",
    description: "For active researchers and labs",
    features: [
      "Everything in Free, plus:",
      "Kaplan-Meier Survival Analysis",
      "Logistic Regression",
      "ROC Curve Analysis",
      "Multiple Comparisons (Tukey, Bonferroni)",
      "Publication-ready charts (PNG/SVG)",
      "AI-powered interpretation",
      "Data history & saved analyses",
      "Priority email support",
      "CSV/Excel import",
    ],
    cta: "Start 14-Day Free Trial",
    href: "#",
    highlight: true,
  },
  {
    name: "Team",
    price: "$29.99",
    period: "/month",
    description: "For research labs and institutions",
    features: [
      "Everything in Pro, plus:",
      "Up to 10 team members",
      "Shared analysis workspace",
      "Custom branding",
      "API access",
      "Batch analysis",
      "Dedicated support",
      "SSO / institutional login",
      "Data compliance (HIPAA-ready)",
    ],
    cta: "Contact Sales",
    href: "#",
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
];

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="pt-28 pb-10 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
              Simple, <span className="gradient-text">Honest</span> Pricing
            </h1>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">
              No hidden fees. No per-analysis charges. Start free, upgrade when you need more.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`glass-card p-8 flex flex-col ${
                  plan.highlight
                    ? "!border-blue-500/50 relative"
                    : ""
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-xs font-bold">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="mt-3 mb-2">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className="text-slate-500 text-sm">{plan.period}</span>
                </div>
                <p className="text-sm text-slate-400 mb-6">{plan.description}</p>

                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-green-400 mt-0.5 shrink-0">✓</span>
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`text-center ${plan.highlight ? "btn-primary" : "btn-secondary"}`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="glass-card p-6">
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-sm text-slate-400">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <h2 className="text-2xl font-bold mb-4">Ready to simplify your research?</h2>
            <Link href="/#tools" className="btn-primary text-lg">
              Start Analyzing — Free
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
