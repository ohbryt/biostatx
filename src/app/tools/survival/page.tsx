"use client";

import { useState } from "react";
import StatToolLayout from "@/components/StatToolLayout";
import { kaplanMeier, formatNumber } from "@/lib/statistics";
import type { KaplanMeierResult } from "@/lib/statistics";

export default function SurvivalPage() {
  const [dataText, setDataText] = useState(
    `5,1
10,1
15,0
20,1
25,1
30,0
35,1
40,1
45,0
50,1
55,1
60,1
70,0
80,1
90,1`
  );
  const [result, setResult] = useState<KaplanMeierResult | null>(null);

  const runAnalysis = () => {
    const lines = dataText.trim().split("\n").map((l) => l.trim()).filter(Boolean);
    const times: number[] = [];
    const events: boolean[] = [];
    for (const line of lines) {
      const parts = line.split(/[,\t\s]+/);
      if (parts.length >= 2) {
        const t = Number(parts[0]);
        const e = Number(parts[1]);
        if (!isNaN(t) && !isNaN(e)) {
          times.push(t);
          events.push(e === 1);
        }
      }
    }
    if (times.length < 2) return;
    setResult(kaplanMeier(times, events));
  };

  return (
    <StatToolLayout
      title="Kaplan-Meier Survival Analysis"
      description="Estimate survival probabilities over time. Enter time-to-event data with censoring indicators."
    >
      <div className="space-y-6">
        <div className="glass-card p-6">
          <h3 className="font-semibold mb-4 text-blue-300">Enter Survival Data</h3>
          <p className="text-xs text-slate-500 mb-3">
            Format: <code className="bg-slate-800 px-1 rounded">time, event</code> per line. Event: 1 = event occurred, 0 = censored.
          </p>
          <textarea
            className="input-field !min-h-[200px]"
            value={dataText}
            onChange={(e) => setDataText(e.target.value)}
            placeholder={"5,1\n10,1\n15,0\n..."}
          />
          <button className="btn-primary mt-4" onClick={runAnalysis}>
            Run Survival Analysis
          </button>
        </div>

        {result && (
          <div className="space-y-6">
            <div className="result-box">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Median Survival</div>
                  <div className="text-xl font-bold gradient-text">
                    {result.medianSurvival !== null ? formatNumber(result.medianSurvival, 1) : "Not reached"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Total Events</div>
                  <div className="text-xl font-bold">{result.totalEvents}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Total Censored</div>
                  <div className="text-xl font-bold text-yellow-400">{result.totalCensored}</div>
                </div>
              </div>
            </div>

            {/* ASCII Survival Curve */}
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-4">Survival Curve</h3>
              <div className="bg-[rgba(10,15,28,0.8)] rounded-lg p-4 overflow-x-auto">
                <div className="relative h-48 w-full min-w-[400px]">
                  <svg viewBox="0 0 500 200" className="w-full h-full">
                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1.0].map((v) => (
                      <g key={v}>
                        <line x1="50" y1={180 - v * 160} x2="480" y2={180 - v * 160} stroke="rgba(148,163,184,0.1)" strokeWidth="1" />
                        <text x="40" y={184 - v * 160} fill="#64748b" fontSize="10" textAnchor="end">{(v * 100).toFixed(0)}%</text>
                      </g>
                    ))}
                    {/* Y axis label */}
                    <text x="12" y="100" fill="#94a3b8" fontSize="10" textAnchor="middle" transform="rotate(-90, 12, 100)">Survival</text>
                    {/* X axis label */}
                    <text x="265" y="198" fill="#94a3b8" fontSize="10" textAnchor="middle">Time</text>
                    {/* Survival step curve */}
                    <polyline
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      points={[
                        `50,${180 - 1.0 * 160}`,
                        ...result.curve.map((pt) => {
                          const maxTime = result.curve[result.curve.length - 1].time;
                          const x = 50 + (pt.time / maxTime) * 430;
                          const y = 180 - pt.survival * 160;
                          return `${x},${y}`;
                        }),
                      ].join(" ")}
                    />
                    {/* Median line */}
                    {result.medianSurvival !== null && (
                      <>
                        <line x1="50" y1={180 - 0.5 * 160} x2="480" y2={180 - 0.5 * 160} stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,4" />
                        <text x={50 + (result.medianSurvival / result.curve[result.curve.length - 1].time) * 430} y={180 - 0.5 * 160 - 6} fill="#f59e0b" fontSize="9" textAnchor="middle">
                          Median: {formatNumber(result.medianSurvival, 1)}
                        </text>
                      </>
                    )}
                  </svg>
                </div>
              </div>
            </div>

            {/* Life Table */}
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-4">Life Table</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="py-2 text-left text-slate-400">Time</th>
                      <th className="py-2 text-right text-slate-400">At Risk</th>
                      <th className="py-2 text-right text-slate-400">Events</th>
                      <th className="py-2 text-right text-slate-400">Censored</th>
                      <th className="py-2 text-right text-slate-400">Survival</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.curve.map((pt, i) => (
                      <tr key={i} className="border-b border-slate-800">
                        <td className="py-2">{pt.time}</td>
                        <td className="py-2 text-right">{pt.nRisk}</td>
                        <td className="py-2 text-right">{pt.nEvent}</td>
                        <td className="py-2 text-right">{pt.nCensored}</td>
                        <td className="py-2 text-right">{(pt.survival * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="glass-card p-6 border-l-4 border-blue-500">
              <h3 className="font-semibold mb-2">📝 Interpretation</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Kaplan-Meier analysis was performed on {result.totalEvents + result.totalCensored} subjects
                ({result.totalEvents} events, {result.totalCensored} censored).
                {result.medianSurvival !== null
                  ? ` The median survival time was ${formatNumber(result.medianSurvival, 1)} time units.`
                  : " Median survival was not reached during the observation period."}
                {" "}The final survival probability was {(result.curve[result.curve.length - 1].survival * 100).toFixed(1)}%.
              </p>
            </div>
          </div>
        )}
      </div>
    </StatToolLayout>
  );
}
