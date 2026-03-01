"use client";

import { useState, useRef, useCallback } from "react";
import StatToolLayout from "@/components/StatToolLayout";
import DataSheet, { type ColumnDef } from "@/components/DataSheet";
import ChartControls from "@/components/ChartControls";
import { defaultChartConfig, type ChartStyleConfig } from "@/lib/chartUtils";
import {
  VolcanoPlot, Heatmap, PCAPlot, ROCCurve, BoxPlot, EnrichmentBubblePlot,
  type VolcanoPoint, type HeatmapData, type PCAPoint, type ROCPoint, type BoxPlotGroup, type EnrichmentTerm,
} from "@/components/BioPlotCharts";

/* ═══ Tab Config ═══ */
const tabs = [
  { id: "volcano", label: "Volcano", icon: "🌋" },
  { id: "heatmap", label: "Heatmap", icon: "🗺️" },
  { id: "pca", label: "PCA", icon: "📊" },
  { id: "roc", label: "ROC", icon: "📈" },
  { id: "boxplot", label: "Box Plot", icon: "📦" },
  { id: "enrichment", label: "Enrichment", icon: "🧬" },
] as const;
type TabId = (typeof tabs)[number]["id"];

/* ═══ Column Definitions per chart type ═══ */
const columnDefs: Record<TabId, ColumnDef[]> = {
  volcano: [{ key: "gene", label: "Gene" }, { key: "log2fc", label: "log₂FC" }, { key: "pvalue", label: "P-value" }],
  heatmap: [{ key: "gene", label: "Gene" }, { key: "s1", label: "Sample 1" }, { key: "s2", label: "Sample 2" }, { key: "s3", label: "Sample 3" }, { key: "s4", label: "Sample 4" }, { key: "s5", label: "Sample 5" }, { key: "s6", label: "Sample 6" }],
  pca: [{ key: "label", label: "Sample" }, { key: "pc1", label: "PC1" }, { key: "pc2", label: "PC2" }, { key: "group", label: "Group" }],
  roc: [{ key: "fpr", label: "FPR" }, { key: "tpr", label: "TPR" }],
  boxplot: [{ key: "name", label: "Group" }, { key: "min", label: "Min" }, { key: "q1", label: "Q1" }, { key: "median", label: "Median" }, { key: "q3", label: "Q3" }, { key: "max", label: "Max" }],
  enrichment: [{ key: "term", label: "Term" }, { key: "ratio", label: "Gene Ratio" }, { key: "pvalue", label: "P-value" }, { key: "count", label: "Count" }],
};

/* ═══ Example Data Generators ═══ */
function volcanoExampleRows(): Record<string, string>[] {
  const genes = [
    { g: "CCNE2", fc: 3.2, p: 3.2e-9 }, { g: "TOP2A", fc: 2.8, p: 6.3e-8 }, { g: "MKI67", fc: 2.5, p: 1.6e-7 },
    { g: "AURKA", fc: 2.1, p: 1.3e-6 }, { g: "CDK1", fc: 1.9, p: 6.3e-6 }, { g: "BIRC5", fc: 2.4, p: 7.9e-7 },
    { g: "ESR1", fc: -2.1, p: 6.3e-7 }, { g: "PGR", fc: -1.8, p: 7.9e-6 }, { g: "FOXA1", fc: -2.4, p: 1e-7 },
    { g: "GATA3", fc: -1.5, p: 5e-5 }, { g: "SCUBE2", fc: -2.6, p: 1.6e-8 },
    { g: "ACTB", fc: 0.1, p: 0.5 }, { g: "GAPDH", fc: -0.2, p: 0.3 }, { g: "RPL13A", fc: 0.3, p: 0.16 },
    { g: "B2M", fc: -0.4, p: 0.1 }, { g: "HMBS", fc: 0.5, p: 0.25 }, { g: "TBP", fc: -0.1, p: 0.63 },
  ];
  return genes.map((d) => ({ gene: d.g, log2fc: d.fc.toString(), pvalue: d.p.toExponential(2) }));
}

