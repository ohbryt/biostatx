"use client";

import { useState } from "react";
import StatToolLayout from "@/components/StatToolLayout";
import { independentTTest, parseData, formatNumber } from "@/lib/statistics";
import { GroupComparisonChart, DotPlotChart } from "@/components/Charts";

export default function TTestPage() {
  const [group1Text, setGroup1Text] = useState("23.1 25.4 22.8 24.5 26.1 23.9 25.0 24.3");
  const [group2Text, setGroup2Text] = useState("28.3 27.1 29.5 26.8 28.0 27.5 29.2 28.8");
  const [alpha, setAlpha] = useState(0.05);
  const [result, setResult] = useState<ReturnType<typeof independentTTest> | null>(null);

  const runTest = () => {
    const g1 = parseData(group1Text);
    const g2 = parseData(group2Text);
    if (g1.length < 2 || g2.length < 2) return;
    setResult(independentTTest(g1, g2, alpha));
  };

  return (
    <StatToolLayout
      title="Independent T-Test"
      description="Compare means of two independent groups using Welch's t-test. Handles unequal variances and sample sizes."
    >
      <div className="space-y-6">
        <div className="glass-card p-6">
          <h3 className="font-semibold mb-4 text-blue-300">Enter Your Data</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Group 1 (Control)</label>
              <textarea
                className="input-field"
                value={group1Text}
                onChange={(e) => setGroup1Text(e.target.value)}
                placeholder="Enter values separated by spaces, commas, or newlines"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Group 2 (Treatment)</label>
              <textarea
                className="input-field"
                value={group2Text}
                onChange={(e) => setGroup2Text(e.target.value)}
                placeholder="Enter values separated by spaces, commas, or newlines"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Significance Level (α)</label>
              <select
                className="input-field !w-auto"
                value={alpha}
                onChange={(e) => setAlpha(Number(e.target.value))}
              >
                <option value={0.01}>0.01</option>
                <option value={0.05}>0.05</option>
                <option value={0.1}>0.10</option>
              </select>
            </div>
            <button className="btn-primary mt-5" onClick={runTest}>
              Run T-Test
            </button>
          </div>
        </div>

        {result && (
          <div className="space-y-6">
            {/* Main Result */}
            <div className="result-box">
              <div className="flex items-center gap-3 mb-4">
                <span className={`stat-badge ${result.significant ? "significant" : "not-significant"}`}>
                  {result.significant ? "✓ Significant" : "✗ Not Significant"}
                </span>
                <span className="text-sm text-slate-400">at α = {alpha}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">t-statistic</div>
                  <div className="text-xl font-bold text-white">{formatNumber(result.tStatistic)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">p-value</div>
                  <div className={`text-xl font-bold ${result.significant ? "text-green-400" : "text-red-400"}`}>
                    {formatNumber(result.pValue)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Degrees of Freedom</div>
                  <div className="text-xl font-bold text-white">{formatNumber(result.degreesOfFreedom, 1)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Cohen&apos;s d</div>
                  <div className="text-xl font-bold text-purple-400">{formatNumber(result.effectSize)}</div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GroupComparisonChart
                data={[
                  { name: "Group 1", mean: parseFloat(result.meanGroup1.toFixed(4)), sem: parseFloat(result.semGroup1.toFixed(4)), color: "#3b82f6" },
                  { name: "Group 2", mean: parseFloat(result.meanGroup2.toFixed(4)), sem: parseFloat(result.semGroup2.toFixed(4)), color: "#8b5cf6" },
                ]}
                title="Mean Comparison"
              />
              <DotPlotChart
                groups={[
                  { name: "Group 1", values: parseData(group1Text) },
                  { name: "Group 2", values: parseData(group2Text) },
                ]}
                title="Individual Data Points"
              />
            </div>

            {/* Group Statistics */}
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-4">Group Statistics</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="py-2 text-left text-slate-400">Group</th>
                      <th className="py-2 text-right text-slate-400">N</th>
                      <th className="py-2 text-right text-slate-400">Mean</th>
                      <th className="py-2 text-right text-slate-400">SD</th>
                      <th className="py-2 text-right text-slate-400">SEM</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-800">
                      <td className="py-2">Group 1</td>
                      <td className="py-2 text-right">{result.n1}</td>
                      <td className="py-2 text-right">{formatNumber(result.meanGroup1)}</td>
                      <td className="py-2 text-right">{formatNumber(result.stdGroup1)}</td>
                      <td className="py-2 text-right">{formatNumber(result.semGroup1)}</td>
                    </tr>
                    <tr>
                      <td className="py-2">Group 2</td>
                      <td className="py-2 text-right">{result.n2}</td>
                      <td className="py-2 text-right">{formatNumber(result.meanGroup2)}</td>
                      <td className="py-2 text-right">{formatNumber(result.stdGroup2)}</td>
                      <td className="py-2 text-right">{formatNumber(result.semGroup2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mean Difference & CI */}
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-3">Mean Difference</h3>
              <p className="text-slate-300">
                <strong>{formatNumber(result.meanDifference)}</strong>{" "}
                <span className="text-slate-500">
                  95% CI [{formatNumber(result.confidenceInterval[0])} , {formatNumber(result.confidenceInterval[1])}]
                </span>
              </p>
            </div>

            {/* Interpretation */}
            <div className="glass-card p-6 border-l-4 border-blue-500">
              <h3 className="font-semibold mb-2">📝 Interpretation</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {result.significant ? (
                  <>
                    There is a <strong>statistically significant</strong> difference between the two groups
                    (t({formatNumber(result.degreesOfFreedom, 1)}) = {formatNumber(result.tStatistic)}, p = {formatNumber(result.pValue)}).
                    The mean difference is {formatNumber(result.meanDifference)} (95% CI [{formatNumber(result.confidenceInterval[0])}, {formatNumber(result.confidenceInterval[1])}]).
                    The effect size (Cohen&apos;s d = {formatNumber(result.effectSize)}) is considered{" "}
                    {result.effectSize >= 0.8 ? "large" : result.effectSize >= 0.5 ? "medium" : "small"}.
                  </>
                ) : (
                  <>
                    There is <strong>no statistically significant</strong> difference between the two groups
                    (t({formatNumber(result.degreesOfFreedom, 1)}) = {formatNumber(result.tStatistic)}, p = {formatNumber(result.pValue)}).
                    The result does not reach the significance threshold of α = {alpha}.
                  </>
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </StatToolLayout>
  );
}
