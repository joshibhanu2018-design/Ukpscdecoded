'use client';
import { useState } from 'react';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BookOpen, ShieldCheck, Loader2, Clock, Truck, Zap, CheckCircle2, X } from 'lucide-react';
import CountdownBanner from '@/components/CountdownBanner';

const chapterContent = {
  en: {
    1: `# CHAPTER 1: Prehistoric & Proto-historic Period
The prehistoric period of Uttarakhand is reconstructed through stone tools and rock shelters. The Alaknanda Valley shows hand axes, choppers, and scrapers confirming early human habitation. The Kalsi and Ramganga valleys provide additional evidence of widespread settlement.
## Rock Art & Cave Shelters  
Lakhu Udiyar paintings are significant with color layering (white=newest, brown=middle, black=oldest). The Gwarkhya Cave contains 41 figures (33 humans, 8 animals). Rare blue paintings found at Hudli.`,
    2: `# CHAPTER 2: Katyuri, Parmar & Chand Dynasties
Katyuri Dynasty (700-1200 AD) represents first major kingdom. Established by Basdeo with capital at Kartikeyapuri.
## Key Kings
**Basantdev**: Founder with Bhukti-Viṣaya-Pallika system.
**Lalitasuri Dev**: Most powerful, performed Ashvamedha Yajna, built Jageshwar Temple.
**Bhuddev Dev**: Administrative reforms and cultural patronage.
## Legacy
Sophisticated administration influenced later kingdoms. Patrons of Shaivism and Sanskrit literature.`,
    11: `# CHAPTER 11: Political System of Uttarakhand
## Governor
Constitutional head appointed by President for 5 years.
**Powers**: Legislative (assent bills, nominate members), Executive (appoint CM, judges), Discretionary (reserve powers).
## Chief Minister & Council
CM heads government as majority leader. Council of Ministers assists.
## Legislature
70-seat Vidhan Sabha: 60 general, 2 Anglo-Indian, 8 SC reserved.
**Functions**: Legislation, budget, oversight, representation.`,
    27: `# CHAPTER 27: Education and HRD
## Education System
Primary (I-V), Upper Primary (VI-VIII), Secondary (IX-X), Senior Secondary (XI-XII), Higher Education.
## Major Institutions
- Kumaun University (Nainital)
- Garhwal University (Srinagar)
- IIT Roorkee, NIT Srinagar
## NEP 2020
**Features**: Multidisciplinary approach, critical thinking, vocational training, local languages, flexible assessment.
**Implementation**: Curriculum revision, teacher training, infrastructure, digital learning.`,
  },
  hi: {
    1: `# अध्याय 1: प्रागैतिहासिक काल
उत्तराखंड का प्रागैतिहासिक काल पत्थर के उपकरणों और गुफाओं से पुनर्निर्मित है। अलकनंदा घाटी में हाथ की कुल्हाड़ियाँ, चॉपर्स, खुरचनी मिली हैं जो प्रारंभिक मानव निवास का साक्ष्य देती हैं।
## शैल कला और गुफाएँ
लाखु उड्यार की चित्रकारी महत्वपूर्ण है (सफेद=नई, भूरा=बीच, काली=पुरानी)। ग्वारख्या गुफा में 41 आकृतियाँ (33 मानव, 8 जानवर)।`,
    2: `# अध्याय 2: कत्यूरी राजवंश
कत्यूरी राजवंश (700-1200 ईस्वी) पहला प्रमुख राज्य। बसदेव द्वारा स्थापित।
## राजा
**बसंतदेव**: संस्थापक, भुक्ति-विषय-पल्लिका प्रणाली।
**ललितसूरि देव**: सबसे शक्तिशाली, अश्वमेध यज्ञ, जागेश्वर मंदिर।
**भूदेव**: प्रशासनिक सुधार, सांस्कृतिक संरक्षण।
## विरासत
परिष्कृत प्रशासन ने बाद के राज्यों को प्रभावित किया।`,
    11: `# अध्याय 11: राजनीतिक व्यवस्था
## राज्यपाल
संवैधानिक प्रमुख, राष्ट्रपति द्वारा नियुक्त।
**शक्तियाँ**: विधायी (विधेयक), कार्यकारी (CM, न्यायाधीश), आरक्षित।
## विधानमंडल
70 सीट: 60 सामान्य, 2 एंग्लो-इंडियन, 8 SC।
**कार्य**: विधान, बजट, निरीक्षण।`,
    27: `# अध्याय 27: शिक्षा एवं मानव संसाधन
## शिक्षा प्रणाली
प्राथमिक (I-V), उच्च प्राथमिक (VI-VIII), माध्यमिक (IX-X), उच्च माध्यमिक (XI-XII), उच्च शिक्षा।
## संस्थाएँ
- कुमाऊँ विश्वविद्यालय (नैनीताल)
- गढ़वाल विश्वविद्यालय (श्रीनगर)
- IIT रुड़की, NIT श्रीनगर
## NEP 2020
**विशेषताएँ**: बहु-विषय, आलोचनात्मक सोच, कौशल, स्थानीय भाषा, लचीला मूल्यांकन।`,
  }
};

