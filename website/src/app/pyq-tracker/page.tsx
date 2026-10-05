'use client';

import { useEffect, useState } from 'react';
import { BarChart3, Search, Flame, Calendar, ChevronDown, MapPin, Globe, Download, PlayCircle, BookOpen, ClipboardCheck, Radio } from 'lucide-react';
import {
  uttarakhandClusters,
  nationalClusters,
  PYQ_YEARS,
  type PYQCluster,
  type Priority,
} from '@/lib/pyqData';
import { masterPlan } from '@/lib/masterPlan';
import {
  MarksDistribution,
  ExamStages,
  DynastyTimeline,
  RevisionPyramid,
} from '@/components/VisualNotes';

type Tab = 'uttarakhand' | 'national' | 'plan';

const priorityStyles: Record<Priority, { badge: string; ring: string; label: string }> = {
  CRITICAL: { badge: 'bg-danger-100 text-danger-700', ring: 'border-danger-200', label: '⚡ Critical' },
  HIGH: { badge: 'bg-saffron-100 text-saffron-700', ring: 'border-saffron-200', label: '🔴 High' },
  MEDIUM: { badge: 'bg-jade-100 text-jade-700', ring: 'border-jade-200', label: '🟡 Medium' },
};


function ClusterCard({ cluster, forceOpen }: { cluster: PYQCluster; forceOpen?: boolean }) {
  const style = priorityStyles[cluster.priority];
  const [open, setOpen] = useState(false);
  const isOpen = forceOpen || open;
  return (
    <div className={`card bg-white border ${style.ring} p-0 overflow-hidden`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left p-4 sm:p-5 border-b border-graphite-100 bg-gradient-to-r from-ivory-50 to-white hover:from-saffron-50 transition-colors"
      >
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <h3 className="font-display font-semibold text-graphite-900 text-base sm:text-lg flex items-center gap-2">
            <ChevronDown
              className={`w-4 h-4 text-graphite-400 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
            {cluster.cluster}
          </h3>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${style.badge}`}>
              {style.label}
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-graphite-800 text-white flex items-center gap-1">
              <Flame className="w-3 h-3" /> {cluster.totalHits} hits
            </span>
          </div>
        </div>
        <p className="text-xs text-graphite-500 mt-1 ml-6">
          Repeat pattern: {cluster.repeat}
          {!isOpen && <span className="ml-2 text-saffron-600 font-medium">· Tap to expand ({cluster.topics.length} topics)</span>}
        </p>
      </button>
      {isOpen && (
      <div className="divide-y divide-graphite-50">
        {cluster.topics.map((t) => (
          <div key={t.topic} className="p-4 hover:bg-saffron-50/40 transition-colors">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <p className="font-medium text-graphite-800 text-sm flex-1 min-w-[180px]">{t.topic}</p>
              <div className="flex items-center gap-1.5">
                {PYQ_YEARS.map((yr) => {
                  const hit = t.years.includes(yr);
                  return (
                    <span
                      key={yr}
                      title={hit ? `Asked in ${yr}` : `Not in ${yr}`}
                      className={`inline-flex items-center justify-center w-11 h-7 rounded text-[11px] font-semibold ${
                        hit ? 'bg-jade-100 text-jade-700' : 'bg-graphite-50 text-graphite-300 line-through'
                      }`}
                    >
                      {yr}
                    </span>
                  );
                })}
              </div>
            </div>
            {t.note && (
              <p className="text-xs text-graphite-500 mt-1.5 italic">💡 {t.note}</p>
            )}
          </div>
        ))}
      </div>
      )}
    </div>
  );
}


function dayLabel(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });
}

