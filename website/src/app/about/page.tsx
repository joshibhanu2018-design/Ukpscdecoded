'use client';

import { useState } from 'react';
import {
  Video,
  Send,
  Heart,
  Mail,
  Camera,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { getIcon } from '@/lib/icons';
import about from '@content/about.json';

export default function AboutPage() {
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleContactChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const { mission, stats, timeline, contact } = about;

  const contactLinks = [
    {
      label: 'Email',
      value: contact.email,
      href: `mailto:${contact.email}`,
      Icon: Mail,
      iconBg: 'bg-saffron-100 text-saffron-600',
      iconHover: 'group-hover:bg-saffron-500 group-hover:text-white',
      borderHover: 'hover:border-saffron-300',
      external: false,
    },
    {
      label: 'YouTube',
      value: contact.youtubeHandle,
      href: contact.youtube,
      Icon: Video,
      iconBg: 'bg-red-100 text-red-600',
      iconHover: 'group-hover:bg-red-500 group-hover:text-white',
      borderHover: 'hover:border-red-300',
      external: true,
    },
    {
      label: 'Telegram',
      value: contact.telegramHandle,
      href: contact.telegram,
      Icon: Send,
      iconBg: 'bg-blue-100 text-blue-600',
      iconHover: 'group-hover:bg-blue-500 group-hover:text-white',
      borderHover: 'hover:border-blue-300',
      external: true,
    },
    {
      label: 'Instagram',
      value: contact.instagramHandle,
      href: contact.instagram,
      Icon: Camera,
      iconBg: 'bg-pink-100 text-pink-600',
      iconHover: 'group-hover:bg-pink-500 group-hover:text-white',
      borderHover: 'hover:border-pink-300',
      external: true,
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-graphite-900 via-graphite-800 to-graphite-950 text-white section-padding">
        <div className="container-custom text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Heart className="w-10 h-10 text-saffron-400" />
          </div>
          <h1 className="heading-xl text-white mb-6">{about.heading}</h1>
          <p className="text-lg text-graphite-400 max-w-2xl mx-auto">{about.subtitle}</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-lg text-graphite-900 mb-6">{mission.heading}</h2>
            <blockquote className="text-xl md:text-2xl text-graphite-700 font-display font-medium leading-relaxed italic border-l-4 border-saffron-500 pl-6 text-left">
              &ldquo;{mission.quote}&rdquo;
            </blockquote>
            <p className="mt-8 text-graphite-600 leading-relaxed text-lg">{mission.body}</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-gradient-to-br from-saffron-50 via-ivory-50 to-jade-50">
        <div className="container-custom">
          <h2 className="heading-lg text-graphite-900 text-center mb-12">
            {about.statsHeading}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = getIcon(stat.icon);
              return (
                <div key={stat.label} className="card p-6 text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-saffron-100 text-saffron-600 mx-auto mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="text-3xl font-display font-bold text-graphite-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-graphite-500 mt-1">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="heading-lg text-graphite-900 text-center mb-12">
            {about.timelineHeading}
          </h2>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-graphite-200" />

              <div className="space-y-10">
                {timeline.map((item, index) => {
                  const Icon = getIcon(item.icon);
                  const isLast = index === timeline.length - 1;
                  return (
                    <div key={item.title} className="relative flex gap-6">
                      {/* Icon Circle */}
                      <div
                        className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full flex-shrink-0 ${
                          isLast
                            ? 'bg-saffron-500 text-white'
                            : 'bg-white border-2 border-jade-500 text-jade-600'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Content */}
                      <div className="pb-2">
                        <span className="text-xs font-bold text-saffron-600 uppercase tracking-wider">
                          {item.year}
                        </span>
                        <h3 className="font-display font-semibold text-graphite-900 text-lg mt-1">
                          {item.title}
                        </h3>
                        <p className="text-graphite-600 text-sm mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-graphite-50">
        <div className="container-custom">
          <h2 className="heading-lg text-graphite-900 text-center mb-12">
            {contact.heading}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Links */}
            <div>
              <h3 className="heading-md text-graphite-900 mb-6">
                {contact.connectHeading}
              </h3>
              <div className="space-y-4">
                {contactLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    {...(link.external
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    className={`flex items-center gap-4 p-4 bg-white rounded-xl border border-graphite-100 ${link.borderHover} hover:shadow-md transition-all group`}
                  >
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full ${link.iconBg} ${link.iconHover} transition-colors`}
                    >
                      <link.Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-graphite-800">{link.label}</p>
                      <p className="text-sm text-graphite-500">{link.value}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-graphite-400 ml-auto" />
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h3 className="heading-md text-graphite-900 mb-6">{contact.formHeading}</h3>
              {!submitted ? (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-sm font-medium text-graphite-700 mb-1"
                    >
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
                    <label
                      htmlFor="contact-email"
                      className="block text-sm font-medium text-graphite-700 mb-1"
                    >
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
                    <label
                      htmlFor="contact-message"
                      className="block text-sm font-medium text-graphite-700 mb-1"
                    >
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
                  <h4 className="font-display font-semibold text-jade-800 text-lg mb-2">
                    {contact.successHeading}
                  </h4>
                  <p className="text-jade-600 text-sm">{contact.successMessage}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
