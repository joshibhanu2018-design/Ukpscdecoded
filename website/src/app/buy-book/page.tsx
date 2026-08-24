'use client';

import { useState } from 'react';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  BookOpen,
  ShieldCheck,
  Loader2,
  Clock,
  Truck,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import CountdownBanner from '@/components/CountdownBanner';

function BuyBookContent() {
  const searchParams = useSearchParams();
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi'>(() => {
    const lang = searchParams?.get('lang');
    return lang === 'hi' ? 'hi' : 'en';
  });

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    language: selectedLanguage === 'hi' ? 'हिंदी' : 'English',
  });

  const [loading, setLoading] = useState(false);

  const bookData = {
    en: {
      title: 'Uttarakhand Decoded',
      subtitle: 'Complete Exam Preparation for All UKPSC Exams',
      pages: '350+',
      chapters: '28',
      appendixCount: '2',
      originalPrice: 599,
      currentPrice: 499,
      description: 'The only comprehensive book you need for complete Uttarakhand syllabus with General Studies Paper 5 and Paper 6 coverage for UKPSC Upper and Lower Exams, RO, ARO, and UKSSSC. This book covers both Prelims and Mains examinations with integrated current affairs, comparative tables, latest reports, budget analysis, and complete civil service coverage for all exams. The most updated book in the market, relevant for your examination by eliminating redundant content and bringing the best compilation in 350+ pages.',
      sampleChapters: [
        {
          number: 1,
          title: 'Prehistoric & Proto-historic Period, Ancient Tribes, and Early Political Powers',
          topics: 'Stone Age, Rock Art, Prehistoric Evidence, Proto-historic Transition',
          pages: 'Pages 1-20'
        },
        {
          number: 2,
          title: 'Katyuri, Parmar & Chand Dynasties',
          topics: 'Katyuri Dynasty, Administrative System, Military Organization, Chand Dynasty',
          pages: 'Pages 21-40'
        },
        {
          number: 11,
          title: 'Political System of Uttarakhand',
          topics: 'Governor, Chief Minister, Legislature, Political Parties, Elections',
          pages: 'Pages 180-200'
        },
        {
          number: 27,
          title: 'Education and HRD — Strategic Recommendations',
          topics: 'Education System, NEP 2020, Way Forward Table, Institutional Framework',
          pages: 'Pages 320-340'
        },
      ],
      appendixList: [
        {
          number: 'A',
          title: 'Current Affairs Capsule (2024-2026)',
          topics: 'Recent Events, Policy Changes, Government Initiatives, Latest Updates',
        },
      ],
      features: [
        'Comprehensive Papers 5 & 6 coverage',
        'Integrated current affairs',
        'Comparative tables & latest data',
        'Prelims + Mains preparation',
        'All exam types (UKPSC, RO, ARO, UKSSSC)',
        'Updated budget & reports',
        'Non-redundant, focused content',
      ],
      buttonText: 'Proceed to Payment',
      formTitle: 'Place Your Order',
      editionLabel: 'Choose Book Edition',
      nameLabel: 'Full Name',
      emailLabel: 'Email',
      phoneLabel: 'Phone Number',
      addressLabel: 'Address',
      cityLabel: 'City',
      pincodeLabel: 'PIN Code',
      stateLabel: 'Select State',
      secureText: 'Secure Payment',
      deliveryText: 'Delivery in 4 days',
      readSample: 'Read Free Sample Chapters',
      whatIncluded: 'What\'s Included',
      bookOverview: 'Book Overview',
      appendicesTitle: 'Appendices',
    },
    hi: {
      title: 'उत्तराखंड डिकोडेड',
      subtitle: 'सभी UKPSC परीक्षाओं के लिए संपूर्ण तैयारी',
      pages: '350+',
      chapters: '28',
      appendixCount: '2',
      originalPrice: 599,
      currentPrice: 499,
      description: 'यह एकमात्र व्यापक किताब है जो उत्तराखंड के पूरे पाठ्यक्रम के लिए आवश्यक है। UKPSC Upper और Lower Exams, RO, ARO और UKSSSC के लिए General Studies Paper 5 और Paper 6 का संपूर्ण कवरेज। यह किताब Prelims और Mains दोनों परीक्षाओं को कवर करती है जिसमें Integrated Current Affairs, तुलनात्मक तालिकाएँ, नवीनतम रिपोर्ट, बजट विश्लेषण और सभी परीक्षाओं के लिए संपूर्ण Civil Service कवरेज है। बाजार में सबसे अपडेट की गई किताब जो सभी अनावश्यक सामग्री को हटाकर 350+ पृष्ठों में सर्वश्रेष्ठ सामग्री प्रदान करती है।',
      sampleChapters: [
        {
          number: 1,
          title: 'प्रागैतिहासिक एवं आद्य-ऐतिहासिक काल, प्राचीन जनजातियाँ',
          topics: 'पाषाण युग, शैल कला, प्रागैतिहासिक साक्ष्य, प्रारंभिक राजनीतिक शक्तियाँ',
          pages: 'पृष्ठ 1-20'
        },
        {
          number: 2,
          title: 'कत्यूरी, परमार एवं चंद राजवंश',
          topics: 'कत्यूरी राजवंश, प्रशासनिक व्यवस्था, सैन्य संगठन, चंद राजवंश',
          pages: 'पृष्ठ 21-40'
        },
        {
          number: 11,
          title: 'उत्तराखंड की राजनीतिक व्यवस्था',
          topics: 'राज्यपाल, मुख्यमंत्री, विधानमंडल, राजनीतिक दल, चुनाव',
          pages: 'पृष्ठ 180-200'
        },
        {
          number: 27,
          title: 'शिक्षा एवं मानव संसाधन विकास — आगे का रास्ता',
          topics: 'शिक्षा प्रणाली, NEP 2020, रणनीतिक सिफारिशें, संस्थागत ढांचा',
          pages: 'पृष्ठ 320-340'
        },
      ],
      appendixList: [
        {
          number: 'A',
          title: 'समसामयिकी कैप्सूल (2024-2026)',
          topics: 'हाल की घटनाएँ, नीति परिवर्तन, सरकारी पहल, नवीनतम अपडेट',
        },
      ],
      features: [
        'Papers 5 & 6 का व्यापक कवरेज',
        'Integrated समसामयिकी',
        'तुलनात्मक तालिकाएँ और नवीनतम डेटा',
        'Prelims + Mains तैयारी',
        'सभी परीक्षा प्रकार (UKPSC, RO, ARO, UKSSSC)',
        'अपडेट किया गया बजट और रिपोर्ट',
        'गैर-अनावश्यक, केंद्रित सामग्री',
      ],
      buttonText: 'भुगतान के लिए आगे बढ़ें',
      formTitle: 'आपकी प्रति के लिए आदेश दें',
      editionLabel: 'किताब का संस्करण चुनें',
      nameLabel: 'पूरा नाम',
      emailLabel: 'ईमेल',
      phoneLabel: 'फोन नंबर',
      addressLabel: 'पता',
      cityLabel: 'शहर',
      pincodeLabel: 'पिन कोड',
      stateLabel: 'राज्य चुनें',
      secureText: 'सुरक्षित भुगतान',
      deliveryText: '4 दिन में डिलीवरी',
      readSample: 'मुफ्त नमूना अध्याय पढ़ें',
      whatIncluded: 'क्या शामिल है',
      bookOverview: 'किताब का अवलोकन',
      appendicesTitle: 'परिशिष्ट',
    }
  };

  const book = bookData[selectedLanguage];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLanguageChange = (lang: 'English' | 'हिंदी') => {
    setForm(prev => ({ ...prev, language: lang }));
    setSelectedLanguage(lang === 'हिंदी' ? 'hi' : 'en');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newOrderId = `UK${Date.now()}`;
      const orderData = {
        ...form,
        orderId: newOrderId,
        amount: book.currentPrice,
      };

      const response = await fetch('/api/submit-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      if (result.success) {
        window.location.href = `/order-confirmation?orderId=${newOrderId}&language=${form.language}`;
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-graphite-900 via-graphite-800 to-graphite-900 text-white">
      <CountdownBanner deadline="2026-08-31" headline="Limited Offer" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Early Bird Offer Banner */}
        <div className="mb-8 bg-gradient-to-r from-saffron-600 to-saffron-500 rounded-2xl p-6 sm:p-8 border-2 border-saffron-400">
          <div className="grid sm:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">🎯 Early Bird Offer</h2>
              <p className="text-saffron-100 mb-4">Limited time offer for first 100 buyers</p>
              <div className="flex items-center gap-4">
                <span className="text-xl line-through text-saffron-200">₹{book.originalPrice}</span>
                <span className="text-4xl font-bold text-white">₹{book.currentPrice}</span>
                <span className="bg-white text-saffron-600 px-3 py-1 rounded-full font-bold text-sm">Save ₹{book.originalPrice - book.currentPrice}</span>
              </div>
            </div>
            <div className="space-y-3 text-sm sm:text-base">
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg">
                <Truck className="w-5 h-5 flex-shrink-0" />
                <span>✅ Free Delivery</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg">
                <Clock className="w-5 h-5 flex-shrink-0" />
                <span>✅ Delivery in 4 Days</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg">
                <Zap className="w-5 h-5 flex-shrink-0" />
                <span>✅ Most Updated Content</span>
              </div>
            </div>
          </div>
        </div>

        {/* Language Toggle */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-graphite-700/50 rounded-full p-1">
            <button
              onClick={() => { setSelectedLanguage('en'); setForm(prev => ({ ...prev, language: 'English' })); }}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                selectedLanguage === 'en'
                  ? 'bg-saffron-500 text-white shadow-lg'
                  : 'text-graphite-300 hover:text-white'
              }`}
            >
              📕 English
            </button>
            <button
              onClick={() => { setSelectedLanguage('hi'); setForm(prev => ({ ...prev, language: 'हिंदी' })); }}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                selectedLanguage === 'hi'
                  ? 'bg-indigo-500 text-white shadow-lg'
                  : 'text-graphite-300 hover:text-white'
              }`}
            >
              📗 हिंदी
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT SECTION: Book Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Book Introduction */}
            <div className="bg-graphite-800/50 rounded-2xl p-6 sm:p-8 border border-graphite-700/50 backdrop-blur">
              <h2 className="text-2xl font-bold mb-4">{book.bookOverview}</h2>
              <p className="text-graphite-200 leading-relaxed mb-6">{book.description}</p>
              
              <div className="grid sm:grid-cols-3 gap-4 text-center">
                <div className="bg-saffron-500/10 rounded-lg p-4">
                  <p className="text-2xl sm:text-3xl font-bold text-saffron-400">{book.pages}</p>
                  <p className="text-sm text-graphite-400">{selectedLanguage === 'en' ? 'Pages' : 'पृष्ठ'}</p>
                </div>
                <div className="bg-jade-500/10 rounded-lg p-4">
                  <p className="text-2xl sm:text-3xl font-bold text-jade-400">{book.chapters}</p>
                  <p className="text-sm text-graphite-400">{selectedLanguage === 'en' ? 'Chapters' : 'अध्याय'}</p>
                </div>
                <div className="bg-blue-500/10 rounded-lg p-4">
                  <p className="text-2xl sm:text-3xl font-bold text-blue-400">{book.appendixCount}</p>
                  <p className="text-sm text-graphite-400">{selectedLanguage === 'en' ? 'Appendices' : 'परिशिष्ट'}</p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-graphite-800/50 rounded-2xl p-6 sm:p-8 border border-graphite-700/50 backdrop-blur">
              <h3 className="text-xl font-bold mb-4">{book.whatIncluded}</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {book.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-jade-400 flex-shrink-0 mt-0.5" />
                    <p className="text-graphite-200 text-sm">{feature}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Chapters */}
            <div className="bg-graphite-800/50 rounded-2xl p-6 sm:p-8 border border-graphite-700/50 backdrop-blur">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                {book.readSample}
              </h3>
              <div className="space-y-3">
                {book.sampleChapters.map((ch, idx) => (
                  <div key={idx} className="bg-graphite-700/30 rounded-lg p-4 hover:bg-graphite-700/50 transition">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-white">{selectedLanguage === 'en' ? 'Chapter' : 'अध्याय'} {ch.number}: {ch.title}</h4>
                      <span className="text-graphite-500 text-sm whitespace-nowrap ml-2">{ch.pages}</span>
                    </div>
                    <p className="text-graphite-300 text-sm">{ch.topics}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Appendices */}
            <div className="bg-graphite-800/50 rounded-2xl p-6 sm:p-8 border border-graphite-700/50 backdrop-blur">
              <h3 className="text-xl font-bold mb-4">{book.appendicesTitle}</h3>
              <div className="space-y-3">
                {book.appendixList.map((app, idx) => (
                  <div key={idx} className="bg-graphite-700/30 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-1">{selectedLanguage === 'en' ? 'Appendix' : 'परिशिष्ट'} {app.number}: {app.title}</h4>
                    <p className="text-graphite-300 text-sm">{app.topics}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SECTION: Order Form */}
          <div className="lg:col-span-1">
            <div className="bg-graphite-800/50 rounded-2xl p-6 sm:p-8 border border-graphite-700/50 backdrop-blur sticky top-24 h-fit">
              <h2 className="text-2xl font-bold mb-4">{book.formTitle}</h2>

              <div className="mb-6 text-center">
                <p className="text-4xl font-bold text-saffron-400">₹{book.currentPrice}</p>
                <p className="text-graphite-400 text-sm">{selectedLanguage === 'en' ? 'One-time payment' : 'एकमुश्त भुगतान'}</p>
                <p className="text-jade-400 text-xs mt-2">✅ {book.deliveryText}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Language Selection */}
                <div>
                  <label className="block text-sm font-semibold mb-2">{book.editionLabel}</label>
                  <div className="space-y-2">
                    <label className="flex items-center p-3 rounded-lg border border-graphite-600 cursor-pointer hover:bg-graphite-700/30">
                      <input
                        type="radio"
                        value="English"
                        checked={form.language === 'English'}
                        onChange={() => handleLanguageChange('English')}
                        className="w-4 h-4"
                      />
                      <span className="ml-3 text-sm">📕 English Edition</span>
                    </label>
                    <label className="flex items-center p-3 rounded-lg border border-graphite-600 cursor-pointer hover:bg-graphite-700/30">
                      <input
                        type="radio"
                        value="हिंदी"
                        checked={form.language === 'हिंदी'}
                        onChange={() => handleLanguageChange('हिंदी')}
                        className="w-4 h-4"
                      />
                      <span className="ml-3 text-sm">📗 हिंदी संस्करण</span>
                    </label>
                  </div>
                </div>

                {/* Form Fields */}
                <input
                  type="text"
                  name="name"
                  placeholder={book.nameLabel}
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white placeholder-graphite-500 text-sm focus:outline-none focus:border-saffron-500"
                />
                <input
                  type="email"
                  name="email"
                  placeholder={book.emailLabel}
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white placeholder-graphite-500 text-sm focus:outline-none focus:border-saffron-500"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder={book.phoneLabel}
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white placeholder-graphite-500 text-sm focus:outline-none focus:border-saffron-500"
                />
                <textarea
                  name="address"
                  placeholder={book.addressLabel}
                  value={form.address}
                  onChange={handleChange}
                  required
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white placeholder-graphite-500 text-sm focus:outline-none focus:border-saffron-500"
                />
                <input
                  type="text"
                  name="city"
                  placeholder={book.cityLabel}
                  value={form.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white placeholder-graphite-500 text-sm focus:outline-none focus:border-saffron-500"
                />
                <input
                  type="text"
                  name="pincode"
                  placeholder={book.pincodeLabel}
                  value={form.pincode}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white placeholder-graphite-500 text-sm focus:outline-none focus:border-saffron-500"
                />
                <select
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white text-sm focus:outline-none focus:border-saffron-500"
                >
                  <option value="">{book.stateLabel}</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                  <option value="Other">Other</option>
                </select>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg font-bold text-lg transition-all bg-saffron-500 hover:bg-saffron-600 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {selectedLanguage === 'hi' ? 'प्रसंस्करण...' : 'Processing...'}
                    </>
                  ) : (
                    book.buttonText
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 pt-3 text-graphite-400 text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{book.secureText}</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BuyBookPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-white">Loading...</div>}>
      <BuyBookContent />
    </Suspense>
  );
}
