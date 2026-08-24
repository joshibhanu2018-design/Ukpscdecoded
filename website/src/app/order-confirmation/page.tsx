'use client';

import { useState, useEffect } from 'react';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Copy,
  Check,
  MessageCircle,
  Smartphone,
  QrCode,
  AlertCircle,
  Clock,
} from 'lucide-react';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const orderId = searchParams?.get('orderId') || 'UK' + Date.now();
  const language = searchParams?.get('language') || 'English';

  const isHindi = language === 'हिंदी';

  const content = {
    en: {
      title: 'Payment Confirmation',
      subtitle: 'Complete your payment to receive your book',
      orderPlaced: 'Your Order is Confirmed',
      orderId: 'Order ID',
      amount: 'Amount to Pay',
      paymentMethods: 'Choose Your Payment Method',
      upiId: 'UPI ID (Bank of Baroda)',
      scanQr: 'Scan QR Code',
      googlePay: 'Google Pay',
      phonePe: 'PhonePe',
      paytm: 'Paytm',
      utrLabel: 'UTR / Transaction ID',
      utrPlaceholder: 'Enter your UTR or Transaction ID',
      uploadScreenshot: 'Upload Payment Screenshot',
      uploadHint: 'Upload screenshot of successful payment confirmation',
      uploadButton: 'Choose Screenshot',
      confirm: 'Confirm Payment',
      confirming: 'Confirming...',
      whatsappSupport: 'Need Help? Chat on WhatsApp',
      whatsappMessage: `Payment Issue - Order ID: ${orderId}\n\nI'm having trouble with my payment. Please help me complete my order for Uttarakhand Decoded book.`,
      whatsappUpload: 'Send Screenshot via WhatsApp',
      sendMessage: 'Send Message',
      tryOtherMethods: '⚠️ Please try at least 2 different payment methods',
      deliveryInfo: '✅ Free Delivery • 4 Days Shipping',
      securePayment: 'Secure Payment • No Extra Charges',
      noScreenshotYet: 'No screenshot selected yet',
    },
    hi: {
      title: 'भुगतान पुष्टि',
      subtitle: 'अपनी किताब प्राप्त करने के लिए भुगतान पूरा करें',
      orderPlaced: 'आपका ऑर्डर पुष्ट हो गया',
      orderId: 'ऑर्डर ID',
      amount: 'भुगतान की जाने वाली राशि',
      paymentMethods: 'अपनी भुगतान विधि चुनें',
      upiId: 'UPI ID (बैंक ऑफ बड़ौदा)',
      scanQr: 'QR कोड स्कैन करें',
      googlePay: 'Google Pay',
      phonePe: 'PhonePe',
      paytm: 'Paytm',
      utrLabel: 'UTR / लेनदेन ID',
      utrPlaceholder: 'अपना UTR या लेनदेन ID दर्ज करें',
      uploadScreenshot: 'भुगतान स्क्रीनशॉट अपलोड करें',
      uploadHint: 'सफल भुगतान पुष्टि की स्क्रीनशॉट अपलोड करें',
      uploadButton: 'स्क्रीनशॉट चुनें',
      confirm: 'भुगतान की पुष्टि करें',
      confirming: 'पुष्टि की जा रही है...',
      whatsappSupport: 'सहायता चाहिए? WhatsApp पर चैट करें',
      whatsappMessage: `भुगतान समस्या - ऑर्डर ID: ${orderId}\n\nमुझे अपना भुगतान पूरा करने में समस्या हो रही है। कृपया उत्तराखंड डिकोडेड किताब के लिए मेरे ऑर्डर को पूरा करने में मदद करें।`,
      whatsappUpload: 'WhatsApp के माध्यम से स्क्रीनशॉट भेजें',
      sendMessage: 'संदेश भेजें',
      tryOtherMethods: '⚠️ कृपया कम से कम 2 भुगतान तरीकों को आज़माएं',
      deliveryInfo: '✅ मुफ्त डिलीवरी • 4 दिन की शिपिंग',
      securePayment: 'सुरक्षित भुगतान • कोई अतिरिक्त शुल्क नहीं',
      noScreenshotYet: 'अभी तक कोई स्क्रीनशॉट नहीं चुना गया',
    }
  };

  const txt = content[isHindi ? 'hi' : 'en'];
  const upiId = '9632662418@ptyes';
  const amount = 499;
  const phoneNumber = '918317390586';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setScreenshotFile(e.target.files[0]);
    }
  };

  const handleConfirmPayment = async () => {
    if (!screenshotFile) {
      alert(isHindi ? 'कृपया स्क्रीनशॉट अपलोड करें' : 'Please upload a screenshot');
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        
        const response = await fetch('/api/confirm-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            screenshotBase64: base64,
            utr: (document.getElementById('utr') as HTMLInputElement)?.value || '',
          }),
        });

        const result = await response.json();
        if (result.success) {
          alert(isHindi ? 'भुगतान की पुष्टि की गई! धन्यवाद।' : 'Payment confirmed! Thank you.');
          window.location.href = '/';
        }
      };
      reader.readAsDataURL(screenshotFile);
    } catch (error) {
      console.error('Error:', error);
      alert(isHindi ? 'त्रुटि हुई। कृपया पुनः प्रयास करें।' : 'Error occurred. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(txt.whatsappMessage)}`;
  const whatsappUploadLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(`Order ID: ${orderId}\n\nPlease find attached my payment screenshot.`)}`;

  // QR Code generation (simple UPI string)
  const upiString = `upi://pay?pa=${upiId}&pn=UKPSC%20Decoded&am=${amount}&tn=Uttarakhand%20Decoded%20Book`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-graphite-900 via-graphite-800 to-graphite-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Order Confirmed Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-jade-500/10 rounded-full p-4 mb-4">
            <Check className="w-8 h-8 text-jade-400" />
          </div>
          <h1 className="text-4xl font-bold mb-2">{txt.orderPlaced}</h1>
          <p className="text-graphite-400 text-lg">{txt.subtitle}</p>
        </div>

        {/* Order Details */}
        <div className="bg-graphite-800/50 rounded-2xl p-6 sm:p-8 border border-graphite-700/50 mb-8">
          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-graphite-400 text-sm mb-1">{txt.orderId}</p>
              <p className="text-2xl font-bold text-saffron-400">{orderId}</p>
            </div>
            <div>
              <p className="text-graphite-400 text-sm mb-1">{txt.amount}</p>
              <p className="text-2xl font-bold text-saffron-400">₹{amount}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 text-jade-400">
              <Clock className="w-4 h-4" />
              <span>{txt.deliveryInfo}</span>
            </div>
            <div className="flex items-center gap-2 text-jade-400">
              <Check className="w-4 h-4" />
              <span>{txt.securePayment}</span>
            </div>
          </div>
        </div>

        {/* Payment Methods Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          
          {/* Left: Payment Options */}
          <div className="space-y-6">
            <div className="bg-graphite-800/50 rounded-2xl p-6 sm:p-8 border border-graphite-700/50">
              <h2 className="text-2xl font-bold mb-6">{txt.paymentMethods}</h2>

              {/* UPI ID Display */}
              <div className="bg-graphite-700/30 rounded-lg p-4 mb-6">
                <p className="text-sm text-graphite-400 mb-2">{txt.upiId}</p>
                <div className="flex items-center gap-2">
                  <code className="text-lg font-bold text-saffron-400 flex-1">{upiId}</code>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 hover:bg-graphite-600 rounded transition"
                    title="Copy UPI ID"
                  >
                    {copied ? <Check className="w-5 h-5 text-jade-400" /> : <Copy className="w-5 h-5 text-graphite-400" />}
                  </button>
                </div>
              </div>

              {/* QR Code */}
              <div className="bg-white rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <QrCode className="w-32 h-32 text-graphite-800 mx-auto" />
                    <p className="text-graphite-800 text-sm mt-2">{txt.scanQr}</p>
                  </div>
                </div>
              </div>

              {/* Payment App Buttons */}
              <div className="space-y-3 mb-6">
                <a
                  href={`upi://pay?pa=${upiId}&pn=UKPSC%20Decoded&am=${amount}&tn=Book`}
                  className="block w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold text-center transition"
                >
                  💙 {txt.googlePay}
                </a>
                <a
                  href={`upi://pay?pa=${upiId}&pn=UKPSC%20Decoded&am=${amount}&tn=Book`}
                  className="block w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-bold text-center transition"
                >
                  💜 {txt.phonePe}
                </a>
                <a
                  href={`upi://pay?pa=${upiId}&pn=UKPSC%20Decoded&am=${amount}&tn=Book`}
                  className="block w-full bg-cyan-600 hover:bg-cyan-700 py-3 rounded-lg font-bold text-center transition"
                >
                  🔵 {txt.paytm}
                </a>
              </div>

              {/* Try Multiple Methods Warning */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-200">{txt.tryOtherMethods}</p>
              </div>
            </div>
          </div>

          {/* Right: Confirmation & WhatsApp */}
          <div className="space-y-6">
            
            {/* Payment Confirmation */}
            <div className="bg-graphite-800/50 rounded-2xl p-6 sm:p-8 border border-graphite-700/50">
              <h3 className="text-xl font-bold mb-4">{txt.uploadScreenshot}</h3>
              <p className="text-graphite-400 text-sm mb-4">{txt.uploadHint}</p>

              {/* UTR Input */}
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">{txt.utrLabel}</label>
                <input
                  id="utr"
                  type="text"
                  placeholder={txt.utrPlaceholder}
                  className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white placeholder-graphite-500 text-sm focus:outline-none focus:border-saffron-500"
                />
              </div>

              {/* Screenshot Upload */}
              <div className="mb-4">
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotChange}
                    className="hidden"
                  />
                  <span className="block w-full px-4 py-3 bg-graphite-700 border border-graphite-600 rounded-lg text-center cursor-pointer hover:bg-graphite-600 transition font-semibold">
                    {screenshotFile ? '✅ ' + screenshotFile.name : txt.uploadButton}
                  </span>
                </label>
              </div>

              {/* Confirm Payment Button */}
              <button
                onClick={handleConfirmPayment}
                disabled={uploading || !screenshotFile}
                className="w-full py-3 bg-jade-500 hover:bg-jade-600 disabled:opacity-50 rounded-lg font-bold transition"
              >
                {uploading ? txt.confirming : txt.confirm}
              </button>
            </div>

            {/* WhatsApp Support */}
            <div className="bg-graphite-800/50 rounded-2xl p-6 sm:p-8 border border-graphite-700/50">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-green-400" />
                {txt.whatsappSupport}
              </h3>

              <div className="space-y-3">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold transition"
                >
                  <MessageCircle className="w-5 h-5" />
                  {txt.sendMessage}
                </a>

                <a
                  href={whatsappUploadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-green-700 hover:bg-green-800 rounded-lg font-bold transition"
                >
                  <Smartphone className="w-5 h-5" />
                  {txt.whatsappUpload}
                </a>
              </div>

              <p className="text-graphite-400 text-xs mt-4 text-center">
                {isHindi ? 'हमारी टीम आपको तुरंत सहायता प्रदान करेगी' : 'Our team will assist you immediately'}
              </p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-graphite-800/50 rounded-2xl p-6 border border-graphite-700/50 text-center">
          <p className="text-graphite-400 text-sm">
            {isHindi 
              ? '✅ भुगतान के बाद, आपकी किताब 3-5 व्यावसायिक दिनों में पहुंच जाएगी।'
              : '✅ After payment, your book will be delivered within 3-5 business days.'
            }
          </p>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-white">Loading...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
