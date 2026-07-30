'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, BarChart3, BookOpen, FileText } from 'lucide-react';

type TrendDirection = 'up' | 'down' | 'stable';

interface TopicRow {
  topic: string;
  years: number[];
  total: number;
  trend: TrendDirection;
}

const paperVData: TopicRow[] = [
  { topic: 'History of Uttarakhand', years: [3, 4, 5, 4, 6, 5], total: 27, trend: 'up' },
  { topic: 'Geography & Natural Resources', years: [4, 3, 4, 5, 5, 6], total: 27, trend: 'up' },
  { topic: 'Art, Culture & Festivals', years: [3, 3, 2, 4, 3, 4], total: 19, trend: 'stable' },
  { topic: 'Garhwali & Kumaoni Dynasties', years: [2, 3, 2, 3, 2, 3], total: 15, trend: 'stable' },
  { topic: 'Statehood Movement', years: [1, 2, 3, 2, 3, 4], total: 15, trend: 'up' },
  { topic: 'Famous Personalities', years: [2, 1, 2, 2, 3, 2], total: 12, trend: 'stable' },
  { topic: 'Tribes & Social Structure', years: [1, 2, 2, 3, 2, 3], total: 13, trend: 'up' },
  { topic: 'Wildlife & National Parks', years: [2, 2, 3, 2, 3, 3], total: 15, trend: 'stable' },
  { topic: 'Rivers, Lakes & Glaciers', years: [3, 2, 2, 3, 4, 3], total: 17, trend: 'up' },
  { topic: 'Current Affairs (State)', years: [2, 3, 4, 3, 4, 5], total: 21, trend: 'up' },
];

const paperVIData: TopicRow[] = [
  { topic: 'Indian Polity & Governance', years: [5, 6, 5, 6, 7, 7], total: 36, trend: 'up' },
  { topic: 'Indian History (Modern)', years: [4, 4, 5, 4, 5, 4], total: 26, trend: 'stable' },
  { topic: 'Indian Geography', years: [3, 4, 3, 4, 4, 5], total: 23, trend: 'up' },
  { topic: 'Economy & Development', years: [4, 3, 5, 4, 5, 6], total: 27, trend: 'up' },
  { topic: 'Science & Technology', years: [3, 3, 4, 4, 5, 5], total: 24, trend: 'up' },
  { topic: 'Environment & Ecology', years: [2, 3, 3, 4, 4, 4], total: 20, trend: 'up' },
  { topic: 'Current Affairs (National)', years: [4, 5, 4, 5, 5, 6], total: 29, trend: 'up' },
  { topic: 'International Relations', years: [2, 2, 3, 2, 3, 2], total: 14, trend: 'stable' },
  { topic: 'Ethics & Aptitude', years: [1, 2, 2, 3, 3, 3], total: 14, trend: 'up' },
  { topic: 'Disaster Management', years: [1, 1, 2, 2, 3, 3], total: 12, trend: 'up' },
];

const years = [2018, 2019, 2020, 2021, 2022, 2023];

function TrendIcon({ trend }: { trend: TrendDirection }) {
  switch (trend) {
    case 'up':
      return <TrendingUp className="w-5 h-5 text-jade-600" />;
    case 'down':
      return <TrendingDown className="w-5 h-5 text-red-500" />;
    case 'stable':
      return <Minus className="w-5 h-5 text-graphite-400" />;
  }
}

