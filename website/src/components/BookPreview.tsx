"use client";

import { useState } from "react";
import { BookOpen, X, Lock, ChevronRight } from "lucide-react";

interface Preview {
  label: string;
  title: string;
  content: string;
}

interface BookPreviewProps {
  heading: string;
  subtext: string;
  previews: Preview[];
  price: number;
}

export default function BookPreview({ heading, subtext, previews, price }: BookPreviewProps) {
  const [active, setActive] = useState<number | null>(null);

  if (!previews || previews.length === 0) return null;

  return (
    <section className="section-padding bg-white border-t border-graphite-100">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h2 className="heading-lg text-graphite-900 mb-3">{heading}</h2>
          <p className="text-graphite-600 max-w-2xl mx-auto">{subtext}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {previews.map((p, i) => (
            <button
              key={p.title}
              onClick={() => setActive(i)}
              className="card bg-white border border-graphite-100 hover:border-saffron-300 p-6 text-left group transition-all"
            >
              <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-jade-100 text-jade-700 mb-3">
                Free Sample
              </span>
              <p className="text-xs text-graphite-400 uppercase tracking-wide mb-1">{p.label}</p>
              <h3 className="font-display font-semibold text-graphite-900 mb-3 group-hover:text-saffron-600 transition-colors">
                {p.title}
              </h3>
              <span className="text-saffron-500 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                Read sample <ChevronRight className="w-4 h-4" />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      {active !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between gap-3 p-5 border-b border-graphite-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-saffron-500" />
                <div>
                  <p className="text-xs text-graphite-400 uppercase tracking-wide">{previews[active].label}</p>
                  <h3 className="font-display font-semibold text-graphite-900">{previews[active].title}</h3>
                </div>
              </div>
              <button
                onClick={() => setActive(null)}
                aria-label="Close"
                className="w-8 h-8 rounded-full bg-graphite-100 hover:bg-graphite-200 flex items-center justify-center flex-shrink-0"
              >
                <X className="w-4 h-4 text-graphite-600" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="prose prose-sm max-w-none text-graphite-700 whitespace-pre-line">
                {previews[active].content}
              </div>
            </div>
            <div className="p-5 border-t border-graphite-100 bg-ivory-50">
              <div className="flex items-center gap-2 text-sm text-graphite-500 mb-3">
                <Lock className="w-4 h-4 text-saffron-500" />
                This is a free sample. Unlock all 28 chapters in the full guidebook.
              </div>
              <a href="#order-form" onClick={() => setActive(null)} className="btn-primary w-full inline-flex items-center justify-center gap-2">
                Get the Full Book — ₹{price}
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
