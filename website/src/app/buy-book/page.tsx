'use client';
import { useState } from 'react';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BookOpen, ShieldCheck, Loader2, Clock, Truck, Zap, CheckCircle2, X, List } from 'lucide-react';
import CountdownBanner from '@/components/CountdownBanner';

const tableOfContents = {
  en: [
    { chapter: 1, title: "Prehistoric & Proto-historic Period", pages: "1-20" },
    { chapter: 2, title: "Katyuri, Parmar & Chand Dynasties", pages: "21-40" },
    { chapter: 3, title: "Medieval Period", pages: "41-60" },
    { chapter: 4, title: "Mughal Era", pages: "61-80" },
    { chapter: 5, title: "British Rule", pages: "81-100" },
    { chapter: 6, title: "Independence & Formation", pages: "101-120" },
    { chapter: 7, title: "Geography & Climate", pages: "121-140" },
    { chapter: 8, title: "Demographics & Population", pages: "141-160" },
    { chapter: 9, title: "Economy & Development", pages: "161-170" },
    { chapter: 10, title: "Agriculture & Industries", pages: "171-180" },
    { chapter: 11, title: "Political System", pages: "180-200" },
    { chapter: 12, title: "Constitutional Framework", pages: "201-220" },
    { chapter: 13, title: "Judiciary & Legal System", pages: "221-240" },
    { chapter: 14, title: "Administration & Governance", pages: "241-260" },
    { chapter: 15, title: "Local Bodies & Panchayat", pages: "261-280" },
    { chapter: 16, title: "Urban Planning & Development", pages: "281-300" },
    { chapter: 17, title: "Natural Resources", pages: "301-310" },
    { chapter: 18, title: "Wildlife & Conservation", pages: "311-320" },
    { chapter: 19, title: "Culture & Heritage", pages: "321-330" },
    { chapter: 20, title: "Arts & Literature", pages: "331-340" },
    { chapter: 21, title: "Religion & Philosophy", pages: "341-350" },
    { chapter: 22, title: "Tourism & Economy", pages: "351-360" },
    { chapter: 23, title: "Current Affairs 2024", pages: "361-370" },
    { chapter: 24, title: "Current Affairs 2025", pages: "371-380" },
    { chapter: 25, title: "Current Affairs 2026", pages: "381-390" },
    { chapter: 26, title: "Budget & Schemes", pages: "391-400" },
    { chapter: 27, title: "Education & HRD", pages: "401-410" },
    { chapter: 28, title: "Infrastructure & Development", pages: "411-420" },
  ],
  hi: [
    { chapter: 1, title: "प्रागैतिहासिक काल", pages: "1-20" },
    { chapter: 2, title: "कत्यूरी, परमार एवं चंद राजवंश", pages: "21-40" },
    { chapter: 3, title: "मध्यकालीन काल", pages: "41-60" },
    { chapter: 4, title: "मुगल काल", pages: "61-80" },
    { chapter: 5, title: "ब्रिटिश शासन", pages: "81-100" },
    { chapter: 6, title: "आजादी एवं गठन", pages: "101-120" },
    { chapter: 7, title: "भूगोल एवं जलवायु", pages: "121-140" },
    { chapter: 8, title: "जनसांख्यिकी", pages: "141-160" },
    { chapter: 9, title: "अर्थव्यवस्था", pages: "161-170" },
    { chapter: 10, title: "कृषि एवं उद्योग", pages: "171-180" },
    { chapter: 11, title: "राजनीतिक व्यवस्था", pages: "180-200" },
    { chapter: 12, title: "संवैधानिक ढाँचा", pages: "201-220" },
    { chapter: 13, title: "न्यायपालिका", pages: "221-240" },
    { chapter: 14, title: "प्रशासन एवं शासन", pages: "241-260" },
    { chapter: 15, title: "स्थानीय निकाय", pages: "261-280" },
    { chapter: 16, title: "शहरी नियोजन", pages: "281-300" },
    { chapter: 17, title: "प्राकृतिक संसाधन", pages: "301-310" },
    { chapter: 18, title: "वन्यजीव एवं संरक्षण", pages: "311-320" },
    { chapter: 19, title: "संस्कृति एवं विरासत", pages: "321-330" },
    { chapter: 20, title: "कला एवं साहित्य", pages: "331-340" },
    { chapter: 21, title: "धर्म एवं दर्शन", pages: "341-350" },
    { chapter: 22, title: "पर्यटन एवं अर्थव्यवस्था", pages: "351-360" },
    { chapter: 23, title: "समसामयिकी 2024", pages: "361-370" },
    { chapter: 24, title: "समसामयिकी 2025", pages: "371-380" },
    { chapter: 25, title: "समसामयिकी 2026", pages: "381-390" },
    { chapter: 26, title: "बजट एवं योजनाएँ", pages: "391-400" },
    { chapter: 27, title: "शिक्षा एवं मानव संसाधन", pages: "401-410" },
    { chapter: 28, title: "अवसंरचना एवं विकास", pages: "411-420" },
  ]
};

