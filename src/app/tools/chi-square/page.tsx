"use client";

import { useState } from "react";
import StatToolLayout from "@/components/StatToolLayout";
import { chiSquareTest, formatNumber } from "@/lib/statistics";

export default function ChiSquarePage() {
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [data, setData] = useState([
    [30, 10],
    [15, 25],
  ]);
  const [alpha, setAlpha] = useState(0.05);
  const [result, setResult] = useState<ReturnType<typeof chiSquareTest> | null>(null);

  const updateCell = (r: number, c: number, val: string) => {
    const newData = data.map((row) => [...row]);
    newData[r][c] = Number(val) || 0;
    setData(newData);
  };

  const resize = (newRows: number, newCols: number) => {
    const newData = Array.from({ length: newRows }, (_, r) =>
      Array.from({ length: newCols }, (_, c) => (data[r]?.[c] ?? 0))
    );
    setRows(newRows);
    setCols(newCols);
    setData(newData);
  };

  const runTest = () => {
    if (data.some((row) => row.some((v) => v < 0))) return;
    setResult(chiSquareTest(data, alpha));
  };

  return (
    <StatToolLayout
      title="Chi-Square Test of Independence"
      description="Test whether two categorical variables are independent. Enter observed frequencies in the contingency table."
    >
      <div className="space-y-6">
        <div className="glass-card p-6">
          <h3 className="font-semibold mb-4 text-blue-300">Contingency Table</h3>

          <div className="flex gap-4 mb-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Rows</label>
              <select className="input-field !w-20" value={rows} onChange={(e) => resize(Number(e.target.value), cols)}>
                {[2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Columns</label>
              <select className="input-field !w-20" value={cols} onChange={(e) => resize(rows, Number(e.target.value))}>
                {[2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="text-sm">
              <thead>
                <tr>
                  <th className="p-2"></th>
                  {Array.from({ length: cols }, (_, c) => (
                    <th key={c} className="p-2 text-slate-400">Col {c + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, r) => (
                  <tr key={r}>
                    <td className="p-2 text-slate-400 text-sm">Row {r + 1}</td>
                    {row.map((val, c) => (
                      <td key={c} className="p-1">
                        <input
                          type="number"
                          className="input-field !w-20 text-center"
                          value={val}
                          onChange={(e) => updateCell(r, c, e.target.value)}
                          min={0}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button className="btn-primary mt-4" onClick={runTest}>
            Run Chi-Square Test
          </button>
        </div>

        {result && (
          <div className="space-y-6">
            <div className="result-box">
              <div className="flex items-center gap-3 mb-4">
                <span className={`stat-badge ${result.significant ? "significant" : "not-significant"}`}>
                  {result.significant ? "✓ Significant" : "✗ Not Significant"}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">χ²</div>
                  <div className="text-xl font-bold">{formatNumber(result.chiSquare)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">p-value</div>
                  <div className={`text-xl font-bold ${result.significant ? "text-green-400" : "text-red-400"}`}>
                    {formatNumber(result.pValue)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Cramér&apos;s V</div>
                  <div className="text-xl font-bold text-purple-400">{formatNumber(result.cramersV)}</div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="font-semibold mb-4">Expected Frequencies</h3>
              <div className="overflow-x-auto">
                <table className="text-sm w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="py-2 text-left text-slate-400"></th>
                      {Array.from({ length: result.expected[0].length }, (_, c) => (
                        <th key={c} className="py-2 text-right text-slate-400">Col {c + 1}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.expected.map((row, r) => (
                      <tr key={r} className="border-b border-slate-800">
                        <td className="py-2 text-slate-400">Row {r + 1}</td>
                        {row.map((val, c) => (
                          <td key={c} className="py-2 text-right">{formatNumber(val, 2)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="glass-card p-6 border-l-4 border-blue-500">
              <h3 className="font-semibold mb-2">📝 Interpretation</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {result.significant ? (
                  <>A chi-square test of independence showed a <strong>statistically significant</strong> association (χ²({result.degreesOfFreedom}) = {formatNumber(result.chiSquare)}, p = {formatNumber(result.pValue)}, Cramér&apos;s V = {formatNumber(result.cramersV)}).</>
                ) : (
                  <>A chi-square test of independence showed <strong>no statistically significant</strong> association (χ²({result.degreesOfFreedom}) = {formatNumber(result.chiSquare)}, p = {formatNumber(result.pValue)}).</>
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </StatToolLayout>
  );
}
