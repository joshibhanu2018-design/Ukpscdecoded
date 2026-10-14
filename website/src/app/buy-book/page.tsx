'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, CheckCircle2, FileText, Lock, Tablet, Truck } from 'lucide-react';

type Tab = 'en' | 'hi' | 'ebooks';

const BOOKS = {
  en: {
    cover: '/IMG_5855.jpeg',
    edition: 'English Edition · 2026',
    title: 'Uttarakhand Decoded',
    description:
      'The complete Uttarakhand GK book for UKPSC Upper & Lower PCS, RO/ARO and UKSSSC: history, culture, polity, geography and economy of Uttarakhand in one exam-ready volume.',
    features: [
      'Complete GS Paper V + Paper VI coverage',
      '28 chapters with exam-ready tables',
      'Economic Survey and Budget 2026-27',
      'Current Affairs capsule (up to June 2026)',
    ],
    cta: 'Read Samples & Order',
    shipping: 'Free shipping across India',
  },
  hi: {
    cover: '/IMG_5854.jpeg',
    edition: 'हिंदी संस्करण · 2026',
    title: 'उत्तराखंड डिकोडेड',
    description:
      'UKPSC अपर व लोअर PCS, RO/ARO और UKSSSC के लिए उत्तराखंड सामान्य ज्ञान की संपूर्ण पुस्तक: इतिहास, संस्कृति, राजव्यवस्था, भूगोल और अर्थव्यवस्था, एक ही पुस्तक में।',
    features: [
      'GS पेपर V + पेपर VI का संपूर्ण कवरेज',
      'परीक्षा-उपयोगी तालिकाओं के साथ 28 अध्याय',
      'आर्थिक सर्वेक्षण और बजट 2026-27',
      'करेंट अफेयर्स कैप्सूल (जून 2026 तक)',
    ],
    cta: 'नमूना पढ़ें और ऑर्डर करें',
    shipping: 'पूरे भारत में मुफ़्त डिलीवरी',
  },
} as const;

const TABS = [
  { id: 'en' as const, label: 'English Book', sub: '₹499', icon: BookOpen },
  { id: 'hi' as const, label: 'हिंदी पुस्तक', sub: '₹499', icon: BookOpen },
  { id: 'ebooks' as const, label: 'E-Books', sub: 'PDF', icon: Tablet },
];

/**
 * Books store: three tabs (English book, Hindi book, e-books). Each book
 * leads to /buy-book/order?lang=…, where the samples, address form and
 * payment are.
 */
