'use client';
import { useState } from 'react';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Copy, Check, MessageCircle, ArrowDown } from 'lucide-react';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);
  const orderId = searchParams?.get('orderId') || 'UK' + Date.now();
  const customerName = searchParams?.get('name') || 'Student';
  const customerEmail = searchParams?.get('email') || '';
  const customerPhone = searchParams?.get('phone') || '';
  const language = searchParams?.get('language') || 'English';

  const isHindi = language === 'हिंदी';
  const upiId = '9632662418@ptyes';
  const amount = 499;
  const phoneNumber = '918317390586';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // UPI deep links
  const googlePayLink = `tez://upi/pay?pa=${upiId}&pn=UKPSC&am=${amount}&tn=Book`;
  const phonePeLink = `phonepe://pay?pa=${upiId}&pn=UKPSC&am=${amount}&tn=Book`;
  const paytmLink = `paytm://pay?pa=${upiId}&pn=UKPSC&am=${amount}&tn=Book`;
  const upiLink = `upi://pay?pa=${upiId}&pn=UKPSC&am=${amount}&tn=Book`;

  const whatsappMessage = isHindi
    ? `नमस्ते 👋\n\nमैंने अपना भुगतान पूरा कर दिया है।\n\nनाम: ${customerName}\nईमेल: ${customerEmail}\nफोन: ${customerPhone}\nऑर्डर ID: ${orderId}`
    : `Hi 👋\n\nI have completed my payment.\n\nName: ${customerName}\nEmail: ${customerEmail}\nPhone: ${customerPhone}\nOrder ID: ${orderId}`;

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const handlePaymentClick = (appLink: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = appLink;
    setTimeout(() => {
      if (!document.hidden) {
        window.location.href = upiLink;
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-graphite-900 via-graphite-800 to-graphite-900 text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{isHindi ? '2 सरल चरण' : '2 Simple Steps'}</h1>
          <p className="text-xl text-graphite-300">{isHindi ? 'भुगतान पूरा करें और WhatsApp पर हमें स्क्रीनशॉट भेजें' : 'Complete the Payment and Send us a Screenshot on WhatsApp'}</p>
        </div>

        {/* STEP 1 */}
        <div className="bg-graphite-800/50 rounded-2xl p-8 border border-graphite-700/50 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-saffron-500 flex items-center justify-center font-bold text-sm">1</div>{isHindi ? 'भुगतान पूरा करें' : 'Complete Payment'}</h2>
          <p className="text-graphite-300 mb-8 text-lg">{isHindi ? '💡 UPI ID कॉपी करें, अपने भुगतान ऐप में पेस्ट करें और आसानी से भुगतान करें।' : '💡 Copy the UPI ID, paste it in your payment app and pay easily.'}</p>

          <div className="bg-graphite-700/30 rounded-lg p-6 mb-8 border border-graphite-600">
            <p className="text-sm text-graphite-400 mb-3">UPI ID</p>
            <div className="flex items-center gap-3">
              <code className="text-2xl font-bold text-saffron-400 flex-1">{upiId}</code>
              <button onClick={copyToClipboard} className="flex items-center gap-2 px-4 py-2 bg-saffron-500 hover:bg-saffron-600 rounded-lg font-bold whitespace-nowrap">
                {copied ? (<><Check className="w-5 h-5" />{isHindi ? 'किया' : 'Copied'}</>) : (<><Copy className="w-5 h-5" />{isHindi ? 'कॉपी' : 'Copy'}</>)}
              </button>
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-white rounded-lg p-6 mb-8 flex justify-center">
            <div className="text-center">
              <p className="text-graphite-800 font-bold mb-4">{isHindi ? 'या QR स्कैन करें' : 'Or Scan QR'}</p>
              <img 
                src="https://lh3.googleusercontent.com/d/1XRZxaaYIu50JOMpddgu_EFq5ibVQoJF2?raw=true" 
                alt="UPI QR Code" 
                className="w-56 h-56 mx-auto"
              />
            </div>
          </div>

          {/* Payment Buttons */}
          <div className="space-y-3">
            <button
              onClick={handlePaymentClick(googlePayLink)}
              className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1" fill="none"/></svg>
              Google Pay
            </button>

            <button
              onClick={handlePaymentClick(phonePeLink)}
              className="w-full bg-purple-600 hover:bg-purple-700 py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white"><path d="M12 3 L20 9 L20 15 Q12 21 4 15 L4 9 Z" stroke="white" fill="none"/></svg>
              PhonePe
            </button>

            <button
              onClick={handlePaymentClick(paytmLink)}
              className="w-full bg-cyan-600 hover:bg-cyan-700 py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
              Paytm
            </button>
          </div>
        </div>

        <div className="flex justify-center mb-8"><ArrowDown className="w-8 h-8 text-saffron-400 animate-bounce" /></div>

        {/* STEP 2 */}
        <div className="bg-green-900/30 rounded-2xl p-8 border-2 border-green-600/50">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center font-bold text-sm">2</div>{isHindi ? 'WhatsApp पर भेजें' : 'Send on WhatsApp'}</h2>
          <p className="text-graphite-300 mb-8 text-lg">{isHindi ? '📸 अपना भुगतान स्क्रीनशॉट WhatsApp पर हमें भेजें।' : '📸 Send your payment screenshot to us on WhatsApp.'}</p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-6 bg-green-600 hover:bg-green-700 rounded-xl font-bold text-xl"
          >
            <MessageCircle className="w-8 h-8" />
            {isHindi ? 'WhatsApp पर संदेश भेजें' : 'Send Message on WhatsApp'}
          </a>
          <p className="text-green-200 text-sm mt-4 text-center">{isHindi ? '✅ हम तुरंत आपकी सहायता करेंगे' : '✅ We will assist you immediately'}</p>
        </div>

        <div className="bg-graphite-800/50 rounded-lg p-6 border border-graphite-700/50 mt-8 text-center">
          <p className="text-graphite-400 mb-2">{isHindi ? 'ऑर्डर ID' : 'Order ID'}</p>
          <p className="text-2xl font-bold text-saffron-400 mb-4">{orderId}</p>
          <p className="text-graphite-300">₹{amount} • {isHindi ? '4 दिन में डिलीवरी' : '4 Day Delivery'}</p>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (<Suspense fallback={<div className="text-center py-20">Loading...</div>}><OrderConfirmationContent /></Suspense>);
}
