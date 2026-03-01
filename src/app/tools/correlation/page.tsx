"use client";

import { useState } from "react";
import StatToolLayout from "@/components/StatToolLayout";
import { pearsonCorrelation, parseData, formatNumber } from "@/lib/statistics";
import { CorrelationScatterChart } from "@/components/Charts";

export default function CorrelationPage() {
  const [xText, setXText] = useState("1.2 2.4 3.1 4.5 5.2 6.8 7.3 8.1 9.0 10.2");
  const [yText, setYText] = useState("2.1 4.0 5.2 7.8 9.1 11.5 13.2 14.8 16.1 18.5");
  const [alpha, setAlpha] = useState(0.05);
  const [result, setResult] = useState<ReturnType<typeof pearsonCorrelation> | null>(null);

  const runTest = () => {
    const x = parseData(xText);
    const y = parseData(yText);
    if (x.length < 3 || y.length < 3 || x.length !== y.length) return;
    setResult(pearsonCorrelation(x, y, alpha));
  };

  return (
    <StatToolLayout
      title="Pearson Correlation"
      description="Measure the strength and direction of the linear relationship between two continuous variables."
    >
      <div className="space-y-6">
        <div className="glass-card p-6">
          <h3 className="font-semibold mb-4 text-blue-300">Enter Your Data</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Variable X</label>
              <textarea className="input-field" value={xText} onChange={(e) => setXText(e.target.value)} placeholder="Enter X values" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Variable Y</label>
              <textarea className="input-field" value={yText} onChange={(e) => setYText(e.target.value)} placeholder="Enter Y values" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">Both variables must have the same number of values.</p>
          <button className="btn-primary mt-4" onClick={runTest}>Calculate Correlation</button>
        </div>

        {result && (
          <div className="space-y-6">
            <div className="result-box">
              <div className="flex items-center gap-3 mb-4">
                <span className={`stat-badge ${result.significant ? "significant" : "not-significant"}`}>
                  {result.significant ? "✓ Significant" : "✗ Not Significant"}
                </span>
                <span className="text-sm text-slate-400">{result.interpretation} correlation</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">r (Pearson)</div>
                  <div className="text-xl font-bold">{formatNumber(result.r)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">r²</div>
                  <div className="text-xl font-bold text-cyan-400">{formatNumber(result.rSquared)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">p-value</div>
                  <div className={`text-xl font-bold ${result.significant ? "text-green-400" : "text-red-400"}`}>
                    {formatNumber(result.pValue)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">N</div>
                  <div className="text-xl font-bold">{result.n}</div>
                </div>
              </div>
            </div>

            {/* Scatter Plot */}
            <CorrelationScatterChart
              x={parseData(xText)}
              y={parseData(yText)}
              r={result.r}
              rSquared={result.rSquared}
            />

            <div className="glass-card p-6 border-l-4 border-blue-500">
              <h3 className="font-semibold mb-2">📝 Interpretation</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                There is a <strong>{result.interpretation.toLowerCase()}{result.r >= 0 ? " positive" : " negative"}</strong> correlation
                between the two variables (r = {formatNumber(result.r)}, p = {formatNumber(result.pValue)}, N = {result.n}).
                {result.r > 0 ? " As X increases, Y tends to increase." : " As X increases, Y tends to decrease."}
                {" "}The coefficient of determination (r² = {formatNumber(result.rSquared)}) indicates that{" "}
                {formatNumber(result.rSquared * 100, 1)}% of the variance in Y is explained by X.
              </p>
            </div>
          </div>
        )}
      </div>
    </StatToolLayout>
  );
}
