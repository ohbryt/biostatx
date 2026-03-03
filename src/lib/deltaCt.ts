/**
 * BioStatX — RT-PCR Relative Quantification (Delta Ct Methods)
 *
 * Implements the methods from:
 * - Livak & Schmittgen (2001): 2^-ΔΔCt method
 * - Pfaffl (2001): Efficiency-corrected relative quantification
 * - Schmittgen & Livak (2008): 2^-ΔCt method
 *
 * Reference: RQdeltaCT (Zalewski & Bogucka-Kocka, 2025, Scientific Reports)
 */

import { mean, std, sem } from "./statistics";

// ──────────────── Types ────────────────

export interface Sample {
  name: string;
  group: string; // "Control" or treatment group name
  targetCt: number;
  referenceCt: number;
  /** Optional: PCR efficiency for target gene (default 2.0 = 100%) */
  targetEfficiency?: number;
  /** Optional: PCR efficiency for reference gene (default 2.0 = 100%) */
  refEfficiency?: number;
}

export interface DeltaCtRow {
  name: string;
  group: string;
  targetCt: number;
  referenceCt: number;
  deltaCt: number;        // Ct_target - Ct_reference
  deltaDeltaCt: number;   // ΔCt - mean(ΔCt_control)
  foldChange: number;     // 2^(-ΔΔCt) or Pfaffl ratio
  expression: number;     // 2^(-ΔCt) for simple normalization
}

export interface GroupSummary {
  group: string;
  n: number;
  meanDeltaCt: number;
  sdDeltaCt: number;
  semDeltaCt: number;
  meanFoldChange: number;
  sdFoldChange: number;
  semFoldChange: number;
  meanExpression: number;
  sdExpression: number;
  semExpression: number;
}

export interface StatTestResult {
  test: string;
  statistic: number;
  pValue: number;
  significant: boolean;
  description: string;
}

export type Method = "livak" | "pfaffl" | "deltaCt";

export interface DeltaCtResult {
  method: Method;
  methodName: string;
  controlGroup: string;
  rows: DeltaCtRow[];
  groupSummaries: GroupSummary[];
  statTest: StatTestResult | null;
  interpretation: string;
  formula: string;
}

// ──────────────── Core Computations ────────────────

/**
 * 2^-ΔCt method (Schmittgen & Livak 2008)
 * Expression = 2^-(Ct_target - Ct_reference)
 * Used when no control group comparison is needed.
 */
function calcExpression2negDCt(targetCt: number, refCt: number): number {
  const dCt = targetCt - refCt;
  return Math.pow(2, -dCt);
}

/**
 * 2^-ΔΔCt method (Livak & Schmittgen 2001)
 * ΔCt = Ct_target - Ct_reference
 * ΔΔCt = ΔCt_sample - mean(ΔCt_control)
 * Fold Change = 2^(-ΔΔCt)
 * Assumes 100% PCR efficiency for both genes.
 */
function calcLivak(
  targetCt: number,
  refCt: number,
  controlMeanDeltaCt: number
): { deltaCt: number; deltaDeltaCt: number; foldChange: number } {
  const deltaCt = targetCt - refCt;
  const deltaDeltaCt = deltaCt - controlMeanDeltaCt;
  const foldChange = Math.pow(2, -deltaDeltaCt);
  return { deltaCt, deltaDeltaCt, foldChange };
}

/**
 * Pfaffl method (Pfaffl 2001)
 * Ratio = (E_target)^(ΔCt_target) / (E_ref)^(ΔCt_ref)
 * Where ΔCt = mean(Ct_control) - Ct_sample
 * Accounts for different PCR efficiencies.
 */
