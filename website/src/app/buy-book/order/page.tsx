'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, CheckCircle2, ChevronDown, FileText, Lock, Truck, BookOpen, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
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

const ORDERS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzBqI-RudL7s4H1oDedmLzgAeBsimEm0gt6WJyOPVzivTCjYxjtLAFgMsp-W3pmPaKTkA/exec';

export default function BuyBookOrderPage() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi'>('en');
  const [selectedChapter, setSelectedChapter] = useState<string>('');
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
    // The book chosen on /buy-book: /buy-book/order?lang=en or ?lang=hi
    if (new URLSearchParams(window.location.search).get('lang') === 'hi') setSelectedLanguage('hi');
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
        pdfUrl: '/book-samples/hindi/27 chapter education .pdf',
      },
    },
  };

  const englishChapters = ['index', '1', '2', '4', '8', '12', 'misc'];
  const hindiChapters = ['index', '2', '3', '4', '9', '11', '19', '25', '27'];
  const currentChapters = selectedLanguage === 'en' ? englishChapters : hindiChapters;
  const currentContent = chapterContent[selectedLanguage];

  const handleLanguageChange = (language: 'en' | 'hi') => {
    setSelectedLanguage(language);
    setSelectedChapter('');
  };

  const switchLanguage = (language: 'en' | 'hi') => {
    handleLanguageChange(language);
    window.history.replaceState(null, '', `/buy-book/order?lang=${language}`);
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

      const orderRes = await fetch('/api/create-book-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: cleanPhone,
          address: formData.address.trim(),
          city: formData.city.trim(),
          pincode: formData.pincode.trim(),
          state: formData.state.trim(),
          landmark: formData.landmark.trim(),
          language: selectedLanguage,
        }),
      });
      const order = await orderRes.json().catch(() => ({}));
      if (!orderRes.ok || !order.orderId || !order.key) {
        throw new Error(order.error || 'Could not start the payment. Please try again.');
      }

      const options = {
        key: order.key,
        order_id: order.orderId,
        amount: order.amount,
        currency: 'INR',
        name: 'UKPSC Decoded',
        description: selectedLanguage === 'en' 
          ? 'UKPSC Book - English Edition' 
          : 'UKPSC पुस्तक - हिंदी संस्करण',
        image: 'https://www.ukpscdecoded.in/logo-badge.png',
        
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

  const en = selectedLanguage === 'en';
  const indexOpen = selectedChapter === 'index';
  const indexData = currentContent['index'];

  const inputClass = (field: string) =>
    `w-full rounded-lg border bg-graphite-800 px-4 py-3 text-white placeholder:text-graphite-400 transition-colors focus:border-saffron-400 focus:outline-none ${
      validationErrors[field] ? 'border-danger-500' : 'border-graphite-700'
    }`;

  const features = en
    ? [
        'Complete GS Paper V + Paper VI coverage',
        '2026 Edition, aligned to the latest syllabus',
        '28 chapters with exam-ready tables',
        'Economic Survey and Budget 2026-27',
        'Current Affairs capsule (up to June 2026)',
      ]
    : [
        'GS पेपर V + पेपर VI का संपूर्ण कवरेज',
        '2026 संस्करण, नवीनतम पाठ्यक्रम के अनुसार',
        'परीक्षा-उपयोगी तालिकाओं के साथ 28 अध्याय',
        'आर्थिक सर्वेक्षण और बजट 2026-27',
        'करेंट अफेयर्स कैप्सूल (जून 2026 तक)',
      ];


  return (
    <div className="min-h-screen bg-graphite-950 px-4 pb-16 pt-6 sm:pt-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href={`/buy-book?lang=${selectedLanguage}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-graphite-300 hover:text-saffron-300">
            <ArrowLeft className="h-4 w-4" /> {en ? 'All books' : 'सभी पुस्तकें'}
          </Link>
          <div role="tablist" aria-label="Edition" className="flex gap-1 rounded-xl border border-graphite-800 bg-graphite-900 p-1">
            {(['en', 'hi'] as const).map((l) => (
              <button
                key={l}
                type="button"
                role="tab"
                aria-selected={selectedLanguage === l}
                onClick={() => switchLanguage(l)}
                className={`min-h-[40px] rounded-lg px-4 text-sm font-bold ${
                  selectedLanguage === l ? 'bg-saffron-400 text-graphite-900' : 'text-graphite-200 hover:bg-graphite-800'
                }`}
              >
                {l === 'en' ? 'English' : 'हिंदी'}
              </button>
            ))}
          </div>
        </div>

          <>
            {/* Free sample chapters (the PDFs open in a new tab) */}
            <section className="rounded-2xl border border-graphite-800 bg-graphite-900 p-5 sm:p-8">
              <h2 className="font-display text-xl font-bold text-white sm:text-2xl">
                {en ? 'Step 1: Read free sample chapters' : 'चरण 1: निःशुल्क नमूना अध्याय पढ़ें'}
              </h2>
              <p className="mt-1 text-sm text-graphite-300">
                {en ? 'See the book before you buy. Each sample opens as a PDF in a new tab.' : 'खरीदने से पहले पुस्तक देखें। हर नमूना नए टैब में PDF के रूप में खुलता है।'}
              </p>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {currentChapters.map((chapterId) => {
                  const chapter = currentContent[chapterId];
                  const isIndexHtml = !!chapter.htmlContent;
                  return (
                    <button
                      key={chapterId}
                      type="button"
                      onClick={() =>
                        isIndexHtml ? setSelectedChapter(indexOpen ? '' : 'index') : chapter.pdfUrl && openPdfInNewTab(chapter.pdfUrl)
                      }
                      className="group flex min-h-[64px] items-center gap-3 rounded-xl border border-graphite-800 bg-graphite-950/60 p-3 text-left transition-colors hover:border-saffron-400/60"
                    >
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-saffron-400/10 text-saffron-400">
                        <FileText className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-white">{chapter.label.replace(/^\S+\s(?=[^\d])/u, '')}</span>
                        <span className="block truncate text-xs text-graphite-300">{chapter.title}</span>
                      </span>
                      {isIndexHtml && (
                        <ChevronDown className={`h-4 w-4 flex-shrink-0 text-graphite-400 transition-transform ${indexOpen ? 'rotate-180' : ''}`} />
                      )}
                    </button>
                  );
                })}
              </div>
              {indexOpen && indexData?.htmlContent && (
                <div className="mt-5 rounded-xl border border-graphite-800 bg-graphite-950/60 p-5 sm:p-6">
                  <h3 className="mb-4 font-bold text-white">{indexData.title}</h3>
                  <div dangerouslySetInnerHTML={{ __html: indexData.htmlContent }} />
                </div>
              )}
            </section>
            <section id="order" className="grid scroll-mt-24 gap-6 lg:grid-cols-5">
              {/* Cover, price, what's inside */}
              <div className="flex gap-4 self-start rounded-2xl border border-graphite-800 bg-graphite-900 p-4 sm:p-6 lg:col-span-2 lg:flex-col">
                <div className="relative aspect-[4/5] w-24 flex-shrink-0 overflow-hidden rounded-lg bg-graphite-950 sm:w-32 lg:mx-auto lg:w-full lg:max-w-xs">
                  <Image
                    src={en ? '/IMG_5855.jpeg' : '/IMG_5854.jpeg'}
                    alt={en ? 'Uttarakhand Decoded, English edition' : 'उत्तराखंड डिकोडेड, हिंदी संस्करण'}
                    fill
                    className="object-contain"
                    sizes="(min-width: 1024px) 320px, 128px"
                    priority
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-saffron-400">
                    {en ? 'English Edition · 2026' : 'हिंदी संस्करण · 2026'}
                  </p>
                  <h1 className="mt-1 font-display text-xl font-bold text-white sm:text-2xl">{en ? 'Uttarakhand Decoded' : 'उत्तराखंड डिकोडेड'}</h1>
                  <p className="mt-2 text-2xl font-bold text-white sm:text-3xl">₹499</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-success-400">
                    <Truck className="h-4 w-4" /> {en ? 'Free shipping' : 'मुफ़्त डिलीवरी'}
                  </p>
                  <ul className="mt-4 hidden space-y-2 lg:block">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-graphite-200">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-saffron-400" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Order form */}
              <div className="rounded-2xl border border-saffron-400/30 bg-graphite-900 p-5 sm:p-8 lg:col-span-3">
                <h2 className="font-display text-2xl font-bold text-white">
                  {en ? 'Step 2: Order the English book' : 'चरण 2: हिंदी पुस्तक ऑर्डर करें'}
                </h2>
                <p className="mt-1 text-sm text-graphite-300">
                  {en ? 'Fill in your delivery address, then pay securely.' : 'अपना डिलीवरी पता भरें, फिर सुरक्षित भुगतान करें।'}
                </p>

                <div className="mt-5 space-y-3">
                  {!razorpayReady && (
                    <div className="flex items-start gap-3 rounded-lg border border-saffron-400/50 bg-saffron-400/10 p-3 text-sm text-saffron-100">
                      <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                      <span>{en ? 'Preparing payment gateway...' : 'भुगतान गेटवे तैयार हो रहा है...'}</span>
                    </div>
                  )}
                  {error && (
                    <div className="flex items-start gap-3 rounded-lg border border-danger-500 bg-danger-500/20 p-3 text-sm text-danger-200">
                      <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                  {success && (
                    <div className="flex items-start gap-3 rounded-lg border border-success-500 bg-success-500/20 p-3 text-sm text-success-200">
                      <CheckCircle size={18} className="mt-0.5 flex-shrink-0" />
                      <span>{success}</span>
                    </div>
                  )}
                </div>

                <form onSubmit={handleFormSubmit} className="mt-5 space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <input type="text" name="name" placeholder={en ? 'Full Name *' : 'पूरा नाम *'} value={formData.name} onChange={handleFormChange} required className={inputClass('name')} />
                      {validationErrors.name && <p className="mt-1 text-sm text-danger-400">{validationErrors.name}</p>}
                    </div>
                    <div>
                      <input type="email" name="email" placeholder="Email *" value={formData.email} onChange={handleFormChange} required className={inputClass('email')} />
                      {validationErrors.email && <p className="mt-1 text-sm text-danger-400">{validationErrors.email}</p>}
                    </div>
                    <div>
                      <input type="tel" name="phone" placeholder={en ? 'Phone (10 digits) *' : 'फोन (10 अंक) *'} value={formData.phone} onChange={handleFormChange} required className={inputClass('phone')} />
                      {validationErrors.phone && <p className="mt-1 text-sm text-danger-400">{validationErrors.phone}</p>}
                    </div>
                    <div>
                      <input type="text" name="city" placeholder={en ? 'City *' : 'शहर *'} value={formData.city} onChange={handleFormChange} required className={inputClass('city')} />
                      {validationErrors.city && <p className="mt-1 text-sm text-danger-400">{validationErrors.city}</p>}
                    </div>
                    <div>
                      <input type="text" name="pincode" placeholder={en ? 'PIN Code (6 digits) *' : 'पिन कोड (6 अंक) *'} value={formData.pincode} onChange={handleFormChange} required maxLength={6} inputMode="numeric" className={inputClass('pincode')} />
                      {validationErrors.pincode && <p className="mt-1 text-sm text-danger-400">{validationErrors.pincode}</p>}
                    </div>
                    <div>
                      <input type="text" name="state" placeholder={en ? 'State *' : 'राज्य *'} value={formData.state} onChange={handleFormChange} required className={inputClass('state')} />
                      {validationErrors.state && <p className="mt-1 text-sm text-danger-400">{validationErrors.state}</p>}
                    </div>
                  </div>
                  <div>
                    <textarea name="address" placeholder={en ? 'Full Address (Street, House No.) *' : 'पूरा पता (सड़क, घर नंबर) *'} rows={3} value={formData.address} onChange={handleFormChange} required className={`${inputClass('address')} resize-none`} />
                    {validationErrors.address && <p className="mt-1 text-sm text-danger-400">{validationErrors.address}</p>}
                  </div>
                  <input type="text" name="landmark" placeholder={en ? 'Landmark (optional)' : 'निकटतम स्थान (वैकल्पिक)'} value={formData.landmark} onChange={handleFormChange} className={inputClass('landmark')} />

                  <button
                    type="submit"
                    disabled={submitting || !razorpayReady}
                    className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-saffron-400 py-3.5 text-lg font-bold text-graphite-900 shadow-lg shadow-saffron-500/20 transition-colors hover:bg-saffron-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? (en ? 'Processing...' : 'प्रोसेस हो रहा है...') : en ? 'Proceed to Payment · ₹499' : 'भुगतान करें · ₹499'}
                    {!submitting && <ArrowRight className="h-5 w-5" />}
                  </button>
                  <p className="flex items-center justify-center gap-1.5 text-center text-xs text-graphite-400">
                    <Lock className="h-3.5 w-3.5" />
                    {en ? 'Secure payment by Razorpay · UPI, cards, net banking' : 'Razorpay द्वारा सुरक्षित भुगतान · UPI, कार्ड, नेट बैंकिंग'}
                  </p>
                </form>
              </div>
            </section>

          </>

        {/* Why this book */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { icon: Truck, title: 'Free delivery across India', sub: 'Shipped to your door' },
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
