"use client";

import { useState } from "react";
import StatToolLayout from "@/components/StatToolLayout";
import { sampleSizeCalc } from "@/lib/statistics";

export default function SampleSizePage() {
  const [effectSize, setEffectSize] = useState(0.5);
  const [power, setPower] = useState(0.8);
  const [alpha, setAlpha] = useState(0.05);
  const [result, setResult] = useState<ReturnType<typeof sampleSizeCalc> | null>(null);

  const runCalc = () => {
    if (effectSize <= 0) return;
    setResult(sampleSizeCalc(effectSize, power, alpha));
  };

  return (
    <StatToolLayout
      title="Sample Size Calculator"
      description="Calculate the required sample size per group for a two-group comparison study."
    >
      <div className="space-y-6">
        <div className="glass-card p-6">
          <h3 className="font-semibold mb-4 text-blue-300">Study Parameters</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Effect Size (Cohen&apos;s d)</label>
              <input
                type="number"
                className="input-field"
                value={effectSize}
                onChange={(e) => setEffectSize(Number(e.target.value))}
                step={0.1}
                min={0.01}
              />
              <div className="mt-2 flex gap-2">
                {[
                  { label: "Small (0.2)", val: 0.2 },
                  { label: "Medium (0.5)", val: 0.5 },
                  { label: "Large (0.8)", val: 0.8 },
                ].map((preset) => (
                  <button
                    key={preset.val}
                    className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400 hover:text-blue-400 transition-colors"
                    onClick={() => setEffectSize(preset.val)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Statistical Power (1 - β)</label>
              <select className="input-field" value={power} onChange={(e) => setPower(Number(e.target.value))}>
                <option value={0.7}>0.70 (70%)</option>
                <option value={0.8}>0.80 (80%) — Standard</option>
                <option value={0.9}>0.90 (90%)</option>
                <option value={0.95}>0.95 (95%)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Significance Level (α)</label>
              <select className="input-field" value={alpha} onChange={(e) => setAlpha(Number(e.target.value))}>
                <option value={0.01}>0.01</option>
                <option value={0.05}>0.05 — Standard</option>
                <option value={0.1}>0.10</option>
              </select>
            </div>
          </div>

          <button className="btn-primary mt-6" onClick={runCalc}>
            Calculate Sample Size
          </button>
        </div>

        {result && (
          <div className="space-y-6">
            <div className="result-box">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Sample Size Per Group</div>
                  <div className="text-5xl font-extrabold gradient-text">{result.sampleSize}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Sample Size</div>
                  <div className="text-5xl font-extrabold text-cyan-400">{result.totalSampleSize}</div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="font-semibold mb-4">Parameters Used</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Effect Size:</span>{" "}
                  <span className="font-medium">{result.effectSize} ({result.effectSize >= 0.8 ? "Large" : result.effectSize >= 0.5 ? "Medium" : "Small"})</span>
                </div>
                <div>
                  <span className="text-slate-500">Power:</span>{" "}
                  <span className="font-medium">{(result.power * 100).toFixed(0)}%</span>
                </div>
                <div>
                  <span className="text-slate-500">Alpha:</span>{" "}
                  <span className="font-medium">{result.alpha}</span>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 border-l-4 border-blue-500">
              <h3 className="font-semibold mb-2">📝 Interpretation</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                To detect a {result.effectSize >= 0.8 ? "large" : result.effectSize >= 0.5 ? "medium" : "small"} effect
                (d = {result.effectSize}) with {(result.power * 100).toFixed(0)}% power at the {result.alpha} significance level,
                you need at least <strong>{result.sampleSize} participants per group</strong> ({result.totalSampleSize} total).
                Consider adding 10-20% to account for potential dropouts.
              </p>
            </div>
          </div>
        )}
      </div>
    </StatToolLayout>
  );
}
