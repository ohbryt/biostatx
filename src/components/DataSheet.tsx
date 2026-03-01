"use client";

import { useCallback } from "react";

export interface ColumnDef {
  key: string;
  label: string;
}

interface DataSheetProps {
  columns: ColumnDef[];
  data: Record<string, string>[];
  onChange: (data: Record<string, string>[]) => void;
  onLoadExample: () => void;
}

export default function DataSheet({ columns, data, onChange, onLoadExample }: DataSheetProps) {
  const updateCell = (rowIdx: number, colKey: string, value: string) => {
    const next = data.map((r, i) => (i === rowIdx ? { ...r, [colKey]: value } : r));
    onChange(next);
  };

  const addRow = () => {
    const empty: Record<string, string> = {};
    columns.forEach((c) => (empty[c.key] = ""));
    onChange([...data, empty]);
  };

  const deleteRow = (idx: number) => {
    if (data.length <= 1) return;
    onChange(data.filter((_, i) => i !== idx));
  };

  const clearAll = () => {
    const empty: Record<string, string> = {};
    columns.forEach((c) => (empty[c.key] = ""));
    onChange([empty]);
  };

  /* Paste handler: parse TSV/CSV from clipboard */
  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const text = e.clipboardData.getData("text/plain");
      if (!text.includes("\t") && !text.includes("\n")) return; // let normal paste happen

      e.preventDefault();
      const rows = text
        .trim()
        .split(/\r?\n/)
        .map((line) => line.split("\t"));

      const newData = rows.map((cells) => {
        const row: Record<string, string> = {};
        columns.forEach((col, ci) => {
          row[col.key] = cells[ci]?.trim() ?? "";
        });
        return row;
      });
      if (newData.length > 0) onChange(newData);
    },
    [columns, onChange]
  );

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h3 className="text-sm font-semibold text-stone-700">📊 Data Input</h3>
        <div className="flex gap-2">
          <button
            onClick={onLoadExample}
            className="text-xs px-3 py-1.5 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition font-medium border border-orange-200"
          >
            Load Example
          </button>
          <button
            onClick={clearAll}
            className="text-xs px-3 py-1.5 rounded-lg bg-stone-50 text-stone-500 hover:bg-stone-100 transition font-medium border border-stone-200"
          >
            Clear
          </button>
        </div>
      </div>

      <p className="text-[10px] text-stone-400 mb-2">
        💡 Tip: Paste directly from Excel or Google Sheets (Ctrl+V / ⌘V)
      </p>

      <div className="overflow-x-auto -mx-1" onPaste={handlePaste}>
        <table className="w-full text-sm border-collapse min-w-[400px]">
          <thead>
            <tr>
              <th className="text-[10px] text-stone-400 font-medium px-1 py-1.5 text-left w-8">#</th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-[10px] text-stone-500 font-semibold px-1 py-1.5 text-left uppercase tracking-wider border-b border-stone-200"
                >
                  {col.label}
                </th>
              ))}
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {data.map((row, ri) => (
              <tr key={ri} className="group hover:bg-orange-50/30 transition-colors">
                <td className="text-[10px] text-stone-300 px-1 py-0.5">{ri + 1}</td>
                {columns.map((col) => (
                  <td key={col.key} className="px-1 py-0.5">
                    <input
                      type="text"
                      value={row[col.key] ?? ""}
                      onChange={(e) => updateCell(ri, col.key, e.target.value)}
                      className="w-full px-2 py-1 text-xs rounded border border-stone-200 bg-white text-stone-700 focus:border-orange-400 focus:ring-1 focus:ring-orange-200 outline-none transition"
                      placeholder="—"
                    />
                  </td>
                ))}
                <td className="px-1 py-0.5">
                  <button
                    onClick={() => deleteRow(ri)}
                    className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-400 transition text-xs"
                    title="Delete row"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={addRow}
        className="mt-2 text-xs px-3 py-1.5 rounded-lg text-orange-500 hover:bg-orange-50 transition font-medium"
      >
        + Add Row
      </button>
    </div>
  );
}
