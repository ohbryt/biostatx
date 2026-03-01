"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ScatterChart, Scatter, Line, LineChart,
  ResponsiveContainer, ErrorBar, Cell, ReferenceLine,
  Legend, Area, AreaChart,
} from "recharts";

const COLORS = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ec4899"];

const chartTheme = {
  bg: "rgba(15, 23, 42, 0.8)",
  grid: "rgba(148, 163, 184, 0.07)",
  axis: "#475569",
  text: "#94a3b8",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 shadow-xl text-xs">
      <p className="text-slate-400 mb-1">{label}</p>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color || entry.fill }}>
          {entry.name}: <span className="font-bold">{typeof entry.value === "number" ? entry.value.toFixed(4) : entry.value}</span>
        </p>
      ))}
    </div>
  );
};

/* ═══ Group Comparison Bar Chart (T-Test / ANOVA) ═══ */
interface GroupBarData {
  name: string;
  mean: number;
  sem: number;
  color?: string;
}

export function GroupComparisonChart({
  data,
  title = "Group Comparison",
  yLabel = "Mean ± SEM",
}: {
  data: GroupBarData[];
  title?: string;
  yLabel?: string;
}) {
  const maxVal = Math.max(...data.map((d) => d.mean + d.sem));
  const minVal = Math.min(...data.map((d) => d.mean - d.sem));
  const padding = (maxVal - minVal) * 0.3;

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">{title}</h3>
        <span className="text-xs text-stone-500">Publication-ready</span>
      </div>
      <div className="bg-[rgba(10,15,28,0.6)] rounded-xl p-4">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: chartTheme.text, fontSize: 12 }}
              axisLine={{ stroke: chartTheme.axis }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: chartTheme.text, fontSize: 11 }}
              axisLine={{ stroke: chartTheme.axis }}
              tickLine={false}
              domain={[Math.max(0, minVal - padding), maxVal + padding]}
              label={{ value: yLabel, angle: -90, position: "insideLeft", fill: chartTheme.text, fontSize: 11, dx: -5 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="mean" radius={[6, 6, 0, 0]} barSize={60}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color || COLORS[i % COLORS.length]} fillOpacity={0.85} />
              ))}
              <ErrorBar dataKey="sem" width={12} strokeWidth={2} stroke="#e2e8f0" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[10px] text-stone-500 mt-2 text-center">Error bars represent ± 1 SEM</p>
    </div>
  );
}

/* ═══ Dot Plot / Strip Chart ═══ */
interface DotPlotData {
  groups: { name: string; values: number[] }[];
}

