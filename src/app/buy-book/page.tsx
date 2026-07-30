'use client';

import { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Truck,
  Banknote,
  RotateCcw,
  MessageCircle,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

const chapters = [
  { part: 'Part A — History', items: ['Ancient History of Uttarakhand', 'Medieval Dynasties (Katyuri, Panwar, Chand)', 'British Rule & Freedom Struggle', 'Statehood Movement', 'Post-Independence Development'] },
  { part: 'Part B — Geography', items: ['Physical Geography & Topography', 'Rivers, Lakes & Glaciers', 'Climate & Biodiversity', 'National Parks & Wildlife Sanctuaries', 'Minerals & Natural Resources'] },
  { part: 'Part C — Polity & Economy', items: ['State Administration & Governance', 'Panchayati Raj & Local Bodies', 'Economy & Planning', 'Agriculture & Industry', 'Government Schemes & Programs'] },
  { part: 'Part D — Society & Culture', items: ['Tribes & Social Structure', 'Fairs, Festivals & Traditions', 'Art, Music & Dance Forms', 'Literature & Languages', 'Famous Personalities'] },
  { part: 'Part E — General Studies', items: ['Indian Polity (Comparative)', 'Indian Economy (with State Focus)', 'Current Affairs Capsule'] },
];

export default function BuyBookPage() {
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Uttarakhand',
    pincode: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          amount: 499,
          purpose: 'Decode Uttarakhand — The Complete Guidebook',
        }),
      });

      const data = await res.json();

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        setError(data.error || 'Something went wrong. Please try again or order via WhatsApp.');
      }
    } catch {
      setError('Network error. Please try again or order via WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    'Hi! I want to order "Decode Uttarakhand — The Complete Guidebook" (₹499). Please share the details.'
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-graphite-900 via-graphite-800 to-graphite-950 text-white section-padding">
        <div className="container-custom text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <BookOpen className="w-10 h-10 text-saffron-400" />
          </div>
          <h1 className="heading-xl text-white mb-6">
            Decode Uttarakhand
          </h1>
          <p className="text-xl md:text-2xl text-graphite-300 font-display font-medium">
            The Complete Guidebook
          </p>
        </div>
      </section>

      {/* Main Content — Two Column */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left — Book Details */}
            <div>
              <h2 className="heading-lg text-graphite-900 mb-2">Decode Uttarakhand</h2>
              <p className="text-lg text-graphite-600 mb-6">
                India&apos;s only single-volume guidebook covering all topics for UKPSC PCS, Lower PCS, RO/ARO, and UKSSSC exams.
              </p>

              {/* What's Included */}
              <div className="bg-jade-50 border border-jade-200 rounded-xl p-5 mb-8">
                <h3 className="font-display font-semibold text-jade-800 mb-3">What&apos;s Included</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-jade-700">
                    <CheckCircle2 className="w-4 h-4 text-jade-600 flex-shrink-0" />
                    Complete Paper V + Paper VI coverage
                  </li>
                  <li className="flex items-center gap-2 text-sm text-jade-700">
                    <CheckCircle2 className="w-4 h-4 text-jade-600 flex-shrink-0" />
                    2026 Edition — Latest syllabus aligned
                  </li>
                  <li className="flex items-center gap-2 text-sm text-jade-700">
                    <CheckCircle2 className="w-4 h-4 text-jade-600 flex-shrink-0" />
                    Current Affairs Capsule (up to Dec 2025)
                  </li>
                  <li className="flex items-center gap-2 text-sm text-jade-700">
                    <CheckCircle2 className="w-4 h-4 text-jade-600 flex-shrink-0" />
                    28 chapters, 500+ pages
                  </li>
                </ul>
              </div>

              {/* Chapters */}
              <h3 className="heading-md text-graphite-900 mb-4">28 Chapters Across 5 Parts</h3>
              <div className="space-y-4">
                {chapters.map((section) => (
                  <div key={section.part} className="border border-graphite-100 rounded-lg p-4">
                    <h4 className="font-display font-semibold text-graphite-800 mb-2 text-sm uppercase tracking-wider">
                      {section.part}
                    </h4>
                    <ul className="space-y-1.5">
                      {section.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-graphite-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-saffron-500 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Order Form */}
            <div>
              <div className="card p-6 sm:p-8 sticky top-24">
                {/* Price */}
                <div className="text-center mb-6 pb-6 border-b border-graphite-100">
                  <p className="text-sm text-graphite-500 uppercase tracking-wider mb-1">Price</p>
                  <div className="flex items-baseline justify-center gap-3">
                    <span className="text-4xl font-display font-bold text-graphite-900">₹499</span>
                    <span className="text-lg text-graphite-400 line-through">₹799</span>
                  </div>
                  <p className="text-xs text-jade-600 font-medium mt-1">Free shipping across India</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-graphite-700 mb-1">Full Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full px-4 py-2.5 rounded-lg border border-graphite-200 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 outline-none transition-all text-graphite-800 text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-graphite-700 mb-1">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full px-4 py-2.5 rounded-lg border border-graphite-200 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 outline-none transition-all text-graphite-800 text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-graphite-700 mb-1">Phone</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      className="w-full px-4 py-2.5 rounded-lg border border-graphite-200 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 outline-none transition-all text-graphite-800 text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-graphite-700 mb-1">Address</label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      required
                      value={form.address}
                      onChange={handleChange}
                      placeholder="House/Street/Locality"
                      className="w-full px-4 py-2.5 rounded-lg border border-graphite-200 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 outline-none transition-all text-graphite-800 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-graphite-700 mb-1">City</label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        required
                        value={form.city}
                        onChange={handleChange}
                        placeholder="City"
                        className="w-full px-4 py-2.5 rounded-lg border border-graphite-200 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 outline-none transition-all text-graphite-800 text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="pincode" className="block text-sm font-medium text-graphite-700 mb-1">Pincode</label>
                      <input
                        id="pincode"
                        name="pincode"
                        type="text"
                        required
                        value={form.pincode}
                        onChange={handleChange}
                        placeholder="6-digit"
                        className="w-full px-4 py-2.5 rounded-lg border border-graphite-200 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 outline-none transition-all text-graphite-800 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-graphite-700 mb-1">State</label>
                    <select
                      id="state"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-graphite-200 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 outline-none transition-all text-graphite-800 text-sm bg-white"
                    >
                      <option value="Uttarakhand">Uttarakhand</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Himachal Pradesh">Himachal Pradesh</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        Buy Now — ₹499
                      </>
                    )}
                  </button>
                </form>

                {/* WhatsApp Alternative */}
                <div className="mt-4">
                  <a
                    href={`https://wa.me/919999999999?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full btn-secondary flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Or Order via WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="section-padding bg-graphite-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl border border-graphite-100">
              <Truck className="w-8 h-8 text-jade-600 mb-3" />
              <h3 className="font-display font-semibold text-graphite-800 mb-1">Free Shipping</h3>
              <p className="text-sm text-graphite-500">Across all pincodes in India</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl border border-graphite-100">
              <Banknote className="w-8 h-8 text-jade-600 mb-3" />
              <h3 className="font-display font-semibold text-graphite-800 mb-1">Cash on Delivery Available</h3>
              <p className="text-sm text-graphite-500">Pay when you receive the book</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl border border-graphite-100">
              <RotateCcw className="w-8 h-8 text-jade-600 mb-3" />
              <h3 className="font-display font-semibold text-graphite-800 mb-1">7-Day Return Policy</h3>
              <p className="text-sm text-graphite-500">No questions asked returns</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
