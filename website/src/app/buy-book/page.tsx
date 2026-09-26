'use client';

import { useState, useEffect } from 'react';
import { X, Eye, ChevronDown, Book, AlertCircle, CheckCircle } from 'lucide-react';
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

const RAZORPAY_KEY = 'rzp_live_TXb0nhqyo9LhkM';
const ORDERS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzBqI-RudL7s4H1oDedmLzgAeBsimEm0gt6WJyOPVzivTCjYxjtLAFgMsp-W3pmPaKTkA/exec';

export default function BuyBookPage() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi'>('en');
  const [selectedChapter, setSelectedChapter] = useState<string>('index');
  const [razorpayReady, setRazorpayReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

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

  useEffect(() => {
    preloadRazorpayScript();
  }, []);

  const preloadRazorpayScript = () => {
    if ((window as any).Razorpay) {
      console.log('✅ Razorpay already loaded');
      setRazorpayReady(true);
      return;
    }

    const script = document.createElement('script');
    // Add timestamp to bypass cache
    script.src = `https://checkout.razorpay.com/v1/checkout.js?ts=${Date.now()}`;
    script.async = true;
    script.defer = false;
    script.type = 'text/javascript';

    // Add timeout for script loading
    const timeout = setTimeout(() => {
      console.error('❌ Razorpay script load timeout (10s)');
      script.remove();
      // Retry after 3 seconds
      setTimeout(() => {
        console.log('🔄 Retrying Razorpay script load...');
        preloadRazorpayScript();
      }, 3000);
    }, 10000);

    script.onload = () => {
      clearTimeout(timeout);
      console.log('✅ Razorpay script loaded successfully');
      setRazorpayReady(true);
      setError(null);
    };

    script.onerror = () => {
      clearTimeout(timeout);
      console.error('❌ Failed to load Razorpay script');
      script.remove();
      setTimeout(() => {
        console.log('🔄 Retrying Razorpay script...');
        preloadRazorpayScript();
      }, 3000);
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
            <h3 class="text-xl font-bold text-saffron-400 mb-3">PART A: HISTORY & CULTURE (Chapters 1-10)</h3>
            <ol class="list-decimal list-inside space-y-2 text-graphite-300">
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
            <h3 class="text-xl font-bold text-saffron-400 mb-3">PART B: POLITICS & GOVERNANCE (Chapters 11-14)</h3>
            <ol class="list-decimal list-inside space-y-2 text-graphite-300" start="11">
              <li>Political Parties & Electoral History</li>
              <li>Electoral System & Democratic Institutions</li>
              <li>District Administration & Local Bodies</li>
              <li>Land Reforms & Constitutional Amendments</li>
            </ol>
          </div>
          <div>
            <h3 class="text-xl font-bold text-saffron-400 mb-3">PART C: GEOGRAPHY (Chapters 15-20)</h3>
            <ol class="list-decimal list-inside space-y-2 text-graphite-300" start="15">
              <li>Physical Geography & Topography</li>
              <li>Climate & Weather Patterns</li>
              <li>Vegetation & Biodiversity</li>
              <li>Water Resources & Hydropower</li>
              <li>Mineral Resources & Geology</li>
              <li>Environmental Protection & Conservation</li>
            </ol>
          </div>
          <div>
            <h3 class="text-xl font-bold text-saffron-400 mb-3">PART D: ECONOMY (Chapters 21-25)</h3>
            <ol class="list-decimal list-inside space-y-2 text-graphite-300" start="21">
              <li>Agriculture & Horticulture</li>
              <li>Industries & MSME Development</li>
              <li>Tourism & Hospitality Sector</li>
              <li>Transportation & Infrastructure</li>
              <li>Economic Development Indicators</li>
            </ol>
          </div>
          <div>
            <h3 class="text-xl font-bold text-saffron-400 mb-3">PART E: DISASTER MANAGEMENT & HRD (Chapters 26-28)</h3>
            <ol class="list-decimal list-inside space-y-2 text-graphite-300" start="26">
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
        pdfUrl: '/book-samples/English/Safari.pdf',
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
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
    setError(null);
    setSuccess(null);
  };

  const openPdfInNewTab = (pdfUrl: string) => {
    window.open(pdfUrl, '_blank');
  };

  const validateFormData = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    const requiredFields = ['name', 'email', 'phone', 'address', 'city', 'pincode', 'state'];
    
    requiredFields.forEach(field => {
      if (!formData[field as keyof typeof formData]?.trim()) {
        newErrors[field] = selectedLanguage === 'en' 
          ? `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
          : `${field} आवश्यक है`;
      }
    });

    // Email validation
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = selectedLanguage === 'en' 
          ? 'Please enter a valid email address'
          : 'कृपया सही ईमेल दर्ज करें';
      }
    }

    // Phone validation
    if (formData.phone) {
      const phoneDigits = formData.phone.replace(/\D/g, '');
      if (phoneDigits.length < 10) {
        newErrors.phone = selectedLanguage === 'en' 
          ? 'Phone number must be at least 10 digits'
          : 'फोन नंबर कम से कम 10 अंकों का होना चाहिए';
      }
    }

    // Pincode validation (Indian format)
    if (formData.pincode) {
      const pincodeRegex = /^\d{6}$/;
      if (!pincodeRegex.test(formData.pincode.trim())) {
        newErrors.pincode = selectedLanguage === 'en' 
          ? 'Please enter a valid 6-digit PIN code'
          : '6-अंकीय पिन कोड दर्ज करें';
      }
    }

    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  type OrderStatus = 'FORM_SUBMITTED' | 'PENDING_PAYMENT' | 'PAYMENT_FAILED' | 'PAYMENT_RECEIVED';

  const submitOrderToSheet = async (
    status: OrderStatus,
    orderId: string,
    paymentId: string = 'N/A'
  ): Promise<boolean> => {
    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.replace(/\D/g, ''),
      address: formData.address.trim(),
      city: formData.city.trim(),
      pincode: formData.pincode.trim(),
      state: formData.state.trim(),
      landmark: formData.landmark.trim(),
      language: selectedLanguage === 'en' ? 'English Book' : 'Hindi Book (हिंदी)',
      timestamp: new Date().toISOString(),
      orderId: orderId,
      paymentId: paymentId,
      status: status,
    };

    // Primary: same-origin server route (no CORS, survives page navigation via keepalive)
    try {
      const res = await fetch('/api/log-book-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      });
      const result = await res.json().catch(() => ({}));
      if (res.ok && result.ok) {
        console.log(`✅ Order recorded - ${status} | ${orderId}`);
        return true;
      }
      console.error('Sheet relay failed:', result);
    } catch (err) {
      console.error('Sheet relay error:', err);
    }

    // Backup: fire directly at Apps Script as a simple (no-preflight) request
    try {
      const body = JSON.stringify(payload);
      const sent = typeof navigator !== 'undefined' && navigator.sendBeacon
        ? navigator.sendBeacon(ORDERS_SCRIPT_URL, body)
        : false;
      if (!sent) {
        await fetch(ORDERS_SCRIPT_URL, { method: 'POST', mode: 'no-cors', body, keepalive: true });
      }
      console.log(`📨 Order sent via backup - ${status} | ${orderId}`);
      return true;
    } catch (err) {
      console.error('Backup submission failed:', err);
      return false;
    }
  };

  const openRazorpayCheckout = async (retryCount = 0, existingOrderId?: string): Promise<void> => {
    try {
      // Check if Razorpay is loaded
      if (!((window as any).Razorpay)) {
        if (retryCount < 3) {
          console.log(`Razorpay not ready, retrying... (${retryCount + 1}/3)`);
          setError(selectedLanguage === 'en' 
            ? 'Loading payment gateway, please wait...' 
            : 'भुगतान गेटवे लोड हो रहा है, कृपया प्रतीक्षा करें...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          return openRazorpayCheckout(retryCount + 1, existingOrderId);
        } else {
          throw new Error('Payment gateway failed to load. Please refresh the page and try again.');
        }
      }

      const orderId = existingOrderId || `UKPSC_BOOK_${Date.now()}`;

      // Clean phone number
      const cleanPhone = formData.phone.replace(/\D/g, '');

      const Razorpay = (window as any).Razorpay;

      const options = {
        key: RAZORPAY_KEY,
        amount: 49900, // ₹499 in paise
        currency: 'INR',
        name: 'UKPSC Decoded',
        description: selectedLanguage === 'en' 
          ? 'UKPSC Book - English Edition' 
          : 'UKPSC पुस्तक - हिंदी संस्करण',
        image: 'https://ukpscdecoded.vercel.app/logo.png',
        
        // FIX: Include address in prefill object
        prefill: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          contact: cleanPhone, // Must be string of digits
        },
        
        notes: {
          orderId: orderId,
          language: selectedLanguage,
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
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
          escape: false,
          backdropclose: false,
        },
        
        theme: {
          color: '#FF9933',
        },
      };

      const razorpay = new Razorpay(options);
      razorpay.on('payment.failed', (resp: any) => {
        console.log('❌ Payment failed:', resp?.error?.description);
        submitOrderToSheet('PAYMENT_FAILED', orderId, resp?.error?.metadata?.payment_id || resp?.error?.reason || 'FAILED');
      });
      razorpay.open();
      
    } catch (err) {
      console.error('Razorpay error:', err);
      setSubmitting(false);
      
      const errorMessage = err instanceof Error ? err.message : 
        (selectedLanguage === 'en' 
          ? 'Payment gateway error. Please refresh and try again.' 
          : 'भुगतान गेटवे में त्रुटि। कृपया रीफ्रेश करें और पुनः प्रयास करें।');
      
      setError(errorMessage);
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
    setError(null);
    setSuccess(selectedLanguage === 'en' 
      ? '⏳ Payment cancelled. Your details have been saved. You can retry anytime.' 
      : '⏳ भुगतान रद्द किया गया। आपके विवरण सहेजे गए हैं। आप कभी भी पुनः प्रयास कर सकते हैं।');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate all fields first
    if (!validateFormData()) {
      return;
    }

    // Check if Razorpay is ready
    if (!razorpayReady) {
      setError(selectedLanguage === 'en' 
        ? 'Payment gateway is still loading. Please wait a moment and try again.' 
        : 'भुगतान गेटवे अभी भी लोड हो रहा है। कृपया एक क्षण प्रतीक्षा करें और पुनः प्रयास करें।');
      return;
    }

    setSubmitting(true);
    setError(selectedLanguage === 'en' 
      ? 'Opening payment gateway...' 
      : 'भुगतान गेटवे खोल रहे हैं...');

    // Record the enquiry immediately so every form fill reaches the sheet
    const newOrderId = `UKPSC_BOOK_${Date.now()}`;
    submitOrderToSheet('FORM_SUBMITTED', newOrderId, 'NOT_PAID_YET');

    // Wait a moment then open checkout
    setTimeout(() => {
      openRazorpayCheckout(0, newOrderId);
    }, 500);
  };

  const selectedChapterData = selectedChapter ? currentContent[selectedChapter] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-graphite-900 via-graphite-800 to-graphite-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Book className="text-saffron-500" size={40} />
            UTTARAKHAND Decoded
          </h1>
          <p className="text-xl text-graphite-300">उत्तराखंड का संपूर्ण अध्ययन पुस्तक</p>

          <div className="flex justify-center gap-6 mt-8 mb-8">
            <button 
              onClick={() => handleLanguageChange('en')} 
              className={`px-10 py-4 rounded-xl font-bold text-lg transition-all ${
                selectedLanguage === 'en' 
                  ? 'bg-gradient-to-r from-saffron-500 to-danger-600 text-white shadow-2xl' 
                  : 'bg-graphite-700 text-graphite-200 hover:bg-graphite-600'
              }`}
            >
              🇬🇧 ENGLISH
            </button>
            <button 
              onClick={() => handleLanguageChange('hi')} 
              className={`px-10 py-4 rounded-xl font-bold text-lg transition-all ${
                selectedLanguage === 'hi' 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-2xl' 
                  : 'bg-graphite-700 text-graphite-200 hover:bg-graphite-600'
              }`}
            >
              🇮🇳 हिंदी
            </button>
          </div>

          <div className="flex justify-center mb-12">
            <div className="w-full max-w-md">
              <div className="bg-graphite-800 rounded-2xl overflow-hidden shadow-2xl border border-graphite-700 p-4">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-graphite-900">
                  <Image
                    src={selectedLanguage === 'en' ? '/IMG_5855.jpeg' : '/IMG_5854.jpeg'}
                    alt="Book Cover"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="mt-4 text-center">
                  <p className="text-graphite-300 text-sm">{selectedLanguage === 'en' ? '🇬🇧 English' : '🇮🇳 हिंदी'}</p>
                  <p className="text-white font-bold mt-2">UTTARAKHAND Decoded</p>
                  <p className="text-saffron-400 font-bold mt-1">₹499</p>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setSelectedChapter('index')} 
            className="inline-block px-8 py-3 bg-gradient-to-r from-saffron-400 to-saffron-500 text-graphite-900 rounded-lg font-bold hover:shadow-lg"
          >
            📑 {selectedLanguage === 'en' ? 'VIEW INDEX' : 'विषय-सूची'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-graphite-800 rounded-2xl p-6 sticky top-4 shadow-2xl border border-graphite-700 max-h-[85vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-white mb-4">{selectedLanguage === 'en' ? 'Chapters' : 'अध्याय'}</h2>
              <div className="space-y-2">
                {currentChapters.map((chapterId) => {
                  const chapter = currentContent[chapterId];
                  const isSelected = selectedChapter === chapterId;
                  return (
                    <button 
                      key={chapterId} 
                      onClick={() => setSelectedChapter(chapterId)} 
                      className={`w-full text-left p-4 rounded-lg transition-all ${
                        isSelected 
                          ? 'bg-gradient-to-r from-saffron-500 to-danger-600 text-white' 
                          : 'bg-graphite-700 text-graphite-200 hover:bg-graphite-600'
                      }`}
                    >
                      <div className="font-semibold text-sm">{chapter.label}</div>
                      <div className="text-xs opacity-90 line-clamp-2">{chapter.title}</div>
                    </button>
                  );
                })}
              </div>
              <div className="mt-8 p-4 bg-gradient-to-r from-saffron-500 to-danger-600 rounded-xl">
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
              <div className="bg-graphite-800 rounded-2xl overflow-hidden shadow-2xl border border-graphite-700">
                <div className="bg-gradient-to-r from-graphite-700 to-graphite-900 p-6 flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedChapterData.title}</h2>
                  </div>
                  <button 
                    onClick={() => setSelectedChapter('')} 
                    className="text-graphite-300 hover:text-white"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="p-8 h-full">
                  {selectedChapterData.htmlContent ? (
                    <div dangerouslySetInnerHTML={{ __html: selectedChapterData.htmlContent }} />
                  ) : selectedChapterData.pdfUrl ? (
                    <button
                      onClick={() => openPdfInNewTab(selectedChapterData.pdfUrl!)}
                      className="w-full cursor-pointer group relative rounded-lg overflow-hidden bg-graphite-900 border-2 border-dashed border-graphite-600 hover:border-saffron-500 transition-all p-12"
                    >
                      <div className="text-center">
                        <Eye className="mx-auto mb-3 text-graphite-300 group-hover:text-saffron-500 transition-colors" size={60} />
                        <p className="text-graphite-300 group-hover:text-saffron-400 font-bold text-lg">
                          {selectedLanguage === 'en' ? 'Click to View Full PDF' : 'पूरी पीडीएफ देखने के लिए क्लिक करें'}
                        </p>
                        <p className="text-graphite-300 text-sm mt-2">
                          {selectedLanguage === 'en' ? 'Opens in new browser tab' : 'नए ब्राउज़र टैब में खुलता है'}
                        </p>
                      </div>
                    </button>
                  ) : null}
                </div>
              </div>
            ) : null}

            <div className="bg-graphite-800 rounded-2xl p-8 shadow-2xl border border-graphite-700">
              <h2 className="text-3xl font-bold text-white mb-8">📦 {selectedLanguage === 'en' ? 'Place Order' : 'आदेश दें'}</h2>
              
              {/* Status Indicators */}
              {!razorpayReady && (
                <div className="mb-6 p-4 bg-saffron-400/20 border border-saffron-400 text-saffron-100 rounded-lg text-sm flex items-start gap-3">
                  <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                  <span>⚠️ {selectedLanguage === 'en' ? 'Preparing payment gateway...' : 'भुगतान गेटवे तैयार हो रहा है...'}</span>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-danger-500/20 border border-danger-500 text-danger-200 rounded-lg text-sm flex items-start gap-3">
                  <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-success-500/20 border border-success-500 text-success-200 rounded-lg text-sm flex items-start gap-3">
                  <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />
                  <span>{success}</span>
                </div>
              )}

              {submitting && (
                <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500 text-blue-200 rounded-lg text-sm flex items-start gap-3">
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin flex-shrink-0 mt-0.5" />
                  <span>⏳ {selectedLanguage === 'en' ? 'Opening payment gateway...' : 'भुगतान गेटवे खोल रहे हैं...'}</span>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Name & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input 
                      type="text" 
                      name="name" 
                      placeholder={selectedLanguage === 'en' ? 'Full Name *' : 'पूरा नाम *'} 
                      value={formData.name} 
                      onChange={handleFormChange} 
                      required 
                      className={`w-full px-4 py-3 bg-graphite-700 border rounded-lg text-white focus:outline-none focus:border-saffron-500 transition-colors ${
                        validationErrors.name ? 'border-danger-500' : 'border-graphite-600'
                      }`}
                    />
                    {validationErrors.name && <p className="text-danger-400 text-sm mt-1">{validationErrors.name}</p>}
                  </div>
                  <div>
                    <input 
                      type="email" 
                      name="email" 
                      placeholder="Email *" 
                      value={formData.email} 
                      onChange={handleFormChange} 
                      required 
                      className={`w-full px-4 py-3 bg-graphite-700 border rounded-lg text-white focus:outline-none focus:border-saffron-500 transition-colors ${
                        validationErrors.email ? 'border-danger-500' : 'border-graphite-600'
                      }`}
                    />
                    {validationErrors.email && <p className="text-danger-400 text-sm mt-1">{validationErrors.email}</p>}
                  </div>
                </div>

                {/* Phone & City */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input 
                      type="tel" 
                      name="phone" 
                      placeholder={selectedLanguage === 'en' ? 'Phone (10 digits) *' : 'फोन (10 अंक) *'} 
                      value={formData.phone} 
                      onChange={handleFormChange} 
                      required 
                      className={`w-full px-4 py-3 bg-graphite-700 border rounded-lg text-white focus:outline-none focus:border-saffron-500 transition-colors ${
                        validationErrors.phone ? 'border-danger-500' : 'border-graphite-600'
                      }`}
                    />
                    {validationErrors.phone && <p className="text-danger-400 text-sm mt-1">{validationErrors.phone}</p>}
                  </div>
                  <div>
                    <input 
                      type="text" 
                      name="city" 
                      placeholder={selectedLanguage === 'en' ? 'City *' : 'शहर *'} 
                      value={formData.city} 
                      onChange={handleFormChange} 
                      required 
                      className={`w-full px-4 py-3 bg-graphite-700 border rounded-lg text-white focus:outline-none focus:border-saffron-500 transition-colors ${
                        validationErrors.city ? 'border-danger-500' : 'border-graphite-600'
                      }`}
                    />
                    {validationErrors.city && <p className="text-danger-400 text-sm mt-1">{validationErrors.city}</p>}
                  </div>
                </div>

                {/* PIN & State */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input 
                      type="text" 
                      name="pincode" 
                      placeholder={selectedLanguage === 'en' ? 'PIN Code (6 digits) *' : 'पिन कोड (6 अंक) *'} 
                      value={formData.pincode} 
                      onChange={handleFormChange} 
                      required 
                      maxLength={6}
                      className={`w-full px-4 py-3 bg-graphite-700 border rounded-lg text-white focus:outline-none focus:border-saffron-500 transition-colors ${
                        validationErrors.pincode ? 'border-danger-500' : 'border-graphite-600'
                      }`}
                    />
                    {validationErrors.pincode && <p className="text-danger-400 text-sm mt-1">{validationErrors.pincode}</p>}
                  </div>
                  <div>
                    <input 
                      type="text" 
                      name="state" 
                      placeholder={selectedLanguage === 'en' ? 'State *' : 'राज्य *'} 
                      value={formData.state} 
                      onChange={handleFormChange} 
                      required 
                      className={`w-full px-4 py-3 bg-graphite-700 border rounded-lg text-white focus:outline-none focus:border-saffron-500 transition-colors ${
                        validationErrors.state ? 'border-danger-500' : 'border-graphite-600'
                      }`}
                    />
                    {validationErrors.state && <p className="text-danger-400 text-sm mt-1">{validationErrors.state}</p>}
                  </div>
                </div>

                {/* Full Address - FIX: Made more visible */}
                <div>
                  <textarea 
                    name="address" 
                    placeholder={selectedLanguage === 'en' ? 'Full Address (Street, House No.) *' : 'पूरा पता (सड़क, घर नंबर) *'} 
                    rows={4}
                    value={formData.address} 
                    onChange={handleFormChange} 
                    required 
                    className={`w-full px-4 py-3 bg-graphite-700 border rounded-lg text-white focus:outline-none focus:border-saffron-500 transition-colors resize-none ${
                      validationErrors.address ? 'border-danger-500' : 'border-graphite-600'
                    }`}
                  />
                  {validationErrors.address && <p className="text-danger-400 text-sm mt-1">{validationErrors.address}</p>}
                </div>

                {/* Landmark - Optional */}
                <div>
                  <input 
                    type="text" 
                    name="landmark" 
                    placeholder={selectedLanguage === 'en' ? 'Landmark or Reference (Optional)' : 'निकटतम स्थान (वैकल्पिक)'} 
                    value={formData.landmark} 
                    onChange={handleFormChange} 
                    className="w-full px-4 py-3 bg-graphite-700 border border-graphite-600 rounded-lg text-white focus:outline-none focus:border-saffron-500 transition-colors"
                  />
                </div>
                
                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={submitting || !razorpayReady} 
                  className="w-full bg-gradient-to-r from-success-500 to-teal-600 text-white py-4 rounded-lg font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all"
                >
                  {submitting 
                    ? '⏳ ' + (selectedLanguage === 'en' ? 'Processing...' : 'प्रोसेस हो रहा है...') 
                    : '💳 ' + (selectedLanguage === 'en' ? 'Proceed to Payment (₹499)' : 'भुगतान करें (₹499)')}
                </button>

                <p className="text-graphite-300 text-xs text-center">
                  {selectedLanguage === 'en' 
                    ? '🔒 Your payment is secure and encrypted with Razorpay' 
                    : '🔒 आपका भुगतान Razorpay द्वारा सुरक्षित है'}
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}