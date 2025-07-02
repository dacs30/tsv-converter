// Utility functions for parsing and converting CSV, TSV, and Excel files
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export function parseCSV(content: string): string[][] {
  return Papa.parse(content, { skipEmptyLines: true }).data as string[][];
}

export function parseTSV(content: string): string[][] {
  return Papa.parse(content, { delimiter: '\t', skipEmptyLines: true }).data as string[][];
}

export function toCSV(data: string[][]): string {
  return Papa.unparse(data);
}

export function toTSV(data: string[][]): string {
  return Papa.unparse(data, { delimiter: '\t' });
}

export function parseExcel(file: File): Promise<string[][]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 });
      resolve(json);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export function toExcel(data: string[][], fileName: string = 'table.xlsx') {
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, fileName);
}
