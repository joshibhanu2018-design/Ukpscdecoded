'use client';

import { useState } from 'react';
import { BookOpen, Clock, Target, Users, CheckCircle, MessageSquare, Award } from 'lucide-react';

export default function PaidCoursesPage() {
  const [selectedTab, setSelectedTab] = useState('overview');

  const courseFeatures = [
    { icon: BookOpen, text: '50+ Hours of Video Courses (UKPCS-specific)', desc: 'Comprehensive coverage at exact UKPCS difficulty level' },
    { icon: Clock, text: 'Weekly Current Affairs Updates', desc: 'National & Uttarakhand news with exam-critical analysis' },
    { icon: Target, text: 'Complete Test Series with Analytics', desc: 'Topic tests → Mini tests → Full mock tests with tracking' },
    { icon: Users, text: 'Weekly Doubt Clearing Sessions', desc: 'Live sessions to address your questions' },
    { icon: Award, text: '1 Personal Session with Bhanu Joshi', desc: 'Personalized preparation strategy & guidance' },
    { icon: MessageSquare, text: 'Elimination Techniques Guide', desc: 'Expert strategies to tackle MCQs smartly' },
  ];

  const courseModules = [
    {
      title: 'CURRENT AFFAIRS MODULE (Ongoing)',
      description: 'Stay updated with exam-critical news and analysis',
      items: [
        'National Current Affairs: Weekly updates aligned with UKPCS pattern',
        'Uttarakhand State Affairs: State-specific developments & policies',
        'Critical Themes: Repeatedly asked topics in past exams',
        'Crash Course Pamphlets: Downloadable one-page revision summaries',
      ],
    },
    {
      title: 'CSAT QUICK START (3 Classes)',
      description: 'Master core CSAT concepts in quick sprint',
      items: [
        'Class 1: Logical Reasoning & Analytical Ability fundamentals',
        'Class 2: Decision Making & Basic Numeracy shortcuts',
        'Class 3: Time Management & Question Selection strategy',
        '⚠️ Note: Mini tests excluded - focus on concept clarity only',
      ],
    },
    {
      title: 'QUICK REVISION NOTES',
      description: 'Condensed notes for all exam subjects',
      items: [
        'National Topics: History, Polity, Geography, Economy, Science & Tech, Environment',
        'State Topics: Uttarakhand Geography & Administration',
        'Downloadable PDF format for offline access',
      ],
    },
    {
      title: 'TEST SERIES & PERFORMANCE ANALYTICS',
      description: 'Measure progress with detailed analytics',
      items: [
        'Subject-wise Topic Tests: Reinforce learning after each topic',
        'Full Mock Tests: Complete exam simulations at actual difficulty',
        'Performance Analytics Dashboard: Detailed breakdowns with recommendations',
        'Expected Questions Database: Common exam patterns & variations',
      ],
    },
    {
      title: 'ECONOMIC SURVEY & BUDGET',
      description: 'Master economy topics for exam readiness',
      items: [
        'National Economic Survey: Key highlights & critical sections',
        'Union Budget: Tax implications and new schemes explained',
        'Uttarakhand Budget: State-specific budget highlights',
      ],
    },
  ];

  const learningPath = [
    { step: 1, title: 'Quick Revision Notes', desc: 'Start with condensed national & state topics' },
    { step: 2, title: 'Detailed Video Courses', desc: '50+ hours covering all exam subjects' },
    { step: 3, title: 'Test Series & Analytics', desc: 'Topic tests → Mini tests → Full mocks with tracking' },
    { step: 4, title: 'Doubt Clearing', desc: 'Weekly live sessions + expected question bank' },
    { step: 5, title: 'Personal Session', desc: '1-on-1 with Bhanu Joshi for strategy & guidance' },
  ];

  const crashCourseDetails = {
    title: 'UKPCS Crash Course Bundle 2026',
    subtitle: 'Master UKPCS Lower PCS Exams in 8 Weeks',
    dates: 'October 2 - November 2, 2026',
    price: '₹2,699',
    duration: '8 weeks',
    hours: '50+',
    videoLessons: true,
    testSeries: true,
    personalSession: true,
    currentAffairs: true,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Paid Courses
          </h1>
          <p className="text-xl text-orange-400 font-semibold">
            {crashCourseDetails.title}
          </p>
          <p className="text-slate-300 mt-2">{crashCourseDetails.subtitle}</p>
        </div>

        {/* Course Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-orange-500/30 mb-12 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">{crashCourseDetails.title}</h2>
              <p className="text-slate-300 mb-6">{crashCourseDetails.subtitle}</p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Calendar className="text-orange-400" size={20} />
                  <span className="text-slate-300">
                    <strong>Duration:</strong> {crashCourseDetails.dates}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="text-orange-400" size={20} />
                  <span className="text-slate-300">
                    <strong>Total Hours:</strong> {crashCourseDetails.hours} hours of comprehensive video content
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="text-orange-400" size={20} />
                  <span className="text-slate-300">
                    <strong>Personal Session:</strong> 1-on-1 with Bhanu Joshi included
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 p-6 rounded-xl border border-orange-500/30 mb-6">
                <p className="text-orange-400 text-sm mb-2">PRICE</p>
                <p className="text-4xl font-bold text-white">{crashCourseDetails.price}</p>
                <p className="text-slate-400 text-sm mt-2">Limited time offer - 8 week crash course</p>
              </div>

              <button className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl transition-all">
                Enroll Now
              </button>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white mb-6">What's Included</h3>
              <div className="space-y-3">
                {[
                  '50+ Hours of Video Courses (UKPCS-specific)',
                  'Weekly Current Affairs (National & Uttarakhand)',
                  'Crash Course Pamphlets (Downloadable PDFs)',
                  '3 CSAT Quick Classes',
                  'Complete Test Series with Analytics Dashboard',
                  'Economic Survey & Budget Breakdowns',
                  'Quick Revision Notes (All Topics)',
                  'Expected Questions Database',
                  'Elimination Techniques Guide',
                  'Weekly Doubt Clearing Sessions',
                  'Performance Analysis & Learning Insights',
                  '1 Personal Session with Bhanu Joshi',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="text-green-400 mt-1 flex-shrink-0" size={20} />
                    <span className="text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-12">
          <div className="flex gap-4 mb-8 border-b border-slate-700 overflow-x-auto">
            {['overview', 'modules', 'learningPath', 'features'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-6 py-3 font-semibold whitespace-nowrap transition-all ${
                  selectedTab === tab
                    ? 'text-orange-400 border-b-2 border-orange-400'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                {tab === 'overview' && 'Overview'}
                {tab === 'modules' && 'Course Modules'}
                {tab === 'learningPath' && 'Learning Path'}
                {tab === 'features' && 'Key Features'}
              </button>
            ))}
          </div>

          {/* Tab Content - Overview */}
          {selectedTab === 'overview' && (
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
              <h3 className="text-2xl font-bold text-white mb-6">Why UKPCS DECODED Crash Course?</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-slate-300 mb-4">
                    Designed specifically for UKPCS Lower PCS aspirants - not a generic UPSC or UKSSSC course. Built on real exam patterns, current affairs tracking, and exam-specific elimination techniques.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-600">
                    <h4 className="text-lg font-bold text-orange-400 mb-3">Uniqueness</h4>
                    <ul className="space-y-2 text-slate-300 text-sm">
                      <li>✅ 50-Hour Video Curriculum: Condensed yet comprehensive</li>
                      <li>✅ Live Current Affairs: Updated weekly with exam-critical analysis</li>
                      <li>✅ Elimination Techniques: Expert strategies for MCQs</li>
                      <li>✅ Performance Analytics: Real-time insights into weak areas</li>
                    </ul>
                  </div>

                  <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-600">
                    <h4 className="text-lg font-bold text-orange-400 mb-3">Alignment</h4>
                    <ul className="space-y-2 text-slate-300 text-sm">
                      <li>✅ Aligned with UKPCS difficulty level</li>
                      <li>✅ Not UPSC content (too difficult)</li>
                      <li>✅ Not UKSSSC content (too easy)</li>
                      <li>✅ Perfectly calibrated for exam success</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content - Modules */}
          {selectedTab === 'modules' && (
            <div className="space-y-6">
              {courseModules.map((module, idx) => (
                <div key={idx} className="bg-slate-800 rounded-xl p-8 border border-slate-700">
                  <h3 className="text-2xl font-bold text-orange-400 mb-2">{module.title}</h3>
                  <p className="text-slate-400 mb-6">{module.description}</p>
                  <ul className="space-y-3">
                    {module.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-3 text-slate-300">
                        <span className="text-orange-400 mt-1">▸</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Tab Content - Learning Path */}
          {selectedTab === 'learningPath' && (
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
              <h3 className="text-2xl font-bold text-white mb-8">Your Learning Journey</h3>
              <div className="space-y-6">
                {learningPath.map((item, idx) => (
                  <div key={idx} className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold mb-4">
                        {item.step}
                      </div>
                      {idx < learningPath.length - 1 && (
                        <div className="w-1 h-16 bg-gradient-to-b from-orange-500 to-transparent"></div>
                      )}
                    </div>
                    <div className="flex-1 pt-2">
                      <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                      <p className="text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content - Features */}
          {selectedTab === 'features' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courseFeatures.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div key={idx} className="bg-slate-800 rounded-xl p-8 border border-slate-700 hover:border-orange-500/50 transition-all">
                    <Icon className="text-orange-400 mb-4" size={32} />
                    <h4 className="text-lg font-bold text-white mb-2">{feature.text}</h4>
                    <p className="text-slate-400 text-sm">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Master UKPCS?
          </h2>
          <p className="text-orange-100 mb-8 text-lg">
            Join our crash course and get exam-ready in just 8 weeks. Limited seats available!
          </p>
          <button className="bg-white text-orange-600 font-bold py-4 px-10 rounded-lg hover:shadow-xl transition-all text-lg">
            Enroll Now - ₹2,699
          </button>
        </div>
      </div>
    </div>
  );
}

// Calendar icon fallback
function Calendar({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );
}