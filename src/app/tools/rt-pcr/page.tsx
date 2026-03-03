"use client";

import { useState, useRef, useCallback } from "react";
import StatToolLayout from "@/components/StatToolLayout";
import DataSheet, { type ColumnDef } from "@/components/DataSheet";
import ChartControls from "@/components/ChartControls";
import { defaultChartConfig, type ChartStyleConfig } from "@/lib/chartUtils";
import {
  analyzeDeltaCt,
  rtpcrExamples,
  type DeltaCtResult,
  type Method,
  type Sample,
} from "@/lib/deltaCt";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ErrorBar, ComposedChart, Cell,
  Scatter, Legend,
} from "recharts";

/* ═══ Column def for RT-PCR data (Prism-style) ═══ */
const pcrCols: ColumnDef[] = [
  { key: "name", label: "Sample" },
  { key: "group", label: "Group" },
  { key: "targetCt", label: "Target Ct" },
  { key: "referenceCt", label: "Reference Ct" },
];

const pcrColsPfaffl: ColumnDef[] = [
  { key: "name", label: "Sample" },
  { key: "group", label: "Group" },
  { key: "targetCt", label: "Target Ct" },
  { key: "referenceCt", label: "Reference Ct" },
  { key: "targetEff", label: "Target E" },
  { key: "refEff", label: "Ref E" },
];

const methodOptions: { value: Method; label: string; desc: string }[] = [
  { value: "livak", label: "2⁻ΔΔCt (Livak)", desc: "Assumes 100% efficiency. Most common method." },
  { value: "pfaffl", label: "Pfaffl (Efficiency-corrected)", desc: "Accounts for different PCR efficiencies." },
  { value: "deltaCt", label: "2⁻ΔCt (Simple)", desc: "Relative to reference gene only." },
];

const GROUP_COLORS = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#ef4444", "#06b6d4"];

function samplesToSheet(samples: Sample[]): Record<string, string>[] {
  return samples.map((s) => ({
    name: s.name,
    group: s.group,
    targetCt: String(s.targetCt),
    referenceCt: String(s.referenceCt),
    targetEff: String(s.targetEfficiency ?? ""),
    refEff: String(s.refEfficiency ?? ""),
  }));
}

function sheetToSamples(data: Record<string, string>[]): Sample[] {
  return data
    .filter((r) => r.name && r.group && r.targetCt && r.referenceCt)
    .map((r) => ({
      name: r.name.trim(),
      group: r.group.trim(),
      targetCt: parseFloat(r.targetCt),
      referenceCt: parseFloat(r.referenceCt),
      targetEfficiency: r.targetEff ? parseFloat(r.targetEff) : undefined,
      refEfficiency: r.refEff ? parseFloat(r.refEff) : undefined,
    }))
    .filter((s) => isFinite(s.targetCt) && isFinite(s.referenceCt));
}

