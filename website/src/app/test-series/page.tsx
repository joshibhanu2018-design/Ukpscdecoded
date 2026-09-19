'use client';

import { useState } from 'react';
import { CheckCircle, Target, Zap, BookOpen, Brain, Clock, X, Calendar, ArrowDown } from 'lucide-react';

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

      alert('Thank you! We will contact you soon.');
      setFormData({ name: '', email: '', phone: '', courseInterest: '' });
      setShowRegistration(false);
    } catch (error) {
      console.error('Submission error:', error);
      alert('Registration submitted!');
      setShowRegistration(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* SECTION 1: PREMIUM HERO */}
      <section className="py-16 md:py-20 px-4 border-b border-slate-800">
        <div className="max-w-5xl mx-auto">
          {/* Premium Label */}
          <div className="mb-6">
            <p className="text-xs md:text-sm font-semibold tracking-widest text-yellow-600 uppercase">
              UKPSC Decoded | Premium Preparation
            </p>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Your Complete UKPSC Test Preparation System
          </h1>

          {/* Supporting Text */}
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-8 leading-relaxed">
            A comprehensive test series bundling all four essential preparation components: standard full and sectional tests, Uttarakhand-specific tests, current affairs analysis, and CSAT aptitude preparation. Everything you need to practice strategically and track progress through 66 expertly designed tests.
          </p>

          {/* Premium Badge */}
          <div className="inline-flex items-center gap-4 bg-slate-800/50 border border-slate-700 rounded-lg px-6 py-4 mb-12">
            <div className="text-center">
              <p className="text-xs text-slate-400 uppercase tracking-wide">Total Tests</p>
              <p className="text-2xl font-bold text-white">66</p>
            </div>
            <div className="w-px h-12 bg-slate-700"></div>
            <div className="text-center">
              <p className="text-xs text-slate-400 uppercase tracking-wide">Access</p>
              <p className="text-2xl font-bold text-white">Lifetime</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: PRICING & PURCHASE CARD */}
      <section className="py-16 md:py-20 px-4 border-b border-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left: Value Proposition */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                One Bundle. Four Preparation Components.
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-yellow-600 flex-shrink-0 mt-1" size={20} />
                  <span className="text-slate-300">24 Standard Full & Sectional Tests</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-yellow-600 flex-shrink-0 mt-1" size={20} />
                  <span className="text-slate-300">20 Uttarakhand-Specific Tests</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-yellow-600 flex-shrink-0 mt-1" size={20} />
                  <span className="text-slate-300">12 Current Affairs & National Topics Tests</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-yellow-600 flex-shrink-0 mt-1" size={20} />
                  <span className="text-slate-300">6 CSAT Aptitude Tests</span>
                </li>
              </ul>
            </div>

            {/* Right: Pricing Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-600/30 rounded-xl p-8 shadow-xl">
              <p className="text-sm text-slate-400 uppercase tracking-wide mb-2">Premium Bundle Price</p>
              
              <div className="mb-6">
                <p className="text-5xl font-bold text-white mb-2">₹1,599</p>
                <p className="text-slate-400 line-through text-lg">₹2,046</p>
              </div>

              <div className="bg-yellow-600/10 border border-yellow-600/30 rounded-lg p-4 mb-8">
                <p className="text-yellow-600 font-semibold text-sm">
                  ✓ Save ₹447 vs. purchasing separately
                </p>
              </div>

              <button
                onClick={() => setShowRegistration(true)}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-4 px-6 rounded-lg transition-colors mb-4 text-lg"
              >
                Get Premium Test Series
              </button>

              <p className="text-center text-xs text-slate-400">
                Lifetime access • Instant activation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: TOP ROW - BASIC & STANDARD */}
      <section className="py-16 md:py-20 px-4 border-b border-slate-800">
        <div className="max-w-5xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
            What's Included in Your Bundle
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Test Series Card */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 hover:border-slate-600 transition-colors">
              <div className="mb-6">
                <p className="text-5xl font-bold text-white mb-2">12</p>
                <p className="text-sm font-semibold text-yellow-600 uppercase tracking-wide">Basic Test Series</p>
              </div>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                Entry-level preparation focusing on foundational concepts across all subjects
              </p>
              <div className="space-y-3 text-sm text-slate-400">
                <div>
                  <p className="font-semibold text-white mb-2">✓ 6 Full Mock Tests (150 Q each)</p>
                  <p className="text-xs ml-4">Complete exam simulations at practice difficulty</p>
                </div>
                <div>
                  <p className="font-semibold text-white mb-2">✓ 6 Sectional Tests (50 Q each):</p>
                  <div className="ml-4 space-y-1 text-xs">
                    <p>• Polity</p>
                    <p>• History</p>
                    <p>• Economy</p>
                    <p>• Geography</p>
                    <p>• Uttarakhand</p>
                    <p>• Science & Environment</p>
                  </div>
                </div>
                <p className="text-yellow-600 text-xs font-semibold mt-4">Designed for 2024-2025 patterns</p>
              </div>
            </div>

            {/* Standard Test Series Card */}
            <div className="bg-gradient-to-br from-yellow-600/10 to-orange-600/10 border border-yellow-600/30 rounded-lg p-8 shadow-lg">
              <div className="mb-6">
                <p className="text-5xl font-bold text-white mb-2">24</p>
                <p className="text-sm font-semibold text-yellow-600 uppercase tracking-wide">Standard Test Series</p>
              </div>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                Comprehensive testing with dual focus on full mocks and targeted sectional practice
              </p>
              <div className="space-y-3 text-sm text-slate-400">
                <div>
                  <p className="font-semibold text-white mb-2">✓ 12 Full Mock Tests (150 Q each)</p>
                  <p className="text-xs ml-4">Advanced exam patterns at actual difficulty level</p>
                </div>
                <div>
                  <p className="font-semibold text-white mb-2">✓ 12 Sectional Tests (50 Q each):</p>
                  <div className="ml-4 space-y-1 text-xs">
                    <p>• 2 Tests Each: Polity, Geography</p>
                    <p>• 2 Tests Each: History, Economy</p>
                    <p>• 2 Tests Each: Uttarakhand</p>
                    <p>• 2 Tests Each: Science & Environment</p>
                  </div>
                </div>
                <p className="text-yellow-600 text-xs font-semibold mt-4">Aligned with 2024-2025 exam patterns</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: MIDDLE ROW - UTTARAKHAND, CURRENT AFFAIRS, CSAT */}
      <section className="py-16 md:py-20 px-4 border-b border-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Uttarakhand Intensive Card */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 hover:border-slate-600 transition-colors">
              <div className="mb-6">
                <p className="text-5xl font-bold text-white mb-2">20</p>
                <p className="text-sm font-semibold text-yellow-600 uppercase tracking-wide">Uttarakhand Intensive</p>
              </div>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                Deep state-specific preparation covering all critical Uttarakhand topics
              </p>
              <div className="space-y-2 text-sm text-slate-400">
                <p className="font-semibold text-white mb-3">✓ 20 State-Focused Tests (50 Q each)</p>
                <p className="text-xs">Coverage areas:</p>
                <ul className="ml-4 space-y-1 text-xs">
                  <li>• History & Culture</li>
                  <li>• Geography & Climate</li>
                  <li>• Administration & Governance</li>
                  <li>• Economy & Development</li>
                  <li>• State Current Affairs</li>
                  <li>• Budget & Policy</li>
                </ul>
              </div>
            </div>

            {/* Current Affairs Card */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 hover:border-slate-600 transition-colors">
              <div className="mb-6">
                <p className="text-5xl font-bold text-white mb-2">12</p>
                <p className="text-sm font-semibold text-yellow-600 uppercase tracking-wide">Current Affairs</p>
              </div>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                National and state current affairs practice with exam-focused analysis
              </p>
              <div className="space-y-2 text-sm text-slate-400">
                <p className="font-semibold text-white mb-3">✓ 12 Current Affairs Tests (50 Q each)</p>
                <p className="text-xs">Coverage areas:</p>
                <ul className="ml-4 space-y-1 text-xs">
                  <li>• National Current Affairs</li>
                  <li>• Uttarakhand Affairs</li>
                  <li>• Budget & Economic News</li>
                  <li>• Governance & Policies</li>
                  <li>• Environment & Science</li>
                  <li>• Social Development</li>
                </ul>
              </div>
            </div>

            {/* CSAT Card */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 hover:border-slate-600 transition-colors">
              <div className="mb-6">
                <p className="text-5xl font-bold text-white mb-2">6</p>
                <p className="text-sm font-semibold text-yellow-600 uppercase tracking-wide">CSAT Tests</p>
              </div>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                Aptitude and reasoning preparation for qualifying CSAT examination
              </p>
              <div className="space-y-2 text-sm text-slate-400">
                <p className="font-semibold text-white mb-3">✓ 6 CSAT Tests (50 Q each)</p>
                <p className="text-xs">Coverage areas:</p>
                <ul className="ml-4 space-y-1 text-xs">
                  <li>• Logical Reasoning</li>
                  <li>• Analytical Ability</li>
                  <li>• Decision Making</li>
                  <li>• Basic Numeracy</li>
                  <li>• Time Management</li>
                  <li>• Question Selection Strategy</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: WHY THIS BUNDLE */}
      <section className="py-16 md:py-20 px-4 border-b border-slate-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Why This Bundle Exists
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Complete Preparation Coverage</h3>
              <p className="text-slate-300 leading-relaxed">
                UKPCS examinations require mastery across multiple domains: foundational subject knowledge, state-specific administration and history, current affairs awareness, and aptitude in logical reasoning. This bundle addresses all four through strategically designed test suites.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Significant Value at Scale</h3>
              <p className="text-slate-300 leading-relaxed">
                Purchasing 66 individual tests costs ₹2,046. The bundle reduces this to ₹1,599, making structured comprehensive preparation more accessible while maintaining test quality and variety.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Strategic Practice Architecture</h3>
              <p className="text-slate-300 leading-relaxed">
                Tests progress logically: start with fundamental sectional practice, advance to integrated full mock tests, deepen with state-specific content, and refine with current affairs and aptitude work.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Lifetime Access</h3>
              <p className="text-slate-300 leading-relaxed">
                One-time purchase provides ongoing access to all tests, allowing revision cycles, performance tracking over time, and reference during exam preparation over multiple years.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: ACCESS & DELIVERY */}
      <section className="py-16 md:py-20 px-4 border-b border-slate-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
            Access & Delivery
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Instant Activation</h3>
              <p className="text-slate-300 text-sm">
                After purchase, test access is immediately available. No delays. Begin practice on the same day.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Lifetime Access</h3>
              <p className="text-slate-300 text-sm">
                Single purchase. Unlimited access for years. Revisit tests for reinforcement or competitive referencing.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Performance Tracking</h3>
              <p className="text-slate-300 text-sm">
                Track scores, identify weak areas, and monitor improvement over time across all 66 tests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: FAQ */}
      <section className="py-16 md:py-20 px-4 border-b border-slate-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <details className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 group cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-white">
                How do I access the tests after purchase?
                <span className="transform group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-slate-300 text-sm mt-4">
                After completing your purchase, you'll receive login credentials via email. Access the test platform immediately and begin practice.
              </p>
            </details>

            <details className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 group cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-white">
                What if I purchase individually vs. the bundle?
                <span className="transform group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-slate-300 text-sm mt-4">
                Purchasing all 66 tests separately would cost ₹2,046. This bundle offers the same content for ₹1,599, saving ₹447.
              </p>
            </details>

            <details className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 group cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-white">
                Are these tests aligned with current UKPCS patterns?
                <span className="transform group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-slate-300 text-sm mt-4">
                Yes. All tests are designed to reflect 2024-2025 UKPCS exam patterns, including question types, difficulty calibration, and topic distribution.
              </p>
            </details>

            <details className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 group cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-white">
                Can I access the tests on mobile?
                <span className="transform group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-slate-300 text-sm mt-4">
                Yes. The test platform is fully responsive and works on mobile, tablet, and desktop devices.
              </p>
            </details>

            <details className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 group cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-white">
                Is there a refund policy?
                <span className="transform group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-slate-300 text-sm mt-4">
                Please contact our support team for details on our refund policy and any other questions about your purchase.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* SECTION 8: PREMIUM PRODUCT SECTION - BOTTOM (With scroll-to anchor) */}
      <section className="py-20 md:py-28 px-4 bg-gradient-to-b from-slate-950 to-slate-900" id="premium">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold tracking-widest text-yellow-600 uppercase mb-4">
              Premium Test Series Bundle
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              The Complete Preparation System
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-12">
              All four components bundled together. Comprehensive coverage. Lifetime access. Strategic pricing.
            </p>
          </div>

          {/* Premium Summary Card */}
          <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border-2 border-yellow-600/50 rounded-xl p-12 shadow-2xl mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-12">
              <div>
                <p className="text-4xl font-bold text-white mb-2">66</p>
                <p className="text-sm text-slate-300">Tests Included</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-white mb-2">4</p>
                <p className="text-sm text-slate-300">Preparation Types</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-white mb-2">₹447</p>
                <p className="text-sm text-slate-300">Savings</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-white mb-2">∞</p>
                <p className="text-sm text-slate-300">Lifetime Access</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-2xl md:text-3xl text-yellow-600 font-semibold mb-2">₹1,599</p>
              <p className="text-slate-400 line-through mb-8">₹2,046</p>
              
              <button
                onClick={() => setShowRegistration(true)}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-4 px-12 rounded-lg transition-colors text-lg inline-block mb-4"
              >
                Get Premium Test Series
              </button>
              
              <p className="text-sm text-slate-300">
                Lifetime access • Instant activation • Complete exam preparation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Modal */}
      {showRegistration && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowRegistration(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-white mb-2">Register Your Interest</h2>
            <p className="text-slate-300 text-sm mb-6">Fill in your details and we'll help you get started with the Premium Test Series.</p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  placeholder="Your name"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-yellow-600 outline-none"
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
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-yellow-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  required
                  placeholder="10-digit phone"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-yellow-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">Interest</label>
                <select
                  name="courseInterest"
                  value={formData.courseInterest}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-yellow-600 outline-none"
                >
                  <option value="">Select your interest</option>
                  <option value="Premium Bundle - ₹1,599">Premium Bundle - ₹1,599</option>
                  <option value="Standard + Uttarakhand">Standard + Uttarakhand</option>
                  <option value="Current Affairs Focus">Current Affairs Focus</option>
                  <option value="CSAT Preparation">CSAT Preparation</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded-lg transition-colors mt-6"
              >
                Register Interest
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
