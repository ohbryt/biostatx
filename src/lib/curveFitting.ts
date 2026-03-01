/* ═══════════════════════════════════════════════════════
   Curve Fitting Engine — Levenberg-Marquardt Optimizer
   Inspired by GraphPad Prism 11 Curve Fitting Guide
   ═══════════════════════════════════════════════════════ */

export interface FitModel {
  name: string;
  equation: string;
  f: (x: number, p: number[]) => number;
  init: (xData: number[], yData: number[]) => number[];
  paramNames: string[];
}

export interface FitResult {
  params: number[];
  paramNames: string[];
  rSquared: number;
  adjRSquared: number;
  rmse: number;
  aic: number;
  residuals: number[];
  converged: boolean;
  iterations: number;
  fittedCurve: { x: number; y: number }[];
}

/* ═══ Levenberg-Marquardt Algorithm ═══ */
export function levenbergMarquardt(
  xData: number[],
  yData: number[],
  model: (x: number, params: number[]) => number,
  initialParams: number[],
  maxIter = 200,
  tol = 1e-10
): { params: number[]; converged: boolean; iterations: number } {
  const n = xData.length;
  const m = initialParams.length;
  let params = [...initialParams];
  let lambda = 0.001;
  const h = 1e-8; // for numerical Jacobian

  let prevSSR = Infinity;
  let converged = false;
  let iter = 0;

  for (iter = 0; iter < maxIter; iter++) {
    // Compute residuals
    const residuals = new Array(n);
    for (let i = 0; i < n; i++) {
      residuals[i] = yData[i] - model(xData[i], params);
    }

    const ssr = residuals.reduce((s, r) => s + r * r, 0);

    // Check convergence
    if (Math.abs(prevSSR - ssr) < tol * ssr + 1e-20) {
      converged = true;
      break;
    }
    prevSSR = ssr;

    // Compute Jacobian (numerical)
    const J: number[][] = [];
    for (let i = 0; i < n; i++) {
      J[i] = new Array(m);
      for (let j = 0; j < m; j++) {
        const p1 = [...params];
        const step = Math.max(h, Math.abs(params[j]) * h);
        p1[j] += step;
        J[i][j] = (model(xData[i], p1) - model(xData[i], params)) / step;
      }
    }

    // J^T * J
    const JtJ: number[][] = [];
    for (let i = 0; i < m; i++) {
      JtJ[i] = new Array(m).fill(0);
      for (let j = 0; j < m; j++) {
        for (let k = 0; k < n; k++) {
          JtJ[i][j] += J[k][i] * J[k][j];
        }
      }
    }

    // J^T * residuals
    const JtR = new Array(m).fill(0);
    for (let i = 0; i < m; i++) {
      for (let k = 0; k < n; k++) {
        JtR[i] += J[k][i] * residuals[k];
      }
    }

    // Damped system: (J^T*J + lambda*diag(J^T*J)) * delta = J^T*r
    const A: number[][] = JtJ.map((row) => [...row]);
    for (let i = 0; i < m; i++) {
      A[i][i] += lambda * (JtJ[i][i] + 1e-10);
    }

    // Solve via Gaussian elimination
    const delta = solveLinearSystem(A, JtR);
    if (!delta) {
      lambda *= 10;
      continue;
    }

    // Try new params
    const newParams = params.map((p, i) => p + delta[i]);
    let newSSR = 0;
    let valid = true;
    for (let i = 0; i < n; i++) {
      const val = model(xData[i], newParams);
      if (!isFinite(val)) { valid = false; break; }
      newSSR += Math.pow(yData[i] - val, 2);
    }

    if (valid && newSSR < ssr) {
      params = newParams;
      lambda = Math.max(lambda / 10, 1e-15);
    } else {
      lambda *= 10;
    }
  }

  return { params, converged, iterations: iter };
}

