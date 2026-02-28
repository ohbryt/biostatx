/**
 * BioStatX - Core Statistics Library
 * Provides common biomedical statistical tests without external dependencies.
 * Uses jStat for probability distributions where needed.
 */

// ──────────────────────── Helpers ────────────────────────

export function mean(data: number[]): number {
  return data.reduce((s, v) => s + v, 0) / data.length;
}

export function variance(data: number[], ddof = 1): number {
  const m = mean(data);
  return data.reduce((s, v) => s + (v - m) ** 2, 0) / (data.length - ddof);
}

export function std(data: number[], ddof = 1): number {
  return Math.sqrt(variance(data, ddof));
}

export function sum(data: number[]): number {
  return data.reduce((s, v) => s + v, 0);
}

export function median(data: number[]): number {
  const sorted = [...data].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function sem(data: number[]): number {
  return std(data) / Math.sqrt(data.length);
}

// ──────────── Distributions (Approximations) ─────────────

/** Gamma function approximation (Lanczos) */
function gammaLn(z: number): number {
  const g = 7;
  const c = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];
  if (z < 0.5) {
    return (
      Math.log(Math.PI / Math.sin(Math.PI * z)) - gammaLn(1 - z)
    );
  }
  z -= 1;
  let x = c[0];
  for (let i = 1; i < g + 2; i++) {
    x += c[i] / (z + i);
  }
  const t = z + g + 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
}

function gamma(z: number): number {
  return Math.exp(gammaLn(z));
}

/** Regularized incomplete beta function (continued fraction) */
function betaIncomplete(a: number, b: number, x: number): number {
  if (x === 0 || x === 1) return x;
  const maxIter = 200;
  const eps = 1e-14;
  const lnBeta = gammaLn(a) + gammaLn(b) - gammaLn(a + b);
  const front = Math.exp(Math.log(x) * a + Math.log(1 - x) * b - lnBeta);

  // Use continued fraction
  let f = 1, c = 1, d = 0;
  for (let i = 0; i <= maxIter; i++) {
    let m = Math.floor(i / 2);
    let numerator: number;
    if (i === 0) {
      numerator = 1;
    } else if (i % 2 === 0) {
      numerator = (m * (b - m) * x) / ((a + 2 * m - 1) * (a + 2 * m));
    } else {
      numerator =
        -((a + m) * (a + b + m) * x) / ((a + 2 * m) * (a + 2 * m + 1));
    }
    d = 1 + numerator * d;
    if (Math.abs(d) < eps) d = eps;
    d = 1 / d;
    c = 1 + numerator / c;
    if (Math.abs(c) < eps) c = eps;
    f *= c * d;
    if (Math.abs(c * d - 1) < eps) break;
  }
  return front * (f - 1) / a;
}

function regularizedBeta(x: number, a: number, b: number): number {
  if (x < 0 || x > 1) return 0;
  if (x > (a + 1) / (a + b + 2)) {
    return 1 - regularizedBeta(1 - x, b, a);
  }
  return betaIncomplete(a, b, x);
}

/** t-distribution CDF */
export function tCDF(t: number, df: number): number {
  const x = df / (df + t * t);
  return 1 - 0.5 * regularizedBeta(x, df / 2, 0.5);
}

/** Two-tailed p-value from t-distribution */
export function tPValue(t: number, df: number): number {
  const p = tCDF(Math.abs(t), df);
  return 2 * (1 - p);
}

/** Chi-square CDF (regularized gamma) */
function lowerGamma(s: number, x: number): number {
  if (x < 0) return 0;
  let sum = 0, term = 1 / s;
  for (let n = 1; n < 200; n++) {
    term *= x / (s + n);
    sum += term;
    if (Math.abs(term) < 1e-14) break;
  }
  return Math.exp(-x + s * Math.log(x) - gammaLn(s)) * (1 / s + sum);
}

export function chiSquareCDF(x: number, k: number): number {
  return lowerGamma(k / 2, x / 2);
}

export function chiSquarePValue(chiSq: number, df: number): number {
  return 1 - chiSquareCDF(chiSq, df);
}

/** F-distribution CDF */
export function fCDF(f: number, d1: number, d2: number): number {
  const x = (d1 * f) / (d1 * f + d2);
  return regularizedBeta(x, d1 / 2, d2 / 2);
}

