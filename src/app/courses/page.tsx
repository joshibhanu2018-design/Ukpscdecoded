'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  PlayCircle,
  BookOpen,
  ClipboardCheck,
  MessageCircle,
  Target,
  Brain,
  Users,
  Calendar,
  Bell,
  Mail,
  ArrowRight,
  Sparkles,
  Video,
  FileText,
  BarChart3,
} from 'lucide-react';

interface CourseCard {
  title: string;
  duration: string;
  price: number;
  originalPrice: number;
  description: string;
  features: { icon: React.ReactNode; text: string }[];
  color: string;
  badge: string;
}

const courses: CourseCard[] = [
  {
    title: 'UKPSC Foundation Batch',
    duration: '6 months',
    price: 4999,
    originalPrice: 8999,
    description:
      'Comprehensive preparation covering both Paper V (Uttarakhand GK) and Paper VI (General Studies). Designed for serious aspirants targeting PCS, Lower PCS, and RO/ARO exams with structured learning.',
    features: [
      { icon: <PlayCircle className="w-4 h-4" />, text: '200+ video lectures' },
      { icon: <BookOpen className="w-4 h-4" />, text: 'Printed study material' },
      { icon: <ClipboardCheck className="w-4 h-4" />, text: 'Weekly tests' },
      { icon: <MessageCircle className="w-4 h-4" />, text: 'Doubt clearing sessions' },
    ],
    color: 'saffron',
    badge: 'Launching Soon',
  },
  {
    title: 'Uttarakhand GK Intensive',
    duration: '3 months',
    price: 2499,
    originalPrice: 4999,
    description:
      'Deep-dive into Uttarakhand-specific topics — history, geography, culture, polity, and current affairs. Perfect for aspirants who need focused Paper V preparation with PYQ-based approach.',
    features: [
      { icon: <Video className="w-4 h-4" />, text: '100+ topic-wise videos' },
      { icon: <Target className="w-4 h-4" />, text: 'Uttarakhand-specific focus' },
      { icon: <Brain className="w-4 h-4" />, text: 'Daily MCQs' },
      { icon: <BarChart3 className="w-4 h-4" />, text: 'PYQ analysis included' },
    ],
    color: 'jade',
    badge: 'Launching Soon',
  },
  {
    title: 'Test Series + Mentorship',
    duration: '4 months',
    price: 1999,
    originalPrice: 3999,
    description:
      'Practice under real exam conditions with full-length mock tests, detailed performance analytics, and 1-on-1 mentorship. Ideal for aspirants in their revision phase.',
    features: [
      { icon: <FileText className="w-4 h-4" />, text: '30 full-length tests' },
      { icon: <ClipboardCheck className="w-4 h-4" />, text: 'Detailed solutions' },
      { icon: <Users className="w-4 h-4" />, text: 'Personal mentorship' },
      { icon: <Calendar className="w-4 h-4" />, text: 'Strategy sessions' },
    ],
    color: 'graphite',
    badge: 'Launching Soon',
  },
];

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
          <h1 className="heading-xl text-white mb-6">
            Structured Courses — Learn With a Plan
          </h1>
          <p className="text-lg text-graphite-400 max-w-2xl mx-auto">
            Expert-designed courses to take you from zero to selection. Each course is built around UKPSC patterns and Uttarakhand-specific content.
          </p>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course.title} className="card relative flex flex-col">
                {/* Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="inline-flex items-center gap-1 bg-saffron-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                    <Sparkles className="w-3 h-3" />
                    {course.badge}
                  </span>
                </div>

                {/* Card Header */}
                <div className={`p-6 pb-4 ${
                  course.color === 'saffron' ? 'bg-gradient-to-br from-saffron-50 to-ivory-50' :
                  course.color === 'jade' ? 'bg-gradient-to-br from-jade-50 to-ivory-50' :
                  'bg-gradient-to-br from-graphite-50 to-ivory-50'
                }`}>
                  <div className="flex items-center gap-2 text-xs font-semibold text-graphite-500 uppercase tracking-wider mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    {course.duration}
                  </div>
                  <h3 className="heading-md text-graphite-900 mb-2">{course.title}</h3>
                  <p className="text-graphite-600 text-sm leading-relaxed">{course.description}</p>
                </div>

                {/* Features */}
                <div className="p-6 pt-4 flex-1">
                  <ul className="space-y-3">
                    {course.features.map((feature) => (
                      <li key={feature.text} className="flex items-center gap-3 text-sm text-graphite-700">
                        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-jade-50 text-jade-600">
                          {feature.icon}
                        </span>
                        {feature.text}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price & CTA */}
                <div className="p-6 pt-0 mt-auto">
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-3xl font-display font-bold text-graphite-900">₹{course.price.toLocaleString()}</span>
                    <span className="text-lg text-graphite-400 line-through">₹{course.originalPrice.toLocaleString()}</span>
                  </div>
                  <button
                    disabled
                    className="w-full flex items-center justify-center gap-2 bg-graphite-200 text-graphite-500 font-semibold px-6 py-3 rounded-lg cursor-not-allowed"
                  >
                    <Bell className="w-4 h-4" />
                    Notify Me
                  </button>
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
            <h2 className="heading-lg text-graphite-900 mb-4">Get Notified When Courses Launch</h2>
            <p className="text-graphite-600 mb-8">
              Be the first to know. Early subscribers get exclusive launch discounts.
            </p>

            {!submitted ? (
              <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
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
                  Notify Me
                </button>
              </form>
            ) : (
              <div className="bg-jade-50 border border-jade-200 rounded-xl p-6">
                <p className="text-jade-700 font-semibold">
                  ✓ You&apos;re on the list! We&apos;ll email you when courses launch.
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
            <h2 className="heading-lg text-white mb-4">Meanwhile, Start With Our FREE Content</h2>
            <p className="text-graphite-300 mb-8 max-w-xl mx-auto">
              Access free video lectures, daily MCQs, and study resources while you wait for the full courses.
            </p>
            <Link
              href="/free-content"
              className="btn-primary inline-flex items-center gap-2"
            >
              Explore Free Content
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
