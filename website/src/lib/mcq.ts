export interface MCQQuestion {
  qno: number;
  subject: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-3 index
  postedDate: string;
}

export async function fetchMCQsFromSheet(): Promise<MCQQuestion[]> {
  const SHEET_URL =
    'https://docs.google.com/spreadsheets/d/1feVIs-h8MCX9-cBKaIgJP4Ayb9m9FuUAgjhT2JmB3bM/export?format=csv&gid=0';

  try {
    const res = await fetch(SHEET_URL, { next: { revalidate: 3600 } });
    const text = await res.text();

    // Parse CSV properly (handle commas in quoted fields)
    const rows = parseCSV(text);

    // Skip header row
    const questions: MCQQuestion[] = rows
      .slice(1)
      .map((row) => {
        const answer = row[8] || ''; // "B) Katyuri" format
        const correctLetter = answer.charAt(0).toUpperCase();
        const correctIndex = ['A', 'B', 'C', 'D'].indexOf(correctLetter);

        return {
          qno: parseInt(row[0]) || 0,
          subject: row[1] || '',
          topic: row[2] || '',
          question: row[3] || '',
          options: [row[4] || '', row[5] || '', row[6] || '', row[7] || ''],
          correctAnswer: correctIndex >= 0 ? correctIndex : 0,
          postedDate: row[10] || row[9] || '',
        };
      })
      .filter((q) => q.question.length > 0);

    return questions;
  } catch (error) {
    console.error('Failed to fetch MCQs from sheet:', error);
    return [];
  }
}

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let current = '';
  let inQuotes = false;
  let row: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      row.push(current.trim());
      current = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (current || row.length > 0) {
        row.push(current.trim());
        rows.push(row);
        row = [];
        current = '';
      }
    } else {
      current += char;
    }
  }
  if (current || row.length > 0) {
    row.push(current.trim());
    rows.push(row);
  }
  return rows;
}