export function fPValue(f: number, d1: number, d2: number): number {
  return 1 - fCDF(f, d1, d2);
}

/** Normal CDF approximation */
export function normalCDF(x: number): number {
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
  const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return 0.5 * (1.0 + sign * y);
}

/** Normal inverse CDF (quantile) - rational approximation */
export function normalInvCDF(p: number): number {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  if (p < 0.5) return -normalInvCDF(1 - p);
  const a = [
    -3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2,
    1.383577518672690e2, -3.066479806614716e1, 2.506628277459239e0,
  ];
  const b = [
    -5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2,
    6.680131188771972e1, -1.328068155288572e1,
  ];
  const c = [
    -7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838e0,
    -2.549732539343734e0, 4.374664141464968e0, 2.938163982698783e0,
  ];
  const d = [
    7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996e0,
    3.754408661907416e0,
  ];
  const pLow = 0.02425, pHigh = 1 - pLow;
  let q: number, r: number;
  if (p < pLow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  } else if (p <= pHigh) {
    q = p - 0.5;
    r = q * q;
    return (
      ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
    );
  } else {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  }
}

// ──────────────── Statistical Tests ──────────────────────

export interface TTestResult {
  tStatistic: number;
  pValue: number;
  degreesOfFreedom: number;
  meanGroup1: number;
  meanGroup2: number;
  stdGroup1: number;
  stdGroup2: number;
  semGroup1: number;
  semGroup2: number;
  n1: number;
  n2: number;
  meanDifference: number;
  confidenceInterval: [number, number];
  significant: boolean;
  effectSize: number; // Cohen's d
}

/** Independent two-sample t-test (Welch's) */
export function independentTTest(
  group1: number[],
  group2: number[],
  alpha = 0.05
): TTestResult {
  const n1 = group1.length, n2 = group2.length;
  const m1 = mean(group1), m2 = mean(group2);
  const v1 = variance(group1), v2 = variance(group2);
  const s1 = std(group1), s2 = std(group2);
  const se1 = sem(group1), se2 = sem(group2);

  const se = Math.sqrt(v1 / n1 + v2 / n2);
  const t = (m1 - m2) / se;

  // Welch–Satterthwaite df
  const num = (v1 / n1 + v2 / n2) ** 2;
  const den =
    (v1 / n1) ** 2 / (n1 - 1) + (v2 / n2) ** 2 / (n2 - 1);
  const df = num / den;

  const p = tPValue(t, df);
  const pooledStd = Math.sqrt(
    ((n1 - 1) * v1 + (n2 - 1) * v2) / (n1 + n2 - 2)
  );
  const cohensD = Math.abs(m1 - m2) / pooledStd;

  // CI for mean difference
  const tCrit = -normalInvCDF(alpha / 2); // approximate
  const diff = m1 - m2;
  const ci: [number, number] = [diff - tCrit * se, diff + tCrit * se];

  return {
    tStatistic: t,
    pValue: p,
    degreesOfFreedom: df,
    meanGroup1: m1,
    meanGroup2: m2,
    stdGroup1: s1,
    stdGroup2: s2,
    semGroup1: se1,
    semGroup2: se2,
    n1, n2,
    meanDifference: diff,
    confidenceInterval: ci,
    significant: p < alpha,
    effectSize: cohensD,
  };
}

export interface PairedTTestResult {
  tStatistic: number;
  pValue: number;
  degreesOfFreedom: number;
  meanDifference: number;
  stdDifference: number;
  n: number;
  confidenceInterval: [number, number];
  significant: boolean;
  effectSize: number;
}

/** Paired t-test */
export function pairedTTest(
  before: number[],
  after: number[],
  alpha = 0.05
): PairedTTestResult {
  const n = before.length;
  const diffs = before.map((v, i) => v - after[i]);
  const m = mean(diffs);
  const s = std(diffs);
  const se = s / Math.sqrt(n);
  const t = m / se;
  const df = n - 1;
  const p = tPValue(t, df);
  const tCrit = -normalInvCDF(alpha / 2);
  const ci: [number, number] = [m - tCrit * se, m + tCrit * se];
  const cohensD = Math.abs(m) / s;

  return {
    tStatistic: t,
    pValue: p,
    degreesOfFreedom: df,
    meanDifference: m,
    stdDifference: s,
    n,
    confidenceInterval: ci,
    significant: p < alpha,
    effectSize: cohensD,
  };
}

