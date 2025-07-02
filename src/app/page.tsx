"use client";
import React, { useState } from "react";
import {
  parseCSV,
  parseTSV,
  toCSV,
  toTSV,
  parseExcel,
  toExcel,
} from "./utils";

const fileTypes = [
  { label: "CSV", value: "csv" },
  { label: "TSV", value: "tsv" },
  { label: "Excel", value: "excel" },
];

export default function Home() {
  const [inputType, setInputType] = useState("csv");
  const [outputType, setOutputType] = useState("tsv");
  const [table, setTable] = useState<string[][]>([]);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    try {
      let data: string[][] = [];
      if (inputType === "csv") {
        const text = await file.text();
        data = parseCSV(text);
      } else if (inputType === "tsv") {
        const text = await file.text();
        data = parseTSV(text);
      } else if (inputType === "excel") {
        data = await parseExcel(file);
      }
      setTable(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to parse file.");
    }
  };

  const handleDownload = () => {
    if (!table.length) return;
    if (outputType === "csv") {
      const blob = new Blob([toCSV(table)], { type: "text/csv" });
      downloadBlob(blob, fileName.replace(/\.[^.]+$/, ".csv"));
    } else if (outputType === "tsv") {
      const blob = new Blob([toTSV(table)], { type: "text/tab-separated-values" });
      downloadBlob(blob, fileName.replace(/\.[^.]+$/, ".tsv"));
    } else if (outputType === "excel") {
      toExcel(table, fileName.replace(/\.[^.]+$/, ".xlsx"));
    }
  };

  function downloadBlob(blob: Blob, name: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800 text-foreground flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl bg-white/80 dark:bg-zinc-900/80 rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-8 border border-zinc-200 dark:border-zinc-800 backdrop-blur-md">
        <h1 className="text-4xl font-bold tracking-tight text-center">CSV · TSV · Excel Converter</h1>
        <div className="w-full flex flex-col md:flex-row md:items-end gap-6 md:gap-4 justify-center">
          <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="font-semibold text-zinc-700 dark:text-zinc-200">Input Type</label>
            <select
              className="border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 bg-zinc-100 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={inputType}
              onChange={(e) => setInputType(e.target.value)}
            >
              {fileTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2 w-full md:w-2/5">
            <label className="font-semibold text-zinc-700 dark:text-zinc-200">Upload File</label>
            <input
              type="file"
              accept={
                inputType === "csv"
                  ? ".csv"
                  : inputType === "tsv"
                  ? ".tsv"
                  : ".xls,.xlsx"
              }
              className="border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 bg-zinc-100 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={handleFile}
            />
          </div>
          <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="font-semibold text-zinc-700 dark:text-zinc-200">Output Type</label>
            <select
              className="border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 bg-zinc-100 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={outputType}
              onChange={(e) => setOutputType(e.target.value)}
            >
              {fileTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-center">
          <button
            className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            onClick={handleDownload}
            disabled={!table.length}
          >
            Download
          </button>
        </div>
        {error && <div className="text-red-500 text-center w-full">{error}</div>}
        {table.length > 0 && (
          <div className="overflow-x-auto w-full max-w-3xl border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow bg-white/90 dark:bg-zinc-900/90">
            <table className="min-w-full border-collapse text-zinc-800 dark:text-zinc-100 text-base">
              <tbody>
                {table.map((row, i) => (
                  <tr key={i} className="border-b border-zinc-100 dark:border-zinc-800 last:border-b-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition">
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className="px-4 py-3 border-r border-zinc-100 dark:border-zinc-800 last:border-r-0 whitespace-pre-line max-w-xs truncate"
                        title={cell}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {table.length > 20 && (
              <div className="text-xs text-center p-2 text-zinc-500 dark:text-zinc-400">
                Showing first 20 rows of {table.length}
              </div>
            )}
          </div>
        )}
      </div>
      <footer className="mt-10 text-zinc-400 text-xs text-center select-none">
        &copy; {new Date().getFullYear()} CSV/TSV/Excel Converter.
      </footer>
    </div>
  );
}
