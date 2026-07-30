"use client";

import Link from "next/link";
import {
  Video,
  Users,
  BookOpen,
  Award,
  PlayCircle,
  Newspaper,
  BarChart3,
  BookMarked,
  Brain,
  MessageCircle,
  ArrowRight,
  Star,
  Send,
} from "lucide-react";

const stats = [
  { icon: Video, value: "2000+", label: "YouTube Subscribers" },
  { icon: Users, value: "1000+", label: "Telegram Members" },
  { icon: BookOpen, value: "28", label: "Chapters" },
  { icon: Award, value: "6", label: "Exams Covered" },
];

const features = [
  {
    icon: PlayCircle,
    title: "Free Video Lectures",
    description:
      "Comprehensive video lectures covering every topic of Uttarakhand GK, systematically organized chapter-wise.",
  },
  {
    icon: Newspaper,
    title: "Daily Current Affairs & MCQ",
    description:
      "Stay updated with daily current affairs relevant to UKPSC exams plus practice MCQs to test your knowledge.",
  },
  {
    icon: BarChart3,
    title: "PYQ Analysis Tracker",
    description:
      "Track previous year questions with detailed analysis showing topic-wise weightage and trends across exams.",
  },
  {
    icon: BookMarked,
    title: "Complete Guidebook",
    description:
      "India's only single-volume guidebook covering all Uttarakhand state exams in 28 comprehensive chapters.",
  },
  {
    icon: Brain,
    title: "Expert Analysis",
    description:
      "In-depth analysis of exam patterns, cut-offs, and strategic preparation tips from experienced educators.",
  },
  {
    icon: MessageCircle,
    title: "Community Support",
    description:
      "Join our active Telegram community for doubt resolution, peer discussions, and daily motivation.",
  },
];

const bookChapters = [
  "Uttarakhand: Origin & History",
  "Ancient & Medieval History",
  "Modern History & Freedom Struggle",
  "Art, Culture & Traditions",
  "Geography & Natural Resources",
  "Polity & Governance",
  "Economy & Development",
  "Disaster Management & HRD",
];