function calcPfaffl(
  targetCt: number,
  refCt: number,
  controlMeanTargetCt: number,
  controlMeanRefCt: number,
  eTarget: number = 2.0,
  eRef: number = 2.0
): { deltaCt: number; deltaDeltaCt: number; foldChange: number } {
  const dCtTarget = controlMeanTargetCt - targetCt;
  const dCtRef = controlMeanRefCt - refCt;
  const foldChange = Math.pow(eTarget, dCtTarget) / Math.pow(eRef, dCtRef);

  // For display purposes, also compute standard delta Ct
  const deltaCt = targetCt - refCt;
  const controlMeanDeltaCt = controlMeanTargetCt - controlMeanRefCt;
  const deltaDeltaCt = deltaCt - controlMeanDeltaCt;

  return { deltaCt, deltaDeltaCt, foldChange };
}

// ──────────────── Statistical Tests ────────────────

/**
 * Welch's two-sample t-test (unequal variances)
 */
function welchTTest(a: number[], b: number[]): { t: number; df: number; p: number } {
  const n1 = a.length, n2 = b.length;
  const m1 = mean(a), m2 = mean(b);
  const v1 = a.reduce((s, x) => s + (x - m1) ** 2, 0) / (n1 - 1);
  const v2 = b.reduce((s, x) => s + (x - m2) ** 2, 0) / (n2 - 1);
  const se = Math.sqrt(v1 / n1 + v2 / n2);
  if (se === 0) return { t: 0, df: n1 + n2 - 2, p: 1 };
  const t = (m1 - m2) / se;
  const num = (v1 / n1 + v2 / n2) ** 2;
  const den = (v1 / n1) ** 2 / (n1 - 1) + (v2 / n2) ** 2 / (n2 - 1);
  const df = num / den;
  const p = twoTailP(Math.abs(t), df);
  return { t, df, p };
}

/**
 * t-distribution CDF approximation (regularized incomplete beta)
 */
function twoTailP(t: number, df: number): number {
  const x = df / (df + t * t);
  const p = incompleteBeta(x, df / 2, 0.5);
  return Math.min(1, Math.max(0, p));
}

function incompleteBeta(x: number, a: number, b: number): number {
  // Continued fraction approximation (Lentz's method)
  if (x === 0 || x === 1) return x === 0 ? 1 : 0;
  const lnBeta = gammaLn(a) + gammaLn(b) - gammaLn(a + b);
  const front = Math.exp(Math.log(x) * a + Math.log(1 - x) * b - lnBeta) / a;

  let f = 1, c = 1, d = 0;
  for (let i = 0; i <= 200; i++) {
    const m = Math.floor(i / 2);
    let numerator: number;
    if (i === 0) {
      numerator = 1;
    } else if (i % 2 === 0) {
      numerator = (m * (b - m) * x) / ((a + 2 * m - 1) * (a + 2 * m));
    } else {
      numerator = -((a + m) * (a + b + m) * x) / ((a + 2 * m) * (a + 2 * m + 1));
    }
    d = 1 + numerator * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    d = 1 / d;
    c = 1 + numerator / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    f *= c * d;
    if (Math.abs(c * d - 1) < 1e-10) break;
  }
  return 1 - front * (f - 1);
}

function gammaLn(z: number): number {
  const g = 7;
  const coef = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];
  if (z < 0.5) {
    return Math.log(Math.PI / Math.sin(Math.PI * z)) - gammaLn(1 - z);
  }
  z -= 1;
  let x = coef[0];
  for (let i = 1; i < g + 2; i++) x += coef[i] / (z + i);
  const t = z + g + 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
}

/**
 * One-way ANOVA (for 3+ groups)
 */
function oneWayAnovaF(groups: number[][]): { F: number; dfBetween: number; dfWithin: number; p: number } {
  const k = groups.length;
  const N = groups.reduce((s, g) => s + g.length, 0);
  const grandMean = mean(groups.flat());

  let ssBetween = 0;
  let ssWithin = 0;
  for (const g of groups) {
    const gm = mean(g);
    ssBetween += g.length * (gm - grandMean) ** 2;
    for (const x of g) ssWithin += (x - gm) ** 2;
  }

  const dfBetween = k - 1;
  const dfWithin = N - k;
  const msBetween = ssBetween / dfBetween;
  const msWithin = ssWithin / dfWithin;
  const F = msWithin > 0 ? msBetween / msWithin : 0;

  // F-distribution p-value via incomplete beta
  const x = dfWithin / (dfWithin + dfBetween * F);
  const p = incompleteBeta(x, dfWithin / 2, dfBetween / 2);

  return { F, dfBetween, dfWithin, p };
}

