"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GroupComparisonChart, DotPlotChart, CorrelationScatterChart, SurvivalCurveChart, AnovaChart } from "@/components/Charts";

const survivalCurve = [
  { time: 5, survival: 0.929 },
  { time: 10, survival: 0.857 },
  { time: 15, survival: 0.857 },
  { time: 20, survival: 0.786 },
  { time: 25, survival: 0.714 },
  { time: 30, survival: 0.714 },
  { time: 35, survival: 0.643 },
  { time: 40, survival: 0.571 },
  { time: 45, survival: 0.571 },
  { time: 50, survival: 0.500 },
  { time: 60, survival: 0.375 },
  { time: 80, survival: 0.250 },
  { time: 90, survival: 0.125 },
];

export default function ExamplesPage() {
  return (
    <>
      <Header />
      <main className="pt-28 pb-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-200 bg-orange-50 text-xs text-orange-700 mb-6 uppercase tracking-wider font-medium">
              Gallery
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-5 text-stone-800">
              Chart <span className="gradient-text">Examples</span>
            </h1>
            <p className="text-stone-500 max-w-lg mx-auto leading-relaxed">
              Publication-ready charts generated instantly by BioStatX. All charts are interactive and exportable.
            </p>
          </div>

          <div className="space-y-12">
            {/* Example 1: Drug Efficacy T-Test */}
            <section>
              <div className="mb-4">
                <h2 className="text-xl font-bold text-stone-800">1. Drug Efficacy Comparison (T-Test)</h2>
                <p className="text-sm text-stone-500 mt-1">
                  Tumor volume (mm&sup3;) comparison between placebo and treatment groups after 4 weeks.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GroupComparisonChart
                  data={[
                    { name: "Placebo", mean: 285.4, sem: 18.3, color: "#a8a29e" },
                    { name: "Drug A (50mg)", mean: 142.7, sem: 12.1, color: "#ea580c" },
                  ]}
                  title="Tumor Volume by Treatment"
                  yLabel="Volume (mm\u00b3)"
                />
                <DotPlotChart
                  groups={[
                    { name: "Placebo", values: [310, 265, 298, 275, 320, 255, 290, 270, 305, 295] },
                    { name: "Drug A", values: [155, 130, 168, 125, 140, 152, 118, 145, 160, 134] },
                  ]}
                  title="Individual Tumor Volumes"
                />
              </div>
              <div className="glass-card p-4 mt-4 border-l-4 border-orange-500">
                <p className="text-sm text-stone-600">
                  <strong>Result:</strong> Drug A significantly reduced tumor volume compared to placebo
                  (t(18) = 6.52, p &lt; 0.0001, Cohen&apos;s d = 2.91). Mean reduction: 142.7 mm&sup3; (50%).
                </p>
              </div>
            </section>

            {/* Example 2: Biomarker Correlation */}
            <section>
              <div className="mb-4">
                <h2 className="text-xl font-bold text-stone-800">2. Biomarker Correlation Analysis</h2>
                <p className="text-sm text-stone-500 mt-1">
                  Relationship between serum CRP levels (mg/L) and disease activity score (DAS28).
                </p>
              </div>
              <CorrelationScatterChart
                x={[2.1, 5.3, 8.7, 3.2, 12.4, 6.8, 15.1, 4.5, 9.9, 7.2, 11.3, 1.8, 14.2, 10.5, 3.8]}
                y={[2.8, 3.5, 4.8, 3.1, 5.9, 4.2, 6.4, 3.4, 5.1, 4.0, 5.5, 2.5, 6.1, 5.3, 3.0]}
                r={0.982}
                rSquared={0.964}
              />
              <div className="glass-card p-4 mt-4 border-l-4 border-orange-500">
                <p className="text-sm text-stone-600">
                  <strong>Result:</strong> A very strong positive correlation was found between CRP and DAS28
                  (r = 0.982, R&sup2; = 0.964, p &lt; 0.0001). CRP explains 96.4% of the variance in disease activity.
                </p>
              </div>
            </section>

            {/* Example 3: Multi-group ANOVA */}
            <section>
              <div className="mb-4">
                <h2 className="text-xl font-bold text-stone-800">3. Dose-Response Analysis (ANOVA)</h2>
                <p className="text-sm text-stone-500 mt-1">
                  Cell viability (%) across four concentration levels of a candidate compound.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnovaChart
                  groupMeans={[95.2, 78.4, 52.1, 23.8]}
                  groupStds={[4.1, 6.3, 8.5, 5.2]}
                  groupNs={[8, 8, 8, 8]}
                />
                <DotPlotChart
                  groups={[
                    { name: "Control", values: [98, 93, 96, 90, 99, 94, 92, 100] },
                    { name: "10 \u00b5M", values: [85, 72, 80, 76, 82, 70, 88, 74] },
                    { name: "50 \u00b5M", values: [60, 48, 55, 42, 58, 50, 38, 66] },
                    { name: "100 \u00b5M", values: [28, 20, 25, 18, 30, 22, 15, 32] },
                  ]}
                  title="Cell Viability Distribution"
                />
              </div>
              <div className="glass-card p-4 mt-4 border-l-4 border-orange-500">
                <p className="text-sm text-stone-600">
                  <strong>Result:</strong> One-way ANOVA revealed a significant dose-dependent reduction in cell viability
                  (F(3, 28) = 148.7, p &lt; 0.0001, &eta;&sup2; = 0.94). IC50 estimated at ~45 &mu;M.
                </p>
              </div>
            </section>

            {/* Example 4: Survival Analysis */}
            <section>
              <div className="mb-4">
                <h2 className="text-xl font-bold text-stone-800">4. Patient Survival Analysis (Kaplan-Meier)</h2>
                <p className="text-sm text-stone-500 mt-1">
                  Overall survival in months for Stage III colorectal cancer patients (n=14).
                </p>
              </div>
              <SurvivalCurveChart
                curve={survivalCurve}
                medianSurvival={50}
              />
              <div className="glass-card p-4 mt-4 border-l-4 border-orange-500">
                <p className="text-sm text-stone-600">
                  <strong>Result:</strong> Median overall survival was 50 months. The 1-year survival rate was 71.4%
                  and the 2-year survival rate was 57.1%. Four patients were censored during follow-up.
                </p>
              </div>
            </section>
          </div>

          {/* CTA */}
          <div className="text-center mt-16 glass-card p-10">
            <h2 className="text-2xl font-bold text-stone-800 mb-3">Create your own charts</h2>
            <p className="text-stone-500 mb-6">Paste your data and get publication-ready results in seconds.</p>
            <a href="/#tools" className="btn-primary text-lg">
              Try BioStatX Free
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
