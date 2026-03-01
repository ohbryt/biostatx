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
    description: "Test independence between categorical variables. Provides expected frequencies, Cram\u00e9r's V, and contingency tables.",
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
    description: "Measure linear relationship strength between two continuous variables. Includes r\u00b2, p-value, and scatter visualization.",
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
    tagColor: "#ea580c",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
  },
];

const universities = [
  "Harvard Medical School",
  "Johns Hopkins University",
  "Stanford Medicine",
  "Mayo Clinic",
  "MIT",
  "Seoul National University",
  "Oxford University",
  "Karolinska Institute",
];

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* ═══ Hero ═══ */}
        <section className="relative pt-36 pb-28 px-4 overflow-hidden dot-grid">
          {/* Background glow orbs */}
          <div className="glow-orb w-[500px] h-[500px] bg-orange-400 -top-40 left-1/4 animate-pulse-slow" />
          <div className="glow-orb w-[400px] h-[400px] bg-amber-500 top-20 right-1/5 animate-pulse-slow" style={{ animationDelay: "2s" }} />
          <div className="glow-orb w-[300px] h-[300px] bg-yellow-400 bottom-0 left-1/2 animate-pulse-slow" style={{ animationDelay: "4s" }} />

          <div className="max-w-5xl mx-auto text-center relative z-10">
            {/* Badge */}
            <div className="animate-fade-in-up inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-orange-200 bg-orange-50 text-sm text-orange-700 mb-10 backdrop-blur-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              Trusted by 2,000+ biomedical researchers worldwide
            </div>

            {/* Heading */}
            <h1 className="animate-fade-in-up animate-fade-in-up-delay-1 text-5xl sm:text-6xl md:text-8xl font-extrabold leading-[1.05] mb-8 tracking-tight text-stone-800">
              Biomedical Statistics
              <br />
              <span className="gradient-text">Made Simple.</span>
            </h1>

            {/* Subtitle */}
            <p className="animate-fade-in-up animate-fade-in-up-delay-2 text-lg sm:text-xl text-stone-500 max-w-2xl mx-auto mb-12 leading-relaxed">
              Stop overpaying for SPSS. Publication-ready statistical analysis
              in <span className="text-stone-800 font-medium">under 1 second</span> — no coding required.
            </p>

            {/* CTA Buttons */}
            <div className="animate-fade-in-up animate-fade-in-up-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/#tools" className="btn-primary text-lg">
                Start Analyzing — Free
              </Link>
              <Link href="/pricing" className="btn-secondary text-lg">
                View Pricing
              </Link>
            </div>

            {/* Stats */}
            <div className="animate-fade-in-up animate-fade-in-up-delay-4 mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { num: "50K+", label: "Analyses Run", icon: "⚡" },
                { num: "2,000+", label: "Researchers", icon: "🧬" },
                { num: "99.9%", label: "Accuracy", icon: "🎯" },
                { num: "< 1s", label: "Results Time", icon: "🚀" },
              ].map((stat) => (
                <div key={stat.label} className="spotlight-card p-5 text-center">
                  <div className="text-xl mb-1">{stat.icon}</div>
                  <div className="text-2xl md:text-3xl font-extrabold gradient-text number-glow">{stat.num}</div>
                  <div className="text-xs text-stone-500 mt-1.5 uppercase tracking-wider font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ University Marquee ═══ */}
        <section className="py-10 border-y border-stone-200/60 beam-border">
          <p className="text-center text-xs text-stone-500 uppercase tracking-widest mb-6 font-medium">
            Used by researchers at leading institutions
          </p>
          <div className="marquee-container">
            <div className="marquee-track">
              {[...universities, ...universities].map((uni, i) => (
                <span key={i} className="text-stone-400 text-sm font-medium whitespace-nowrap px-6">
                  {uni}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ Comparison ═══ */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-center text-3xl font-bold mb-4 text-stone-800">
              Why pay more for <span className="text-red-400/80 line-through decoration-red-500/50">expensive</span> software?
            </h2>
            <p className="text-center text-stone-500 mb-12 text-sm">Same statistical accuracy. Fraction of the cost.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "SPSS", price: "$99/mo", dim: true },
                { name: "GraphPad Prism", price: "$255/yr", dim: true },
                { name: "MedCalc", price: "$595", dim: true },
                { name: "BioStatX", price: "Free", sub: "$9.99/mo Pro", highlight: true },
              ].map((item) => (
                <div
                  key={item.name}
                  className={`glass-card p-6 text-center ${
                    item.highlight ? "!border-orange-400/40 gradient-border" : ""
                  } ${item.dim ? "opacity-60" : ""}`}
                >
                  <div className={`font-semibold text-sm mb-3 ${item.dim ? "text-stone-400" : "text-stone-800"}`}>
                    {item.name}
                  </div>
                  <div className={`text-2xl font-extrabold ${item.highlight ? "gradient-text" : "text-stone-500"}`}>
                    {item.price}
                  </div>
                  {item.sub && (
                    <div className="text-xs text-stone-500 mt-1">{item.sub}</div>
                  )}
                  {item.highlight && (
                    <div className="mt-3 inline-flex items-center gap-1 text-xs text-green-600 font-semibold bg-green-500/10 px-3 py-1 rounded-full">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Best Value
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ Tools Grid ═══ */}
        <section id="tools" className="py-24 px-4 relative">
          <div className="glow-orb w-[400px] h-[400px] bg-amber-400 top-0 right-0 animate-pulse-slow" />
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-200 bg-orange-50 text-xs text-orange-700 mb-6 uppercase tracking-wider font-medium">
                Statistical Toolkit
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold mb-5 text-stone-800">
                Every test you <span className="gradient-text">need</span>
              </h2>
              <p className="text-stone-500 max-w-lg mx-auto leading-relaxed">
                Enter your data. Get instant publication-ready results with p-values, effect sizes, and confidence intervals.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {tools.map((tool) => (
                <ToolCard key={tool.href} {...tool} />
              ))}
            </div>
          </div>
        </section>

        {/* ═══ How It Works ═══ */}
        <section className="py-24 px-4 border-t border-stone-200/60">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold mb-4 text-stone-800">
                Three steps. <span className="gradient-text">That&apos;s it.</span>
              </h2>
              <p className="text-stone-500">No installation. No learning curve. No frustration.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: "01",
                  title: "Paste Your Data",
                  desc: "Copy from Excel, CSV, or type directly. We handle commas, tabs, spaces — whatever format you have.",
                  gradient: "from-orange-500 to-amber-500",
                },
                {
                  step: "02",
                  title: "Choose Your Test",
                  desc: "Select the appropriate statistical test. Not sure which one? Our guide helps you decide in seconds.",
                  gradient: "from-amber-500 to-yellow-500",
                },
                {
                  step: "03",
                  title: "Get Results",
                  desc: "Instant results with p-values, effect sizes, confidence intervals — ready to paste into your paper.",
                  gradient: "from-teal-500 to-emerald-500",
                },
              ].map((item) => (
                <div key={item.step} className="glass-card p-8 text-center group">
                  <div className={`inline-flex w-14 h-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white font-bold text-lg mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {item.step}
                  </div>
                  <h3 className="font-bold text-lg mb-3 text-stone-800">{item.title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ Testimonial ═══ */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="glass-card p-10 text-center relative">
              <div className="text-5xl mb-6 opacity-20">&ldquo;</div>
              <p className="text-lg text-stone-600 leading-relaxed mb-6 italic">
                I used to spend 30 minutes setting up SPSS for a simple t-test.
                BioStatX gives me the same results in literally one second.
                It&apos;s the tool I wish existed during my PhD.
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-sm font-bold text-white">
                  JK
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-stone-700">Dr. J. Kim</div>
                  <div className="text-xs text-stone-500">Postdoctoral Researcher, Biomedical Engineering</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ Final CTA ═══ */}
        <section className="py-24 px-4">
          <div className="max-w-3xl mx-auto text-center glass-card p-14 relative overflow-hidden">
            <div className="glow-orb w-[300px] h-[300px] bg-orange-400 -top-32 -right-32 animate-pulse-slow" />
            <div className="glow-orb w-[200px] h-[200px] bg-amber-500 -bottom-20 -left-20 animate-pulse-slow" style={{ animationDelay: "2s" }} />
            <div className="relative z-10">
              <h2 className="text-4xl font-extrabold mb-5 text-stone-800">
                Ready to simplify your <span className="gradient-text">research?</span>
              </h2>
              <p className="text-stone-500 mb-10 leading-relaxed">
                Join thousands of biomedical researchers who save hours every week.
                <br />
                <span className="text-stone-400">No credit card required.</span>
              </p>
              <Link href="/#tools" className="btn-primary text-lg">
                Get Started — It&apos;s Free
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
