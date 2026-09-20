'use client';

import { useState } from 'react';
import { CheckCircle, Target, Zap, BookOpen, Brain, Clock, X, Calendar } from 'lucide-react';

export default function TestSeriesPage() {
  const [showRegistration, setShowRegistration] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    courseInterest: '',
  });

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
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      courseInterested: formData.courseInterest,
      source: 'website-test-series',
    };

    try {
      await fetch(
        'https://script.google.com/macros/s/AKfycbyE-14MJR1_hF5fCrPJG3u0IqvVtJK8H_yeKkZth5D2Y7eD3PpAymyMLC0v9_ojENlh/exec',
        {
          method: 'POST',
          body: JSON.stringify(payload),
          mode: 'no-cors',
        }
      );

      alert('Thank you! We will contact you soon.');
      setFormData({ name: '', email: '', phone: '', courseInterest: '' });
      setShowRegistration(false);
    } catch (error) {
      console.error('Submission error:', error);
      alert('Registration submitted! We will be in touch soon.');
      setShowRegistration(false);
    }
  };

  const testPackages = [
    {
      id: 'basic',
      name: 'BASIC TEST SERIES',
      price: '₹499',
      duration: 'Lifetime Access',
      badge: 'Budget Friendly',
      badgeColor: 'bg-green-500/20 text-green-400 border-green-500/30',
      description: 'Budget Friendly Option for Beginners',
      totalTests: 12,
      features: [
        '✓ 6 Full Mock Tests (150 Q each)',
        '✓ 6 Sectional Tests (50 Q each):',
        '  • Polity • History • Economy',
        '  • Geography • Uttarakhand',
        '  • Science & Environment',
        '✓ Aligned with 2024-2025 patterns',
      ],
      bestFor: 'BUDGET FRIENDLY FOR BEGINNERS',
      icon: BookOpen,
      highlight: false,
    },
    {
      id: 'standard',
      name: 'STANDARD TEST SERIES',
      price: '₹799',
      duration: 'Lifetime Access',
      badge: 'RECOMMENDED',
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      description: 'Comprehensive testing with 2 tests per section',
      totalTests: 24,
      features: [
        '✓ 12 Full Mock Tests (150 Q each)',
        '✓ 12 Sectional Tests (50 Q each):',
        '  • 2 Tests Each: Polity, Geography',
        '  • 2 Tests Each: History, Economy',
        '  • 2 Tests Each: Uttarakhand',
        '  • 2 Tests Each: Science & Environment',
        '✓ Aligned with 2024-2025 patterns',
      ],
      bestFor: 'Serious Aspirants',
      icon: Target,
      highlight: false,
    },
    {
      id: 'uttarakhand',
      name: 'UTTARAKHAND INTENSIVE TEST SERIES',
      price: '₹599',
      duration: 'Lifetime Access',
      badge: 'State-Focused',
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      description: 'Deep state-specific preparation',
      totalTests: 20,
      features: [
        '✓ 20 Uttarakhand-Focused Tests',
        '✓ History & Culture Coverage',
        '✓ Geography & Climate',
        '✓ Administration & Governance',
        '✓ Economy & Development',
        '✓ State Current Affairs',
        '✓ Budget & Policy Analysis',
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
      description: 'National and state current affairs practice',
      totalTests: 12,
      features: [
        '✓ 12 Current Affairs Tests',
        '✓ National Current Affairs',
        '✓ Uttarakhand State Affairs',
        '✓ Budget & Economic News',
        '✓ Governance & Policies',
        '✓ Environment & Science News',
        '✓ Social Development',
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
      description: 'Aptitude and reasoning preparation',
      totalTests: 6,
      features: [
        '✓ 6 CSAT Tests (50 Q each)',
        '✓ Logical Reasoning',
        '✓ Analytical Ability',
        '✓ Decision Making',
        '✓ Basic Numeracy',
        '✓ Time Management Tips',
        '✓ Question Selection Strategy',
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
      badge: 'BEST VALUE - SAVE 22%',
      badgeColor: 'bg-gradient-to-r from-yellow-500/40 to-orange-500/40 text-yellow-300 border-yellow-500/50',
      description: 'Everything bundled - Save ₹447! Complete preparation system.',
      totalTests: 66,
      features: [
        '✓ Includes Standard Test Series (24 tests)',
        '✓ Includes Uttarakhand Intensive (20 tests)',
        '✓ Includes Current Affairs Intensive (12 tests)',
        '✓ Includes CSAT Tests (6 tests)',
        '✓ Total: 66 expertly designed tests',
        '✓ Save 22% vs. purchasing separately',
        '✓ Lifetime access to all tests',
        '✓ Performance tracking dashboard',
      ],
      bestFor: 'Complete Preparation',
      icon: CheckCircle,
      highlight: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* HEADER WITH LAUNCH DATE */}
      <section className="py-6 px-4 border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-yellow-600">
              🚀 Test Series Launched: September 25, 2026
            </p>
            <p className="text-sm text-slate-400">
              📝 Free Sample Tests - Coming Soon
            </p>
          </div>
          <p className="text-sm font-semibold text-slate-300">
            Aligned with 2024-2025 UKPSC Prelims Exam
          </p>
        </div>
      </section>

      {/* HERO SECTION */}
      <section className="py-16 md:py-20 px-4 border-b border-slate-800">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Master UKPSC with Comprehensive Test Series
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mb-8">
            Six complete test packages covering all exam domains. From budget-friendly basics to comprehensive premium bundles. Choose your preparation level.
          </p>
        </div>
      </section>

      {/* TOP ROW: BASIC & STANDARD */}
      <section className="py-16 px-4 border-b border-slate-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12">Choose Your Test Series</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* BASIC */}
            {testPackages.filter(p => p.id === 'basic').map(pkg => (
              <div key={pkg.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 hover:border-slate-600 transition-colors">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <p className="text-5xl font-bold text-white">{pkg.totalTests}</p>
                    <p className="text-sm font-semibold text-yellow-600 uppercase">{pkg.name}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${pkg.badgeColor}`}>{pkg.badge}</span>
                </div>
                <p className="text-slate-300 text-sm mb-6">{pkg.description}</p>
                <p className="text-3xl font-bold text-white mb-6">{pkg.price}</p>
                <div className="space-y-2 mb-6 text-sm text-slate-400">
                  {pkg.features.map((f, i) => <p key={i}>{f}</p>)}
                </div>
                <p className="text-yellow-600 text-sm font-semibold mb-4">Best For: {pkg.bestFor}</p>
                <button onClick={() => setShowRegistration(true)} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                  Register Interest - {pkg.price}
                </button>
              </div>
            ))}

            {/* STANDARD */}
            {testPackages.filter(p => p.id === 'standard').map(pkg => (
              <div key={pkg.id} className="bg-gradient-to-br from-blue-600/10 to-blue-700/10 border border-blue-500/30 rounded-lg p-8 shadow-lg">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <p className="text-5xl font-bold text-white">{pkg.totalTests}</p>
                    <p className="text-sm font-semibold text-yellow-600 uppercase">{pkg.name}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${pkg.badgeColor}`}>{pkg.badge}</span>
                </div>
                <p className="text-slate-300 text-sm mb-6">{pkg.description}</p>
                <p className="text-3xl font-bold text-white mb-6">{pkg.price}</p>
                <div className="space-y-2 mb-6 text-sm text-slate-400">
                  {pkg.features.map((f, i) => <p key={i}>{f}</p>)}
                </div>
                <p className="text-yellow-600 text-sm font-semibold mb-4">Best For: {pkg.bestFor}</p>
                <button onClick={() => setShowRegistration(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                  Register Interest - {pkg.price}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MIDDLE ROW: UTTARAKHAND, CURRENT AFFAIRS, CSAT */}
      <section className="py-16 px-4 border-b border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testPackages.filter(p => ['uttarakhand', 'currentaffairs', 'csat'].includes(p.id)).map(pkg => (
              <div key={pkg.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 hover:border-slate-600 transition-colors">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <p className="text-5xl font-bold text-white">{pkg.totalTests}</p>
                    <p className="text-sm font-semibold text-yellow-600 uppercase">{pkg.name}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${pkg.badgeColor}`}>{pkg.badge}</span>
                </div>
                <p className="text-slate-300 text-sm mb-6">{pkg.description}</p>
                <p className="text-3xl font-bold text-white mb-6">{pkg.price}</p>
                <div className="space-y-2 mb-6 text-sm text-slate-400">
                  {pkg.features.map((f, i) => <p key={i}>{f}</p>)}
                </div>
                <p className="text-yellow-600 text-sm font-semibold mb-4">Best For: {pkg.bestFor}</p>
                <button onClick={() => setShowRegistration(true)} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                  Register Interest - {pkg.price}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM: PREMIUM BUNDLE - HIGHLIGHTED */}
      <section className="py-20 md:py-28 px-4 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-6xl mx-auto">
          {testPackages.filter(p => p.id === 'premium').map(pkg => (
            <div key={pkg.id} className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border-2 border-yellow-600/50 rounded-xl p-12 shadow-2xl">
              <div className="text-center mb-8">
                <span className={`inline-block text-xs font-bold px-4 py-2 rounded-full border mb-4 ${pkg.badgeColor}`}>{pkg.badge}</span>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{pkg.name}</h2>
                <p className="text-lg text-slate-300 max-w-2xl mx-auto">{pkg.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">Complete Bundle Includes:</h3>
                  <div className="space-y-3">
                    {pkg.features.map((f, i) => (
                      <p key={i} className="text-slate-300 text-sm flex items-start gap-3">
                        <CheckCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={18} />
                        <span>{f}</span>
                      </p>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-600/30 rounded-xl p-8 text-center flex flex-col justify-center">
                  <p className="text-sm text-slate-400 uppercase tracking-wide mb-2">Premium Bundle Price</p>
                  <p className="text-5xl font-bold text-white mb-2">{pkg.price}</p>
                  <p className="text-slate-400 line-through text-lg mb-6">{pkg.originalPrice}</p>
                  <div className="bg-yellow-600/10 border border-yellow-600/30 rounded-lg p-4 mb-8">
                    <p className="text-yellow-600 font-semibold text-sm">✓ Save ₹447 (22% discount)</p>
                  </div>
                  <button onClick={() => setShowRegistration(true)} className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg mb-4">
                    Get Premium Bundle
                  </button>
                  <p className="text-xs text-slate-400">Lifetime access • Instant activation</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Registration Modal */}
      {showRegistration && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-md w-full p-8 relative">
            <button onClick={() => setShowRegistration(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-white mb-2">Register Your Interest</h2>
            <p className="text-slate-300 text-sm mb-6">Join our UKPSC test preparation program and get exclusive offers.</p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleFormChange} required placeholder="Your name" className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-yellow-600 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleFormChange} required placeholder="your@email.com" className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-yellow-600 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">Phone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleFormChange} required placeholder="10-digit phone" className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-yellow-600 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">Test Series Interest</label>
                <select name="courseInterest" value={formData.courseInterest} onChange={handleFormChange} required className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-yellow-600 outline-none">
                  <option value="">Select your interest</option>
                  <option value="Basic Test Series - ₹499">Basic Test Series - ₹499</option>
                  <option value="Standard Test Series - ₹799">Standard Test Series - ₹799 (RECOMMENDED)</option>
                  <option value="Uttarakhand Intensive - ₹599">Uttarakhand Intensive - ₹599</option>
                  <option value="Current Affairs Intensive - ₹399">Current Affairs Intensive - ₹399</option>
                  <option value="CSAT Test Series - ₹249">CSAT Test Series - ₹249</option>
                  <option value="Premium Bundle - ₹1,599">Premium Bundle - ₹1,599 (BEST VALUE)</option>
                </select>
              </div>

              <button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded-lg transition-colors mt-6">
                Register Interest
              </button>
            </form>

            <div className="bg-yellow-600/10 border border-yellow-600/30 rounded-lg p-4 mt-6">
              <p className="text-yellow-300 text-xs font-semibold">💰 Tip: Premium Bundle saves ₹447 vs individual purchase!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
