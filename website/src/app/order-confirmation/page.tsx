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

  const googlePayLink = `upi://pay?pa=${upiId}&pn=UKPSC%20Decoded&am=${amount}&tn=Book`;
  const phonePeLink = `upi://pay?pa=${upiId}&pn=UKPSC%20Decoded&am=${amount}&tn=Book`;
  const paytmLink = `upi://pay?pa=${upiId}&pn=UKPSC%20Decoded&am=${amount}&tn=Book`;

  const whatsappMessage = isHindi
    ? `नमस्ते 👋\n\nमैंने अपना भुगतान पूरा कर दिया है।\n\nनाम: ${customerName}\nईमेल: ${customerEmail}\nफोन: ${customerPhone}\nऑर्डर ID: ${orderId}\n\nकृपया मेरा स्क्रीनशॉट संलग्न देखें।`
    : `Hi 👋\n\nI have completed my payment.\n\nName: ${customerName}\nEmail: ${customerEmail}\nPhone: ${customerPhone}\nOrder ID: ${orderId}\n\nPlease find my screenshot attached.`;

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-graphite-900 via-graphite-800 to-graphite-900 text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{isHindi ? '2 सरल चरण' : '2 Simple Steps'}</h1>
          <p className="text-xl text-graphite-300">{isHindi ? 'भुगतान पूरा करें और WhatsApp पर हमें स्क्रीनशॉट भेजें' : 'Complete the Payment and Send us a Screenshot on WhatsApp'}</p>
        </div>

        {/* STEP 1 */}
        <div className="bg-graphite-800/50 rounded-2xl p-8 border border-graphite-700/50 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-saffron-500 flex items-center justify-center font-bold">1</div>{isHindi ? 'भुगतान पूरा करें' : 'Complete Payment'}</h2>
          <p className="text-graphite-300 mb-8 text-lg">{isHindi ? '💡 UPI ID कॉपी करें, अपने भुगतान ऐप में पेस्ट करें और आसानी से भुगतान करें।' : '💡 Copy the UPI ID, paste it in your payment app and pay easily.'}</p>

          <div className="bg-graphite-700/30 rounded-lg p-6 mb-8 border border-graphite-600">
            <p className="text-sm text-graphite-400 mb-3">UPI ID</p>
            <div className="flex items-center gap-3">
              <code className="text-2xl font-bold text-saffron-400 flex-1">{upiId}</code>
              <button onClick={copyToClipboard} className="flex items-center gap-2 px-4 py-2 bg-saffron-500 hover:bg-saffron-600 rounded-lg font-bold">
                {copied ? (<><Check className="w-5 h-5" />{isHindi ? 'किया' : 'Copied'}</>) : (<><Copy className="w-5 h-5" />{isHindi ? 'कॉपी' : 'Copy'}</>)}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 mb-8">
            <p className="text-center text-graphite-800 font-bold mb-4">{isHindi ? 'या QR स्कैन करें' : 'Or Scan QR'}</p>
            <div className="flex justify-center">
              <img src="https://lh3.googleusercontent.com/d/147zvUsBQRLR4yI9_9nbMpGFadSCAn-nc=w300" alt="QR" className="w-56 h-56" />
            </div>
          </div>

          <div className="space-y-3">
            <a href={googlePayLink} className="block w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-lg font-bold text-center">💙 Google Pay</a>
            <a href={phonePeLink} className="block w-full bg-purple-600 hover:bg-purple-700 py-4 rounded-lg font-bold text-center">💜 PhonePe</a>
            <a href={paytmLink} className="block w-full bg-cyan-600 hover:bg-cyan-700 py-4 rounded-lg font-bold text-center">🔵 Paytm</a>
          </div>
        </div>

        <div className="flex justify-center mb-8"><ArrowDown className="w-8 h-8 text-saffron-400 animate-bounce" /></div>

        {/* STEP 2 */}
        <div className="bg-green-900/30 rounded-2xl p-8 border-2 border-green-600/50">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center font-bold">2</div>{isHindi ? 'WhatsApp पर भेजें' : 'Send on WhatsApp'}</h2>
          <p className="text-graphite-300 mb-8 text-lg">{isHindi ? '📸 अपना भुगतान स्क्रीनशॉट WhatsApp पर हमें भेजें।' : '📸 Send your payment screenshot to us on WhatsApp.'}</p>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full py-6 bg-green-600 hover:bg-green-700 rounded-xl font-bold text-xl">
            <MessageCircle className="w-8 h-8" />{isHindi ? 'WhatsApp पर संदेश भेजें' : 'Send Message on WhatsApp'}
          </a>
          <p className="text-green-200 text-sm mt-4 text-center">{isHindi ? '✅ हम तुरंत आपकी सहायता करेंगे' : '✅ We will assist you immediately'}</p>
        </div>

        <div className="bg-graphite-800/50 rounded-lg p-6 border border-graphite-700/50 mt-8 text-center">
          <p className="text-graphite-400 mb-2">{isHindi ? 'ऑर्डर ID' : 'Order ID'}</p>
          <p className="text-2xl font-bold text-saffron-400 mb-4">{orderId}</p>
          <p className="text-graphite-300">₹{amount} • {isHindi ? '4 दिन में डिलीवरी' : '4 Day Delivery'} • {isHindi ? 'मुफ्त शिपिंग' : 'Free Shipping'}</p>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (<Suspense fallback={<div className="text-center py-20">Loading...</div>}><OrderConfirmationContent /></Suspense>);
}
