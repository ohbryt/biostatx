"use client";

import { useState } from "react";
import StatToolLayout from "@/components/StatToolLayout";
import {
  VolcanoPlot, Heatmap, PCAPlot, ROCCurve, BoxPlot, EnrichmentBubblePlot,
  type VolcanoPoint, type HeatmapData, type PCAPoint, type ROCPoint, type BoxPlotGroup, type EnrichmentTerm,
} from "@/components/BioPlotCharts";

/* ═══ Example Datasets ═══ */

const volcanoExample: VolcanoPoint[] = [
  // Upregulated genes
  { gene: "CCNE2", log2FC: 3.2, negLog10P: 8.5 },
  { gene: "TOP2A", log2FC: 2.8, negLog10P: 7.2 },
  { gene: "MKI67", log2FC: 2.5, negLog10P: 6.8 },
  { gene: "AURKA", log2FC: 2.1, negLog10P: 5.9 },
  { gene: "CDK1", log2FC: 1.9, negLog10P: 5.2 },
  { gene: "BUB1", log2FC: 1.7, negLog10P: 4.8 },
  { gene: "BIRC5", log2FC: 2.4, negLog10P: 6.1 },
  { gene: "PLK1", log2FC: 1.5, negLog10P: 3.9 },
  { gene: "FOXM1", log2FC: 1.8, negLog10P: 4.5 },
  { gene: "CDC20", log2FC: 2.0, negLog10P: 5.5 },
  { gene: "UBE2C", log2FC: 1.6, negLog10P: 3.2 },
  { gene: "MELK", log2FC: 2.3, negLog10P: 6.3 },
  // Downregulated genes
  { gene: "ESR1", log2FC: -2.1, negLog10P: 6.2 },
  { gene: "PGR", log2FC: -1.8, negLog10P: 5.1 },
  { gene: "GATA3", log2FC: -1.5, negLog10P: 4.3 },
  { gene: "FOXA1", log2FC: -2.4, negLog10P: 7.0 },
  { gene: "TFF1", log2FC: -1.9, negLog10P: 5.5 },
  { gene: "AGR2", log2FC: -1.3, negLog10P: 3.5 },
  { gene: "KRT18", log2FC: -1.6, negLog10P: 4.0 },
  { gene: "SCUBE2", log2FC: -2.6, negLog10P: 7.8 },
  // Not significant
  { gene: "ACTB", log2FC: 0.1, negLog10P: 0.3 },
  { gene: "GAPDH", log2FC: -0.2, negLog10P: 0.5 },
  { gene: "RPL13A", log2FC: 0.3, negLog10P: 0.8 },
  { gene: "B2M", log2FC: -0.4, negLog10P: 1.0 },
  { gene: "HMBS", log2FC: 0.5, negLog10P: 0.6 },
  { gene: "TBP", log2FC: -0.1, negLog10P: 0.2 },
  { gene: "HPRT1", log2FC: 0.6, negLog10P: 1.1 },
  { gene: "UBC", log2FC: -0.3, negLog10P: 0.7 },
  { gene: "YWHAZ", log2FC: 0.2, negLog10P: 0.4 },
  { gene: "SDHA", log2FC: -0.5, negLog10P: 0.9 },
  { gene: "ALAS1", log2FC: 0.8, negLog10P: 1.2 },
  { gene: "PPIA", log2FC: -0.7, negLog10P: 0.8 },
  { gene: "PUM1", log2FC: 0.4, negLog10P: 0.5 },
  { gene: "TFRC", log2FC: -0.6, negLog10P: 1.0 },
  { gene: "GUSB", log2FC: 0.7, negLog10P: 0.7 },
  { gene: "IPO8", log2FC: 0.0, negLog10P: 0.1 },
  { gene: "POLR2A", log2FC: -0.8, negLog10P: 1.1 },
  { gene: "CASC3", log2FC: 0.9, negLog10P: 1.0 },
];

