'use client';

import { useState } from 'react';
import {
  Users,
  Video,
  Send,
  BookOpen,
  Award,
  Heart,
  Mail,
  Camera,
  ExternalLink,
  CheckCircle2,
  Loader2,
  Rocket,
  Milestone,
} from 'lucide-react';

const stats = [
  { icon: <Video className="w-6 h-6" />, value: '2000+', label: 'YouTube Subscribers' },
  { icon: <Send className="w-6 h-6" />, value: '1000+', label: 'Telegram Members' },
  { icon: <BookOpen className="w-6 h-6" />, value: '28', label: 'Chapters Written' },
  { icon: <Award className="w-6 h-6" />, value: '6', label: 'Exams Covered' },
];

const timeline = [
  {
    year: '2022',
    title: 'YouTube Channel Started',
    description: 'Began uploading Uttarakhand GK videos to help aspirants prepare for free.',
    icon: <Video className="w-5 h-5" />,
  },
  {
    year: '2023',
    title: 'Telegram Community Launched',
    description: 'Created a dedicated space for daily MCQs, current affairs, and peer discussion.',
    icon: <Send className="w-5 h-5" />,
  },
  {
    year: '2024',
    title: 'Book Manuscript Completed',
    description: '28 chapters covering the entire UKPSC syllabus — history, geography, polity, culture, and more.',
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    year: '2025',
    title: 'Website + Courses Launching',
    description: 'Full-stack digital platform with PYQ tracker, courses, test series, and mentorship programs.',
    icon: <Rocket className="w-5 h-5" />,
  },
];

export default function AboutPage() {
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Just UI for now — no backend integration
    setSubmitted(true);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-graphite-900 via-graphite-800 to-graphite-950 text-white section-padding">
        <div className="container-custom text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Heart className="w-10 h-10 text-saffron-400" />
          </div>
          <h1 className="heading-xl text-white mb-6">
            About UKPSC Decoded
          </h1>
          <p className="text-lg text-graphite-400 max-w-2xl mx-auto">
            Built by aspirants, for aspirants. We believe quality exam preparation should be accessible to everyone.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-lg text-graphite-900 mb-6">Our Mission</h2>
            <blockquote className="text-xl md:text-2xl text-graphite-700 font-display font-medium leading-relaxed italic border-l-4 border-saffron-500 pl-6 text-left">
              &ldquo;Making quality Uttarakhand exam preparation accessible to every aspirant, regardless of geography or budget.&rdquo;
            </blockquote>
            <p className="mt-8 text-graphite-600 leading-relaxed text-lg">
              Uttarakhand aspirants often struggle to find quality, structured preparation material — especially for the state-specific portions. Coaching centers are concentrated in Dehradun and Haldwani, leaving thousands of aspirants in remote areas without access. UKPSC Decoded bridges that gap through digital content, a comprehensive guidebook, and an engaged community.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-gradient-to-br from-saffron-50 via-ivory-50 to-jade-50">
        <div className="container-custom">
          <h2 className="heading-lg text-graphite-900 text-center mb-12">Our Impact So Far</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="card p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-saffron-100 text-saffron-600 mx-auto mb-4">
                  {stat.icon}
                </div>
                <p className="text-3xl font-display font-bold text-graphite-900">{stat.value}</p>
                <p className="text-sm text-graphite-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="heading-lg text-graphite-900 text-center mb-12">Our Journey</h2>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-graphite-200" />

              <div className="space-y-10">
                {timeline.map((item, index) => (
                  <div key={item.title} className="relative flex gap-6">
                    {/* Icon Circle */}
                    <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full flex-shrink-0 ${
                      index === timeline.length - 1
                        ? 'bg-saffron-500 text-white'
                        : 'bg-white border-2 border-jade-500 text-jade-600'
                    }`}>
                      {item.icon}
                    </div>

                    {/* Content */}
                    <div className="pb-2">
                      <span className="text-xs font-bold text-saffron-600 uppercase tracking-wider">{item.year}</span>
                      <h3 className="font-display font-semibold text-graphite-900 text-lg mt-1">{item.title}</h3>
                      <p className="text-graphite-600 text-sm mt-1 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-graphite-50">
        <div className="container-custom">
          <h2 className="heading-lg text-graphite-900 text-center mb-12">Get In Touch</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Links */}
            <div>
              <h3 className="heading-md text-graphite-900 mb-6">Connect With Us</h3>
              <div className="space-y-4">
                <a
                  href="mailto:ukpscdecoded@gmail.com"
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border border-graphite-100 hover:border-saffron-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-saffron-100 text-saffron-600 group-hover:bg-saffron-500 group-hover:text-white transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-graphite-800">Email</p>
                    <p className="text-sm text-graphite-500">ukpscdecoded@gmail.com</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-graphite-400 ml-auto" />
                </a>

                <a
                  href="https://youtube.com/@ukpscdecoded"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border border-graphite-100 hover:border-red-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600 group-hover:bg-red-500 group-hover:text-white transition-colors">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-graphite-800">YouTube</p>
                    <p className="text-sm text-graphite-500">@ukpscdecoded</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-graphite-400 ml-auto" />
                </a>

                <a
                  href="https://t.me/ukpscdecoded"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border border-graphite-100 hover:border-blue-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <Send className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-graphite-800">Telegram</p>
                    <p className="text-sm text-graphite-500">@ukpscdecoded</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-graphite-400 ml-auto" />
                </a>

                <a
                  href="https://instagram.com/ukpscdecoded"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border border-graphite-100 hover:border-pink-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-100 text-pink-600 group-hover:bg-pink-500 group-hover:text-white transition-colors">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-graphite-800">Instagram</p>
                    <p className="text-sm text-graphite-500">@ukpscdecoded</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-graphite-400 ml-auto" />
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h3 className="heading-md text-graphite-900 mb-6">Send a Message</h3>
              {!submitted ? (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-medium text-graphite-700 mb-1">
                      Name
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={handleContactChange}
                      placeholder="Your name"
                      className="w-full px-4 py-2.5 rounded-lg border border-graphite-200 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 outline-none transition-all text-graphite-800"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-medium text-graphite-700 mb-1">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={handleContactChange}
                      placeholder="your@email.com"
                      className="w-full px-4 py-2.5 rounded-lg border border-graphite-200 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 outline-none transition-all text-graphite-800"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-medium text-graphite-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      rows={5}
                      value={contactForm.message}
                      onChange={handleContactChange}
                      placeholder="Write your message here..."
                      className="w-full px-4 py-2.5 rounded-lg border border-graphite-200 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 outline-none transition-all text-graphite-800 resize-none"
                    />
                  </div>

                  <button type="submit" className="btn-primary flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Send Message
                  </button>
                </form>
              ) : (
                <div className="bg-jade-50 border border-jade-200 rounded-xl p-8 text-center">
                  <CheckCircle2 className="w-12 h-12 text-jade-500 mx-auto mb-4" />
                  <h4 className="font-display font-semibold text-jade-800 text-lg mb-2">Message Sent!</h4>
                  <p className="text-jade-600 text-sm">
                    Thank you for reaching out. We&apos;ll get back to you within 24-48 hours.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
