"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, Brain, RotateCcw, ArrowRight, Users } from "lucide-react";
import quiz from "@content/quiz.json";

export default function HomeQuiz() {
  const questions = quiz.questions;
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[current];
  const isLast = current === questions.length - 1;

  const handleSelect = (i: number) => {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
    if (i === q.correctIndex) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (isLast) {
      setFinished(true);
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
    setRevealed(false);
  };

  const restart = () => {
    setCurrent(0);
    setSelected(null);
    setRevealed(false);
    setScore(0);
    setFinished(false);
  };


  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="bg-white rounded-2xl border border-graphite-100 shadow-lg p-8 max-w-2xl mx-auto text-center">
        <div className="w-16 h-16 rounded-full bg-saffron-100 flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8 text-saffron-600" />
        </div>
        <h3 className="heading-md text-graphite-900 mb-2">
          You scored {score}/{questions.length}
        </h3>
        <p className="text-graphite-600 mb-6">
          {pct >= 80 ? "Excellent! You're exam-ready on these." : pct >= 40 ? "Good start — consistent daily practice is the key." : "Every topper started here. Keep practising daily!"}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={restart} className="btn-outline inline-flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
          <Link href="/current-affairs" className="btn-primary inline-flex items-center justify-center gap-2">
            Daily MCQ Practice <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-graphite-100 shadow-lg p-6 sm:p-8 max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-graphite-500 uppercase tracking-wider">
          Question {current + 1} of {questions.length}
        </span>
        <span className="text-xs font-semibold text-jade-600 flex items-center gap-1">
          <Users className="w-3.5 h-3.5" /> {q.solvedPct}% got this right
        </span>
      </div>
      <div className="w-full h-1.5 bg-graphite-100 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-saffron-500 rounded-full transition-all duration-300"
          style={{ width: `${((current + (revealed ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      <h3 className="text-lg font-display font-semibold text-graphite-900 mb-5">{q.question}</h3>

      <div className="space-y-3">
        {q.options.map((opt, i) => {
          const isCorrect = i === q.correctIndex;
          const isChosen = i === selected;
          let cls = "border-graphite-200 hover:border-saffron-300 hover:bg-saffron-50";
          if (revealed && isCorrect) cls = "border-jade-400 bg-jade-50";
          else if (revealed && isChosen && !isCorrect) cls = "border-red-300 bg-red-50";
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={revealed}
              className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all flex items-center justify-between gap-2 text-sm text-graphite-800 ${cls}`}
            >
              <span>{opt}</span>
              {revealed && isCorrect && <CheckCircle2 className="w-5 h-5 text-jade-600 flex-shrink-0" />}
              {revealed && isChosen && !isCorrect && <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
            </button>
          );
        })}
      </div>

      {revealed && (
        <div className="mt-5 bg-ivory-100 border border-ivory-300 rounded-lg p-4">
          <p className="text-sm text-graphite-700"><span className="font-semibold">Explanation:</span> {q.explanation}</p>
          <button onClick={handleNext} className="btn-primary mt-4 inline-flex items-center gap-2 text-sm">
            {isLast ? "See Result" : "Next Question"} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
