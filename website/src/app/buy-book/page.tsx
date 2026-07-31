'use client';

import { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
  Loader2,
  PlayCircle,
  Clock,
} from 'lucide-react';
import { getIcon } from '@/lib/icons';
import CountdownBanner from '@/components/CountdownBanner';
import BookPreview from '@/components/BookPreview';
import book from '@content/book.json';

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

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
          amount: book.price,
          purpose: `${book.title} — ${book.subtitle}`,
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
    `Hi! I want to order "${book.title} — ${book.subtitle}" (₹${book.price}). Please share the details.`
  );

  return (
    <div>
      {/* Early-Bird Countdown Banner */}
      {book.earlyBird?.enabled && (
        <CountdownBanner
          deadline={book.earlyBird.deadline}
          badge={book.earlyBird.badge}
          headline={book.earlyBird.headline}
          subtext={book.earlyBird.subtext}
          stockNote={book.earlyBird.stockNote}
        />
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-graphite-900 via-graphite-800 to-graphite-950 text-white section-padding">
        <div className="container-custom text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <BookOpen className="w-10 h-10 text-saffron-400" />
          </div>
          <h1 className="heading-xl text-white mb-6">{book.title}</h1>
          <p className="text-xl md:text-2xl text-graphite-300 font-display font-medium">
            {book.subtitle}
          </p>
        </div>
      </section>

      {/* Main Content — Two Column */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left — Book Details */}
            <div>
              <h2 className="heading-lg text-graphite-900 mb-2">{book.title}</h2>
              <p className="text-lg text-graphite-600 mb-6">{book.description}</p>

              {/* What's Included */}
              <div className="bg-jade-50 border border-jade-200 rounded-xl p-5 mb-8">
                <h3 className="font-display font-semibold text-jade-800 mb-3">
                  {book.includedHeading}
                </h3>
                <ul className="space-y-2">
                  {book.included.map((item) => (
                    <li
                      key={item.text}
                      className="flex items-center gap-2 text-sm text-jade-700"
                    >
                      <CheckCircle2 className="w-4 h-4 text-jade-600 flex-shrink-0" />
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Chapters */}
              <h3 className="heading-md text-graphite-900 mb-2">{book.chaptersHeading}</h3>
              {book.chaptersNote && (
                <p className="text-sm text-graphite-500 mb-4">{book.chaptersNote}</p>
              )}
              <div className="space-y-4">
                {book.chapters.map((section) => (
                  <div key={section.part} className="border border-graphite-100 rounded-lg p-4">
                    <h4 className="font-display font-semibold text-graphite-800 mb-3 text-sm uppercase tracking-wider">
                      {section.part}
                    </h4>
                    <ul className="space-y-2.5">
                      {section.items.map((item) => {
                        const chapterItem = item as {
                          number?: number;
                          title: string;
                          videoUrl?: string;
                        };
                        return (
                          <li
                            key={chapterItem.title}
                            className="flex items-start gap-2.5 text-sm text-graphite-600"
                          >
                            <span className="flex-shrink-0 w-5 h-5 rounded bg-saffron-100 text-saffron-700 text-[11px] font-bold flex items-center justify-center mt-0.5">
                              {chapterItem.number ?? "•"}
                            </span>
                            <div className="flex-1">
                              <span>{chapterItem.title}</span>
                              {chapterItem.videoUrl ? (
                                <a
                                  href={chapterItem.videoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ml-2 inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 align-middle"
                                >
                                  <PlayCircle className="w-3.5 h-3.5" />
                                  Watch lecture
                                </a>
                              ) : (
                                <span className="ml-2 inline-flex items-center gap-1 text-[11px] font-medium text-graphite-400 align-middle">
                                  <Clock className="w-3 h-3" />
                                  Video coming soon
                                </span>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Order Form */}
            <div id="order-form">
              <div className="card p-6 sm:p-8 sticky top-24">
                {/* Price */}
                <div className="text-center mb-6 pb-6 border-b border-graphite-100">
                  <p className="text-sm text-graphite-500 uppercase tracking-wider mb-1">Price</p>
                  <div className="flex items-baseline justify-center gap-3">
                    <span className="text-4xl font-display font-bold text-graphite-900">
                      ₹{book.price}
                    </span>
                    <span className="text-lg text-graphite-400 line-through">
                      ₹{book.originalPrice}
                    </span>
                  </div>
                  <p className="text-xs text-jade-600 font-medium mt-1">{book.shippingNote}</p>
                  {book.earlyBird?.enabled && (
                    <div className="mt-3 inline-flex items-center gap-1.5 bg-saffron-50 text-saffron-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                      🔥 Early-bird: Save ₹{book.originalPrice - book.price} ({Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)}% off)
                    </div>
                  )}
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
                        Buy Now — ₹{book.price}
                      </>
                    )}
                  </button>
                </form>

                {/* WhatsApp Alternative */}
                <div className="mt-4">
                  <a
                    href={`https://wa.me/${book.whatsappNumber}?text=${whatsappMessage}`}
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

      {/* Free Sample Pages */}
      <BookPreview
        heading={book.previewHeading}
        subtext={book.previewSubtext}
        previews={book.freePreviews}
        price={book.price}
      />

      {/* Trust Badges */}
      <section className="section-padding bg-graphite-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {book.trustBadges.map((badge) => {
              const Icon = getIcon(badge.icon);
              return (
                <div
                  key={badge.title}
                  className="flex flex-col items-center text-center p-6 bg-white rounded-xl border border-graphite-100"
                >
                  <Icon className="w-8 h-8 text-jade-600 mb-3" />
                  <h3 className="font-display font-semibold text-graphite-800 mb-1">
                    {badge.title}
                  </h3>
                  <p className="text-sm text-graphite-500">{badge.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
