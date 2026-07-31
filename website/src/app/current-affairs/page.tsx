"use client";

import { useState, useEffect } from "react";
import {
  Newspaper,
  Brain,
  Globe,
  Building2,
  Mountain,
  Calendar,
  CalendarDays,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Tag,
  Loader2,
} from "lucide-react";
import currentAffairs from "@content/currentAffairs.json";
import mcqBank from "@content/mcqBank.json";
import {
  buildWeeks,
  groupByCategory,
  type CAItem,
  type CAWeek,
  type RawCAWeek,
} from "@/lib/currentAffairs";

// ===== WEEKLY CURRENT AFFAIRS DATA (from content/currentAffairs.json) =====
// buildWeeks merges structured items with anything pasted into the CMS
// "Quick Publish" box, fills in missing ids/labels, and sorts newest first.
const weeks: CAWeek[] = buildWeeks(currentAffairs.weeks as RawCAWeek[]);

// ===== MCQ TYPES =====
interface MCQQuestion {
  qno: number;
  subject: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: number;
  postedDate: string;
}

// Fallback MCQ data
const fallbackMCQs: MCQQuestion[] = [
  {
    qno: 1,
    subject: "Uttarakhand GK",
    topic: "History",
    question: "Which dynasty is considered the first historical dynasty of Uttarakhand?",
    options: ["Chand Dynasty", "Katyuri Dynasty", "Panwar Dynasty", "Parmar Dynasty"],
    correctAnswer: 1,
    postedDate: "2026-07-28",
  },
  {
    qno: 2,
    subject: "Uttarakhand GK",
    topic: "Environment",
    question: "The Chipko Movement of 1973 originated in which village of Uttarakhand?",
    options: ["Reni", "Mandal", "Gopeshwar", "Chamoli"],
    correctAnswer: 1,
    postedDate: "2026-07-28",
  },
  {
    qno: 3,
    subject: "Uttarakhand GK",
    topic: "Geography",
    question: "Which is the largest glacier of Uttarakhand?",
    options: ["Pindari Glacier", "Gangotri Glacier", "Milam Glacier", "Khatling Glacier"],
    correctAnswer: 1,
    postedDate: "2026-07-28",
  },
  {
    qno: 4,
    subject: "Uttarakhand GK",
    topic: "Polity",
    question: "The Uttarakhand State Disaster Management Authority (USDMA) was established under which Act?",
    options: [
      "Disaster Management Act, 2005",
      "Uttarakhand Disaster Act, 2007",
      "National Safety Act, 2010",
      "State Emergency Act, 2003",
    ],
    correctAnswer: 0,
    postedDate: "2026-07-28",
  },
  {
    qno: 5,
    subject: "Indian Polity",
    topic: "Constitution",
    question: "Which article of the Indian Constitution led to the formation of Uttarakhand as a separate state?",
    options: ["Article 2", "Article 3", "Article 4", "Article 370"],
    correctAnswer: 1,
    postedDate: "2026-07-28",
  },
];

// Questions from the curated local bank (content/mcqBank.json)
const bankMCQs: MCQQuestion[] = (mcqBank.questions || []).map((q, i) => ({
  qno: 100000 + i,
  subject: q.subject,
  topic: q.topic,
  question: q.question,
  options: q.options,
  correctAnswer: q.correctAnswer,
  postedDate: "",
}));

// Day index that rolls over at 08:00 IST every morning.
function getDailyIndex(): number {
  const IST_OFFSET = 5.5 * 60 * 60 * 1000; // IST = UTC+5:30
  const EIGHT_AM = 8 * 60 * 60 * 1000;
  const shifted = Date.now() + IST_OFFSET - EIGHT_AM;
  return Math.floor(shifted / (24 * 60 * 60 * 1000));
}