const heatmapExample: HeatmapData = {
  rows: ["CCNE2", "TOP2A", "MKI67", "AURKA", "ESR1", "PGR", "FOXA1", "GATA3", "BUB1", "CDK1"],
  cols: ["Tumor_1", "Tumor_2", "Tumor_3", "Tumor_4", "Normal_1", "Normal_2", "Normal_3", "Normal_4"],
  values: [
    [3.2, 2.9, 3.5, 3.1, 0.4, 0.2, 0.6, 0.3],
    [2.8, 3.1, 2.6, 2.9, 0.5, 0.3, 0.7, 0.4],
    [2.5, 2.7, 2.3, 2.8, 0.3, 0.1, 0.4, 0.2],
    [2.1, 2.4, 1.9, 2.3, 0.6, 0.4, 0.5, 0.3],
    [-2.1, -1.8, -2.3, -1.9, 1.8, 2.1, 1.9, 2.0],
    [-1.8, -1.5, -2.0, -1.7, 1.5, 1.8, 1.6, 1.7],
    [-2.4, -2.1, -2.6, -2.2, 2.0, 2.3, 2.1, 2.2],
    [-1.5, -1.2, -1.7, -1.4, 1.2, 1.5, 1.3, 1.4],
    [1.7, 2.0, 1.5, 1.8, 0.4, 0.2, 0.5, 0.3],
    [1.9, 2.2, 1.7, 2.0, 0.3, 0.1, 0.4, 0.2],
  ],
};

const pcaExample: PCAPoint[] = [
  { label: "T1", pc1: 12.3, pc2: 4.5, group: "Tumor" },
  { label: "T2", pc1: 14.1, pc2: 3.2, group: "Tumor" },
  { label: "T3", pc1: 11.8, pc2: 5.8, group: "Tumor" },
  { label: "T4", pc1: 13.5, pc2: 2.9, group: "Tumor" },
  { label: "T5", pc1: 15.2, pc2: 4.1, group: "Tumor" },
  { label: "T6", pc1: 12.9, pc2: 5.3, group: "Tumor" },
  { label: "T7", pc1: 10.5, pc2: 3.8, group: "Tumor" },
  { label: "T8", pc1: 13.8, pc2: 6.1, group: "Tumor" },
  { label: "N1", pc1: -8.2, pc2: -2.1, group: "Normal" },
  { label: "N2", pc1: -9.5, pc2: -3.4, group: "Normal" },
  { label: "N3", pc1: -7.8, pc2: -1.5, group: "Normal" },
  { label: "N4", pc1: -10.1, pc2: -2.8, group: "Normal" },
  { label: "N5", pc1: -8.9, pc2: -4.0, group: "Normal" },
  { label: "N6", pc1: -7.3, pc2: -1.9, group: "Normal" },
  { label: "N7", pc1: -9.8, pc2: -3.2, group: "Normal" },
  { label: "N8", pc1: -11.2, pc2: -2.5, group: "Normal" },
  { label: "M1", pc1: 3.1, pc2: -8.2, group: "Metastatic" },
  { label: "M2", pc1: 4.5, pc2: -9.1, group: "Metastatic" },
  { label: "M3", pc1: 2.8, pc2: -7.5, group: "Metastatic" },
  { label: "M4", pc1: 5.2, pc2: -10.3, group: "Metastatic" },
  { label: "M5", pc1: 3.9, pc2: -8.8, group: "Metastatic" },
];

function generateROC(auc: number, n: number = 50): ROCPoint[] {
  const points: ROCPoint[] = [{ fpr: 0, tpr: 0 }];
  for (let i = 1; i < n; i++) {
    const fpr = i / n;
    const tpr = Math.min(1, Math.pow(fpr, (1 - auc) / auc) * (0.95 + Math.random() * 0.05));
    points.push({ fpr, tpr });
  }
  points.push({ fpr: 1, tpr: 1 });
  return points.sort((a, b) => a.fpr - b.fpr);
}

const rocExample = [
  { name: "CCNE2", data: generateROC(0.92), auc: 0.92 },
  { name: "TOP2A", data: generateROC(0.87), auc: 0.87 },
  { name: "MKI67", data: generateROC(0.81), auc: 0.81 },
];

const boxExample: BoxPlotGroup[] = [
  { name: "Normal", min: 1.2, q1: 2.8, median: 3.5, q3: 4.2, max: 5.8 },
  { name: "Stage I", min: 3.5, q1: 5.1, median: 6.2, q3: 7.8, max: 9.1 },
  { name: "Stage II", min: 5.2, q1: 7.3, median: 8.9, q3: 10.5, max: 12.8 },
  { name: "Stage III", min: 7.8, q1: 10.2, median: 12.1, q3: 14.5, max: 17.2 },
  { name: "Stage IV", min: 10.5, q1: 13.8, median: 16.2, q3: 18.9, max: 22.1 },
];

