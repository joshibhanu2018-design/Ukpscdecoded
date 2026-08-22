'use client';

import { useState } from 'react';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  BookOpen,
  ShieldCheck,
  Loader2,
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
      subtitle: 'Crack Every Exam — From One Platform',
      description: 'Comprehensive preparation for UKPSC PCS, Lower PCS, RO/ARO, UKSSSC & all state exams. 300+ pages of complete Uttarakhand GK guidebook.',
      price: 499,
      currency: '₹',
      pages: 326,
      chapters: 27,
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
    },
    hi: {
      title: 'उत्तराखंड डिकोडेड',
      subtitle: 'हर परीक्षा को क्रैक करें — एक प्लेटफॉर्म से',
      description: 'UKPSC PCS, निचली PCS, RO/ARO, UKSSSC और सभी राज्य परीक्षाओं के लिए व्यापक तैयारी। उत्तराखंड GK की 300+ पृष्ठ की पूर्ण मार्गदर्शिका।',
      price: 499,
      currency: '₹',
      pages: 326,
      chapters: 27,
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
        amount: book.price,
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
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

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        
        {/* Book Preview Section */}
        <div className="space-y-6">
          <div className="bg-graphite-800/50 rounded-2xl p-8 border border-graphite-700/50 backdrop-blur">
            <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
            <p className="text-xl text-graphite-400 mb-4">{book.subtitle}</p>
            
            <div className="bg-graphite-700/30 rounded-lg p-4 mb-6">
              <p className="text-graphite-200 leading-relaxed">{book.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-saffron-500/10 rounded-lg p-4">
                <p className="text-3xl font-bold text-saffron-400">{book.pages}</p>
                <p className="text-sm text-graphite-400">{selectedLanguage === 'hi' ? 'पृष्ठ' : 'Pages'}</p>
              </div>
              <div className="bg-jade-500/10 rounded-lg p-4">
                <p className="text-3xl font-bold text-jade-400">{book.chapters}</p>
                <p className="text-sm text-graphite-400">{selectedLanguage === 'hi' ? 'अध्याय' : 'Chapters'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Form Section */}
        <div className="bg-graphite-800/50 rounded-2xl p-8 border border-graphite-700/50 backdrop-blur h-fit sticky top-24">
          <h2 className="text-2xl font-bold mb-6">{book.formTitle}</h2>

          <div className="mb-6 text-center">
            <p className="text-4xl font-bold text-saffron-400">{book.currency}{book.price}</p>
            <p className="text-graphite-400">{selectedLanguage === 'hi' ? 'एकमुश्त भुगतान' : 'One-time payment'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Language Selection in Form */}
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
                  <span className="ml-3">📕 English Edition</span>
                </label>
                <label className="flex items-center p-3 rounded-lg border border-graphite-600 cursor-pointer hover:bg-graphite-700/30">
                  <input
                    type="radio"
                    value="हिंदी"
                    checked={form.language === 'हिंदी'}
                    onChange={() => handleLanguageChange('हिंदी')}
                    className="w-4 h-4"
                  />
                  <span className="ml-3">📗 हिंदी संस्करण</span>
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
              className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white placeholder-graphite-500 focus:outline-none focus:border-saffron-500"
            />
            <input
              type="email"
              name="email"
              placeholder={book.emailLabel}
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white placeholder-graphite-500 focus:outline-none focus:border-saffron-500"
            />
            <input
              type="tel"
              name="phone"
              placeholder={book.phoneLabel}
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white placeholder-graphite-500 focus:outline-none focus:border-saffron-500"
            />
            <textarea
              name="address"
              placeholder={book.addressLabel}
              value={form.address}
              onChange={handleChange}
              required
              rows={2}
              className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white placeholder-graphite-500 focus:outline-none focus:border-saffron-500"
            />
            <input
              type="text"
              name="city"
              placeholder={book.cityLabel}
              value={form.city}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white placeholder-graphite-500 focus:outline-none focus:border-saffron-500"
            />
            <input
              type="text"
              name="pincode"
              placeholder={book.pincodeLabel}
              value={form.pincode}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white placeholder-graphite-500 focus:outline-none focus:border-saffron-500"
            />
            <select
              name="state"
              value={form.state}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white focus:outline-none focus:border-saffron-500"
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
              className="w-full py-3 rounded-lg font-bold text-lg transition-all bg-saffron-500 hover:bg-saffron-600 disabled:opacity-50 flex items-center justify-center gap-2"
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

            <div className="flex items-center justify-center gap-2 pt-4 text-graphite-400 text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>{book.secureText}</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function BuyBookPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-graphite-900 via-graphite-800 to-graphite-900 text-white">
      <CountdownBanner deadline="2026-08-31" headline="Limited Offer" />
      <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
        <BuyBookContent />
      </Suspense>
    </div>
  );
}
