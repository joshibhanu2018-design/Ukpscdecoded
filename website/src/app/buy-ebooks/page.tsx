'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface PaymentResponse {
  orderId: string;
  key: string;
  amount: number;
  email: string;
  phone: string;
  name: string;
}

export default function BuyPDFPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(86400);
  const [paymentId, setPaymentId] = useState<string>('');

  useEffect(() => {
    if (!downloadLink) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setDownloadLink(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [downloadLink]);

  const formatTimeLeft = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return false;
    }

    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      setError('Please enter a valid phone number (10+ digits)');
      return false;
    }

    if (formData.email && !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleGetPaymentLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/create-pdf-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.replace(/\D/g, ''),
          email: formData.email.trim(),
          pdfId: 'polity-decoded',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment order');
      }

      const data: PaymentResponse = await response.json();

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onerror = () => {
        setError('Failed to load Razorpay. Please check your internet and try again.');
        setLoading(false);
      };
      script.onload = () => {
        const options = {
          key: data.key,
          amount: data.amount,
          currency: 'INR',
          order_id: data.orderId,
          name: 'UKPSC Decoded',
          description: 'Polity Decoded: The Complete Visual e-Book',
          prefill: {
            name: data.name,
            email: data.email || '',
            contact: data.phone,
          },
          handler: async (response: any) => {
            await handlePaymentSuccess(response, data.orderId);
          },
          modal: {
            ondismiss: () => {
              setError('Payment cancelled. Please try again.');
              setLoading(false);
            },
          },
          theme: {
            color: '#FF9933',
          },
        };

        try {
          const razorpay = new (window as any).Razorpay(options);
          razorpay.open();
        } catch (err) {
          setError('Failed to open payment gateway. Please try again.');
          setLoading(false);
        }
      };

      document.body.appendChild(script);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (response: any, orderId: string) => {
    try {
      const verifyResponse = await fetch('/api/verify-pdf-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          orderId: orderId,
          name: formData.name.trim(),
          phone: formData.phone.replace(/\D/g, ''),
          email: formData.email.trim(),
          pdfId: 'polity-decoded',
        }),
      });

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        throw new Error(errorData.error || 'Payment verification failed');
      }

      const verifyData = await verifyResponse.json();
      setDownloadLink(verifyData.downloadLink);
      setPaymentId(verifyData.paymentId || response.razorpay_payment_id);
      setTimeLeft(86400);
      setShowModal(true);
      setError(null);
      setFormData({ name: '', phone: '', email: '' });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error('Payment verification error:', err);
      setError(`Payment verified but unable to generate download link: ${errorMsg}. Please contact support with Payment ID: ${response.razorpay_payment_id}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 py-12 px-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Polity Decoded
        </h1>
        <p className="text-xl text-gray-700 mb-2">
          The Complete Visual e-Book for UPSC UKPSC UPPSC Prelims & Mains
        </p>
        <p className="text-gray-600 italic">SHORT YET COMPREHENSIVE</p>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Left: Book Description & Cover */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            {/* Book Cover Image */}
            <div className="rounded-lg mb-6 overflow-hidden shadow-md">
              <img 
                src="/IMG_5845.png" 
                alt="Polity Decoded Book Cover" 
                className="w-full h-auto object-cover"
              />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Book</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              A beautifully designed visual compendium that distills Laxmikant's and Subhash Kashyap's 
              complex concepts into scannable, graphic-rich modules based on PYQ and frequently asked questions.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              Built specifically for aspirants preparing for UPSC, UKPSC, UPPSC, and other state exams. 
              Every concept includes flowcharts and interconnected notes—designed for quick revision in your 
              final 30 days or as daily reference material.
            </p>

            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="text-green-600 font-bold mr-3">✓</span>
                <span className="text-gray-700">Visual flowcharts & interconnected notes</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-600 font-bold mr-3">✓</span>
                <span className="text-gray-700">Based on PYQ patterns & frequently asked topics</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-600 font-bold mr-3">✓</span>
                <span className="text-gray-700">Perfect for 30-day final revision</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-600 font-bold mr-3">✓</span>
                <span className="text-gray-700">All competitive exams (UPSC, UKPSC, UPPSC, etc.)</span>
              </div>
            </div>

            {/* Sample Pages */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="font-bold text-gray-900 mb-3">Preview Sample Pages</h3>
              <div className="grid grid-cols-3 gap-3">
                <img src="/IMG_5835.png" alt="Sample Page 1" className="w-full h-auto rounded-md border border-gray-200" />
                <img src="/IMG_5837.png" alt="Sample Page 2" className="w-full h-auto rounded-md border border-gray-200" />
                <img src="/IMG_5838.png" alt="Sample Page 3" className="w-full h-auto rounded-md border border-gray-200" />
              </div>
            </div>

            {/* File Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">📄 File Size:</span> ~10 MB<br />
                <span className="font-semibold">📥 Download Validity:</span> 24 hours<br />
                <span className="font-semibold">🔒 Secure:</span> Direct download from GitHub
              </p>
            </div>
          </div>
        </div>

        {/* Right: Purchase Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <div className="text-center mb-8">
              <p className="text-gray-600 text-sm mb-2">Special Price</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-5xl font-bold text-green-600">₹129</span>
                <span className="text-2xl text-gray-400 line-through">₹169</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Limited time offer - Only for first 100 buyers</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">✅ What You Get:</span><br />
                • Complete PDF e-book<br />
                • Instant delivery<br />
                • 24-hour download window<br />
                • High-quality formatting
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleGetPaymentLink} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-300 rounded-lg p-4">
                <p className="text-red-700 text-sm font-medium">
                  <span className="font-bold">⚠️</span> {error}
                </p>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="10-digit phone number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email (Optional)
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="inline-block animate-spin">⏳</span> Processing...
                </>
              ) : (
                <>
                  💳 Get Payment Link (₹129)
                </>
              )}
            </button>

            <p className="text-xs text-center text-gray-500">
              🔒 Secure payment via Razorpay. Your data is encrypted & safe.
            </p>
          </form>

          {/* Trust Badges */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Trusted by over 5000 aspirants for UPSC, UKPSC, UPPSC
            </p>
          </div>
        </div>
      </div>

      {/* Order Confirmation Modal */}
      {showModal && downloadLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full animate-in fade-in">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4 animate-bounce">✅</div>
              <h2 className="text-2xl font-bold text-gray-900">Order Confirmed!</h2>
              <p className="text-sm text-gray-600 mt-2">Payment ID: {paymentId}</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700 mb-2">
                <span className="font-semibold">✅ Your download link is ready</span>
              </p>
              <p className="text-xs text-gray-600">
                Valid for: <span className="font-semibold text-orange-600">{formatTimeLeft(timeLeft)}</span>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                📥 Download in time. Link expires in 24 hours.
              </p>
            </div>

            <a
              href={downloadLink}
              className="w-full block text-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition mb-3"
              download
            >
              📥 Download Polity Decoded (10 MB)
            </a>

            <button
              onClick={() => {
                setShowModal(false);
                setDownloadLink(null);
              }}
              className="w-full text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition"
            >
              Close
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              📧 Order details have been recorded.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}