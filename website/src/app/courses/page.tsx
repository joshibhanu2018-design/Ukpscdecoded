'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Calendar,
  Bell,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  PlayCircle,
  Clock,
  X,
  Loader2,
  CreditCard,
} from 'lucide-react';
import courses from '@content/courses.json';
import { submitLead } from '@/lib/leads';

const headerGradients: Record<string, string> = {
  saffron: 'bg-gradient-to-br from-saffron-50 to-ivory-50',
  jade: 'bg-gradient-to-br from-jade-50 to-ivory-50',
  graphite: 'bg-gradient-to-br from-graphite-50 to-ivory-50',
  blue: 'bg-gradient-to-br from-blue-50 to-ivory-50',
};

type Course = (typeof courses.items)[number];

export default function CoursesPage() {
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const openRegister = (course: Course) => {
    setActiveCourse(course);
    setDone(false);
    setForm({ name: '', email: '', phone: '' });
  };

  const closeRegister = () => setActiveCourse(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await submitLead({
      ...form,
      course: activeCourse?.title,
      source: 'course-interest',
    });
    setLoading(false);
    setDone(true);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-graphite-900 via-graphite-800 to-graphite-950 text-white section-padding">
        <div className="container-custom text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <GraduationCap className="w-10 h-10 text-saffron-400" />
          </div>
          <h1 className="heading-xl text-white mb-6">{courses.heading}</h1>
          <p className="text-lg text-graphite-400 max-w-2xl mx-auto">
            {courses.subtitle}
          </p>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses.items.map((course) => {
              const c = course as Course & {
                priceLabel?: string;
                demoVideoUrl?: string;
                paymentUrl?: string;
              };
              return (
                <div key={course.title} className="card relative flex flex-col">
                  {/* Badge */}
                  {course.badge && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="inline-flex items-center gap-1 bg-saffron-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                        <Sparkles className="w-3 h-3" />
                        {course.badge}
                      </span>
                    </div>
                  )}

                  {/* Card Header */}
                  <div
                    className={`p-6 pb-4 ${
                      headerGradients[course.color] ?? headerGradients.graphite
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold text-graphite-500 uppercase tracking-wider mb-3">
                      <Calendar className="w-3.5 h-3.5" />
                      {course.duration}
                    </div>
                    <h3 className="heading-md text-graphite-900 mb-2">{course.title}</h3>
                    <p className="text-graphite-600 text-sm leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="p-6 pt-4 flex-1">
                    <ul className="space-y-3">
                      {course.features.map((feature) => (
                        <li
                          key={feature.text}
                          className="flex items-start gap-3 text-sm text-graphite-700"
                        >
                          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-jade-50 text-jade-600 flex-shrink-0">
                            <CheckCircle2 className="w-4 h-4" />
                          </span>
                          {feature.text}
                        </li>
                      ))}
                    </ul>

                    {/* Demo video slot */}
                    <div className="mt-5">
                      {c.demoVideoUrl ? (
                        <a
                          href={c.demoVideoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700"
                        >
                          <PlayCircle className="w-4 h-4" />
                          Watch Demo Lecture
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-sm font-medium text-graphite-400">
                          <Clock className="w-4 h-4" />
                          Demo video coming soon
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className="p-6 pt-0 mt-auto">
                    <div className="flex items-baseline gap-3 mb-4">
                      {c.priceLabel ? (
                        <span className="text-2xl font-display font-bold text-graphite-900">
                          {c.priceLabel}
                        </span>
                      ) : (
                        <span className="text-3xl font-display font-bold text-graphite-900">
                          ₹{course.price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    {c.paymentUrl ? (
                      <a
                        href={c.paymentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full btn-primary flex items-center justify-center gap-2"
                      >
                        <CreditCard className="w-4 h-4" />
                        Enroll Now
                      </a>
                    ) : (
                      <button
                        onClick={() => openRegister(course)}
                        className="w-full btn-primary flex items-center justify-center gap-2"
                      >
                        <Bell className="w-4 h-4" />
                        Register Interest
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Free Content CTA */}
      <section className="section-padding bg-gradient-to-br from-saffron-50 via-ivory-50 to-jade-50">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-graphite-800 to-graphite-900 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="heading-lg text-white mb-4">{courses.freeCta.heading}</h2>
            <p className="text-graphite-300 mb-8 max-w-xl mx-auto">
              {courses.freeCta.subtitle}
            </p>
            <Link href="/free-content" className="btn-primary inline-flex items-center gap-2">
              {courses.freeCta.buttonText}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Register Interest Modal */}
      {activeCourse && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <button
              onClick={closeRegister}
              aria-label="Close"
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-graphite-100 hover:bg-graphite-200 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-graphite-600" />
            </button>

            {done ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-jade-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-jade-600" />
                </div>
                <h3 className="heading-md text-graphite-900 mb-2">{courses.register.successHeading}</h3>
                <p className="text-graphite-600 text-sm mb-6">{courses.register.successMessage}</p>
                <button onClick={closeRegister} className="btn-primary w-full">
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-br from-saffron-500 to-saffron-600 p-6 text-white">
                  <span className="inline-block text-xs font-bold uppercase tracking-wider bg-white/20 rounded-full px-3 py-1 mb-2">
                    {activeCourse.title}
                  </span>
                  <h3 className="text-xl font-display font-bold leading-tight">
                    {courses.register.heading}
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-sm text-graphite-600 mb-4">{courses.register.subtitle}</p>
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder={courses.register.namePlaceholder}
                      className="w-full px-4 py-2.5 rounded-lg border border-graphite-200 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 outline-none text-sm text-graphite-800"
                    />
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder={courses.register.emailPlaceholder}
                      className="w-full px-4 py-2.5 rounded-lg border border-graphite-200 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 outline-none text-sm text-graphite-800"
                    />
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder={courses.register.phonePlaceholder}
                      className="w-full px-4 py-2.5 rounded-lg border border-graphite-200 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 outline-none text-sm text-graphite-800"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bell className="w-4 h-4" />}
                      {courses.register.buttonText}
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