function heatmapExampleRows(): Record<string, string>[] {
  const data = [
    ["CCNE2", "3.2", "2.9", "3.5", "0.4", "0.2", "0.6"],
    ["TOP2A", "2.8", "3.1", "2.6", "0.5", "0.3", "0.7"],
    ["MKI67", "2.5", "2.7", "2.3", "0.3", "0.1", "0.4"],
    ["ESR1", "-2.1", "-1.8", "-2.3", "1.8", "2.1", "1.9"],
    ["PGR", "-1.8", "-1.5", "-2.0", "1.5", "1.8", "1.6"],
    ["FOXA1", "-2.4", "-2.1", "-2.6", "2.0", "2.3", "2.1"],
  ];
  return data.map((r) => ({ gene: r[0], s1: r[1], s2: r[2], s3: r[3], s4: r[4], s5: r[5], s6: r[6] }));
}

function pcaExampleRows(): Record<string, string>[] {
  return [
    { label: "T1", pc1: "12.3", pc2: "4.5", group: "Tumor" }, { label: "T2", pc1: "14.1", pc2: "3.2", group: "Tumor" },
    { label: "T3", pc1: "11.8", pc2: "5.8", group: "Tumor" }, { label: "T4", pc1: "13.5", pc2: "2.9", group: "Tumor" },
    { label: "N1", pc1: "-8.2", pc2: "-2.1", group: "Normal" }, { label: "N2", pc1: "-9.5", pc2: "-3.4", group: "Normal" },
    { label: "N3", pc1: "-7.8", pc2: "-1.5", group: "Normal" }, { label: "N4", pc1: "-10.1", pc2: "-2.8", group: "Normal" },
    { label: "M1", pc1: "3.1", pc2: "-8.2", group: "Metastatic" }, { label: "M2", pc1: "4.5", pc2: "-9.1", group: "Metastatic" },
  ];
}

function rocExampleRows(): Record<string, string>[] {
  const pts: Record<string, string>[] = [];
  for (let i = 0; i <= 20; i++) {
    const fpr = i / 20;
    const tpr = Math.min(1, Math.pow(fpr, 0.087)); // ~AUC 0.92
    pts.push({ fpr: fpr.toFixed(3), tpr: tpr.toFixed(3) });
  }
  return pts;
}

function boxExampleRows(): Record<string, string>[] {
  return [
    { name: "Normal", min: "1.2", q1: "2.8", median: "3.5", q3: "4.2", max: "5.8" },
    { name: "Stage I", min: "3.5", q1: "5.1", median: "6.2", q3: "7.8", max: "9.1" },
    { name: "Stage II", min: "5.2", q1: "7.3", median: "8.9", q3: "10.5", max: "12.8" },
    { name: "Stage III", min: "7.8", q1: "10.2", median: "12.1", q3: "14.5", max: "17.2" },
    { name: "Stage IV", min: "10.5", q1: "13.8", median: "16.2", q3: "18.9", max: "22.1" },
  ];
}

function enrichmentExampleRows(): Record<string, string>[] {
  return [
    { term: "Chromosome segregation", ratio: "0.18", pvalue: "3.2e-13", count: "28" },
    { term: "Cell cycle checkpoint", ratio: "0.15", pvalue: "6.3e-11", count: "22" },
    { term: "DNA replication", ratio: "0.14", pvalue: "1.6e-10", count: "20" },
    { term: "Mitotic spindle assembly", ratio: "0.12", pvalue: "3.2e-9", count: "18" },
    { term: "DNA damage response", ratio: "0.11", pvalue: "6.3e-8", count: "15" },
    { term: "Apoptotic signaling", ratio: "0.09", pvalue: "7.9e-7", count: "12" },
    { term: "Protein ubiquitination", ratio: "0.08", pvalue: "3.2e-6", count: "10" },
    { term: "mRNA processing", ratio: "0.07", pvalue: "6.3e-5", count: "8" },
  ];
}

