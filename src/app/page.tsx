import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToolCard from "@/components/ToolCard";
import Link from "next/link";

const tools = [
  {
    title: "Independent T-Test",
    description: "Compare means of two independent groups using Welch's t-test with effect size (Cohen's d) and confidence intervals.",
    href: "/tools/t-test",
    tag: "Free",
    tagColor: "#10b981",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7h18M3 12h10M3 17h14" />
      </svg>
    ),
  },
  {
    title: "One-Way ANOVA",
    description: "Compare means across 3+ groups. Includes F-statistic, p-value, eta-squared effect size, and group summaries.",
    href: "/tools/anova",
    tag: "Free",
    tagColor: "#10b981",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6m6 0h6m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v10m6 0v-4a2 2 0 00-2-2h-2a2 2 0 00-2 2v4" />
      </svg>
    ),
  },
  {
    title: "Chi-Square Test",
    description: "Test independence between categorical variables. Provides expected frequencies, Cramér's V, and contingency tables.",
    href: "/tools/chi-square",
    tag: "Free",
    tagColor: "#10b981",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5h16M4 5v14M4 12h16M12 5v14M20 5v14" />
      </svg>
    ),
  },
  {
    title: "Pearson Correlation",
    description: "Measure linear relationship strength between two continuous variables. Includes r², p-value, and scatter visualization.",
    href: "/tools/correlation",
    tag: "Free",
    tagColor: "#10b981",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
      </svg>
    ),
  },
  {
    title: "Mann-Whitney U",
    description: "Non-parametric test for comparing two independent groups when data is not normally distributed.",
    href: "/tools/mann-whitney",
    tag: "Free",
    tagColor: "#10b981",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    title: "Sample Size Calculator",
    description: "Calculate required sample size for your study based on effect size, power, and significance level.",
    href: "/tools/sample-size",
    tag: "Free",
    tagColor: "#10b981",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007v-.008zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008z" />
      </svg>
    ),
  },
  {
    title: "Kaplan-Meier Survival",
    description: "Survival analysis with Kaplan-Meier curves. Estimate median survival and visualize survival probability over time.",
    href: "/tools/survival",
    tag: "Pro",
    tagColor: "#8b5cf6",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
  },
];

const comparisons = [
  { name: "SPSS", price: "$99/mo", logo: "📊" },
  { name: "GraphPad Prism", price: "$255/yr", logo: "📈" },
  { name: "MedCalc", price: "$595", logo: "🧮" },
  { name: "BioStatX", price: "Free / $9.99/mo", logo: "⚡", highlight: true },
];

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
          <div className="glow-orb w-96 h-96 bg-blue-500 top-0 left-1/4 animate-pulse-slow" />
          <div className="glow-orb w-80 h-80 bg-purple-500 top-20 right-1/4 animate-pulse-slow" />

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-sm text-blue-300 mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Trusted by 2,000+ biomedical researchers
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight mb-6">
              Biomedical Statistics
              <br />
              <span className="gradient-text">Made Simple</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
              Stop overpaying for SPSS. Get publication-ready statistical analysis
              in seconds — no coding required. Built specifically for biomedical researchers.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/#tools" className="btn-primary text-lg">
                Start Analyzing — Free
              </Link>
              <Link href="/pricing" className="btn-secondary text-lg">
                View Pricing
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {[
                { num: "50K+", label: "Analyses Run" },
                { num: "2,000+", label: "Researchers" },
                { num: "99.9%", label: "Accuracy" },
                { num: "< 1s", label: "Results Time" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold gradient-text">{stat.num}</div>
                  <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Banner */}
        <section className="py-16 px-4 border-y border-[rgba(59,130,246,0.1)]">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-center text-2xl font-bold mb-10">
              Why pay more for <span className="text-red-400 line-through">expensive</span> software?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {comparisons.map((item) => (
                <div
                  key={item.name}
                  className={`glass-card p-5 text-center ${
                    item.highlight
                      ? "!border-blue-500/50 !bg-blue-500/10"
                      : ""
                  }`}
                >
                  <div className="text-3xl mb-2">{item.logo}</div>
                  <div className="font-semibold text-sm">{item.name}</div>
                  <div
                    className={`text-lg font-bold mt-1 ${
                      item.highlight ? "gradient-text" : "text-slate-400"
                    }`}
                  >
                    {item.price}
                  </div>
                  {item.highlight && (
                    <div className="mt-2 text-xs text-green-400 font-medium">
                      ✓ Best Value
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section id="tools" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Statistical <span className="gradient-text">Tools</span>
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto">
                Every test you need for biomedical research. Enter your data, get instant publication-ready results.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool) => (
                <ToolCard key={tool.href} {...tool} />
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 px-4 border-t border-[rgba(59,130,246,0.1)]">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-14">
              How It <span className="gradient-text">Works</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Paste Your Data",
                  desc: "Copy data from Excel, CSV, or type it directly. Supports comma, tab, and space-separated values.",
                },
                {
                  step: "02",
                  title: "Choose Your Test",
                  desc: "Select the appropriate statistical test. Not sure which one? Our guide will help you decide.",
                },
                {
                  step: "03",
                  title: "Get Results",
                  desc: "Instant results with p-values, effect sizes, confidence intervals, and publication-ready charts.",
                },
              ].map((item) => (
                <div key={item.step} className="glass-card p-8 text-center">
                  <div className="inline-flex w-12 h-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto text-center glass-card p-12 relative overflow-hidden">
            <div className="glow-orb w-64 h-64 bg-blue-500 -top-20 -right-20 animate-pulse-slow" />
            <h2 className="text-3xl font-bold mb-4 relative z-10">
              Ready to simplify your analysis?
            </h2>
            <p className="text-slate-400 mb-8 relative z-10">
              Join thousands of biomedical researchers who save hours every week with BioStatX.
            </p>
            <Link href="/#tools" className="btn-primary text-lg relative z-10">
              Get Started — It&apos;s Free
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
