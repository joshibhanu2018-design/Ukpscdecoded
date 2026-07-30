"use client";

import { useState } from "react";
import {
  Newspaper,
  Brain,
  Calendar,
  Tag,
  Target,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

const tabs = ["Current Affairs", "Daily MCQ Quiz"] as const;
type TabType = (typeof tabs)[number];

const currentAffairs = [
  {
    date: "2025-01-28",
    title: "Uttarakhand Cabinet approves new Industrial Policy 2025",
    category: "Polity & Governance",
    relevance: "UKPSC PCS, Lower PCS",
  },
  {
    date: "2025-01-27",
    title: "New Tiger Reserve proposed in Nainital district",
    category: "Geography & Environment",
    relevance: "All UK Exams",
  },
  {
    date: "2025-01-26",
    title: "Republic Day: Uttarakhand tableau showcases Aipan art",
    category: "Art & Culture",
    relevance: "UKPSC PCS, RO/ARO",
  },
  {
    date: "2025-01-25",
    title: "SDRF gets 5 new disaster response units in hill districts",
    category: "Disaster Management",
    relevance: "All UK Exams",
  },
  {
    date: "2025-01-24",
    title: "Uttarakhand GDP growth rate crosses 8.2% — NSSO Report",
    category: "Economy",
    relevance: "UKPSC PCS, Lower PCS",
  },
  {
    date: "2025-01-23",
    title: "Char Dham Yatra 2025 registration portal goes live",
    category: "Current Events",
    relevance: "All UK Exams",
  },
  {
    date: "2025-01-22",
    title: "Uttarakhand signs MoU with France for Smart City project in Dehradun",
    category: "Polity & Governance",
    relevance: "UKPSC PCS",
  },
  {
    date: "2025-01-21",
    title: "New education hub to be established in Haldwani under NEP 2020",
    category: "HRD & Education",
    relevance: "Lower PCS, UKSSSC",
  },
  {
    date: "2025-01-20",
    title: "Kedarnath reconstruction Phase-3 inaugurated by CM",
    category: "Current Events",
    relevance: "All UK Exams",
  },
  {
    date: "2025-01-19",
    title: "Uttarakhand Forest Department launches drone surveillance for fire prevention",
    category: "Geography & Environment",
    relevance: "UKPSC PCS, RO/ARO",
  },
];

const mcqQuestions = [
  {
    id: 1,
    question:
      "Which dynasty is considered the first historical dynasty of Uttarakhand?",
    options: ["Chand Dynasty", "Katyuri Dynasty", "Panwar Dynasty", "Parmar Dynasty"],
    correctAnswer: 1,
  },
  {
    id: 2,
    question: "The Chipko Movement of 1973 originated in which village of Uttarakhand?",
    options: ["Reni", "Mandal", "Gopeshwar", "Chamoli"],
    correctAnswer: 1,
  },
  {
    id: 3,
    question: "Which is the largest glacier of Uttarakhand?",
    options: ["Pindari Glacier", "Gangotri Glacier", "Milam Glacier", "Khatling Glacier"],
    correctAnswer: 1,
  },
  {
    id: 4,
    question:
      "The Uttarakhand State Disaster Management Authority (USDMA) was established under which Act?",
    options: [
      "Disaster Management Act, 2005",
      "Uttarakhand Disaster Act, 2007",
      "National Safety Act, 2010",
      "State Emergency Act, 2003",
    ],
    correctAnswer: 0,
  },
  {
    id: 5,
    question: "Which article of the Indian Constitution led to the formation of Uttarakhand as a separate state?",
    options: ["Article 2", "Article 3", "Article 4", "Article 370"],
    correctAnswer: 1,
  },
];

export default function CurrentAffairsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("Current Affairs");
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});

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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-graphite-950 via-graphite-900 to-graphite-800 text-white">
        <div className="container-custom text-center">
          <div className="inline-flex items-center gap-2 bg-jade-500/10 border border-jade-500/20 rounded-full px-4 py-1.5 mb-6">
            <Newspaper className="w-4 h-4 text-jade-400" />
            <span className="text-sm text-jade-300 font-medium">
              Updated Daily — Auto-synced from Google Sheets
            </span>
          </div>
          <h1 className="heading-xl text-white mb-6 max-w-4xl mx-auto">
            Current Affairs & Daily MCQ —{" "}
            <span className="text-saffron-400">Stay Updated, Stay Ahead</span>
          </h1>
          <p className="text-lg md:text-xl text-graphite-300 max-w-2xl mx-auto leading-relaxed">
            Uttarakhand-specific current affairs curated for UKPSC exams, plus
            daily MCQ quizzes to test and reinforce your preparation.
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
                  {tab === "Current Affairs" ? (
                    <Newspaper className="w-4 h-4" />
                  ) : (
                    <Brain className="w-4 h-4" />
                  )}
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Current Affairs Tab */}
          {activeTab === "Current Affairs" && (
            <div>
              <div className="bg-white rounded-xl shadow-md border border-graphite-100 overflow-hidden">
                {/* Table Header */}
                <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-4 bg-graphite-50 border-b border-graphite-100 text-sm font-semibold text-graphite-600">
                  <div className="col-span-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date
                  </div>
                  <div className="col-span-5">Title</div>
                  <div className="col-span-3 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Category
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Relevance
                  </div>
                </div>

                {/* Table Rows */}
                {currentAffairs.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 border-b border-graphite-50 hover:bg-ivory-50 transition-colors"
                  >
                    <div className="col-span-2 text-sm text-graphite-500 font-medium">
                      <span className="md:hidden font-semibold text-graphite-700">
                        Date:{" "}
                      </span>
                      {formatDate(item.date)}
                    </div>
                    <div className="col-span-5 font-medium text-graphite-900">
                      {item.title}
                    </div>
                    <div className="col-span-3">
                      <span className="inline-block bg-jade-50 text-jade-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                        {item.category}
                      </span>
                    </div>
                    <div className="col-span-2 text-sm text-graphite-600">
                      <span className="md:hidden font-semibold text-graphite-700">
                        Relevance:{" "}
                      </span>
                      {item.relevance}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MCQ Quiz Tab */}
          {activeTab === "Daily MCQ Quiz" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="heading-md text-graphite-900">
                    Today&apos;s Quiz
                  </h3>
                  <p className="text-graphite-600 mt-1">
                    5 questions • Uttarakhand GK
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

              <div className="space-y-6">
                {mcqQuestions.map((q, qIndex) => (
                  <div
                    key={q.id}
                    className="card p-6 bg-white border border-graphite-100"
                  >
                    <div className="flex items-start gap-4 mb-5">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-saffron-100 text-saffron-700 font-bold text-sm flex items-center justify-center">
                        {qIndex + 1}
                      </span>
                      <h4 className="font-display font-semibold text-graphite-900 text-lg">
                        {q.question}
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-12 mb-5">
                      {q.options.map((option, optIndex) => {
                        const isRevealed = revealedAnswers[q.id];
                        const isCorrect = optIndex === q.correctAnswer;
                        const isSelected = selectedOptions[q.id] === optIndex;

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
                            onClick={() => handleSelectOption(q.id, optIndex)}
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

                    <div className="ml-12">
                      {!revealedAnswers[q.id] ? (
                        <button
                          onClick={() => handleCheckAnswer(q.id)}
                          disabled={selectedOptions[q.id] === undefined}
                          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                            selectedOptions[q.id] !== undefined
                              ? "bg-jade-600 hover:bg-jade-700 text-white shadow-sm"
                              : "bg-graphite-200 text-graphite-500 cursor-not-allowed"
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Check Answer
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 text-sm">
                          {selectedOptions[q.id] === q.correctAnswer ? (
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
            </div>
          )}

          {/* Bottom Note */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-white border border-graphite-200 rounded-lg px-5 py-3 text-sm text-graphite-600">
              <RefreshCw className="w-4 h-4 text-jade-600" />
              <span>
                Data updates automatically from our Google Sheet. Last updated:{" "}
                <strong className="text-graphite-800">28 January 2025</strong>
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