export interface AnovaResult {
  fStatistic: number;
  pValue: number;
  dfBetween: number;
  dfWithin: number;
  ssBetween: number;
  ssWithin: number;
  msBetween: number;
  msWithin: number;
  groupMeans: number[];
  groupStds: number[];
  groupNs: number[];
  significant: boolean;
  etaSquared: number;
}

/** One-way ANOVA */
export function oneWayAnova(groups: number[][], alpha = 0.05): AnovaResult {
  const k = groups.length;
  const allData = groups.flat();
  const grandMean = mean(allData);
  const N = allData.length;

  const groupMeans = groups.map(mean);
  const groupStds = groups.map((g) => std(g));
  const groupNs = groups.map((g) => g.length);

  const ssBetween = groups.reduce(
    (s, g, i) => s + g.length * (groupMeans[i] - grandMean) ** 2,
    0
  );
  const ssWithin = groups.reduce(
    (s, g, i) =>
      s + g.reduce((ss, v) => ss + (v - groupMeans[i]) ** 2, 0),
    0
  );

  const dfBetween = k - 1;
  const dfWithin = N - k;
  const msBetween = ssBetween / dfBetween;
  const msWithin = ssWithin / dfWithin;
  const f = msBetween / msWithin;
  const p = fPValue(f, dfBetween, dfWithin);

  return {
    fStatistic: f,
    pValue: p,
    dfBetween,
    dfWithin,
    ssBetween,
    ssWithin,
    msBetween,
    msWithin,
    groupMeans,
    groupStds,
    groupNs,
    significant: p < alpha,
    etaSquared: ssBetween / (ssBetween + ssWithin),
  };
}

export interface ChiSquareResult {
  chiSquare: number;
  pValue: number;
  degreesOfFreedom: number;
  observed: number[][];
  expected: number[][];
  significant: boolean;
  cramersV: number;
}

/** Chi-square test of independence */
export function chiSquareTest(
  observed: number[][],
  alpha = 0.05
): ChiSquareResult {
  const rows = observed.length;
  const cols = observed[0].length;
  const rowTotals = observed.map((r) => sum(r));
  const colTotals = Array.from({ length: cols }, (_, j) =>
    observed.reduce((s, r) => s + r[j], 0)
  );
  const total = sum(rowTotals);

  const expected = observed.map((r, i) =>
    r.map((_, j) => (rowTotals[i] * colTotals[j]) / total)
  );

  let chiSq = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      chiSq += (observed[i][j] - expected[i][j]) ** 2 / expected[i][j];
    }
  }

  const df = (rows - 1) * (cols - 1);
  const p = chiSquarePValue(chiSq, df);
  const minDim = Math.min(rows, cols) - 1;
  const cramersV = Math.sqrt(chiSq / (total * minDim));

  return {
    chiSquare: chiSq,
    pValue: p,
    degreesOfFreedom: df,
    observed,
    expected,
    significant: p < alpha,
    cramersV,
  };
}

export interface CorrelationResult {
  r: number;
  rSquared: number;
  pValue: number;
  n: number;
  significant: boolean;
  interpretation: string;
}

/** Pearson correlation */
export function pearsonCorrelation(
  x: number[],
  y: number[],
  alpha = 0.05
): CorrelationResult {
  const n = x.length;
  const mx = mean(x), my = mean(y);
  let ssxy = 0, ssx = 0, ssy = 0;
  for (let i = 0; i < n; i++) {
    ssxy += (x[i] - mx) * (y[i] - my);
    ssx += (x[i] - mx) ** 2;
    ssy += (y[i] - my) ** 2;
  }
  const r = ssxy / Math.sqrt(ssx * ssy);
  const t = r * Math.sqrt((n - 2) / (1 - r * r));
  const p = tPValue(t, n - 2);

  let interpretation = "";
  const absR = Math.abs(r);
  if (absR >= 0.9) interpretation = "Very strong";
  else if (absR >= 0.7) interpretation = "Strong";
  else if (absR >= 0.5) interpretation = "Moderate";
  else if (absR >= 0.3) interpretation = "Weak";
  else interpretation = "Very weak / negligible";

  return {
    r,
    rSquared: r * r,
    pValue: p,
    n,
    significant: p < alpha,
    interpretation,
  };
}

