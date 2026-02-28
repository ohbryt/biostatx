"use client";

import { useState } from "react";
import StatToolLayout from "@/components/StatToolLayout";
import { mannWhitneyU, parseData, formatNumber } from "@/lib/statistics";

export default function MannWhitneyPage() {
  const [g1Text, setG1Text] = useState("4.2 3.8 5.1 4.5 3.9 4.8 5.3 4.1");
  const [g2Text, setG2Text] = useState("6.1 5.8 7.2 6.5 5.9 6.8 7.0 6.3");
  const [alpha, setAlpha] = useState(0.05);
  const [result, setResult] = useState<ReturnType<typeof mannWhitneyU> | null>(null);

  const runTest = () => {
    const g1 = parseData(g1Text);
    const g2 = parseData(g2Text);
    if (g1.length < 2 || g2.length < 2) return;
    setResult(mannWhitneyU(g1, g2, alpha));
  };

  return (
    <StatToolLayout
      title="Mann-Whitney U Test"
      description="Non-parametric test for comparing two independent groups. Use when data is not normally distributed or ordinal."
    >
      <div className="space-y-6">
        <div className="glass-card p-6">
          <h3 className="font-semibold mb-4 text-blue-300">Enter Your Data</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Group 1</label>
              <textarea className="input-field" value={g1Text} onChange={(e) => setG1Text(e.target.value)} placeholder="Enter values" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Group 2</label>
              <textarea className="input-field" value={g2Text} onChange={(e) => setG2Text(e.target.value)} placeholder="Enter values" />
            </div>
          </div>
          <button className="btn-primary mt-4" onClick={runTest}>Run Mann-Whitney U</button>
        </div>

        {result && (
          <div className="space-y-6">
            <div className="result-box">
              <div className="flex items-center gap-3 mb-4">
                <span className={`stat-badge ${result.significant ? "significant" : "not-significant"}`}>
                  {result.significant ? "✓ Significant" : "✗ Not Significant"}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">U statistic</div>
                  <div className="text-xl font-bold">{formatNumber(result.uStatistic, 1)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">p-value</div>
                  <div className={`text-xl font-bold ${result.significant ? "text-green-400" : "text-red-400"}`}>
                    {formatNumber(result.pValue)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Rank Sum (G1)</div>
                  <div className="text-xl font-bold">{formatNumber(result.rankSumGroup1, 1)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Rank Sum (G2)</div>
                  <div className="text-xl font-bold">{formatNumber(result.rankSumGroup2, 1)}</div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 border-l-4 border-blue-500">
              <h3 className="font-semibold mb-2">📝 Interpretation</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {result.significant ? (
                  <>A Mann-Whitney U test indicated that the distribution of values was <strong>significantly different</strong> between Group 1 (n={result.n1}) and Group 2 (n={result.n2}), U = {formatNumber(result.uStatistic, 1)}, p = {formatNumber(result.pValue)}.</>
                ) : (
                  <>A Mann-Whitney U test showed <strong>no significant difference</strong> between Group 1 (n={result.n1}) and Group 2 (n={result.n2}), U = {formatNumber(result.uStatistic, 1)}, p = {formatNumber(result.pValue)}.</>
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </StatToolLayout>
  );
}
