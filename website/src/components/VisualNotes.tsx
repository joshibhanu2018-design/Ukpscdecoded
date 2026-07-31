import {
  Trophy,
  Layers,
  PenLine,
  Waves,
} from "lucide-react";

// 1) Mains marks distribution — where the 1500 written marks come from
const marksData = [
  { label: "Uttarakhand GS-V + GS-VI", marks: 400, color: "bg-saffron-500" },
  { label: "National GS I-IV", marks: 800, color: "bg-jade-500" },
  { label: "General Hindi", marks: 150, color: "bg-blue-500" },
  { label: "Essay (incl. UK Section C)", marks: 150, color: "bg-purple-500" },
];

export function MarksDistribution() {
  const total = 1500;
  return (
    <div className="bg-white rounded-xl border border-graphite-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-saffron-500" />
        <h3 className="font-display font-semibold text-graphite-900">Where Mains Marks Come From (1500)</h3>
      </div>
      <div className="space-y-3">
        {marksData.map((d) => (
          <div key={d.label}>
            <div className="flex justify-between text-xs text-graphite-600 mb-1">
              <span>{d.label}</span>
              <span className="font-semibold">{d.marks} marks</span>
            </div>
            <div className="w-full h-3 bg-graphite-100 rounded-full overflow-hidden">
              <div className={`h-full ${d.color} rounded-full`} style={{ width: `${(d.marks / total) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-graphite-500 mt-4">
        <span className="font-semibold text-saffron-600">450+ marks</span> (GS-V, GS-VI + Essay Section C) are Uttarakhand-specific — nearly a third of the written total.
      </p>
    </div>
  );
}

// 2) Exam stages
const stages = [
  { name: "Prelims", detail: "300 marks · Qualifying only", width: "w-full" },
  { name: "Mains", detail: "1500 marks · Decides merit", width: "w-4/5" },
  { name: "Interview", detail: "150 marks · Personality test", width: "w-3/5" },
];

export function ExamStages() {
  return (
    <div className="bg-white rounded-xl border border-graphite-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Layers className="w-5 h-5 text-jade-500" />
        <h3 className="font-display font-semibold text-graphite-900">The 3 Stages (Total 1650)</h3>
      </div>
      <div className="space-y-2.5">
        {stages.map((s, i) => (
          <div key={s.name} className={`${s.width} mx-auto`}>
            <div className={`rounded-lg p-3 text-center text-white ${i === 0 ? "bg-graphite-400" : i === 1 ? "bg-saffron-500" : "bg-jade-600"}`}>
              <p className="font-display font-bold text-sm">{s.name}</p>
              <p className="text-[11px] opacity-90">{s.detail}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-graphite-500 mt-4 text-center">
        Prelims score carries <span className="font-semibold">zero weight</span> in final selection — it only qualifies you for Mains.
      </p>
    </div>
  );
}


// 3) Uttarakhand dynasty / rule timeline
const timeline = [
  { era: "Ancient", label: "Kunindas & Yaudheyas" },
  { era: "6th-11th c.", label: "Katyuri Dynasty (Kartikeyapura)" },
  { era: "Medieval", label: "Parmar (Garhwal) + Chand (Kumaon)" },
  { era: "1790-1815", label: "Gorkha Invasion & Rule" },
  { era: "1815+", label: "British Rule (Treaty of Sugauli)" },
  { era: "1949", label: "Tehri State Merger" },
  { era: "9 Nov 2000", label: "Uttarakhand Statehood" },
];

export function DynastyTimeline() {
  return (
    <div className="bg-white rounded-xl border border-graphite-100 p-5">
      <div className="flex items-center gap-2 mb-5">
        <Waves className="w-5 h-5 text-saffron-500" />
        <h3 className="font-display font-semibold text-graphite-900">Uttarakhand Through Time</h3>
      </div>
      <div className="relative pl-6">
        <div className="absolute left-2 top-1 bottom-1 w-0.5 bg-gradient-to-b from-saffron-300 via-jade-300 to-graphite-300" />
        <div className="space-y-4">
          {timeline.map((t) => (
            <div key={t.label} className="relative">
              <div className="absolute -left-[18px] top-1 w-3 h-3 rounded-full bg-saffron-500 border-2 border-white shadow" />
              <p className="text-[11px] font-bold text-saffron-600 uppercase tracking-wide">{t.era}</p>
              <p className="text-sm text-graphite-800">{t.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 4) 4-Level revision pyramid
const pyramid = [
  { level: "Same-day", detail: "30-min nightly recap", w: "w-2/5" },
  { level: "Next-day", detail: "Quick reinforcing pass", w: "w-3/5" },
  { level: "Weekly", detail: "1 day for the week's material", w: "w-4/5" },
  { level: "Monthly", detail: "1 day to consolidate all", w: "w-full" },
];

export function RevisionPyramid() {
  return (
    <div className="bg-white rounded-xl border border-graphite-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Layers className="w-5 h-5 text-jade-500" />
        <h3 className="font-display font-semibold text-graphite-900">4-Level Revision Pyramid</h3>
      </div>
      <div className="space-y-2 flex flex-col items-center">
        {pyramid.map((p, i) => (
          <div key={p.level} className={`${p.w}`}>
            <div className={`rounded-md py-2 px-3 text-center ${i === 0 ? "bg-saffron-500 text-white" : i === 1 ? "bg-saffron-400 text-white" : i === 2 ? "bg-jade-400 text-white" : "bg-jade-600 text-white"}`}>
              <span className="font-semibold text-sm">{p.level}</span>
              <span className="hidden sm:inline text-[11px] opacity-90"> — {p.detail}</span>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-graphite-500 mt-4 text-center">Beats the forgetting curve — retention drops to 15-20% in a week without revision.</p>
    </div>
  );
}

// 5) Answer-writing 2/3 : 1/3 ratio
export function AnswerRatio() {
  return (
    <div className="bg-white rounded-xl border border-graphite-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <PenLine className="w-5 h-5 text-purple-500" />
        <h3 className="font-display font-semibold text-graphite-900">The Winning Answer Ratio</h3>
      </div>
      <div className="flex h-32 gap-2">
        <div className="w-2/3 bg-jade-100 border-2 border-jade-300 rounded-lg flex flex-col items-center justify-center">
          <span className="text-2xl font-display font-bold text-jade-700">⅔</span>
          <span className="text-xs text-jade-700 font-medium">Written content</span>
        </div>
        <div className="w-1/3 bg-saffron-100 border-2 border-saffron-300 rounded-lg flex flex-col items-center justify-center">
          <span className="text-2xl font-display font-bold text-saffron-700">⅓</span>
          <span className="text-[11px] text-saffron-700 font-medium text-center px-1">Diagrams / maps / tables</span>
        </div>
      </div>
      <p className="text-xs text-graphite-500 mt-4 text-center">Structure + visuals beat wall-of-text — examiners reward scannable copies.</p>
    </div>
  );
}
