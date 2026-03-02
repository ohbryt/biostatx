"use client";

import { useState, useRef, useCallback } from "react";
import StatToolLayout from "@/components/StatToolLayout";
import DataSheet, { type ColumnDef } from "@/components/DataSheet";
import ChartControls from "@/components/ChartControls";
import { defaultChartConfig, type ChartStyleConfig } from "@/lib/chartUtils";
import { models, fitCurve, type FitResult } from "@/lib/curveFitting";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, ComposedChart, ReferenceLine, Label, Cell,
} from "recharts";

/* ═══ Column def for XY data (Prism-style) ═══ */
const xyCols: ColumnDef[] = [
  { key: "x", label: "X" },
  { key: "y", label: "Y" },
];

/* ═══ Example datasets ═══ */
const examples: Record<string, { rows: Record<string, string>[]; model: string; desc: string }> = {
  doseResponse: {
    desc: "Drug dose-response (IC₅₀ determination)",
    model: "logistic4PL",
    rows: [
      { x: "-9", y: "2.1" }, { x: "-8.5", y: "3.5" }, { x: "-8", y: "8.2" },
      { x: "-7.5", y: "18.4" }, { x: "-7", y: "35.2" }, { x: "-6.5", y: "58.7" },
      { x: "-6", y: "78.3" }, { x: "-5.5", y: "89.1" }, { x: "-5", y: "94.6" },
      { x: "-4.5", y: "97.2" }, { x: "-4", y: "98.8" },
    ],
  },
  enzyme: {
    desc: "Enzyme kinetics (Michaelis-Menten)",
    model: "michaelismenten",
    rows: [
      { x: "0.5", y: "12.3" }, { x: "1", y: "22.1" }, { x: "2", y: "36.8" },
      { x: "5", y: "58.2" }, { x: "10", y: "72.5" }, { x: "20", y: "84.1" },
      { x: "50", y: "92.8" }, { x: "100", y: "96.4" }, { x: "200", y: "98.7" },
    ],
  },
  decay: {
    desc: "Radioactive decay / Drug clearance",
    model: "exponentialDecay",
    rows: [
      { x: "0", y: "100" }, { x: "1", y: "82.3" }, { x: "2", y: "67.5" },
      { x: "3", y: "55.2" }, { x: "5", y: "37.1" }, { x: "7", y: "24.8" },
      { x: "10", y: "13.6" }, { x: "15", y: "5.2" }, { x: "20", y: "2.1" },
    ],
  },
  growth: {
    desc: "Bacterial / cell growth curve",
    model: "exponentialGrowth",
    rows: [
      { x: "0", y: "1.2" }, { x: "1", y: "2.1" }, { x: "2", y: "3.8" },
      { x: "3", y: "6.9" }, { x: "4", y: "12.5" }, { x: "5", y: "22.8" },
      { x: "6", y: "41.3" }, { x: "7", y: "75.1" },
    ],
  },
  binding: {
    desc: "Cooperative ligand binding (Hill)",
    model: "hillEquation",
    rows: [
      { x: "0.1", y: "1.2" }, { x: "0.5", y: "5.8" }, { x: "1", y: "15.3" },
      { x: "2", y: "38.5" }, { x: "5", y: "72.1" }, { x: "10", y: "88.4" },
      { x: "20", y: "95.2" }, { x: "50", y: "98.7" },
    ],
  },
};

const modelKeys = Object.keys(models);