export function DotPlotChart({ groups, title = "Data Distribution" }: DotPlotData & { title?: string }) {
  const scatterData = groups.flatMap((g, gi) =>
    g.values.map((v) => ({
      x: gi + 1,
      y: v,
      group: g.name,
    }))
  );

  const allVals = scatterData.map((d) => d.y);
  const minY = Math.min(...allVals);
  const maxY = Math.max(...allVals);
  const pad = (maxY - minY) * 0.15;

  return (
    <div className="glass-card p-6">
      <h3 className="font-semibold mb-4">{title}</h3>
      <div className="bg-[rgba(10,15,28,0.6)] rounded-xl p-4">
        <ResponsiveContainer width="100%" height={280}>
          <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
            <XAxis
              type="number"
              dataKey="x"
              domain={[0.5, groups.length + 0.5]}
              ticks={groups.map((_, i) => i + 1)}
              tickFormatter={(v: number) => groups[v - 1]?.name || ""}
              tick={{ fill: chartTheme.text, fontSize: 12 }}
              axisLine={{ stroke: chartTheme.axis }}
              tickLine={false}
            />
            <YAxis
              type="number"
              dataKey="y"
              domain={[minY - pad, maxY + pad]}
              tick={{ fill: chartTheme.text, fontSize: 11 }}
              axisLine={{ stroke: chartTheme.axis }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            {groups.map((g, gi) => (
              <Scatter
                key={g.name}
                name={g.name}
                data={scatterData.filter((d) => d.group === g.name)}
                fill={COLORS[gi % COLORS.length]}
                fillOpacity={0.8}
                r={5}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ═══ Scatter Plot with Regression (Correlation) ═══ */
interface ScatterData {
  x: number[];
  y: number[];
  r: number;
  rSquared: number;
}

export function CorrelationScatterChart({ x, y, r, rSquared }: ScatterData) {
  const points = x.map((xv, i) => ({ x: xv, y: y[i] }));

  // Linear regression for the line
  const n = x.length;
  const mx = x.reduce((s, v) => s + v, 0) / n;
  const my = y.reduce((s, v) => s + v, 0) / n;
  let ssxy = 0, ssx = 0;
  for (let i = 0; i < n; i++) {
    ssxy += (x[i] - mx) * (y[i] - my);
    ssx += (x[i] - mx) ** 2;
  }
  const slope = ssxy / ssx;
  const intercept = my - slope * mx;

  const xMin = Math.min(...x);
  const xMax = Math.max(...x);
  const lineData = [
    { x: xMin, y: slope * xMin + intercept },
    { x: xMax, y: slope * xMax + intercept },
  ];

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Scatter Plot</h3>
        <div className="flex gap-3 text-xs">
          <span className="text-blue-400">r = {r.toFixed(4)}</span>
          <span className="text-purple-400">R² = {rSquared.toFixed(4)}</span>
        </div>
      </div>
      <div className="bg-[rgba(10,15,28,0.6)] rounded-xl p-4">
        <ResponsiveContainer width="100%" height={350}>
          <ScatterChart margin={{ top: 10, right: 20, bottom: 30, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
            <XAxis
              type="number"
              dataKey="x"
              tick={{ fill: chartTheme.text, fontSize: 11 }}
              axisLine={{ stroke: chartTheme.axis }}
              tickLine={false}
              label={{ value: "Variable X", position: "bottom", fill: chartTheme.text, fontSize: 11, dy: 15 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              tick={{ fill: chartTheme.text, fontSize: 11 }}
              axisLine={{ stroke: chartTheme.axis }}
              tickLine={false}
              label={{ value: "Variable Y", angle: -90, position: "insideLeft", fill: chartTheme.text, fontSize: 11, dx: -5 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Scatter name="Data Points" data={points} fill="#3b82f6" fillOpacity={0.8} r={5} />
            <Scatter name="Regression" data={lineData} fill="none" line={{ stroke: "#f59e0b", strokeWidth: 2, strokeDasharray: "6 3" }} legendType="none" r={0} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[10px] text-stone-500 mt-2 text-center">
        y = {slope.toFixed(3)}x {intercept >= 0 ? "+" : ""} {intercept.toFixed(3)} &nbsp;|&nbsp; Dashed line = linear regression
      </p>
    </div>
  );
}

/* ═══ Kaplan-Meier Survival Curve ═══ */
interface SurvivalData {
  curve: { time: number; survival: number }[];
  medianSurvival: number | null;
}

export function SurvivalCurveChart({ curve, medianSurvival }: SurvivalData) {
  // Build step data for KM curve
  const stepData: { time: number; survival: number }[] = [{ time: 0, survival: 1 }];
  for (const pt of curve) {
    // horizontal line to this time at previous survival
    if (stepData.length > 0) {
      stepData.push({ time: pt.time, survival: stepData[stepData.length - 1].survival });
    }
    // vertical drop
    stepData.push({ time: pt.time, survival: pt.survival });
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Kaplan-Meier Survival Curve</h3>
        {medianSurvival !== null && (
          <span className="text-xs text-amber-400">Median: {medianSurvival}</span>
        )}
      </div>
      <div className="bg-[rgba(10,15,28,0.6)] rounded-xl p-4">
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={stepData} margin={{ top: 10, right: 20, bottom: 30, left: 20 }}>
            <defs>
              <linearGradient id="survGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
            <XAxis
              dataKey="time"
              tick={{ fill: chartTheme.text, fontSize: 11 }}
              axisLine={{ stroke: chartTheme.axis }}
              tickLine={false}
              label={{ value: "Time", position: "bottom", fill: chartTheme.text, fontSize: 11, dy: 15 }}
            />
            <YAxis
              domain={[0, 1]}
              ticks={[0, 0.25, 0.5, 0.75, 1.0]}
              tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
              tick={{ fill: chartTheme.text, fontSize: 11 }}
              axisLine={{ stroke: chartTheme.axis }}
              tickLine={false}
              label={{ value: "Survival Probability", angle: -90, position: "insideLeft", fill: chartTheme.text, fontSize: 11, dx: -5 }}
            />
            <Tooltip content={<CustomTooltip />} />
            {medianSurvival !== null && (
              <ReferenceLine y={0.5} stroke="#f59e0b" strokeDasharray="6 3" strokeWidth={1} />
            )}
            <Area type="stepAfter" dataKey="survival" stroke="#3b82f6" strokeWidth={2.5} fill="url(#survGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ═══ ANOVA Group Means Chart ═══ */
export function AnovaChart({
  groupMeans,
  groupStds,
  groupNs,
}: {
  groupMeans: number[];
  groupStds: number[];
  groupNs: number[];
}) {
  const data = groupMeans.map((m, i) => ({
    name: `Group ${i + 1}`,
    mean: parseFloat(m.toFixed(4)),
    sem: parseFloat((groupStds[i] / Math.sqrt(groupNs[i])).toFixed(4)),
    color: COLORS[i % COLORS.length],
  }));

  return <GroupComparisonChart data={data} title="Group Means Comparison" yLabel="Mean ± SEM" />;
}

export { COLORS };