export default function RtPcrPage() {
  const defaultEx = rtpcrExamples.geneExpression;
  const [sheetData, setSheetData] = useState<Record<string, string>[]>(samplesToSheet(defaultEx.samples));
  const [method, setMethod] = useState<Method>("livak");
  const [controlGroup, setControlGroup] = useState(defaultEx.controlGroup);
  const [result, setResult] = useState<DeltaCtResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<ChartStyleConfig>(defaultChartConfig);
  const [showCustomize, setShowCustomize] = useState(true);
  const chartRef = useRef<HTMLDivElement>(null);

  const runAnalysis = useCallback(() => {
    setError(null);
    try {
      const samples = sheetToSamples(sheetData);
      if (samples.length < 2) { setError("Need at least 2 valid samples with Ct values."); return; }
      const groups = [...new Set(samples.map((s) => s.group))];
      if (groups.length < 1) { setError("Need at least 1 group defined."); return; }
      if (!groups.includes(controlGroup)) { setError(`Control group "${controlGroup}" not found. Available: ${groups.join(", ")}`); return; }
      const r = analyzeDeltaCt(samples, controlGroup, method);
      setResult(r);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Analysis failed");
    }
  }, [sheetData, method, controlGroup]);

  const loadExample = useCallback((key: string) => {
    const ex = rtpcrExamples[key];
    setSheetData(samplesToSheet(ex.samples));
    setControlGroup(ex.controlGroup);
    setMethod(ex.method);
    setResult(null);
    setError(null);
  }, []);

  /* Detect groups from sheet data for control selector */
  const detectedGroups = [...new Set(
    sheetData.filter((r) => r.group?.trim()).map((r) => r.group.trim())
  )];

  /* Chart data */
  const barData = result?.groupSummaries.map((g) => ({
    group: g.group,
    foldChange: g.meanFoldChange,
    errorBarUp: g.semFoldChange,
    errorBarDown: g.semFoldChange,
    n: g.n,
  })) ?? [];

  /* Individual data points for scatter overlay */
  const scatterPoints = result?.rows.map((r) => ({
    group: r.group,
    foldChange: r.foldChange,
    name: r.name,
  })) ?? [];

  const columns = method === "pfaffl" ? pcrColsPfaffl : pcrCols;

  return (
    <StatToolLayout
      title="RT-PCR — Delta Ct Relative Quantification"
      description="Analyze RT-qPCR gene expression with 2⁻ΔΔCt (Livak), Pfaffl, and 2⁻ΔCt methods. Based on RQdeltaCT methodology."
    >
      {/* Method Selection + Controls */}
      <div className="glass-card p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
          <div className="flex-1">
            <label className="text-xs font-semibold text-stone-600 block mb-1">Method</label>
            <select
              value={method}
              onChange={(e) => { setMethod(e.target.value as Method); setResult(null); }}
              className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 bg-white text-stone-700 focus:border-orange-400 focus:ring-1 focus:ring-orange-200 outline-none"
            >
              {methodOptions.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="text-xs font-semibold text-stone-600 block mb-1">Control Group</label>
            {detectedGroups.length > 0 ? (
              <select
                value={controlGroup}
                onChange={(e) => { setControlGroup(e.target.value); setResult(null); }}
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 bg-white text-stone-700 focus:border-orange-400 focus:ring-1 focus:ring-orange-200 outline-none"
              >
                {detectedGroups.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            ) : (
              <input
                type="text" value={controlGroup}
                onChange={(e) => setControlGroup(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 bg-white text-stone-700 focus:border-orange-400 focus:ring-1 focus:ring-orange-200 outline-none"
                placeholder="e.g. Control"
              />
            )}
          </div>
          <button onClick={runAnalysis}
            className="px-6 py-2 rounded-lg bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition shadow-sm shadow-orange-500/25 whitespace-nowrap">
            🧬 Analyze
          </button>
        </div>
        <p className="text-sm text-stone-600 mt-2">
          <strong className="text-stone-800">Formula:</strong>{" "}
          <code className="bg-stone-100 px-1.5 py-0.5 rounded text-orange-700 text-xs">
            {methodOptions.find((m) => m.value === method)?.desc}
          </code>
        </p>
      </div>

      {/* Example datasets */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-xs text-stone-600 font-medium py-1">Examples:</span>
        {Object.entries(rtpcrExamples).map(([key, ex]) => (
          <button key={key} onClick={() => loadExample(key)}
            className="text-xs px-3 py-1.5 rounded-lg border border-stone-200 text-stone-500 hover:border-orange-300 hover:text-orange-600 transition">
            {ex.desc}
          </button>
        ))}
      </div>

      {/* Chart + Customize */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        <div className="flex-1 min-w-0" ref={chartRef}>
          <div className="rounded-xl p-4" style={{ background: config.bgColor }}>
            <h4 className="font-semibold mb-2 text-center" style={{ fontSize: config.fontSize + 4, color: config.axisColor }}>
              {result ? "Fold Change (Relative to " + result.controlGroup + ")" : "Fold Change"}
            </h4>
            <ResponsiveContainer width="100%" height={380}>
              <ComposedChart data={barData} margin={{ top: 10, right: 20, bottom: 30, left: 10 }}>
                {config.showGrid && <CartesianGrid strokeDasharray="3 3" stroke={config.gridColor} />}
                <XAxis dataKey="group" stroke={config.axisColor} tick={{ fontSize: config.fontSize }} />
                <YAxis stroke={config.axisColor} tick={{ fontSize: config.fontSize }}
                  label={{ value: "Fold Change", angle: -90, position: "insideLeft", fill: config.axisColor, fontSize: config.fontSize + 1 }} />
                <Tooltip
                  contentStyle={{
                    background: config.bgColor, border: `1px solid ${config.gridColor}`,
                    borderRadius: 8, fontSize: config.fontSize + 1,
                  }}
                  formatter={(value: number) => [value.toFixed(3), "Fold Change"]}
                />
                <Legend wrapperStyle={{ fontSize: config.fontSize }} />
                <Bar dataKey="foldChange" name="Mean ± SEM" radius={[6, 6, 0, 0]} fillOpacity={0.8}>
                  <ErrorBar dataKey="errorBarUp" direction="y" stroke={config.axisColor} strokeWidth={1.5} />
                  {barData.map((entry, i) => {
                    const gIdx = [...new Set(barData.map((b) => b.group))].indexOf(entry.group);
                    return <Cell key={i} fill={GROUP_COLORS[gIdx % GROUP_COLORS.length]} />;
                  })}
                </Bar>
                {/* Individual data points overlay */}
                {result && (() => {
                  const groupNames = barData.map((b) => b.group);
                  const pts = scatterPoints.map((p) => ({
                    x: groupNames.indexOf(p.group),
                    y: p.foldChange,
                    group: p.group,
                    name: p.name,
                  }));
                  return (
                    <Scatter data={pts} dataKey="y" fill="#1e293b" fillOpacity={0.6}
                      shape="circle" name="Data Points" legendType="circle" r={4}
                    />
                  );
                })()}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customize toggle */}
        <button onClick={() => setShowCustomize(!showCustomize)}
          className="lg:hidden text-xs px-4 py-2 rounded-xl glass-card text-stone-600 font-medium">
          {showCustomize ? "▲ Hide" : "⚙️ Customize & Download"}
        </button>

        <div className={`lg:w-64 flex-shrink-0 ${showCustomize ? "block" : "hidden lg:block"}`}>
          <ChartControls config={config} onChange={setConfig} chartRef={chartRef} filename="rt-pcr-deltact" />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="glass-card p-4 mb-4 border-red-300 bg-red-50">
          <p className="text-sm text-red-600">❌ {error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <>
          {/* Key metrics */}
          <div className="glass-card p-5 mb-4">
            <h3 className="font-semibold text-stone-800 mb-3 text-sm">📊 Analysis Results — {result.methodName}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="bg-orange-50 rounded-lg p-3 text-center">
                <div className="text-xs text-stone-500">Method</div>
                <div className="text-sm font-bold text-orange-600 mt-1">
                  {method === "livak" ? "2⁻ΔΔCt" : method === "pfaffl" ? "Pfaffl" : "2⁻ΔCt"}
                </div>
              </div>
              <div className="bg-stone-50 rounded-lg p-3 text-center">
                <div className="text-xs text-stone-500">Groups</div>
                <div className="text-lg font-bold text-stone-700">{result.groupSummaries.length}</div>
              </div>
              <div className="bg-stone-50 rounded-lg p-3 text-center">
                <div className="text-xs text-stone-500">Total Samples</div>
                <div className="text-lg font-bold text-stone-700">{result.rows.length}</div>
              </div>
              {result.statTest && (
                <div className={`rounded-lg p-3 text-center ${result.statTest.significant ? "bg-green-50" : "bg-stone-50"}`}>
                  <div className="text-xs text-stone-500">p-value</div>
                  <div className={`text-lg font-bold ${result.statTest.significant ? "text-green-600" : "text-stone-700"}`}>
                    {result.statTest.pValue < 0.0001 ? result.statTest.pValue.toExponential(2) : result.statTest.pValue.toFixed(4)}
                  </div>
                </div>
              )}
            </div>

            {/* Group Summaries Table */}
            <h4 className="text-xs font-semibold text-stone-600 mb-2 uppercase tracking-wider">Group Summary</h4>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200">
                    <th className="text-left py-2 px-3 text-xs text-stone-500 font-semibold">Group</th>
                    <th className="text-right py-2 px-3 text-xs text-stone-500 font-semibold">n</th>
                    <th className="text-right py-2 px-3 text-xs text-stone-500 font-semibold">Mean ΔCt</th>
                    <th className="text-right py-2 px-3 text-xs text-stone-500 font-semibold">SD</th>
                    <th className="text-right py-2 px-3 text-xs text-stone-500 font-semibold">Fold Change</th>
                    <th className="text-right py-2 px-3 text-xs text-stone-500 font-semibold">± SEM</th>
                  </tr>
                </thead>
                <tbody>
                  {result.groupSummaries.map((g, i) => (
                    <tr key={i} className="border-b border-stone-100">
                      <td className="py-2 px-3 text-stone-700 font-medium">
                        <span className="inline-block w-2.5 h-2.5 rounded-full mr-2" style={{ background: GROUP_COLORS[i % GROUP_COLORS.length] }} />
                        {g.group}{g.group === result.controlGroup && <span className="text-xs text-stone-400 ml-1">(ctrl)</span>}
                      </td>
                      <td className="py-2 px-3 text-right text-stone-600">{g.n}</td>
                      <td className="py-2 px-3 text-right font-mono text-stone-800">{g.meanDeltaCt.toFixed(3)}</td>
                      <td className="py-2 px-3 text-right font-mono text-stone-600">{g.sdDeltaCt.toFixed(3)}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-orange-700">{g.meanFoldChange.toFixed(3)}</td>
                      <td className="py-2 px-3 text-right font-mono text-stone-600">± {g.semFoldChange.toFixed(3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Individual Sample Table */}
            <h4 className="text-xs font-semibold text-stone-600 mb-2 uppercase tracking-wider">Per-Sample Results</h4>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200">
                    <th className="text-left py-2 px-2 text-xs text-stone-500 font-semibold">Sample</th>
                    <th className="text-left py-2 px-2 text-xs text-stone-500 font-semibold">Group</th>
                    <th className="text-right py-2 px-2 text-xs text-stone-500 font-semibold">Target Ct</th>
                    <th className="text-right py-2 px-2 text-xs text-stone-500 font-semibold">Ref Ct</th>
                    <th className="text-right py-2 px-2 text-xs text-stone-500 font-semibold">ΔCt</th>
                    <th className="text-right py-2 px-2 text-xs text-stone-500 font-semibold">ΔΔCt</th>
                    <th className="text-right py-2 px-2 text-xs text-stone-500 font-semibold">Fold Change</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((r, i) => (
                    <tr key={i} className="border-b border-stone-100">
                      <td className="py-1.5 px-2 text-stone-700 font-medium text-xs">{r.name}</td>
                      <td className="py-1.5 px-2 text-stone-600 text-xs">{r.group}</td>
                      <td className="py-1.5 px-2 text-right font-mono text-xs text-stone-700">{r.targetCt.toFixed(2)}</td>
                      <td className="py-1.5 px-2 text-right font-mono text-xs text-stone-700">{r.referenceCt.toFixed(2)}</td>
                      <td className="py-1.5 px-2 text-right font-mono text-xs text-stone-800">{r.deltaCt.toFixed(3)}</td>
                      <td className="py-1.5 px-2 text-right font-mono text-xs text-stone-800">{r.deltaDeltaCt.toFixed(3)}</td>
                      <td className="py-1.5 px-2 text-right font-mono text-xs font-bold text-orange-700">{r.foldChange.toFixed(3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Statistical test */}
            {result.statTest && (
              <div className={`rounded-lg p-3 mb-3 ${result.statTest.significant ? "bg-green-50 border border-green-200" : "bg-stone-50 border border-stone-200"}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${result.statTest.significant ? "bg-green-100 text-green-700" : "bg-stone-200 text-stone-600"}`}>
                    {result.statTest.significant ? "✓ Significant" : "✗ Not Significant"}
                  </span>
                  <span className="text-xs text-stone-600">{result.statTest.test}</span>
                </div>
                <p className="text-sm text-stone-700 font-mono">{result.statTest.description}</p>
              </div>
            )}

            {/* Formula reference */}
            <p className="text-xs text-stone-600 mt-3">
              <strong>Formula:</strong>{" "}
              <code className="bg-stone-100 px-1.5 py-0.5 rounded text-orange-700">{result.formula}</code>
            </p>
          </div>

          {/* Interpretation */}
          <div className="glass-card p-5 mb-4 border-l-4 border-orange-400">
            <h3 className="font-semibold text-stone-800 mb-2 text-sm">📝 Interpretation</h3>
            <p className="text-sm text-stone-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: result.interpretation.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
          </div>
        </>
      )}

      {/* Data Input */}
      <div className="mb-4">
        <DataSheet columns={columns} data={sheetData}
          onChange={(d) => { setSheetData(d); setResult(null); }}
          onLoadExample={() => loadExample("geneExpression")} />
      </div>

      {/* Info */}
      <div className="glass-card p-4">
        <h3 className="text-xs font-semibold text-stone-700 mb-3">📖 Delta Ct Methods Reference</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-orange-50/50 rounded-lg p-3">
            <h4 className="text-xs font-bold text-orange-700 mb-1">2⁻ΔΔCt (Livak)</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Most widely used. Assumes ~100% PCR efficiency for both target and reference genes.
              ΔCt = Ct(target) − Ct(ref), then ΔΔCt = ΔCt − mean(ΔCt_control).
            </p>
          </div>
          <div className="bg-blue-50/50 rounded-lg p-3">
            <h4 className="text-xs font-bold text-blue-700 mb-1">Pfaffl Method</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Corrects for different PCR efficiencies. Ratio = E_target^(ΔCt_target) / E_ref^(ΔCt_ref).
              Use when amplification efficiencies differ between genes.
            </p>
          </div>
          <div className="bg-emerald-50/50 rounded-lg p-3">
            <h4 className="text-xs font-bold text-emerald-700 mb-1">2⁻ΔCt (Simple)</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Normalizes gene expression to reference gene only. Expression = 2^(−ΔCt).
              Useful for comparing expression levels across samples without a calibrator.
            </p>
          </div>
        </div>
        <p className="text-xs text-stone-500 mt-3">
          References: Livak & Schmittgen (2001) <em>Methods</em> 25:402–408 · Pfaffl (2001) <em>Nucleic Acids Res</em> 29:e45 · Zalewski & Bogucka-Kocka (2025) <em>Sci Rep</em> 15:29762
        </p>
      </div>
    </StatToolLayout>
  );
}