function getDefaultRows(tab: TabId): Record<string, string>[] {
  switch (tab) {
    case "volcano": return volcanoExampleRows();
    case "heatmap": return heatmapExampleRows();
    case "pca": return pcaExampleRows();
    case "roc": return rocExampleRows();
    case "boxplot": return boxExampleRows();
    case "enrichment": return enrichmentExampleRows();
  }
}

/* ═══ Data Parsers ═══ */
function parseVolcano(rows: Record<string, string>[]): VolcanoPoint[] {
  return rows.filter((r) => r.gene).map((r) => ({
    gene: r.gene,
    log2FC: parseFloat(r.log2fc) || 0,
    negLog10P: -Math.log10(Math.max(1e-300, parseFloat(r.pvalue) || 1)),
  }));
}

function parseHeatmap(rows: Record<string, string>[]): HeatmapData {
  const cols = Object.keys(rows[0] || {}).filter((k) => k !== "gene");
  return {
    rows: rows.map((r) => r.gene || "?"),
    cols: cols.map((_, i) => `Sample ${i + 1}`),
    values: rows.map((r) => cols.map((c) => parseFloat(r[c]) || 0)),
  };
}

function parsePCA(rows: Record<string, string>[]): PCAPoint[] {
  return rows.filter((r) => r.label).map((r) => ({
    label: r.label, pc1: parseFloat(r.pc1) || 0, pc2: parseFloat(r.pc2) || 0, group: r.group || "Default",
  }));
}

function parseROC(rows: Record<string, string>[]): { name: string; data: ROCPoint[]; auc: number }[] {
  const pts = rows.map((r) => ({ fpr: parseFloat(r.fpr) || 0, tpr: parseFloat(r.tpr) || 0 })).sort((a, b) => a.fpr - b.fpr);
  // Trapezoidal AUC
  let auc = 0;
  for (let i = 1; i < pts.length; i++) auc += (pts[i].fpr - pts[i - 1].fpr) * (pts[i].tpr + pts[i - 1].tpr) / 2;
  return [{ name: "Biomarker", data: pts, auc }];
}

function parseBox(rows: Record<string, string>[]): BoxPlotGroup[] {
  return rows.filter((r) => r.name).map((r) => ({
    name: r.name, min: parseFloat(r.min) || 0, q1: parseFloat(r.q1) || 0,
    median: parseFloat(r.median) || 0, q3: parseFloat(r.q3) || 0, max: parseFloat(r.max) || 0,
  }));
}

function parseEnrichment(rows: Record<string, string>[]): EnrichmentTerm[] {
  return rows.filter((r) => r.term).map((r) => ({
    term: r.term, geneRatio: parseFloat(r.ratio) || 0,
    negLog10P: -Math.log10(Math.max(1e-300, parseFloat(r.pvalue) || 1)),
    count: parseInt(r.count) || 1,
  }));
}

/* ═══ Plot Info ═══ */
const plotInfo: Record<TabId, string> = {
  volcano: "Displays -log₁₀(p-value) vs log₂(fold change). Enter gene name, log₂FC, and raw p-value per row.",
  heatmap: "Expression matrix visualization. Rows = genes, columns = samples. Enter numeric expression values.",
  pca: "Sample clustering in PC space. Enter sample label, PC1, PC2, and group name.",
  roc: "Diagnostic performance curve. Enter FPR and TPR points (0–1). AUC is auto-calculated.",
  boxplot: "Distribution comparison. Enter group name with min, Q1, median, Q3, max statistics.",
  enrichment: "GO/pathway enrichment bubbles. Enter term name, gene ratio, raw p-value, and gene count.",
};

