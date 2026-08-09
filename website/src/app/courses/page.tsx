'use client';

import React, { useState } from 'react';
import { X, Loader2, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

interface CourseData {
  title: string;
  description: string;
  image: string;
  price: number;
  features: string[];
  cta: string;
  badge?: string;
}

const coursesData: CourseData[] = [
  {
    title: 'UKPSC / Upper PCS 2026 Prelims Crash Course',
    description: 'A focused Prelims crash course covering the most important and most-repeated topics — built directly from our PYQ Tracker and 60-Day Study Plan.',
    image: '/images/crash-course.jpg',
    price: 2399,
    features: [
      '50+ video lectures on high-yield & repeated topics',
      'Based on the PYQ Tracker + 60-Day Study Plan',
      '8 full-length tests (UK GK + National + State Current Affairs)',
      '4 CSAT tests included',
      'Doubt resolution session',
      'Study material included',
    ],
    cta: 'Register Interest',
    badge: 'Launching Soon',
  },
  {
    title: 'Uttarakhand GK Intensive',
    description: 'A deep-dive into every part of the Uttarakhand GK syllabus — the state-specific edge that decides selection.',
    image: '/images/intensive.jpg',
    price: 1399,
    features: [
      '25+ lectures covering all parts of the syllabus',
      '2 tests on Uttarakhand GK',
      'Study material included',
      'Demo video coming soon',
    ],
    cta: 'Register Interest',
    badge: 'New',
  },
  {
    title: 'Test Series',
    description: 'Practice like real exam quality questions with full-length tests on the actual pattern, plus detailed solutions.',
    image: '/images/test-series.jpg',
    price: 499,
    features: [
      '12 full-length tests',
      'Detailed solutions',
      'Performance analytics',
      'Community access',
    ],
    cta: 'Register Interest',
    badge: 'Launching Soon',
  },
  {
    title: 'Personalised Mentorship — with Bhanu Joshi',
    description: 'One-on-one mentorship with Bhanu Joshi — from beginner hand-holding to advanced answer-writing guidance, tailored to you.',
    image: '/images/mentorship.jpg',
    price:  starting </Rs>499 per session,
    features: [
      '1-on-1 personalized guidance, plans, resources,strategy',
      'Answer writing and answer evaluation',
      'Personalised Strategy sessions',
      'Specific study material created based on student need and problem area',
    ],
    cta: 'Register Interest',
    badge: 'Launching Soon',
  },
];

interface CourseModalProps {
  course: CourseData | null;
  isOpen: boolean;
  onClose: () => void;
}

function CourseModal({ course, isOpen, onClose }: CourseModalProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !course) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/course-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          courseInterested: course.title,
          message: form.message,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setDone(true);
        setTimeout(() => {
          setForm({ name: '', email: '', phone: '', message: '' });
          setDone(false);
          onClose();
        }, 3000);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Submission error:', err);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        <div className="bg-saffron-500 text-white p-6 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 hover:bg-saffron-600 p-1 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className="font-semibold text-white text-sm uppercase tracking-wide">
            {course.title}
          </h3>
          <p className="heading-md text-white mt-2">Register Your Interest</p>
        </div>

        <div className="p-6">
          {done ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-jade-500 mx-auto mb-3" />
              <h4 className="font-semibold text-graphite-900 mb-1">Thanks for registering!</h4>
              <p className="text-sm text-graphite-600">
                We'll contact you soon with course details and early-bird pricing.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-graphite-600 mb-4">
                Share your details and we'll notify you when this course opens — plus early-bird pricing.
              </p>

              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                className="w-full px-4 py-2.5 rounded-lg border border-graphite-200 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 outline-none text-sm text-graphite-800"
              />

              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email address"
                className="w-full px-4 py-2.5 rounded-lg border border-graphite-200 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 outline-none text-sm text-graphite-800"
              />

              <input
                required
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="WhatsApp number"
                className="w-full px-4 py-2.5 rounded-lg border border-graphite-200 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 outline-none text-sm text-graphite-800"
              />

              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Any specific questions or preferences? (Optional)"
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-graphite-200 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 outline-none text-sm text-graphite-800 resize-none"
              />

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-saffron-500 hover:bg-saffron-600 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  '🔔 Submit'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const [activeModal, setActiveModal] = useState<CourseData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (course: CourseData) => {
    setActiveModal(course);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActiveModal(null);
  };

  return (
    <div className="min-h-screen bg-graphite-50">
      <section className="bg-gradient-to-br from-graphite-900 to-graphite-950 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="heading-xl text-white mb-3">Our Courses</h1>
          <p className="text-graphite-300 max-w-2xl">
            Carefully designed to match every preparation stage — from Prelims crash prep to interview mentorship.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {coursesData.map((course, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              {course.badge && (
                <div className="bg-saffron-500 text-white px-4 py-2 text-xs font-semibold">
                  {course.badge}
                </div>
              )}

              <div className="p-6 sm:p-8">
                <h3 className="heading-md text-graphite-900 mb-2">{course.title}</h3>
                <p className="text-sm text-graphite-600 mb-6">{course.description}</p>

                <ul className="space-y-2 mb-8">
                  {course.features.map((feature, i) => (
                    <li key={i} className="flex gap-2 text-sm text-graphite-700">
                      <span className="text-jade-500 mt-1">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-graphite-200 pt-6">
                  <div className="text-2xl font-bold text-graphite-900 mb-4">₹{course.price.toLocaleString()}</div>
                  <button
                    onClick={() => openModal(course)}
                    className="w-full bg-saffron-500 hover:bg-saffron-600 text-white font-semibold py-3 rounded-lg transition-all active:scale-95"
                  >
                    {course.cta}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CourseModal course={activeModal} isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
