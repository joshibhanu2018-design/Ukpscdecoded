"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { CheckCircle2, Loader2, Upload, XCircle } from "lucide-react";

type ParsedQuestion = {
  questionId: string;
  subject: string;
  topic: string;
  subtopic: string;
  difficulty: string;
  year: string;
  questionHindi: string;
  questionEnglish: string;
  optionAHindi: string;
  optionAEnglish: string;
  optionBHindi: string;
  optionBEnglish: string;
  optionCHindi: string;
  optionCEnglish: string;
  optionDHindi: string;
  optionDEnglish: string;
  correctAnswer: string;
  explanationHindi: string;
  explanationEnglish: string;
};

type ImportResult = { imported: number; rejected: { row: number; reason: string }[] };

// Expected column headers in the uploaded sheet (case-insensitive, spaces ignored).
const COLUMN_MAP: Record<string, keyof ParsedQuestion> = {
  questionid: "questionId",
  subject: "subject",
  topic: "topic",
  subtopic: "subtopic",
  difficulty: "difficulty",
  year: "year",
  questionhindi: "questionHindi",
  questionenglish: "questionEnglish",
  optionahindi: "optionAHindi",
  optionaenglish: "optionAEnglish",
  optionbhindi: "optionBHindi",
  optionbenglish: "optionBEnglish",
  optionchindi: "optionCHindi",
  optionchenglish: "optionCEnglish",
  optiondhindi: "optionDHindi",
  optiondenglish: "optionDEnglish",
  correctanswer: "correctAnswer",
  explanationhindi: "explanationHindi",
  explanationenglish: "explanationEnglish",
};

function normalizeRow(raw: Record<string, unknown>): ParsedQuestion {
  const row: Partial<ParsedQuestion> = {};
  for (const [key, value] of Object.entries(raw)) {
    const field = COLUMN_MAP[key.toLowerCase().replace(/\s+/g, "")];
    if (field) row[field] = String(value ?? "").trim();
  }
  return {
    questionId: row.questionId || "",
    subject: row.subject || "",
    topic: row.topic || "",
    subtopic: row.subtopic || "",
    difficulty: row.difficulty || "",
    year: row.year || "",
    questionHindi: row.questionHindi || "",
    questionEnglish: row.questionEnglish || "",
    optionAHindi: row.optionAHindi || "",
    optionAEnglish: row.optionAEnglish || "",
    optionBHindi: row.optionBHindi || "",
    optionBEnglish: row.optionBEnglish || "",
    optionCHindi: row.optionCHindi || "",
    optionCEnglish: row.optionCEnglish || "",
    optionDHindi: row.optionDHindi || "",
    optionDEnglish: row.optionDEnglish || "",
    correctAnswer: (row.correctAnswer || "").toUpperCase(),
    explanationHindi: row.explanationHindi || "",
    explanationEnglish: row.explanationEnglish || "",
  };
}

export default function ExcelParser() {
  const [rows, setRows] = useState<ParsedQuestion[]>([]);
  const [fileName, setFileName] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResult(null);
    setParseError(null);
    setFileName(file.name);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });

      if (raw.length === 0) {
        setParseError("The sheet appears to be empty.");
        return;
      }

      setRows(raw.map(normalizeRow));
    } catch {
      setParseError("Could not read this file. Make sure it's a valid .xlsx or .csv file.");
    }
  };

  const handleImport = async () => {
    setImporting(true);
    setResult(null);

    try {
      const res = await fetch("/api/admin/import-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions: rows }),
      });
      const data = await res.json();

      if (!res.ok) {
        setParseError(data.error || "Import failed.");
        return;
      }

      setResult(data);
    } catch {
      setParseError("Network error during import.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-dashed border-graphite-700 bg-graphite-800/50 p-6 text-center">
        <Upload className="mx-auto mb-2 h-8 w-8 text-saffron-400" />
        <label className="cursor-pointer text-sm text-graphite-300">
          <span className="font-medium text-saffron-400">Click to upload</span> an .xlsx or .csv file
          <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} className="hidden" />
        </label>
        <p className="mt-1 text-xs text-graphite-300">
          Columns: QuestionID, Subject, Topic, Subtopic, Difficulty, Year, QuestionHindi,
          QuestionEnglish, OptionAHindi, OptionAEnglish, OptionBHindi, OptionBEnglish,
          OptionCHindi, OptionCEnglish, OptionDHindi, OptionDEnglish, CorrectAnswer (A/B/C/D),
          ExplanationHindi, ExplanationEnglish
        </p>
        {fileName && <p className="mt-2 text-xs text-graphite-300">Selected: {fileName}</p>}
      </div>

      {parseError && (
        <div className="flex items-center gap-2 rounded-lg border border-danger-500/30 bg-danger-500/10 px-4 py-2.5 text-sm text-danger-300">
          <XCircle className="h-4 w-4 flex-shrink-0" /> {parseError}
        </div>
      )}

      {rows.length > 0 && !result && (
        <>
          <div className="overflow-x-auto rounded-lg border border-graphite-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-graphite-800 text-graphite-300">
                <tr>
                  <th className="px-3 py-2">Subject</th>
                  <th className="px-3 py-2">Question (EN)</th>
                  <th className="px-3 py-2">Correct</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-graphite-800 text-graphite-300">
                {rows.slice(0, 8).map((r, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2">{r.subject}</td>
                    <td className="max-w-xs truncate px-3 py-2">{r.questionEnglish}</td>
                    <td className="px-3 py-2">{r.correctAnswer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length > 8 && (
              <p className="border-t border-graphite-800 px-3 py-2 text-xs text-graphite-300">
                +{rows.length - 8} more rows
              </p>
            )}
          </div>

          <button
            onClick={handleImport}
            disabled={importing}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-saffron-400 px-4 py-2.5 text-sm font-semibold text-graphite-900 transition-colors hover:bg-saffron-300 disabled:opacity-60"
          >
            {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Import {rows.length} Question{rows.length === 1 ? "" : "s"}
          </button>
        </>
      )}

      {result && (
        <div className="space-y-2 rounded-lg border border-success-500/30 bg-success-500/10 px-4 py-3 text-sm text-success-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            Imported {result.imported} question{result.imported === 1 ? "" : "s"}.
          </div>
          {result.rejected.length > 0 && (
            <ul className="ml-6 list-disc text-saffron-300">
              {result.rejected.map((r, i) => (
                <li key={i}>
                  Row {r.row}: {r.reason}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