export default function CurveFittingPage() {
  const [sheetData, setSheetData] = useState<Record<string, string>[]>(examples.doseResponse.rows);
  const [selectedModel, setSelectedModel] = useState("logistic4PL");
  const [result, setResult] = useState<FitResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<ChartStyleConfig>(defaultChartConfig);
  const [showCustomize, setShowCustomize] = useState(true);
  const chartRef = useRef<HTMLDivElement>(null);

  const runFit = useCallback(() => {
    setError(null);
    try {
      const xData: number[] = [];
      const yData: number[] = [];
      for (const row of sheetData) {
        const x = parseFloat(row.x);
        const y = parseFloat(row.y);
        if (isFinite(x) && isFinite(y)) { xData.push(x); yData.push(y); }
      }
      if (xData.length < 3) { setError("Need at least 3 valid XY data points."); return; }
      const r = fitCurve(xData, yData, selectedModel);
      setResult(r);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Fitting failed");
    }
  }, [sheetData, selectedModel]);

  const loadExample = useCallback((key: string) => {
    const ex = examples[key];
    setSheetData(ex.rows);
    setSelectedModel(ex.model);
    setResult(null);
    setError(null);
  }, []);

  /* Parse scatter data for chart */
  const scatterData = sheetData
    .map((r) => ({ x: parseFloat(r.x), y: parseFloat(r.y) }))
    .filter((p) => isFinite(p.x) && isFinite(p.y));

  const m = models[selectedModel];

  return (
    <StatToolLayout
      title="Curve Fitting — Nonlinear Regression"
      description="Prism-style curve fitting with Levenberg-Marquardt optimization. 9 models including dose-response, enzyme kinetics, and more."
    >
      {/* Model Selection + Examples */}
      <div className="glass-card p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
          <div className="flex-1">
            <label className="text-xs font-semibold text-stone-600 block mb-1">Model</label>
            <select
              value={selectedModel}
              onChange={(e) => { setSelectedModel(e.target.value); setResult(null); }}
              className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 bg-white text-stone-700 focus:border-orange-400 focus:ring-1 focus:ring-orange-200 outline-none"
            >
              {modelKeys.map((k) => (
                <option key={k} value={k}>{models[k].name}</option>
              ))}
            </select>
          </div>
          <button onClick={runFit}
            className="px-6 py-2 rounded-lg bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition shadow-sm shadow-orange-500/25">
            🔬 Fit Curve
          </button>
        </div>
        <p className="text-sm text-stone-600 mt-2">
          <strong className="text-stone-800">Equation:</strong> <code className="bg-stone-100 px-1.5 py-0.5 rounded text-orange-700">{m.equation}</code>
          &nbsp;|&nbsp; Parameters: {m.paramNames.join(", ")}
        </p>
      </div>

      {/* Example datasets */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-xs text-stone-600 font-medium py-1">Examples:</span>
        {Object.entries(examples).map(([key, ex]) => (
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
              {m.name}
            </h4>
            <ResponsiveContainer width="100%" height={380}>
              <ComposedChart margin={{ top: 10, right: 20, bottom: 30, left: 10 }}>
                {config.showGrid && <CartesianGrid strokeDasharray="3 3" stroke={config.gridColor} />}
                <XAxis type="number" dataKey="x" stroke={config.axisColor} tick={{ fontSize: config.fontSize }}
                  domain={["auto", "auto"]} allowDataOverflow>
                  <Label value="X" position="bottom" offset={15} fill={config.axisColor} fontSize={config.fontSize + 1} />
                </XAxis>
                <YAxis stroke={config.axisColor} tick={{ fontSize: config.fontSize }} domain={["auto", "auto"]} allowDataOverflow>
                  <Label value="Y" angle={-90} position="insideLeft" offset={0} fill={config.axisColor} fontSize={config.fontSize + 1} />
                </YAxis>
                <Tooltip contentStyle={{
                  background: config.bgColor, border: `1px solid ${config.gridColor}`,
                  borderRadius: 8, color: "#e2e8f0", fontSize: config.fontSize + 1
                }} />
                {/* Fitted curve */}
                {result && (
                  <Line data={result.fittedCurve} type="monotone" dataKey="y"
                    stroke={config.primaryColor} strokeWidth={config.strokeWidth}
                    dot={false} name="Fit" isAnimationActive={false} />
                )}
                {/* Data points */}
                <Scatter data={scatterData} fill={config.secondaryColor} fillOpacity={0.9}
                  shape="circle" name="Data" r={5} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customize toggle (mobile) */}
        <button onClick={() => setShowCustomize(!showCustomize)}
          className="lg:hidden text-xs px-4 py-2 rounded-xl glass-card text-stone-600 font-medium">
          {showCustomize ? "▲ Hide" : "⚙️ Customize & Download"}
        </button>

        <div className={`lg:w-64 flex-shrink-0 ${showCustomize ? "block" : "hidden lg:block"}`}>
          <ChartControls config={config} onChange={setConfig} chartRef={chartRef} filename="curve-fit" />
        </div>
      </div>

      {/* Results */}
      {error && (
        <div className="glass-card p-4 mb-4 border-red-300 bg-red-50">
          <p className="text-sm text-red-600">❌ {error}</p>
        </div>
      )}

      {result && (
        <div className="glass-card p-5 mb-4">
          <h3 className="font-semibold text-stone-800 mb-3 text-sm">📊 Fit Results</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="bg-orange-50 rounded-lg p-3 text-center">
              <div className="text-xs text-stone-500">R²</div>
              <div className="text-lg font-bold text-orange-600">{result.rSquared.toFixed(4)}</div>
            </div>
            <div className="bg-stone-50 rounded-lg p-3 text-center">
              <div className="text-xs text-stone-500">Adj. R²</div>
              <div className="text-lg font-bold text-stone-700">{result.adjRSquared.toFixed(4)}</div>
            </div>
            <div className="bg-stone-50 rounded-lg p-3 text-center">
              <div className="text-xs text-stone-500">RMSE</div>
              <div className="text-lg font-bold text-stone-700">{result.rmse.toFixed(4)}</div>
            </div>
            <div className="bg-stone-50 rounded-lg p-3 text-center">
              <div className="text-xs text-stone-500">Converged</div>
              <div className="text-lg font-bold">{result.converged ? "✅" : "⚠️"}</div>
            </div>
          </div>

          {/* Parameters table */}
          <h4 className="text-xs font-semibold text-stone-600 mb-2 uppercase tracking-wider">Best-Fit Parameters</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="text-left py-2 px-3 text-xs text-stone-500 font-semibold">Parameter</th>
                  <th className="text-right py-2 px-3 text-xs text-stone-500 font-semibold">Value</th>
                </tr>
              </thead>
              <tbody>
                {result.paramNames.map((name, i) => (
                  <tr key={i} className="border-b border-stone-100">
                    <td className="py-2 px-3 text-stone-700 font-medium">{name}</td>
                    <td className="py-2 px-3 text-right font-mono text-stone-800">
                      {Math.abs(result.params[i]) < 0.001 || Math.abs(result.params[i]) > 99999
                        ? result.params[i].toExponential(4)
                        : result.params[i].toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-stone-600 mt-3">
            Levenberg-Marquardt optimization | {result.iterations} iterations | AIC: {result.aic.toFixed(2)}
          </p>
        </div>
      )}

      {/* Data Input */}
      <div className="mb-4">
        <DataSheet columns={xyCols} data={sheetData} onChange={(d) => { setSheetData(d); setResult(null); }}
          onLoadExample={() => loadExample("doseResponse")} />
      </div>

      {/* Info */}
      <div className="glass-card p-4">
        <h3 className="text-xs font-semibold text-stone-700 mb-2">📖 Available Models (GraphPad Prism-style)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {modelKeys.map((k) => (
            <div key={k} className="text-xs text-stone-500">
              <strong className="text-stone-600">{models[k].name}:</strong>{" "}
              <code className="text-orange-600/80">{models[k].equation}</code>
            </div>
          ))}
        </div>
      </div>
    </StatToolLayout>
  );
}