// Combine the Google Sheet + local bank, de-duplicate by question text,
// then deterministically pick today's 5 (rotates daily, repeats through the pool).
function pickDailyFive(sheetQuestions: MCQQuestion[]): MCQQuestion[] {
  const combined = [...sheetQuestions, ...bankMCQs];
  const seen = new Set<string>();
  const pool = combined.filter((q) => {
    const key = q.question.trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  if (pool.length === 0) return [];
  const start = (getDailyIndex() * 5) % pool.length;
  return Array.from({ length: Math.min(5, pool.length) }, (_, i) => pool[(start + i) % pool.length]);
}

// ===== CSV PARSER =====
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let current = "";
  let inQuotes = false;
  let row: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(current.trim());
      current = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (current || row.length > 0) {
        row.push(current.trim());
        rows.push(row);
        row = [];
        current = "";
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

// ===== TABS =====
const tabs = ["Weekly Current Affairs", "Daily MCQ"] as const;
type TabType = (typeof tabs)[number];

const categoryIcons: Record<string, typeof Mountain> = {
  Uttarakhand: Mountain,
  National: Building2,
  International: Globe,
};

const categoryColors: Record<string, string> = {
  Uttarakhand: "bg-jade-50 text-jade-700 border-jade-200",
  National: "bg-saffron-50 text-saffron-700 border-saffron-200",
  International: "bg-blue-50 text-blue-700 border-blue-200",
};

export default function CurrentAffairsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("Weekly Current Affairs");
  const [activeWeekId, setActiveWeekId] = useState<string>(weeks[0]?.id ?? "");
  const [mcqQuestions, setMcqQuestions] = useState<MCQQuestion[]>([]);
  const [loadingMCQ, setLoadingMCQ] = useState(false);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});

  // Open the Daily MCQ tab directly when arriving via /current-affairs#daily-quiz
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#daily-quiz") {
      setActiveTab("Daily MCQ");
    }
  }, []);

  // Build the daily MCQ set when the Daily MCQ tab is active
  useEffect(() => {
    if (activeTab === "Daily MCQ" && mcqQuestions.length === 0) {
      fetchMCQs();
    }
  }, [activeTab]);

  async function fetchMCQs() {
    setLoadingMCQ(true);
    try {
      const SHEET_URL =
        "https://docs.google.com/spreadsheets/d/1feVIs-h8MCX9-cBKaIgJP4Ayb9m9FuUAgjhT2JmB3bM/export?format=csv&gid=0";
      const res = await fetch(SHEET_URL);
      const text = await res.text();
      const rows = parseCSV(text);

      const questions: MCQQuestion[] = rows
        .slice(1)
        .map((row) => {
          const answer = row[8] || "";
          const correctLetter = answer.charAt(0).toUpperCase();
          const correctIndex = ["A", "B", "C", "D"].indexOf(correctLetter);

          return {
            qno: parseInt(row[0]) || 0,
            subject: row[1] || "",
            topic: row[2] || "",
            question: row[3] || "",
            options: [row[4] || "", row[5] || "", row[6] || "", row[7] || ""],
            correctAnswer: correctIndex >= 0 ? correctIndex : 0,
            postedDate: row[10] || row[9] || "",
          };
        })
        .filter((q) => q.question.length > 0);

      // Combine the sheet with the local bank and pick today's rotating 5.
      const daily = pickDailyFive(questions);
      setMcqQuestions(daily.length > 0 ? daily : fallbackMCQs);
    } catch (error) {
      console.error("Failed to fetch MCQs:", error);
      // Sheet unavailable — still rotate through the local bank.
      const daily = pickDailyFive([]);
      setMcqQuestions(daily.length > 0 ? daily : fallbackMCQs);
    } finally {
      setLoadingMCQ(false);
    }
  }

  const handleCheckAnswer = (questionId: number) => {
    setRevealedAnswers((prev) => ({ ...prev, [questionId]: true }));
  };

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (!revealedAnswers[questionId]) {
      setSelectedOptions((prev) => ({ ...prev, [questionId]: optionIndex }));
    }
  };

  const resetQuiz = () => {
    setRevealedAnswers({});
    setSelectedOptions({});
  };

  // Active week + group its items by category
  const activeWeek = weeks.find((w) => w.id === activeWeekId) ?? weeks[0];
  const activeItems = activeWeek?.items ?? [];
  const groupedAffairs = groupByCategory(activeItems);

  return (
    <div>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-graphite-950 via-graphite-900 to-graphite-800 text-white">
        <div className="container-custom text-center">
          <div className="inline-flex items-center gap-2 bg-jade-500/10 border border-jade-500/20 rounded-full px-4 py-1.5 mb-6">
            <Newspaper className="w-4 h-4 text-jade-400" />
            <span className="text-sm text-jade-300 font-medium">
              Updated Weekly — From Our Monthly PDF
            </span>
          </div>
          <h1 className="heading-xl text-white mb-6 max-w-4xl mx-auto">
            Current Affairs & Daily PYQ —{" "}
            <span className="text-saffron-400">Stay Updated, Stay Ahead</span>
          </h1>
          <p className="text-lg md:text-xl text-graphite-300 max-w-2xl mx-auto leading-relaxed">
            Weekly current affairs curated for UKPSC exams, plus a fresh daily MCQ
            set every morning to test your preparation.
          </p>
        </div>
      </section>

      {/* Tabs + Content */}
      <section className="section-padding bg-ivory-50">
        <div className="container-custom">
          {/* Tab Switcher */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-white rounded-xl p-1.5 shadow-md border border-graphite-100">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-saffron-500 text-white shadow-md"
                      : "text-graphite-600 hover:text-graphite-900 hover:bg-graphite-50"
                  }`}
                >
                  {tab === "Weekly Current Affairs" ? (
                    <Newspaper className="w-4 h-4" />
                  ) : (
                    <Brain className="w-4 h-4" />
                  )}
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* ===== WEEKLY CURRENT AFFAIRS TAB ===== */}
          {activeTab === "Weekly Current Affairs" && (
            <div>
              {/* Week Sub-Tabs (latest on top / first) */}
              {weeks.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {weeks.map((week) => (
                    <button
                      key={week.id}
                      onClick={() => setActiveWeekId(week.id)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 ${
                        activeWeekId === week.id
                          ? "bg-jade-600 text-white border-jade-600 shadow-md"
                          : "bg-white text-graphite-600 border-graphite-200 hover:border-jade-300 hover:text-graphite-900"
                      }`}
                    >
                      <CalendarDays className="w-4 h-4" />
                      {week.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Header for the active week */}
              {activeWeek && (
                <div className="text-center mb-10">
                  {activeWeek.gistNote && (
                    <div className="inline-flex items-center gap-2 bg-saffron-500/10 border border-saffron-200 rounded-full px-4 py-1.5 text-sm text-saffron-700 font-medium mb-3">
                      <Newspaper className="w-4 h-4" />
                      {activeWeek.gistNote}
                    </div>
                  )}
                  <div className="flex justify-center">
                    <div className="inline-flex items-center gap-2 bg-white border border-graphite-200 rounded-lg px-4 py-2 text-sm text-graphite-600">
                      <Calendar className="w-4 h-4 text-saffron-500" />
                      <span>
                        <strong className="text-graphite-800">{activeWeek.label}</strong> —{" "}
                        {activeItems.length} Headlines
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Category Sections */}
              <div className="space-y-10">
                {(Object.entries(groupedAffairs) as [string, CAItem[]][])
                  .filter(([, items]) => items.length > 0)
                  .map(([category, items]) => {
                    const IconComponent = categoryIcons[category] || Newspaper;
                    const colorClass = categoryColors[category] || "bg-graphite-50 text-graphite-700";

                    return (
                      <div key={category}>
                        {/* Section Header */}
                        <div className="flex items-center gap-3 mb-5">
                          <div
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-semibold text-sm ${colorClass}`}
                          >
                            <IconComponent className="w-4 h-4" />
                            {category}
                            <span className="ml-1 opacity-70">({items.length})</span>
                          </div>
                          <div className="flex-1 h-px bg-graphite-200"></div>
                        </div>

                        {/* Items Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {items.map((item, idx) => (
                            <div
                              key={`${category}-${idx}`}
                              className="flex items-start gap-3 bg-white rounded-lg p-4 border border-graphite-100 hover:border-saffron-200 hover:shadow-sm transition-all duration-200"
                            >
                              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-saffron-100 text-saffron-700 font-bold text-xs flex items-center justify-center">
                                {idx + 1}
                              </span>
                              <div>
                                <p className="font-semibold text-graphite-900 text-sm leading-relaxed">
                                  {item.title}
                                </p>
                                {item.context && (
                                  <p className="text-sm text-graphite-600 mt-1.5 leading-relaxed">
                                    {item.context}
                                  </p>
                                )}
                                {item.source && (
                                  <span className="text-xs text-graphite-400 mt-2 inline-block italic">
                                    {item.source}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ===== DAILY MCQ TAB ===== */}
          {activeTab === "Daily MCQ" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="heading-md text-graphite-900">
                    Daily MCQ
                  </h3>
                  <p className="text-graphite-600 mt-1">
                    5 fresh questions every morning — mixed from our question bank and Google Sheet
                  </p>
                </div>
                <button
                  onClick={resetQuiz}
                  className="btn-outline inline-flex items-center gap-2 text-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset Quiz
                </button>
              </div>

              {/* Loading State */}
              {loadingMCQ && (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 text-saffron-500 animate-spin mb-4" />
                  <p className="text-graphite-600 font-medium">
                    Loading today&apos;s questions...
                  </p>
                </div>
              )}

              {/* Quiz Questions */}
              {!loadingMCQ && mcqQuestions.length > 0 && (
                <div className="space-y-6">
                  {mcqQuestions.map((q, qIndex) => (
                    <div
                      key={q.qno}
                      className="card p-6 bg-white border border-graphite-100"
                    >
                      {/* Question Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-saffron-100 text-saffron-700 font-bold text-sm flex items-center justify-center">
                          {qIndex + 1}
                        </span>
                        <div className="flex-1">
                          <h4 className="font-display font-semibold text-graphite-900 text-lg">
                            {q.question}
                          </h4>
                          {/* Topic & Subject badges */}
                          <div className="flex flex-wrap gap-2 mt-2">
                            {q.subject && (
                              <span className="inline-flex items-center gap-1 text-xs font-medium bg-jade-50 text-jade-700 px-2.5 py-1 rounded-full">
                                <Tag className="w-3 h-3" />
                                {q.subject}
                              </span>
                            )}
                            {q.topic && (
                              <span className="inline-flex items-center gap-1 text-xs font-medium bg-ivory-200 text-graphite-700 px-2.5 py-1 rounded-full">
                                {q.topic}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Options */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-12 mb-5">
                        {q.options.map((option, optIndex) => {
                          const isRevealed = revealedAnswers[q.qno];
                          const isCorrect = optIndex === q.correctAnswer;
                          const isSelected = selectedOptions[q.qno] === optIndex;

                          let optionClass =
                            "border border-graphite-200 bg-graphite-50 text-graphite-700 hover:border-saffron-300 hover:bg-saffron-50 cursor-pointer";

                          if (isSelected && !isRevealed) {
                            optionClass =
                              "border-2 border-saffron-400 bg-saffron-50 text-graphite-900";
                          }

                          if (isRevealed) {
                            if (isCorrect) {
                              optionClass =
                                "border-2 border-jade-500 bg-jade-50 text-jade-800";
                            } else if (isSelected && !isCorrect) {
                              optionClass =
                                "border-2 border-red-400 bg-red-50 text-red-700";
                            } else {
                              optionClass =
                                "border border-graphite-200 bg-graphite-50 text-graphite-500";
                            }
                          }

                          return (
                            <button
                              key={optIndex}
                              onClick={() => handleSelectOption(q.qno, optIndex)}
                              disabled={isRevealed}
                              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-medium transition-all duration-200 ${optionClass}`}
                            >
                              <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs flex-shrink-0">
                                {isRevealed && isCorrect ? (
                                  <CheckCircle2 className="w-4 h-4 text-jade-600" />
                                ) : isRevealed && isSelected && !isCorrect ? (
                                  <XCircle className="w-4 h-4 text-red-500" />
                                ) : (
                                  String.fromCharCode(65 + optIndex)
                                )}
                              </span>
                              {option}
                            </button>
                          );
                        })}
                      </div>

                      {/* Check Answer Button */}
                      <div className="ml-12">
                        {!revealedAnswers[q.qno] ? (
                          <button
                            onClick={() => handleCheckAnswer(q.qno)}
                            disabled={selectedOptions[q.qno] === undefined}
                            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                              selectedOptions[q.qno] !== undefined
                                ? "bg-jade-600 hover:bg-jade-700 text-white shadow-sm"
                                : "bg-graphite-200 text-graphite-500 cursor-not-allowed"
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Check Answer
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 text-sm">
                            {selectedOptions[q.qno] === q.correctAnswer ? (
                              <span className="inline-flex items-center gap-1.5 text-jade-700 font-semibold bg-jade-50 px-3 py-1.5 rounded-lg">
                                <CheckCircle2 className="w-4 h-4" />
                                Correct!
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-red-600 font-semibold bg-red-50 px-3 py-1.5 rounded-lg">
                                <XCircle className="w-4 h-4" />
                                Incorrect — Correct answer:{" "}
                                {q.options[q.correctAnswer]}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!loadingMCQ && mcqQuestions.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-graphite-500 text-lg">
                    No questions available. Please check back later.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Bottom Note */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-white border border-graphite-200 rounded-lg px-5 py-3 text-sm text-graphite-600">
              <RefreshCw className="w-4 h-4 text-jade-600" />
              <span>
                {activeTab === "Weekly Current Affairs"
                  ? "Weekly current affairs — a new gist every Sunday"
                  : "New MCQ set every day at 8 AM IST — combined from our question bank and Google Sheet"}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
