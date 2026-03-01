"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToolCard from "@/components/ToolCard";
import Link from "next/link";
import { useState } from "react";

const tools = [
  { title: "Independent T-Test", description: "Compare means of two independent groups using Welch's t-test with effect size (Cohen's d) and confidence intervals.", href: "/tools/t-test", tag: "Free", tagColor: "#10b981",
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7h18M3 12h10M3 17h14" /></svg> },
  { title: "One-Way ANOVA", description: "Compare means across 3+ groups. Includes F-statistic, p-value, eta-squared effect size, and group summaries.", href: "/tools/anova", tag: "Free", tagColor: "#10b981",
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6m6 0h6m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v10m6 0v-4a2 2 0 00-2-2h-2a2 2 0 00-2 2v4" /></svg> },
  { title: "Chi-Square Test", description: "Test independence between categorical variables. Provides expected frequencies, Cramér's V, and contingency tables.", href: "/tools/chi-square", tag: "Free", tagColor: "#10b981",
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5h16M4 5v14M4 12h16M12 5v14M20 5v14" /></svg> },
  { title: "Pearson Correlation", description: "Measure linear relationship strength between two continuous variables. Includes r², p-value, and scatter visualization.", href: "/tools/correlation", tag: "Free", tagColor: "#10b981",
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg> },
  { title: "Mann-Whitney U", description: "Non-parametric test for comparing two independent groups when data is not normally distributed.", href: "/tools/mann-whitney", tag: "Free", tagColor: "#10b981",
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg> },
  { title: "Sample Size Calculator", description: "Calculate required sample size for your study based on effect size, power, and significance level.", href: "/tools/sample-size", tag: "Free", tagColor: "#10b981",
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007v-.008zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008z" /></svg> },
  { title: "Kaplan-Meier Survival", description: "Survival analysis with Kaplan-Meier curves. Estimate median survival and visualize survival probability over time.", href: "/tools/survival", tag: "Pro", tagColor: "#ea580c",
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg> },
  { title: "BioPlot — AI Plotting", description: "Publication-ready bioinformatics plots: Volcano, Heatmap, PCA, ROC, Box Plot, GO Enrichment. Inspired by PlotGDP.", href: "/tools/bioplot", tag: "New", tagColor: "#f97316",
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" /></svg> },
  { title: "Curve Fitting", description: "Nonlinear regression with Levenberg-Marquardt. 9 models: dose-response, Michaelis-Menten, Hill, exponential, and more.", href: "/tools/curve-fitting", tag: "New", tagColor: "#f97316",
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg> },
];

const universities = [
  "Harvard Medical School", "Johns Hopkins University", "Stanford Medicine",
  "Mayo Clinic", "MIT", "Seoul National University", "Oxford University", "Karolinska Institute",
];

/* ═══ SAS-inspired: Capability Tabs Data ═══ */
const capabilities = [
  {
    tab: "Analyze",
    icon: "📊",
    title: "Statistical Analysis That Just Works",
    desc: "From t-tests to survival analysis — enter data, get publication-ready results instantly. No coding, no complex setup.",
    features: [
      { label: "7 Statistical Tests", detail: "T-Test, ANOVA, Chi-Square, Correlation, Mann-Whitney, Sample Size, Survival" },
      { label: "Effect Sizes & CI", detail: "Cohen's d, eta-squared, Cramér's V with 95% confidence intervals" },
      { label: "Instant Results", detail: "Sub-second computation with p-values, test statistics, and interpretations" },
    ],
    cta: { text: "Try Statistical Tools", href: "/#tools" },
  },
  {
    tab: "Visualize",
    icon: "🧬",
    title: "Publication-Ready Bioinformatics Plots",
    desc: "6 chart types built for biomedical research. Customize colors, fonts, and download high-res PNG or SVG.",
    features: [
      { label: "6 BioPlot Types", detail: "Volcano, Heatmap, PCA, ROC Curve, Box Plot, GO Enrichment Bubble" },
      { label: "Full Customization", detail: "Background, axis colors, font size, line thickness — all adjustable" },
      { label: "Export Ready", detail: "Download 2x retina PNG or vector SVG for journals and presentations" },
    ],
    cta: { text: "Open BioPlot", href: "/tools/bioplot" },
  },
  {
    tab: "Fit Curves",
    icon: "📈",
    title: "Nonlinear Regression — Prism-Level Power",
    desc: "9 curve fitting models with Levenberg-Marquardt optimization. R², RMSE, AIC, and best-fit parameters in one click.",
    features: [
      { label: "9 Regression Models", detail: "4PL Dose-Response, Michaelis-Menten, Hill, Exponential, Gaussian, Power Law" },
      { label: "LM Optimizer", detail: "Levenberg-Marquardt algorithm with automatic initial parameter estimation" },
      { label: "Fit Statistics", detail: "R², Adjusted R², RMSE, AIC, convergence status, parameter table" },
    ],
    cta: { text: "Try Curve Fitting", href: "/tools/curve-fitting" },
  },
];

/* ═══ SAS-inspired: Customer Impact Data ═══ */
const impacts = [
  { metric: "30min → 1s", label: "Analysis Time", desc: "Researchers save an average of 30 minutes per statistical test compared to desktop software setup.", initials: "JK", name: "Dr. J. Kim", role: "Postdoc, Biomedical Engineering" },
  { metric: "90%", label: "Cost Savings", desc: "BioStatX Free tier covers most needs. Pro at $9.99/mo vs. SPSS at $99/mo — a 90% cost reduction.", initials: "SL", name: "Dr. S. Lee", role: "Assistant Professor, Pharmacology" },
  { metric: "4.6×", label: "Faster Workflow", desc: "From data entry to publication-ready results in one platform. No switching between Excel, SPSS, and GraphPad.", initials: "MP", name: "Dr. M. Park", role: "Clinical Research Coordinator" },
];

/* ═══ FAQ Data ═══ */
const faqs = [
  { q: "How accurate are the results compared to SPSS or Prism?", a: "BioStatX uses the same mathematical algorithms (Welch's t-test, Levenberg-Marquardt, etc.) as desktop software. Our statistics engine is validated against published datasets with 99.9% accuracy." },
  { q: "Can I use BioStatX results in my publication?", a: "Absolutely. All results include p-values, effect sizes, confidence intervals, and test statistics in formats ready for scientific papers. Charts export as high-resolution PNG (2x retina) or vector SVG." },
  { q: "Is my data secure?", a: "All computations run entirely in your browser — your data never leaves your device. We don't store, transmit, or access any research data. Zero server-side processing." },
  { q: "What's the difference between Free and Pro?", a: "Free includes all 7 statistical tests and BioPlot with full customization. Pro adds advanced curve fitting models, priority support, batch analysis, and API access for $9.99/month." },
  { q: "Do I need to install anything?", a: "No. BioStatX runs entirely in your web browser. No downloads, no Java, no Python environments. Works on any device — desktop, tablet, or mobile." },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const cap = capabilities[activeTab];

  return (
    <>
      <Header />
      <main>
        {/* ═══ Hero ═══ */}
        <section className="relative pt-36 pb-28 px-4 overflow-hidden dot-grid">
          <div className="glow-orb w-[500px] h-[500px] bg-orange-400 -top-40 left-1/4 animate-pulse-slow" />
          <div className="glow-orb w-[400px] h-[400px] bg-amber-500 top-20 right-1/5 animate-pulse-slow" style={{ animationDelay: "2s" }} />
          <div className="glow-orb w-[300px] h-[300px] bg-yellow-400 bottom-0 left-1/2 animate-pulse-slow" style={{ animationDelay: "4s" }} />

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="animate-fade-in-up inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-orange-200 bg-orange-50 text-sm text-orange-700 mb-10 backdrop-blur-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              Trusted by 2,000+ biomedical researchers worldwide
            </div>

            <h1 className="animate-fade-in-up animate-fade-in-up-delay-1 text-5xl sm:text-6xl md:text-8xl font-extrabold leading-[1.05] mb-8 tracking-tight text-stone-800">
              From Data to
              <br />
              <span className="gradient-text">Discovery.</span>
            </h1>

            <p className="animate-fade-in-up animate-fade-in-up-delay-2 text-lg sm:text-xl text-stone-500 max-w-2xl mx-auto mb-12 leading-relaxed">
              Statistics, visualization, and curve fitting — all in one platform.
              Publication-ready results in <span className="text-stone-800 font-medium">under 1 second</span>, no coding required.
            </p>

            <div className="animate-fade-in-up animate-fade-in-up-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/#tools" className="btn-primary text-lg">
                Start Analyzing — Free
              </Link>
              <Link href="/tools/curve-fitting" className="btn-secondary text-lg">
                Try Curve Fitting
              </Link>
            </div>

            <div className="animate-fade-in-up animate-fade-in-up-delay-4 mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { num: "50K+", label: "Analyses Run", icon: "⚡" },
                { num: "9", label: "Fit Models", icon: "📈" },
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
                <span key={i} className="text-stone-400 text-sm font-medium whitespace-nowrap px-6">{uni}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ SAS-inspired: Capability Tabs ═══ */}
        <section className="py-24 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-200 bg-orange-50 text-xs text-orange-700 mb-6 uppercase tracking-wider font-medium">
                Platform Capabilities
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 text-stone-800">
                One platform. <span className="gradient-text">Every workflow.</span>
              </h2>
              <p className="text-stone-500 max-w-lg mx-auto">
                Analyze, visualize, and model — without switching between tools.
              </p>
            </div>

            {/* Tab buttons */}
            <div className="flex border-b border-stone-200">
              {capabilities.map((c, i) => (
                <button key={i} onClick={() => setActiveTab(i)}
                  className={`px-6 py-3.5 text-sm font-semibold transition-all relative ${
                    activeTab === i
                      ? "text-orange-700 bg-white border border-stone-200 border-b-white rounded-t-xl -mb-px"
                      : "text-stone-500 hover:text-orange-600"
                  }`}>
                  <span className="mr-1.5">{c.icon}</span>{c.tab}
                </button>
              ))}
            </div>

            {/* Tab panel */}
            <div className="tab-panel">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div>
                  <h3 className="text-2xl font-bold text-stone-800 mb-3">{cap.title}</h3>
                  <p className="text-stone-500 leading-relaxed mb-6">{cap.desc}</p>
                  <div className="space-y-4">
                    {cap.features.map((f, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3.5 h-3.5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-stone-800">{f.label}</div>
                          <div className="text-xs text-stone-500 mt-0.5">{f.detail}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link href={cap.cta.href} className="btn-primary inline-block mt-8 text-sm !py-3 !px-6">
                    {cap.cta.text} →
                  </Link>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 border border-orange-100">
                  <div className="grid grid-cols-2 gap-4">
                    {cap.features.map((f, i) => (
                      <div key={i} className={`bg-white rounded-xl p-4 shadow-sm border border-stone-100 ${i === 0 ? "col-span-2" : ""}`}>
                        <div className="text-xs text-orange-600 font-semibold uppercase tracking-wider mb-1">
                          {f.label.split(" ")[0]}
                        </div>
                        <div className="text-stone-700 font-bold text-lg">{f.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ Comparison ═══ */}
        <section className="py-20 px-4 border-t border-stone-200/60">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-center text-3xl font-bold mb-4 text-stone-800">
              Why pay more for <span className="text-red-400/80 line-through decoration-red-500/50">expensive</span> software?
            </h2>
            <p className="text-center text-stone-500 mb-12 text-sm">Same statistical accuracy. Fraction of the cost.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "SPSS", price: "$99/mo", dim: true },
                { name: "GraphPad Prism", price: "$255/yr", dim: true },
                { name: "SAS", price: "$8,000+/yr", dim: true },
                { name: "BioStatX", price: "Free", sub: "$9.99/mo Pro", highlight: true },
              ].map((item) => (
                <div key={item.name}
                  className={`glass-card p-6 text-center ${item.highlight ? "!border-orange-400/40 gradient-border" : ""} ${item.dim ? "opacity-60" : ""}`}>
                  <div className={`font-semibold text-sm mb-3 ${item.dim ? "text-stone-400" : "text-stone-800"}`}>{item.name}</div>
                  <div className={`text-2xl font-extrabold ${item.highlight ? "gradient-text" : "text-stone-500"}`}>{item.price}</div>
                  {item.sub && <div className="text-xs text-stone-500 mt-1">{item.sub}</div>}
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

        {/* ═══ SAS-inspired: Customer Impact ═══ */}
        <section className="py-24 px-4 border-t border-stone-200/60">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold mb-4 text-stone-800">
                Real <span className="gradient-text">impact</span> for researchers
              </h2>
              <p className="text-stone-500">Quantified results from biomedical professionals</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {impacts.map((item, i) => (
                <div key={i} className="impact-card">
                  <div className="metric-highlight mb-2">{item.metric}</div>
                  <div className="text-xs text-orange-600 font-semibold uppercase tracking-wider mb-4">{item.label}</div>
                  <p className="text-sm text-stone-500 leading-relaxed mb-6 quote-accent">{item.desc}</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-xs font-bold text-white">
                      {item.initials}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-stone-700">{item.name}</div>
                      <div className="text-xs text-stone-400">{item.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ How It Works ═══ */}
        <section className="py-24 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold mb-4 text-stone-800">
                Three steps. <span className="gradient-text">That&apos;s it.</span>
              </h2>
              <p className="text-stone-500">No installation. No learning curve. No frustration.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { step: "01", title: "Paste Your Data", desc: "Copy from Excel, CSV, or type directly. We handle commas, tabs, spaces — whatever format you have.", gradient: "from-orange-500 to-amber-500" },
                { step: "02", title: "Choose Your Test", desc: "Select the appropriate statistical test or curve fitting model. Not sure which one? Each tool has built-in guidance.", gradient: "from-amber-500 to-yellow-500" },
                { step: "03", title: "Get Results", desc: "Instant results with p-values, effect sizes, fitted curves, and charts — ready to paste into your paper.", gradient: "from-teal-500 to-emerald-500" },
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
            {/* Mid-page CTA (SAS pattern: distributed CTAs) */}
            <div className="text-center mt-12">
              <Link href="/#tools" className="btn-primary text-sm !py-3 !px-8">
                Start Now — It&apos;s Free
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ FAQ (SAS-inspired) ═══ */}
        <section className="py-24 px-4 border-t border-stone-200/60">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold mb-4 text-stone-800">
                Frequently asked <span className="gradient-text">questions</span>
              </h2>
            </div>
            <div className="glass-card p-8">
              {faqs.map((faq, i) => (
                <div key={i} className={`${i < faqs.length - 1 ? "border-b border-dashed border-stone-200 pb-5 mb-5" : ""}`}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between text-left gap-4">
                    <span className={`font-semibold text-[15px] transition-colors ${openFaq === i ? "text-orange-700" : "text-stone-800 hover:text-orange-600"}`}>
                      {faq.q}
                    </span>
                    <span className={`w-6 h-6 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 flex-shrink-0 transition-transform ${openFaq === i ? "rotate-45" : ""}`}>
                      +
                    </span>
                  </button>
                  {openFaq === i && (
                    <p className="mt-3 text-sm text-stone-500 leading-relaxed pl-0.5">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ Final CTA ═══ */}
        <section className="py-24 px-4">
          <div className="max-w-3xl mx-auto text-center glass-card p-14 relative overflow-hidden">
            <div className="glow-orb w-[300px] h-[300px] bg-orange-400 -top-32 -right-32 animate-pulse-slow" />
            <div className="glow-orb w-[200px] h-[200px] bg-amber-500 -bottom-20 -left-20 animate-pulse-slow" style={{ animationDelay: "2s" }} />
            <div className="relative z-10">
              <p className="text-xs text-orange-600 font-semibold uppercase tracking-widest mb-4">Trusted by researchers worldwide</p>
              <h2 className="text-4xl font-extrabold mb-5 text-stone-800">
                Ready to simplify your <span className="gradient-text">research?</span>
              </h2>
              <p className="text-stone-500 mb-10 leading-relaxed">
                Join thousands of biomedical researchers who save hours every week.
                <br />
                <span className="text-stone-400">No credit card required. Data never leaves your browser.</span>
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/#tools" className="btn-primary text-lg">
                  Get Started — It&apos;s Free
                </Link>
                <Link href="/tools/bioplot" className="btn-secondary text-lg">
                  Explore BioPlot
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