const testimonials = [
  {
    name: "Priya Rawat",
    exam: "UKPSC PCS 2024",
    text: "UKPSC Decoded transformed my preparation. The chapter-wise videos and the guidebook gave me a structured approach. Cleared prelims in my first attempt!",
    rating: 5,
  },
  {
    name: "Rahul Negi",
    exam: "Lower PCS 2023",
    text: "The daily MCQs and current affairs section kept me consistent throughout my preparation. The PYQ tracker helped me focus on high-weightage topics.",
    rating: 5,
  },
  {
    name: "Ankit Bisht",
    exam: "RO/ARO 2024",
    text: "Best resource for Uttarakhand GK. The book covers everything in one volume and the Telegram community is incredibly supportive. Highly recommend!",
    rating: 5,
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-graphite-950 via-graphite-900 to-graphite-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(245,147,7,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(23,180,122,0.08),transparent_50%)]" />
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-xl text-white mb-6">
              Crack Every Uttarakhand Exam —{" "}
              <span className="text-saffron-400">From One Platform</span>
            </h1>
            <p className="text-lg md:text-xl text-graphite-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Comprehensive preparation for UKPSC PCS, Lower PCS, RO/ARO,
              UKSSSC & all state exams. Free videos, daily MCQs, PYQ analysis,
              and India&apos;s most complete Uttarakhand GK guidebook.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/free-content" className="btn-primary inline-flex items-center justify-center gap-2 text-lg">
                Explore Free Content
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/buy-book" className="btn-secondary inline-flex items-center justify-center gap-2 text-lg">
                Get the Book
                <BookMarked className="w-5 h-5" />
              </Link>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon className="w-6 h-6 text-saffron-400 mx-auto mb-2" />
                  <div className="text-2xl md:text-3xl font-display font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-graphite-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-ivory-50">
        <div className="container-custom">
          <div className="text-center mb-14">
            <h2 className="heading-lg text-graphite-900 mb-4">
              Everything You Need to{" "}
              <span className="text-jade-600">Succeed</span>
            </h2>
            <p className="text-graphite-600 text-lg max-w-2xl mx-auto">
              A complete ecosystem designed for Uttarakhand exam aspirants — from
              foundational learning to exam-day confidence.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="card p-8 bg-white border border-graphite-100 hover:border-saffron-200 group"
              >
                <div className="w-14 h-14 rounded-xl bg-saffron-50 flex items-center justify-center mb-5 group-hover:bg-saffron-100 transition-colors">
                  <feature.icon className="w-7 h-7 text-saffron-600" />
                </div>
                <h3 className="text-xl font-display font-semibold text-graphite-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-graphite-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Book Preview Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Book Details */}
            <div>
              <span className="inline-block bg-jade-50 text-jade-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
                BESTSELLING GUIDEBOOK
              </span>
              <h2 className="heading-lg text-graphite-900 mb-6">
                The Complete Uttarakhand GK —{" "}
                <span className="text-saffron-500">In One Volume</span>
              </h2>
              <p className="text-graphite-600 text-lg mb-8 leading-relaxed">
                28 meticulously researched chapters covering History, Geography,
                Polity, Economy, Culture, Disaster Management & more. Aligned
                with the latest UKPSC syllabus and enriched with PYQ
                references.
              </p>
              <div className="mb-8">
                <h4 className="font-display font-semibold text-graphite-800 mb-4">
                  Table of Contents (Highlights):
                </h4>
                <ul className="space-y-2">
                  {bookChapters.map((chapter, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-graphite-700"
                    >
                      <span className="w-6 h-6 rounded-full bg-saffron-100 text-saffron-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      {chapter}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-graphite-500 mt-3 ml-9">
                  ...and 20 more chapters
                </p>
              </div>
              <Link href="/buy-book" className="btn-primary inline-flex items-center gap-2">
                Get Your Copy
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Right - Book Cover Placeholder */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-72 h-96 md:w-80 md:h-[28rem] rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-saffron-500 via-saffron-600 to-graphite-900" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-2">
                    UKPSC Decoded
                  </h3>
                  <p className="text-white/80 text-sm mb-4">
                    Complete Uttarakhand GK
                  </p>
                  <div className="w-16 h-0.5 bg-white/30 mb-4" />
                  <p className="text-white/60 text-xs">
                    28 Chapters • 6 Exams • 1 Volume
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-graphite-50">
        <div className="container-custom">
          <div className="text-center mb-14">
            <h2 className="heading-lg text-graphite-900 mb-4">
              Trusted by <span className="text-jade-600">Aspirants</span>
            </h2>
            <p className="text-graphite-600 text-lg max-w-2xl mx-auto">
              Hear from students who transformed their preparation with UKPSC
              Decoded.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="card p-8 bg-white border border-graphite-100"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-saffron-400 fill-saffron-400"
                    />
                  ))}
                </div>
                <p className="text-graphite-700 leading-relaxed mb-6 italic">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="border-t border-graphite-100 pt-4">
                  <p className="font-display font-semibold text-graphite-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-graphite-500">
                    {testimonial.exam}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="section-padding bg-gradient-to-br from-jade-700 via-jade-600 to-jade-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_70%)]" />
        <div className="container-custom relative z-10 text-center">
          <h2 className="heading-lg text-white mb-6">
            Start Your Preparation Today
          </h2>
          <p className="text-jade-100 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Join thousands of aspirants already preparing smarter with free
            videos, daily MCQs, and expert guidance. Your journey to cracking
            Uttarakhand exams starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://t.me/ukpscdecoded"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center justify-center gap-2 text-lg"
            >
              <Send className="w-5 h-5" />
              Join Telegram
            </a>
            <a
              href="https://youtube.com/@ukpscdecoded"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-lg bg-white text-graphite-900 font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:bg-graphite-50"
            >
              <Video className="w-5 h-5 text-red-600" />
              Subscribe on YouTube
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