export default function BuyBookPage() {
  const [tab, setTab] = useState<Tab>('en');

  useEffect(() => {
    // Footer and other links open a tab directly: ?lang=hi, ?tab=ebooks
    const params = new URLSearchParams(window.location.search);
    if (params.get('tab') === 'ebooks') setTab('ebooks');
    else if (params.get('lang') === 'hi') setTab('hi');
  }, []);

  const book = tab === 'ebooks' ? null : BOOKS[tab];

  return (
    <div className="min-h-screen bg-graphite-950 px-4 pb-16 pt-6 sm:pt-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <Link
          href="/buy-book/order?lang=en"
          className="block overflow-hidden rounded-2xl border border-saffron-400/30 shadow-2xl shadow-black/40"
          aria-label="Read samples and order Uttarakhand Decoded"
        >
          <picture>
            <source media="(max-width: 639px)" srcSet="/banners/book-mobile.webp" />
            {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized WebP in public/banners */}
            <img
              src="/banners/book-desktop.webp"
              alt="Uttarakhand Decoded: the only Uttarakhand GK book you need, in English and Hindi"
              width={1920}
              height={600}
              fetchPriority="high"
              className="block aspect-square w-full object-cover sm:aspect-[16/5]"
            />
          </picture>
        </Link>

        <div role="tablist" aria-label="Books" className="grid grid-cols-3 gap-1.5 rounded-2xl border border-graphite-800 bg-graphite-900 p-1.5">
          {TABS.map((t) => {
            const active = tab === t.id;
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.id)}
                className={`flex min-h-[56px] flex-col items-center justify-center rounded-xl px-2 py-2.5 text-center transition-colors sm:flex-row sm:gap-2 ${
                  active ? 'bg-saffron-400 text-graphite-900 shadow-lg' : 'text-graphite-200 hover:bg-graphite-800'
                }`}
              >
                <Icon className="hidden h-5 w-5 flex-shrink-0 sm:block" />
                <span>
                  <span className="block text-sm font-bold sm:text-base">{t.label}</span>
                  <span className={`block text-[11px] sm:text-xs ${active ? 'text-graphite-800' : 'text-graphite-400'}`}>{t.sub}</span>
                </span>
              </button>
            );
          })}
        </div>

        {book ? (
          <section className="grid gap-6 rounded-2xl border border-graphite-800 bg-graphite-900 p-5 sm:p-8 md:grid-cols-[minmax(0,320px)_1fr] md:items-center md:gap-10">
            <Link href={`/buy-book/order?lang=${tab}`} className="relative mx-auto block aspect-[4/5] w-full max-w-[300px] overflow-hidden rounded-xl bg-graphite-950 shadow-2xl shadow-black/50">
              <Image src={book.cover} alt={`${book.title} cover`} fill className="object-contain" sizes="320px" priority />
            </Link>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-saffron-400">{book.edition}</p>
              <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">{book.title}</h1>
              <p className="mt-3 leading-relaxed text-graphite-300">{book.description}</p>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {book.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-graphite-200">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-saffron-400" /> {f}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="text-4xl font-bold text-white">₹499</span>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-success-400">
                  <Truck className="h-4 w-4" /> {book.shipping}
                </span>
              </div>
              <Link
                href={`/buy-book/order?lang=${tab}`}
                className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-saffron-400 px-8 py-3.5 text-lg font-bold text-graphite-900 shadow-lg shadow-saffron-500/20 transition-colors hover:bg-saffron-300 sm:w-auto"
              >
                <FileText className="h-5 w-5" /> {book.cta} <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </section>
        ) : (
          <section className="grid gap-6 rounded-2xl border border-graphite-800 bg-graphite-900 p-5 sm:p-8 md:grid-cols-[minmax(0,260px)_1fr] md:items-center md:gap-10">
            <Link href="/buy-ebooks" className="relative mx-auto block aspect-[3/4] w-48 overflow-hidden rounded-xl shadow-2xl shadow-black/50 md:w-full">
              <Image src="/IMG_5845.webp" alt="Polity Decoded e-book cover" fill className="object-cover" sizes="260px" />
            </Link>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-saffron-400">E-Book · PDF</p>
              <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">Polity Decoded</h1>
              <p className="mt-3 leading-relaxed text-graphite-300">
                Ultimate visual e-book for Indian Polity: short yet comprehensive, made for quick revision before Prelims.
              </p>
              <ul className="mt-5 space-y-2">
                {['Instant PDF access', 'Read on phone, tablet or laptop', 'Visual tables and timelines'].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-graphite-200">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-saffron-400" /> {f}
                  </li>
                ))}
              </ul>
              <div className="web-only mt-6 flex items-baseline gap-3">
                <span className="text-4xl font-bold text-white">₹59</span>
                <span className="text-lg text-graphite-400 line-through">₹129</span>
              </div>
              <Link
                href="/buy-ebooks"
                className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-saffron-400 px-8 py-3.5 text-lg font-bold text-graphite-900 shadow-lg shadow-saffron-500/20 transition-colors hover:bg-saffron-300 sm:w-auto"
              >
                <span className="web-only">View Samples & Buy</span>
                <span className="app-only">View E-Book</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </section>
        )}

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { icon: Truck, title: 'Free delivery across India', sub: 'Printed books shipped to your door' },
            { icon: Lock, title: 'Secure payment', sub: 'Razorpay: UPI, cards, net banking' },
            { icon: BookOpen, title: 'English & Hindi editions', sub: 'Same content, your language' },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3 rounded-xl border border-graphite-800 bg-graphite-900/60 p-4">
              <Icon className="h-6 w-6 flex-shrink-0 text-saffron-400" />
              <div>
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="text-xs text-graphite-300">{sub}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