// ──────────────── Main Analysis Function ────────────────

export function analyzeDeltaCt(
  samples: Sample[],
  controlGroup: string,
  method: Method = "livak",
  alpha: number = 0.05
): DeltaCtResult {
  // Separate control and treatment samples
  const controlSamples = samples.filter((s) => s.group === controlGroup);
  const treatmentGroups = [...new Set(samples.filter((s) => s.group !== controlGroup).map((s) => s.group))];

  if (controlSamples.length === 0) {
    throw new Error("No samples found in the control group. Check group names.");
  }

  // Control group delta Ct values
  const controlDeltaCts = controlSamples.map((s) => s.targetCt - s.referenceCt);
  const controlMeanDeltaCt = mean(controlDeltaCts);
  const controlMeanTargetCt = mean(controlSamples.map((s) => s.targetCt));
  const controlMeanRefCt = mean(controlSamples.map((s) => s.referenceCt));

  // Calculate for all samples
  const rows: DeltaCtRow[] = samples.map((s) => {
    let deltaCt: number, deltaDeltaCt: number, foldChange: number;

    if (method === "pfaffl") {
      const r = calcPfaffl(
        s.targetCt, s.referenceCt,
        controlMeanTargetCt, controlMeanRefCt,
        s.targetEfficiency ?? 2.0, s.refEfficiency ?? 2.0
      );
      deltaCt = r.deltaCt;
      deltaDeltaCt = r.deltaDeltaCt;
      foldChange = r.foldChange;
    } else if (method === "livak") {
      const r = calcLivak(s.targetCt, s.referenceCt, controlMeanDeltaCt);
      deltaCt = r.deltaCt;
      deltaDeltaCt = r.deltaDeltaCt;
      foldChange = r.foldChange;
    } else {
      // Simple 2^-ΔCt
      deltaCt = s.targetCt - s.referenceCt;
      deltaDeltaCt = deltaCt - controlMeanDeltaCt;
      foldChange = Math.pow(2, -deltaDeltaCt);
    }

    const expression = calcExpression2negDCt(s.targetCt, s.referenceCt);

    return {
      name: s.name,
      group: s.group,
      targetCt: s.targetCt,
      referenceCt: s.referenceCt,
      deltaCt,
      deltaDeltaCt,
      foldChange,
      expression,
    };
  });

  // Group summaries
  const allGroups = [controlGroup, ...treatmentGroups];
  const groupSummaries: GroupSummary[] = allGroups.map((group) => {
    const gRows = rows.filter((r) => r.group === group);
    const dCts = gRows.map((r) => r.deltaCt);
    const fcs = gRows.map((r) => r.foldChange);
    const exprs = gRows.map((r) => r.expression);
    return {
      group,
      n: gRows.length,
      meanDeltaCt: mean(dCts),
      sdDeltaCt: dCts.length > 1 ? std(dCts) : 0,
      semDeltaCt: dCts.length > 1 ? sem(dCts) : 0,
      meanFoldChange: mean(fcs),
      sdFoldChange: fcs.length > 1 ? std(fcs) : 0,
      semFoldChange: fcs.length > 1 ? sem(fcs) : 0,
      meanExpression: mean(exprs),
      sdExpression: exprs.length > 1 ? std(exprs) : 0,
      semExpression: exprs.length > 1 ? sem(exprs) : 0,
    };
  });

  // Statistical testing
  let statTest: StatTestResult | null = null;
  if (treatmentGroups.length === 1) {
    // Two groups → Welch's t-test on ΔCt values
    const controlDCts = rows.filter((r) => r.group === controlGroup).map((r) => r.deltaCt);
    const treatDCts = rows.filter((r) => r.group === treatmentGroups[0]).map((r) => r.deltaCt);
    if (controlDCts.length >= 2 && treatDCts.length >= 2) {
      const { t, df, p } = welchTTest(controlDCts, treatDCts);
      statTest = {
        test: "Welch's t-test (on ΔCt values)",
        statistic: t,
        pValue: p,
        significant: p < alpha,
        description: `t(${df.toFixed(1)}) = ${t.toFixed(4)}, p = ${p < 0.0001 ? p.toExponential(2) : p.toFixed(4)}`,
      };
    }
  } else if (treatmentGroups.length > 1) {
    // 3+ groups → One-way ANOVA on ΔCt values
    const groupArrays = allGroups.map((g) =>
      rows.filter((r) => r.group === g).map((r) => r.deltaCt)
    ).filter((a) => a.length >= 2);
    if (groupArrays.length >= 2) {
      const { F, dfBetween, dfWithin, p } = oneWayAnovaF(groupArrays);
      statTest = {
        test: "One-way ANOVA (on ΔCt values)",
        statistic: F,
        pValue: p,
        significant: p < alpha,
        description: `F(${dfBetween}, ${dfWithin}) = ${F.toFixed(4)}, p = ${p < 0.0001 ? p.toExponential(2) : p.toFixed(4)}`,
      };
    }
  }

  // Method info
  const methodNames: Record<Method, string> = {
    livak: "2⁻ᐩᐩᶜᵗ (Livak & Schmittgen)",
    pfaffl: "Pfaffl (Efficiency-corrected)",
    deltaCt: "2⁻ᐩᶜᵗ (Schmittgen & Livak)",
  };

  const formulas: Record<Method, string> = {
    livak: "ΔCt = Ct(target) − Ct(ref);  ΔΔCt = ΔCt − mean(ΔCt_control);  Fold Change = 2^(−ΔΔCt)",
    pfaffl: "Ratio = E_target^(ΔCt_target) / E_ref^(ΔCt_ref), where ΔCt = mean(Ct_control) − Ct_sample",
    deltaCt: "ΔCt = Ct(target) − Ct(ref);  Expression = 2^(−ΔCt)",
  };

  // Auto-interpretation
  const treatmentSummaries = groupSummaries.filter((g) => g.group !== controlGroup);
  let interpretation = "";
  if (treatmentSummaries.length > 0) {
    const parts = treatmentSummaries.map((ts) => {
      const fc = ts.meanFoldChange;
      const direction = fc > 1 ? "upregulated" : fc < 1 ? "downregulated" : "unchanged";
      const magnitude = fc > 1 ? fc.toFixed(2) + "-fold increase" : (1 / fc).toFixed(2) + "-fold decrease";
      return `**${ts.group}** (n=${ts.n}): Target gene is ${direction} (${magnitude}, mean fold change = ${fc.toFixed(3)} ± ${ts.semFoldChange.toFixed(3)} SEM) compared to ${controlGroup}.`;
    });
    interpretation = parts.join(" ");
    if (statTest) {
      interpretation += ` Statistical analysis (${statTest.test}): ${statTest.description}. `;
      interpretation += statTest.significant
        ? `The difference is statistically significant at α = ${alpha}.`
        : `The difference is not statistically significant at α = ${alpha}.`;
    }
  } else {
    interpretation = `Only the control group (${controlGroup}) is present. Add treatment samples for comparative analysis.`;
  }

  return {
    method,
    methodName: methodNames[method],
    controlGroup,
    rows,
    groupSummaries,
    statTest,
    interpretation,
    formula: formulas[method],
  };
}

