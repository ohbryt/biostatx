"use client";

import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, AreaChart, Area, LineChart, Line,
  BarChart, Bar, ErrorBar, Legend, ReferenceLine, Label
} from "recharts";

/* ═══════════════════════════════════════════
   Shared theme
   ═══════════════════════════════════════════ */
const theme = {
  bg: "#1e1e2e",
  grid: "#2a2a3e",
  axis: "#94a3b8",
  tooltip: { bg: "#1e1e2e", border: "#334155", color: "#e2e8f0" },
};

/* ═══════════════════════════════════════════
   1. VOLCANO PLOT
   ═══════════════════════════════════════════ */
export interface VolcanoPoint {
  gene: string;
  log2FC: number;
  negLog10P: number;
}

interface VolcanoPlotProps {
  data: VolcanoPoint[];
  fcThreshold?: number;
  pThreshold?: number;
  title?: string;
}

export function VolcanoPlot({ data, fcThreshold = 1, pThreshold = 1.3, title = "Volcano Plot" }: VolcanoPlotProps) {
  const getColor = (p: VolcanoPoint) => {
    if (p.negLog10P < pThreshold) return "#6b7280"; // NS
    if (p.log2FC > fcThreshold) return "#ef4444";   // Up
    if (p.log2FC < -fcThreshold) return "#3b82f6";  // Down
    return "#6b7280";
  };

  return (
    <div className="chart-area rounded-xl p-4">
      <h4 className="text-sm font-semibold text-slate-200 mb-1 text-center">{title}</h4>
      <div className="flex justify-center gap-4 mb-2">
        <span className="text-[10px] text-slate-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Upregulated</span>
        <span className="text-[10px] text-slate-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Downregulated</span>
        <span className="text-[10px] text-slate-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-500 inline-block" /> Not Significant</span>
      </div>
      <ResponsiveContainer width="100%" height={360}>
        <ScatterChart margin={{ top: 10, right: 20, bottom: 30, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
          <XAxis type="number" dataKey="log2FC" stroke={theme.axis} tick={{ fontSize: 10 }} name="log₂(FC)">
            <Label value="log₂(Fold Change)" position="bottom" offset={15} fill={theme.axis} fontSize={11} />
          </XAxis>
          <YAxis type="number" dataKey="negLog10P" stroke={theme.axis} tick={{ fontSize: 10 }} name="-log₁₀(p)">
            <Label value="-log₁₀(p-value)" angle={-90} position="insideLeft" offset={0} fill={theme.axis} fontSize={11} />
          </YAxis>
          <ReferenceLine x={fcThreshold} stroke="#ef444480" strokeDasharray="4 4" />
          <ReferenceLine x={-fcThreshold} stroke="#3b82f680" strokeDasharray="4 4" />
          <ReferenceLine y={pThreshold} stroke="#eab30880" strokeDasharray="4 4" />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            contentStyle={{ background: theme.tooltip.bg, border: `1px solid ${theme.tooltip.border}`, borderRadius: 8, color: theme.tooltip.color, fontSize: 11 }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(_: any, name: any, props: any) => {
              const p = props?.payload as VolcanoPoint | undefined;
              if (!p) return [String(_), String(name)];
              if (name === "negLog10P") return [`${p.negLog10P.toFixed(2)}`, `-log₁₀(p)`];
              return [`${p.log2FC.toFixed(2)}`, `log₂(FC)`];
            }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            labelFormatter={(_: any, payload: any) => (payload as any)?.[0]?.payload?.gene || ""}
          />
          <Scatter data={data} shape="circle">
            {data.map((entry, i) => (
              <Cell key={i} fill={getColor(entry)} fillOpacity={0.7} r={3} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ═══════════════════════════════════════════
   2. HEATMAP (Custom SVG)
   ═══════════════════════════════════════════ */
export interface HeatmapData {
  rows: string[];
  cols: string[];
  values: number[][]; // rows x cols
}

interface HeatmapProps {
  data: HeatmapData;
  title?: string;
}

function heatColor(val: number, min: number, max: number): string {
  const t = max === min ? 0.5 : (val - min) / (max - min);
  // Blue → White → Red
  if (t < 0.5) {
    const s = t * 2;
    const r = Math.round(59 + s * (255 - 59));
    const g = Math.round(130 + s * (255 - 130));
    const b = Math.round(246 + s * (255 - 246));
    return `rgb(${r},${g},${b})`;
  } else {
    const s = (t - 0.5) * 2;
    const r = Math.round(255 - s * (255 - 239));
    const g = Math.round(255 - s * (255 - 68));
    const b = Math.round(255 - s * (255 - 68));
    return `rgb(${r},${g},${b})`;
  }
}

export function Heatmap({ data, title = "Expression Heatmap" }: HeatmapProps) {
  const cellW = Math.min(50, Math.max(20, 400 / data.cols.length));
  const cellH = Math.min(30, Math.max(16, 300 / data.rows.length));
  const labelW = 80;
  const topLabelH = 60;
  const legendW = 60;
  const svgW = labelW + data.cols.length * cellW + legendW + 10;
  const svgH = topLabelH + data.rows.length * cellH + 10;

  const allVals = data.values.flat();
  const min = Math.min(...allVals);
  const max = Math.max(...allVals);

  return (
    <div className="chart-area rounded-xl p-4">
      <h4 className="text-sm font-semibold text-slate-200 mb-3 text-center">{title}</h4>
      <div className="overflow-x-auto flex justify-center">
        <svg width={svgW} height={svgH} className="mx-auto">
          {/* Column labels */}
          {data.cols.map((col, ci) => (
            <text
              key={`cl-${ci}`}
              x={labelW + ci * cellW + cellW / 2}
              y={topLabelH - 5}
              textAnchor="end"
              transform={`rotate(-45, ${labelW + ci * cellW + cellW / 2}, ${topLabelH - 5})`}
              fill="#94a3b8"
              fontSize={9}
            >
              {col}
            </text>
          ))}
          {/* Row labels + cells */}
          {data.rows.map((row, ri) => (
            <g key={`r-${ri}`}>
              <text
                x={labelW - 5}
                y={topLabelH + ri * cellH + cellH / 2 + 3}
                textAnchor="end"
                fill="#94a3b8"
                fontSize={9}
              >
                {row}
              </text>
              {data.cols.map((_, ci) => (
                <rect
                  key={`c-${ri}-${ci}`}
                  x={labelW + ci * cellW}
                  y={topLabelH + ri * cellH}
                  width={cellW - 1}
                  height={cellH - 1}
                  fill={heatColor(data.values[ri][ci], min, max)}
                  rx={2}
                >
                  <title>{`${row} × ${data.cols[ci]}: ${data.values[ri][ci].toFixed(2)}`}</title>
                </rect>
              ))}
            </g>
          ))}
          {/* Legend */}
          <defs>
            <linearGradient id="heatLegend" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="rgb(59,130,246)" />
              <stop offset="50%" stopColor="rgb(255,255,255)" />
              <stop offset="100%" stopColor="rgb(239,68,68)" />
            </linearGradient>
          </defs>
          <rect
            x={labelW + data.cols.length * cellW + 15}
            y={topLabelH}
            width={12}
            height={data.rows.length * cellH}
            fill="url(#heatLegend)"
            rx={3}
          />
          <text x={labelW + data.cols.length * cellW + 32} y={topLabelH + 8} fill="#94a3b8" fontSize={8}>{max.toFixed(1)}</text>
          <text x={labelW + data.cols.length * cellW + 32} y={topLabelH + data.rows.length * cellH} fill="#94a3b8" fontSize={8}>{min.toFixed(1)}</text>
        </svg>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   3. PCA PLOT
   ═══════════════════════════════════════════ */
export interface PCAPoint {
  label: string;
  pc1: number;
  pc2: number;
  group: string;
}

interface PCAPlotProps {
  data: PCAPoint[];
  pc1Var?: number;
  pc2Var?: number;
  title?: string;
}

const groupColors = ["#f97316", "#3b82f6", "#10b981", "#a855f7", "#ef4444", "#eab308"];

export function PCAPlot({ data, pc1Var = 45.2, pc2Var = 18.7, title = "PCA Plot" }: PCAPlotProps) {
  const groups = [...new Set(data.map((d) => d.group))];

  return (
    <div className="chart-area rounded-xl p-4">
      <h4 className="text-sm font-semibold text-slate-200 mb-1 text-center">{title}</h4>
      <div className="flex justify-center gap-4 mb-2">
        {groups.map((g, i) => (
          <span key={g} className="text-[10px] text-slate-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: groupColors[i % groupColors.length] }} /> {g}
          </span>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={360}>
        <ScatterChart margin={{ top: 10, right: 20, bottom: 30, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
          <XAxis type="number" dataKey="pc1" stroke={theme.axis} tick={{ fontSize: 10 }}>
            <Label value={`PC1 (${pc1Var}%)`} position="bottom" offset={15} fill={theme.axis} fontSize={11} />
          </XAxis>
          <YAxis type="number" dataKey="pc2" stroke={theme.axis} tick={{ fontSize: 10 }}>
            <Label value={`PC2 (${pc2Var}%)`} angle={-90} position="insideLeft" offset={0} fill={theme.axis} fontSize={11} />
          </YAxis>
          <Tooltip
            contentStyle={{ background: theme.tooltip.bg, border: `1px solid ${theme.tooltip.border}`, borderRadius: 8, color: theme.tooltip.color, fontSize: 11 }}
            formatter={(val: number) => val.toFixed(2)}
          />
          {groups.map((g, gi) => (
            <Scatter
              key={g}
              name={g}
              data={data.filter((d) => d.group === g)}
              fill={groupColors[gi % groupColors.length]}
              fillOpacity={0.8}
              shape="circle"
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ═══════════════════════════════════════════
   4. ROC CURVE
   ═══════════════════════════════════════════ */
export interface ROCPoint {
  fpr: number;
  tpr: number;
}

interface ROCCurveProps {
  curves: { name: string; data: ROCPoint[]; auc: number }[];
  title?: string;
}

const rocColors = ["#f97316", "#3b82f6", "#10b981", "#a855f7", "#ef4444"];

export function ROCCurve({ curves, title = "ROC Curve" }: ROCCurveProps) {
  return (
    <div className="chart-area rounded-xl p-4">
      <h4 className="text-sm font-semibold text-slate-200 mb-1 text-center">{title}</h4>
      <div className="flex justify-center gap-4 mb-2 flex-wrap">
        {curves.map((c, i) => (
          <span key={c.name} className="text-[10px] text-slate-400 flex items-center gap-1">
            <span className="w-3 h-0.5 inline-block" style={{ background: rocColors[i % rocColors.length] }} />
            {c.name} (AUC={c.auc.toFixed(3)})
          </span>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={360}>
        <AreaChart margin={{ top: 10, right: 20, bottom: 30, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
          <XAxis type="number" dataKey="fpr" domain={[0, 1]} stroke={theme.axis} tick={{ fontSize: 10 }}>
            <Label value="False Positive Rate (1 - Specificity)" position="bottom" offset={15} fill={theme.axis} fontSize={11} />
          </XAxis>
          <YAxis type="number" domain={[0, 1]} stroke={theme.axis} tick={{ fontSize: 10 }}>
            <Label value="True Positive Rate (Sensitivity)" angle={-90} position="insideLeft" offset={0} fill={theme.axis} fontSize={11} />
          </YAxis>
          <Tooltip
            contentStyle={{ background: theme.tooltip.bg, border: `1px solid ${theme.tooltip.border}`, borderRadius: 8, color: theme.tooltip.color, fontSize: 11 }}
          />
          <ReferenceLine
            segment={[{ x: 0, y: 0 }, { x: 1, y: 1 }]}
            stroke="#475569"
            strokeDasharray="6 4"
          />
          {curves.map((c, i) => (
            <Area
              key={c.name}
              data={c.data}
              type="monotone"
              dataKey="tpr"
              stroke={rocColors[i % rocColors.length]}
              fill={rocColors[i % rocColors.length]}
              fillOpacity={0.08}
              strokeWidth={2}
              dot={false}
              name={c.name}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ═══════════════════════════════════════════
   5. BOX PLOT (simulated with ComposedChart)
   ═══════════════════════════════════════════ */
export interface BoxPlotGroup {
  name: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers?: number[];
}

interface BoxPlotProps {
  data: BoxPlotGroup[];
  yLabel?: string;
  title?: string;
}

export function BoxPlot({ data, yLabel = "Value", title = "Box Plot" }: BoxPlotProps) {
  const barData = data.map((d) => ({
    name: d.name,
    base: d.q1,
    iqr: d.q3 - d.q1,
    median: d.median,
    min: d.min,
    max: d.max,
    whiskerLow: [d.q1 - d.min, 0] as [number, number],
    whiskerHigh: [0, d.max - d.q3] as [number, number],
  }));

  return (
    <div className="chart-area rounded-xl p-4">
      <h4 className="text-sm font-semibold text-slate-200 mb-3 text-center">{title}</h4>
      <ResponsiveContainer width="100%" height={360}>
        <BarChart data={barData} margin={{ top: 10, right: 20, bottom: 30, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
          <XAxis dataKey="name" stroke={theme.axis} tick={{ fontSize: 10 }} />
          <YAxis stroke={theme.axis} tick={{ fontSize: 10 }}>
            <Label value={yLabel} angle={-90} position="insideLeft" offset={0} fill={theme.axis} fontSize={11} />
          </YAxis>
          <Tooltip
            contentStyle={{ background: theme.tooltip.bg, border: `1px solid ${theme.tooltip.border}`, borderRadius: 8, color: theme.tooltip.color, fontSize: 11 }}
            formatter={(val: number, name: string) => {
              if (name === "base") return [null, null];
              return [val.toFixed(2), "IQR"];
            }}
          />
          {/* Invisible base */}
          <Bar dataKey="base" stackId="box" fill="transparent" />
          {/* IQR box */}
          <Bar dataKey="iqr" stackId="box" fill="#f9731640" stroke="#f97316" strokeWidth={1.5} radius={[4, 4, 4, 4]}>
            <ErrorBar dataKey="whiskerLow" direction="y" width={8} stroke="#f97316" strokeWidth={1} />
            <ErrorBar dataKey="whiskerHigh" direction="y" width={8} stroke="#f97316" strokeWidth={1} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-[10px] text-stone-500 mt-2 text-center">Whiskers: min–max | Box: Q1–Q3 | Orange: IQR</p>
    </div>
  );
}

/* ═══════════════════════════════════════════
   6. ENRICHMENT BUBBLE PLOT
   ═══════════════════════════════════════════ */
export interface EnrichmentTerm {
  term: string;
  geneRatio: number;
  negLog10P: number;
  count: number;
}

interface EnrichmentPlotProps {
  data: EnrichmentTerm[];
  title?: string;
}

export function EnrichmentBubblePlot({ data, title = "GO Enrichment Analysis" }: EnrichmentPlotProps) {
  const maxCount = Math.max(...data.map((d) => d.count));
  const minCount = Math.min(...data.map((d) => d.count));

  return (
    <div className="chart-area rounded-xl p-4">
      <h4 className="text-sm font-semibold text-slate-200 mb-3 text-center">{title}</h4>
      <ResponsiveContainer width="100%" height={380}>
        <ScatterChart margin={{ top: 10, right: 30, bottom: 30, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
          <XAxis type="number" dataKey="geneRatio" stroke={theme.axis} tick={{ fontSize: 10 }}>
            <Label value="Gene Ratio" position="bottom" offset={15} fill={theme.axis} fontSize={11} />
          </XAxis>
          <YAxis
            type="category"
            dataKey="term"
            stroke={theme.axis}
            tick={{ fontSize: 8 }}
            width={140}
          />
          <Tooltip
            contentStyle={{ background: theme.tooltip.bg, border: `1px solid ${theme.tooltip.border}`, borderRadius: 8, color: theme.tooltip.color, fontSize: 11 }}
            formatter={(val: number, name: string) => {
              if (name === "negLog10P") return [val.toFixed(2), "-log₁₀(p)"];
              if (name === "geneRatio") return [val.toFixed(3), "Gene Ratio"];
              return [val, name];
            }}
          />
          <Scatter data={data} shape="circle">
            {data.map((entry, i) => {
              const t = maxCount === minCount ? 0.5 : (entry.count - minCount) / (maxCount - minCount);
              const size = 6 + t * 14;
              // Color: low p = orange, high p = blue
              const maxP = Math.max(...data.map((d) => d.negLog10P));
              const minP = Math.min(...data.map((d) => d.negLog10P));
              const pt = maxP === minP ? 0.5 : (entry.negLog10P - minP) / (maxP - minP);
              const r = Math.round(59 + pt * (249 - 59));
              const g = Math.round(130 + pt * (115 - 130));
              const b = Math.round(246 + pt * (22 - 246));
              return <Cell key={i} fill={`rgb(${r},${g},${b})`} fillOpacity={0.85} r={size} />;
            })}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-6 mt-2">
        <span className="text-[10px] text-slate-400">Bubble size = Gene Count</span>
        <span className="text-[10px] text-slate-400">Color: <span className="text-blue-400">low significance</span> → <span className="text-orange-400">high significance</span></span>
      </div>
    </div>
  );
}
