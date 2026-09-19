'use client';

import { useState, useEffect } from 'react';
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

const RAZORPAY_KEY = 'rzp_live_TXb0nhqyo9LhkM'; // Live Production Key

export default function BuyBookPage() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi'>('en');
  const [selectedChapter, setSelectedChapter] = useState<string>('index');
  const [razorpayReady, setRazorpayReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [modalPdfUrl, setModalPdfUrl] = useState<string | null>(null);
  const [modalPdfTitle, setModalPdfTitle] = useState<string>('');
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

  // Pre-load Razorpay script on component mount
  useEffect(() => {
    preloadRazorpayScript();
  }, []);

  const preloadRazorpayScript = () => {
    if ((window as any).Razorpay) {
      setRazorpayReady(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log('✅ Razorpay script loaded successfully');
      setRazorpayReady(true);
    };

    script.onerror = () => {
      console.error('❌ Failed to load Razorpay script');
      // Retry after 2 seconds
      setTimeout(() => {
        console.log('🔄 Retrying Razorpay script load...');
        preloadRazorpayScript();
      }, 2000);
    };

    document.head.appendChild(script);
  };

  const chapterContent: LanguageChapters = {
    en: {
      'index': {
        label: '📑 Table of Contents',
        title: 'UTTARAKHAND Decoded - Complete Index (28 Chapters)',
        isIndex: true,
        htmlContent: `<div class="space-y-4">
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
              <li>Economic Development Indicators</li>
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
        </div>`,
      },
      '1': {
        label: 'Chapter 1',
        title: 'Epigraphy - Inscriptions & Their Significance',
        pdfUrl: '/book-samples/English/Chapter 1',
      },
      '2': {
        label: 'Chapter 2',
        title: 'The Katyuri Dynasty & Parmar Dynasty',
        pdfUrl: '/book-samples/English/Chapter 2.pdf',
      },
      '4': {
        label: 'Chapter 4',
        title: 'British Rule in Uttarakhand (1815-1947)',
        pdfUrl: '/book-samples/English/Chapter 4.pdf',
      },
      '8': {
        label: 'Chapter 8',
        title: 'Cultural Heritage & Sacred Sites',
        pdfUrl: '/book-samples/English/Chapter 8.pdf',
      },
      '12': {
        label: 'Chapter 12',
        title: 'Electoral System & Democratic Institutions',
        pdfUrl: '/book-samples/English/Chapter 12.pdf',
      },
      'misc': {
        label: '📋 Miscellaneous',
        title: 'Miscellaneous Topics & Additional Resources',
        pdfUrl: '/book-samples/English/Miscellaneous.pdf',
      },
    },
    hi: {
      'index': {
        label: '📑 विषय-सूची',
        title: 'संपूर्ण विषय-सूची',
        isIndex: true,
        pdfUrl: '/book-samples/hindi/Hindi book index.pdf',
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
      '9': {
        label: 'अध्याय 9',
        title: 'धार्मिक महत्व',
        pdfUrl: '/book-samples/hindi/Chapter 9.pdf',
      },
      '11': {
        label: 'अध्याय 11',
        title: 'राजनीतिक दल',
        pdfUrl: '/book-samples/hindi/Chapter 11.pdf',
      },
      '19': {
        label: 'अध्याय 19',
        title: 'खनिज संसाधन',
        pdfUrl: '/book-samples/hindi/Chapter 19.pdf',
      },
      '25': {
        label: 'अध्याय 25',
        title: 'आर्थिक विकास',
        pdfUrl: '/book-samples/hindi/Chapter 25.pdf',
      },
      '27': {
        label: 'अध्याय 27',
        title: 'शिक्षा सुधार',
        pdfUrl: '/book-samples/hindi/27 chapter education.pdf',
      },
    },
  };

  const englishChapters = ['index', '1', '2', '4', '8', '12', 'misc'];
  const hindiChapters = ['index', '2', '3', '4', '9', '11', '19', '25', '27'];
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

  const openPdfModal = (pdfUrl: string, title: string) => {
    setModalPdfUrl(pdfUrl);
    setModalPdfTitle(title);
    setShowPdfModal(true);
  };

  const closePdfModal = () => {
    setShowPdfModal(false);
    setTimeout(() => {
      setModalPdfUrl(null);
      setModalPdfTitle('');
    }, 300);
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
      console.log(`✅ Order submitted - Status: ${status}`);
    } catch (error) {
      console.error('Google Sheet error (non-critical):', error);
    }
  };

  const openRazorpayCheckout = async (retryCount = 0) => {
    try {
      // Check if Razorpay is loaded
      if (!((window as any).Razorpay)) {
        // Wait and retry up to 3 times
        if (retryCount < 3) {
          console.log(`Razorpay not ready, retrying... (${retryCount + 1}/3)`);
          setError(selectedLanguage === 'en' ? 'Loading payment gateway...' : 'भुगतान गेटवे लोड हो रहा है...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          return openRazorpayCheckout(retryCount + 1);
        } else {
          throw new Error('Razorpay failed to load after 3 attempts');
        }
      }

      const timestamp = Date.now();
      const orderId = `UKPSC_BOOK_${timestamp}`;

      const Razorpay = (window as any).Razorpay;

      const options = {
        key: RAZORPAY_KEY, // Use constant instead of env var
        amount: 49900, // ₹499 in paise
        currency: 'INR',
        name: 'UKPSC Decoded',
        description: selectedLanguage === 'en' ? 'UKPSC Book - English Edition' : 'UKPSC पुस्तक - हिंदी संस्करण',
        image: 'https://ukpscdecoded.vercel.app/logo.png',
        prefill: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          contact: formData.phone.replace(/\D/g, ''),
        },
        notes: {
          orderId: orderId,
          language: selectedLanguage,
        },
        handler: (response: any) => {
          console.log('✅ Payment successful:', response.razorpay_payment_id);
          handlePaymentSuccess(response, orderId);
        },
        modal: {
          ondismiss: () => {
            console.log('❌ Payment cancelled by user');
            handlePaymentCancel(orderId);
          },
          escape: false, // Prevent ESC key dismiss
          backdropclose: false, // Prevent backdrop click dismiss
        },
        theme: {
          color: '#FF9933',
        },
      };

      const razorpay = new Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error('Razorpay error:', err);
      setSubmitting(false);
      setError(err instanceof Error ? err.message : (selectedLanguage === 'en' ? 'Payment gateway error. Please refresh and try again.' : 'भुगतान गेटवे त्रुटि। कृपया रीफ्रेश करें और पुनः प्रयास करें।'));
    }
  };

  const handlePaymentSuccess = async (response: any, orderId: string) => {
    try {
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
    } catch (err) {
      console.error('Post-payment error:', err);
      // Still redirect even if sheet submission fails
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
    }
  };

  const handlePaymentCancel = async (orderId: string) => {
    await submitOrderToSheet('PENDING_PAYMENT', orderId, 'CANCELLED');
    setSubmitting(false);
    setError(selectedLanguage === 'en' 
      ? '⏳ Payment cancelled. Your details have been saved. You can retry anytime.' 
      : '⏳ भुगतान रद्द किया गया। आपके विवरण सहेजे गए हैं। आप कभी भी पुनः प्रयास कर सकते हैं।');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate all fields
    if (!formData.name || !formData.email || !formData.phone || !formData.city || !formData.pincode || !formData.state || !formData.address) {
      setError(selectedLanguage === 'en' ? '❌ Please fill all required fields!' : '❌ कृपया सभी आवश्यक फ़ील्ड भरें!');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError(selectedLanguage === 'en' ? '❌ Please enter a valid email!' : '❌ कृपया सही ईमेल दर्ज करें!');
      return;
    }

    // Validate phone (minimum 10 digits)
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      setError(selectedLanguage === 'en' ? '❌ Please enter a valid 10-digit phone number!' : '❌ कृपया 10-अंकीय फोन नंबर दर्ज करें!');
      return;
    }

    setSubmitting(true);
    setError(selectedLanguage === 'en' ? 'Opening payment gateway...' : 'भुगतान गेटवे खोल रहे हैं...');

    // Wait a moment then open checkout
    setTimeout(() => {
      openRazorpayCheckout();
    }, 500);
  };

  const selectedChapterData = selectedChapter ? currentContent[selectedChapter] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      {/* PDF Modal */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-slate-700 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-700 to-slate-900 p-4 flex justify-between items-center border-b border-slate-700">
              <h3 className="text-xl font-bold text-white truncate">{modalPdfTitle}</h3>
              <button
                onClick={closePdfModal}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={28} />
              </button>
            </div>

            {/* Modal Body - Full PDF */}
            <div className="flex-1 overflow-hidden">
              {modalPdfUrl && (
                <iframe
                  src={`${modalPdfUrl}#toolbar=1&navpanes=0`}
                  className="w-full h-full"
                  title="PDF Viewer"
                />
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-700 p-4 border-t border-slate-600 flex justify-end">
              <button
                onClick={closePdfModal}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-semibold transition-colors"
              >
                {selectedLanguage === 'en' ? 'Close' : 'बंद करें'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Book className="text-orange-500" size={40} />
            UTTARAKHAND Decoded
          </h1>
          <p className="text-xl text-slate-300">उत्तराखंड का संपूर्ण अध्ययन पुस्तक</p>

          <div className="flex justify-center gap-6 mt-8 mb-8">
            <button onClick={() => handleLanguageChange('en')} className={`px-10 py-4 rounded-xl font-bold text-lg transition-all ${selectedLanguage === 'en' ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-2xl' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}>
              🇬🇧 ENGLISH
            </button>
            <button onClick={() => handleLanguageChange('hi')} className={`px-10 py-4 rounded-xl font-bold text-lg transition-all ${selectedLanguage === 'hi' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-2xl' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}>
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

          <button onClick={() => setSelectedChapter('index')} className="inline-block px-8 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 rounded-lg font-bold hover:shadow-lg">
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
                  </div>
                  <button onClick={() => setSelectedChapter('')} className="text-slate-400 hover:text-white">
                    <X size={24} />
                  </button>
                </div>
                <div className="p-8 h-full">
                  {selectedChapterData.htmlContent ? (
                    <div dangerouslySetInnerHTML={{ __html: selectedChapterData.htmlContent }} />
                  ) : selectedChapterData.pdfUrl ? (
                    <div className="space-y-4">
                      {/* Preview Thumbnail */}
                      <div
                        onClick={() => openPdfModal(selectedChapterData.pdfUrl!, selectedChapterData.title)}
                        className="cursor-pointer group relative rounded-lg overflow-hidden bg-slate-900 border-2 border-dashed border-slate-600 hover:border-orange-500 transition-all"
                      >
                        <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                          <div className="text-center">
                            <Eye className="mx-auto mb-3 text-slate-500 group-hover:text-orange-500 transition-colors" size={40} />
                            <p className="text-slate-400 group-hover:text-orange-400 font-semibold">{selectedLanguage === 'en' ? 'Click to open full PDF' : 'पूरी पीडीएफ खोलने के लिए क्लिक करें'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <button
                        onClick={() => openPdfModal(selectedChapterData.pdfUrl!, selectedChapterData.title)}
                        className="w-full px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                      >
                        <Eye size={20} />
                        {selectedLanguage === 'en' ? 'View Full PDF' : 'पूरी पीडीएफ देखें'}
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
              <h2 className="text-3xl font-bold text-white mb-8">📦 {selectedLanguage === 'en' ? 'Place Order' : 'आदेश दें'}</h2>
              
              {/* Status Indicator */}
              {!razorpayReady && (
                <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500 text-yellow-200 rounded-lg text-sm">
                  ⚠️ {selectedLanguage === 'en' ? 'Preparing payment gateway...' : 'भुगतान गेटवे तैयार हो रहा है...'}
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500 text-red-200 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {submitting && (
                <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500 text-blue-200 rounded-lg text-sm">
                  ⏳ {selectedLanguage === 'en' ? 'Opening payment gateway...' : 'भुगतान गेटवे खोल रहे हैं...'}
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" name="name" placeholder={selectedLanguage === 'en' ? 'Full Name' : 'पूरा नाम'} value={formData.name} onChange={handleFormChange} required className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-orange-500 outline-none" />
                  <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleFormChange} required className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-orange-500 outline-none" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="tel" name="phone" placeholder={selectedLanguage === 'en' ? 'Phone (10 digits)' : 'फोन (10 अंक)'} value={formData.phone} onChange={handleFormChange} required className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-orange-500 outline-none" />
                  <input type="text" name="city" placeholder={selectedLanguage === 'en' ? 'City' : 'शहर'} value={formData.city} onChange={handleFormChange} required className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-orange-500 outline-none" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" name="pincode" placeholder={selectedLanguage === 'en' ? 'PIN' : 'पिन'} value={formData.pincode} onChange={handleFormChange} required className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-orange-500 outline-none" />
                  <input type="text" name="state" placeholder={selectedLanguage === 'en' ? 'State' : 'राज्य'} value={formData.state} onChange={handleFormChange} required className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-orange-500 outline-none" />
                </div>
                <textarea name="address" placeholder={selectedLanguage === 'en' ? 'Full Address' : 'पूरा पता'} rows={3} value={formData.address} onChange={handleFormChange} required className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-orange-500 outline-none"></textarea>
                <input type="text" name="landmark" placeholder={selectedLanguage === 'en' ? 'Landmark (Optional)' : 'निकटतम स्थान (वैकल्पिक)'} value={formData.landmark} onChange={handleFormChange} className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-orange-500 outline-none" />
                
                <button type="submit" disabled={submitting || !razorpayReady} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-lg font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all">
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