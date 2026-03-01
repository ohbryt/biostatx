"use client";

import { type ChartStyleConfig, downloadChartAsPNG, downloadChartAsSVG } from "@/lib/chartUtils";

interface ChartControlsProps {
  config: ChartStyleConfig;
  onChange: (config: ChartStyleConfig) => void;
  chartRef: React.RefObject<HTMLDivElement | null>;
  filename: string;
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-7 h-7 rounded border border-stone-200 cursor-pointer bg-transparent p-0"
      />
      <span className="text-xs text-stone-600">{label}</span>
    </label>
  );
}

export default function ChartControls({ config, onChange, chartRef, filename }: ChartControlsProps) {
  const set = <K extends keyof ChartStyleConfig>(key: K, val: ChartStyleConfig[K]) =>
    onChange({ ...config, [key]: val });

  return (
    <div className="glass-card p-4">
      <h3 className="text-sm font-semibold text-stone-700 mb-3">⚙️ Customize</h3>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <ColorInput label="Background" value={config.bgColor} onChange={(v) => set("bgColor", v)} />
        <ColorInput label="Grid" value={config.gridColor} onChange={(v) => set("gridColor", v)} />
        <ColorInput label="Primary" value={config.primaryColor} onChange={(v) => set("primaryColor", v)} />
        <ColorInput label="Secondary" value={config.secondaryColor} onChange={(v) => set("secondaryColor", v)} />
        <ColorInput label="Accent" value={config.accentColor} onChange={(v) => set("accentColor", v)} />
        <ColorInput label="Axis Text" value={config.axisColor} onChange={(v) => set("axisColor", v)} />
      </div>

      {/* Font Size */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-stone-600">Font Size</span>
          <span className="text-xs text-stone-400">{config.fontSize}px</span>
        </div>
        <input
          type="range"
          min={7}
          max={18}
          value={config.fontSize}
          onChange={(e) => set("fontSize", Number(e.target.value))}
          className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
        />
      </div>

      {/* Stroke Width */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-stone-600">Line Thickness</span>
          <span className="text-xs text-stone-400">{config.strokeWidth}px</span>
        </div>
        <input
          type="range"
          min={1}
          max={5}
          step={0.5}
          value={config.strokeWidth}
          onChange={(e) => set("strokeWidth", Number(e.target.value))}
          className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
        />
      </div>

      {/* Grid Toggle */}
      <label className="flex items-center gap-2 mb-4 cursor-pointer">
        <input
          type="checkbox"
          checked={config.showGrid}
          onChange={(e) => set("showGrid", e.target.checked)}
          className="w-4 h-4 rounded border-stone-300 text-orange-500 focus:ring-orange-400 accent-orange-500"
        />
        <span className="text-xs text-stone-600">Show Grid</span>
      </label>

      {/* Download Buttons */}
      <div className="border-t border-stone-200 pt-3">
        <p className="text-xs text-stone-500 mb-2 font-medium">📥 Download</p>
        <div className="flex gap-2">
          <button
            onClick={() => downloadChartAsPNG(chartRef.current, filename, config.bgColor)}
            className="flex-1 text-xs px-3 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition font-medium shadow-sm"
          >
            PNG (2x)
          </button>
          <button
            onClick={() => downloadChartAsSVG(chartRef.current, filename)}
            className="flex-1 text-xs px-3 py-2 rounded-lg border border-orange-300 text-orange-600 hover:bg-orange-50 transition font-medium"
          >
            SVG
          </button>
        </div>
      </div>
    </div>
  );
}
