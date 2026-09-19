'use client';

import { useState } from 'react';
import { CheckCircle, Target, Zap, BookOpen, Brain, Clock } from 'lucide-react';

export default function TestSeriesPage() {
  const [selectedTab, setSelectedTab] = useState('all');

  const testSeries = [
    {
      id: 'basic',
      name: 'BASIC TEST SERIES',
      price: '₹499',
      duration: 'Lifetime Access',
      badge: 'For Beginners',
      badgeColor: 'bg-green-500/20 text-green-400 border-green-500/30',
      description: 'Perfect for starting your UKPCS preparation journey',
      tests: [
        { type: 'Full Mock Tests', count: 6, details: '150 questions each' },
        { type: 'Sectional Tests', count: 6, details: '50 questions each' },
      ],
      sections: [
        'Test 1: Polity',
        'Test 2: Geography',
        'Test 3: History',
        'Test 4: Economy',
        'Test 5: Uttarakhand',
        'Test 6: Environment + Science',
      ],
      totalTests: 12,
      features: [
        '✓ 6 Full Mock Tests (150 Q each)',
        '✓ 6 Sectional Tests (50 Q each)',
        '✓ Topic-wise Coverage',
        '✓ Instant Results & Answers',
        '✓ Performance Tracking',
      ],
      bestFor: 'Beginners & First-timers',
      icon: BookOpen,
    },
    {
      id: 'standard',
      name: 'STANDARD TEST SERIES',
      price: '₹799',
      duration: 'Lifetime Access',
      badge: 'Most Popular',
      badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      description: 'Comprehensive testing with dual sectional focus',
      tests: [
        { type: 'Full Mock Tests', count: 12, details: '150 questions each' },
        { type: 'Sectional Tests', count: 12, details: '50 questions each' },
      ],
      sections: [
        'Tests 1-2: Polity (2 tests)',
        'Tests 3-4: Geography (2 tests)',
        'Tests 5-6: History (2 tests)',
        'Tests 7-8: Economy (2 tests)',
        'Tests 9-10: Uttarakhand (2 tests)',
        'Tests 11-12: Environment + Science (2 tests)',
      ],
      totalTests: 24,
      features: [
        '✓ 12 Full Mock Tests (150 Q each)',
        '✓ 12 Sectional Tests (50 Q each)',
        '✓ 2 Tests Per Topic',
        '✓ Detailed Analytics',
        '✓ Comparison with Toppers',
        '✓ Weakness Identification',
      ],
      bestFor: 'Serious Aspirants',
      icon: Target,
    },
    {
      id: 'uttarakhand',
      name: 'UTTARAKHAND INTENSIVE TEST SERIES',
      price: '₹599',
      duration: 'Lifetime Access',
      badge: 'State-Focused',
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      description: 'Deep dive into Uttarakhand-specific topics',
      tests: [
        { type: 'Uttarakhand Tests', count: 20, details: '50 questions each' },
      ],
      sections: [
        'History & Culture',
        'Geography & Climate',
        'Administration & Governance',
        'Economy & Development',
        'Current Affairs & Budget',
        'Social Issues & Infrastructure',
        'Environment & Conservation',
      ],
      totalTests: 20,
      features: [
        '✓ 20 Uttarakhand-Focused Tests',
        '✓ State Administration Coverage',
        '✓ Local History & Geography',
        '✓ State Current Affairs',
        '✓ Budget & Policy Analysis',
        '✓ Uttarakhand-specific Questions',
      ],
      bestFor: 'UKPCS-Ready Candidates',
      icon: Brain,
    },
    {
      id: 'currentaffairs',
      name: 'CURRENT AFFAIRS INTENSIVE TEST SERIES',
      price: '₹399',
      duration: 'Lifetime Access',
      badge: 'Updated Weekly',
      badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
      description: 'Master current affairs with targeted tests',
      tests: [
        { type: 'Current Affairs Tests', count: 12, details: '50 questions each' },
      ],
      sections: [
        'National Current Affairs',
        'Uttarakhand Current Affairs',
        'Budget & Economic News',
        'Governance & Policies',
        'Environment & Science News',
        'Social Issues & Development',
      ],
      totalTests: 12,
      features: [
        '✓ 12 Current Affairs Tests',
        '✓ Weekly Updates',
        '✓ National Coverage',
        '✓ Uttarakhand Focus',
        '✓ Budget Analysis',
        '✓ Recent Policy Updates',
      ],
      bestFor: 'Current Affairs Mastery',
      icon: Zap,
    },
    {
      id: 'csat',
      name: 'CSAT TEST SERIES',
      price: '₹249',
      duration: 'Lifetime Access',
      badge: 'Quick Prep',
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      description: 'Master logical reasoning and decision making',
      tests: [
        { type: 'CSAT Tests', count: 6, details: '50 questions each' },
      ],
      sections: [
        'Logical Reasoning',
        'Analytical Ability',
        'Decision Making',
        'Basic Numeracy',
      ],
      totalTests: 6,
      features: [
        '✓ 6 CSAT Tests',
        '✓ Logical Reasoning Focus',
        '✓ Numeracy & Analytics',
        '✓ Decision Making Strategies',
        '✓ Time Management Tips',
        '✓ Instant Feedback',
      ],
      bestFor: 'CSAT Mastery',
      icon: Brain,
    },
    {
      id: 'premium',
      name: 'PREMIUM TEST SERIES BUNDLE',
      price: '₹1,599',
      duration: 'Lifetime Access',
      badge: 'BEST VALUE',
      badgeColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      description: 'Everything bundled - Save ₹447!',
      tests: [
        { type: 'Total Tests', count: 66, details: 'All series combined' },
      ],
      sections: [
        'Standard Test Series (₹799)',
        'Uttarakhand Intensive (₹599)',
        'Current Affairs Intensive (₹399)',
        'CSAT Test Series (₹249)',
      ],
      totalTests: 66,
      features: [
        '✓ 24 Full & Sectional Tests (Standard)',
        '✓ 20 Uttarakhand Tests',
        '✓ 12 Current Affairs Tests',
        '✓ 6 CSAT Tests',
        '✓ 66 Total Tests',
        '✓ Save ₹447 vs individual purchase',
      ],
      bestFor: 'Complete Preparation',
      icon: CheckCircle,
    },
  ];

  const stats = [
    { label: 'Total Tests Available', value: '200+', icon: Target },
    { label: 'Questions Covered', value: '10,000+', icon: BookOpen },
    { label: 'Success Rate', value: '95%+', icon: CheckCircle },
    { label: 'Average Score Improvement', value: '+35%', icon: Zap },
  ];

  const filterSeries = () => {
    if (selectedTab === 'all') return testSeries;
    if (selectedTab === 'popular') return testSeries.filter(t => t.badge === 'Most Popular' || t.badge === 'BEST VALUE');
    if (selectedTab === 'individual') return testSeries.filter(t => t.id !== 'premium');
    if (selectedTab === 'bundle') return testSeries.filter(t => t.id === 'premium');
    return testSeries;
  };

  const displayedSeries = filterSeries();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Test Series
          </h1>
          <p className="text-xl text-orange-400 font-semibold mb-2">
            Master UKPCS with 200+ Practice Tests
          </p>
          <p className="text-slate-300 text-lg">
            Complete test packages for every aspect of UKPCS preparation
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, idx) => {
            const StatIcon = stat.icon;
            return (
              <div key={idx} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 text-center">
                <StatIcon className="text-orange-400 mx-auto mb-3" size={32} />
                <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
                <p className="text-slate-400 text-sm">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-12 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'All Series' },
            { id: 'popular', label: 'Most Popular' },
            { id: 'individual', label: 'Individual Packs' },
            { id: 'bundle', label: 'Premium Bundle' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
                selectedTab === tab.id
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Test Series Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {displayedSeries.map((series) => {
            const Icon = series.icon;
            return (
              <div
                key={series.id}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700 hover:border-orange-500/50 transition-all hover:shadow-2xl"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6 border-b border-slate-700">
                  <div className="flex items-start justify-between mb-3">
                    <Icon className="text-orange-400" size={32} />
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${series.badgeColor}`}>
                      {series.badge}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{series.name}</h3>
                  <p className="text-slate-400 text-sm">{series.description}</p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Price */}
                  <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 p-4 rounded-lg border border-orange-500/30">
                    <p className="text-orange-400 text-sm mb-1">PRICE</p>
                    <p className="text-3xl font-bold text-white">{series.price}</p>
                    <p className="text-slate-400 text-xs mt-2">{series.duration}</p>
                  </div>

                  {/* Tests Overview */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-white text-sm uppercase text-slate-300">Tests Included</h4>
                    {series.tests.map((test, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-slate-900/50 p-3 rounded-lg">
                        <span className="text-slate-300">{test.type}</span>
                        <div className="text-right">
                          <p className="text-orange-400 font-bold">{test.count}</p>
                          <p className="text-slate-400 text-xs">{test.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total Tests */}
                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-600 text-center">
                    <p className="text-slate-400 text-sm mb-1">TOTAL TESTS</p>
                    <p className="text-3xl font-bold text-orange-400">{series.totalTests}</p>
                  </div>

                  {/* Key Features */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-white text-sm uppercase text-slate-300">Key Features</h4>
                    {series.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="text-green-400 mt-0.5 flex-shrink-0" size={16} />
                        <span className="text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Best For */}
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-600">
                    <p className="text-slate-400 text-xs mb-1">BEST FOR</p>
                    <p className="text-white font-semibold">{series.bestFor}</p>
                  </div>

                  {/* Enroll Button */}
                  <button className={`w-full py-3 rounded-lg font-bold transition-all ${
                    series.id === 'premium'
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:shadow-lg'
                      : 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:shadow-lg'
                  }`}>
                    Enroll Now - {series.price}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Why Choose Our Test Series?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Real Exam Pattern', desc: 'Tests designed matching exact UKPCS exam format' },
              { title: 'Instant Results', desc: 'Get immediate feedback on your performance' },
              { title: 'Performance Analytics', desc: 'Detailed insights into strengths & weaknesses' },
              { title: 'Unlimited Attempts', desc: 'Retake tests anytime, track improvement' },
              { title: 'Expert Solutions', desc: 'Detailed explanations for every question' },
              { title: 'Lifetime Access', desc: 'Access all tests forever after purchase' },
            ].map((feature, idx) => (
              <div key={idx} className="bg-slate-900/50 p-6 rounded-lg border border-slate-600">
                <h4 className="text-lg font-bold text-orange-400 mb-2">{feature.title}</h4>
                <p className="text-slate-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 mb-12">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-700">
                  <th className="px-6 py-4 text-left text-white font-bold">Test Series</th>
                  <th className="px-6 py-4 text-center text-white font-bold">Tests</th>
                  <th className="px-6 py-4 text-center text-white font-bold">Price</th>
                  <th className="px-6 py-4 text-center text-white font-bold">Best For</th>
                </tr>
              </thead>
              <tbody>
                {testSeries.map((series, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-900/30' : 'bg-slate-900/50'}>
                    <td className="px-6 py-4 text-white font-semibold">{series.name}</td>
                    <td className="px-6 py-4 text-center text-orange-400 font-bold">{series.totalTests}</td>
                    <td className="px-6 py-4 text-center text-white font-bold">{series.price}</td>
                    <td className="px-6 py-4 text-center text-slate-300">{series.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Master UKPCS Tests?
          </h2>
          <p className="text-orange-100 mb-8 text-lg max-w-2xl mx-auto">
            Choose your test series and start practicing today. Get lifetime access to 200+ practice tests with detailed solutions.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button className="bg-white text-orange-600 font-bold py-4 px-10 rounded-lg hover:shadow-xl transition-all">
              View Packages
            </button>
            <button className="bg-orange-700/50 text-white font-bold py-4 px-10 rounded-lg border border-orange-400 hover:bg-orange-700 transition-all">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