function solveLinearSystem(A: number[][], b: number[]): number[] | null {
  const n = b.length;
  const aug = A.map((row, i) => [...row, b[i]]);

  for (let col = 0; col < n; col++) {
    // Partial pivoting
    let maxRow = col;
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(aug[row][col]) > Math.abs(aug[maxRow][col])) maxRow = row;
    }
    [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]];

    if (Math.abs(aug[col][col]) < 1e-20) return null;

    for (let row = col + 1; row < n; row++) {
      const factor = aug[row][col] / aug[col][col];
      for (let j = col; j <= n; j++) {
        aug[row][j] -= factor * aug[col][j];
      }
    }
  }

  // Back substitution
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    x[i] = aug[i][n];
    for (let j = i + 1; j < n; j++) {
      x[i] -= aug[i][j] * x[j];
    }
    x[i] /= aug[i][i];
  }
  return x;
}

/* ═══ Fit Statistics ═══ */
function computeStats(
  xData: number[], yData: number[], params: number[],
  model: (x: number, p: number[]) => number
): { rSquared: number; adjRSquared: number; rmse: number; aic: number; residuals: number[] } {
  const n = yData.length;
  const k = params.length;
  const yMean = yData.reduce((s, v) => s + v, 0) / n;
  const residuals = yData.map((y, i) => y - model(xData[i], params));
  const ssRes = residuals.reduce((s, r) => s + r * r, 0);
  const ssTot = yData.reduce((s, y) => s + Math.pow(y - yMean, 2), 0);
  const rSquared = ssTot === 0 ? 1 : 1 - ssRes / ssTot;
  const adjRSquared = n <= k + 1 ? rSquared : 1 - (1 - rSquared) * (n - 1) / (n - k - 1);
  const rmse = Math.sqrt(ssRes / Math.max(1, n - k));
  const aic = n > 0 ? n * Math.log(ssRes / n + 1e-300) + 2 * k : 0;
  return { rSquared, adjRSquared, rmse, aic, residuals };
}

/* ═══ Generate fitted curve points ═══ */
function generateCurve(
  xData: number[], params: number[],
  model: (x: number, p: number[]) => number, nPoints = 200
): { x: number; y: number }[] {
  const xMin = Math.min(...xData);
  const xMax = Math.max(...xData);
  const range = xMax - xMin || 1;
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i <= nPoints; i++) {
    const x = xMin - range * 0.05 + (range * 1.1 * i) / nPoints;
    const y = model(x, params);
    if (isFinite(y)) pts.push({ x, y });
  }
  return pts;
}

