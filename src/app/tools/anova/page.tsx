"use client";

import { useState } from "react";
import StatToolLayout from "@/components/StatToolLayout";
import { oneWayAnova, parseData, formatNumber } from "@/lib/statistics";
import { AnovaChart, DotPlotChart } from "@/components/Charts";

export default function AnovaPage() {
  const [groupTexts, setGroupTexts] = useState([
    "23.1 25.4 22.8 24.5 26.1 23.9",
    "28.3 27.1 29.5 26.8 28.0 27.5",
    "31.2 30.5 32.8 29.9 31.0 30.8",
  ]);
  const [alpha, setAlpha] = useState(0.05);
  const [result, setResult] = useState<ReturnType<typeof oneWayAnova> | null>(null);

  const addGroup = () => setGroupTexts([...groupTexts, ""]);
  const removeGroup = (i: number) => {
    if (groupTexts.length <= 2) return;
    setGroupTexts(groupTexts.filter((_, idx) => idx !== i));
  };

  const runTest = () => {
    const groups = groupTexts.map(parseData).filter((g) => g.length >= 2);
    if (groups.length < 2) return;
    setResult(oneWayAnova(groups, alpha));
  };

  return (
    <StatToolLayout
      title="One-Way ANOVA"
      description="Compare means across three or more independent groups. Tests whether at least one group mean significantly differs."
    >
      <div className="space-y-6">
        <div className="glass-card p-6">
          <h3 className="font-semibold mb-4 text-blue-300">Enter Your Data</h3>
          <div className="space-y-3">
            {groupTexts.map((text, i) => (
              <div key={i} className="flex gap-2 items-start">
                <div className="flex-grow">
                  <label className="block text-sm text-slate-400 mb-1">Group {i + 1}</label>
                  <textarea
                    className="input-field !min-h-[60px]"
                    value={text}
                    onChange={(e) => {
                      const updated = [...groupTexts];
                      updated[i] = e.target.value;
                      setGroupTexts(updated);
                    }}
                    placeholder="Enter values separated by spaces, commas, or newlines"
                  />
                </div>
                {groupTexts.length > 2 && (
                  <button
                    className="mt-7 text-red-400 hover:text-red-300 text-sm"
                    onClick={() => removeGroup(i)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-4 flex-wrap">
            <button className="btn-secondary !py-2 !px-4 text-sm" onClick={addGroup}>
              + Add Group
            </button>
            <div>
              <label className="block text-sm text-slate-400 mb-1">α</label>
              <select className="input-field !w-auto" value={alpha} onChange={(e) => setAlpha(Number(e.target.value))}>
                <option value={0.01}>0.01</option>
                <option value={0.05}>0.05</option>
                <option value={0.1}>0.10</option>
              </select>
            </div>
            <button className="btn-primary mt-5" onClick={runTest}>
              Run ANOVA
            </button>
          </div>
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
                  <div className="text-xs text-slate-500 uppercase tracking-wider">F-statistic</div>
                  <div className="text-xl font-bold">{formatNumber(result.fStatistic)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">p-value</div>
                  <div className={`text-xl font-bold ${result.significant ? "text-green-400" : "text-red-400"}`}>
                    {formatNumber(result.pValue)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">df (between, within)</div>
                  <div className="text-xl font-bold">{result.dfBetween}, {result.dfWithin}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">η² (Eta Squared)</div>
                  <div className="text-xl font-bold text-purple-400">{formatNumber(result.etaSquared)}</div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnovaChart
                groupMeans={result.groupMeans}
                groupStds={result.groupStds}
                groupNs={result.groupNs}
              />
              <DotPlotChart
                groups={groupTexts.map((t, i) => ({ name: `Group ${i + 1}`, values: parseData(t) }))}
                title="Individual Data Points"
              />
            </div>

            {/* ANOVA Table */}
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-4">ANOVA Table</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="py-2 text-left text-slate-400">Source</th>
                      <th className="py-2 text-right text-slate-400">SS</th>
                      <th className="py-2 text-right text-slate-400">df</th>
                      <th className="py-2 text-right text-slate-400">MS</th>
                      <th className="py-2 text-right text-slate-400">F</th>
                      <th className="py-2 text-right text-slate-400">p</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-800">
                      <td className="py-2">Between</td>
                      <td className="py-2 text-right">{formatNumber(result.ssBetween)}</td>
                      <td className="py-2 text-right">{result.dfBetween}</td>
                      <td className="py-2 text-right">{formatNumber(result.msBetween)}</td>
                      <td className="py-2 text-right">{formatNumber(result.fStatistic)}</td>
                      <td className="py-2 text-right">{formatNumber(result.pValue)}</td>
                    </tr>
                    <tr className="border-b border-slate-800">
                      <td className="py-2">Within</td>
                      <td className="py-2 text-right">{formatNumber(result.ssWithin)}</td>
                      <td className="py-2 text-right">{result.dfWithin}</td>
                      <td className="py-2 text-right">{formatNumber(result.msWithin)}</td>
                      <td className="py-2 text-right">—</td>
                      <td className="py-2 text-right">—</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium">Total</td>
                      <td className="py-2 text-right">{formatNumber(result.ssBetween + result.ssWithin)}</td>
                      <td className="py-2 text-right">{result.dfBetween + result.dfWithin}</td>
                      <td className="py-2 text-right">—</td>
                      <td className="py-2 text-right">—</td>
                      <td className="py-2 text-right">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Group Stats */}
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
                    </tr>
                  </thead>
                  <tbody>
                    {result.groupMeans.map((m, i) => (
                      <tr key={i} className="border-b border-slate-800">
                        <td className="py-2">Group {i + 1}</td>
                        <td className="py-2 text-right">{result.groupNs[i]}</td>
                        <td className="py-2 text-right">{formatNumber(m)}</td>
                        <td className="py-2 text-right">{formatNumber(result.groupStds[i])}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="glass-card p-6 border-l-4 border-blue-500">
              <h3 className="font-semibold mb-2">📝 Interpretation</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {result.significant ? (
                  <>A one-way ANOVA revealed a <strong>statistically significant</strong> difference between groups (F({result.dfBetween}, {result.dfWithin}) = {formatNumber(result.fStatistic)}, p = {formatNumber(result.pValue)}, η² = {formatNumber(result.etaSquared)}). Post-hoc tests are recommended to identify which specific groups differ.</>
                ) : (
                  <>A one-way ANOVA showed <strong>no statistically significant</strong> difference between groups (F({result.dfBetween}, {result.dfWithin}) = {formatNumber(result.fStatistic)}, p = {formatNumber(result.pValue)}).</>
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </StatToolLayout>
  );
}