export interface MannWhitneyResult {
  uStatistic: number;
  pValue: number;
  n1: number;
  n2: number;
  significant: boolean;
  rankSumGroup1: number;
  rankSumGroup2: number;
}

/** Mann-Whitney U test */
export function mannWhitneyU(
  group1: number[],
  group2: number[],
  alpha = 0.05
): MannWhitneyResult {
  const n1 = group1.length, n2 = group2.length;
  const combined = [
    ...group1.map((v) => ({ v, g: 1 })),
    ...group2.map((v) => ({ v, g: 2 })),
  ].sort((a, b) => a.v - b.v);

  // Assign ranks (handle ties)
  const ranks = new Array(combined.length);
  let i = 0;
  while (i < combined.length) {
    let j = i;
    while (j < combined.length && combined[j].v === combined[i].v) j++;
    const avgRank = (i + 1 + j) / 2;
    for (let k = i; k < j; k++) ranks[k] = avgRank;
    i = j;
  }

  let R1 = 0, R2 = 0;
  for (let k = 0; k < combined.length; k++) {
    if (combined[k].g === 1) R1 += ranks[k];
    else R2 += ranks[k];
  }

  const U1 = R1 - (n1 * (n1 + 1)) / 2;
  const U2 = R2 - (n2 * (n2 + 1)) / 2;
  const U = Math.min(U1, U2);

  // Normal approximation for large samples
  const mU = (n1 * n2) / 2;
  const sigmaU = Math.sqrt((n1 * n2 * (n1 + n2 + 1)) / 12);
  const z = (U - mU) / sigmaU;
  const p = 2 * (1 - normalCDF(Math.abs(z)));

  return {
    uStatistic: U,
    pValue: p,
    n1, n2,
    significant: p < alpha,
    rankSumGroup1: R1,
    rankSumGroup2: R2,
  };
}

export interface SampleSizeResult {
  sampleSize: number;
  power: number;
  alpha: number;
  effectSize: number;
  totalSampleSize: number;
}

/** Sample size calculation for two-group comparison */
export function sampleSizeCalc(
  effectSize: number,
  power = 0.8,
  alpha = 0.05
): SampleSizeResult {
  const zAlpha = -normalInvCDF(alpha / 2);
  const zBeta = -normalInvCDF(1 - power);
  const n = Math.ceil(2 * ((zAlpha + zBeta) / effectSize) ** 2);

  return {
    sampleSize: n,
    power,
    alpha,
    effectSize,
    totalSampleSize: n * 2,
  };
}

export interface SurvivalPoint {
  time: number;
  survival: number;
  nRisk: number;
  nEvent: number;
  nCensored: number;
}

export interface KaplanMeierResult {
  curve: SurvivalPoint[];
  medianSurvival: number | null;
  totalEvents: number;
  totalCensored: number;
}

/** Kaplan-Meier survival analysis */
export function kaplanMeier(
  times: number[],
  events: boolean[]
): KaplanMeierResult {
  const data = times
    .map((t, i) => ({ time: t, event: events[i] }))
    .sort((a, b) => a.time - b.time);

  const curve: SurvivalPoint[] = [];
  let nRisk = data.length;
  let survival = 1;
  let totalEvents = 0;
  let totalCensored = 0;
  let medianSurvival: number | null = null;

  let i = 0;
  while (i < data.length) {
    const currentTime = data[i].time;
    let nEvent = 0;
    let nCensor = 0;

    while (i < data.length && data[i].time === currentTime) {
      if (data[i].event) nEvent++;
      else nCensor++;
      i++;
    }

    if (nEvent > 0) {
      survival *= 1 - nEvent / nRisk;
      totalEvents += nEvent;
    }
    totalCensored += nCensor;

    curve.push({
      time: currentTime,
      survival,
      nRisk,
      nEvent,
      nCensored: nCensor,
    });

    if (medianSurvival === null && survival <= 0.5) {
      medianSurvival = currentTime;
    }

    nRisk -= nEvent + nCensor;
  }

  return { curve, medianSurvival, totalEvents, totalCensored };
}

// ──────────────── Utility ──────────────────────

export function parseData(text: string): number[] {
  return text
    .split(/[\s,;\n\t]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map(Number)
    .filter((n) => !isNaN(n));
}

export function formatNumber(n: number, decimals = 4): string {
  if (Math.abs(n) < 0.0001 && n !== 0) return n.toExponential(2);
  return n.toFixed(decimals);
}