/* ═══ Model Definitions (Prism-style) ═══ */
export const models: Record<string, FitModel> = {
  linear: {
    name: "Linear Regression",
    equation: "Y = a + b·X",
    f: (x, [a, b]) => a + b * x,
    init: (xd, yd) => {
      const n = xd.length;
      const sx = xd.reduce((s, v) => s + v, 0);
      const sy = yd.reduce((s, v) => s + v, 0);
      const sxy = xd.reduce((s, v, i) => s + v * yd[i], 0);
      const sx2 = xd.reduce((s, v) => s + v * v, 0);
      const b = (n * sxy - sx * sy) / (n * sx2 - sx * sx + 1e-20);
      const a = (sy - b * sx) / n;
      return [a, b];
    },
    paramNames: ["Intercept (a)", "Slope (b)"],
  },

  quadratic: {
    name: "Quadratic (2nd Order Polynomial)",
    equation: "Y = a + b·X + c·X²",
    f: (x, [a, b, c]) => a + b * x + c * x * x,
    init: () => [0, 1, 0],
    paramNames: ["a", "b", "c"],
  },

  cubic: {
    name: "Cubic (3rd Order Polynomial)",
    equation: "Y = a + b·X + c·X² + d·X³",
    f: (x, [a, b, c, d]) => a + b * x + c * x * x + d * x * x * x,
    init: () => [0, 1, 0, 0],
    paramNames: ["a", "b", "c", "d"],
  },

  exponentialGrowth: {
    name: "Exponential Growth",
    equation: "Y = Y₀ · exp(k·X)",
    f: (x, [y0, k]) => y0 * Math.exp(k * x),
    init: (_xd, yd) => [Math.max(0.01, yd[0] || 1), 0.1],
    paramNames: ["Y₀", "k (rate)"],
  },

  exponentialDecay: {
    name: "Exponential Decay (one-phase)",
    equation: "Y = (Y₀ - Plateau) · exp(-k·X) + Plateau",
    f: (x, [y0, k, plateau]) => (y0 - plateau) * Math.exp(-k * x) + plateau,
    init: (_xd, yd) => [Math.max(...yd), 0.1, Math.min(...yd)],
    paramNames: ["Y₀", "k (rate)", "Plateau"],
  },

  logistic4PL: {
    name: "4-Parameter Logistic (Dose-Response)",
    equation: "Y = Bottom + (Top - Bottom) / (1 + 10^((LogEC₅₀ - X)·Hill))",
    f: (x, [bottom, top, logEC50, hill]) =>
      bottom + (top - bottom) / (1 + Math.pow(10, (logEC50 - x) * hill)),
    init: (_xd, yd) => {
      const sorted = [...yd].sort((a, b) => a - b);
      return [sorted[0], sorted[sorted.length - 1], 0, 1];
    },
    paramNames: ["Bottom", "Top", "LogEC₅₀", "HillSlope"],
  },

  michaelismenten: {
    name: "Michaelis-Menten",
    equation: "Y = Vmax · X / (Km + X)",
    f: (x, [vmax, km]) => (vmax * x) / (km + x),
    init: (_xd, yd) => [Math.max(...yd) * 1.2, _xd[Math.floor(_xd.length / 2)] || 10],
    paramNames: ["Vmax", "Km"],
  },

  gaussian: {
    name: "Gaussian (Bell Curve)",
    equation: "Y = Amp · exp(-(X - μ)² / (2σ²))",
    f: (x, [amp, mean, sd]) => amp * Math.exp(-Math.pow(x - mean, 2) / (2 * sd * sd + 1e-20)),
    init: (xd, yd) => {
      const maxIdx = yd.indexOf(Math.max(...yd));
      const amp = Math.max(...yd);
      const mean = xd[maxIdx] || 0;
      const range = (Math.max(...xd) - Math.min(...xd)) / 4 || 1;
      return [amp, mean, range];
    },
    paramNames: ["Amplitude", "Mean (μ)", "SD (σ)"],
  },

  powerLaw: {
    name: "Power (Allometric)",
    equation: "Y = a · X^b",
    f: (x, [a, b]) => a * Math.pow(Math.max(1e-20, x), b),
    init: () => [1, 1],
    paramNames: ["a (coefficient)", "b (exponent)"],
  },

  hillEquation: {
    name: "Hill Equation (Cooperative Binding)",
    equation: "Y = Bmax · X^n / (Kd^n + X^n)",
    f: (x, [bmax, kd, n]) => (bmax * Math.pow(x, n)) / (Math.pow(kd, n) + Math.pow(x, n)),
    init: (_xd, yd) => [Math.max(...yd), _xd[Math.floor(_xd.length / 2)] || 10, 1],
    paramNames: ["Bmax", "Kd", "n (Hill coeff)"],
  },
};

/* ═══ Main Fit Function ═══ */
export function fitCurve(
  xData: number[],
  yData: number[],
  modelKey: string
): FitResult {
  const m = models[modelKey];
  if (!m) throw new Error(`Unknown model: ${modelKey}`);

  const initParams = m.init(xData, yData);
  const { params, converged, iterations } = levenbergMarquardt(xData, yData, m.f, initParams);
  const stats = computeStats(xData, yData, params, m.f);
  const fittedCurve = generateCurve(xData, params, m.f);

  return {
    params,
    paramNames: m.paramNames,
    rSquared: stats.rSquared,
    adjRSquared: stats.adjRSquared,
    rmse: stats.rmse,
    aic: stats.aic,
    residuals: stats.residuals,
    converged,
    iterations,
    fittedCurve,
  };
}