/* ═══ Main Component ═══ */
export default function BioPlotPage() {
  const [activeTab, setActiveTab] = useState<TabId>("volcano");
  const [config, setConfig] = useState<ChartStyleConfig>(defaultChartConfig);
  const [sheetData, setSheetData] = useState<Record<string, string>[]>(getDefaultRows("volcano"));
  const [showCustomize, setShowCustomize] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const switchTab = useCallback((tab: TabId) => {
    setActiveTab(tab);
    setSheetData(getDefaultRows(tab));
  }, []);

  const loadExample = useCallback(() => {
    setSheetData(getDefaultRows(activeTab));
  }, [activeTab]);

  /* Render the appropriate chart */
  const renderChart = () => {
    if (sheetData.length === 0) return <div className="rounded-xl p-12 text-center text-stone-400" style={{ background: config.bgColor }}>Enter data below to generate chart</div>;

    switch (activeTab) {
      case "volcano": {
        const d = parseVolcano(sheetData);
        return d.length > 0 ? <VolcanoPlot data={d} config={config} /> : null;
      }
      case "heatmap": {
        const d = parseHeatmap(sheetData);
        return d.rows.length > 0 ? <Heatmap data={d} config={config} /> : null;
      }
      case "pca": {
        const d = parsePCA(sheetData);
        return d.length > 0 ? <PCAPlot data={d} config={config} /> : null;
      }
      case "roc": {
        const curves = parseROC(sheetData);
        return curves[0].data.length > 1 ? <ROCCurve curves={curves} config={config} /> : null;
      }
      case "boxplot": {
        const d = parseBox(sheetData);
        return d.length > 0 ? <BoxPlot data={d} yLabel="Expression" config={config} /> : null;
      }
      case "enrichment": {
        const d = parseEnrichment(sheetData);
        return d.length > 0 ? <EnrichmentBubblePlot data={d} config={config} /> : null;
      }
    }
  };

  return (
    <StatToolLayout
      title="BioPlot — Bioinformatics Visualization"
      description="Publication-ready bioinformatics plots. Enter your data, customize colors and fonts, download as PNG or SVG."
    >
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => switchTab(tab.id)}
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id ? "bg-orange-500 text-white shadow-md shadow-orange-500/25" : "glass-card text-stone-600 hover:text-orange-600"
            }`}>
            <span className="mr-1">{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Info */}
      <p className="text-xs text-stone-500 mb-4 glass-card p-3">
        📄 <strong>Based on PlotGDP</strong> (bioRxiv 2026.01.31.702995v3) — {plotInfo[activeTab]}
      </p>

      {/* Chart + Customize: responsive layout */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        {/* Chart */}
        <div className="flex-1 min-w-0" ref={chartRef}>
          {renderChart()}
        </div>

        {/* Customize toggle (mobile) */}
        <button onClick={() => setShowCustomize(!showCustomize)}
          className="lg:hidden text-xs px-4 py-2 rounded-xl glass-card text-stone-600 font-medium">
          {showCustomize ? "▲ Hide Customize" : "⚙️ Customize & Download"}
        </button>

        {/* Customize Panel */}
        <div className={`lg:w-64 flex-shrink-0 ${showCustomize ? "block" : "hidden lg:block"}`}>
          <ChartControls config={config} onChange={setConfig} chartRef={chartRef} filename={`bioplot-${activeTab}`} />
        </div>
      </div>

      {/* Data Sheet */}
      <div className="mb-4">
        <DataSheet columns={columnDefs[activeTab]} data={sheetData} onChange={setSheetData} onLoadExample={loadExample} />
      </div>

      {/* Interpretation footer */}
      <div className="glass-card p-4">
        <p className="text-xs text-stone-500 leading-relaxed">
          <strong className="text-stone-700">💡 Tips:</strong>{" "}
          Paste data from Excel/Sheets directly into the table above. Use the customize panel to change colors, fonts, and download publication-ready figures.
          All charts are responsive and auto-scale to your screen size.
        </p>
      </div>
    </StatToolLayout>
  );
}
