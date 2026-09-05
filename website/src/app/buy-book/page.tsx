'use client';

import { useState } from 'react';
import { X, Eye, ChevronDown, Book } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
            <h2 class="text-2xl font-bold text-white">UKPSC Decoded - Complete Index (28 Chapters)</h2>
            <div class="space-y-4">
              <div>
                <h3 class="font-bold text-orange-400">PART I: GEOGRAPHY</h3>
                <ul class="list-disc list-inside space-y-1">
                  <li>Physical Geography</li>
                  <li>Climate & Weather</li>
                  <li>Rivers & Water Resources</li>
                </ul>
              </div>
              <div>
                <h3 class="font-bold text-orange-400">PART II: HISTORY</h3>
                <ul class="list-disc list-inside space-y-1">
                  <li>Katyuri Dynasty</li>
                  <li>Gorkha Rule & Anglo-Gorkha War</li>
                  <li>British Rule 1815-1947</li>
                  <li>Chand Dynasty & Medieval Period</li>
                </ul>
              </div>
              <div>
                <h3 class="font-bold text-orange-400">PART III: POLITY & ADMINISTRATION</h3>
                <ul class="list-disc list-inside space-y-1">
                  <li>Land Reforms & Constitutional Amendments</li>
                </ul>
              </div>
              <div>
                <h3 class="font-bold text-orange-400">PART IV: ECONOMY & DEVELOPMENT</h3>
                <ul class="list-disc list-inside space-y-1">
                  <li>Education Reforms & Human Resources Development</li>
                </ul>
              </div>
            </div>
          </div>
        `,
      },
      '2': {
        label: 'Chapter 2',
        title: 'The Katyuri Dynasty & Parmar Dynasty of Garhwal',
        htmlContent: `
          <div class="space-y-6 text-slate-300 text-sm">
            <h2 class="text-2xl font-bold text-white">Chapter 2: The Katyuri Dynasty & Parmar Dynasty of Garhwal</h2>
            
            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-2">PART A: THE KARTIKEYAPUR (KATYURI) DYNASTY (700 CE – 11th Century)</h3>
              <p>The Kartikeyapur Dynasty, commonly known as the Katyuri Dynasty, holds the distinction of being the first unified historical dynasty of Uttarakhand. Their reign is widely regarded as the Golden Age of the region's architecture and sculpture.</p>
            </div>

            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-2">2.1 FOUNDATION & KEY RULERS</h3>
              <p class="mb-3">The dynasty was founded by Basant Dev around 700 CE. The rulers adopted the imperial title of <em>Paramabhattaraka Maharajadhiraja Parameshwar</em>, reflecting their claim to supreme sovereignty over the region.</p>
              <p><strong>Three Key Rulers:</strong></p>
              <ul class="list-disc list-inside space-y-1">
                <li><strong>Ishtagan</strong> - First to unite entire Uttarakhand region</li>
                <li><strong>Lalitsur Dev</strong> - Most powerful; prolific builder</li>
                <li><strong>Bhudev</strong> - Staunch Brahmanist; major contributor to Baijnath temple</li>
              </ul>
            </div>

            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-2">2.5 ARCHITECTURE – THE ZENITH OF TEMPLE CONSTRUCTION</h3>
              <p class="mb-3">The Katyuri period represents the architectural Golden Age of Uttarakhand.</p>
              <ul class="list-disc list-inside space-y-1">
                <li><strong>Jageshwar</strong> - Over 100 temples</li>
                <li><strong>Dwarahat (Gujar Deval)</strong> - Incomparable Shikhara style</li>
                <li><strong>Katarmal Sun Temple</strong> - Second largest Sun Temple in India</li>
                <li><strong>Baijnath</strong> - Main Shiva shrine + 17 subsidiary shrines</li>
              </ul>
            </div>
          </div>
        `,
      },
      '3': {
        label: 'Chapter 3',
        title: 'Gorkha Rule & Anglo-Gorkha War',
        htmlContent: `
          <div class="space-y-6 text-slate-300 text-sm">
            <h2 class="text-2xl font-bold text-white">Chapter 3: Gorkha Rule & Anglo-Gorkha War (1790-1815)</h2>
            
            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-2">3.11 Oppressive Taxation System</h3>
              <p>The Gorkhas imposed 9 types of taxes including land tax, forest tax, and crossing tax on the traumatized local population.</p>
            </div>

            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-2">3.13 Anglo-Gorkha War & Treaty of Sugauli</h3>
              <p>The war (1814-1815) resulted in the Treaty of Sugauli, which ceded Kumaon and Garhwal to British rule. Gorkha tyranny was so severe that when British took control in 1815, their administration appeared "liberal and reformist" in comparison.</p>
            </div>
          </div>
        `,
      },
      '4': {
        label: 'Chapter 4',
        title: 'British Rule in Uttarakhand (1815-1947)',
        htmlContent: `
          <div class="space-y-6 text-slate-300 text-sm">
            <h2 class="text-2xl font-bold text-white">Chapter 4: British Rule in Uttarakhand (1815–1947)</h2>
            
            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-2">4.1 ARRIVAL & TERRITORIAL DIVISION (1815)</h3>
              <p class="mb-3">Following the Treaty of Sugauli (1815), British Kumaon and Garhwal came under direct British rule in the Kumaon Commissionerate, while the western region became Tehri Riyasat (Princely State).</p>
            </div>

            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-2">4.3 COMMISSIONER G.W. TRAILL – DETAILED PROFILE</h3>
              <p class="mb-3">G.W. Traill (1816–1835) was the man who built the administrative DNA of British Uttarakhand. His judicial policy: <em>"Na Vakeel, Na Daleel, Na Appeal"</em> (No lawyer, no argument, no appeal).</p>
              <p>He created the Revenue Police system (1819), introduced Double Lock System (1824), established Mule Army (1822), and implemented Assi Sala Settlement (1823).</p>
            </div>

            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-2">4.4 COMMISSIONER SIR HENRY RAMSAY – DETAILED PROFILE</h3>
              <p>Sir Henry Ramsay (1856–1884) earned the title 'Uncrowned King of Kumaon'. His era is regarded as the Golden Age of British rule. He established Ramsay Collegiate School (1871) and codified the Revenue Police System (1874).</p>
            </div>
          </div>
        `,
      },
      '27': {
        label: 'Chapter 27',
        title: 'Education & HRD - Labour & Skills',
        htmlContent: `
          <div class="space-y-6 text-slate-300 text-sm">
            <h2 class="text-2xl font-bold text-white">Chapter 27: Education & HRD - Labour & Skills</h2>
            
            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-2">A. Labour Force Macro-Data</h3>
              <p>Uttarakhand's labour force composition shows significant rural-urban divide with 60% in agriculture and 30% in services.</p>
            </div>

            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-2">B. Flagship Skilling Schemes</h3>
              <p>Major programs include Pradhan Mantri Skill Development, SANTULAN, VIGYAN, and state-specific initiatives targeting youth employment.</p>
            </div>

            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-2">C. Orange Economy</h3>
              <p>Creative and cultural sectors contribute ₹5000 Cr to state economy with growth potential in handicrafts, tourism, and digital content.</p>
            </div>

            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-2">D. Silver Economy & Caregiver Mission</h3>
              <p>With 8% elderly population, Silver Economy focuses on healthcare, elder care, and social security initiatives.</p>
            </div>

            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-2">27.17 SANTULAN Model - Way Forward</h3>
              <p>9-point recommendations for sustainable skill development including education-industry linkages, vocational training, and employment guarantee schemes.</p>
            </div>
          </div>
        `,
      },
    },
    hi: {
      'index': {
        label: '📑 विषय-सूची',
        title: 'पूरी सूची - सभी 28 अध्याय',
        isIndex: true,
        pdfUrl: '/book-samples/hindi/Hindi book index.pdf',
      },
      '2': {
        label: 'अध्याय 2',
        title: 'कत्यूरी राजवंश',
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
        title: 'शिक्षा और कौशल',
        pdfUrl: '/book-samples/hindi/27 chapter education .pdf',
      },
    },
  };

  const handleLanguageChange = (language: 'en' | 'hi') => {
    setSelectedLanguage(language);
    setSelectedChapter('index');
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate all required fields
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.city ||
      !formData.pincode ||
      !formData.state ||
      !formData.address
    ) {
      setError(selectedLanguage === 'en' ? 'Please fill all required fields!' : 'कृपया सभी आवश्यक फ़ील्ड भरें!');
      return;
    }

    setSubmitting(true);

    try {
      // Step 1: Create payment order via API
      const createOrderResponse = await fetch('/api/create-book-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.replace(/\D/g, ''),
          email: formData.email.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          pincode: formData.pincode.trim(),
          state: formData.state.trim(),
          landmark: formData.landmark.trim(),
          language: selectedLanguage,
        }),
      });

      if (!createOrderResponse.ok) {
        const errorData = await createOrderResponse.json();
        throw new Error(errorData.error || 'Failed to create payment order');
      }

      const paymentData = await createOrderResponse.json();

      // Step 2: Load and open Razorpay checkout
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onerror = () => {
        setError(selectedLanguage === 'en' ? 'Failed to load payment gateway. Please check internet and try again.' : 'भुगतान गेटवे लोड करने में विफल। कृपया इंटरनेट जांचें और पुनः प्रयास करें।');
        setSubmitting(false);
      };

      script.onload = () => {
        const options = {
          key: paymentData.key,
          amount: paymentData.amount,
          currency: 'INR',
          order_id: paymentData.orderId,
          name: 'UKPSC Decoded',
          description: selectedLanguage === 'en' ? 'UKPSC Book - English Edition' : 'UKPSC पुस्तक - हिंदी संस्करण',
          prefill: {
            name: paymentData.name,
            email: paymentData.email || '',
            contact: paymentData.phone,
          },
          handler: async (response: any) => {
            // Step 3: Verify payment and submit to Google Sheet
            await handlePaymentSuccess(response, paymentData);
          },
          modal: {
            ondismiss: () => {
              setError(selectedLanguage === 'en' ? 'Payment cancelled. Please try again.' : 'भुगतान रद्द किया गया। कृपया पुनः प्रयास करें।');
              setSubmitting(false);
            },
          },
          theme: { color: '#FF9933' },
        };

        try {
          const razorpay = new (window as any).Razorpay(options);
          razorpay.open();
        } catch (err) {
          setError(selectedLanguage === 'en' ? 'Failed to open payment gateway. Please try again.' : 'भुगतान गेटवे खोलने में विफल। कृपया पुनः प्रयास करें।');
          setSubmitting(false);
        }
      };

      document.body.appendChild(script);
    } catch (err) {
      setError(err instanceof Error ? err.message : (selectedLanguage === 'en' ? 'Something went wrong. Please try again.' : 'कुछ गलत हुआ। कृपया पुनः प्रयास करें।'));
      setSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (response: any, paymentData: any) => {
    try {
      // Verify payment signature
      const verifyResponse = await fetch('/api/verify-book-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          orderId: paymentData.receiptId,
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.replace(/\D/g, ''),
          address: formData.address.trim(),
          city: formData.city.trim(),
          pincode: formData.pincode.trim(),
          state: formData.state.trim(),
          landmark: formData.landmark.trim(),
          language: selectedLanguage,
        }),
      });

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        throw new Error(errorData.error || 'Payment verification failed');
      }

      const verifyData = await verifyResponse.json();

      // Redirect to order confirmation with success
      const params = new URLSearchParams({
        orderId: verifyData.orderId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        language: selectedLanguage === 'en' ? 'English' : 'हिंदी',
        paymentId: response.razorpay_payment_id,
        status: 'success',
      });

      router.push(`/order-confirmation?${params.toString()}`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error('Payment verification error:', err);
      setError(
        selectedLanguage === 'en'
          ? `Payment verified but error occurred. Payment ID: ${response.razorpay_payment_id}. Please contact support.`
          : `भुगतान सत्यापित लेकिन त्रुटि हुई। भुगतान ID: ${response.razorpay_payment_id}। कृपया सहायता से संपर्क करें।`
      );
      setSubmitting(false);
    }
  };

  const currentChapters = selectedLanguage === 'en' ? ['index', '2', '3', '4', '27'] : ['index', '2', '3', '4', '27'];
  const currentContent = selectedLanguage === 'en' ? chapterContent.en : chapterContent.hi;
  const selectedChapterData = selectedChapter ? currentContent[selectedChapter] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Book className="text-orange-500" size={40} />
            UKPSC Decoded
          </h1>
          <p className="text-xl text-slate-300">उत्तराखंड का संपूर्ण अध्ययन पुस्तक</p>

          {/* LARGE LANGUAGE TOGGLE */}
          <div className="flex justify-center gap-6 mt-8 mb-8">
            <button onClick={() => handleLanguageChange('en')} className={`px-10 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${selectedLanguage === 'en' ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-2xl' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}>
              🇬🇧 ENGLISH
            </button>
            <button onClick={() => handleLanguageChange('hi')} className={`px-10 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${selectedLanguage === 'hi' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-2xl' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}>
              🇮🇳 हिंदी
            </button>
          </div>

          {/* QUICK INDEX BUTTON */}
          <button onClick={() => setSelectedChapter('index')} className="inline-block px-8 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 rounded-lg font-bold text-sm hover:shadow-lg transition-all">
            📑 {selectedLanguage === 'en' ? 'VIEW FULL INDEX' : 'पूरी विषय-सूची देखें'}
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
                    <button key={chapterId} onClick={() => setSelectedChapter(chapterId)} className={`w-full text-left p-4 rounded-lg transition-all ${isSelected ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}>
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
                <div className="bg-gradient-to-r from-slate-700 to-slate-900 p-6 border-b border-slate-600 flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedChapterData.title}</h2>
                    <p className="text-slate-300 text-sm mt-2">{selectedChapterData.isIndex ? (selectedLanguage === 'en' ? '📑 Index' : '📑 विषय-सूची') : (selectedLanguage === 'en' ? '📄 Sample' : '📄 नमूना')}</p>
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
                      <p className="text-slate-300 mb-6">{selectedLanguage === 'en' ? 'PDF Preview' : 'PDF पूर्वावलोकन'}</p>
                      <button onClick={() => window.open(selectedChapterData.pdfUrl, '_blank')} className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 rounded-lg font-bold">👁️ {selectedLanguage === 'en' ? 'View PDF' : 'PDF देखें'}</button>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="bg-slate-800 rounded-2xl p-12 text-center border border-slate-700">
                <ChevronDown size={48} className="mx-auto opacity-50 mb-4 text-slate-400" />
                <p className="text-slate-300 text-lg">{selectedLanguage === 'en' ? 'Select a chapter from the left to view sample' : 'नमूना देखने के लिए बाईं ओर से कोई अध्याय चुनें'}</p>
              </div>
            )}

            <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
              <h2 className="text-3xl font-bold text-white mb-8">📦 {selectedLanguage === 'en' ? 'Place Order' : 'आदेश दें'}</h2>
              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500 text-red-200 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" name="name" placeholder={selectedLanguage === 'en' ? 'Full Name' : 'पूरा नाम'} value={formData.name} onChange={handleFormChange} required className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-orange-500 outline-none" />
                  <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleFormChange} required className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-orange-500 outline-none" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="tel" name="phone" placeholder={selectedLanguage === 'en' ? 'Phone' : 'फोन'} value={formData.phone} onChange={handleFormChange} required className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-orange-500 outline-none" />
                  <input type="text" name="city" placeholder={selectedLanguage === 'en' ? 'City' : 'शहर'} value={formData.city} onChange={handleFormChange} required className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-orange-500 outline-none" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" name="pincode" placeholder={selectedLanguage === 'en' ? 'PIN' : 'पिन'} value={formData.pincode} onChange={handleFormChange} required className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-orange-500 outline-none" />
                  <input type="text" name="state" placeholder={selectedLanguage === 'en' ? 'State' : 'राज्य'} value={formData.state} onChange={handleFormChange} required className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-orange-500 outline-none" />
                </div>
                <textarea name="address" placeholder={selectedLanguage === 'en' ? 'Address' : 'पता'} rows={3} value={formData.address} onChange={handleFormChange} required className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-orange-500 outline-none"></textarea>
                <input type="text" name="landmark" placeholder={selectedLanguage === 'en' ? 'Landmark' : 'निकटतम स्थान'} value={formData.landmark} onChange={handleFormChange} className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-orange-500 outline-none" />
                <div className="p-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg border-l-4 border-orange-500">
                  <span className="text-slate-300">{selectedLanguage === 'en' ? 'Book: ' : 'पुस्तक: '}</span>
                  <span className="text-orange-400 font-bold">{selectedLanguage === 'en' ? '📖 English' : '📖 हिंदी'}</span>
                </div>
                <button type="submit" disabled={submitting} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl disabled:opacity-50">
                  {submitting ? '⏳ Processing...' : '💳 Proceed to Payment'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