function BuyBookContent() {
  const searchParams = useSearchParams();
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi'>(() => searchParams?.get('lang') === 'hi' ? 'hi' : 'en');
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
    },
    hi: {
      originalPrice: 599, currentPrice: 499, pages: '350+', chapters: '28', appendixCount: '2',
      sampleChapters: [
        { number: 1, title: 'प्रागैतिहासिक काल', pages: 'पृष्ठ 1-20' },
        { number: 2, title: 'कत्यूरी राजवंश', pages: 'पृष्ठ 21-40' },
        { number: 11, title: 'राजनीतिक व्यवस्था', pages: 'पृष्ठ 180-200' },
        { number: 27, title: 'शिक्षा एवं मानव संसाधन', pages: 'पृष्ठ 320-340' },
      ],
      features: ['Papers 5 & 6', 'समसामयिकी', 'तुलनात्मक तालिकाएँ', 'Prelims+Mains', 'सभी परीक्षाएँ', 'अपडेट'],
      buttonText: 'भुगतान के लिए आगे बढ़ें',
    }
  };

  const book = bookData[selectedLanguage];
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
                <span className="bg-white text-saffron-600 px-3 py-1 rounded-full font-bold text-sm">Save ₹100</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg"><Truck className="w-5 h-5" /><span>✅ Free Delivery</span></div>
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg"><Clock className="w-5 h-5" /><span>✅ 4 Day Delivery</span></div>
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg"><Zap className="w-5 h-5" /><span>✅ Updated</span></div>
            </div>
          </div>
        </div>

        {/* Language Toggle */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-graphite-700/50 rounded-full p-1">
            <button onClick={() => setSelectedLanguage('en')} className={`px-6 py-2 rounded-full font-semibold ${selectedLanguage === 'en' ? 'bg-saffron-500 text-white' : 'text-graphite-300'}`}>📕 English</button>
            <button onClick={() => setSelectedLanguage('hi')} className={`px-6 py-2 rounded-full font-semibold ${selectedLanguage === 'hi' ? 'bg-indigo-500 text-white' : 'text-graphite-300'}`}>📗 हिंदी</button>
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

            <div className="bg-graphite-800/50 rounded-2xl p-8 border border-graphite-700/50">
              <h3 className="text-xl font-bold mb-4">What's Included</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {book.features.map((f, i) => <div key={i} className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-jade-400 flex-shrink-0" /><p className="text-sm">{f}</p></div>)}
              </div>
            </div>

            <div className="bg-graphite-800/50 rounded-2xl p-8 border border-graphite-700/50">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5" />Read Samples</h3>
              <div className="space-y-3">
                {book.sampleChapters.map((ch, i) => <button key={i} onClick={() => setSelectedChapter(ch)} className="w-full text-left bg-graphite-700/30 rounded-lg p-4 hover:bg-graphite-700/50">
                  <div className="flex justify-between items-start"><h4 className="font-bold">Ch {ch.number}: {ch.title}</h4><span className="text-graphite-500 text-sm">{ch.pages}</span></div>
                </button>)}
              </div>
            </div>
          </div>

          {/* RIGHT - FORM */}
          <div className="lg:col-span-1">
            <div className="bg-graphite-800/50 rounded-2xl p-8 border border-graphite-700/50 sticky top-24 h-fit">
              <h2 className="text-2xl font-bold mb-4">Order Now</h2>
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
                  <option value="Himachal Pradesh">HP</option>
                  <option value="Other">Other</option>
                </select>
                <button type="submit" disabled={loading} className="w-full py-3 rounded-lg font-bold bg-saffron-500 hover:bg-saffron-600 disabled:opacity-50 flex items-center justify-center gap-2 mt-4">
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Processing</> : book.buttonText}
                </button>
                <div className="flex items-center justify-center gap-2 pt-3 text-graphite-400 text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Secure Payment</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedChapter && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-graphite-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-graphite-700">
            <div className="sticky top-0 bg-graphite-800 border-b p-4 flex justify-between items-center">
              <h3 className="text-lg font-bold">Ch {selectedChapter.number}: {selectedChapter.title}</h3>
              <button onClick={() => setSelectedChapter(null)} className="text-graphite-400"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-6 text-graphite-200 whitespace-pre-wrap">
              {chapterContent[selectedLanguage][selectedChapter.number as keyof typeof chapterContent.en]}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BuyBookPage() {
  return (<Suspense fallback={<div className="text-center py-20">Loading...</div>}><BuyBookContent /></Suspense>);
}
