import { KIND_LABEL, shortDate, type ScheduleItem, type ScheduleKind } from "@/lib/finalMonth";

const KIND_STYLE: Record<ScheduleKind, string> = {
  mock: "border-saffron-400/70 bg-saffron-400/10",
  uk: "border-jade-500/50 bg-jade-500/10",
  ca: "border-graphite-500 bg-graphite-800/70",
  csat: "border-graphite-600 bg-graphite-800/40",
};
const KIND_DOT: Record<ScheduleKind, string> = {
  mock: "bg-saffron-400",
  uk: "bg-jade-400",
  ca: "bg-white",
  csat: "bg-graphite-400",
};

/** Big, scannable date cards: one per test. */
export default function Timetable({ items, today }: { items: ScheduleItem[]; today: string }) {
  return (
    <ol className="grid gap-2 sm:grid-cols-2">
      {items.map((t) => {
        const d = shortDate(t.date);
        const past = t.date < today;
        const isToday = t.date === today;
        return (
          <li
            key={t.testId}
            className={`flex items-center gap-3 rounded-xl border p-3 ${KIND_STYLE[t.kind]} ${past ? "opacity-50" : ""} ${
              isToday ? "ring-2 ring-saffron-400" : ""
            }`}
          >
            <div className="w-14 flex-shrink-0 rounded-lg bg-graphite-950/70 py-1.5 text-center">
              <div className="text-[10px] font-semibold uppercase text-graphite-400">{d.weekday}</div>
              <div className="font-display text-2xl font-bold leading-none text-white">{d.day}</div>
              <div className="text-[10px] font-semibold uppercase text-graphite-400">{d.month}</div>
            </div>
            <div className="min-w-0">
              <p className="font-semibold leading-snug text-white">{t.name}</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-graphite-300">
                <span className={`h-2 w-2 rounded-full ${KIND_DOT[t.kind]}`} />
                {KIND_LABEL[t.kind]}
                {isToday && <span className="font-bold text-saffron-300"> · today</span>}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
