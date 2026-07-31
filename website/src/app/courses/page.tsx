'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Calendar,
  Bell,
  Mail,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  PlayCircle,
} from 'lucide-react';
import courses from '@content/courses.json';

const headerGradients: Record<string, string> = {
  saffron: 'bg-gradient-to-br from-saffron-50 to-ivory-50',
  jade: 'bg-gradient-to-br from-jade-50 to-ivory-50',
  graphite: 'bg-gradient-to-br from-graphite-50 to-ivory-50',
};

export default function CoursesPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.items.map((course) => (
              <div key={course.title} className="card relative flex flex-col">
                {/* Badge */}
                {course.launchingSoon && course.badge && (
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
                        className="flex items-center gap-3 text-sm text-graphite-700"
                      >
                        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-jade-50 text-jade-600 flex-shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                        </span>
                        {feature.text}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price & CTA */}
                <div className="p-6 pt-0 mt-auto">
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-3xl font-display font-bold text-graphite-900">
                      ₹{course.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-lg text-graphite-400 line-through">
                      ₹{course.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <button
                    disabled={course.launchingSoon}
                    className={
                      course.launchingSoon
                        ? 'w-full flex items-center justify-center gap-2 bg-graphite-200 text-graphite-500 font-semibold px-6 py-3 rounded-lg cursor-not-allowed'
                        : 'w-full btn-primary flex items-center justify-center gap-2'
                    }
                  >
                    <Bell className="w-4 h-4" />
                    {course.launchingSoon ? 'Notify Me' : 'Enroll Now'}
                  </button>
                  {course.freePreviewUrl && (
                    <a
                      href={course.freePreviewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 w-full inline-flex items-center justify-center gap-2 text-jade-700 font-semibold px-6 py-2.5 rounded-lg border-2 border-jade-200 hover:bg-jade-50 transition-all text-sm"
                    >
                      <PlayCircle className="w-4 h-4" />
                      Watch Free Preview Lecture
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Email Capture */}
      <section className="section-padding bg-gradient-to-br from-saffron-50 via-ivory-50 to-jade-50">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="heading-lg text-graphite-900 mb-4">
              {courses.emailCapture.heading}
            </h2>
            <p className="text-graphite-600 mb-8">{courses.emailCapture.subtitle}</p>

            {!submitted ? (
              <form
                onSubmit={handleNotify}
                className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
              >
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-graphite-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-lg border border-graphite-200 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 outline-none transition-all text-graphite-800"
                  />
                </div>
                <button type="submit" className="btn-primary whitespace-nowrap">
                  {courses.emailCapture.buttonText}
                </button>
              </form>
            ) : (
              <div className="bg-jade-50 border border-jade-200 rounded-xl p-6">
                <p className="text-jade-700 font-semibold">
                  ✓ {courses.emailCapture.successMessage}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Free Content CTA */}
      <section className="section-padding">
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
    </div>
  );
}
