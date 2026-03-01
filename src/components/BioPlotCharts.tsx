"use client";

import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, AreaChart, Area,
  BarChart, Bar, ErrorBar, ReferenceLine, Label
} from "recharts";
import { type ChartStyleConfig, defaultChartConfig } from "@/lib/chartUtils";

/* ═══ Merge helper ═══ */
function cfg(c?: Partial<ChartStyleConfig>): ChartStyleConfig {
  return { ...defaultChartConfig, ...c };
}
function ttStyle(s: ChartStyleConfig) {
  return { background: s.bgColor, border: `1px solid ${s.gridColor}`, borderRadius: 8, color: "#e2e8f0", fontSize: s.fontSize + 1 };
}

/* ═══════════════════════════════════════════
   1. VOLCANO PLOT
   ═══════════════════════════════════════════ */
export interface VolcanoPoint { gene: string; log2FC: number; negLog10P: number; }

interface VolcanoPlotProps {
  data: VolcanoPoint[];
  fcThreshold?: number;
  pThreshold?: number;
  title?: string;
  config?: Partial<ChartStyleConfig>;
}

export function VolcanoPlot({ data, fcThreshold = 1, pThreshold = 1.3, title = "Volcano Plot", config: _c }: VolcanoPlotProps) {
  const s = cfg(_c);
  const getColor = (p: VolcanoPoint) => {
    if (p.negLog10P < pThreshold) return "#6b7280";
    if (p.log2FC > fcThreshold) return s.primaryColor;
    if (p.log2FC < -fcThreshold) return s.secondaryColor;
    return "#6b7280";
  };

  return (
    <div className="rounded-xl p-4" style={{ background: s.bgColor }}>
      <h4 className="font-semibold text-slate-200 mb-1 text-center" style={{ fontSize: s.fontSize + 4 }}>{title}</h4>
      <div className="flex justify-center gap-4 mb-2 flex-wrap">
        <span className="text-slate-400 flex items-center gap-1" style={{ fontSize: s.fontSize - 1 }}><span className="w-2 h-2 rounded-full inline-block" style={{ background: s.primaryColor }} /> Upregulated</span>
        <span className="text-slate-400 flex items-center gap-1" style={{ fontSize: s.fontSize - 1 }}><span className="w-2 h-2 rounded-full inline-block" style={{ background: s.secondaryColor }} /> Downregulated</span>
        <span className="text-slate-400 flex items-center gap-1" style={{ fontSize: s.fontSize - 1 }}><span className="w-2 h-2 rounded-full bg-gray-500 inline-block" /> NS</span>
      </div>
      <ResponsiveContainer width="100%" height={360}>
        <ScatterChart margin={{ top: 10, right: 20, bottom: 30, left: 10 }}>
          {s.showGrid && <CartesianGrid strokeDasharray="3 3" stroke={s.gridColor} />}
          <XAxis type="number" dataKey="log2FC" stroke={s.axisColor} tick={{ fontSize: s.fontSize }}>
            <Label value="log₂(Fold Change)" position="bottom" offset={15} fill={s.axisColor} fontSize={s.fontSize + 1} />
          </XAxis>
          <YAxis type="number" dataKey="negLog10P" stroke={s.axisColor} tick={{ fontSize: s.fontSize }}>
            <Label value="-log₁₀(p-value)" angle={-90} position="insideLeft" offset={0} fill={s.axisColor} fontSize={s.fontSize + 1} />
          </YAxis>
          <ReferenceLine x={fcThreshold} stroke={`${s.primaryColor}80`} strokeDasharray="4 4" />
          <ReferenceLine x={-fcThreshold} stroke={`${s.secondaryColor}80`} strokeDasharray="4 4" />
          <ReferenceLine y={pThreshold} stroke="#eab30880" strokeDasharray="4 4" />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={ttStyle(s)}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(_: any, name: any, props: any) => { const p = props?.payload as VolcanoPoint | undefined; if (!p) return [String(_), String(name)]; if (name === "negLog10P") return [`${p.negLog10P.toFixed(2)}`, `-log₁₀(p)`]; return [`${p.log2FC.toFixed(2)}`, `log₂(FC)`]; }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            labelFormatter={(_: any, payload: any) => (payload as any)?.[0]?.payload?.gene || ""} />
          <Scatter data={data} shape="circle">
            {data.map((entry, i) => <Cell key={i} fill={getColor(entry)} fillOpacity={0.7} r={3} />)}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ═══════════════════════════════════════════
   2. HEATMAP (Custom SVG)
   ═══════════════════════════════════════════ */
export interface HeatmapData { rows: string[]; cols: string[]; values: number[][]; }

interface HeatmapProps { data: HeatmapData; title?: string; config?: Partial<ChartStyleConfig>; }

function heatColor(val: number, min: number, max: number, lo: string, hi: string): string {
  const t = max === min ? 0.5 : (val - min) / (max - min);
  // parse hex colors
  const loR = parseInt(lo.slice(1, 3), 16), loG = parseInt(lo.slice(3, 5), 16), loB = parseInt(lo.slice(5, 7), 16);
  const hiR = parseInt(hi.slice(1, 3), 16), hiG = parseInt(hi.slice(3, 5), 16), hiB = parseInt(hi.slice(5, 7), 16);
  if (t < 0.5) {
    const s2 = t * 2;
    return `rgb(${Math.round(loR + s2 * (255 - loR))},${Math.round(loG + s2 * (255 - loG))},${Math.round(loB + s2 * (255 - loB))})`;
  }
  const s2 = (t - 0.5) * 2;
  return `rgb(${Math.round(255 - s2 * (255 - hiR))},${Math.round(255 - s2 * (255 - hiG))},${Math.round(255 - s2 * (255 - hiB))})`;
}

export function Heatmap({ data, title = "Expression Heatmap", config: _c }: HeatmapProps) {
  const s = cfg(_c);
  const cellW = Math.min(50, Math.max(20, 400 / data.cols.length));
  const cellH = Math.min(30, Math.max(16, 300 / data.rows.length));
  const labelW = 80, topLabelH = 60, legendW = 60;
  const svgW = labelW + data.cols.length * cellW + legendW + 10;
  const svgH = topLabelH + data.rows.length * cellH + 10;
  const allVals = data.values.flat();
  const min = Math.min(...allVals), max = Math.max(...allVals);

  return (
    <div className="rounded-xl p-4" style={{ background: s.bgColor }}>
      <h4 className="font-semibold text-slate-200 mb-3 text-center" style={{ fontSize: s.fontSize + 4 }}>{title}</h4>
      <div className="overflow-x-auto flex justify-center">
        <svg width={svgW} height={svgH}>
          {data.cols.map((col, ci) => (
            <text key={`cl-${ci}`} x={labelW + ci * cellW + cellW / 2} y={topLabelH - 5} textAnchor="end"
              transform={`rotate(-45, ${labelW + ci * cellW + cellW / 2}, ${topLabelH - 5})`}
              fill={s.axisColor} fontSize={s.fontSize - 1}>{col}</text>
          ))}
          {data.rows.map((row, ri) => (
            <g key={`r-${ri}`}>
              <text x={labelW - 5} y={topLabelH + ri * cellH + cellH / 2 + 3} textAnchor="end" fill={s.axisColor} fontSize={s.fontSize - 1}>{row}</text>
              {data.cols.map((_, ci) => (
                <rect key={`c-${ri}-${ci}`} x={labelW + ci * cellW} y={topLabelH + ri * cellH}
                  width={cellW - 1} height={cellH - 1} fill={heatColor(data.values[ri][ci], min, max, s.secondaryColor, s.primaryColor)} rx={2}>
                  <title>{`${row} × ${data.cols[ci]}: ${data.values[ri][ci].toFixed(2)}`}</title>
                </rect>
              ))}
            </g>
          ))}
          <defs>
            <linearGradient id="heatLegend" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor={s.secondaryColor} />
              <stop offset="50%" stopColor="rgb(255,255,255)" />
              <stop offset="100%" stopColor={s.primaryColor} />
            </linearGradient>
          </defs>
          <rect x={labelW + data.cols.length * cellW + 15} y={topLabelH} width={12} height={data.rows.length * cellH} fill="url(#heatLegend)" rx={3} />
          <text x={labelW + data.cols.length * cellW + 32} y={topLabelH + 8} fill={s.axisColor} fontSize={s.fontSize - 2}>{max.toFixed(1)}</text>
          <text x={labelW + data.cols.length * cellW + 32} y={topLabelH + data.rows.length * cellH} fill={s.axisColor} fontSize={s.fontSize - 2}>{min.toFixed(1)}</text>
        </svg>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   3. PCA PLOT
   ═══════════════════════════════════════════ */
export interface PCAPoint { label: string; pc1: number; pc2: number; group: string; }

interface PCAPlotProps { data: PCAPoint[]; pc1Var?: number; pc2Var?: number; title?: string; config?: Partial<ChartStyleConfig>; }

export function PCAPlot({ data, pc1Var = 45.2, pc2Var = 18.7, title = "PCA Plot", config: _c }: PCAPlotProps) {
  const s = cfg(_c);
  const colors = [s.primaryColor, s.secondaryColor, s.accentColor, "#a855f7", "#ef4444", "#eab308"];
  const groups = [...new Set(data.map((d) => d.group))];

  return (
    <div className="rounded-xl p-4" style={{ background: s.bgColor }}>
      <h4 className="font-semibold text-slate-200 mb-1 text-center" style={{ fontSize: s.fontSize + 4 }}>{title}</h4>
      <div className="flex justify-center gap-4 mb-2 flex-wrap">
        {groups.map((g, i) => (
          <span key={g} className="text-slate-400 flex items-center gap-1" style={{ fontSize: s.fontSize - 1 }}>
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: colors[i % colors.length] }} /> {g}
          </span>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={360}>
        <ScatterChart margin={{ top: 10, right: 20, bottom: 30, left: 10 }}>
          {s.showGrid && <CartesianGrid strokeDasharray="3 3" stroke={s.gridColor} />}
          <XAxis type="number" dataKey="pc1" stroke={s.axisColor} tick={{ fontSize: s.fontSize }}>
            <Label value={`PC1 (${pc1Var}%)`} position="bottom" offset={15} fill={s.axisColor} fontSize={s.fontSize + 1} />
          </XAxis>
          <YAxis type="number" dataKey="pc2" stroke={s.axisColor} tick={{ fontSize: s.fontSize }}>
            <Label value={`PC2 (${pc2Var}%)`} angle={-90} position="insideLeft" offset={0} fill={s.axisColor} fontSize={s.fontSize + 1} />
          </YAxis>
          <Tooltip contentStyle={ttStyle(s)} formatter={(val: number) => val.toFixed(2)} />
          {groups.map((g, gi) => (
            <Scatter key={g} name={g} data={data.filter((d) => d.group === g)} fill={colors[gi % colors.length]} fillOpacity={0.8} shape="circle" />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ═══════════════════════════════════════════
   4. ROC CURVE
   ═══════════════════════════════════════════ */
export interface ROCPoint { fpr: number; tpr: number; }
interface ROCCurveProps { curves: { name: string; data: ROCPoint[]; auc: number }[]; title?: string; config?: Partial<ChartStyleConfig>; }

export function ROCCurve({ curves, title = "ROC Curve", config: _c }: ROCCurveProps) {
  const s = cfg(_c);
  const colors = [s.primaryColor, s.secondaryColor, s.accentColor, "#a855f7", "#ef4444"];
  return (
    <div className="rounded-xl p-4" style={{ background: s.bgColor }}>
      <h4 className="font-semibold text-slate-200 mb-1 text-center" style={{ fontSize: s.fontSize + 4 }}>{title}</h4>
      <div className="flex justify-center gap-4 mb-2 flex-wrap">
        {curves.map((c, i) => (
          <span key={c.name} className="text-slate-400 flex items-center gap-1" style={{ fontSize: s.fontSize - 1 }}>
            <span className="w-3 h-0.5 inline-block" style={{ background: colors[i % colors.length] }} />
            {c.name} (AUC={c.auc.toFixed(3)})
          </span>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={360}>
        <AreaChart margin={{ top: 10, right: 20, bottom: 30, left: 10 }}>
          {s.showGrid && <CartesianGrid strokeDasharray="3 3" stroke={s.gridColor} />}
          <XAxis type="number" dataKey="fpr" domain={[0, 1]} stroke={s.axisColor} tick={{ fontSize: s.fontSize }}>
            <Label value="False Positive Rate (1 - Specificity)" position="bottom" offset={15} fill={s.axisColor} fontSize={s.fontSize + 1} />
          </XAxis>
          <YAxis type="number" domain={[0, 1]} stroke={s.axisColor} tick={{ fontSize: s.fontSize }}>
            <Label value="True Positive Rate (Sensitivity)" angle={-90} position="insideLeft" offset={0} fill={s.axisColor} fontSize={s.fontSize + 1} />
          </YAxis>
          <Tooltip contentStyle={ttStyle(s)} />
          <ReferenceLine segment={[{ x: 0, y: 0 }, { x: 1, y: 1 }]} stroke="#475569" strokeDasharray="6 4" />
          {curves.map((c, i) => (
            <Area key={c.name} data={c.data} type="monotone" dataKey="tpr"
              stroke={colors[i % colors.length]} fill={colors[i % colors.length]} fillOpacity={0.08}
              strokeWidth={s.strokeWidth} dot={false} name={c.name} />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ═══════════════════════════════════════════
   5. BOX PLOT
   ═══════════════════════════════════════════ */
export interface BoxPlotGroup { name: string; min: number; q1: number; median: number; q3: number; max: number; }
interface BoxPlotProps { data: BoxPlotGroup[]; yLabel?: string; title?: string; config?: Partial<ChartStyleConfig>; }

export function BoxPlot({ data, yLabel = "Value", title = "Box Plot", config: _c }: BoxPlotProps) {
  const s = cfg(_c);
  const barData = data.map((d) => ({
    name: d.name, base: d.q1, iqr: d.q3 - d.q1, median: d.median, min: d.min, max: d.max,
    whiskerLow: [d.q1 - d.min, 0] as [number, number],
    whiskerHigh: [0, d.max - d.q3] as [number, number],
  }));

  return (
    <div className="rounded-xl p-4" style={{ background: s.bgColor }}>
      <h4 className="font-semibold text-slate-200 mb-3 text-center" style={{ fontSize: s.fontSize + 4 }}>{title}</h4>
      <ResponsiveContainer width="100%" height={360}>
        <BarChart data={barData} margin={{ top: 10, right: 20, bottom: 30, left: 10 }}>
          {s.showGrid && <CartesianGrid strokeDasharray="3 3" stroke={s.gridColor} />}
          <XAxis dataKey="name" stroke={s.axisColor} tick={{ fontSize: s.fontSize }} />
          <YAxis stroke={s.axisColor} tick={{ fontSize: s.fontSize }}>
            <Label value={yLabel} angle={-90} position="insideLeft" offset={0} fill={s.axisColor} fontSize={s.fontSize + 1} />
          </YAxis>
          <Tooltip contentStyle={ttStyle(s)} formatter={(val: number, name: string) => { if (name === "base") return [null, null]; return [val.toFixed(2), "IQR"]; }} />
          <Bar dataKey="base" stackId="box" fill="transparent" />
          <Bar dataKey="iqr" stackId="box" fill={`${s.primaryColor}40`} stroke={s.primaryColor} strokeWidth={s.strokeWidth} radius={[4, 4, 4, 4]}>
            <ErrorBar dataKey="whiskerLow" direction="y" width={8} stroke={s.primaryColor} strokeWidth={1} />
            <ErrorBar dataKey="whiskerHigh" direction="y" width={8} stroke={s.primaryColor} strokeWidth={1} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-stone-500 mt-2 text-center" style={{ fontSize: s.fontSize }}>Whiskers: min–max | Box: Q1–Q3</p>
    </div>
  );
}

/* ═══════════════════════════════════════════
   6. ENRICHMENT BUBBLE PLOT
   ═══════════════════════════════════════════ */
export interface EnrichmentTerm { term: string; geneRatio: number; negLog10P: number; count: number; }
interface EnrichmentPlotProps { data: EnrichmentTerm[]; title?: string; config?: Partial<ChartStyleConfig>; }

export function EnrichmentBubblePlot({ data, title = "GO Enrichment Analysis", config: _c }: EnrichmentPlotProps) {
  const s = cfg(_c);
  const maxCount = Math.max(...data.map((d) => d.count));
  const minCount = Math.min(...data.map((d) => d.count));

  return (
    <div className="rounded-xl p-4" style={{ background: s.bgColor }}>
      <h4 className="font-semibold text-slate-200 mb-3 text-center" style={{ fontSize: s.fontSize + 4 }}>{title}</h4>
      <ResponsiveContainer width="100%" height={380}>
        <ScatterChart margin={{ top: 10, right: 30, bottom: 30, left: 10 }}>
          {s.showGrid && <CartesianGrid strokeDasharray="3 3" stroke={s.gridColor} />}
          <XAxis type="number" dataKey="geneRatio" stroke={s.axisColor} tick={{ fontSize: s.fontSize }}>
            <Label value="Gene Ratio" position="bottom" offset={15} fill={s.axisColor} fontSize={s.fontSize + 1} />
          </XAxis>
          <YAxis type="category" dataKey="term" stroke={s.axisColor} tick={{ fontSize: Math.max(7, s.fontSize - 2) }} width={140} />
          <Tooltip contentStyle={ttStyle(s)}
            formatter={(val: number, name: string) => { if (name === "negLog10P") return [val.toFixed(2), "-log₁₀(p)"]; if (name === "geneRatio") return [val.toFixed(3), "Gene Ratio"]; return [val, name]; }} />
          <Scatter data={data} shape="circle">
            {data.map((entry, i) => {
              const t = maxCount === minCount ? 0.5 : (entry.count - minCount) / (maxCount - minCount);
              const size = 6 + t * 14;
              const maxP = Math.max(...data.map((d) => d.negLog10P));
              const minP = Math.min(...data.map((d) => d.negLog10P));
              const pt = maxP === minP ? 0.5 : (entry.negLog10P - minP) / (maxP - minP);
              // Interpolate between secondaryColor and primaryColor
              const loR = parseInt(s.secondaryColor.slice(1, 3), 16), loG = parseInt(s.secondaryColor.slice(3, 5), 16), loB = parseInt(s.secondaryColor.slice(5, 7), 16);
              const hiR = parseInt(s.primaryColor.slice(1, 3), 16), hiG = parseInt(s.primaryColor.slice(3, 5), 16), hiB = parseInt(s.primaryColor.slice(5, 7), 16);
              const r = Math.round(loR + pt * (hiR - loR)), g = Math.round(loG + pt * (hiG - loG)), b = Math.round(loB + pt * (hiB - loB));
              return <Cell key={i} fill={`rgb(${r},${g},${b})`} fillOpacity={0.85} r={size} />;
            })}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-6 mt-2">
        <span className="text-slate-400" style={{ fontSize: s.fontSize }}>Bubble size = Gene Count</span>
        <span className="text-slate-400" style={{ fontSize: s.fontSize }}>Color: <span style={{ color: s.secondaryColor }}>low</span> → <span style={{ color: s.primaryColor }}>high</span> significance</span>
      </div>
    </div>
  );
}