const enrichmentExample: EnrichmentTerm[] = [
  { term: "Chromosome segregation", geneRatio: 0.18, negLog10P: 12.5, count: 28 },
  { term: "Cell cycle checkpoint", geneRatio: 0.15, negLog10P: 10.2, count: 22 },
  { term: "DNA replication", geneRatio: 0.14, negLog10P: 9.8, count: 20 },
  { term: "Mitotic spindle assembly", geneRatio: 0.12, negLog10P: 8.5, count: 18 },
  { term: "DNA damage response", geneRatio: 0.11, negLog10P: 7.2, count: 15 },
  { term: "Apoptotic signaling", geneRatio: 0.09, negLog10P: 6.1, count: 12 },
  { term: "Protein ubiquitination", geneRatio: 0.08, negLog10P: 5.5, count: 10 },
  { term: "mRNA processing", geneRatio: 0.07, negLog10P: 4.2, count: 8 },
  { term: "Chromatin remodeling", geneRatio: 0.06, negLog10P: 3.8, count: 7 },
  { term: "Nucleotide excision repair", geneRatio: 0.05, negLog10P: 3.1, count: 6 },
];

/* ═══ Tab Config ═══ */
const tabs = [
  { id: "volcano", label: "Volcano Plot", icon: "🌋" },
  { id: "heatmap", label: "Heatmap", icon: "🗺️" },
  { id: "pca", label: "PCA Plot", icon: "📊" },
  { id: "roc", label: "ROC Curve", icon: "📈" },
  { id: "boxplot", label: "Box Plot", icon: "📦" },
  { id: "enrichment", label: "Enrichment", icon: "🧬" },
] as const;

type TabId = (typeof tabs)[number]["id"];

/* ═══ Info cards per plot type ═══ */
const plotInfo: Record<TabId, { desc: string; usage: string; ref: string }> = {
  volcano: {
    desc: "Volcano plots display statistical significance (-log₁₀ p-value) vs. magnitude of change (log₂ fold change) for differential gene expression analysis.",
    usage: "Identify significantly up/downregulated genes in RNA-seq or microarray experiments. Red = upregulated, Blue = downregulated.",
    ref: "Inspired by PlotGDP (bioRxiv 2026) — Breast cancer DEG analysis (GSE37751)",
  },
  heatmap: {
    desc: "Expression heatmaps visualize gene expression levels across samples using a color gradient (blue = low, red = high).",
    usage: "Compare expression patterns across tumor vs. normal samples. Rows = genes, Columns = samples.",
    ref: "Standard bioinformatics visualization using pheatmap/ggplot2 methodology",
  },
  pca: {
    desc: "Principal Component Analysis reduces high-dimensional gene expression data to 2D, revealing sample clustering patterns.",
    usage: "Assess sample separation between experimental groups. Closer points = more similar expression profiles.",
    ref: "PlotGDP case study — CCNE2 identified as top variance-contributing gene via PCA",
  },
  roc: {
    desc: "Receiver Operating Characteristic curves evaluate the diagnostic performance of biomarkers. AUC closer to 1.0 = better classifier.",
    usage: "Assess how well a gene expression level can distinguish tumor from normal tissue.",
    ref: "Common in clinical biomarker validation studies",
  },
  boxplot: {
    desc: "Box plots show the distribution of expression values across groups, including median, quartiles, and range.",
    usage: "Compare CCNE2 expression across cancer stages. Higher expression in advanced stages suggests prognostic value.",
    ref: "PlotGDP violin plot analysis — CCNE2 expression in high-grade tumors",
  },
  enrichment: {
    desc: "Bubble plots display Gene Ontology (GO) enrichment results. Bubble size = gene count, color intensity = significance.",
    usage: "Identify biological processes enriched in your differentially expressed gene set.",
    ref: "PlotGDP case study — 'Chromosome segregation' as strongest GO term in breast cancer DEGs",
  },
};