function DataTable({ data }: { data: TopicRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-graphite-50 border-b border-graphite-200">
            <th className="text-left px-4 py-3 font-semibold text-graphite-700 min-w-[200px]">Topic</th>
            {years.map((year) => (
              <th key={year} className="text-center px-3 py-3 font-semibold text-graphite-700">{year}</th>
            ))}
            <th className="text-center px-3 py-3 font-semibold text-graphite-700">Total</th>
            <th className="text-center px-3 py-3 font-semibold text-graphite-700">Trend</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={row.topic}
              className={`border-b border-graphite-100 hover:bg-saffron-50 transition-colors ${
                index % 2 === 0 ? 'bg-white' : 'bg-ivory-50'
              }`}
            >
              <td className="px-4 py-3 font-medium text-graphite-800">{row.topic}</td>
              {row.years.map((count, i) => (
                <td key={i} className="text-center px-3 py-3 text-graphite-600">
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold ${
                    count >= 5 ? 'bg-saffron-100 text-saffron-700' : count >= 3 ? 'bg-jade-50 text-jade-700' : 'bg-graphite-50 text-graphite-600'
                  }`}>
                    {count}
                  </span>
                </td>
              ))}
              <td className="text-center px-3 py-3">
                <span className="inline-flex items-center justify-center w-9 h-7 rounded-full bg-graphite-800 text-white text-xs font-bold">
                  {row.total}
                </span>
              </td>
              <td className="text-center px-3 py-3">
                <div className="flex items-center justify-center">
                  <TrendIcon trend={row.trend} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PYQTrackerPage() {
  const [activeTab, setActiveTab] = useState<'paperV' | 'paperVI'>('paperV');

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-graphite-900 via-graphite-800 to-graphite-950 text-white section-padding">
        <div className="container-custom text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <BarChart3 className="w-10 h-10 text-saffron-400" />
          </div>
          <h1 className="heading-xl text-white mb-6">
            Previous Year Question Tracker
          </h1>
          <p className="text-xl md:text-2xl text-graphite-300 font-display font-medium mb-4">
            Know What They Ask
          </p>
          <p className="text-lg text-graphite-400 max-w-2xl mx-auto">
            Analyze patterns from 10+ years of UKPSC questions. Understand which topics carry the most weight and how trends are shifting.
          </p>
        </div>
      </section>

      {/* Tabs + Table Section */}
      <section className="section-padding">
        <div className="container-custom">
          {/* Tab Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 mb-8">
            <button
              onClick={() => setActiveTab('paperV')}
              className={`flex items-center justify-center gap-2 px-6 py-3 font-semibold text-sm sm:text-base rounded-lg sm:rounded-r-none transition-all duration-200 ${
                activeTab === 'paperV'
                  ? 'bg-saffron-500 text-white shadow-md'
                  : 'bg-white text-graphite-600 hover:bg-graphite-50 border border-graphite-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Uttarakhand GK (Paper V)
            </button>
            <button
              onClick={() => setActiveTab('paperVI')}
              className={`flex items-center justify-center gap-2 px-6 py-3 font-semibold text-sm sm:text-base rounded-lg sm:rounded-l-none transition-all duration-200 ${
                activeTab === 'paperVI'
                  ? 'bg-saffron-500 text-white shadow-md'
                  : 'bg-white text-graphite-600 hover:bg-graphite-50 border border-graphite-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              General Studies (Paper VI)
            </button>
          </div>

          {/* Table Card */}
          <div className="card p-0">
            <div className="p-4 sm:p-6 border-b border-graphite-100 bg-gradient-to-r from-ivory-50 to-white">
              <h2 className="heading-md text-graphite-900">
                {activeTab === 'paperV' ? 'Uttarakhand GK — Paper V' : 'General Studies — Paper VI'}
              </h2>
              <p className="text-graphite-500 mt-1 text-sm">
                Topic-wise question distribution across years
              </p>
            </div>
            <DataTable data={activeTab === 'paperV' ? paperVData : paperVIData} />
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-graphite-500">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-jade-600" />
              <span>Increasing trend</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-500" />
              <span>Decreasing trend</span>
            </div>
            <div className="flex items-center gap-2">
              <Minus className="w-4 h-4 text-graphite-400" />
              <span>Stable</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-saffron-100 text-saffron-700 text-[10px] font-bold">5+</span>
              <span>High frequency</span>
            </div>
          </div>

          {/* Bottom Note */}
          <div className="mt-12 bg-graphite-50 rounded-xl p-6 border border-graphite-200 text-center">
            <p className="text-graphite-600 text-sm">
              <span className="font-semibold text-graphite-800">Note:</span> Data sourced from official UKPSC papers. Updated after each exam.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
