'use client';

import { useState } from 'react';
import { X, Eye, ChevronDown, Book } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ChapterContent {
  label: string;
  title: string;
  htmlContent?: string;
  pdfUrl?: string;
  isIndex?: boolean;
}

interface ChapterBook {
  [key: string]: ChapterContent;
}

interface LanguageChapters {
  en: ChapterBook;
  hi: ChapterBook;
}

export default function BuyBookPage() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi'>('en');
  const [selectedChapter, setSelectedChapter] = useState<string>('index');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    state: '',
    landmark: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chapterContent: LanguageChapters = {
    en: {
      'index': {
        label: '📑 Table of Contents',
        title: 'Complete Index - All 28 Chapters',
        isIndex: true,
        htmlContent: `
          <div class="space-y-6">
            <h2 class="text-2xl font-bold text-white">UTTARAKHAND Decoded - Complete Index (28 Chapters)</h2>
            <div class="space-y-4">
              <div>
                <h3 class="text-xl font-bold text-orange-400 mb-3">PART A: HISTORY & CULTURE (Chapters 1-10)</h3>
                <ol class="list-decimal list-inside space-y-2 text-slate-300">
                  <li>Epigraphy - Inscriptions & Their Significance</li>
                  <li>The Katyuri Dynasty & Parmar Dynasty of Garhwal</li>
                  <li>Anglo-Gorkha War & Liberation (1814-1815)</li>
                  <li>British Rule in Uttarakhand (1815-1947)</li>
                  <li>Indian Freedom Struggle in Uttarakhand</li>
                  <li>Post-Independence Development (1947-2000)</li>
                  <li>Formation of Uttarakhand State (2000)</li>
                  <li>Cultural Heritage & Sacred Sites</li>
                  <li>Religious Significance & Pilgrimage Routes</li>
                  <li>Local Traditions & Folk Culture</li>
                </ol>
              </div>
              <div>
                <h3 class="text-xl font-bold text-orange-400 mb-3">PART B: POLITICS & GOVERNANCE (Chapters 11-14)</h3>
                <ol class="list-decimal list-inside space-y-2 text-slate-300" start="11">
                  <li>Political Parties & Electoral History</li>
                  <li>Electoral System & Democratic Institutions</li>
                  <li>District Administration & Local Bodies</li>
                  <li>Land Reforms & Constitutional Amendments</li>
                </ol>
              </div>
              <div>
                <h3 class="text-xl font-bold text-orange-400 mb-3">PART C: GEOGRAPHY (Chapters 15-20)</h3>
                <ol class="list-decimal list-inside space-y-2 text-slate-300" start="15">
                  <li>Physical Geography & Topography</li>
                  <li>Climate & Weather Patterns</li>
                  <li>Vegetation & Biodiversity</li>
                  <li>Water Resources & Hydropower</li>
                  <li>Mineral Resources & Geology</li>
                  <li>Environmental Protection & Conservation</li>
                </ol>
              </div>
              <div>
                <h3 class="text-xl font-bold text-orange-400 mb-3">PART D: ECONOMY (Chapters 21-25)</h3>
                <ol class="list-decimal list-inside space-y-2 text-slate-300" start="21">
                  <li>Agriculture & Horticulture</li>
                  <li>Industries & MSME Development</li>
                  <li>Tourism & Hospitality Sector</li>
                  <li>Transportation & Infrastructure</li>
                  <li>Economic Development & Growth Indicators</li>
                </ol>
              </div>
              <div>
                <h3 class="text-xl font-bold text-orange-400 mb-3">PART E: DISASTER MANAGEMENT & HRD (Chapters 26-28)</h3>
                <ol class="list-decimal list-inside space-y-2 text-slate-300" start="26">
                  <li>Disaster Management & Natural Hazards</li>
                  <li>Education Reforms & Human Resources Development</li>
                  <li>Health & Wellness Infrastructure</li>
                </ol>
              </div>
            </div>
          </div>
        `,
      },
      '2': {
        label: 'Chapter 2',
        title: 'The Katyuri Dynasty & Parmar Dynasty of Garhwal',
        htmlContent: `<div class="text-slate-300">Content preview available...</div>`,
      },
      '3': {
        label: 'Chapter 3',
        title: 'Gorkha Rule & Anglo-Gorkha War (1790-1815)',
        htmlContent: `<div class="text-slate-300">Content preview available...</div>`,
      },
      '4': {
        label: 'Chapter 4',
        title: 'British Rule in Uttarakhand (1815-1947)',
        htmlContent: `<div class="text-slate-300">Content preview available...</div>`,
      },
      '27': {
        label: 'Chapter 27',
        title: 'Education Reforms & HRD - Labour & Skills',
        htmlContent: `<div class="text-slate-300">Content preview available...</div>`,
      },
    },
    hi: {
      'index': {
        label: '📑 विषय-सूची',
        title: 'संपूर्ण विषय-सूची - सभी 28 अध्याय',
        isIndex: true,
        pdfUrl: '/book-samples/hindi/Hindi%20book%20index.pdf',
      },
      '2': {
        label: 'अध्याय 2',
        title: 'कत्यूरी वंश',
        pdfUrl: '/book-samples/hindi/Chapter 2 sample.pdf',
      },
      '3': {
        label: 'अध्याय 3',
        title: 'गोरखा शासन',
        pdfUrl: '/book-samples/hindi/Chapter 3.pdf',
      },
      '4': {
        label: 'अध्याय 4',
        title: 'ब्रिटिश शासन',
        pdfUrl: '/book-samples/hindi/Chapter 4.pdf',
      },
      '27': {
        label: 'अध्याय 27',
        title: 'शिक्षा सुधार',
        pdfUrl: '/book-samples/hindi/27 chapter education .pdf',
      },
    },
  };

  const englishChapters = ['index', '2', '3', '4', '27'];
  const hindiChapters = ['index', '2', '3', '4', '27'];
  const currentChapters = selectedLanguage === 'en' ? englishChapters : hindiChapters;
  const currentContent = chapterContent[selectedLanguage];

  const handleLanguageChange = (language: 'en' | 'hi') => {
    setSelectedLanguage(language);
    setSelectedChapter('index');
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const submitOrderToSheet = async (status: 'PENDING_PAYMENT' | 'PAYMENT_RECEIVED', orderId: string, paymentId: string = 'N/A') => {
    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.replace(/\D/g, ''),
      address: formData.address.trim(),
      city: formData.city.trim(),
      pincode: formData.pincode.trim(),
      state: formData.state.trim(),
      landmark: formData.landmark.trim(),
      language: selectedLanguage === 'en' ? 'English' : 'हिंदी',
      timestamp: new Date().toISOString(),
      orderId: orderId,
      paymentId: paymentId,
      status: status,
    };

    try {
      await fetch(
        'https://script.google.com/macros/s/AKfycbyS2M34dKi6V5TmZv6Z2PKEdQHC0RoQmcGdMGNRjlCS1Rc2Tk6VeLWPvMI3iFEkz3q3-Q/exec',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          mode: 'no-cors',
        }
      );
      console.log(`✅ Order submitted to Google Sheet - Status: ${status}`);
    } catch (error) {
      console.error('Google Sheet submission error (non-critical):', error);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.email || !formData.phone || !formData.city || !formData.pincode || !formData.state || !formData.address) {
      setError(selectedLanguage === 'en' ? 'Please fill all required fields!' : 'कृपया सभी आवश्यक फ़ील्ड भरें!');
      return;
    }

    setSubmitting(true);

    try {
      // Generate order ID immediately
      const timestamp = Date.now();
      const orderId = `UKPSC_BOOK_${timestamp}`;

      // Load Razorpay script
      await loadRazorpayScript();

      const razorpay = (window as any).Razorpay;
      if (!razorpay) {
        throw new Error('Razorpay not loaded');
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TXb0nhqyo9LhkM',
        amount: 49900,
        currency: 'INR',
        name: 'UKPSC Decoded',
        description: selectedLanguage === 'en' ? 'UKPSC Book - English Edition' : 'UKPSC पुस्तक - हिंदी संस्करण',
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone.replace(/\D/g, ''),
        },
        notes: {
          orderId: orderId,
        },
        handler: async (response: any) => {
          // PAYMENT SUCCESS - Submit with PAYMENT_RECEIVED status
          await submitOrderToSheet('PAYMENT_RECEIVED', orderId, response.razorpay_payment_id);
          
          const params = new URLSearchParams({
            orderId: orderId,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            language: selectedLanguage === 'en' ? 'English' : 'हिंदी',
            paymentId: response.razorpay_payment_id,
            status: 'success',
          });

          router.push(`/order-confirmation?${params.toString()}`);
        },
        modal: {
          ondismiss: async () => {
            // PAYMENT CANCELLED - Submit with PENDING_PAYMENT status
            await submitOrderToSheet('PENDING_PAYMENT', orderId, 'CANCELLED');
            setSubmitting(false);
            setError(selectedLanguage === 'en' ? 'Payment cancelled. Your details have been saved. You can retry anytime.' : 'भुगतान रद्द किया गया। आपके विवरण सहेजे गए हैं। आप कभी भी पुनः प्रयास कर सकते हैं।');
          },
        },
        theme: { color: '#FF9933' },
      };

      const paymentObj = new razorpay(options);
      paymentObj.open();
    } catch (err) {
      console.error('Payment error:', err);
      setSubmitting(false);
      setError(err instanceof Error ? err.message : (selectedLanguage === 'en' ? 'Failed to open payment. Please try again.' : 'भुगतान खोलने में विफल। कृपया पुनः प्रयास करें।'));
    }
  };

  const loadRazorpayScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if ((window as any).Razorpay) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;

      script.onload = () => {
        if ((window as any).Razorpay) {
          resolve();
        } else {
          reject(new Error('Razorpay failed to load'));
        }
      };

      script.onerror = () => {
        reject(new Error('Failed to load Razorpay script. Check internet connection.'));
      };

      document.body.appendChild(script);
    });
  };

  const selectedChapterData = selectedChapter ? currentContent[selectedChapter] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Book className="text-orange-500" size={40} />
            UTTARAKHAND Decoded
          </h1>
          <p className="text-xl text-slate-300">उत्तराखंड का संपूर्ण अध्ययन पुस्तक</p>

          <div className="flex justify-center gap-6 mt-8 mb-8">
            <button onClick={() => handleLanguageChange('en')} className={`px-10 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${selectedLanguage === 'en' ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-2xl' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}>
              🇬🇧 ENGLISH
            </button>
            <button onClick={() => handleLanguageChange('hi')} className={`px-10 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${selectedLanguage === 'hi' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-2xl' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}>
              🇮🇳 हिंदी
            </button>
          </div>

          <div className="flex justify-center mb-12">
            <div className="w-full max-w-md">
              <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 p-4">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-slate-900">
                  <Image
                    src={selectedLanguage === 'en' ? '/IMG_5855.jpeg' : '/IMG_5854.jpeg'}
                    alt="Book Cover"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="mt-4 text-center">
                  <p className="text-slate-400 text-sm">{selectedLanguage === 'en' ? '🇬🇧 English' : '🇮🇳 हिंदी'}</p>
                  <p className="text-white font-bold mt-2">UTTARAKHAND Decoded</p>
                  <p className="text-orange-400 font-bold mt-1">₹499</p>
                </div>
              </div>
            </div>
          </div>

          <button onClick={() => setSelectedChapter('index')} className="inline-block px-8 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 rounded-lg font-bold hover:shadow-lg transition-all">
            📑 {selectedLanguage === 'en' ? 'VIEW INDEX' : 'विषय-सूची'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-2xl p-6 sticky top-4 shadow-2xl border border-slate-700 max-h-[85vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-white mb-4">{selectedLanguage === 'en' ? 'Chapters' : 'अध्याय'}</h2>
              <div className="space-y-2">
                {currentChapters.map((chapterId) => {
                  const chapter = currentContent[chapterId];
                  const isSelected = selectedChapter === chapterId;
                  return (
                    <button key={chapterId} onClick={() => setSelectedChapter(chapterId)} className={`w-full text-left p-4 rounded-lg transition-all ${isSelected ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}>
                      <div className="font-semibold text-sm">{chapter.label}</div>
                      <div className="text-xs opacity-90 line-clamp-2">{chapter.title}</div>
                    </button>
                  );
                })}
              </div>
              <div className="mt-8 p-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
                <div className="text-white">
                  <div className="text-sm opacity-90">Price</div>
                  <div className="text-3xl font-bold">₹499</div>
                  <div className="text-xs opacity-75">Free Shipping</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {selectedChapterData ? (
              <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
                <div className="bg-gradient-to-r from-slate-700 to-slate-900 p-6 flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedChapterData.title}</h2>
                    <p className="text-slate-300 text-sm mt-2">{selectedLanguage === 'en' ? '📄 Sample' : '📄 नमूना'}</p>
                  </div>
                  <button onClick={() => setSelectedChapter('')} className="text-slate-400 hover:text-white">
                    <X size={24} />
                  </button>
                </div>
                <div className="p-8 max-h-96 overflow-y-auto">
                  {selectedChapterData.htmlContent ? (
                    <div dangerouslySetInnerHTML={{ __html: selectedChapterData.htmlContent }} />
                  ) : selectedChapterData.pdfUrl ? (
                    <div className="text-center py-12">
                      <Eye size={56} className="text-slate-400 mx-auto mb-4" />
                      <button onClick={() => window.open(selectedChapterData.pdfUrl, '_blank')} className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 rounded-lg font-bold">👁️ View PDF</button>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
              <h2 className="text-3xl font-bold text-white mb-8">📦 {selectedLanguage === 'en' ? 'Place Order' : 'आदेश दें'}</h2>
              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500 text-red-200 rounded-lg">
                  ❌ {error}
                </div>
              )}
              {submitting && (
                <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500 text-blue-200 rounded-lg">
                  ⏳ {selectedLanguage === 'en' ? 'Opening payment gateway...' : 'भुगतान गेटवे खोल रहे हैं...'}
                </div>
              )}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" name="name" placeholder={selectedLanguage === 'en' ? 'Full Name' : 'पूरा नाम'} value={formData.name} onChange={handleFormChange} required className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white" />
                  <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleFormChange} required className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="tel" name="phone" placeholder={selectedLanguage === 'en' ? 'Phone' : 'फोन'} value={formData.phone} onChange={handleFormChange} required className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white" />
                  <input type="text" name="city" placeholder={selectedLanguage === 'en' ? 'City' : 'शहर'} value={formData.city} onChange={handleFormChange} required className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" name="pincode" placeholder={selectedLanguage === 'en' ? 'PIN' : 'पिन'} value={formData.pincode} onChange={handleFormChange} required className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white" />
                  <input type="text" name="state" placeholder={selectedLanguage === 'en' ? 'State' : 'राज्य'} value={formData.state} onChange={handleFormChange} required className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white" />
                </div>
                <textarea name="address" placeholder={selectedLanguage === 'en' ? 'Address' : 'पता'} rows={3} value={formData.address} onChange={handleFormChange} required className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white"></textarea>
                <input type="text" name="landmark" placeholder={selectedLanguage === 'en' ? 'Landmark' : 'निकटतम स्थान'} value={formData.landmark} onChange={handleFormChange} className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white" />
                <button type="submit" disabled={submitting} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-lg font-bold text-lg disabled:opacity-50">
                  {submitting ? '⏳ ' + (selectedLanguage === 'en' ? 'Processing...' : 'प्रोसेस हो रहा है...') : '💳 ' + (selectedLanguage === 'en' ? 'Proceed to Payment' : 'भुगतान करें')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