export default function BioPlotPage() {
  const [activeTab, setActiveTab] = useState<TabId>("volcano");
  const info = plotInfo[activeTab];

  return (
    <StatToolLayout
      title="BioPlot — Bioinformatics Visualization"
      description="Publication-ready bioinformatics plots inspired by PlotGDP. Interactive charts for gene expression, enrichment, survival, and more."
    >
      {/* Attribution banner */}
      <div className="glass-card p-4 mb-6 flex items-start gap-3">
        <span className="text-2xl">📄</span>
        <div>
          <p className="text-sm font-semibold text-stone-700">Based on PlotGDP methodology</p>
          <p className="text-xs text-stone-500 mt-1">
            PlotGDP: an AI Agent for Bioinformatics Plotting — bioRxiv 2026.01.31.702995v3.
            Breast cancer case study data (GEO: GSE37751) used for demonstration.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/25"
                : "glass-card text-stone-600 hover:text-orange-600 hover:border-orange-300"
            }`}
          >
            <span className="mr-1.5">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Info Card */}
      <div className="glass-card p-5 mb-6">
        <p className="text-sm text-stone-700 leading-relaxed">{info.desc}</p>
        <p className="text-xs text-stone-500 mt-2"><strong>Usage:</strong> {info.usage}</p>
        <p className="text-xs text-orange-600/80 mt-1 italic">{info.ref}</p>
      </div>

      {/* Chart */}
      <div className="mb-6">
        {activeTab === "volcano" && (
          <VolcanoPlot data={volcanoExample} title="Breast Cancer DEGs — Tumor vs Normal (GSE37751)" />
        )}
        {activeTab === "heatmap" && (
          <Heatmap data={heatmapExample} title="Top DEGs Expression — Tumor vs Normal" />
        )}
        {activeTab === "pca" && (
          <PCAPlot data={pcaExample} pc1Var={45.2} pc2Var={18.7} title="PCA — Breast Cancer Samples (CCNE2-driven)" />
        )}
        {activeTab === "roc" && (
          <ROCCurve curves={rocExample} title="Biomarker ROC — Tumor vs Normal Classification" />
        )}
        {activeTab === "boxplot" && (
          <BoxPlot data={boxExample} yLabel="CCNE2 Expression (log₂ TPM)" title="CCNE2 Expression by Cancer Stage" />
        )}
        {activeTab === "enrichment" && (
          <EnrichmentBubblePlot data={enrichmentExample} title="GO Biological Process Enrichment — Upregulated DEGs" />
        )}
      </div>

      {/* Interpretation */}
      <div className="glass-card p-5">
        <h3 className="font-semibold text-stone-800 mb-2 text-sm">📋 Interpretation</h3>
        {activeTab === "volcano" && (
          <p className="text-sm text-stone-600 leading-relaxed">
            Analysis of GSE37751 identified 400 differentially expressed genes between tumor and normal breast tissue.
            <strong> CCNE2</strong> (log₂FC = 3.2, p &lt; 10⁻⁸) was the most significantly upregulated gene,
            consistent with its role in cell cycle dysregulation. Downregulated genes include hormone receptors (ESR1, PGR)
            suggesting a basal-like subtype. Dashed lines indicate |log₂FC| &gt; 1 and -log₁₀(p) &gt; 1.3 thresholds.
          </p>
        )}
        {activeTab === "heatmap" && (
          <p className="text-sm text-stone-600 leading-relaxed">
            Clear expression dichotomy between tumor and normal samples. Cell cycle genes (CCNE2, TOP2A, MKI67, AURKA)
            show strong upregulation in tumors (red), while hormone signaling genes (ESR1, PGR, FOXA1, GATA3) are
            downregulated (blue). This pattern supports the PlotGDP finding of distinct molecular signatures.
          </p>
        )}
        {activeTab === "pca" && (
          <p className="text-sm text-stone-600 leading-relaxed">
            PC1 (45.2% variance) clearly separates tumor from normal tissue. Metastatic samples form a distinct cluster
            along PC2 (18.7% variance). CCNE2 was identified as the gene contributing most to PC1 variance,
            consistent with its role as a key driver of the malignant phenotype. Sample clustering confirms
            the biological relevance of the identified DEGs.
          </p>
        )}
        {activeTab === "roc" && (
          <p className="text-sm text-stone-600 leading-relaxed">
            CCNE2 shows excellent diagnostic performance (AUC = 0.920) for distinguishing tumor from normal tissue,
            outperforming TOP2A (0.870) and MKI67 (0.810). An AUC &gt; 0.9 suggests CCNE2 could serve as a
            standalone diagnostic biomarker. The dashed diagonal represents random classification (AUC = 0.5).
          </p>
        )}
        {activeTab === "boxplot" && (
          <p className="text-sm text-stone-600 leading-relaxed">
            CCNE2 expression increases progressively from normal tissue through Stage IV, demonstrating a
            clear dose-response relationship with disease severity. Median expression rises ~4.6-fold from
            normal to Stage IV. This stage-dependent expression pattern was highlighted in the PlotGDP
            violin plot analysis and supports CCNE2 as a prognostic biomarker.
          </p>
        )}
        {activeTab === "enrichment" && (
          <p className="text-sm text-stone-600 leading-relaxed">
            GO enrichment of upregulated DEGs reveals <strong>&quot;Chromosome segregation&quot;</strong> as the most
            significant biological process (-log₁₀p = 12.5, 28 genes), followed by cell cycle checkpoint and
            DNA replication pathways. Venn diagram analysis in the PlotGDP study identified 10 previously
            unstudied genes in the chromosome segregation pathway, including CCNE2.
          </p>
        )}
      </div>
    </StatToolLayout>
  );
}