const fullChapterContent = {
  en: {
    1: { title: "CHAPTER 1: Prehistoric & Proto-historic Period", content: "Content here..." },
    2: { title: "CHAPTER 2: Katyuri Dynasties", content: "Content here..." },
    11: { title: "CHAPTER 11: Political System", content: "Content here..." },
    27: { title: "CHAPTER 27: Education and HRD", content: "Content here..." },
  },
  hi: {
    1: { title: "अध्याय 1: प्रागैतिहासिक काल", content: "सामग्री यहाँ..." },
    2: { title: "अध्याय 2: कत्यूरी राजवंश", content: "सामग्री यहाँ..." },
    11: { title: "अध्याय 11: राजनीतिक व्यवस्था", content: "सामग्री यहाँ..." },
    27: { title: "अध्याय 27: शिक्षा एवं विकास", content: "सामग्री यहाँ..." },
  }
};

function BuyBookContent() {
  const searchParams = useSearchParams();
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi'>(() => searchParams?.get('lang') === 'hi' ? 'hi' : 'en');
  const [showTOC, setShowTOC] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<{number: number, title: string} | null>(null);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', city: '', state: '', pincode: '', bookLanguage: 'English',
  });
  const [loading, setLoading] = useState(false);

  const bookData = {
    en: {
      originalPrice: 599, currentPrice: 499, pages: '350+', chapters: '28', appendixCount: '2',
      sampleChapters: [
        { number: 1, title: 'Prehistoric & Proto-historic Period', pages: 'Pages 1-20' },
        { number: 2, title: 'Katyuri, Parmar & Chand Dynasties', pages: 'Pages 21-40' },
        { number: 11, title: 'Political System of Uttarakhand', pages: 'Pages 180-200' },
        { number: 27, title: 'Education and HRD', pages: 'Pages 320-340' },
      ],
      features: ['Papers 5 & 6', 'Current Affairs', 'Comparative Tables', 'Prelims+Mains', 'All Exams', 'Updated Reports'],
      buttonText: 'Proceed to Payment',
      tocTitle: 'Table of Contents',
      viewTOC: 'View All 28 Chapters',
    },
    hi: {
      originalPrice: 599, currentPrice: 499, pages: '350+', chapters: '28', appendixCount: '2',
      sampleChapters: [
        { number: 1, title: 'प्रागैतिहासिक काल', pages: 'पृष्ठ 1-20' },
        { number: 2, title: 'कत्यूरी राजवंश', pages: 'पृष्ठ 21-40' },
        { number: 11, title: 'राजनीतिक व्यवस्था', pages: 'पृष्ठ 180-200' },
        { number: 27, title: 'शिक्षा एवं विकास', pages: 'पृष्ठ 320-340' },
      ],
      features: ['Papers 5 & 6', 'समसामयिकी', 'तुलनात्मक तालिकाएँ', 'Prelims+Mains', 'सभी परीक्षाएँ', 'अपडेट'],
      buttonText: 'भुगतान के लिए आगे बढ़ें',
      tocTitle: 'विषय सूची',
      viewTOC: 'सभी 28 अध्याय देखें',
    }
  };

  const book = bookData[selectedLanguage];
  const toc = tableOfContents[selectedLanguage];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newOrderId = `UK${Date.now()}`;
      const response = await fetch('/api/submit-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, orderId: newOrderId, amount: book.currentPrice }),
      });
      const result = await response.json();
      if (result.success) {
        window.location.href = `/order-confirmation?orderId=${newOrderId}&language=${form.bookLanguage}&name=${encodeURIComponent(form.name)}&email=${encodeURIComponent(form.email)}&phone=${encodeURIComponent(form.phone)}`;
      }
    } catch (error) {
      alert('Error submitting order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-graphite-900 via-graphite-800 to-graphite-900 text-white">
      <CountdownBanner deadline="2026-09-12" headline="Limited Offer" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Offer Banner */}
        <div className="mb-8 bg-gradient-to-r from-saffron-600 to-saffron-500 rounded-2xl p-6 sm:p-8 border-2 border-saffron-400">
          <div className="grid sm:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-2">🎯 Early Bird Offer</h2>
              <p className="text-saffron-100 mb-4">Limited time offer for first edition (500 books)</p>
              <div className="flex items-center gap-4">
                <span className="text-xl line-through">₹{book.originalPrice}</span>
                <span className="text-4xl font-bold">₹{book.currentPrice}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2"><Truck className="w-5 h-5" /><span>✅ Free Delivery</span></div>
              <div className="flex items-center gap-2"><Clock className="w-5 h-5" /><span>✅ 4 Days</span></div>
              <div className="flex items-center gap-2"><Zap className="w-5 h-5" /><span>✅ Updated</span></div>
            </div>
          </div>
        </div>

        {/* Language Toggle */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-graphite-700/50 rounded-full p-1">
            <button onClick={() => setSelectedLanguage('en')} className={`px-6 py-2 rounded-full font-semibold ${selectedLanguage === 'en' ? 'bg-saffron-500' : 'text-graphite-300'}`}>📕 English</button>
            <button onClick={() => setSelectedLanguage('hi')} className={`px-6 py-2 rounded-full font-semibold ${selectedLanguage === 'hi' ? 'bg-indigo-500' : 'text-graphite-300'}`}>📗 हिंदी</button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-graphite-800/50 rounded-2xl p-8 border border-graphite-700/50">
              <h2 className="text-2xl font-bold mb-4">Book Overview</h2>
              <div className="grid sm:grid-cols-3 gap-4 text-center mb-6">
                <div className="bg-saffron-500/10 rounded-lg p-4"><p className="text-2xl font-bold text-saffron-400">{book.pages}</p><p className="text-sm">Pages</p></div>
                <div className="bg-jade-500/10 rounded-lg p-4"><p className="text-2xl font-bold text-jade-400">{book.chapters}</p><p className="text-sm">Chapters</p></div>
                <div className="bg-blue-500/10 rounded-lg p-4"><p className="text-2xl font-bold text-blue-400">{book.appendixCount}</p><p className="text-sm">Appendices</p></div>
              </div>
            </div>

            {/* TABLE OF CONTENTS */}
            <div className="bg-graphite-800/50 rounded-2xl p-8 border border-graphite-700/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2"><List className="w-5 h-5" />{book.tocTitle}</h3>
                <button onClick={() => setShowTOC(!showTOC)} className="bg-saffron-500 hover:bg-saffron-600 px-4 py-2 rounded-lg text-sm font-bold">
                  {showTOC ? 'Hide' : book.viewTOC}
                </button>
              </div>
              
              {showTOC && (
                <div className="grid sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {toc.map((ch, i) => (
                    <div key={i} className="bg-graphite-700/30 rounded-lg p-3 text-sm">
                      <p className="font-bold text-saffron-400">Ch {ch.chapter}</p>
                      <p className="text-graphite-200">{ch.title}</p>
                      <p className="text-graphite-500 text-xs">{ch.pages}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-graphite-800/50 rounded-2xl p-8 border border-graphite-700/50">
              <h3 className="text-xl font-bold mb-4">What's Included</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {book.features.map((f, i) => <div key={i} className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-jade-400" /><p className="text-sm">{f}</p></div>)}
              </div>
            </div>

            <div className="bg-graphite-800/50 rounded-2xl p-8 border border-graphite-700/50">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5" />Read Sample</h3>
              <div className="space-y-3">
                {book.sampleChapters.map((ch, i) => (
                  <button key={i} onClick={() => setSelectedChapter(ch)} className="w-full text-left bg-graphite-700/30 rounded-lg p-4 hover:bg-graphite-700/50">
                    <h4 className="font-bold">Ch {ch.number}: {ch.title}</h4><span className="text-graphite-500 text-sm">{ch.pages}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT - FORM */}
          <div className="lg:col-span-1">
            <div className="bg-graphite-800/50 rounded-2xl p-8 border border-graphite-700/50 sticky top-24 h-fit">
              <div className="mb-6 text-center">
                <p className="text-4xl font-bold text-saffron-400">₹{book.currentPrice}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <select name="bookLanguage" value={form.bookLanguage} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white text-sm">
                  <option value="English">📕 English</option>
                  <option value="हिंदी">📗 हिंदी</option>
                </select>
                <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white text-sm" />
                <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white text-sm" />
                <input type="tel" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white text-sm" />
                <textarea name="address" placeholder="Address" value={form.address} onChange={handleChange} required rows={2} className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white text-sm" />
                <input type="text" name="city" placeholder="City" value={form.city} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white text-sm" />
                <input type="text" name="pincode" placeholder="PIN" value={form.pincode} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white text-sm" />
                <select name="state" value={form.state} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white text-sm">
                  <option value="">State</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Uttar Pradesh">UP</option>
                  <option value="Other">Other</option>
                </select>
                <button type="submit" disabled={loading} className="w-full py-3 rounded-lg font-bold bg-saffron-500 hover:bg-saffron-600 disabled:opacity-50 flex items-center justify-center gap-2 mt-4">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : book.buttonText}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BuyBookPage() {
  return (<Suspense fallback={<div className="text-center py-20">Loading...</div>}><BuyBookContent /></Suspense>);
}
