'use client';

import { useState } from 'react';
import { CheckCircle, Target, Zap, BookOpen, Brain, Clock, X, Calendar } from 'lucide-react';

export default function TestSeriesPage() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [showRegistration, setShowRegistration] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    courseInterest: '',
  });

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
      highlight: false,
    },
    {
      id: 'standard',
      name: 'STANDARD TEST SERIES',
      price: '₹799',
      duration: 'Lifetime Access',
      badge: 'RECOMMENDED',
      badgeColor: 'bg-blue-600/30 text-blue-300 border-blue-500/50',
      description: 'Comprehensive testing with dual sectional focus - Most Popular Choice',
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
      highlight: true,
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
      highlight: false,
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
      highlight: false,
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
      highlight: false,
    },
    {
      id: 'premium',
      name: 'PREMIUM TEST SERIES BUNDLE',
      price: '₹1,599',
      originalPrice: '₹2,046',
      duration: 'Lifetime Access',
      badge: 'BEST VALUE - SAVE ₹447',
      badgeColor: 'bg-gradient-to-r from-yellow-500/40 to-orange-500/40 text-yellow-300 border-yellow-500/50',
      description: 'Everything bundled - Most comprehensive preparation! Save ₹447!',
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
      highlight: true,
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
    if (selectedTab === 'popular') return testSeries.filter(t => t.highlight);
    if (selectedTab === 'individual') return testSeries.filter(t => t.id !== 'premium');
    if (selectedTab === 'bundle') return testSeries.filter(t => t.id === 'premium');
    return testSeries;
  };

  const displayedSeries = filterSeries();

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      timestamp: new Date().toISOString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      courseInterest: formData.courseInterest,
      source: 'website-test-series',
    };

    try {
      await fetch(
        'https://script.google.com/macros/s/AKfycbyS2M34dKi6V5TmZv6Z2PKEdQHC0RoQmcGdMGNRjlCS1Rc2Tk6VeLWPvMI3iFEkz3q3-Q/exec',
        {
          method: 'POST',
          body: JSON.stringify(payload),
          mode: 'no-cors',
        }
      );

      alert('Thank you! We will contact you soon with exclusive offers.');
      setFormData({ name: '', email: '', phone: '', courseInterest: '' });
      setShowRegistration(false);
    } catch (error) {
      console.error('Submission error:', error);
      alert('Registration submitted! We will be in touch soon.');
      setShowRegistration(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Launch Date */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-orange-500/20 border border-orange-500/50 rounded-full">
            <p className="text-orange-400 font-semibold flex items-center gap-2">
              <Calendar size={16} />
              🚀 Launched September 25, 2026
            </p>
          </div>
          
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
            { id: 'popular', label: '⭐ Recommended' },
            { id: 'individual', label: 'Individual Packs' },
            { id: 'bundle', label: '🏆 Best Value' },
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
            const isPremium = series.id === 'premium';
            const isStandard = series.id === 'standard';
            
            return (
              <div
                key={series.id}
                className={`rounded-2xl overflow-hidden border transition-all hover:shadow-2xl ${
                  isPremium
                    ? 'bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-red-500/10 border-yellow-500/50 ring-2 ring-yellow-500/30 lg:col-span-3 md:col-span-2'
                    : isStandard
                    ? 'bg-gradient-to-br from-blue-800 to-slate-900 border-blue-500/50 md:row-span-1 lg:col-span-1'
                    : 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-orange-500/50'
                }`}
              >
                {/* Header */}
                <div className={`p-6 border-b ${
                  isPremium
                    ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30'
                    : isStandard
                    ? 'bg-gradient-to-r from-blue-600/20 to-blue-700/20 border-blue-500/30'
                    : 'bg-gradient-to-r from-slate-700 to-slate-800 border-slate-700'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <Icon className={`${isPremium || isStandard ? 'text-yellow-400' : 'text-orange-400'}`} size={32} />
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${series.badgeColor}`}>
                      {series.badge}
                    </span>
                  </div>
                  <h3 className={`text-2xl font-bold mb-2 ${isPremium || isStandard ? 'text-yellow-200' : 'text-white'}`}>
                    {series.name}
                  </h3>
                  <p className="text-slate-300 text-sm">{series.description}</p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Price */}
                  <div className={`p-4 rounded-lg border ${
                    isPremium
                      ? 'bg-gradient-to-r from-yellow-500/30 to-orange-500/30 border-yellow-500/50'
                      : isStandard
                      ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-500/30'
                      : 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30'
                  }`}>
                    <p className={`text-sm mb-1 ${isPremium ? 'text-yellow-300' : isStandard ? 'text-blue-300' : 'text-orange-400'}`}>
                      PRICE
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className={`text-3xl font-bold ${isPremium || isStandard ? 'text-yellow-300' : 'text-white'}`}>
                        {series.price}
                      </p>
                      {series.originalPrice && (
                        <p className="text-slate-400 line-through text-sm">{series.originalPrice}</p>
                      )}
                    </div>
                    <p className="text-slate-300 text-xs mt-2">{series.duration}</p>
                  </div>

                  {/* Tests Overview */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-white text-sm uppercase text-slate-300">Tests Included</h4>
                    {series.tests.map((test, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-slate-900/50 p-3 rounded-lg">
                        <span className="text-slate-300">{test.type}</span>
                        <div className="text-right">
                          <p className={`font-bold ${isPremium || isStandard ? 'text-yellow-400' : 'text-orange-400'}`}>
                            {test.count}
                          </p>
                          <p className="text-slate-400 text-xs">{test.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total Tests */}
                  <div className={`p-4 rounded-lg border text-center ${
                    isPremium
                      ? 'bg-yellow-500/20 border-yellow-500/30'
                      : isStandard
                      ? 'bg-blue-500/20 border-blue-500/30'
                      : 'bg-slate-900 border-slate-600'
                  }`}>
                    <p className={`text-sm mb-1 ${isPremium || isStandard ? 'text-yellow-200' : 'text-slate-400'}`}>
                      TOTAL TESTS
                    </p>
                    <p className={`text-3xl font-bold ${isPremium || isStandard ? 'text-yellow-400' : 'text-orange-400'}`}>
                      {series.totalTests}
                    </p>
                  </div>

                  {/* Key Features */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-white text-sm uppercase text-slate-300">Key Features</h4>
                    {series.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className={`${isPremium || isStandard ? 'text-yellow-400' : 'text-green-400'} mt-0.5 flex-shrink-0`} size={16} />
                        <span className="text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Best For */}
                  <div className={`p-3 rounded-lg border ${
                    isPremium
                      ? 'bg-yellow-500/20 border-yellow-500/30'
                      : isStandard
                      ? 'bg-blue-500/20 border-blue-500/30'
                      : 'bg-slate-900 border-slate-600'
                  }`}>
                    <p className="text-slate-300 text-xs mb-1">BEST FOR</p>
                    <p className={`font-semibold ${isPremium || isStandard ? 'text-yellow-300' : 'text-white'}`}>
                      {series.bestFor}
                    </p>
                  </div>

                  {/* Enroll Button */}
                  <button
                    onClick={() => setShowRegistration(true)}
                    className={`w-full py-3 rounded-lg font-bold transition-all ${
                      isPremium
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:shadow-lg hover:shadow-yellow-500/50 text-lg'
                        : isStandard
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/50'
                        : 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:shadow-lg'
                    }`}
                  >
                    Register Interest - {series.price}
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

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Master UKPCS Tests?
          </h2>
          <p className="text-orange-100 mb-8 text-lg max-w-2xl mx-auto">
            Choose your test series and start practicing today. Get lifetime access to 200+ practice tests with detailed solutions.
          </p>
          <button
            onClick={() => setShowRegistration(true)}
            className="bg-white text-orange-600 font-bold py-4 px-10 rounded-lg hover:shadow-xl transition-all"
          >
            Register Interest Now
          </button>
        </div>
      </div>

      {/* Registration Popup Modal */}
      {showRegistration && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-orange-500/50 shadow-2xl max-w-md w-full p-8 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowRegistration(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Register Your Interest</h2>
              <p className="text-slate-300 text-sm">Fill in your details to get exclusive offers & updates on test series launch</p>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  required
                  placeholder="10-digit phone number"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">Test Series Interest</label>
                <select
                  name="courseInterest"
                  value={formData.courseInterest}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-orange-500 outline-none"
                >
                  <option value="">Select your interest</option>
                  <option value="Basic Test Series - ₹499">Basic Test Series - ₹499</option>
                  <option value="Standard Test Series - ₹799">Standard Test Series - ₹799 ⭐ Recommended</option>
                  <option value="Uttarakhand Intensive - ₹599">Uttarakhand Intensive - ₹599</option>
                  <option value="Current Affairs Intensive - ₹399">Current Affairs Intensive - ₹399</option>
                  <option value="CSAT Test Series - ₹249">CSAT Test Series - ₹249</option>
                  <option value="Premium Bundle - ₹1,599">Premium Bundle - ₹1,599 🏆 Best Value</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all"
              >
                Register Interest
              </button>
            </form>

            {/* Premium Highlight */}
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-lg p-4">
              <p className="text-yellow-300 text-sm font-semibold mb-2">💰 Pro Tip: Save ₹447 with Premium Bundle!</p>
              <p className="text-slate-300 text-xs">Get all 4 series (66 tests) for just ₹1,599 instead of buying separately</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