function PhaseAccordion({ phaseIndex, open, onToggle, today }: { phaseIndex: number; open: boolean; onToggle: () => void; today: string | null }) {
  const phase = masterPlan[phaseIndex];
  return (
    <div className="card bg-white border border-graphite-100 p-0 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 p-4 sm:p-5 text-left hover:bg-ivory-50 transition-colors"
      >
        <span className="font-display font-semibold text-graphite-900 text-sm sm:text-base">{phase.phase}</span>
        <ChevronDown className={`w-5 h-5 text-graphite-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="divide-y divide-graphite-50 border-t border-graphite-100">
          {phase.days.map((d) => {
            const isToday = d.date === today;
            const isMock = d.tests.some((t) => t.startsWith('Full Mock') || t === 'Grand Uttarakhand Mock' || t === 'Free Sample Mock');
            return (
              <div key={d.day} className={`p-4 transition-colors ${isToday ? 'bg-saffron-50 ring-2 ring-inset ring-saffron-300' : isMock ? 'bg-ivory-50' : 'hover:bg-saffron-50/40'}`}>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-graphite-800 text-white text-xs font-bold flex-shrink-0">{d.day}</span>
                  <span className="font-semibold text-graphite-800 text-sm">{dayLabel(d.date)}</span>
                  {isToday && <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-saffron-500 text-white">Today</span>}
                </div>
                <div className="space-y-1.5 text-xs text-graphite-600 sm:ml-10">
                  {d.watch && d.watch !== '—' && (
                    <p className="flex gap-1.5"><PlayCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-saffron-600" /><span><span className="font-semibold text-graphite-800">Watch:</span> {d.watch}</span></p>
                  )}
                  {d.bookEn && (
                    <p className="flex gap-1.5"><BookOpen className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-saffron-600" /><span><span className="font-semibold text-graphite-800">Book:</span> {d.bookEn}<span className="block text-graphite-500">{d.bookHi}</span></span></p>
                  )}
                  <p><span className="font-semibold text-jade-600">Self-study:</span> {d.selfStudy}</p>
                  <p><span className="font-semibold text-graphite-500">📝 PYQ clusters:</span> {d.pyq}</p>
                  {d.tests.length > 0 && (
                    <p className="flex gap-1.5"><ClipboardCheck className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-saffron-600" /><span><span className="font-semibold text-graphite-800">Test:</span> {d.tests.join(' + ')}</span></p>
                  )}
                  {d.live && (
                    <p className="flex gap-1.5 text-jade-700 font-medium"><Radio className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />{d.live}</p>
                  )}
                  <p className="text-graphite-500">{d.evening}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


export default function PYQTrackerPage() {
  const [activeTab, setActiveTab] = useState<Tab>('uttarakhand');
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'ALL'>('ALL');
  const [openPhase, setOpenPhase] = useState<number | null>(0);
  const [today, setToday] = useState<string | null>(null);

  // Open the phase holding today's date (IST), after mount so server and client render the same.
  useEffect(() => {
    const iso = new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 10);
    setToday(iso);
    const idx = masterPlan.findIndex((p) => p.days.some((d) => d.date === iso));
    if (idx >= 0) setOpenPhase(idx);
  }, []);

  const sourceClusters = activeTab === 'uttarakhand' ? uttarakhandClusters : nationalClusters;

  const filteredClusters = sourceClusters
    .filter((c) => priorityFilter === 'ALL' || c.priority === priorityFilter)
    .map((c) => ({
      ...c,
      topics: c.topics.filter(
        (t) =>
          search.trim() === '' ||
          t.topic.toLowerCase().includes(search.toLowerCase()) ||
          c.cluster.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((c) => c.topics.length > 0);

  const tabs: { id: Tab; label: string; icon: typeof MapPin }[] = [
    { id: 'uttarakhand', label: 'Uttarakhand PYQ', icon: MapPin },
    { id: 'national', label: 'National PYQ', icon: Globe },
    { id: 'plan', label: '60-Day Plan', icon: Calendar },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-graphite-900 via-graphite-800 to-graphite-950 text-white section-padding">
        <div className="container-custom text-center">
          <BarChart3 className="w-10 h-10 text-saffron-400 mx-auto mb-6" />
          <h1 className="heading-xl text-white mb-4">Previous Year Question Tracker</h1>
          <p className="text-lg text-graphite-300 max-w-2xl mx-auto">
            Cluster-wise analysis of UKPSC Prelims (2016, 2021, 2024, 2025). Uttarakhand tracker covers ~35% of the paper; National tracker covers ~65%. Plus the day-by-day 60-Day Master Plan to the 29 November exam.
          </p>
        </div>
      </section>

      {/* Intro note — trackers first */}
      <section className="bg-white border-b border-graphite-100">
        <div className="container-custom py-6 text-center">
          <p className="text-graphite-600 text-sm max-w-2xl mx-auto">
            Browse the trackers below — tap any cluster to expand its topics. Scroll down for the
            visual <span className="font-semibold text-graphite-800">&quot;Exam at a Glance&quot;</span> snapshots.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-white border-b border-graphite-100 sticky top-16 z-40">
        <div className="container-custom px-4">
          <div className="flex gap-1 overflow-x-auto py-3">
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    activeTab === t.id
                      ? 'bg-saffron-500 text-white shadow-md'
                      : 'bg-graphite-50 text-graphite-600 hover:bg-graphite-100'
                  }`}
                >
                  <Icon className="w-4 h-4" /> {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-padding bg-ivory-50">
        <div className="container-custom">
          {activeTab === 'plan' ? (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="bg-jade-50 border border-jade-200 rounded-xl p-4 mb-2 text-sm text-jade-800 space-y-2">
                <p>
                  <strong>60-Day Master Plan 2026:</strong> 1 October → 29 November (Day 60 = exam day). Every day: one crash course
                  video, one chapter of <em>Uttarakhand Decoded / उत्तराखंड डिकोडेड</em>, the national topic from your own books, that
                  topic&apos;s PYQ cluster, and a test within 0–2 days.
                </p>
                <p>
                  Sunday = full mock · Wednesday = live session · last 9 days = revision + mocks only. Started late? Begin from
                  today&apos;s row.
                </p>
              </div>
              <a
                href="/uploads/UKPSC-60-Day-Prep-Tracker.pdf"
                className="inline-flex items-center gap-2 rounded-lg bg-saffron-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-saffron-600"
              >
                <Download className="w-4 h-4" /> Download printable PDF (tick-box planner)
              </a>
              {masterPlan.map((_, i) => (
                <PhaseAccordion key={i} phaseIndex={i} open={openPhase === i} onToggle={() => setOpenPhase(openPhase === i ? null : i)} today={today} />
              ))}
            </div>
          ) : (
            <>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-graphite-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search topics (e.g. Katyuri, Fundamental Rights, monsoon)..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-graphite-200 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 outline-none text-sm text-graphite-800"
                  />
                </div>
                <div className="flex gap-2">
                  {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriorityFilter(p)}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        priorityFilter === p
                          ? 'bg-graphite-900 text-white'
                          : 'bg-white border border-graphite-200 text-graphite-600 hover:bg-graphite-50'
                      }`}
                    >
                      {p === 'ALL' ? 'All' : p.charAt(0) + p.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cluster Grid */}
              {filteredClusters.length === 0 ? (
                <p className="text-center text-graphite-500 py-16">No topics match your search.</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-6 items-start">
                  {filteredClusters.map((c) => (
                    <ClusterCard key={c.cluster} cluster={c} forceOpen={search.trim() !== ''} />
                  ))}
                </div>
              )}

              <div className="mt-10 bg-graphite-50 rounded-xl p-5 border border-graphite-200 text-center text-sm text-graphite-600">
                ✓ = topic appeared that year. Priority reflects how consistently a cluster appears. Always verify facts with the latest Census / Forest Survey / Budget data.
              </div>
            </>
          )}
        </div>
      </section>

      {/* Exam at a Glance — Visual Notes (below the trackers) */}
      <section className="section-padding bg-white border-t border-graphite-100">
        <div className="container-custom">
          <h2 className="heading-md text-graphite-900 text-center mb-2">Exam at a Glance</h2>
          <p className="text-graphite-500 text-center mb-8 text-sm">Visual snapshots of what actually decides your selection.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            <ExamStages />
            <MarksDistribution />
            <DynastyTimeline />
            <RevisionPyramid />
          </div>
        </div>
      </section>
    </div>
  );
}