// ──────────────── Example Datasets ────────────────

export const rtpcrExamples: Record<string, {
  desc: string;
  method: Method;
  controlGroup: string;
  samples: Sample[];
}> = {
  geneExpression: {
    desc: "Gene expression (Treatment vs Control)",
    method: "livak",
    controlGroup: "Control",
    samples: [
      { name: "Ctrl-1", group: "Control", targetCt: 25.2, referenceCt: 18.1 },
      { name: "Ctrl-2", group: "Control", targetCt: 25.5, referenceCt: 18.3 },
      { name: "Ctrl-3", group: "Control", targetCt: 25.0, referenceCt: 18.0 },
      { name: "Ctrl-4", group: "Control", targetCt: 25.3, referenceCt: 18.2 },
      { name: "Trt-1", group: "Treatment", targetCt: 22.1, referenceCt: 18.0 },
      { name: "Trt-2", group: "Treatment", targetCt: 22.4, referenceCt: 18.2 },
      { name: "Trt-3", group: "Treatment", targetCt: 21.8, referenceCt: 17.9 },
      { name: "Trt-4", group: "Treatment", targetCt: 22.0, referenceCt: 18.1 },
    ],
  },
  doseResponse: {
    desc: "Drug dose-response (3 groups)",
    method: "livak",
    controlGroup: "Vehicle",
    samples: [
      { name: "V-1", group: "Vehicle", targetCt: 28.1, referenceCt: 20.2 },
      { name: "V-2", group: "Vehicle", targetCt: 28.4, referenceCt: 20.3 },
      { name: "V-3", group: "Vehicle", targetCt: 27.9, referenceCt: 20.1 },
      { name: "Lo-1", group: "Low Dose", targetCt: 26.5, referenceCt: 20.0 },
      { name: "Lo-2", group: "Low Dose", targetCt: 26.2, referenceCt: 20.2 },
      { name: "Lo-3", group: "Low Dose", targetCt: 26.8, referenceCt: 20.1 },
      { name: "Hi-1", group: "High Dose", targetCt: 23.1, referenceCt: 20.3 },
      { name: "Hi-2", group: "High Dose", targetCt: 23.5, referenceCt: 20.1 },
      { name: "Hi-3", group: "High Dose", targetCt: 23.0, referenceCt: 20.0 },
    ],
  },
  knockdown: {
    desc: "siRNA knockdown validation",
    method: "livak",
    controlGroup: "siControl",
    samples: [
      { name: "siCtrl-1", group: "siControl", targetCt: 22.0, referenceCt: 17.5 },
      { name: "siCtrl-2", group: "siControl", targetCt: 22.3, referenceCt: 17.6 },
      { name: "siCtrl-3", group: "siControl", targetCt: 21.8, referenceCt: 17.4 },
      { name: "siGene-1", group: "siTarget", targetCt: 26.5, referenceCt: 17.3 },
      { name: "siGene-2", group: "siTarget", targetCt: 26.8, referenceCt: 17.5 },
      { name: "siGene-3", group: "siTarget", targetCt: 27.0, referenceCt: 17.6 },
    ],
  },
  pfafflDemo: {
    desc: "Efficiency-corrected (Pfaffl method)",
    method: "pfaffl",
    controlGroup: "WT",
    samples: [
      { name: "WT-1", group: "WT", targetCt: 24.5, referenceCt: 19.0, targetEfficiency: 1.95, refEfficiency: 1.98 },
      { name: "WT-2", group: "WT", targetCt: 24.8, referenceCt: 19.2, targetEfficiency: 1.95, refEfficiency: 1.98 },
      { name: "WT-3", group: "WT", targetCt: 24.3, referenceCt: 18.9, targetEfficiency: 1.95, refEfficiency: 1.98 },
      { name: "KO-1", group: "Knockout", targetCt: 28.2, referenceCt: 19.1, targetEfficiency: 1.95, refEfficiency: 1.98 },
      { name: "KO-2", group: "Knockout", targetCt: 28.5, referenceCt: 19.3, targetEfficiency: 1.95, refEfficiency: 1.98 },
      { name: "KO-3", group: "Knockout", targetCt: 28.0, referenceCt: 19.0, targetEfficiency: 1.95, refEfficiency: 1.98 },
    ],
  },
};
